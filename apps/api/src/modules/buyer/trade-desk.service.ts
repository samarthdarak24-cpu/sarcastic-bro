import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TradeDeskService {
  async getTradeDeskData(userId: string) {
    // Get market data
    const marketData = await this.getMarketData();

    // Get active trades
    const activeTrades = await this.getActiveTrades(userId);

    // Get quick order templates
    const templates = await this.getOrderTemplates(userId);

    // Get trade history
    const history = await this.getTradeHistory(userId);

    // Get performance metrics
    const metrics = await this.getPerformanceMetrics(userId);

    return {
      marketData,
      activeTrades,
      templates,
      history,
      metrics,
      lastUpdated: new Date()
    };
  }

  async createQuickOrder(userId: string, data: {
    products: Array<{
      productId: string;
      quantity: number;
      pricePerUnit: number;
    }>;
    deliveryLocation: string;
    notes?: string;
  }) {
    const { products, deliveryLocation, notes } = data;

    // Calculate total
    const totalPrice = products.reduce((sum, p) => sum + (p.quantity * p.pricePerUnit), 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId: userId,
        farmerId: '', // Would be determined by supplier matching
        totalPrice,
        status: 'PENDING',
        deliveryLocation,
        notes
      }
    });

    return {
      orderId: order.id,
      totalPrice,
      status: 'PENDING',
      createdAt: order.createdAt
    };
  }

  async getTradeHistory(userId: string, filters?: {
    page?: number;
    limit?: number;
  }) {
    const { page = 1, limit = 20 } = filters || {};
    const skip = (page - 1) * limit;

    const [trades, total] = await Promise.all([
      prisma.order.findMany({
        where: { buyerId: userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          farmer: { select: { name: true } }
        }
      }),
      prisma.order.count({ where: { buyerId: userId } })
    ]);

    const mappedTrades = trades.map(trade => ({
      id: trade.id,
      date: trade.createdAt,
      supplier: trade.farmer.name,
      amount: trade.totalPrice,
      status: trade.status,
      profitLoss: this.calculateProfitLoss(trade)
    }));

    return {
      trades: mappedTrades,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  private async getMarketData() {
    // Get recent orders to calculate market prices
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      take: 100
    });

    const avgPrice = recentOrders.length > 0
      ? recentOrders.reduce((sum, o) => sum + o.totalPrice, 0) / recentOrders.length
      : 0;

    return {
      lastPrice: avgPrice,
      bid: avgPrice * 0.98,
      ask: avgPrice * 1.02,
      volume: recentOrders.length,
      change: (Math.random() - 0.5) * 10,
      timestamp: new Date()
    };
  }

  private async getActiveTrades(userId: string) {
    const trades = await prisma.order.findMany({
      where: {
        buyerId: userId,
        status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'] }
      },
      include: {
        farmer: { select: { name: true } }
      }
    });

    return trades.map(trade => ({
      id: trade.id,
      supplier: trade.farmer.name,
      amount: trade.totalPrice,
      status: trade.status,
      openedAt: trade.createdAt,
      unrealizedPL: this.calculateUnrealizedPL(trade)
    }));
  }

  private async getOrderTemplates(userId: string) {
    // Return common order templates for quick ordering
    return [
      {
        id: 'template-1',
        name: 'Standard Bulk Order',
        description: 'Quick order for standard bulk quantities',
        products: [
          { category: 'Vegetables', quantity: 100, unit: 'kg' },
          { category: 'Grains', quantity: 50, unit: 'kg' }
        ]
      },
      {
        id: 'template-2',
        name: 'Premium Selection',
        description: 'High-quality premium products',
        products: [
          { category: 'Organic Vegetables', quantity: 50, unit: 'kg' }
        ]
      },
      {
        id: 'template-3',
        name: 'Seasonal Mix',
        description: 'Seasonal products mix',
        products: [
          { category: 'Seasonal Vegetables', quantity: 75, unit: 'kg' }
        ]
      }
    ];
  }

  private calculateProfitLoss(trade: any): number {
    // Mock calculation - would use actual cost basis
    const costBasis = trade.totalPrice * 0.95;
    return trade.totalPrice - costBasis;
  }

  private calculateUnrealizedPL(trade: any): number {
    // Mock calculation - would use current market price
    const currentPrice = trade.totalPrice * 1.02;
    return currentPrice - trade.totalPrice;
  }

  private async getPerformanceMetrics(userId: string) {
    const orders = await prisma.order.findMany({
      where: { buyerId: userId }
    });

    const completedOrders = orders.filter(o => o.status === 'DELIVERED');
    const totalProfit = completedOrders.reduce((sum, o) => sum + this.calculateProfitLoss(o), 0);

    return {
      totalTrades: orders.length,
      winRate: completedOrders.length > 0
        ? Math.round((completedOrders.length / orders.length) * 100)
        : 0,
      totalProfit,
      avgTradeSize: orders.length > 0
        ? orders.reduce((sum, o) => sum + o.totalPrice, 0) / orders.length
        : 0,
      profitFactor: totalProfit > 0 ? 1.5 : 0.5 // Mock value
    };
  }
}
