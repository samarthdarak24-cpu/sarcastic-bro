import { Router, Response } from 'express';
import { CockpitService } from './cockpit.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const cockpitService = new CockpitService();

// GET /api/buyer/cockpit - Get cockpit dashboard data
router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const result = await cockpitService.getCockpitData(userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buyer/cockpit/live-prices - Get live market prices
router.get('/live-prices', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const result = await cockpitService.getLivePrices();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buyer/cockpit/kpis - Get KPI metrics
router.get('/kpis', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const result = await cockpitService.getKPIs(userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buyer/cockpit/activity-feed - Get recent activity
router.get('/activity-feed', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const result = await cockpitService.getActivityFeed(userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buyer/cockpit/notifications - Get notifications
router.get('/notifications', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId!;
    const result = await cockpitService.getNotifications(userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
