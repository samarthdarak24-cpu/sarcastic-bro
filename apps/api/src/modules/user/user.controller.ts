import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { sendSuccess } from "../../utils/response";

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.getProfile(req.user!.userId);
      return sendSuccess(res, result, "Profile fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.updateProfile(req.user!.userId, req.body);
      return sendSuccess(res, result, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async uploadPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      const result = await UserService.uploadPhoto(req.user!.userId, req.file.path);
      return sendSuccess(res, result, "Photo uploaded successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user reputation score.
   * Path: /reputation/:id
   */
  static async getReputation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await UserService.getReputation(id);
      return sendSuccess(res, result, "Reputation fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * Force update user reputation (Admin/System).
   * Path: /reputation/update/:id
   */
  static async updateReputation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await UserService.updateReputationScore(id);
      const result = await UserService.getReputation(id);
      return sendSuccess(res, result, "Reputation updated successfully");
    } catch (error) {
      next(error);
    }
  }
}
