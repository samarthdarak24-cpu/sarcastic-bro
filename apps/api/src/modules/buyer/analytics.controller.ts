import { Router, Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const analyticsService = new AnalyticsService();

router.get('/behavior', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const analytics = await analyticsService.getBehaviorAnalytics(req.user!.id, days);
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/dashboard', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const analytics = await analyticsService.getDashboardAnalytics(req.user!.id);
    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/insights', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const insights = await analyticsService.getInsights(req.user!.id);
    res.json(insights);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
