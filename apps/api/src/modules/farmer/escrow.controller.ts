import { Router, Response } from 'express';
import { FarmerEscrowService } from './escrow.service';
import { authenticateToken, requireFarmer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const escrowService = new FarmerEscrowService();

/**
 * GET /api/farmer/escrow/earnings
 * Get farmer's escrow earnings (pending and completed)
 */
router.get('/earnings', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.id;
    const status = req.query.status as string;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await escrowService.getEarnings(farmerId, { status, page, limit });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/farmer/escrow/summary
 * Get summary of escrow earnings
 */
router.get('/summary', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.id;
    const summary = await escrowService.getEarningsSummary(farmerId);
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/farmer/escrow/orders
 * Get orders with escrow status
 */
router.get('/orders', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.id;
    const escrowStatus = req.query.escrowStatus as string;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await escrowService.getOrdersWithEscrow(farmerId, { escrowStatus, page, limit });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
