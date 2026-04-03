import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { sendCreated, sendSuccess, sendPaginated } from "../../utils/response";

export class ReviewController {
  static async createReview(req: Request, res: Response) {
    const { targetId, productId, rating, comment } = req.body;
    const review = await ReviewService.createReview(req.user!.userId, {
      targetId,
      productId,
      rating,
      comment,
    });
    return sendCreated(res, review, "Review published");
  }

  static async getReviews(req: Request, res: Response) {
    const { userId, page = "1", limit = "20" } = req.query;
    const result = await ReviewService.getReviews(userId as string, {
      page: Number(page),
      limit: Number(limit),
    });
    return sendPaginated(res, result.reviews, result.total, Number(page), Number(limit));
  }

  static async getProductReviews(req: Request, res: Response) {
    const { page = "1", limit = "20" } = req.query;
    const result = await ReviewService.getProductReviews(req.params.productId, {
      page: Number(page),
      limit: Number(limit),
    });
    return sendPaginated(res, result.reviews, result.total, Number(page), Number(limit));
  }

  static async updateReview(req: Request, res: Response) {
    const { rating, comment } = req.body;
    const review = await ReviewService.updateReview(req.params.reviewId, req.user!.userId, {
      rating,
      comment,
    });
    return sendSuccess(res, review, "Review updated");
  }

  static async deleteReview(req: Request, res: Response) {
    await ReviewService.deleteReview(req.params.reviewId, req.user!.userId);
    return sendSuccess(res, null, "Review deleted");
  }

  static async addReview(req: Request, res: Response) {
    const { productId } = req.params;
    const data = req.body;
    const review = await ReviewService.createReview(req.user!.userId, {
      targetId: data.targetId,
      productId,
      rating: data.rating,
      comment: data.comment,
    });
    return sendCreated(res, review, "Review added successfully");
  }
}
