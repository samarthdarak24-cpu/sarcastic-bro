import prisma from '../config/database';

export class WalletService {
  // Add funds to wallet (prototype - instant credit)
  static async addFunds(userId: string, amount: number, razorpayPaymentId?: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
        },
      });
    }

    const newBalance = wallet.balance + amount;

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'ADD_FUNDS',
        amount,
        balanceBefore: wallet.balance,
        balanceAfter: newBalance,
        description: razorpayPaymentId ? `Added via Razorpay: ${razorpayPaymentId}` : 'Funds added',
        referenceId: razorpayPaymentId,
      },
    });

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: newBalance },
    });

    return { balance: newBalance, transaction: 'success' };
  }

  // Get wallet balance
  static async getBalance(userId: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
        },
      });
    }

    return wallet;
  }

  // Get transaction history
  static async getTransactions(userId: string, limit = 50) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: limit,
        },
      },
    });

    return wallet?.transactions || [];
  }
}
