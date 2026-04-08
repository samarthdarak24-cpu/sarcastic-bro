import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BulkTradeService {
  async getBulkTrades(buyerId: string, filters: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { buyerId };
    if (status) where.status = status;

    const [trades, total] = await Promise.all([
      prisma.bulkTrade.findMany({
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
      prisma.bulkTrade.count({ where })
    ]);

    return {
      trades,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getBulkTradeById(id: string) {
    const trade = await prisma.bulkTrade.findUnique({
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

    if (!trade) throw new Error('Bulk trade not found');
    return trade;
  }

  async createBulkTrade(data: {
    buyerId: string;
    bulkProductId: string;
    quantity: number;
    pricePerUnit: number;
    deliveryDate?: Date;
    notes?: string;
  }) {
    const totalPrice = data.quantity * data.pricePerUnit;

    // Find matching suppliers
    const product = await prisma.bulkProduct.findUnique({
      where: { id: data.bulkProductId },
      include: { supplier: true }
    });

    const trade = await prisma.bulkTrade.create({
      data: {
        ...data,
        totalPrice,
        status: 'PENDING',
        matchedSuppliers: product ? JSON.stringify([product.supplier.id]) : null
      }
    });

    return trade;
  }

  async updateBulkTrade(id: string, data: { status?: string; deliveryDate?: Date; notes?: string }) {
    return prisma.bulkTrade.update({
      where: { id },
      data
    });
  }
}
