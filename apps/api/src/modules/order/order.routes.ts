/* ========================================================================
   Order Routes — /orders/*
   ======================================================================== */

import { Router } from "express";
import { OrderController } from "./order.controller";
import { AutoSellController } from "./autoSell.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// Order endpoints — static paths MUST come before /:id
router.get("/stats",        asyncHandler(OrderController.getStats));
router.post("/bulk-status", asyncHandler(OrderController.bulkStatusUpdate));

router.post("/",           asyncHandler(OrderController.create));
router.get("/",            asyncHandler(OrderController.getAll));
router.get("/:id",         asyncHandler(OrderController.getById));
router.get("/:id/history", asyncHandler(OrderController.getHistory));
router.patch("/:id/status", asyncHandler(OrderController.updateStatus));
router.delete("/:id",      asyncHandler(OrderController.cancel));

// Auto-Sell routes (Smart Deal Engine)
router.post("/auto-sell/rules", asyncHandler(AutoSellController.createRule));
router.get("/auto-sell/rules", asyncHandler(AutoSellController.getRules));
router.delete("/auto-sell/rules/:id", asyncHandler(AutoSellController.deleteRule));
router.post("/auto-sell/trigger", asyncHandler(AutoSellController.triggerMatch));

export default router;
