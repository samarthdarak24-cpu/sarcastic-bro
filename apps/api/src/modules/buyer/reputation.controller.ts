import { Router, Response } from 'express';
import { BuyerReputationService } from './reputation.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const reputationService = new BuyerReputationService();

// GET /api/buyer/reputation
router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const reputation = await reputationService.getReputation(req.user!.id);
    res.json(reputation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/buyer/reputation/history
router.get('/history', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await reputationService.getReputationHistory(req.user!.id, page, limit);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/buyer/reputation/breakdown
router.get('/breakdown', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const breakdown = await reputationService.getReputationBreakdown(req.user!.id);
    res.json(breakdown);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
