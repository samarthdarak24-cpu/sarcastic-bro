import { PrismaClient } from '@prisma/client';
import { getSocketService } from '../../services/socketService';

const prisma = new PrismaClient();

export class OrderTrackingService {
  async getOrders(buyerId: string, filters: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { buyerId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          product: true,
          farmer: {
            select: {
              id: true,
              name: true,
              phone: true,
              district: true,
              state: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    return {
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getOrderTracking(orderId: string) {
    const [order, trackingEvents] = await Promise.all([
      prisma.order.findUnique({
        where: { id: orderId },
        include: {
          crop: {
            include: {
              farmer: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  farm: {
                    select: {
                      district: true,
                      state: true,
                      location: true
                    }
                  }
                }
              },
              fpoFarmer: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  district: true,
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
                  name: true,
                  district: true,
                  state: true
                }
              }
            }
          },
          buyer: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        }
      }),
      prisma.orderTracking.findMany({
        where: { orderId },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    if (!order) throw new Error('Order not found');

    // Determine supplier info
    let supplier: any = null;
    if (order.crop) {
      supplier = order.crop.farmer || order.crop.fpoFarmer;
    } else if (order.lot) {
      supplier = order.lot.fpo;
    }

    return {
      order,
      supplier,
      tracking: trackingEvents,
      currentStatus: trackingEvents[trackingEvents.length - 1] || null
    };
  }

  async addTrackingEvent(data: {
    orderId: string;
    status: string;
    location?: string;
    lat?: number;
    lng?: number;
    notes?: string;
    estimatedTime?: Date;
  }) {
    const trackingEvent = await prisma.orderTracking.create({
      data: {
        ...data,
        actualTime: new Date()
      }
    });

    // Update order status
    const order = await prisma.order.update({
      where: { id: data.orderId },
      data: { status: data.status }
    });

    // Emit socket event
    try {
      const socketService = getSocketService();
      socketService.emitOrderLocationUpdate(order.buyerId, {
        orderId: data.orderId,
        location: data.location || 'Unknown',
        lat: data.lat,
        lng: data.lng,
        status: data.status
      });
    } catch (error) {
      console.error('Socket emit error:', error);
    }

    return trackingEvent;
  }
}
