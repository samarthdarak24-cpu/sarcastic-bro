import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { KYCService } from "./kyc.service";

const router = Router();
const kycService = new KYCService();

/**
 * Get KYC status for buyer
 */
router.get("/status", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const status = await kycService.getKYCStatus(userId);
  
  res.status(200).json({
    success: true,
    data: status
  });
}));

/**
 * Submit KYC details for buyer (GST, Company Info)
 */
router.post("/submit", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { gst, companyName, companyAddress, bankAccount, ifsc, bankName } = req.body;
  
  const result = await kycService.submitKYC(userId, {
    gst,
    companyName,
    companyAddress,
    bankAccount,
    ifsc,
    bankName
  });
  
  res.status(200).json({
    success: true,
    message: "KYC submitted successfully",
    data: result
  });
}));

/**
 * Verify GST number
 */
router.post("/verify-gst", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { gst } = req.body;
  
  const verification = await kycService.verifyGST(gst);
  
  res.status(200).json({
    success: true,
    data: verification
  });
}));

export default router;
