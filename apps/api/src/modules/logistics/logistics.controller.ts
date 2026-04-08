import type { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../../utils/response";

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export class LogisticsController {
  static async bookShipment(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { orderId, destination } = req.body;
    return sendCreated(res, { id: "shipment_" + Date.now(), orderId, destination }, "Shipment booked");
  }

  static async trackShipment(req: AuthRequest, res: Response) {
    const { id } = req.params;
    return sendSuccess(res, { id, status: "in_transit", location: "Delhi" }, "Shipment tracked");
  }

  static async getProviders(req: AuthRequest, res: Response) {
    return sendSuccess(res, [], "Providers retrieved");
  }

  static async getShipments(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    return sendSuccess(res, [], "Shipments retrieved");
  }
}
