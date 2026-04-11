import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { redis } from '../../services/redis.service';
import { getSocketService } from '../../services/socketService';

const prisma = new PrismaClient();

// Initialize Razorpay (use environment variables in production)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret',
});

interface PaymentFilter {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

interface CreatePaymentRequest {
  amount: number;
  to: string;
  method: string;
  category: string;
  description?: string;
}

export class PaymentService {
  // Generate unique reference number
  private generateReference(method: string): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${method.toUpperCase()}/${year}/${month}/${day}/${random}`;
  }

  // Get transactions for a user
  async getTransactions(userId: string, filter: PaymentFilter = {}) {
    // Generate cache key based on userId and filter
    const cacheKey = `transactions:${userId}:${JSON.stringify(filter)}`;
    
    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[Payment] Cache hit for transactions:${userId}`);
      return cached;
    }

    const where: any = { userId };

    if (filter.type) {
      if (filter.type === 'received') where.type = 'RECEIVED';
      else if (filter.type === 'sent') where.type = 'SENT';
      else if (filter.type === 'pending') where.status = { in: ['PENDING', 'PROCESSING'] };
      else if (filter.type === 'completed') where.status = 'COMPLETED';
    }

    if (filter.status) {
      where.status = filter.status.toUpperCase();
    }

    if (filter.startDate || filter.endDate) {
      where.createdAt = {};
      if (filter.startDate) where.createdAt.gte = new Date(filter.startDate);
      if (filter.endDate) where.createdAt.lte = new Date(filter.endDate);
    }

    if (filter.minAmount || filter.maxAmount) {
      where.amount = {};
      if (filter.minAmount) where.amount.gte = filter.minAmount;
      if (filter.maxAmount) where.amount.lte = filter.maxAmount;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const result = transactions.map(txn => ({
      id: txn.id,
      type: txn.type.toLowerCase(),
      amount: txn.amount,
      from: txn.fromParty,
      to: txn.toParty,
      date: txn.createdAt.toISOString(),
      status: txn.status.toLowerCase(),
      method: txn.method,
      category: txn.category,
      reference: txn.reference,
      description: txn.description || '',
      userId: txn.userId,
    }));

    // Cache for 3 minutes
    await redis.set(cacheKey, result, 180);
    
    return result;
  }

  // Get transaction by ID
  async getTransactionById(id: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) return null;

    return {
      id: transaction.id,
      type: transaction.type.toLowerCase(),
      amount: transaction.amount,
      from: transaction.fromParty,
      to: transaction.toParty,
      date: transaction.createdAt.toISOString(),
      status: transaction.status.toLowerCase(),
      method: transaction.method,
      category: transaction.category,
      reference: transaction.reference,
      description: transaction.description || '',
      userId: transaction.userId,
    };
  }

  // Get payment statistics
  async getPaymentStats(userId: string) {
    const cacheKey = `payment:stats:${userId}`;
    
    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[Payment] Cache hit for stats:${userId}`);
      return cached;
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    const completed = transactions.filter(t => t.status === 'COMPLETED');
    const totalReceived = completed
      .filter(t => t.type === 'RECEIVED')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalSent = completed
      .filter(t => t.type === 'SENT')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalPending = transactions
      .filter(t => t.status === 'PENDING' || t.status === 'PROCESSING')
      .reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalReceived - totalSent;

    const now = new Date();
    const thisMonth = completed
      .filter(t => {
        const txnDate = new Date(t.createdAt);
        return (
          txnDate.getMonth() === now.getMonth() &&
          txnDate.getFullYear() === now.getFullYear() &&
          t.type === 'RECEIVED'
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const transactionCount = transactions.length;
    const avgTransaction =
      completed.length > 0
        ? Math.round(completed.reduce((sum, t) => sum + t.amount, 0) / completed.length)
        : 0;
    const successRate =
      transactions.length > 0
        ? Math.round((completed.length / transactions.length) * 100)
        : 0;

    const result = {
      totalReceived,
      totalSent,
      totalPending,
      netBalance,
      thisMonth,
      transactionCount,
      avgTransaction,
      successRate,
    };

    // Cache for 5 minutes
    await redis.set(cacheKey, result, 300);
    
    return result;
  }

  // Create a new payment transaction
  async createPayment(userId: string, payment: CreatePaymentRequest) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const reference = this.generateReference(payment.method);

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: 'SENT',
        amount: payment.amount,
        fromParty: user.name,
        toParty: payment.to,
        status: 'PENDING',
        method: payment.method,
        category: payment.category,
        reference,
        description: payment.description || '',
      },
    });

    // Invalidate cache
    await redis.delPattern(`transactions:${userId}:*`);
    await redis.del(`payment:stats:${userId}`);

    // Emit real-time event
    try {
      const socketService = getSocketService();
      socketService.emitPaymentUpdate(userId, {
        paymentId: transaction.id,
        orderId: transaction.orderId || '',
        status: 'pending',
        amount: transaction.amount,
      });
    } catch (error) {
      console.error('[Payment] Socket.IO not available:', error);
    }

    return {
      id: transaction.id,
      type: transaction.type.toLowerCase(),
      amount: transaction.amount,
      from: transaction.fromParty,
      to: transaction.toParty,
      date: transaction.createdAt.toISOString(),
      status: transaction.status.toLowerCase(),
      method: transaction.method,
      category: transaction.category,
      reference: transaction.reference,
      description: transaction.description || '',
      userId: transaction.userId,
    };
  }

  // Initiate payment with Razorpay
  async initiatePayment(transactionId: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId, userId },
    });

    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status !== 'PENDING') throw new Error('Transaction already processed');

    try {
      const order = await razorpay.orders.create({
        amount: Math.round(transaction.amount * 100), // Amount in paise
        currency: 'INR',
        receipt: transaction.reference,
        notes: {
          transactionId: transaction.id,
          category: transaction.category,
        },
      });

      await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          razorpayOrderId: order.id,
          status: 'PROCESSING',
        },
      });

      // Invalidate cache
      await redis.delPattern(`transactions:${userId}:*`);
      await redis.del(`payment:stats:${userId}`);

      // Emit real-time event
      try {
        const socketService = getSocketService();
        socketService.emitPaymentUpdate(userId, {
          paymentId: transaction.id,
          orderId: transaction.orderId || '',
          status: 'processing',
          amount: transaction.amount,
        });
      } catch (error) {
        console.error('[Payment] Socket.IO not available:', error);
      }

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
      };
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      throw new Error('Failed to initiate payment');
    }
  }

  // Verify payment
  async verifyPayment(
    userId: string,
    orderId: string,
    paymentId: string,
    signature: string
  ) {
    const transaction = await prisma.transaction.findFirst({
      where: { razorpayOrderId: orderId, userId },
    });

    if (!transaction) throw new Error('Transaction not found');

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED' },
      });

      // Invalidate cache
      await redis.delPattern(`transactions:${userId}:*`);
      await redis.del(`payment:stats:${userId}`);

      // Emit failure event
      try {
        const socketService = getSocketService();
        socketService.emitPaymentUpdate(userId, {
          paymentId: transaction.id,
          orderId: transaction.orderId || '',
          status: 'failed',
          amount: transaction.amount,
        });
      } catch (error) {
        console.error('[Payment] Socket.IO not available:', error);
      }

      throw new Error('Payment verification failed');
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      },
    });

    // Invalidate cache
    await redis.delPattern(`transactions:${userId}:*`);
    await redis.del(`payment:stats:${userId}`);

    // Emit success event
    try {
      const socketService = getSocketService();
      socketService.emitPaymentUpdate(userId, {
        paymentId: updatedTransaction.id,
        orderId: updatedTransaction.orderId || '',
        status: 'completed',
        amount: updatedTransaction.amount,
      });
    } catch (error) {
      console.error('[Payment] Socket.IO not available:', error);
    }

    return {
      id: updatedTransaction.id,
      type: updatedTransaction.type.toLowerCase(),
      amount: updatedTransaction.amount,
      from: updatedTransaction.fromParty,
      to: updatedTransaction.toParty,
      date: updatedTransaction.createdAt.toISOString(),
      status: updatedTransaction.status.toLowerCase(),
      method: updatedTransaction.method,
      category: updatedTransaction.category,
      reference: updatedTransaction.reference,
      description: updatedTransaction.description || '',
      userId: updatedTransaction.userId,
    };
  }

  // Cancel transaction
  async cancelTransaction(id: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status === 'COMPLETED') {
      throw new Error('Cannot cancel completed transaction');
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: { status: 'FAILED' },
    });

    // Invalidate cache
    await redis.delPattern(`transactions:${userId}:*`);
    await redis.del(`payment:stats:${userId}`);

    // Emit cancellation event
    try {
      const socketService = getSocketService();
      socketService.emitPaymentUpdate(userId, {
        paymentId: updatedTransaction.id,
        orderId: updatedTransaction.orderId || '',
        status: 'cancelled',
        amount: updatedTransaction.amount,
      });
    } catch (error) {
      console.error('[Payment] Socket.IO not available:', error);
    }

    return {
      id: updatedTransaction.id,
      type: updatedTransaction.type.toLowerCase(),
      amount: updatedTransaction.amount,
      from: updatedTransaction.fromParty,
      to: updatedTransaction.toParty,
      date: updatedTransaction.createdAt.toISOString(),
      status: updatedTransaction.status.toLowerCase(),
      method: updatedTransaction.method,
      category: updatedTransaction.category,
      reference: updatedTransaction.reference,
      description: updatedTransaction.description || '',
      userId: updatedTransaction.userId,
    };
  }

  // Export transactions
  async exportTransactions(
    userId: string,
    format: 'csv' | 'pdf' | 'excel',
    filter: PaymentFilter = {}
  ) {
    const transactions = await this.getTransactions(userId, filter);

    if (format === 'csv') {
      const csv = this.generateCSV(transactions);
      return {
        data: csv,
        contentType: 'text/csv',
        filename: `transactions_${Date.now()}.csv`,
      };
    }

    // For PDF and Excel, return placeholder
    return {
      data: JSON.stringify(transactions),
      contentType: 'application/json',
      filename: `transactions_${Date.now()}.json`,
    };
  }

  private generateCSV(transactions: any[]): string {
    const headers = ['ID', 'Type', 'Amount', 'From', 'To', 'Status', 'Method', 'Category', 'Reference', 'Date'];
    const rows = transactions.map(t => [
      t.id,
      t.type,
      t.amount,
      t.from,
      t.to,
      t.status,
      t.method,
      t.category,
      t.reference,
      new Date(t.date).toLocaleDateString(),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Request refund
  async requestRefund(id: string, userId: string, reason: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status !== 'COMPLETED') {
      throw new Error('Only completed transactions can be refunded');
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        type: 'REFUND',
        status: 'PROCESSING',
        description: `${transaction.description} | Refund Reason: ${reason}`,
      },
    });

    // Invalidate cache
    await redis.delPattern(`transactions:${userId}:*`);
    await redis.del(`payment:stats:${userId}`);

    // Emit refund event
    try {
      const socketService = getSocketService();
      socketService.emitPaymentUpdate(userId, {
        paymentId: updatedTransaction.id,
        orderId: updatedTransaction.orderId || '',
        status: 'refund_processing',
        amount: updatedTransaction.amount,
      });
    } catch (error) {
      console.error('[Payment] Socket.IO not available:', error);
    }

    return {
      id: updatedTransaction.id,
      type: updatedTransaction.type.toLowerCase(),
      amount: updatedTransaction.amount,
      from: updatedTransaction.fromParty,
      to: updatedTransaction.toParty,
      date: updatedTransaction.createdAt.toISOString(),
      status: updatedTransaction.status.toLowerCase(),
      method: updatedTransaction.method,
      category: updatedTransaction.category,
      reference: updatedTransaction.reference,
      description: updatedTransaction.description || '',
      userId: updatedTransaction.userId,
    };
  }

  // Get payment methods (mock data)
  async getPaymentMethods(userId: string) {
    return [
      { id: '1', name: 'UPI', type: 'UPI', isDefault: true },
      { id: '2', name: 'Bank Transfer', type: 'BANK_TRANSFER', isDefault: false },
      { id: '3', name: 'Card', type: 'CARD', isDefault: false },
    ];
  }

  // Add payment method (mock)
  async addPaymentMethod(userId: string, method: { type: string; details: any }) {
    return {
      id: Date.now().toString(),
      name: method.type,
      type: method.type,
      isDefault: false,
    };
  }
}

export const paymentService = new PaymentService();
