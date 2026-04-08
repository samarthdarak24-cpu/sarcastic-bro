/* ========================================================================
   Auth Controller — HTTP handlers for authentication
   ======================================================================== */

import type { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema, refreshSchema, updateProfileSchema, submitKYCSchema } from "./auth.validation";
import { sendSuccess, sendCreated } from "../../utils/response";

export class AuthController {
  static async register(req: AuthRequest, res: Response) {
    const data = registerSchema.parse(req.body);
    const result = await AuthService.register(data);
    return sendCreated(res, result, "Account created successfully");
  }

  static async login(req: AuthRequest, res: Response) {
    const data = loginSchema.parse(req.body);
    const result = await AuthService.login(data);
    return sendSuccess(res, result, "Login successful");
  }

  static async refresh(req: AuthRequest, res: Response) {
    const { refreshToken } = refreshSchema.parse(req.body);
    const result = await AuthService.refreshToken(refreshToken);
    return sendSuccess(res, result, "Token refreshed");
  }

  static async logout(req: AuthRequest, res: Response) {
    const refreshToken =
      typeof req.body?.refreshToken === "string" ? req.body.refreshToken : undefined;

    if (req.user) {
      const userId = req.user.userId || req.user.id;
      await AuthService.logout(userId, refreshToken);
    }
    return sendSuccess(res, null, "Logged out successfully");
  }

  static async me(req: AuthRequest, res: Response) {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendSuccess(res, null, "Unauthorized");
    }
    const user = await AuthService.getCurrentUser(userId);
    return sendSuccess(res, user, "Current user");
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendSuccess(res, null, "Unauthorized");
    }
    const data = updateProfileSchema.parse(req.body);
    const user = await AuthService.updateProfile(userId, data);
    return sendSuccess(res, user, "Profile updated successfully");
  }

  static async uploadAvatar(req: AuthRequest, res: Response) {
    if (!req.file) {
      return sendSuccess(res, null, "No file uploaded");
    }
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendSuccess(res, null, "Unauthorized");
    }
    const avatarUrl = `/uploads/images/${req.file.filename}`;
    const user = await AuthService.uploadAvatar(userId, avatarUrl);
    return sendSuccess(res, { ...user, avatarUrl }, "Avatar uploaded successfully");
  }

  static async submitKYC(req: AuthRequest, res: Response) {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendSuccess(res, null, "Unauthorized");
    }
    const data = submitKYCSchema.parse(req.body);
    const documentUrls = req.files
      ? (req.files as Express.Multer.File[]).map((f) => `/uploads/kyc/${f.filename}`)
      : [];
    const result = await AuthService.submitKYC(userId, data, documentUrls);
    return sendSuccess(res, result, "KYC submitted successfully");
  }

  static async getKYCStatus(req: AuthRequest, res: Response) {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return sendSuccess(res, null, "Unauthorized");
    }
    const status = await AuthService.getKYCStatus(userId);
    return sendSuccess(res, status);
  }

  static async getKYCInfo(req: AuthRequest, res: Response) {
    const info = await AuthService.getKYCInfo(req.params.userId);
    return sendSuccess(res, info);
  }
}
