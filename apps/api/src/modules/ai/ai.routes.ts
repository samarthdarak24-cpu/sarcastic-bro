/* ========================================================================
   AI Routes — /ai/*
   ======================================================================== */

import { Router } from "express";
import { AIController } from "./ai.controller";
import { BehaviorController } from "./behavior.controller";
import { ChatController } from "./chat.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer for local uploads
const uploadDir = path.join(process.cwd(), "uploads", "images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const router = Router();

router.use(authMiddleware);

// /ai/quality-grade
router.post("/quality-grade", upload.single("image"), asyncHandler(AIController.analyzeQuality));

// /ai/pest-detection
router.post("/pest-detection", asyncHandler(AIController.detectPests));

// /ai/crop-recommendation
router.get("/crop-recommendation", asyncHandler(AIController.getCropRecommendations));

// /ai/price-advisor
router.post("/price-advisor", asyncHandler(AIController.getPriceAdvice));

// /ai/procurement
router.post("/procurement", asyncHandler(AIController.getProcurementRecommendations));

// /ai/insights
router.post("/insights", asyncHandler(AIController.getUnifiedInsights));

// Behavioral AI routes
router.post("/behavior/track", asyncHandler(BehaviorController.trackEvent));
router.get("/behavior/insights", asyncHandler(BehaviorController.getInsights));

// Advanced AI Chat routes (ChatGPT-like)
router.post("/chat/message", asyncHandler(ChatController.sendMessage));
router.get("/chat/suggestions", asyncHandler(ChatController.getSuggestions));
router.get("/chat/history", asyncHandler(ChatController.getHistory));
router.delete("/chat/history", asyncHandler(ChatController.clearHistory));

export default router;
