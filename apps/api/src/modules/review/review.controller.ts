/* ========================================================================
   Review Controller — HTTP handlers for reviews and ratings
   ======================================================================== */

import type { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { sendSuccess, sendCreated } from "../../utils/response";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export class ReviewController {
  /**
   * POST /reviews
   * Create a new review
   */
  static async createReview(req: AuthRequest, res: Response) {
    try {
      const { targetId, productId, rating, comment } = req.body;
      const authorId = req.user?.userId;

      if (!authorId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }

      const review = await ReviewService.createReview({
        authorId,
        targetId,
        productId,
        rating,
        comment,
      });

      return sendCreated(res, review, "Review created successfully");
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /reviews/user/:userId
   * Get reviews for a user
   */
  static async getReviews(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;

      const reviews = await ReviewService.getReviews(userId);
      return sendSuccess(res, reviews, "Reviews retrieved");
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /reviews/product/:productId
   * Get reviews for a product
   */
  static async getProductReviews(req: AuthRequest, res: Response) {
    try {
      const { productId } = req.params;

      const reviews = await ReviewService.getProductReviews(productId);
      return sendSuccess(res, reviews, "Product reviews retrieved");
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * PATCH /reviews/:reviewId
   * Update a review
   */
  static async updateReview(req: AuthRequest, res: Response) {
    try {
      const { reviewId } = req.params;
      const authorId = req.user?.userId;

      if (!authorId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const review = await ReviewService.updateReview(reviewId, authorId, req.body);
      return sendSuccess(res, review, "Review updated");
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * DELETE /reviews/:reviewId
   * Delete a review
   */
  static async deleteReview(req: AuthRequest, res: Response) {
    try {
      const { reviewId } = req.params;
      const authorId = req.user?.userId;

      if (!authorId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await ReviewService.deleteReview(reviewId, authorId);
      return sendSuccess(res, null, "Review deleted");
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
