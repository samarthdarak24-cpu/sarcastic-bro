import { Router, Response } from 'express';
import { BuyerEscrowService } from './escrow.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const escrowService = new BuyerEscrowService();

router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await escrowService.getEscrowOrders(req.user!.id, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, farmerId, amount } = req.body;
    const escrow = await escrowService.createEscrow({
      orderId,
      buyerId: req.user!.id,
      farmerId,
      amount: parseFloat(amount)
    });
    res.status(201).json(escrow);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const escrow = await escrowService.getEscrowById(req.params.id);
    res.json(escrow);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/:id/confirm', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const escrow = await escrowService.confirmDelivery(req.params.id, req.user!.id);
    res.json(escrow);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/dispute', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ error: 'Dispute reason is required' });
    }
    const escrow = await escrowService.raiseDispute(req.params.id, req.user!.id, reason);
    res.json(escrow);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
