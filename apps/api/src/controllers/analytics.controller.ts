import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  static async getFarmerAnalytics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const analytics = await AnalyticsService.getFarmerAnalytics(userId);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFPOAnalytics(req: Request, res: Response) {
    try {
      // Find FPO ID for this admin user
      const userId = (req as any).user.id;
      const analytics = await AnalyticsService.getFPOAnalytics(userId); // Simplified
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
