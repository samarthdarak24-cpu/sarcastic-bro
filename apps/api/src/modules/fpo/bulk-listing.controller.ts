import { Router, Response } from 'express';
import { BulkListingService } from './bulk-listing.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const bulkListingService = new BulkListingService();

/**
 * POST /api/fpo/bulk-listing/publish/:lotId
 * Publish aggregated lot to marketplace
 */
router.post('/publish/:lotId', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await bulkListingService.publishLot(fpoId, req.params.lotId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/bulk-listing/unpublish/:lotId
 * Remove lot from marketplace
 */
router.post('/unpublish/:lotId', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await bulkListingService.unpublishLot(fpoId, req.params.lotId);
    res.json({ success: true, message: 'Lot unpublished successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/bulk-listing/published
 * Get all published lots
 */
router.get('/published', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const lots = await bulkListingService.getPublishedLots(fpoId);
    res.json({ success: true, data: lots });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/fpo/bulk-listing/:lotId/price
 * Update lot price
 */
router.put('/:lotId/price', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { pricePerKg } = req.body;
    if (!pricePerKg || pricePerKg <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    const lot = await bulkListingService.updateLotPrice(fpoId, req.params.lotId, pricePerKg);
    res.json({ success: true, data: lot });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
