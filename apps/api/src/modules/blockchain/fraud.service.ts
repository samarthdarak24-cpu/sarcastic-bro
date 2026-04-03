/* ========================================================================
   Fraud Detection Service — Rule-Based MVP
   Detects abnormal orders, fake transactions, and suspicious patterns.
   ======================================================================== */

import prisma from "../../prisma/client";

interface FraudSignal {
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  metadata?: Record<string, any>;
}

export class FraudDetectionService {
  /**
   * Analyse an order for fraud signals.
   * Returns an array of risk flags.
   */
  static async analyzeOrder(orderId: string): Promise<{
    orderId: string;
    riskScore: number;
    riskLevel: string;
    signals: FraudSignal[];
  }> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: { select: { id: true, name: true, createdAt: true, totalOrders: true, cancellationRate: true, reputationScore: true } },
        farmer: { select: { id: true, name: true, reputationScore: true } },
        product: { select: { id: true, name: true, price: true, quantity: true } },
      },
    });

    if (!order) return { orderId, riskScore: 0, riskLevel: "UNKNOWN", signals: [] };

    const signals: FraudSignal[] = [];

    // ─── Rule 1: Unusually large quantity ──────────────────────────────
    if (order.quantity > 1000) {
      signals.push({
        type: "LARGE_QUANTITY",
        severity: "MEDIUM",
        message: `Order quantity (${order.quantity}) is unusually high`,
        metadata: { quantity: order.quantity },
      });
    }

    // ─── Rule 2: New buyer with large order ───────────────────────────
    const buyerAge = Date.now() - new Date(order.buyer.createdAt).getTime();
    const buyerAgeDays = buyerAge / (1000 * 60 * 60 * 24);
    if (buyerAgeDays < 7 && order.totalPrice > 50000) {
      signals.push({
        type: "NEW_BUYER_LARGE_ORDER",
        severity: "HIGH",
        message: `New buyer (${Math.round(buyerAgeDays)} days old) placing ₹${order.totalPrice} order`,
        metadata: { buyerAgeDays: Math.round(buyerAgeDays), totalPrice: order.totalPrice },
      });
    }

    // ─── Rule 3: High cancellation rate ───────────────────────────────
    if (order.buyer.cancellationRate > 0.3) {
      signals.push({
        type: "HIGH_CANCELLATION_RATE",
        severity: "MEDIUM",
        message: `Buyer has ${Math.round(order.buyer.cancellationRate * 100)}% cancellation rate`,
        metadata: { rate: order.buyer.cancellationRate },
      });
    }

    // ─── Rule 4: Low reputation buyer ──────────────────────────────────
    if (order.buyer.reputationScore < 30) {
      signals.push({
        type: "LOW_REPUTATION",
        severity: "HIGH",
        message: `Buyer reputation score is critically low (${order.buyer.reputationScore})`,
        metadata: { score: order.buyer.reputationScore },
      });
    }

    // ─── Rule 5: Price anomaly ─────────────────────────────────────────
    if (order.product && order.totalPrice > order.product.price * order.quantity * 2) {
      signals.push({
        type: "PRICE_ANOMALY",
        severity: "CRITICAL",
        message: `Total price (₹${order.totalPrice}) is more than 2x expected (₹${order.product.price * order.quantity})`,
        metadata: { expected: order.product.price * order.quantity, actual: order.totalPrice },
      });
    }

    // ─── Rule 6: Rapid-fire orders from same buyer ─────────────────────
    const recentOrders = await prisma.order.count({
      where: {
        buyerId: order.buyerId,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }, // last hour
      },
    });
    if (recentOrders > 10) {
      signals.push({
        type: "RAPID_FIRE_ORDERS",
        severity: "HIGH",
        message: `Buyer placed ${recentOrders} orders in the last hour`,
        metadata: { count: recentOrders },
      });
    }

    // ─── Calculate composite risk score ────────────────────────────────
    const severityWeights = { LOW: 5, MEDIUM: 15, HIGH: 30, CRITICAL: 50 };
    const riskScore = Math.min(100, signals.reduce((sum, s) => sum + severityWeights[s.severity], 0));

    let riskLevel = "LOW";
    if (riskScore >= 60) riskLevel = "CRITICAL";
    else if (riskScore >= 40) riskLevel = "HIGH";
    else if (riskScore >= 20) riskLevel = "MEDIUM";

    return { orderId, riskScore, riskLevel, signals };
  }

  /**
   * Batch scan all pending orders for fraud.
   */
  static async scanPendingOrders() {
    const pending = await prisma.order.findMany({
      where: { status: "PENDING" },
      select: { id: true },
      take: 50,
    });

    const results = [];
    for (const order of pending) {
      const analysis = await this.analyzeOrder(order.id);
      if (analysis.riskScore > 0) {
        results.push(analysis);
      }
    }

    return {
      scannedCount: pending.length,
      flaggedCount: results.length,
      flaggedOrders: results,
    };
  }
}
