import { Router } from 'express';
import { MarketController } from '../controllers/market.controller';

const router = Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────────────

// Get latest prices with filters
router.get('/', MarketController.getPrices);

// Get distinct crops for filters
router.get('/crops', MarketController.getDistinctCrops);

// Get distinct districts for filters
router.get('/districts', MarketController.getDistinctDistricts);

// Get price trends and AI recommendations
router.get('/trends', MarketController.getTrends);

// ─── ADMINISTRATIVE / SYSTEM ROUTES ─────────────────────────────────────

// Trigger manual fetch from external source (Agmarknet)
router.post('/fetch', MarketController.fetchPrices);

export default router;
