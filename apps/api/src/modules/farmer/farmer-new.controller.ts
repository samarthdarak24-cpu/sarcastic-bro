import { Router, Response } from 'express';
import { FarmerService } from './farmer.service';
import { authenticateToken, requireFarmer, AuthRequest } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router();
const farmerService = new FarmerService();

// Dashboard
router.get('/dashboard', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const dashboard = await farmerService.getDashboard(farmerId);
    res.json(dashboard);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 1. KYC Registration
router.post('/kyc', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const result = await farmerService.updateKYC(farmerId, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/kyc/status', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const status = await farmerService.getKYCStatus(farmerId);
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Crop Listing
router.post('/crops', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const crop = await farmerService.createCropListing(farmerId, req.body);
    res.status(201).json(crop);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/crops', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await farmerService.getFarmerCrops(farmerId, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/crops/:id', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const crop = await farmerService.updateCrop(req.params.id, farmerId, req.body);
    res.json(crop);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/crops/:id', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    await farmerService.deleteCrop(req.params.id, farmerId);
    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 3. AI Quality Certificate
router.post('/quality/analyze', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const { imageUrl } = req.body;
    const analysis = await farmerService.analyzeQuality(imageUrl);
    res.json(analysis);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 4. FPO Linking
router.post('/fpo/link', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const { fpoId } = req.body;
    const result = await farmerService.linkToFPO(farmerId, fpoId);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/fpo/linked', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const fpos = await farmerService.getLinkedFPOs(farmerId);
    res.json(fpos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/crops/:cropId/send-to-fpo', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const { fpoFarmerId } = req.body;
    const result = await farmerService.sendCropToFPO(req.params.cropId, farmerId, fpoFarmerId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Market Prices
router.get('/market-prices', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      cropName: req.query.cropName as string,
      district: req.query.district as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };
    const prices = await farmerService.getMarketPrices(filters);
    res.json(prices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/market-prices/historical', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const cropName = req.query.cropName as string;
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const prices = await farmerService.getHistoricalPrices(cropName, days);
    res.json(prices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Orders
router.get('/orders', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const filters = {
      status: req.query.status as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await farmerService.getFarmerOrders(farmerId, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders/stats', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const stats = await farmerService.getOrderStats(farmerId);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Wallet
router.get('/wallet', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const wallet = await farmerService.getWallet(farmerId);
    res.json(wallet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Earnings
router.get('/earnings', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };
    const result = await farmerService.getEarnings(farmerId, filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Logistics
router.post('/logistics/pickup', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const result = await farmerService.requestPickup(farmerId, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
