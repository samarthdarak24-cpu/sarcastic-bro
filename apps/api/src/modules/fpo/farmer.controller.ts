import { Router, Response } from 'express';
import { FarmerService } from './farmer.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const farmerService = new FarmerService();

/**
 * GET /api/fpo/farmers
 * Get all farmers linked to FPO
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const filters = {
      search: req.query.search as string,
      isActive: req.query.isActive === 'true',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await farmerService.getFarmers(fpoId, filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/farmers
 * Add new farmer (offline support)
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const farmerData = req.body;
    const farmer = await farmerService.addFarmer(fpoId, farmerData);
    res.status(201).json({ success: true, data: farmer });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/farmers/:id
 * Get farmer details
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const farmer = await farmerService.getFarmerById(fpoId, req.params.id);
    res.json({ success: true, data: farmer });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * PUT /api/fpo/farmers/:id
 * Update farmer details
 */
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const farmer = await farmerService.updateFarmer(fpoId, req.params.id, req.body);
    res.json({ success: true, data: farmer });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/fpo/farmers/:id
 * Deactivate farmer
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await farmerService.deactivateFarmer(fpoId, req.params.id);
    res.json({ success: true, message: 'Farmer deactivated successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/farmers/:id/products
 * Get products listed by a specific farmer
 */
router.get('/:id/products', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const products = await farmerService.getFarmerProducts(fpoId, req.params.id);
    res.json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
