import { Router, Response } from 'express';
import { MarketIntelligenceService } from './market-intelligence.service';
import { authenticateToken, requireBuyer, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const marketIntelligenceService = new MarketIntelligenceService();

// GET /api/buyer/market-intelligence - Get market intelligence
router.get('/', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string,
      location: req.query.location as string,
      days: req.query.days ? parseInt(req.query.days as string) : 30
    };

    const result = await marketIntelligenceService.getMarketIntelligence(filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buyer/market-intelligence/trends - Get price trends
router.get('/trends', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string,
      location: req.query.location as string,
      days: req.query.days ? parseInt(req.query.days as string) : 90
    };

    const result = await marketIntelligenceService.getPriceTrends(filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buyer/market-intelligence/forecasts - Get price forecasts
router.get('/forecasts', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string,
      location: req.query.location as string
    };

    const result = await marketIntelligenceService.getForecasts(filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/buyer/market-intelligence/insights - Get market insights
router.get('/insights', authenticateToken, requireBuyer, async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string,
      location: req.query.location as string
    };

    const result = await marketIntelligenceService.getMarketInsights(filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
