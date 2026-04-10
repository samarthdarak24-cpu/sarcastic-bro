import prisma from '../../prisma/client';

export class DashboardService {
  /**
   * Get FPO dashboard overview
   */
  async getOverview(fpoId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoId },
      include: {
        farmers: { where: { isActive: true } },
        aggregatedLots: {
          where: { status: 'LISTED' }
        }
      }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    // Get total products from farmers
    const totalProducts = await prisma.crop.count({
      where: {
        fpoId: fpo.id,
        status: 'LISTED'
      }
    });

    // Get pending quality verifications
    const pendingVerifications = await prisma.qualityCertificate.count({
      where: {
        verifiedByFPO: false,
        OR: [
          { cropId: { in: await this.getFpoCropIds(fpo.id) } },
          { lotId: { in: fpo.aggregatedLots.map(l => l.id) } }
        ]
      }
    });

    // Get active orders
    const activeOrders = await prisma.order.count({
      where: {
        lotId: { in: fpo.aggregatedLots.map(l => l.id) },
        status: { in: ['PENDING', 'CONFIRMED', 'IN_TRANSIT'] }
      }
    });

    // Calculate total revenue
    const completedOrders = await prisma.order.aggregate({
      where: {
        lotId: { in: fpo.aggregatedLots.map(l => l.id) },
        status: 'DELIVERED'
      },
      _sum: { totalAmount: true }
    });

    return {
      fpoName: fpo.name,
      registrationNo: fpo.registrationNo,
      totalFarmers: fpo.farmers.length,
      totalProducts: totalProducts,
      aggregatedLots: fpo.aggregatedLots.length,
      pendingVerifications,
      activeOrders,
      totalRevenue: completedOrders._sum.totalAmount || 0,
      location: `${fpo.district}, ${fpo.state}`
    };
  }

  /**
   * Get detailed statistics
   */
  async getDetailedStats(fpoId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    // Product distribution by category
    const productsByCategory = await prisma.crop.groupBy({
      by: ['category'],
      where: { fpoId: fpo.id },
      _count: { id: true },
      _sum: { quantity: true }
    });

    // Monthly sales trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        lotId: { in: (await prisma.aggregatedLot.findMany({ where: { fpoId: fpo.id } })).map(l => l.id) },
        status: 'DELIVERED',
        createdAt: { gte: sixMonthsAgo }
      },
      _sum: { totalAmount: true }
    });

    // Top performing farmers
    const topFarmers = await prisma.fPOFarmer.findMany({
      where: { fpoId: fpo.id, isActive: true },
      include: {
        crops: {
          where: { status: 'SOLD' },
          select: { quantity: true, pricePerKg: true }
        }
      },
      take: 5
    });

    const farmersWithRevenue = topFarmers.map(farmer => ({
      id: farmer.id,
      name: farmer.name,
      phone: farmer.phone,
      totalRevenue: farmer.crops.reduce((sum, crop) => sum + (crop.quantity * crop.pricePerKg), 0),
      totalQuantity: farmer.crops.reduce((sum, crop) => sum + crop.quantity, 0)
    })).sort((a, b) => b.totalRevenue - a.totalRevenue);

    return {
      productsByCategory: productsByCategory.map(p => ({
        category: p.category,
        count: p._count.id,
        totalQuantity: p._sum.quantity || 0
      })),
      monthlySales,
      topFarmers: farmersWithRevenue
    };
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(fpoId: string, limit: number = 10) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const activities: any[] = [];

    // Recent farmer additions
    const recentFarmers = await prisma.fPOFarmer.findMany({
      where: { fpoId: fpo.id },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    recentFarmers.forEach(farmer => {
      activities.push({
        type: 'FARMER_ADDED',
        message: `New farmer ${farmer.name} onboarded`,
        timestamp: farmer.createdAt
      });
    });

    // Recent product listings
    const recentProducts = await prisma.crop.findMany({
      where: { fpoId: fpo.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { fpoFarmer: true }
    });

    recentProducts.forEach(product => {
      activities.push({
        type: 'PRODUCT_LISTED',
        message: `${product.fpoFarmer?.name} listed ${product.quantity}kg of ${product.cropName}`,
        timestamp: product.createdAt
      });
    });

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      where: {
        lotId: { in: (await prisma.aggregatedLot.findMany({ where: { fpoId: fpo.id } })).map(l => l.id) }
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { lot: true }
    });

    recentOrders.forEach(order => {
      activities.push({
        type: 'ORDER_RECEIVED',
        message: `New order for ${order.quantity}kg of ${order.lot?.cropName}`,
        timestamp: order.createdAt
      });
    });

    // Sort by timestamp and limit
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private async getFpoCropIds(fpoId: string): Promise<string[]> {
    const crops = await prisma.crop.findMany({
      where: { fpoId },
      select: { id: true }
    });
    return crops.map(c => c.id);
  }
}
