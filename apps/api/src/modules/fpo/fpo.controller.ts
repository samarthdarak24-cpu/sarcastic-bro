import { Router, Response } from 'express';
import { FPOService } from './fpo.service';
import { authenticateToken, requireFPO, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const fpoService = new FPOService();

// 1. FPO Dashboard
router.get('/dashboard', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const dashboard = await fpoService.getDashboard(fpoId);
    res.json(dashboard);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Farmer Onboarding
router.post('/farmers', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const farmer = await fpoService.onboardFarmer(fpoId, req.body);
    res.status(201).json(farmer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Farmer Management
router.get('/farmers', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const filters = {
      search: req.query.search as string,
      isActive: req.query.isActive === 'true',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await fpoService.getFarmers(fpoId, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/farmers/:id', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const farmer = await fpoService.getFarmerById(req.params.id, fpoId);
    res.json(farmer);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// 4. Delegated Listing
router.post('/farmers/:farmerId/products', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const product = await fpoService.addProductForFarmer(fpoId, req.params.farmerId, req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Aggregation Engine
router.get('/aggregatable-crops', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const groups = await fpoService.getAggregatableCrops(fpoId);
    res.json(groups);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/aggregate', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const lot = await fpoService.aggregateCrops(fpoId, req.body);
    res.status(201).json(lot);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Quality Verification
router.put('/crops/:cropId/verify', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const crop = await fpoService.verifyQuality(fpoId, req.params.cropId, req.body);
    res.json(crop);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 7. Bulk Listing
router.get('/lots', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await fpoService.getAggregatedLots(fpoId, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Buyer Chat
router.get('/chats', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const chats = await fpoService.getChats(fpoId);
    res.json(chats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/chats/:chatId/messages', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const messages = await fpoService.getChatMessages(req.params.chatId, fpoId);
    res.json(messages);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/chats/:chatId/messages', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user!.userId;
    const { content, attachments } = req.body;
    const message = await fpoService.sendMessage(req.params.chatId, senderId, content, attachments);
    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 9. Escrow Payout
router.post('/orders/:orderId/payout', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const payouts = await fpoService.processEscrowPayout(req.params.orderId, fpoId);
    res.json(payouts);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/payouts', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const filters = {
      farmerId: req.query.farmerId as string,
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await fpoService.getPayouts(fpoId, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Logistics
router.post('/logistics', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const { orderId, ...logisticsData } = req.body;
    const logistics = await fpoService.createLogistics(orderId, fpoId, logisticsData);
    res.status(201).json(logistics);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/logistics', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await fpoService.getLogistics(fpoId, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/logistics/:id', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const logistics = await fpoService.getLogisticsById(req.params.id, fpoId);
    res.json(logistics);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/logistics/:id', authenticateToken, requireFPO, async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user!.fpoId;
    const logistics = await fpoService.updateLogistics(req.params.id, fpoId, req.body);
    res.json(logistics);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
