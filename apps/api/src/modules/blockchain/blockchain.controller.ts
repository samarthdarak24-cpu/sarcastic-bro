/* ========================================================================
   Blockchain Controller — Handles all blockchain, escrow, rating,
   and fraud detection endpoints.
   ======================================================================== */

import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { BlockchainService } from "./blockchain.service";
import { EscrowService } from "./escrow.service";
import { OnChainRatingService } from "./rating.service";
import { FraudDetectionService } from "./fraud.service";

export class BlockchainController {
  // ─── Traceability ─────────────────────────────────────────────────

  /** POST /blockchain/trace — Add a trace event to the product chain */
  static async addTrace(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const farmerId = req.user?.userId;
      if (!farmerId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }
      const trace = await BlockchainService.addProductTrace({
        ...req.body,
        farmerId,
      });
      res.status(201).json({ success: true, data: trace });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/trace/:productId — Get full product chain */
  static async getTrace(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const productId = req.params.productId;
      if (!productId) {
        return res.status(400).json({ success: false, message: 'productId is required' });
      }
      const trace = await BlockchainService.getProductTrace(productId);
      res.status(200).json({ success: true, data: trace });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/verify/:traceId — Verify a specific block */
  static async verifyBlock(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const traceId = req.params.traceId;
      if (!traceId) {
        return res.status(400).json({ success: false, message: 'traceId is required' });
      }
      const result = await BlockchainService.verifyBlock(traceId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  // ─── Escrow / Smart Contract Payments ─────────────────────────────

  /** POST /blockchain/escrow — Create escrow for an order */
  static async createEscrow(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }
      const { orderId, farmerId, amount } = req.body;
      const escrow = await EscrowService.createEscrow(orderId, userId, farmerId, amount);
      res.status(201).json({ success: true, data: escrow });
    } catch (error) { next(error); }
  }

  /** PATCH /blockchain/escrow/:id/deliver — Farmer confirms delivery */
  static async confirmDelivery(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Escrow id is required' });
      }
      const result = await EscrowService.confirmDelivery(id, userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** PATCH /blockchain/escrow/:id/release — Buyer releases payment */
  static async releasePayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Escrow id is required' });
      }
      const result = await EscrowService.releasePayment(id, userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** PATCH /blockchain/escrow/:id/dispute — Buyer raises dispute */
  static async raiseDispute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Escrow id is required' });
      }
      const { reason } = req.body;
      const result = await EscrowService.raiseDispute(id, userId, reason);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/escrow/order/:orderId — Get escrow by order */
  static async getEscrowByOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.orderId;
      if (!orderId) {
        return res.status(400).json({ success: false, message: 'orderId is required' });
      }
      const result = await EscrowService.getByOrder(orderId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/escrow/me — Get all escrows for logged-in user */
  static async getMyEscrows(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }
      const result = await EscrowService.getUserEscrows(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  // ─── Decentralized Ratings ────────────────────────────────────────

  /** POST /blockchain/rating — Submit an on-chain rating */
  static async submitRating(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }
      const { targetId, rating, comment } = req.body;
      const result = await OnChainRatingService.submitRating(userId, targetId, rating, comment);
      res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/reputation/:userId — Get on-chain reputation */
  static async getReputation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ success: false, message: 'userId is required' });
      }
      const result = await OnChainRatingService.getReputation(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  // ─── Fraud Detection ──────────────────────────────────────────────

  /** GET /blockchain/fraud/:orderId — Analyze a single order */
  static async analyzeOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.orderId;
      if (!orderId) {
        return res.status(400).json({ success: false, message: 'orderId is required' });
      }
      const result = await FraudDetectionService.analyzeOrder(orderId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/fraud/scan — Scan all pending orders */
  static async scanOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await FraudDetectionService.scanPendingOrders();
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}
