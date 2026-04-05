import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler(NotificationController.getAll));
router.patch("/read-all", asyncHandler(NotificationController.markAllRead));
router.patch("/:id/read", asyncHandler(NotificationController.markOneRead));
router.delete("/clear", asyncHandler(NotificationController.clearAll));
router.post("/send", asyncHandler(NotificationController.send));

export default router;
