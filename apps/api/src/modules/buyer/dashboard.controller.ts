import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess, sendError } from "../../utils/response";
import { BuyerDashboardService } from "./dashboard.service";

const router = Router();
const dashboardService = new BuyerDashboardService();

/**
 * Get buyer dashboard overview stats
 */
router.get("/stats", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const buyerId = (req as any).user.userId;
  
  const stats = await dashboardService.getDashboardStats(buyerId);
  
  return sendSuccess(res, stats, "Dashboard stats retrieved successfully");
}));

/**
 * Get orders summary by status
 */
router.get("/orders-summary", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const buyerId = (req as any).user.userId;
  
  const summary = await dashboardService.getOrdersSummary(buyerId);
  
  return sendSuccess(res, summary, "Orders summary retrieved successfully");
}));

/**
 * Get spending analytics
 */
router.get("/analytics/spending", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const buyerId = (req as any).user.userId;
  const { period } = req.query;
  
  const analytics = await dashboardService.getSpendingAnalytics(
    buyerId, 
    period as 'week' | 'month' | 'year'
  );
  
  return sendSuccess(res, analytics, "Spending analytics retrieved successfully");
}));

/**
 * Get top suppliers
 */
router.get("/top-suppliers", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const buyerId = (req as any).user.userId;
  const { limit } = req.query;
  
  const suppliers = await dashboardService.getTopSuppliers(
    buyerId,
    limit ? parseInt(limit as string) : undefined
  );
  
  return sendSuccess(res, suppliers, "Top suppliers retrieved successfully");
}));

export default router;
