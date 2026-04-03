import { Router } from "express";
import { ExportController } from "./export.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

/* Export Endpoints */
router.post("/orders", asyncHandler(ExportController.exportOrders));
router.post("/products", asyncHandler(ExportController.exportProducts));
router.post("/analytics", asyncHandler(ExportController.exportAnalytics));

export default router;
