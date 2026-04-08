import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { BehaviorService } from "./behavior.service";

export class BehaviorController {
  static async trackEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { action, category, metadata } = req.body;
      const userId = req.user?.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const event = await BehaviorService.trackEvent(userId, action, category, metadata);
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  static async getInsights(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const insights = await BehaviorService.getInsights(userId);
      res.status(200).json({ success: true, data: insights });
    } catch (error) {
      next(error);
    }
  }
}
