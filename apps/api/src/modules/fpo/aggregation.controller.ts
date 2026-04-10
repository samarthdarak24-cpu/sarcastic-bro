import { Router, Response } from 'express';
import { AggregationService } from './aggregation.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const aggregationService = new AggregationService();

/**
 * GET /api/fpo/aggregation/eligible
 * Get products eligible for aggregation
 */
router.get('/eligible', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const groups = await aggregationService.getEligibleProducts(fpoId);
    res.json({ success: true, data: groups });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/aggregation/create
 * Create aggregated lot from products
 */
router.post('/create', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { criteria, productIds } = req.body;
    
    if (!criteria || !productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const lot = await aggregationService.createAggregatedLot(fpoId, criteria, productIds);
    res.status(201).json({ success: true, data: lot });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/aggregation/lots
 * Get all aggregated lots
 */
router.get('/lots', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const filters = {
      status: req.query.status as string,
      cropName: req.query.cropName as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await aggregationService.getAggregatedLots(fpoId, filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/aggregation/lots/:id
 * Get lot details with farmer contributions
 */
router.get('/lots/:id', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const lot = await aggregationService.getLotDetails(fpoId, req.params.id);
    res.json({ success: true, data: lot });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * DELETE /api/fpo/aggregation/lots/:id
 * Dissolve aggregated lot
 */
router.delete('/lots/:id', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await aggregationService.dissolveLot(fpoId, req.params.id);
    res.json({ success: true, message: 'Lot dissolved successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
