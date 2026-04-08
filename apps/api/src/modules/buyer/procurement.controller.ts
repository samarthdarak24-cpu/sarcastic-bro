import { Router, Response } from 'express';
import { ProcurementService } from './procurement.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const procurementService = new ProcurementService();

// POST /api/buyer/procurement/recommendations
router.post('/recommendations', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { category, quantity, budget, district } = req.body;
    
    const recommendations = await procurementService.getRecommendations(req.user!.id, {
      category,
      quantity: quantity ? parseFloat(quantity) : undefined,
      budget: budget ? parseFloat(budget) : undefined,
      district
    });

    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/buyer/procurement/history
router.get('/history', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await procurementService.getProcurementHistory(req.user!.id, page, limit);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
