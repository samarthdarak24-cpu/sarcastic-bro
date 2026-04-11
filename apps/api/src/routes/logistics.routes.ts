// ========================================================================
// Logistics Routes
// ========================================================================

import { Router } from 'express';
import { LogisticsController } from '../controllers/logistics.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Track order (Public-ish, requires authentication and ownership check in controller)
router.get('/order/:orderId', authenticate, LogisticsController.getByOrderId);

// Active shipments for dashboard
router.get('/active', authenticate, LogisticsController.getActiveLogistics);

// FPO Management routes
router.post('/', authenticate, authorize('FPO'), LogisticsController.createLogistics);
router.patch('/:id/status', authenticate, authorize('FPO'), LogisticsController.updateStatus);

export default router;
