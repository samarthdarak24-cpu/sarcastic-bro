import { Router } from 'express';
import { 
  createOrder, 
  verifyPayment, 
  handleWebhook, 
  getFarmerPayments,
  requestEarlyPayment
} from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public webhook
router.post('/webhook', handleWebhook);

// Protected routes
router.use(authMiddleware);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', getFarmerPayments);
router.post('/early-release', requestEarlyPayment);

export default router;
