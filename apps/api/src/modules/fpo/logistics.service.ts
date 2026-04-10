import prisma from '../../prisma/client';

export class LogisticsService {
  /**
   * Get all orders for FPO with logistics info
   */
  async getOrders(fpoUserId: string, status?: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const lots = await prisma.aggregatedLot.findMany({
      where: { fpoId: fpo.id },
      select: { id: true }
    });

    const lotIds = lots.map(l => l.id);

    const where: any = {
      lotId: { in: lotIds }
    };

    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        lot: true,
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return orders;
  }

  /**
   * Get order details with logistics tracking
   */
  async getOrderDetails(fpoUserId: string, orderId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        lot: {
          include: {
            crops: {
              include: {
                fpoFarmer: {
                  select: {
                    id: true,
                    name: true,
                    phone: true
                  }
                }
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        }
      }
    });

    if (!order || !order.lot || order.lot.fpoId !== fpo.id) {
      throw new Error('Order not found or unauthorized');
    }

    // Generate timeline
    const timeline = [
      {
        status: 'PENDING',
        label: 'Order Placed',
        timestamp: order.createdAt,
        completed: true
      },
      {
        status: 'CONFIRMED',
        label: 'Order Confirmed',
        timestamp: order.status === 'PENDING' ? null : order.updatedAt,
        completed: ['CONFIRMED', 'IN_TRANSIT', 'DELIVERED'].includes(order.status)
      },
      {
        status: 'IN_TRANSIT',
        label: 'In Transit',
        timestamp: order.status === 'IN_TRANSIT' || order.status === 'DELIVERED' ? order.updatedAt : null,
        completed: ['IN_TRANSIT', 'DELIVERED'].includes(order.status)
      },
      {
        status: 'DELIVERED',
        label: 'Delivered',
        timestamp: order.status === 'DELIVERED' ? order.updatedAt : null,
        completed: order.status === 'DELIVERED'
      }
    ];

    return {
      ...order,
      timeline
    };
  }

  /**
   * Confirm order
   */
  async confirmOrder(fpoUserId: string, orderId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { lot: true }
    });

    if (!order || !order.lot || order.lot.fpoId !== fpo.id) {
      throw new Error('Order not found or unauthorized');
    }

    if (order.status !== 'PENDING') {
      throw new Error('Order is not in pending state');
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' }
    });

    return updated;
  }

  /**
   * Ship order
   */
  async shipOrder(fpoUserId: string, orderId: string, trackingNumber?: string, carrier?: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { lot: true }
    });

    if (!order || !order.lot || order.lot.fpoId !== fpo.id) {
      throw new Error('Order not found or unauthorized');
    }

    if (order.status !== 'CONFIRMED') {
      throw new Error('Order must be confirmed before shipping');
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'IN_TRANSIT' }
    });

    // In a real system, you would store tracking info in a separate table
    // For now, we'll just update the status

    return updated;
  }

  /**
   * Mark order as delivered
   */
  async markAsDelivered(fpoUserId: string, orderId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { lot: true }
    });

    if (!order || !order.lot || order.lot.fpoId !== fpo.id) {
      throw new Error('Order not found or unauthorized');
    }

    if (order.status !== 'IN_TRANSIT') {
      throw new Error('Order must be in transit before marking as delivered');
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'DELIVERED' }
    });

    // Update lot status if all quantity is sold
    const lot = order.lot;
    const totalOrderedQuantity = await prisma.order.aggregate({
      where: {
        lotId: lot.id,
        status: { in: ['CONFIRMED', 'IN_TRANSIT', 'DELIVERED'] }
      },
      _sum: { quantity: true }
    });

    if (totalOrderedQuantity._sum.quantity && totalOrderedQuantity._sum.quantity >= lot.totalQuantity) {
      await prisma.aggregatedLot.update({
        where: { id: lot.id },
        data: { status: 'SOLD' }
      });
    }

    return updated;
  }

  /**
   * Get logistics statistics
   */
  async getLogisticsStats(fpoUserId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const lots = await prisma.aggregatedLot.findMany({
      where: { fpoId: fpo.id },
      select: { id: true }
    });

    const lotIds = lots.map(l => l.id);

    const [pending, confirmed, inTransit, delivered, cancelled] = await Promise.all([
      prisma.order.count({
        where: { lotId: { in: lotIds }, status: 'PENDING' }
      }),
      prisma.order.count({
        where: { lotId: { in: lotIds }, status: 'CONFIRMED' }
      }),
      prisma.order.count({
        where: { lotId: { in: lotIds }, status: 'IN_TRANSIT' }
      }),
      prisma.order.count({
        where: { lotId: { in: lotIds }, status: 'DELIVERED' }
      }),
      prisma.order.count({
        where: { lotId: { in: lotIds }, status: 'CANCELLED' }
      })
    ]);

    // Calculate average delivery time (for delivered orders)
    const deliveredOrders = await prisma.order.findMany({
      where: {
        lotId: { in: lotIds },
        status: 'DELIVERED'
      },
      select: {
        createdAt: true,
        updatedAt: true
      }
    });

    let avgDeliveryTime = 0;
    if (deliveredOrders.length > 0) {
      const totalTime = deliveredOrders.reduce((sum, order) => {
        const diff = order.updatedAt.getTime() - order.createdAt.getTime();
        return sum + diff;
      }, 0);
      avgDeliveryTime = Math.round(totalTime / deliveredOrders.length / (1000 * 60 * 60 * 24)); // Convert to days
    }

    return {
      pending,
      confirmed,
      inTransit,
      delivered,
      cancelled,
      total: pending + confirmed + inTransit + delivered + cancelled,
      avgDeliveryTimeDays: avgDeliveryTime
    };
  }
}
