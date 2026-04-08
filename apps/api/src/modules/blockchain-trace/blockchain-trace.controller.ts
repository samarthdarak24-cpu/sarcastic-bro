import type { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../../utils/response";

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export class BlockchainTraceController {
  static async createTrace(req: AuthRequest, res: Response) {
    const { productId, data } = req.body;
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    return sendCreated(res, { id: "trace_" + Date.now(), productId, userId }, "Trace created");
  }

  static async getTrace(req: AuthRequest, res: Response) {
    const { id } = req.params;
    return sendSuccess(res, { id, status: "verified" }, "Trace retrieved");
  }

  static async verifyTrace(req: AuthRequest, res: Response) {
    const { id } = req.params;
    return sendSuccess(res, { id, verified: true }, "Trace verified");
  }
}
