import { Router, Response } from 'express';
import { OrderTrackingService } from './order-tracking.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const orderTrackingService = new OrderTrackingService();

router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await orderTrackingService.getOrders(req.user!.id, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/tracking', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const tracking = await orderTrackingService.getOrderTracking(req.params.id);
    res.json(tracking);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
