/* ========================================================================
   Analytics Controller — Dashboard Analytics and Insights
   Handles HTTP requests for analytics data
   ======================================================================== */

import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';

export class AnalyticsController {
  /**
   * Get dashboard analytics
   * GET /api/analytics/dashboard
   */
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const role = (req as any).user?.role;

      const analytics = await AnalyticsService.getDashboardAnalytics(userId, role);

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get revenue analytics
   * GET /api/analytics/revenue?period=month
   */
  static async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const role = (req as any).user?.role;
      const period = (req.query.period as 'week' | 'month' | 'year') || 'month';

      const analytics = await AnalyticsService.getRevenueAnalytics(userId, role, period);

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get order analytics
   * GET /api/analytics/orders
   */
  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const role = (req as any).user?.role;

      const analytics = await AnalyticsService.getOrderAnalytics(userId, role);

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get product analytics (farmers only)
   * GET /api/analytics/products
   */
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const role = (req as any).user?.role;

      if (role !== 'FARMER') {
        return res.status(403).json({
          success: false,
          message: 'Only farmers can access product analytics',
        });
      }

      const analytics = await AnalyticsService.getProductAnalytics(userId);

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
