import { Router } from "express";
import { FarmerDashboardController } from "./farmer.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import escrowController from "./escrow.controller";

const router = Router();

// Dashboard Summary & KPIs
router.get("/metrics", authMiddleware, asyncHandler(FarmerDashboardController.getDashboardMetrics));

// Live Mandi Price Stream
router.get("/mandi-prices", asyncHandler(FarmerDashboardController.getMandiPrices));

// Global Export Opportunities
router.get("/export-data", asyncHandler(FarmerDashboardController.getExportOpportunities));

// Recent Activity Intelligence
router.get("/recent-activity", authMiddleware, asyncHandler(FarmerDashboardController.getRecentActivity));

// Core Data Access
router.get("/crops", authMiddleware, asyncHandler(FarmerDashboardController.getCrops));
router.get("/orders", authMiddleware, asyncHandler(FarmerDashboardController.getOrders));
router.get("/production-overview", authMiddleware, asyncHandler(FarmerDashboardController.getProductionOverview));

// Escrow Payments
router.use("/escrow", escrowController);

export default router;
