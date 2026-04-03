import { Router } from "express";
import { AnalyticsController } from "../controllers/analyticsController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Protected routes
router.use(authMiddleware);

router.get("/farmer", AnalyticsController.getFarmerInsights);

export default router;
