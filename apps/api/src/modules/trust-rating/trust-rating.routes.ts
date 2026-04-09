import { Router } from "express";
import { TrustRatingController } from "./trust-rating.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Submit rating (requires auth)
router.post("/submit", authMiddleware, TrustRatingController.submitRating);

// Get ratings for a user (public)
router.get("/user/:userId", TrustRatingController.getRatings);

// Get user reputation profile (public)
router.get("/profile/:userId", TrustRatingController.getUserReputation);

// Get average rating (public)
router.get("/average/:userId", TrustRatingController.getAverageRating);

// Get top rated users (public)
router.get("/top", TrustRatingController.getTopRatedUsers);

// Calculate reputation score (public)
router.get("/score/:userId", TrustRatingController.calculateReputationScore);

export default router;
