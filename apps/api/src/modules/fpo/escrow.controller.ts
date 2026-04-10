import { Router, Response } from 'express';
import { EscrowService } from './escrow.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const escrowService = new EscrowService();

/**
 * GET /api/fpo/escrow/pending
 * Get pending escrow transactions
 */
router.get('/pending', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transactions = await escrowService.getPendingTransactions(fpoId);
    res.json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/escrow/release/:orderId
 * Release escrow payment to farmers
 */
router.post('/release/:orderId', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await escrowService.releasePayment(fpoId, req.params.orderId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/escrow/history
 * Get escrow transaction history
 */
router.get('/history', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await escrowService.getTransactionHistory(fpoId, page, limit);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/escrow/order/:orderId/split
 * Get payment split details for an order
 */
router.get('/order/:orderId/split', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const split = await escrowService.getPaymentSplit(fpoId, req.params.orderId);
    res.json({ success: true, data: split });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
