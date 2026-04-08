import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PreBookingService {
  async getPreBookings(buyerId: string, filters: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { buyerId };
    if (status) where.status = status;

    const [preBookings, total] = await Promise.all([
      prisma.preBooking.findMany({
        where,
        include: {
          bulkProduct: {
            select: {
              id: true,
              name: true,
              unit: true,
              pricePerUnit: true,
              supplierId: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.preBooking.count({ where })
    ]);

    return {
      preBookings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getPreBookingById(id: string) {
    const preBooking = await prisma.preBooking.findUnique({
      where: { id },
      include: {
        bulkProduct: {
          select: {
            id: true,
            name: true,
            unit: true,
            pricePerUnit: true,
            supplierId: true
          }
        }
      }
    });

    if (!preBooking) throw new Error('Pre-booking not found');
    return preBooking;
  }

  async createPreBooking(data: {
    buyerId: string;
    bulkProductId: string;
    quantity: number;
    pricePerUnit: number;
    targetDate: Date;
    notes?: string;
  }) {
    const totalPrice = data.quantity * data.pricePerUnit;

    const preBooking = await prisma.preBooking.create({
      data: {
        ...data,
        totalPrice,
        status: 'PENDING'
      }
    });

    // Notify supplier
    const product = await prisma.bulkProduct.findUnique({
      where: { id: data.bulkProductId },
      include: { supplier: true }
    });

    if (product) {
      await prisma.notification.create({
        data: {
          userId: product.supplier.userId,
          type: 'ORDER',
          title: 'New Pre-Booking Request',
          message: `You have a new pre-booking request for ${data.quantity} ${product.unit} of ${product.name}`,
          metadata: JSON.stringify({ preBookingId: preBooking.id })
        }
      });
    }

    return preBooking;
  }

  async updatePreBooking(id: string, data: { status?: string; quantity?: number; pricePerUnit?: number }) {
    const preBooking = await this.getPreBookingById(id);

    const updateData: any = { ...data };
    if (data.quantity || data.pricePerUnit) {
      const quantity = data.quantity || preBooking.quantity;
      const pricePerUnit = data.pricePerUnit || preBooking.pricePerUnit;
      updateData.totalPrice = quantity * pricePerUnit;
    }

    if (data.status === 'CONFIRMED') {
      updateData.confirmedAt = new Date();
    }

    return prisma.preBooking.update({
      where: { id },
      data: updateData
    });
  }

  async cancelPreBooking(id: string) {
    return this.updatePreBooking(id, { status: 'CANCELLED' });
  }
}
