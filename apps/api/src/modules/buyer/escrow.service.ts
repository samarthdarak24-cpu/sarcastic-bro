import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class BuyerEscrowService {
  async getEscrowOrders(buyerId: string, filters: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { buyerId };
    if (status) where.status = status;

    const [escrows, total] = await Promise.all([
      prisma.escrowOrder.findMany({
        where,
        include: {
          order: {
            include: {
              product: true,
              farmer: {
                select: {
                  id: true,
                  name: true,
                  district: true,
                  state: true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.escrowOrder.count({ where })
    ]);

    return {
      escrows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getEscrowById(id: string) {
    const escrow = await prisma.escrowOrder.findUnique({
      where: { id },
      include: {
        order: {
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
          }
        }
      }
    });

    if (!escrow) throw new Error('Escrow order not found');
    return escrow;
  }

  async createEscrow(data: {
    orderId: string;
    buyerId: string;
    farmerId: string;
    amount: number;
  }) {
    const escrowAddress = `0x${crypto.randomBytes(20).toString('hex')}`;
    const depositTxHash = `0x${crypto.randomBytes(32).toString('hex')}`;

    const escrow = await prisma.escrowOrder.create({
      data: {
        ...data,
        status: 'HELD',
        escrowAddress,
        depositTxHash
      }
    });

    // Create notification for farmer
    await prisma.notification.create({
      data: {
        userId: data.farmerId,
        type: 'ORDER',
        title: 'Payment Held in Escrow',
        message: `Payment of ₹${data.amount} has been secured in escrow`,
        metadata: JSON.stringify({ escrowId: escrow.id })
      }
    });

    return escrow;
  }

  async confirmDelivery(id: string, buyerId: string) {
    const escrow = await this.getEscrowById(id);

    if (escrow.buyerId !== buyerId) {
      throw new Error('Unauthorized');
    }

    if (escrow.status !== 'HELD') {
      throw new Error('Escrow is not in HELD status');
    }

    const releaseTxHash = `0x${crypto.randomBytes(32).toString('hex')}`;

    const updated = await prisma.escrowOrder.update({
      where: { id },
      data: {
        status: 'RELEASED',
        buyerConfirmed: true,
        releaseTxHash,
        releasedAt: new Date()
      }
    });

    // Update order status
    await prisma.order.update({
      where: { id: escrow.orderId },
      data: { status: 'DELIVERED' }
    });

    // Notify farmer
    await prisma.notification.create({
      data: {
        userId: escrow.farmerId,
        type: 'PAYMENT',
        title: 'Payment Released',
        message: `Payment of ₹${escrow.amount} has been released from escrow`,
        metadata: JSON.stringify({ escrowId: id })
      }
    });

    return updated;
  }

  async raiseDispute(id: string, buyerId: string, reason: string) {
    const escrow = await this.getEscrowById(id);

    if (escrow.buyerId !== buyerId) {
      throw new Error('Unauthorized');
    }

    const updated = await prisma.escrowOrder.update({
      where: { id },
      data: {
        status: 'DISPUTED',
        disputeReason: reason
      }
    });

    // Notify admin and farmer
    await Promise.all([
      prisma.notification.create({
        data: {
          userId: escrow.farmerId,
          type: 'SYSTEM',
          title: 'Escrow Dispute Raised',
          message: `Buyer has raised a dispute for order`,
          metadata: JSON.stringify({ escrowId: id })
        }
      })
    ]);

    return updated;
  }
}
