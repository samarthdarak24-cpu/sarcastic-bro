import { Request, Response, NextFunction } from "express";
import { FavoritesService } from "./favorites.service";
import { ApiError } from "../../utils/ApiError";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
  };
}

export class FavoritesController {
  /**
   * Add farmer to favorites
   * POST /api/favorites
   */
  static async addFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw ApiError.unauthorized("User not authenticated");
      }

      const { farmerId, notes } = req.body;

      if (!farmerId) {
        throw ApiError.badRequest("farmerId is required");
      }

      const favorite = await FavoritesService.addFavorite(req.user.userId, {
        farmerId,
        notes,
      });

      res.status(201).json({
        success: true,
        data: favorite,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove farmer from favorites
   * DELETE /api/favorites/:farmerId
   */
  static async removeFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw ApiError.unauthorized("User not authenticated");
      }

      const { farmerId } = req.params;

      if (!farmerId) {
        throw ApiError.badRequest("farmerId is required");
      }

      const result = await FavoritesService.removeFavorite(req.user.userId, farmerId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all favorites for buyer
   * GET /api/favorites
   */
  static async getFavorites(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw ApiError.unauthorized("User not authenticated");
      }

      const favorites = await FavoritesService.getFavorites(req.user.userId);

      res.status(200).json({
        success: true,
        data: favorites,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update favorite notes
   * PATCH /api/favorites/:farmerId
   */
  static async updateFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw ApiError.unauthorized("User not authenticated");
      }

      const { farmerId } = req.params;
      const { notes } = req.body;

      if (!farmerId) {
        throw ApiError.badRequest("farmerId is required");
      }

      const favorite = await FavoritesService.updateFavorite(req.user.userId, farmerId, {
        notes,
      });

      res.status(200).json({
        success: true,
        data: favorite,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get favorite count for a farmer
   * GET /api/favorites/count/:farmerId
   */
  static async getFavoriteCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { farmerId } = req.params;

      if (!farmerId) {
        throw ApiError.badRequest("farmerId is required");
      }

      const result = await FavoritesService.getFavoriteCount(farmerId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check if farmer is favorited
   * GET /api/favorites/check/:farmerId
   */
  static async checkFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) {
        throw ApiError.unauthorized("User not authenticated");
      }

      const { farmerId } = req.params;

      if (!farmerId) {
        throw ApiError.badRequest("farmerId is required");
      }

      const isFavorited = await FavoritesService.isFavorited(req.user.userId, farmerId);

      res.status(200).json({
        success: true,
        data: { isFavorited },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get top favorited farmers
   * GET /api/favorites/top
   */
  static async getTopFarmers(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const farmers = await FavoritesService.getTopFarmersByFavorites(limit);

      res.status(200).json({
        success: true,
        data: farmers,
      });
    } catch (error) {
      next(error);
    }
  }
}
