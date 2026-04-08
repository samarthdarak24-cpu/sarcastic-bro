import { Router, Response } from 'express';
import { ClusterService } from './cluster.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const clusterService = new ClusterService();

// GET /api/buyer/clusters - Get cluster data
router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      bounds: req.query.bounds ? JSON.parse(req.query.bounds as string) : undefined,
      category: req.query.category as string,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined
    };

    const result = await clusterService.getClusters(filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buyer/clusters/intelligence - Get cluster intelligence
router.get('/intelligence', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string,
      location: req.query.location as string
    };

    const result = await clusterService.getClusterIntelligence(filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buyer/clusters/map - Get cluster map data
router.get('/map', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      bounds: req.query.bounds ? JSON.parse(req.query.bounds as string) : undefined,
      category: req.query.category as string
    };

    const result = await clusterService.getClusterMap(filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
