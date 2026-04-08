import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SupplierService {
  async getSuppliers(filters: {
    search?: string;
    district?: string;
    state?: string;
    minRating?: number;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, district, state, minRating, category, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true
    };

    if (district) where.district = district;
    if (state) where.state = state;
    if (minRating) where.rating = { gte: minRating };

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        include: {
          bulkProducts: {
            where: { isActive: true },
            take: 5
          }
        },
        skip,
        take: limit,
        orderBy: { rating: 'desc' }
      }),
      prisma.supplier.count({ where })
    ]);

    return {
      suppliers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getSupplierById(id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        bulkProducts: {
          where: { isActive: true }
        }
      }
    });

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    return supplier;
  }

  async getSupplierAnalytics(id: string) {
    const supplier = await this.getSupplierById(id);
    
    const orders = await prisma.order.findMany({
      where: { farmerId: supplier.userId },
      select: {
        status: true,
        totalPrice: true,
        createdAt: true,
        deliveredAt: true
      }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const avgDeliveryTime = orders
      .filter(o => o.deliveredAt)
      .reduce((sum, o, _, arr) => {
        const days = Math.floor((o.deliveredAt!.getTime() - o.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days / arr.length;
      }, 0);

    return {
      totalOrders: orders.length,
      completedOrders,
      totalRevenue,
      avgDeliveryTime: Math.round(avgDeliveryTime),
      rating: supplier.rating,
      responseTime: supplier.responseTime
    };
  }

  async getSupplierProducts(id: string, filters: { category?: string; page?: number; limit?: number }) {
    const { category, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      supplierId: id,
      isActive: true
    };

    if (category) where.category = category;

    const [products, total] = await Promise.all([
      prisma.bulkProduct.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.bulkProduct.count({ where })
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
