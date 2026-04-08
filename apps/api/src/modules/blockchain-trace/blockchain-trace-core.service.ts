/* ========================================================================
   Blockchain Trace Core Service — Supply Chain Traceability
   Manages blockchain trace events with hash chain linking
   ======================================================================== */

import prisma from "../../prisma/client";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";
import crypto from "crypto";

export class BlockchainTraceCoreService {
  /**
   * Create a new trace event
   * Implements hash chain linking with prevHash
   */
  static async createTraceEvent(data: {
    productId: string;
    farmerId: string;
    eventType: 'SEED' | 'CULTIVATION' | 'HARVEST' | 'QUALITY' | 'LOGISTICS' | 'DELIVERED';
    location?: string;
    qualityGrade?: string;
    metadata?: any;
  }) {
    try {
      // Get the last trace event for this product to link the chain
      const lastTrace = await prisma.blockchainTrace.findFirst({
        where: { productId: data.productId },
        orderBy: { blockIndex: 'desc' },
      });

      const prevHash = lastTrace?.dataHash || '0x0000000000000000000000000000000000000000000000000000000000000000';
      const blockIndex = (lastTrace?.blockIndex || 0) + 1;

      // Calculate hash of current event data
      const eventPayload = JSON.stringify({
        productId: data.productId,
        farmerId: data.farmerId,
        eventType: data.eventType,
        location: data.location,
        qualityGrade: data.qualityGrade,
        metadata: data.metadata,
        timestamp: new Date().toISOString(),
        prevHash,
        blockIndex,
      });

      const dataHash = crypto.createHash('sha256').update(eventPayload).digest('hex');
      const txHash = '0x' + crypto.randomBytes(32).toString('hex');

      // Create trace event
      const trace = await prisma.blockchainTrace.create({
        data: {
          productId: data.productId,
          farmerId: data.farmerId,
          eventType: data.eventType,
          dataHash,
          prevHash,
          blockIndex,
          location: data.location,
          qualityGrade: data.qualityGrade,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
          txHash,
          verified: true,
        },
        include: {
          product: true,
          farmer: true,
        },
      });

      // Invalidate cache
      await redis.delPattern(`blockchain:trace:${data.productId}*`);

      // Emit Socket.IO event
      try {
        const socketService = getSocketService();
        socketService.emitNotification(data.farmerId, {
          type: 'BLOCKCHAIN',
          title: 'Trace Event Recorded',
          message: `${data.eventType} event recorded for ${trace.product.name}`,
          metadata: {
            traceId: trace.id,
            eventType: data.eventType,
            txHash,
          },
        });
      } catch (socketError) {
        console.error('[BlockchainTrace] Socket.IO emission failed:', socketError);
      }

      return trace;
    } catch (error: any) {
      console.error('[BlockchainTrace] Create trace event failed:', error.message);
      throw new Error(`Failed to create trace event: ${error.message}`);
    }
  }

  /**
   * Get trace history for a product
   * Enhanced with Redis caching (10 min TTL)
   */
  static async getTraceHistory(productId: string) {
    try {
      // Try cache first
      const cacheKey = `blockchain:trace:${productId}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[BlockchainTrace] Cache hit for product ${productId}`);
        return cached;
      }

      const traces = await prisma.blockchainTrace.findMany({
        where: { productId },
        include: {
          farmer: {
            select: {
              id: true,
              name: true,
              district: true,
              state: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },
        orderBy: { blockIndex: 'asc' },
      });

      // Cache for 10 minutes
      await redis.set(cacheKey, traces, 600);

      return traces;
    } catch (error: any) {
      console.error('[BlockchainTrace] Get trace history failed:', error.message);
      throw new Error(`Failed to get trace history: ${error.message}`);
    }
  }

  /**
   * Verify integrity of the blockchain trace chain
   */
  static async verifyIntegrity(productId: string) {
    try {
      const traces = await prisma.blockchainTrace.findMany({
        where: { productId },
        orderBy: { blockIndex: 'asc' },
      });

      if (traces.length === 0) {
        return {
          valid: true,
          message: 'No trace events found',
          traces: [],
        };
      }

      const issues: any[] = [];

      for (let i = 0; i < traces.length; i++) {
        const trace = traces[i];

        // Verify block index sequence
        if (trace.blockIndex !== i + 1) {
          issues.push({
            traceId: trace.id,
            issue: 'Block index mismatch',
            expected: i + 1,
            actual: trace.blockIndex,
          });
        }

        // Verify hash chain linking
        if (i > 0) {
          const prevTrace = traces[i - 1];
          if (trace.prevHash !== prevTrace.dataHash) {
            issues.push({
              traceId: trace.id,
              issue: 'Hash chain broken',
              expected: prevTrace.dataHash,
              actual: trace.prevHash,
            });
          }
        } else {
          // First trace should have genesis hash
          if (trace.prevHash !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
            issues.push({
              traceId: trace.id,
              issue: 'Invalid genesis hash',
              expected: '0x0000000000000000000000000000000000000000000000000000000000000000',
              actual: trace.prevHash,
            });
          }
        }
      }

      return {
        valid: issues.length === 0,
        message: issues.length === 0 ? 'Blockchain integrity verified' : 'Integrity issues detected',
        totalTraces: traces.length,
        issues,
        traces,
      };
    } catch (error: any) {
      console.error('[BlockchainTrace] Verify integrity failed:', error.message);
      throw new Error(`Failed to verify integrity: ${error.message}`);
    }
  }

  /**
   * Get trace statistics for a farmer
   */
  static async getStatistics(farmerId: string) {
    try {
      const [totalTraces, tracesByType, recentTraces] = await Promise.all([
        prisma.blockchainTrace.count({
          where: { farmerId },
        }),
        prisma.blockchainTrace.groupBy({
          by: ['eventType'],
          where: { farmerId },
          _count: true,
        }),
        prisma.blockchainTrace.count({
          where: {
            farmerId,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
      ]);

      return {
        totalTraces,
        tracesByType: tracesByType.reduce((acc: any, item: any) => {
          acc[item.eventType] = item._count;
          return acc;
        }, {}),
        recentTraces,
      };
    } catch (error: any) {
      console.error('[BlockchainTrace] Get statistics failed:', error.message);
      throw new Error(`Failed to get trace statistics: ${error.message}`);
    }
  }

  /**
   * Get supply chain journey visualization data
   */
  static async getSupplyChainJourney(productId: string) {
    try {
      const traces = await this.getTraceHistory(productId);

      const journey = traces.map((trace: any) => ({
        id: trace.id,
        eventType: trace.eventType,
        location: trace.location,
        qualityGrade: trace.qualityGrade,
        timestamp: trace.createdAt,
        farmer: trace.farmer.name,
        district: trace.farmer.district,
        verified: trace.verified,
        txHash: trace.txHash,
        metadata: trace.metadata ? JSON.parse(trace.metadata) : null,
      }));

      return {
        productId,
        productName: traces[0]?.product.name,
        totalEvents: traces.length,
        journey,
        verified: traces.every((t: any) => t.verified),
      };
    } catch (error: any) {
      console.error('[BlockchainTrace] Get supply chain journey failed:', error.message);
      throw new Error(`Failed to get supply chain journey: ${error.message}`);
    }
  }
}
