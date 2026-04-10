import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BuyerWalletService {
  async getWallet(userId: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0
        },
        include: {
          transactions: true
        }
      });
    }

    return wallet;
  }

  async addFunds(userId: string, amount: number, paymentDetails?: {
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    method?: string;
  }) {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const wallet = await this.getWallet(userId);
    const newBalance = wallet.balance + amount;

    // Create transaction record
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'ADD_FUNDS',
        amount,
        balanceBefore: wallet.balance,
        balanceAfter: newBalance,
        description: paymentDetails?.razorpayPaymentId 
          ? `Added via Razorpay: ${paymentDetails.razorpayPaymentId}`
          : 'Funds added to wallet',
        referenceId: paymentDetails?.razorpayOrderId
      }
    });

    // Update wallet balance
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: newBalance }
    });

    return {
      wallet: updatedWallet,
      transaction: {
        amount,
        balanceBefore: wallet.balance,
        balanceAfter: newBalance,
        timestamp: new Date()
      }
    };
  }

  async deductFunds(userId: string, amount: number, orderId: string, description: string) {
    const wallet = await this.getWallet(userId);

    if (wallet.balance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    const newBalance = wallet.balance - amount;

    // Create transaction record
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'DEBIT',
        amount: -amount,
        balanceBefore: wallet.balance,
        balanceAfter: newBalance,
        description,
        referenceId: orderId
      }
    });

    // Update wallet balance
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: newBalance }
    });

    return updatedWallet;
  }

  async holdFundsInEscrow(userId: string, amount: number, orderId: string) {
    const wallet = await this.getWallet(userId);

    if (wallet.balance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    const newBalance = wallet.balance - amount;

    // Create escrow hold transaction
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'ESCROW_HOLD',
        amount: -amount,
        balanceBefore: wallet.balance,
        balanceAfter: newBalance,
        description: `Funds held in escrow for order`,
        referenceId: orderId
      }
    });

    // Update wallet balance
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: newBalance }
    });

    return updatedWallet;
  }

  async getTransactions(userId: string, filters: {
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const { type, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const wallet = await this.getWallet(userId);

    const where: any = { walletId: wallet.id };
    if (type) where.type = type;

    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.walletTransaction.count({ where })
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getBalance(userId: string) {
    const wallet = await this.getWallet(userId);
    return {
      balance: wallet.balance,
      currency: wallet.currency
    };
  }
}
