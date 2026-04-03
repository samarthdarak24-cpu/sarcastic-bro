import { Router } from "express";
import { SampleRequestController } from "./sampleRequest.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

/* Sample Request Endpoints */
router.post("/", asyncHandler(SampleRequestController.createSampleRequest));
router.get("/", asyncHandler(SampleRequestController.getSampleRequests));
router.get("/:id", asyncHandler(SampleRequestController.getSampleRequestById));
router.patch("/:id/status", asyncHandler(SampleRequestController.updateSampleStatus));
router.post("/:id/feedback", asyncHandler(SampleRequestController.submitFeedback));

export default router;
