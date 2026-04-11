import { Request, Response } from 'express';
import { paymentService } from './payment.service';

export class PaymentController {
  // Get all transactions for a user
  async getTransactions(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { type, status, startDate, endDate, minAmount, maxAmount } = req.query;

      const filter = {
        type: type as string | undefined,
        status: status as string | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        minAmount: minAmount ? parseFloat(minAmount as string) : undefined,
        maxAmount: maxAmount ? parseFloat(maxAmount as string) : undefined,
      };

      const transactions = await paymentService.getTransactions(userId, filter);
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }

  // Get transaction by ID (payment details)
  async getTransactionById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Unauthorized' 
        });
      }

      const transaction = await paymentService.getTransactionById(id, userId);
      
      if (!transaction) {
        return res.status(404).json({ 
          success: false,
          error: 'Payment not found' 
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch payment details' 
      });
    }
  }

  // Webhook endpoint for Razorpay callbacks
  async handleWebhook(req: Request, res: Response) {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const signature = req.headers['x-razorpay-signature'] as string;

      if (!webhookSecret || !signature) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing webhook signature' 
        });
      }

      // Verify webhook signature
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('[Payment Webhook] Invalid signature');
        return res.status(400).json({ 
          success: false,
          error: 'Invalid webhook signature' 
        });
      }

      const event = req.body;
      console.log('[Payment Webhook] Received event:', event.event);

      // Handle different webhook events
      switch (event.event) {
        case 'payment.authorized':
          // Payment authorized but not captured yet
          console.log('[Payment Webhook] Payment authorized:', event.payload.payment.entity.id);
          break;

        case 'payment.captured':
          // Payment successfully captured
          console.log('[Payment Webhook] Payment captured:', event.payload.payment.entity.id);
          // Update transaction status if needed
          break;

        case 'payment.failed':
          // Payment failed
          console.log('[Payment Webhook] Payment failed:', event.payload.payment.entity.id);
          // Update transaction status to failed
          break;

        case 'order.paid':
          // Order fully paid
          console.log('[Payment Webhook] Order paid:', event.payload.order.entity.id);
          break;

        case 'refund.created':
          // Refund initiated
          console.log('[Payment Webhook] Refund created:', event.payload.refund.entity.id);
          break;

        case 'refund.processed':
          // Refund processed
          console.log('[Payment Webhook] Refund processed:', event.payload.refund.entity.id);
          break;

        default:
          console.log('[Payment Webhook] Unhandled event:', event.event);
      }

      // Always respond with 200 to acknowledge receipt
      res.status(200).json({ 
        success: true,
        message: 'Webhook received' 
      });
    } catch (error) {
      console.error('[Payment Webhook] Error processing webhook:', error);
      // Still return 200 to prevent retries for invalid webhooks
      res.status(200).json({ 
        success: false,
        error: 'Webhook processing failed' 
      });
    }
  }

  // Get payment statistics
  async getPaymentStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const stats = await paymentService.getPaymentStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      res.status(500).json({ error: 'Failed to fetch payment stats' });
    }
  }

  // Create a new payment transaction
  async createPayment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { amount, to, method, category, description } = req.body;

      if (!amount || !to || !method || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const transaction = await paymentService.createPayment(userId, {
        amount,
        to,
        method,
        category,
        description,
      });

      res.status(201).json(transaction);
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  }

  // Initiate payment with Razorpay
  async initiatePayment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Unauthorized' 
        });
      }

      const { orderId, amount, paymentMethod } = req.body;

      if (!orderId || !amount || !paymentMethod) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing required fields: orderId, amount, paymentMethod' 
        });
      }

      // Validate payment method
      const validMethods = ['UPI', 'CARD', 'BANK_TRANSFER', 'WALLET'];
      if (!validMethods.includes(paymentMethod)) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid payment method' 
        });
      }

      // Create transaction first
      const transaction = await paymentService.createPayment(userId, {
        amount,
        to: 'Order Payment',
        method: paymentMethod,
        category: 'ORDER',
        description: `Payment for order ${orderId}`,
      });

      // Initiate Razorpay payment
      const result = await paymentService.initiatePayment(transaction.id, userId);
      
      res.json({
        success: true,
        data: {
          paymentId: transaction.id,
          orderId,
          amount,
          currency: result.currency,
          paymentGatewayOrderId: result.orderId,
          keyId: result.keyId,
        }
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to initiate payment' 
      });
    }
  }

  // Verify payment
  async verifyPayment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'Unauthorized' 
        });
      }

      const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

      if (!paymentId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing required fields: paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature' 
        });
      }

      const transaction = await paymentService.verifyPayment(
        userId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify payment' 
      });
    }
  }

  // Cancel transaction
  async cancelTransaction(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const transaction = await paymentService.cancelTransaction(id, userId);
      res.json(transaction);
    } catch (error) {
      console.error('Error canceling transaction:', error);
      res.status(500).json({ error: 'Failed to cancel transaction' });
    }
  }

  // Export transactions
  async exportTransactions(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { format, type, status, startDate, endDate } = req.query;

      if (!format || !['csv', 'pdf', 'excel'].includes(format as string)) {
        return res.status(400).json({ error: 'Invalid format' });
      }

      const filter = {
        type: type as string | undefined,
        status: status as string | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
      };

      const result = await paymentService.exportTransactions(
        userId,
        format as 'csv' | 'pdf' | 'excel',
        filter
      );

      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.send(result.data);
    } catch (error) {
      console.error('Error exporting transactions:', error);
      res.status(500).json({ error: 'Failed to export transactions' });
    }
  }

  // Request refund
  async requestRefund(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { reason } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!reason) {
        return res.status(400).json({ error: 'Refund reason is required' });
      }

      const transaction = await paymentService.requestRefund(id, userId, reason);
      res.json(transaction);
    } catch (error) {
      console.error('Error requesting refund:', error);
      res.status(500).json({ error: 'Failed to request refund' });
    }
  }

  // Get payment methods
  async getPaymentMethods(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const methods = await paymentService.getPaymentMethods(userId);
      res.json(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
  }

  // Add payment method
  async addPaymentMethod(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { type, details } = req.body;

      if (!type || !details) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const method = await paymentService.addPaymentMethod(userId, { type, details });
      res.status(201).json(method);
    } catch (error) {
      console.error('Error adding payment method:', error);
      res.status(500).json({ error: 'Failed to add payment method' });
    }
  }
}

export const paymentController = new PaymentController();
