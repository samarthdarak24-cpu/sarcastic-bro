import { Router, Response } from 'express';
import { BlockchainService } from './blockchain.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const blockchainService = new BlockchainService();

router.get('/trace/:productId', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const trace = await blockchainService.getProductTrace(req.params.productId);
    res.json(trace);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/transactions', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      type: req.query.type as string,
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await blockchainService.getTransactions(req.user!.id, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/transactions', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const { type, amount, fromAddress, toAddress, metadata } = req.body;
    const transaction = await blockchainService.createTransaction({
      userId: req.user!.id,
      type,
      amount: amount ? parseFloat(amount) : undefined,
      fromAddress,
      toAddress,
      metadata
    });
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/transactions/:id', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await blockchainService.getTransactionById(req.params.id);
    res.json(transaction);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
