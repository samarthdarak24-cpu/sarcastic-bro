/**
 * Export Intelligence Hub Routes
 */

import { Router } from 'express';
import { ExportIntelligenceController } from './export-intelligence.controller';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();

/**
 * @route GET /api/export/mandi-prices
 * @query {string} crop - Crop name (e.g., Tomato, Onion)
 * @query {string} state - State name (optional)
 * @desc Get current mandi prices for a crop
 */
router.get('/mandi-prices', authenticate, ExportIntelligenceController.getMandiPrices);

/**
 * @route GET /api/export/mandi-trends
 * @query {string} crop - Crop name
 * @query {number} days - Number of days (default: 7)
 * @desc Get price trends for a crop
 */
router.get('/mandi-trends', authenticate, ExportIntelligenceController.getMandiTrends);

/**
 * @route GET /api/export/trending-crops
 * @desc Get trending crops by price movement
 */
router.get('/trending-crops', authenticate, ExportIntelligenceController.getTrendingCrops);

/**
 * @route GET /api/export/global-prices
 * @query {string} crop - Crop name
 * @desc Get global price comparison
 */
router.get('/global-prices', authenticate, ExportIntelligenceController.getGlobalPrices);

/**
 * @route GET /api/export/forex-rates
 * @desc Get current forex rates
 */
router.get('/forex-rates', authenticate, ExportIntelligenceController.getForexRates);

/**
 * @route GET /api/export/seasonal-trends
 * @query {string} crop - Crop name
 * @desc Get seasonal trends for a crop
 */
router.get('/seasonal-trends', authenticate, ExportIntelligenceController.getSeasonalTrends);

/**
 * @route GET /api/export/demand-heatmap
 * @desc Get global demand heatmap (crop x country)
 */
router.get('/demand-heatmap', authenticate, ExportIntelligenceController.getDemandHeatmap);

/**
 * @route GET /api/export/profit-calculator
 * @query {string} crop - Crop name
 * @query {number} quantity - Quantity in quintals
 * @query {string} destination - Destination country (optional)
 * @query {string} state - Farm state (optional)
 * @desc Calculate profit comparison for local vs export sale
 */
router.get('/profit-calculator', authenticate, ExportIntelligenceController.calculateProfit);

/**
 * @route GET /api/export/profit-sensitivity
 * @query {string} crop - Crop name
 * @query {number} quantity - Quantity in quintals
 * @query {string} destination - Destination country
 * @query {number} minPrice - Minimum price for simulation
 * @query {number} maxPrice - Maximum price for simulation
 * @desc Get sensitivity analysis for profit at different price points
 */
router.get(
  '/profit-sensitivity',
  authenticate,
  ExportIntelligenceController.getProfitSensitivity
);

/**
 * @route POST /api/export/recommendations
 * @body {Array<{name, quantity}>} crops - Array of crops
 * @body {string} location - Farm location
 * @desc Get AI-powered export recommendations
 */
router.post('/recommendations', authenticate, ExportIntelligenceController.getRecommendations);

/**
 * @route GET /api/export/alerts
 * @query {string} crop - Crop name
 * @query {string} location - Farm location
 * @desc Get real-time export opportunities and alerts
 */
router.get('/alerts', authenticate, ExportIntelligenceController.getExportAlerts);

/**
 * @route GET /api/export/optimal-quantity
 * @query {string} crop - Crop name
 * @query {number} available - Available quantity
 * @query {number} budget - Maximum budget
 * @query {string} destination - Destination country
 * @desc Calculate optimal export quantity within budget
 */
router.get(
  '/optimal-quantity',
  authenticate,
  ExportIntelligenceController.getOptimalQuantity
);

/**
 * @route GET /api/export/multi-country-comparison
 * @query {string} crop - Crop name
 * @query {number} quantity - Quantity in quintals
 * @query {string} countries - Comma-separated country list
 * @desc Compare profitability across multiple export destinations
 */
router.get(
  '/multi-country-comparison',
  authenticate,
  ExportIntelligenceController.getMultiCountryComparison
);

/**
 * @route GET /api/export/recommendations/:id
 * @desc Get detailed recommendation with historical data
 */
router.get('/recommendations/:id', authenticate, ExportIntelligenceController.getRecommendationDetail);

export default router;
