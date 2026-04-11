import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FarmerEscrowService {
  /**
   * Get farmer's earnings from escrow transactions
   */
  async getEarnings(farmerId: string, filters: { status?: string; page: number; limit: number }) {
    const { status, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = { farmerId };
    if (status) where.status = status;

    const [earnings, total] = await Promise.all([
      prisma.farmerEarning.findMany({
        where,
        include: {
          farmer: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.farmerEarning.count({ where })
    ]);

    // Get order details for each earning
    const enrichedEarnings = await Promise.all(
      earnings.map(async (earning) => {
        const order = await prisma.order.findUnique({
          where: { id: earning.orderId },
          include: {
            crop: {
              select: {
                cropName: true,
                quantity: true,
                pricePerKg: true
              }
            },
            buyer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        });

        return {
          ...earning,
          order: order ? {
            id: order.id,
            cropName: order.crop?.cropName || 'N/A',
            quantity: order.quantity,
            totalAmount: order.totalAmount,
            status: order.status,
            escrowStatus: order.escrowStatus,
            buyer: order.buyer
          } : null
        };
      })
    );

    return {
      earnings: enrichedEarnings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get summary of farmer's escrow earnings
   */
  async getEarningsSummary(farmerId: string) {
    const [pending, completed, total] = await Promise.all([
      prisma.farmerEarning.aggregate({
        where: { farmerId, status: 'PENDING' },
        _sum: { amount: true },
        _count: true
      }),
      prisma.farmerEarning.aggregate({
        where: { farmerId, status: 'COMPLETED' },
        _sum: { amount: true },
        _count: true
      }),
      prisma.farmerEarning.aggregate({
        where: { farmerId },
        _sum: { amount: true, platformFee: true }
      })
    ]);

    // Get recent earnings (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEarnings = await prisma.farmerEarning.aggregate({
      where: {
        farmerId,
        status: 'COMPLETED',
        paidAt: { gte: thirtyDaysAgo }
      },
      _sum: { amount: true }
    });

    return {
      pendingAmount: pending._sum.amount || 0,
      pendingCount: pending._count,
      completedAmount: completed._sum.amount || 0,
      completedCount: completed._count,
      totalEarnings: total._sum.amount || 0,
      totalPlatformFees: total._sum.platformFee || 0,
      last30DaysEarnings: recentEarnings._sum.amount || 0
    };
  }

  /**
   * Get orders with escrow status for farmer
   */
  async getOrdersWithEscrow(farmerId: string, filters: { escrowStatus?: string; page: number; limit: number }) {
    const { escrowStatus, page, limit } = filters;
    const skip = (page - 1) * limit;

    // Find crops belonging to this farmer
    const farmerCrops = await prisma.crop.findMany({
      where: { farmerId },
      select: { id: true }
    });

    const cropIds = farmerCrops.map(c => c.id);

    const where: any = {
      cropId: { in: cropIds }
    };

    if (escrowStatus) where.escrowStatus = escrowStatus;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          crop: {
            select: {
              cropName: true,
              variety: true,
              grade: true,
              pricePerKg: true
            }
          },
          buyer: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          },
          escrowTransaction: {
            select: {
              id: true,
              amount: true,
              status: true,
              heldAt: true,
              releasedAt: true,
              razorpayPaymentId: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
