import { Router, Response } from 'express';
import { TradeDeskService } from './trade-desk.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const tradeDeskService = new TradeDeskService();

// GET /api/buyer/trade-desk - Get trade desk data
router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const result = await tradeDeskService.getTradeDeskData(userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/buyer/trade-desk/orders - Create quick order
router.post('/orders', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const { products, deliveryLocation, notes } = req.body;

    if (!products || !deliveryLocation) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: products, deliveryLocation'
      });
    }

    const result = await tradeDeskService.createQuickOrder(userId, {
      products,
      deliveryLocation,
      notes
    });

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/buyer/trade-desk/history - Get trade history
router.get('/history', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await tradeDeskService.getTradeHistory(userId, filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
