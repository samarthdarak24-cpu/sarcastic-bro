/* ========================================================================
   Auto-Sell Service — Smart Deal Engine
   Manages auto-sell rules and automatic product listing creation
   ======================================================================== */

import prisma from "../../prisma/client";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";

export class AutoSellService {
  /**
   * Create a new auto-sell rule
   */
  static async createRule(data: {
    farmerId: string;
    productId: string;
    minPrice: number;
    quantity: number;
  }) {
    try {
      const rule = await prisma.autoSellRule.create({
        data: {
          farmerId: data.farmerId,
          productId: data.productId,
          minPrice: data.minPrice,
          quantity: data.quantity,
          isActive: true,
        },
        include: {
          product: true,
        },
      });

      // Invalidate cache
      await redis.del(`autosell:rules:${data.farmerId}`);

      // Emit Socket.IO event
      try {
        const socketService = getSocketService();
        socketService.emitNotification(data.farmerId, {
          type: 'AUTO_SELL',
          title: 'Auto-Sell Rule Created',
          message: `Auto-sell rule created for ${rule.product.name} at ₹${data.minPrice}/${rule.product.unit}`,
        });
      } catch (socketError) {
        console.error('[AutoSell] Socket.IO emission failed:', socketError);
      }

      return rule;
    } catch (error: any) {
      console.error('[AutoSell] Create rule failed:', error.message);
      throw new Error(`Failed to create auto-sell rule: ${error.message}`);
    }
  }

  /**
   * Get all rules for a farmer
   * Enhanced with Redis caching (5 min TTL)
   */
  static async getRules(farmerId: string) {
    try {
      // Try cache first
      const cacheKey = `autosell:rules:${farmerId}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[AutoSell] Cache hit for farmer ${farmerId}`);
        return cached;
      }

      const rules = await prisma.autoSellRule.findMany({
        where: { farmerId },
        include: {
          product: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Cache for 5 minutes
      await redis.set(cacheKey, rules, 300);

      return rules;
    } catch (error: any) {
      console.error('[AutoSell] Get rules failed:', error.message);
      throw new Error(`Failed to get auto-sell rules: ${error.message}`);
    }
  }

  /**
   * Update an auto-sell rule
   */
  static async updateRule(
    ruleId: string,
    farmerId: string,
    data: {
      minPrice?: number;
      quantity?: number;
      isActive?: boolean;
    }
  ) {
    try {
      // Verify ownership
      const existingRule = await prisma.autoSellRule.findUnique({
        where: { id: ruleId },
      });

      if (!existingRule) {
        throw new Error('Auto-sell rule not found');
      }

      if (existingRule.farmerId !== farmerId) {
        throw new Error('Unauthorized: You can only update your own rules');
      }

      const rule = await prisma.autoSellRule.update({
        where: { id: ruleId },
        data,
        include: {
          product: true,
        },
      });

      // Invalidate cache
      await redis.del(`autosell:rules:${farmerId}`);

      // Emit Socket.IO event
      try {
        const socketService = getSocketService();
        socketService.emitNotification(farmerId, {
          type: 'AUTO_SELL',
          title: 'Auto-Sell Rule Updated',
          message: `Auto-sell rule updated for ${rule.product.name}`,
        });
      } catch (socketError) {
        console.error('[AutoSell] Socket.IO emission failed:', socketError);
      }

      return rule;
    } catch (error: any) {
      console.error('[AutoSell] Update rule failed:', error.message);
      throw new Error(`Failed to update auto-sell rule: ${error.message}`);
    }
  }

  /**
   * Delete an auto-sell rule
   */
  static async deleteRule(ruleId: string, farmerId: string) {
    try {
      // Verify ownership
      const existingRule = await prisma.autoSellRule.findUnique({
        where: { id: ruleId },
      });

      if (!existingRule) {
        throw new Error('Auto-sell rule not found');
      }

      if (existingRule.farmerId !== farmerId) {
        throw new Error('Unauthorized: You can only delete your own rules');
      }

      await prisma.autoSellRule.delete({
        where: { id: ruleId },
      });

      // Invalidate cache
      await redis.del(`autosell:rules:${farmerId}`);

      // Emit Socket.IO event
      try {
        const socketService = getSocketService();
        socketService.emitNotification(farmerId, {
          type: 'AUTO_SELL',
          title: 'Auto-Sell Rule Deleted',
          message: 'Auto-sell rule has been deleted',
        });
      } catch (socketError) {
        console.error('[AutoSell] Socket.IO emission failed:', socketError);
      }

      return { success: true, message: 'Auto-sell rule deleted successfully' };
    } catch (error: any) {
      console.error('[AutoSell] Delete rule failed:', error.message);
      throw new Error(`Failed to delete auto-sell rule: ${error.message}`);
    }
  }

  /**
   * Evaluate all active rules and create listings when conditions are met
   * This should be called by a scheduled job (cron) every 5 minutes
   */
  static async evaluateRules() {
    try {
      console.log('[AutoSell] Starting rule evaluation...');

      // Get all active rules
      const activeRules = await prisma.autoSellRule.findMany({
        where: { isActive: true },
        include: {
          product: true,
          farmer: true,
        },
      });

      console.log(`[AutoSell] Found ${activeRules.length} active rules`);

      let triggeredCount = 0;

      for (const rule of activeRules) {
        // Get current market price for this product
        const marketPrice = await this.getMarketPrice(rule.product.name, rule.product.district);

        console.log(
          `[AutoSell] Rule ${rule.id}: Market price ₹${marketPrice} vs Min price ₹${rule.minPrice}`
        );

        // Check if market price meets or exceeds minimum price
        if (marketPrice >= rule.minPrice) {
          // Check if product has enough quantity
          if (rule.product.quantity >= rule.quantity) {
            // Create or update product listing
            await prisma.product.update({
              where: { id: rule.productId },
              data: {
                price: marketPrice,
                isActive: true,
              },
            });

            // Emit Socket.IO event to farmer
            try {
              const socketService = getSocketService();
              socketService.emitNotification(rule.farmerId, {
                type: 'AUTO_SELL',
                title: 'Auto-Sell Triggered!',
                message: `Your ${rule.product.name} is now listed at ₹${marketPrice}/${rule.product.unit} (Market price reached your target)`,
                metadata: {
                  ruleId: rule.id,
                  productId: rule.productId,
                  marketPrice,
                  minPrice: rule.minPrice,
                },
              });
            } catch (socketError) {
              console.error('[AutoSell] Socket.IO emission failed:', socketError);
            }

            triggeredCount++;
            console.log(`[AutoSell] Rule ${rule.id} triggered for ${rule.product.name}`);
          } else {
            console.log(
              `[AutoSell] Rule ${rule.id} not triggered: Insufficient quantity (${rule.product.quantity} < ${rule.quantity})`
            );
          }
        }
      }

      console.log(`[AutoSell] Evaluation complete. ${triggeredCount} rules triggered.`);

      return {
        success: true,
        evaluatedRules: activeRules.length,
        triggeredRules: triggeredCount,
      };
    } catch (error: any) {
      console.error('[AutoSell] Rule evaluation failed:', error.message);
      throw new Error(`Failed to evaluate auto-sell rules: ${error.message}`);
    }
  }

  /**
   * Get current market price for a product
   * This is a simplified implementation - in production, this would fetch from a real market data API
   */
  private static async getMarketPrice(productName: string, district: string): Promise<number> {
    // Try cache first (market prices cached for 5 minutes)
    const cacheKey = `market:price:${productName}:${district}`;
    const cached = await redis.get<number>(cacheKey);
    if (cached) {
      return cached;
    }

    // Simulate market price fetching
    // In production, this would call an external API like Agmarknet
    const basePrice: any = {
      Tomato: 25,
      Wheat: 2200,
      Onion: 18,
      Potato: 15,
      Rice: 2500,
      Corn: 1800,
    };

    const price = basePrice[productName] || 50;
    // Add some randomness to simulate market fluctuations
    const fluctuation = (Math.random() - 0.5) * 0.2; // ±10%
    const marketPrice = Math.round(price * (1 + fluctuation));

    // Cache for 5 minutes
    await redis.set(cacheKey, marketPrice, 300);

    return marketPrice;
  }

  /**
   * Get auto-sell statistics for a farmer
   */
  static async getStatistics(farmerId: string) {
    try {
      const [totalRules, activeRules, triggeredToday] = await Promise.all([
        prisma.autoSellRule.count({
          where: { farmerId },
        }),
        prisma.autoSellRule.count({
          where: { farmerId, isActive: true },
        }),
        // Count products that were updated today (proxy for triggered rules)
        prisma.product.count({
          where: {
            farmerId,
            updatedAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
      ]);

      return {
        totalRules,
        activeRules,
        inactiveRules: totalRules - activeRules,
        triggeredToday,
      };
    } catch (error: any) {
      console.error('[AutoSell] Get statistics failed:', error.message);
      throw new Error(`Failed to get auto-sell statistics: ${error.message}`);
    }
  }
}
