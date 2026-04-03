/* ========================================================================
   Auth Routes — /auth/*
   ======================================================================== */

import { Router } from "express";
import { AuthController } from "./auth.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";
import { uploadImages } from "../../middleware/upload.middleware";

const router = Router();

// Auth endpoints
router.post("/register", asyncHandler(AuthController.register));
router.post("/login",    asyncHandler(AuthController.login));
router.post("/refresh",  asyncHandler(AuthController.refresh));
router.post("/logout",   authMiddleware, asyncHandler(AuthController.logout));
router.get("/me",        authMiddleware, asyncHandler(AuthController.me));
router.get("/profile",   authMiddleware, asyncHandler(AuthController.me));

// Profile endpoints
router.put("/profile/update", authMiddleware, asyncHandler(AuthController.updateProfile));
router.post("/profile/avatar", authMiddleware, uploadImages.single("avatar"), asyncHandler(AuthController.uploadAvatar));

// KYC endpoints
router.post("/kyc/submit", authMiddleware, uploadImages.array("documents", 10), asyncHandler(AuthController.submitKYC));
router.get("/kyc/status",  authMiddleware, asyncHandler(AuthController.getKYCStatus));
router.get("/kyc/:userId", asyncHandler(AuthController.getKYCInfo)); // Admin/public info

export default router;
