/* ========================================================================
   Supplier Insights Routes — /supplier-insights/*
   ======================================================================== */

import { Router } from "express";
import supplierInsightsController from "./supplier-insights.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// ========================================================================
// MAIN ENDPOINTS - Task 22.2
// ========================================================================

// GET /supplier-insights/compare - Compare multiple suppliers (query params)
// Requirement 20: Acceptance Criteria 5
router.get("/compare", asyncHandler(supplierInsightsController.compareSuppliersGet.bind(supplierInsightsController)));

// GET /supplier-insights/recommendations - Get AI supplier recommendations (query params)
// Requirement 20: Acceptance Criteria 3
router.get("/recommendations", asyncHandler(supplierInsightsController.getRecommendationsGet.bind(supplierInsightsController)));

// GET /supplier-insights/:farmerId - Get comprehensive supplier insights
// Requirement 20: Acceptance Criteria 1, 4, 6
router.get("/:farmerId", asyncHandler(supplierInsightsController.getSupplierInsights.bind(supplierInsightsController)));

// ========================================================================
// DETAILED ENDPOINTS - Specific metrics and analytics
// ========================================================================

// GET /supplier-insights/:farmerId/metrics - Get detailed supplier metrics
// Requirement 20: Acceptance Criteria 1
router.get("/:farmerId/metrics", asyncHandler(supplierInsightsController.getSupplierMetrics.bind(supplierInsightsController)));

// GET /supplier-insights/:farmerId/patterns - Get supplier patterns and trends
// Requirement 20: Acceptance Criteria 4
router.get("/:farmerId/patterns", asyncHandler(supplierInsightsController.getSupplierPatterns.bind(supplierInsightsController)));

// GET /supplier-insights/:farmerId/scorecard - Get comprehensive supplier scorecard
// Requirement 20: Acceptance Criteria 6
router.get("/:farmerId/scorecard", asyncHandler(supplierInsightsController.getSupplierScorecard.bind(supplierInsightsController)));

// GET /supplier-insights/:supplierId/performance - Get supplier performance analytics
router.get("/:supplierId/performance", asyncHandler(supplierInsightsController.getPerformanceAnalytics.bind(supplierInsightsController)));

// GET /supplier-insights/:supplierId/quality - Get quality consistency tracker
router.get("/:supplierId/quality", asyncHandler(supplierInsightsController.getQualityTracker.bind(supplierInsightsController)));

// GET /supplier-insights/:supplierId/delivery - Get delivery reliability score
router.get("/:supplierId/delivery", asyncHandler(supplierInsightsController.getDeliveryReliability.bind(supplierInsightsController)));

// GET /supplier-insights/:supplierId/pricing - Get price competitiveness analysis
router.get("/:supplierId/pricing", asyncHandler(supplierInsightsController.getPriceCompetitiveness.bind(supplierInsightsController)));

// GET /supplier-insights/:supplierId/risk - Get risk assessment
router.get("/:supplierId/risk", asyncHandler(supplierInsightsController.getRiskAssessment.bind(supplierInsightsController)));

// GET /supplier-insights/:supplierId/communication - Get communication metrics
router.get("/:supplierId/communication", asyncHandler(supplierInsightsController.getCommunicationMetrics.bind(supplierInsightsController)));

// GET /supplier-insights/:supplierId/availability - Get product availability forecast
router.get("/:supplierId/availability", asyncHandler(supplierInsightsController.getAvailabilityForecast.bind(supplierInsightsController)));

// GET /supplier-insights/:supplierId/trust - Get trust verification status
router.get("/:supplierId/trust", asyncHandler(supplierInsightsController.getTrustVerification.bind(supplierInsightsController)));

// ========================================================================
// POST ENDPOINTS - For complex requests with body data
// ========================================================================

// POST /supplier-insights/compare - Compare multiple suppliers (body)
router.post("/compare", asyncHandler(supplierInsightsController.compareSuppliers.bind(supplierInsightsController)));

// POST /supplier-insights/recommendations - Get AI supplier recommendations (body)
router.post("/recommendations", asyncHandler(supplierInsightsController.getRecommendations.bind(supplierInsightsController)));

export default router;
