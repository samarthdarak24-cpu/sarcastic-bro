import { Router } from 'express';
import { ProductHubController } from './product-hub.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new ProductHubController();

// All routes require authentication
router.use(authMiddleware);

// AI Optimizer
router.post('/optimize/:productId', controller.optimizeProduct.bind(controller));

// Dynamic Pricing
router.get('/pricing/recommendations', controller.getPricingRecommendations.bind(controller));

// Quality Analytics
router.post('/quality/analyze/:productId', controller.analyzeQuality.bind(controller));

// Inventory Forecast
router.get('/inventory/forecast', controller.getInventoryForecast.bind(controller));

// Multi-Channel Sync
router.post('/channels/:channelId/sync', controller.syncChannel.bind(controller));

// Smart Bundles
router.get('/bundles/suggestions', controller.getBundleSuggestions.bind(controller));
router.post('/bundles/create', controller.createBundle.bind(controller));

// Performance Dashboard
router.get('/performance/metrics', controller.getPerformanceMetrics.bind(controller));

// Competitor Analysis
router.get('/competitor/analysis/:productId', controller.getCompetitorAnalysis.bind(controller));

// Seasonal Trends
router.get('/trends/seasonal/:productId', controller.getSeasonalTrends.bind(controller));

// Auto-Listing Generator
router.post('/listing/generate/:productId', controller.generateListing.bind(controller));
router.post('/listing/apply/:productId', controller.applyListing.bind(controller));

export default router;
