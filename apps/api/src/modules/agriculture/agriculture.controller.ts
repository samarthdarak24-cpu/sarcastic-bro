import type { Request, Response } from "express";
import { sendSuccess } from "../../utils/response";

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export class AgricultureController {
  static async getSoilData(req: AuthRequest, res: Response) {
    return sendSuccess(res, { ph: 7, moisture: 65, nutrients: "adequate" }, "Soil data retrieved");
  }

  static async getWeatherData(req: AuthRequest, res: Response) {
    return sendSuccess(res, { temperature: 28, humidity: 70, rainfall: 5 }, "Weather data retrieved");
  }

  static async getCropRecommendations(req: AuthRequest, res: Response) {
    return sendSuccess(res, { crops: ["Wheat", "Rice"] }, "Recommendations retrieved");
  }

  static async getFarmingTips(req: AuthRequest, res: Response) {
    return sendSuccess(res, { tips: [] }, "Tips retrieved");
  }
}
