import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { BuyerDashboardService } from "./dashboard.service";

const router = Router();
const dashboardService = new BuyerDashboardService();

/**
 * Get buyer dashboard overview stats
 */
router.get("/stats", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const buyerId = (req as any).user.userId;
  
  const stats = await dashboardService.getDashboardStats(buyerId);
  
  res.status(200).json({
    success: true,
    data: stats
  });
}));

/**
 * Get orders summary by status
 */
router.get("/orders-summary", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const buyerId = (req as any).user.userId;
  
  const summary = await dashboardService.getOrdersSummary(buyerId);
  
  res.status(200).json({
    success: true,
    data: summary
  });
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
  
  res.status(200).json({
    success: true,
    data: analytics
  });
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
  
  res.status(200).json({
    success: true,
    data: suppliers
  });
}));

export default router;
