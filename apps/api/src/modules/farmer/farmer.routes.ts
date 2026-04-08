import { Router } from "express";
import { FarmerDashboardController } from "./farmer.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Dashboard Summary & KPIs
router.get("/metrics", authMiddleware, FarmerDashboardController.getDashboardMetrics);

// Live Mandi Price Stream
router.get("/mandi-prices", FarmerDashboardController.getMandiPrices);

// Global Export Opportunities
router.get("/export-data", FarmerDashboardController.getExportOpportunities);

// Recent Activity Intelligence
router.get("/recent-activity", authMiddleware, FarmerDashboardController.getRecentActivity);

// Core Data Access
router.get("/crops", authMiddleware, FarmerDashboardController.getCrops);
router.get("/orders", authMiddleware, FarmerDashboardController.getOrders);

export default router;
