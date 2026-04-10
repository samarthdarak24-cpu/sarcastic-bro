import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class BuyerDashboardService {
  async getDashboardStats(buyerId: string) {
    const [
      totalSpent,
      ordersCount,
      activeOrders,
      completedOrders,
      wallet,
      recentOrders
    ] = await Promise.all([
      // Total spent on delivered orders
      prisma.order.aggregate({
        where: { 
          buyerId, 
          status: OrderStatus.DELIVERED 
        },
        _sum: { totalAmount: true }
      }),
      // Total orders count
      prisma.order.count({
        where: { buyerId }
      }),
      // Active orders (pending, confirmed, in transit)
      prisma.order.count({
        where: {
          buyerId,
          status: {
            in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.IN_TRANSIT]
          }
        }
      }),
      // Completed orders
      prisma.order.count({
        where: {
          buyerId,
          status: OrderStatus.DELIVERED
        }
      }),
      // Wallet balance
      prisma.wallet.findUnique({
        where: { userId: buyerId }
      }),
      // Recent orders
      prisma.order.findMany({
        where: { buyerId },
        include: {
          crop: {
            select: {
              cropName: true,
              variety: true,
              grade: true
            }
          },
          lot: {
            select: {
              cropName: true,
              fpo: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    // Get unique suppliers
    const supplierOrders = await prisma.order.findMany({
      where: { 
        buyerId,
        status: OrderStatus.DELIVERED
      },
      include: {
        crop: {
          select: {
            farmerId: true,
            fpoFarmerId: true
          }
        },
        lot: {
          select: {
            fpoId: true
          }
        }
      }
    });

    const uniqueSuppliers = new Set();
    supplierOrders.forEach(order => {
      if (order.crop?.farmerId) uniqueSuppliers.add(order.crop.farmerId);
      if (order.crop?.fpoFarmerId) uniqueSuppliers.add(order.crop.fpoFarmerId);
      if (order.lot?.fpoId) uniqueSuppliers.add(order.lot.fpoId);
    });

    return {
      totalSpent: totalSpent._sum.totalAmount || 0,
      totalOrders: ordersCount,
      activeOrders,
      completedOrders,
      activeSuppliers: uniqueSuppliers.size,
      walletBalance: wallet?.balance || 0,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        productName: order.crop?.cropName || order.lot?.cropName || 'Unknown',
        variety: order.crop?.variety,
        quantity: order.quantity,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        supplier: order.lot?.fpo?.name
      }))
    };
  }

  async getOrdersSummary(buyerId: string) {
    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      where: { buyerId },
      _count: { id: true }
    });

    const summary = {
      pending: 0,
      confirmed: 0,
      inTransit: 0,
      delivered: 0,
      cancelled: 0
    };

    statusCounts.forEach(item => {
      const status = item.status.toLowerCase().replace('_', '');
      if (status === 'pending') summary.pending = item._count.id;
      if (status === 'confirmed') summary.confirmed = item._count.id;
      if (status === 'intransit') summary.inTransit = item._count.id;
      if (status === 'delivered') summary.delivered = item._count.id;
      if (status === 'cancelled') summary.cancelled = item._count.id;
    });

    return summary;
  }

  async getSpendingAnalytics(buyerId: string, period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const orders = await prisma.order.findMany({
      where: {
        buyerId,
        status: OrderStatus.DELIVERED,
        createdAt: {
          gte: startDate
        }
      },
      select: {
        totalAmount: true,
        createdAt: true,
        crop: {
          select: {
            category: true
          }
        }
      }
    });

    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;

    // Group by category
    const categorySpending: Record<string, number> = {};
    orders.forEach(order => {
      const category = order.crop?.category || 'Other';
      categorySpending[category] = (categorySpending[category] || 0) + order.totalAmount;
    });

    return {
      period,
      totalSpent,
      orderCount: orders.length,
      averageOrderValue,
      categoryBreakdown: Object.entries(categorySpending).map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpent) * 100
      }))
    };
  }

  async getTopSuppliers(buyerId: string, limit: number = 5) {
    const orders = await prisma.order.findMany({
      where: {
        buyerId,
        status: OrderStatus.DELIVERED
      },
      include: {
        crop: {
          include: {
            farmer: {
              select: {
                id: true,
                name: true
              }
            },
            fpoFarmer: {
              select: {
                id: true,
                name: true,
                fpo: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        },
        lot: {
          include: {
            fpo: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    // Aggregate by supplier
    const supplierStats: Record<string, { name: string; orders: number; totalSpent: number }> = {};

    orders.forEach(order => {
      let supplierId: string | null = null;
      let supplierName: string | null = null;

      if (order.crop?.farmer) {
        supplierId = order.crop.farmer.id;
        supplierName = order.crop.farmer.name;
      } else if (order.crop?.fpoFarmer) {
        supplierId = order.crop.fpoFarmer.id;
        supplierName = `${order.crop.fpoFarmer.name} (${order.crop.fpoFarmer.fpo.name})`;
      } else if (order.lot?.fpo) {
        supplierId = order.lot.fpo.id;
        supplierName = order.lot.fpo.name;
      }

      if (supplierId && supplierName) {
        if (!supplierStats[supplierId]) {
          supplierStats[supplierId] = {
            name: supplierName,
            orders: 0,
            totalSpent: 0
          };
        }
        supplierStats[supplierId].orders++;
        supplierStats[supplierId].totalSpent += order.totalAmount;
      }
    });

    // Sort by total spent and return top suppliers
    return Object.entries(supplierStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }
}
