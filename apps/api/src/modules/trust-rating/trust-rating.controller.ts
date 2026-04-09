import { Request, Response, NextFunction } from "express";
import { TrustRatingService } from "./trust-rating.service";
import { ApiError } from "../../utils/ApiError";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
  };
}

export class TrustRatingController {
  /**
   * Submit a rating for a user
   * POST /api/trust-rating/submit
   */
  static async submitRating(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw ApiError.unauthorized("User not authenticated");
      }

      const { orderId, toUserId, stars, review } = req.body;

      if (!orderId || !toUserId || stars === undefined) {
        throw ApiError.badRequest("orderId, toUserId, and stars are required");
      }

      const rating = await TrustRatingService.submitRating(req.user.userId, {
        orderId,
        toUserId,
        stars,
        review,
      });

      res.status(201).json({
        success: true,
        data: rating,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ratings for a user
   * GET /api/trust-rating/user/:userId
   */
  static async getRatings(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      if (!userId) {
        throw ApiError.badRequest("userId is required");
      }

      const ratings = await TrustRatingService.getRatings(userId, limit);

      res.status(200).json({
        success: true,
        data: ratings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user reputation profile
   * GET /api/trust-rating/profile/:userId
   */
  static async getUserReputation(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw ApiError.badRequest("userId is required");
      }

      const reputation = await TrustRatingService.getUserReputation(userId);

      res.status(200).json({
        success: true,
        data: reputation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get average rating for a user
   * GET /api/trust-rating/average/:userId
   */
  static async getAverageRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw ApiError.badRequest("userId is required");
      }

      const average = await TrustRatingService.getAverageRating(userId);
      const count = await TrustRatingService.getRatingCount(userId);

      res.status(200).json({
        success: true,
        data: {
          userId,
          averageRating: average,
          totalRatings: count,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get top rated users
   * GET /api/trust-rating/top
   */
  static async getTopRatedUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const users = await TrustRatingService.getTopRatedUsers(limit);

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Calculate reputation score
   * GET /api/trust-rating/score/:userId
   */
  static async calculateReputationScore(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw ApiError.badRequest("userId is required");
      }

      const score = await TrustRatingService.calculateReputationScore(userId);

      res.status(200).json({
        success: true,
        data: {
          userId,
          reputationScore: score,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
