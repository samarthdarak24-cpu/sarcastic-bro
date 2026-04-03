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

// Order endpoints
router.post("/",           asyncHandler(OrderController.create));
router.get("/",            asyncHandler(OrderController.getAll));
router.get("/:id",         asyncHandler(OrderController.getById));
router.patch("/:id/status", asyncHandler(OrderController.updateStatus));
router.delete("/:id",      asyncHandler(OrderController.cancel));

// Auto-Sell routes (Smart Deal Engine)
router.post("/auto-sell/rules", asyncHandler(AutoSellController.createRule));
router.get("/auto-sell/rules", asyncHandler(AutoSellController.getRules));
router.delete("/auto-sell/rules/:id", asyncHandler(AutoSellController.deleteRule));
router.post("/auto-sell/trigger", asyncHandler(AutoSellController.triggerMatch));

export default router;
