import { Router } from "express";
import { TenderController } from "./tender.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

const router = Router();

// Public
router.get("/", asyncHandler(TenderController.list));

// Authenticated
router.post("/", authMiddleware, roleMiddleware("BUYER"), asyncHandler(TenderController.create));
router.post("/:tenderId/apply", authMiddleware, roleMiddleware("FARMER"), asyncHandler(TenderController.apply));
router.get("/my-applications", authMiddleware, asyncHandler(TenderController.listMyApplications));
router.get("/", asyncHandler(TenderController.list));
router.get("/:tenderId/applications", authMiddleware, asyncHandler(TenderController.getApplications));
router.patch("/applications/:applicationId/accept", authMiddleware, roleMiddleware("BUYER"), asyncHandler(TenderController.acceptApplication));

export default router;
