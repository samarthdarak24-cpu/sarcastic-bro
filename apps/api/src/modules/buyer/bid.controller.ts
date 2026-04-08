import { Router, Response } from 'express';
import { BidService } from './bid.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const bidService = new BidService();

router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await bidService.getBids(req.user!.id, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity, pricePerUnit, validUntil, notes } = req.body;
    const bid = await bidService.placeBid({
      buyerId: req.user!.id,
      productId,
      quantity: parseFloat(quantity),
      pricePerUnit: parseFloat(pricePerUnit),
      validUntil: new Date(validUntil),
      notes
    });
    res.status(201).json(bid);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const bid = await bidService.getBidById(req.params.id);
    res.json(bid);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const bid = await bidService.updateBid(req.params.id, req.body);
    res.json(bid);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
