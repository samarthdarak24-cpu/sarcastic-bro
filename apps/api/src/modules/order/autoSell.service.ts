import { prisma } from "../../prisma/client";
import { OrderService } from "./order.service";

/**
 * Service to handle automatic selling based on farmer rules.
 */
export class AutoSellService {
  /**
   * Main matching engine.
   * Scans active rules and creates orders if price conditions are met.
   */
  static async processAutoSell() {
    console.log("[AutoSell] Checking market matches...");
    
    // 1. Fetch active rules
    const rules = await prisma.autoSellRule.findMany({
      where: { isActive: true },
      include: {
        farmer: true,
        product: true
      }
    });

    for (const rule of rules) {
      // 2. Find matching products from OTHER farmers (Wait, no, Auto-sell is for the FARMER'S own product)
      // Actually, Auto-Sell logic should be:
      // If a BUYER creates a PROPOSAL or ORDER that matches the farmer's Auto-Sell rule,
      // we automatically accept/execute it.
      
      // Let's refine the logic:
      // Find "PENDING" proposals for this product where price >= rule.minPrice
      const matchingProposals = await prisma.proposal.findMany({
        where: {
          productId: rule.productId,
          status: "PENDING",
          pricePerUnit: { gte: rule.minPrice },
          quantity: { lte: rule.quantity } // Farmer can fulfill the whole request
        }
      });

      for (const proposal of matchingProposals) {
        console.log(`[AutoSell] Match found! Rule for ${rule.product.name} matched proposal from ${proposal.senderId}`);
        
        try {
          // 3. Automatically create an order
          await prisma.$transaction(async (tx) => {
            // Create the order
            const order = await tx.order.create({
              data: {
                buyerId: proposal.senderId,
                farmerId: rule.farmerId,
                productId: rule.productId,
                quantity: proposal.quantity,
                totalPrice: proposal.totalPrice,
                status: "CONFIRMED", // Auto-confirmed
                notes: "Automatically executed by Smart Deal Engine",
                confirmedAt: new Date()
              }
            });

            // Update proposal status
            await tx.proposal.update({
              where: { id: proposal.id },
              data: { status: "ACCEPTED" }
            });

            // Create notification for farmer
            await tx.notification.create({
              data: {
                userId: rule.farmerId,
                type: "ORDER",
                title: "Auto-Sell Executed! ⚡",
                message: `Your rule for ${rule.product.name} triggered a sale of ₹${proposal.totalPrice}.`,
                metadata: JSON.stringify({ orderId: order.id })
              }
            });

            // Create notification for buyer
            await tx.notification.create({
              data: {
                userId: proposal.senderId,
                type: "ORDER",
                title: "Order Auto-Confirmed",
                message: `The farmer's Smart Deal Engine automatically accepted your offer for ${rule.product.name}.`,
                metadata: JSON.stringify({ orderId: order.id })
              }
            });
          });
        } catch (err) {
          console.error("[AutoSell] Error executing auto-sell transaction:", err);
        }
      }
    }
  }

  static async createRule(farmerId: string, data: any) {
    return prisma.autoSellRule.create({
      data: {
        farmerId,
        productId: data.productId,
        minPrice: data.minPrice,
        quantity: data.quantity,
        isActive: true
      }
    });
  }

  static async getRules(farmerId: string) {
    return prisma.autoSellRule.findMany({
      where: { farmerId },
      include: { product: true }
    });
  }

  static async deleteRule(farmerId: string, ruleId: string) {
    return prisma.autoSellRule.deleteMany({
      where: { id: ruleId, farmerId }
    });
  }
}
