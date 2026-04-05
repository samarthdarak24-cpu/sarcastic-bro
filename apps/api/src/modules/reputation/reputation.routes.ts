/* ========================================================================
   Reputation Routes — /reputation/*
   ======================================================================== */

import { Router } from "express";
import reputationController from "./reputation.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// GET /reputation/trust-score - Get buyer trust score
router.get("/trust-score", asyncHandler(reputationController.getTrustScore.bind(reputationController)));

// GET /reputation/reviews - Get buyer reviews
router.get("/reviews", asyncHandler(reputationController.getReviews.bind(reputationController)));

// GET /reputation/performance - Get performance metrics
router.get("/performance", asyncHandler(reputationController.getPerformanceMetrics.bind(reputationController)));

// GET /reputation/timeline - Get reputation timeline
router.get("/timeline", asyncHandler(reputationController.getReputationTimeline.bind(reputationController)));

// GET /reputation/peer-comparison - Get peer comparison data
router.get("/peer-comparison", asyncHandler(reputationController.getPeerComparison.bind(reputationController)));

// GET /reputation/badges - Get earned badges
router.get("/badges", asyncHandler(reputationController.getBadges.bind(reputationController)));

// GET /reputation/ai-insights - Get AI-powered insights
router.get("/ai-insights", asyncHandler(reputationController.getAIInsights.bind(reputationController)));

// GET /reputation/testimonials - Get testimonials
router.get("/testimonials", asyncHandler(reputationController.getTestimonials.bind(reputationController)));

// GET /reputation/disputes - Get disputes
router.get("/disputes", asyncHandler(reputationController.getDisputes.bind(reputationController)));

// GET /reputation/boost-campaigns - Get boost campaigns
router.get("/boost-campaigns", asyncHandler(reputationController.getBoostCampaigns.bind(reputationController)));

// POST /reputation/disputes/:disputeId/resolve - Resolve a dispute
router.post("/disputes/:disputeId/resolve", asyncHandler(reputationController.resolveDispute.bind(reputationController)));

// POST /reputation/badges/:badgeId/verify - Verify badge on blockchain
router.post("/badges/:badgeId/verify", asyncHandler(reputationController.verifyBadge.bind(reputationController)));

export default router;
