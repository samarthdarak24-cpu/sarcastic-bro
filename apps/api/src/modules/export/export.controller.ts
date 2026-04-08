import type { Request, Response } from "express";
import { sendSuccess } from "../../utils/response";

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export class ExportController {
  static async getMandiPrices(req: AuthRequest, res: Response) {
    return sendSuccess(res, { crop: req.query.crop, price: 2400, trend: "up" }, "Mandi prices retrieved");
  }

  static async getGlobalPrices(req: AuthRequest, res: Response) {
    return sendSuccess(res, [], "Global prices retrieved");
  }

  static async getRecommendations(req: AuthRequest, res: Response) {
    return sendSuccess(res, [], "Recommendations retrieved");
  }

  static async getProfitCalculation(req: AuthRequest, res: Response) {
    return sendSuccess(res, { localProfit: 5000, exportProfit: 25000 }, "Profit calculated");
  }
}
