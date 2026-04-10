import { Router, Response } from 'express';
import { LogisticsService } from './logistics.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const logisticsService = new LogisticsService();

/**
 * GET /api/fpo/logistics/orders
 * Get all orders with logistics info
 */
router.get('/orders', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const status = req.query.status as string;
    const orders = await logisticsService.getOrders(fpoId, status);
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/logistics/orders/:orderId
 * Get order logistics details
 */
router.get('/orders/:orderId', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const order = await logisticsService.getOrderDetails(fpoId, req.params.orderId);
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/logistics/orders/:orderId/confirm
 * Confirm order and prepare for shipment
 */
router.post('/orders/:orderId/confirm', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const order = await logisticsService.confirmOrder(fpoId, req.params.orderId);
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/logistics/orders/:orderId/ship
 * Mark order as shipped
 */
router.post('/orders/:orderId/ship', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { trackingNumber, carrier } = req.body;
    const order = await logisticsService.shipOrder(fpoId, req.params.orderId, trackingNumber, carrier);
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/logistics/orders/:orderId/deliver
 * Mark order as delivered
 */
router.post('/orders/:orderId/deliver', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const order = await logisticsService.markAsDelivered(fpoId, req.params.orderId);
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/logistics/stats
 * Get logistics statistics
 */
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = await logisticsService.getLogisticsStats(fpoId);
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
