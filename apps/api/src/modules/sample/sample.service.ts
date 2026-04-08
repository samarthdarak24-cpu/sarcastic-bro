/* ========================================================================
   Sample Request Service — Sample Request Management
   Manages sample requests, approvals, and shipment tracking
   ======================================================================== */

import prisma from "../../prisma/client";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";

export class SampleService {
  /**
   * Create a sample request
   * Enhanced with Socket.IO notification to farmer
   */
  static async createRequest(data: {
    requesterId: string;
    productId: string;
    quantity: number;
    message?: string;
    shippingAddress: string;
  }) {
    try {
      // Verify product exists
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
        select: {
          id: true,
          name: true,
          farmerId: true,
          farmer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // Check if requester is not the farmer
      if (data.requesterId === product.farmerId) {
        throw new Error('Cannot request sample from your own product');
      }

      // Create sample request
      const sampleRequest = await prisma.sampleRequest.create({
        data: {
          requesterId: data.requesterId,
          productId: data.productId,
          quantity: data.quantity,
          message: data.message,
          shippingAddress: data.shippingAddress,
          status: 'PENDING',
        },
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              imageUrls: true,
              farmerId: true,
            },
          },
        },
      });

      // Invalidate cache
      await redis.delPattern(`samples:farmer:${product.farmerId}*`);
      await redis.delPattern(`samples:requester:${data.requesterId}*`);

      // Emit Socket.IO event to farmer
      try {
        const socketService = getSocketService();
        socketService.emitNotification(product.farmerId, {
          type: 'SAMPLE_REQUEST',
          title: 'New Sample Request',
          message: `${sampleRequest.requester.name} requested a sample of ${product.name}`,
          metadata: {
            sampleRequestId: sampleRequest.id,
            requesterId: data.requesterId,
            requesterName: sampleRequest.requester.name,
            productId: data.productId,
            productName: product.name,
            quantity: data.quantity,
          },
        });
      } catch (socketError) {
        console.error('[Sample] Socket.IO emission failed:', socketError);
      }

      return sampleRequest;
    } catch (error: any) {
      console.error('[Sample] Create request failed:', error.message);
      throw new Error(`Failed to create sample request: ${error.message}`);
    }
  }

  /**
   * Get sample requests for a farmer
   * Enhanced with Redis caching (5 min TTL)
   */
  static async getFarmerRequests(farmerId: string, status?: string) {
    try {
      // Try cache first
      const cacheKey = `samples:farmer:${farmerId}:${status || 'all'}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[Sample] Farmer requests cache hit for farmer ${farmerId}`);
        return cached;
      }

      // Get farmer's products
      const products = await prisma.product.findMany({
        where: { farmerId },
        select: { id: true },
      });

      const productIds = products.map(p => p.id);

      // Get sample requests
      const requests = await prisma.sampleRequest.findMany({
        where: {
          productId: { in: productIds },
          ...(status && { status }),
        },
        include: {
          requester: {
            select: {
              id: true,
              name: true,
              phone: true,
              avatarUrl: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              imageUrls: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Cache for 5 minutes
      await redis.set(cacheKey, requests, 300);

      return requests;
    } catch (error: any) {
      console.error('[Sample] Get farmer requests failed:', error.message);
      throw new Error(`Failed to get farmer requests: ${error.message}`);
    }
  }

  /**
   * Get sample requests for a requester
   * Enhanced with Redis caching (5 min TTL)
   */
  static async getRequesterRequests(requesterId: string, status?: string) {
    try {
      // Try cache first
      const cacheKey = `samples:requester:${requesterId}:${status || 'all'}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[Sample] Requester requests cache hit for requester ${requesterId}`);
        return cached;
      }

      const requests = await prisma.sampleRequest.findMany({
        where: {
          requesterId,
          ...(status && { status }),
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrls: true,
              farmer: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Cache for 5 minutes
      await redis.set(cacheKey, requests, 300);

      return requests;
    } catch (error: any) {
      console.error('[Sample] Get requester requests failed:', error.message);
      throw new Error(`Failed to get requester requests: ${error.message}`);
    }
  }

  /**
   * Approve a sample request
   * Enhanced with Socket.IO notification to requester
   */
  static async approveRequest(sampleRequestId: string, farmerId: string) {
    try {
      // Verify sample request exists and belongs to farmer
      const sampleRequest = await prisma.sampleRequest.findUnique({
        where: { id: sampleRequestId },
        include: {
          product: {
            select: {
              farmerId: true,
              name: true,
            },
          },
          requester: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!sampleRequest) {
        throw new Error('Sample request not found');
      }

      if (sampleRequest.product.farmerId !== farmerId) {
        throw new Error('Unauthorized: You can only approve requests for your own products');
      }

      if (sampleRequest.status !== 'PENDING') {
        throw new Error('Sample request is not pending');
      }

      // Update status
      const updated = await prisma.sampleRequest.update({
        where: { id: sampleRequestId },
        data: {
          status: 'APPROVED',
          updatedAt: new Date(),
        },
        include: {
          requester: {
            select: {
              id: true,
              name: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Invalidate cache
      await redis.delPattern(`samples:farmer:${farmerId}*`);
      await redis.delPattern(`samples:requester:${sampleRequest.requesterId}*`);

      // Emit Socket.IO event to requester
      try {
        const socketService = getSocketService();
        socketService.emitNotification(sampleRequest.requesterId, {
          type: 'SAMPLE_APPROVED',
          title: 'Sample Request Approved',
          message: `Your sample request for ${sampleRequest.product.name} has been approved`,
          metadata: {
            sampleRequestId,
            productId: sampleRequest.productId,
            productName: sampleRequest.product.name,
          },
        });
      } catch (socketError) {
        console.error('[Sample] Socket.IO emission failed:', socketError);
      }

      return updated;
    } catch (error: any) {
      console.error('[Sample] Approve request failed:', error.message);
      throw new Error(`Failed to approve sample request: ${error.message}`);
    }
  }

  /**
   * Ship a sample
   * Enhanced with Socket.IO notification to requester
   */
  static async shipSample(sampleRequestId: string, farmerId: string, trackingNumber?: string) {
    try {
      // Verify sample request exists and belongs to farmer
      const sampleRequest = await prisma.sampleRequest.findUnique({
        where: { id: sampleRequestId },
        include: {
          product: {
            select: {
              farmerId: true,
              name: true,
            },
          },
          requester: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!sampleRequest) {
        throw new Error('Sample request not found');
      }

      if (sampleRequest.product.farmerId !== farmerId) {
        throw new Error('Unauthorized: You can only ship samples for your own products');
      }

      if (sampleRequest.status !== 'APPROVED') {
        throw new Error('Sample request must be approved before shipping');
      }

      // Update status
      const updated = await prisma.sampleRequest.update({
        where: { id: sampleRequestId },
        data: {
          status: 'SHIPPED',
          updatedAt: new Date(),
        },
        include: {
          requester: {
            select: {
              id: true,
              name: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Invalidate cache
      await redis.delPattern(`samples:farmer:${farmerId}*`);
      await redis.delPattern(`samples:requester:${sampleRequest.requesterId}*`);

      // Emit Socket.IO event to requester
      try {
        const socketService = getSocketService();
        socketService.emitNotification(sampleRequest.requesterId, {
          type: 'SAMPLE_SHIPPED',
          title: 'Sample Shipped',
          message: `Your sample of ${sampleRequest.product.name} has been shipped`,
          metadata: {
            sampleRequestId,
            productId: sampleRequest.productId,
            productName: sampleRequest.product.name,
            trackingNumber,
          },
        });
      } catch (socketError) {
        console.error('[Sample] Socket.IO emission failed:', socketError);
      }

      return updated;
    } catch (error: any) {
      console.error('[Sample] Ship sample failed:', error.message);
      throw new Error(`Failed to ship sample: ${error.message}`);
    }
  }

  /**
   * Mark sample as received
   * Enhanced with Socket.IO notification to farmer
   */
  static async markReceived(sampleRequestId: string, requesterId: string) {
    try {
      // Verify sample request exists and belongs to requester
      const sampleRequest = await prisma.sampleRequest.findUnique({
        where: { id: sampleRequestId },
        include: {
          product: {
            select: {
              farmerId: true,
              name: true,
            },
          },
        },
      });

      if (!sampleRequest) {
        throw new Error('Sample request not found');
      }

      if (sampleRequest.requesterId !== requesterId) {
        throw new Error('Unauthorized: You can only mark your own requests as received');
      }

      if (sampleRequest.status !== 'SHIPPED') {
        throw new Error('Sample must be shipped before marking as received');
      }

      // Update status
      const updated = await prisma.sampleRequest.update({
        where: { id: sampleRequestId },
        data: {
          status: 'RECEIVED',
          updatedAt: new Date(),
        },
      });

      // Invalidate cache
      await redis.delPattern(`samples:farmer:${sampleRequest.product.farmerId}*`);
      await redis.delPattern(`samples:requester:${requesterId}*`);

      // Emit Socket.IO event to farmer
      try {
        const socketService = getSocketService();
        socketService.emitNotification(sampleRequest.product.farmerId, {
          type: 'SAMPLE_RECEIVED',
          title: 'Sample Received',
          message: `Your sample of ${sampleRequest.product.name} has been received`,
          metadata: {
            sampleRequestId,
            productId: sampleRequest.productId,
            productName: sampleRequest.product.name,
          },
        });
      } catch (socketError) {
        console.error('[Sample] Socket.IO emission failed:', socketError);
      }

      return updated;
    } catch (error: any) {
      console.error('[Sample] Mark received failed:', error.message);
      throw new Error(`Failed to mark sample as received: ${error.message}`);
    }
  }
}
