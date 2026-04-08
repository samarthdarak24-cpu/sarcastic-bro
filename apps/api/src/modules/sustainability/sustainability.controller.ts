import type { Request, Response } from "express";
import { sendSuccess } from "../../utils/response";

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export class SustainabilityController {
  static async getCarbonFootprint(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    return sendSuccess(res, { userId, carbonFootprint: 0 }, "Carbon footprint retrieved");
  }

  static async getEcoScore(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    return sendSuccess(res, { userId, ecoScore: 85 }, "Eco score retrieved");
  }

  static async getSustainabilityTips(req: AuthRequest, res: Response) {
    return sendSuccess(res, { tips: [] }, "Sustainability tips retrieved");
  }

  static async trackEmissions(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { data } = req.body;
    return sendSuccess(res, { recorded: true }, "Emissions tracked");
  }
}
