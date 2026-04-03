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
router.get("/with/:userId", asyncHandler(MessageController.getConversation));
router.patch("/:messageId/read", asyncHandler(MessageController.markAsRead));
router.delete("/:messageId", asyncHandler(MessageController.deleteMessage));
router.get("/unread/count", asyncHandler(MessageController.getUnreadCount));

export default router;
