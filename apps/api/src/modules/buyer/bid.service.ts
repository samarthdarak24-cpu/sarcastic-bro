import { PrismaClient } from '@prisma/client';
import { getSocketService } from '../../services/socketService';

const prisma = new PrismaClient();

export class BidService {
  async getBids(buyerId: string, filters: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { buyerId };
    if (status) where.status = status;

    const [bids, total] = await Promise.all([
      prisma.bid.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.bid.count({ where })
    ]);

    return {
      bids,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getBidById(id: string) {
    const bid = await prisma.bid.findUnique({ where: { id } });
    if (!bid) throw new Error('Bid not found');
    return bid;
  }

  async placeBid(data: {
    buyerId: string;
    productId: string;
    quantity: number;
    pricePerUnit: number;
    validUntil: Date;
    notes?: string;
  }) {
    const totalPrice = data.quantity * data.pricePerUnit;

    const bid = await prisma.bid.create({
      data: {
        ...data,
        totalPrice,
        status: 'PENDING'
      }
    });

    return bid;
  }

  async updateBid(id: string, data: { pricePerUnit?: number; quantity?: number; status?: string }) {
    const bid = await this.getBidById(id);

    const updateData: any = { ...data };
    if (data.pricePerUnit || data.quantity) {
      const quantity = data.quantity || bid.quantity;
      const pricePerUnit = data.pricePerUnit || bid.pricePerUnit;
      updateData.totalPrice = quantity * pricePerUnit;
    }

    const updated = await prisma.bid.update({
      where: { id },
      data: updateData
    });

    // Emit socket event
    try {
      const socketService = getSocketService();
      socketService.emitBidUpdate(bid.buyerId, {
        bidId: id,
        status: updated.status,
        counterOfferPrice: updated.counterOfferPrice || undefined,
        message: data.status ? `Bid ${data.status.toLowerCase()}` : 'Bid updated'
      });
    } catch (error) {
      console.error('Socket emit error:', error);
    }

    return updated;
  }
}
