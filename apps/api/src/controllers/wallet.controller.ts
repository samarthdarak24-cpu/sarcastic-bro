import { Request, Response } from 'express';
import prisma from '../config/database';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_secret';

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export class WalletController {
  // Get wallet balance and details
  static async getWallet(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;

      let wallet = await prisma.wallet.findUnique({
        where: { userId },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 50
          }
        }
      });

      // Create wallet if doesn't exist
      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            userId,
            balance: 0,
            currency: 'INR'
          },
          include: {
            transactions: true
          }
        });
      }

      res.json({ success: true, wallet });
    } catch (err: any) {
      console.error('[Wallet] Error fetching wallet:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get wallet transactions
  static async getTransactions(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;
      const { limit = 50, offset = 0 } = req.query;

      const wallet = await prisma.wallet.findUnique({
        where: { userId }
      });

      if (!wallet) {
        return res.status(404).json({ success: false, message: 'Wallet not found' });
      }

      const transactions = await prisma.walletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: Number(offset)
      });

      const total = await prisma.walletTransaction.count({
        where: { walletId: wallet.id }
      });

      res.json({ success: true, transactions, total });
    } catch (err: any) {
      console.error('[Wallet] Error fetching transactions:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Create Razorpay order for adding funds
  static async createAddFundsOrder(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid amount' });
      }

      // Create Razorpay order
      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `wallet_${userId}_${Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      res.json({
        success: true,
        order: razorpayOrder,
        key: RAZORPAY_KEY_ID
      });
    } catch (err: any) {
      console.error('[Wallet] Error creating add funds order:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Verify payment and add funds to wallet
  static async verifyAndAddFunds(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

      // Verify signature
      const generated_signature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }

      // Get or create wallet
      let wallet = await prisma.wallet.findUnique({
        where: { userId }
      });

      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            userId,
            balance: 0,
            currency: 'INR'
          }
        });
      }

      // Add funds to wallet
      const newBalance = wallet.balance + amount;

      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: newBalance }
        }),
        prisma.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'ADD_FUNDS',
            amount,
            balanceBefore: wallet.balance,
            balanceAfter: newBalance,
            description: `Added funds via Razorpay`,
            referenceId: razorpay_payment_id
          }
        })
      ]);

      res.json({ 
        success: true, 
        message: 'Funds added successfully',
        newBalance 
      });
    } catch (err: any) {
      console.error('[Wallet] Error verifying and adding funds:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Withdraw funds (for farmers/FPOs)
  static async withdrawFunds(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid amount' });
      }

      const wallet = await prisma.wallet.findUnique({
        where: { userId }
      });

      if (!wallet) {
        return res.status(404).json({ success: false, message: 'Wallet not found' });
      }

      if (wallet.balance < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }

      const newBalance = wallet.balance - amount;

      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: newBalance }
        }),
        prisma.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'DEBIT',
            amount,
            balanceBefore: wallet.balance,
            balanceAfter: newBalance,
            description: 'Withdrawal to bank account'
          }
        })
      ]);

      res.json({ 
        success: true, 
        message: 'Withdrawal request processed',
        newBalance 
      });
    } catch (err: any) {
      console.error('[Wallet] Error withdrawing funds:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
