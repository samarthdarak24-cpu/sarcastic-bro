import { Router } from "express";
import { AnalyticsController } from "../controllers/analyticsController";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Protected routes
router.use(authenticateToken);

router.get("/farmer", AnalyticsController.getFarmerInsights);
router.get("/buyer", AnalyticsController.getBuyerInsights);
router.get("/fpo", AnalyticsController.getFPOInsights);

export default router;
