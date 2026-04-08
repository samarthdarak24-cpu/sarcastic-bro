import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
  async getBehaviorAnalytics(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await prisma.behaviorEvent.findMany({
      where: {
        userId,
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'asc' }
    });

    // Aggregate by action
    const actionCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const dailyActivity: Record<string, number> = {};

    events.forEach(event => {
      actionCounts[event.action] = (actionCounts[event.action] || 0) + 1;
      categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
      
      const day = event.timestamp.toISOString().split('T')[0];
      dailyActivity[day] = (dailyActivity[day] || 0) + 1;
    });

    return {
      totalEvents: events.length,
      actionCounts,
      categoryCounts,
      dailyActivity,
      mostActiveDay: Object.entries(dailyActivity).sort((a, b) => b[1] - a[1])[0]?.[0],
      topAction: Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    };
  }

  async getDashboardAnalytics(userId: string) {
    const [orders, totalSpent, reputation, recentActivity] = await Promise.all([
      prisma.order.count({ where: { buyerId: userId } }),
      prisma.order.aggregate({
        where: { buyerId: userId, status: 'DELIVERED' },
        _sum: { totalPrice: true }
      }),
      prisma.buyerReputation.findUnique({ where: { userId } }),
      prisma.behaviorEvent.count({
        where: {
          userId,
          timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    const suppliers = await prisma.user.count({
      where: {
        role: 'FARMER',
        ordersAsFarmer: {
          some: { buyerId: userId }
        }
      }
    });

    return {
      totalOrders: orders,
      totalSpent: totalSpent._sum.totalPrice || 0,
      activeSuppliers: suppliers,
      reputationScore: reputation?.score || 100,
      recentActivity,
      trustScore: reputation?.trustScore || 5.0
    };
  }

  async getInsights(userId: string) {
    const [behavior, orders, reputation] = await Promise.all([
      this.getBehaviorAnalytics(userId, 30),
      prisma.order.findMany({
        where: { buyerId: userId },
        include: { product: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.buyerReputation.findUnique({ where: { userId } })
    ]);

    // Generate insights
    const insights = [];

    if (behavior.totalEvents < 10) {
      insights.push({
        type: 'engagement',
        title: 'Low Activity',
        message: 'Explore more suppliers and products to find better deals',
        priority: 'medium'
      });
    }

    if (reputation && reputation.score < 80) {
      insights.push({
        type: 'reputation',
        title: 'Improve Your Reputation',
        message: 'Make timely payments to boost your buyer score',
        priority: 'high'
      });
    }

    const categoryFrequency: Record<string, number> = {};
    orders.forEach(order => {
      categoryFrequency[order.product.category] = (categoryFrequency[order.product.category] || 0) + 1;
    });

    const topCategory = Object.entries(categoryFrequency).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      insights.push({
        type: 'recommendation',
        title: 'Bulk Discount Available',
        message: `You frequently buy ${topCategory[0]}. Consider bulk orders for better prices`,
        priority: 'low'
      });
    }

    return {
      insights,
      behavior,
      orderStats: {
        total: orders.length,
        categories: categoryFrequency
      }
    };
  }
}
