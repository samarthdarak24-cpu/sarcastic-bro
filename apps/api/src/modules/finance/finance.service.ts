import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Service to handle finance business logic.
 */
export class FinanceService {
  /**
   * Get payments for a specific user.
   */
  static async getUserPayments(userId: string) {
    return prisma.payment.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Calculate a dynamic credit score for a farmer.
   * HEURISTIC: Based on successful orders, ratings, and payment history.
   */
  static async calculateCreditScore(farmerId: string) {
    const orders = await prisma.order.count({
      where: { farmerId, status: "DELIVERED" }
    });

    const reviews = await prisma.review.aggregate({
      where: { targetId: farmerId },
      _avg: { rating: true }
    });

    const successfulPayments = await prisma.payment.count({
      where: { sellerId: farmerId, status: "COMPLETED" }
    });

    // Base score 300, max 900
    let score = 300;
    score += Math.min(orders * 10, 200); // Up to 200 points for orders
    score += Math.min((reviews._avg.rating || 0) * 80, 400); // Up to 400 points for ratings
    
    return {
      userId: farmerId,
      score: Math.round(score),
      totalOrders: orders,
      averageRating: reviews._avg.rating || 0,
      paymentHealth: successfulPayments > 0 ? "EXCELLENT" : "GOOD",
      updatedAt: new Date()
    };
  }

  /**
   * Check if a user is eligible for a loan.
   */
  static async checkLoanEligibility(userId: string) {
    const credit = await this.calculateCreditScore(userId);
    const isEligible = credit.score > 600;
    
    return {
      userId,
      isEligible,
      creditScore: credit.score,
      maxAmount: isEligible ? Math.round(credit.score * 100) : 0,
      terms: "6 months at 4% interest",
      reason: isEligible ? "High order volume and positive ratings." : "Build your order history to improve eligibility."
    };
  }
}
