import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class BlockchainService {
  async getProductTrace(productId: string) {
    const traces = await prisma.blockchainTrace.findMany({
      where: { productId },
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
      },
      orderBy: { blockIndex: 'asc' }
    });

    return {
      productId,
      traces,
      verified: traces.every(t => t.verified),
      totalBlocks: traces.length
    };
  }

  async getTransactions(userId: string, filters: { type?: string; status?: string; page?: number; limit?: number }) {
    const { type, status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (type) where.type = type;
    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.blockchainTransaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.blockchainTransaction.count({ where })
    ]);

    return {
      transactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async createTransaction(data: {
    userId: string;
    type: string;
    amount?: number;
    fromAddress?: string;
    toAddress?: string;
    metadata?: any;
  }) {
    const txHash = crypto.randomBytes(32).toString('hex');
    const blockNumber = Math.floor(Math.random() * 1000000);

    const transaction = await prisma.blockchainTransaction.create({
      data: {
        ...data,
        txHash,
        blockNumber,
        status: 'PENDING',
        metadata: data.metadata ? JSON.stringify(data.metadata) : null
      }
    });

    // Simulate confirmation after a delay
    setTimeout(async () => {
      await prisma.blockchainTransaction.update({
        where: { id: transaction.id },
        data: { status: 'CONFIRMED', gasUsed: Math.random() * 0.001 }
      });
    }, 3000);

    return transaction;
  }

  async getTransactionById(id: string) {
    const transaction = await prisma.blockchainTransaction.findUnique({
      where: { id }
    });

    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  }
}
