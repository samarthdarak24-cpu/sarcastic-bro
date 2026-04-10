import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess, sendError, sendValidationError } from "../../utils/response";
import { BuyerWalletService } from "./wallet.service";

const router = Router();
const walletService = new BuyerWalletService();

/**
 * Get wallet details and balance
 */
router.get("/", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const wallet = await walletService.getWallet(userId);
  
  return sendSuccess(res, wallet, "Wallet retrieved successfully");
}));

/**
 * Get wallet balance only
 */
router.get("/balance", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const balance = await walletService.getBalance(userId);
  
  return sendSuccess(res, balance, "Balance retrieved successfully");
}));

/**
 * Add funds to wallet
 */
router.post("/add-funds", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { amount, razorpayPaymentId, razorpayOrderId, method } = req.body;
  
  if (!amount || amount <= 0) {
    return sendValidationError(res, [{ field: 'amount', message: 'Invalid amount' }], 'Invalid amount');
  }
  
  const result = await walletService.addFunds(userId, parseFloat(amount), {
    razorpayPaymentId,
    razorpayOrderId,
    method
  });
  
  return sendSuccess(res, result, "Funds added successfully", 200);
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
  
  return sendSuccess(res, result, "Transactions retrieved successfully");
}));

export default router;
