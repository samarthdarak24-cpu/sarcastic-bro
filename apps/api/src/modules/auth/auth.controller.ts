/* ========================================================================
   Auth Controller — HTTP handlers for authentication
   ======================================================================== */

import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema, refreshSchema, updateProfileSchema, submitKYCSchema } from "./auth.validation";
import { sendSuccess, sendCreated } from "../../utils/response";

export class AuthController {
  static async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);
    const result = await AuthService.register(data);
    return sendCreated(res, result, "Account created successfully");
  }

  static async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const result = await AuthService.login(data);
    return sendSuccess(res, result, "Login successful");
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = refreshSchema.parse(req.body);
    const result = await AuthService.refreshToken(refreshToken);
    return sendSuccess(res, result, "Token refreshed");
  }

  static async logout(req: Request, res: Response) {
    const refreshToken =
      typeof req.body?.refreshToken === "string" ? req.body.refreshToken : undefined;

    if (req.user) {
      await AuthService.logout(req.user.userId, refreshToken);
    }
    return sendSuccess(res, null, "Logged out successfully");
  }

  static async me(req: Request, res: Response) {
    const user = await AuthService.getCurrentUser(req.user!.userId);
    return sendSuccess(res, user, "Current user");
  }

  static async updateProfile(req: Request, res: Response) {
    const data = updateProfileSchema.parse(req.body);
    const user = await AuthService.updateProfile(req.user!.userId, data);
    return sendSuccess(res, user, "Profile updated successfully");
  }

  static async uploadAvatar(req: Request, res: Response) {
    if (!req.file) {
      return sendSuccess(res, null, "No file uploaded");
    }
    const avatarUrl = `/uploads/images/${req.file.filename}`;
    const user = await AuthService.uploadAvatar(req.user!.userId, avatarUrl);
    return sendSuccess(res, user, "Avatar uploaded successfully");
  }

  static async submitKYC(req: Request, res: Response) {
    const data = submitKYCSchema.parse(req.body);
    const documentUrls = req.files
      ? (req.files as Express.Multer.File[]).map((f) => `/uploads/kyc/${f.filename}`)
      : [];
    const result = await AuthService.submitKYC(req.user!.userId, data, documentUrls);
    return sendSuccess(res, result, "KYC submitted successfully");
  }

  static async getKYCStatus(req: Request, res: Response) {
    const status = await AuthService.getKYCStatus(req.user!.userId);
    return sendSuccess(res, status);
  }

  static async getKYCInfo(req: Request, res: Response) {
    const info = await AuthService.getKYCInfo(req.params.userId);
    return sendSuccess(res, info);
  }
}
