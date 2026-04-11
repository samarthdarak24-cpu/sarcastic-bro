import { Request, Response, NextFunction } from "express";
import { AutoSellService } from "./autoSell.service";
import { ApiError } from "../../utils/ApiError";

export class AutoSellController {
  static async createRule(req: Request, res: Response, next: NextFunction) {
    try {
      const rule = await AutoSellService.createRule(req.user!.userId, req.body);
      res.status(201).json({ success: true, data: rule });
    } catch (error) {
      next(error);
    }
  }

  static async getRules(req: Request, res: Response, next: NextFunction) {
    try {
      const rules = await AutoSellService.getRules(req.user!.userId);
      res.status(200).json({ success: true, data: rules });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRule(req: Request, res: Response, next: NextFunction) {
    try {
      await AutoSellService.deleteRule(req.user!.userId, req.params.id);
      res.status(200).json({ success: true, message: "Rule deleted" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Manual trigger for testing/demo purposes.
   */
  static async triggerMatch(req: Request, res: Response, next: NextFunction) {
    try {
      await AutoSellService.processAutoSell();
      res.status(200).json({ success: true, message: "Matching engine executed" });
    } catch (error) {
      next(error);
    }
  }
}
