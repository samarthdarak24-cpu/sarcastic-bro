import { Request, Response, NextFunction } from "express";
import { BehaviorService } from "./behavior.service";

export class BehaviorController {
  static async trackEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { action, category, metadata } = req.body;
      const event = await BehaviorService.trackEvent(req.user!.userId, action, category, metadata);
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  static async getInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const insights = await BehaviorService.getInsights(req.user!.userId);
      res.status(200).json({ success: true, data: insights });
    } catch (error) {
      next(error);
    }
  }
}
