import { Router, Response } from 'express';
import { BulkTradeService } from './bulk-trade.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const bulkTradeService = new BulkTradeService();

router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await bulkTradeService.getBulkTrades(req.user!.id, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { bulkProductId, quantity, pricePerUnit, deliveryDate, notes } = req.body;
    const trade = await bulkTradeService.createBulkTrade({
      buyerId: req.user!.id,
      bulkProductId,
      quantity: parseFloat(quantity),
      pricePerUnit: parseFloat(pricePerUnit),
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      notes
    });
    res.status(201).json(trade);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const trade = await bulkTradeService.getBulkTradeById(req.params.id);
    res.json(trade);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const trade = await bulkTradeService.updateBulkTrade(req.params.id, req.body);
    res.json(trade);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
