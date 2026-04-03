import { Router } from "express";
import { LogisticsController } from "./logistics.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

/* Logistics/Shipment Endpoints */
router.post("/", asyncHandler(LogisticsController.bookShipment));
router.get("/", asyncHandler(LogisticsController.listMyShipments));
router.get("/:id", asyncHandler(LogisticsController.getShipmentById));
router.patch("/:id/status", asyncHandler(LogisticsController.updateStatus));
router.get("/track/:trackingId", asyncHandler(LogisticsController.getShipmentTracking));

export default router;
