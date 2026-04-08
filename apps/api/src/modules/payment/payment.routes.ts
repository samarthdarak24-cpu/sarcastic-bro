import { Router } from 'express';
import { paymentController } from './payment.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Webhook endpoint (no auth required - verified by signature)
router.post('/webhook', paymentController.handleWebhook.bind(paymentController));

// All other routes require authentication
router.use(authMiddleware);

// Core payment endpoints (as per spec requirements)
router.post('/initiate', paymentController.initiatePayment.bind(paymentController));
router.post('/verify', paymentController.verifyPayment.bind(paymentController));
router.get('/:id', paymentController.getTransactionById.bind(paymentController));

// Additional transaction management endpoints
router.get('/transactions', paymentController.getTransactions.bind(paymentController));
router.get('/stats', paymentController.getPaymentStats.bind(paymentController));
router.post('/create', paymentController.createPayment.bind(paymentController));
router.post('/cancel/:id', paymentController.cancelTransaction.bind(paymentController));
router.get('/export', paymentController.exportTransactions.bind(paymentController));
router.post('/refund/:id', paymentController.requestRefund.bind(paymentController));

// Payment methods management
router.get('/methods', paymentController.getPaymentMethods.bind(paymentController));
router.post('/methods', paymentController.addPaymentMethod.bind(paymentController));

export default router;
