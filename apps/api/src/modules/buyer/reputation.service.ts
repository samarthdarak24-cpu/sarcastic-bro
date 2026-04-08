import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BuyerReputationService {
  async getReputation(userId: string) {
    let reputation = await prisma.buyerReputation.findUnique({
      where: { userId }
    });

    if (!reputation) {
      reputation = await prisma.buyerReputation.create({
        data: { userId }
      });
    }

    return reputation;
  }

  async getReputationHistory(userId: string, page: number = 1, limit: number = 20) {
    const reputation = await this.getReputation(userId);
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      prisma.reputationHistory.findMany({
        where: { reputationId: reputation.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.reputationHistory.count({ where: { reputationId: reputation.id } })
    ]);

    return {
      history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getReputationBreakdown(userId: string) {
    const reputation = await this.getReputation(userId);
    
    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      select: {
        status: true,
        paymentStatus: true,
        createdAt: true,
        totalPrice: true
      }
    });

    const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;
    const onTimePayments = orders.filter(o => o.paymentStatus === 'COMPLETED').length;

    return {
      overall: reputation.score,
      trustScore: reputation.trustScore,
      breakdown: {
        paymentReliability: (onTimePayments / Math.max(orders.length, 1)) * 100,
        orderCompletion: (completedOrders / Math.max(orders.length, 1)) * 100,
        cancellationRate: (cancelledOrders / Math.max(orders.length, 1)) * 100,
        averageOrderValue: reputation.averageOrderValue
      },
      stats: {
        totalPurchases: reputation.totalPurchases,
        onTimePayments: reputation.onTimePayments,
        latePayments: reputation.latePayments,
        disputes: reputation.disputes
      }
    };
  }

  async updateReputation(userId: string, action: string, change: number, reason?: string) {
    const reputation = await this.getReputation(userId);
    const scoreBefore = reputation.score;
    const scoreAfter = Math.max(0, Math.min(100, scoreBefore + change));

    await prisma.$transaction([
      prisma.buyerReputation.update({
        where: { userId },
        data: { score: scoreAfter }
      }),
      prisma.reputationHistory.create({
        data: {
          reputationId: reputation.id,
          action,
          scoreBefore,
          scoreAfter,
          change,
          reason
        }
      })
    ]);

    return scoreAfter;
  }
}
