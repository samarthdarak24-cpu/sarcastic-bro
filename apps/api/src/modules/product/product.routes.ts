/* ========================================================================
   Product Routes — /products/*
   ======================================================================== */

import { Router } from "express";
import { ProductController } from "./product.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";
import { uploadImages } from "../../middleware/upload.middleware";

const router = Router();

// Public
router.get("/",     asyncHandler(ProductController.getAll));
router.get("/:id",  asyncHandler(ProductController.getById));

// Farmer only
router.get("/my-products", authMiddleware, roleMiddleware("FARMER", "ADMIN"), asyncHandler(ProductController.getByFarmer));
router.post("/",      authMiddleware, roleMiddleware("FARMER", "ADMIN"), uploadImages.array("images", 5), asyncHandler(ProductController.create));
router.put("/:id",    authMiddleware, roleMiddleware("FARMER", "ADMIN"), asyncHandler(ProductController.update));
router.patch("/:id/toggle-status", authMiddleware, roleMiddleware("FARMER", "ADMIN"), asyncHandler(ProductController.toggleStatus));
router.delete("/:id", authMiddleware, roleMiddleware("FARMER", "ADMIN"), asyncHandler(ProductController.delete));

export default router;

