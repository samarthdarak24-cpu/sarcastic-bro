/* ========================================================================
   Supplier Insights Routes — /supplier-insights/*
   ======================================================================== */

import { Router } from "express";
import supplierInsightsController from "./supplier-insights.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

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

// POST /supplier-insights/compare - Compare multiple suppliers
router.post("/compare", asyncHandler(supplierInsightsController.compareSuppliers.bind(supplierInsightsController)));

// POST /supplier-insights/recommendations - Get AI supplier recommendations
router.post("/recommendations", asyncHandler(supplierInsightsController.getRecommendations.bind(supplierInsightsController)));

export default router;
