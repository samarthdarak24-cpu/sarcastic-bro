import type { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../../utils/response";

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export class BuyerController {
  static async getSuppliers(req: AuthRequest, res: Response) {
    return sendSuccess(res, [], "Suppliers retrieved");
  }

  static async searchProducts(req: AuthRequest, res: Response) {
    const { query } = req.query;
    return sendSuccess(res, [], "Products retrieved");
  }

  static async createOrder(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { productId, quantity } = req.body;
    return sendCreated(res, { id: "order_" + Date.now(), productId, quantity, userId }, "Order created");
  }

  static async getOrders(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    return sendSuccess(res, [], "Orders retrieved");
  }

  static async getOrderById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    return sendSuccess(res, { id }, "Order retrieved");
  }
}
