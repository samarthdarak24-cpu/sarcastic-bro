import { Router, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const dashboardService = new DashboardService();

/**
 * GET /api/fpo/dashboard/overview
 * Get FPO dashboard overview with key metrics
 */
router.get('/overview', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const overview = await dashboardService.getOverview(fpoId);
    res.json({ success: true, data: overview });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/dashboard/stats
 * Get detailed statistics for FPO
 */
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = await dashboardService.getDetailedStats(fpoId);
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/dashboard/recent-activity
 * Get recent activity feed
 */
router.get('/recent-activity', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const activity = await dashboardService.getRecentActivity(fpoId, limit);
    res.json({ success: true, data: activity });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
