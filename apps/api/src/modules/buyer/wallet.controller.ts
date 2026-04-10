import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { BuyerWalletService } from "./wallet.service";

const router = Router();
const walletService = new BuyerWalletService();

/**
 * Get wallet details and balance
 */
router.get("/", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const wallet = await walletService.getWallet(userId);
  
  res.status(200).json({
    success: true,
    data: wallet
  });
}));

/**
 * Get wallet balance only
 */
router.get("/balance", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const balance = await walletService.getBalance(userId);
  
  res.status(200).json({
    success: true,
    data: balance
  });
}));

/**
 * Add funds to wallet
 */
router.post("/add-funds", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { amount, razorpayPaymentId, razorpayOrderId, method } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount"
    });
  }
  
  const result = await walletService.addFunds(userId, parseFloat(amount), {
    razorpayPaymentId,
    razorpayOrderId,
    method
  });
  
  res.status(200).json({
    success: true,
    message: "Funds added successfully",
    data: result
  });
}));

/**
 * Get wallet transaction history
 */
router.get("/transactions", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { type, page, limit } = req.query;
  
  const result = await walletService.getTransactions(userId, {
    type: type as string,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined
  });
  
  res.status(200).json({
    success: true,
    data: result
  });
}));

export default router;
