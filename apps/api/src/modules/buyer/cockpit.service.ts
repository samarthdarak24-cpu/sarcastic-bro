import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CockpitService {
  async getCockpitData(userId: string) {
    // Get KPIs
    const [orders, bids, escrows, preBookings] = await Promise.all([
      prisma.order.findMany({
        where: { buyerId: userId }
      }),
      prisma.bid.findMany({
        where: { buyerId: userId }
      }),
      prisma.escrowOrder.findMany({
        where: { buyerId: userId }
      }),
      prisma.preBooking.findMany({
        where: { buyerId: userId }
      })
    ]);

    // Calculate KPIs
    const kpis = {
      activeOrders: orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length,
      pendingBids: bids.filter(b => b.status === 'ACTIVE').length,
      totalSpent: orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + o.totalPrice, 0),
      savingsAchieved: this.calculateSavings(orders),
      activeEscrows: escrows.filter(e => e.status === 'HELD').length,
      preBookingsActive: preBookings.filter(p => p.status === 'PENDING' || p.status === 'CONFIRMED').length
    };

    // Get recent activity
    const recentActivity = await this.getRecentActivity(userId);

    // Get live prices
    const livePrices = await this.getLivePrices();

    // Get notifications
    const notifications = await this.getNotifications(userId);

    // Get performance metrics
    const metrics = {
      orderSuccessRate: this.calculateSuccessRate(orders),
      avgDeliveryTime: this.calculateAvgDeliveryTime(orders),
      supplierCount: await this.getActiveSupplierCount(userId),
      categoryDistribution: this.getCategoryDistribution(orders)
    };

    return {
      kpis,
      recentActivity,
      livePrices,
      notifications,
      metrics,
      lastUpdated: new Date()
    };
  }

  private calculateSavings(orders: any[]): number {
    // Calculate savings based on negotiated prices vs market average
    // This is a simplified calculation
    const avgMarketPrice = 100; // Mock average market price
    const actualSpent = orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const potentialSpent = orders.length * avgMarketPrice;
    return Math.max(0, potentialSpent - actualSpent);
  }

  private async getRecentActivity(userId: string) {
    const activities = [];

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        farmer: { select: { name: true } }
      }
    });

    recentOrders.forEach(order => {
      activities.push({
        type: 'order',
        title: `Order placed with ${order.farmer.name}`,
        description: `₹${order.totalPrice} - ${order.status}`,
        timestamp: order.createdAt,
        icon: 'shopping-cart'
      });
    });

    // Get recent bids
    const recentBids = await prisma.bid.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    recentBids.forEach(bid => {
      activities.push({
        type: 'bid',
        title: `Bid placed: ₹${bid.bidAmount}`,
        description: `Status: ${bid.status}`,
        timestamp: bid.createdAt,
        icon: 'trending-up'
      });
    });

    // Sort by timestamp
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  }

  async getLivePrices() {
    // Mock live market prices for different crops
    const crops = [
      { crop: "Tomato", price: 45, change: 2.5, volume: "1.2T", trend: "up" },
      { crop: "Onion", price: 32, change: -1.8, volume: "850kg", trend: "down" },
      { crop: "Wheat", price: 28, change: 0.5, volume: "2.5T", trend: "up" },
      { crop: "Rice (Basmati)", price: 85, change: 3.2, volume: "1.8T", trend: "up" },
      { crop: "Potato", price: 22, change: -0.5, volume: "1.5T", trend: "down" },
      { crop: "Cotton", price: 95, change: 1.2, volume: "500kg", trend: "up" },
      { crop: "Sugarcane", price: 38, change: 0.8, volume: "3.2T", trend: "up" },
      { crop: "Soybean", price: 68, change: -2.1, volume: "900kg", trend: "down" }
    ];

    return crops.map(crop => ({
      ...crop,
      lastUpdated: new Date().toISOString()
    }));
  }

  async getKPIs(userId: string) {
    const [orders, bids, escrows] = await Promise.all([
      prisma.order.findMany({ where: { buyerId: userId } }),
      prisma.bid.findMany({ where: { buyerId: userId } }),
      prisma.escrowOrder.findMany({ where: { buyerId: userId } })
    ]);

    return {
      totalSourcing: orders.reduce((sum, o) => sum + o.totalPrice, 0),
      activeBids: bids.filter(b => b.status === 'ACTIVE').length,
      verifiedSuppliers: await this.getActiveSupplierCount(userId),
      valueSaved: this.calculateSavings(orders),
      orderSuccessRate: this.calculateSuccessRate(orders),
      avgDeliveryTime: this.calculateAvgDeliveryTime(orders),
      activeOrders: orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length,
      monthlySpend: orders
        .filter(o => o.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((sum, o) => sum + o.totalPrice, 0)
    };
  }

  async getActivityFeed(userId: string) {
    return await this.getRecentActivity(userId);
  }

  private async getNotifications(userId: string) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    return notifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      timestamp: n.createdAt
    }));
  }

  private calculateSuccessRate(orders: any[]): number {
    if (orders.length === 0) return 0;

    const successfulOrders = orders.filter(o => o.status === 'DELIVERED').length;
    return Math.round((successfulOrders / orders.length) * 100);
  }

  private calculateAvgDeliveryTime(orders: any[]): number {
    const deliveredOrders = orders.filter(o => o.deliveredAt);
    if (deliveredOrders.length === 0) return 0;

    const totalDays = deliveredOrders.reduce((sum, o) => {
      const days = Math.floor((o.deliveredAt.getTime() - o.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    return Math.round(totalDays / deliveredOrders.length);
  }

  private async getActiveSupplierCount(userId: string): Promise<number> {
    const suppliers = await prisma.user.findMany({
      where: {
        role: 'FARMER',
        ordersAsFarmer: {
          some: { buyerId: userId }
        }
      }
    });

    return suppliers.length;
  }

  private getCategoryDistribution(orders: any[]): { [key: string]: number } {
    const distribution: { [key: string]: number } = {};

    orders.forEach(order => {
      const category = 'General'; // Would come from product category
      distribution[category] = (distribution[category] || 0) + 1;
    });

    return distribution;
  }
}
