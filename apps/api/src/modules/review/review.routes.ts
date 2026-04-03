/* ========================================================================
   Review Routes — /reviews/*
   ======================================================================== */

import { Router } from "express";
import { ReviewController } from "./review.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// Review endpoints
router.post("/", asyncHandler(ReviewController.createReview));
router.get("/user/:userId", asyncHandler(ReviewController.getReviews));
router.get("/product/:productId", asyncHandler(ReviewController.getProductReviews));
router.patch("/:reviewId", asyncHandler(ReviewController.updateReview));
router.delete("/:reviewId", asyncHandler(ReviewController.deleteReview));

export default router;
