import { Router } from "express";
import { CsvController } from "./csv.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

router.get("/orders", asyncHandler(CsvController.exportOrders));
router.get("/products", asyncHandler(CsvController.exportProducts));

export default router;
