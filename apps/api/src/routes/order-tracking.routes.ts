import { Router } from 'express';
import { OrderTrackingController } from '../controllers/order-tracking.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get tracking events for an order
router.get('/:orderId/tracking', OrderTrackingController.getTrackingEvents);

// Get single order with full tracking details
router.get('/:orderId', OrderTrackingController.getOrderDetails);

// Add tracking event (FPO/Buyer can add updates)
router.post('/:orderId/tracking', OrderTrackingController.addTrackingEvent);

// Buyer confirms delivery
router.patch('/:orderId/confirm-delivery', OrderTrackingController.confirmDelivery);

export default router;
