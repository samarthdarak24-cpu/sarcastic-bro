/* ========================================================================
   Notification Routes — /notifications/*
   ======================================================================== */

import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// Notification endpoints
router.get("/", asyncHandler(NotificationController.getMyNotifications));
router.get("/unread/count", asyncHandler(NotificationController.getUnreadCount));
router.get("/:id", asyncHandler(NotificationController.getNotification));
router.patch("/:id/read", asyncHandler(NotificationController.markAsRead));
router.patch("/read-all", asyncHandler(NotificationController.markAllAsRead));
router.delete("/:id", asyncHandler(NotificationController.deleteNotification));
router.delete("/", asyncHandler(NotificationController.deleteAllNotifications));

export default router;
