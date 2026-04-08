/* ========================================================================
   Message Routes — /messages/*
   ======================================================================== */

import { Router } from "express";
import { MessageController } from "./message.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// Message endpoints
router.post("/",           asyncHandler(MessageController.sendMessage));
router.get("/conversations", asyncHandler(MessageController.getConversations));
router.get("/conversation/:userId", asyncHandler(MessageController.getConversationMessages));
router.get("/with/:userId", asyncHandler(MessageController.getConversationMessages)); // Alias for frontend compatibility
router.put("/:id/read", asyncHandler(MessageController.markAsRead));
router.patch("/:id/read", asyncHandler(MessageController.markAsRead)); // Alias for PATCH method
router.post("/typing", asyncHandler(MessageController.emitTyping));
router.get("/unread-count", asyncHandler(MessageController.getUnreadCount));
router.get("/search", asyncHandler(MessageController.searchMessages));

export default router;
