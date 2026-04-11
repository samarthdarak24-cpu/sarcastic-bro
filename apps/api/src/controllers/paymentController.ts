import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const prisma = new PrismaClient();

// In a real app, these would come from process.env
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_secret';
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_key';

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', orderId, farmerId, buyerId } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Razorpay accepts amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create a pending payment record in our DB
    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        status: 'PENDING',
        buyerId: buyerId || (req as any).user.id,
        sellerId: farmerId,
        orderId: orderId,
        transactionId: razorpayOrder.id,
        paymentGateway: 'razorpay',
        paymentMethod: 'UPI', // Default for simulation
        metadata: JSON.stringify({ razorpay_order_id: razorpayOrder.id }),
      },
    });

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      paymentId: payment.id,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Update payment status in DB
      await prisma.payment.update({
        where: { transactionId: razorpay_order_id },
        data: {
          status: 'COMPLETED',
          metadata: JSON.stringify({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          }),
        },
      });

      return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const secret = WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature === expectedSignature) {
      const event = req.body.event;
      const paymentId = req.body.payload.payment.entity.id;
      const orderId = req.body.payload.payment.entity.order_id;

      if (event === 'payment.captured' || event === 'order.paid') {
        await prisma.payment.update({
          where: { transactionId: orderId },
          data: { status: 'COMPLETED' },
        });
        console.log(`Payment successful for Order ID: ${orderId}`);
      } else if (event === 'payment.failed') {
        await prisma.payment.update({
          where: { transactionId: orderId },
          data: { status: 'FAILED' },
        });
        console.log(`Payment failed for Order ID: ${orderId}`);
      }

      return res.status(200).json({ status: 'ok' });
    } else {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getFarmerPayments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const payments = await prisma.payment.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: { select: { name: true, district: true } }
      }
    });

    return res.status(200).json({ success: true, payments });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const requestEarlyPayment = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.body;
        // In simulation, we just mark it for early release or "PROCESSING"
        const payment = await prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'COMPLETED' } // Simulate immediate success for demo
        });
        return res.status(200).json({ success: true, message: 'Early payment request approved and funds disbursed.' });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
