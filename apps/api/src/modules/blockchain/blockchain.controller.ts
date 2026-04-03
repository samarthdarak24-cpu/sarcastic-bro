/* ========================================================================
   Blockchain Controller — Handles all blockchain, escrow, rating,
   and fraud detection endpoints.
   ======================================================================== */

import { Request, Response, NextFunction } from "express";
import { BlockchainService } from "./blockchain.service";
import { EscrowService } from "./escrow.service";
import { OnChainRatingService } from "./rating.service";
import { FraudDetectionService } from "./fraud.service";

export class BlockchainController {
  // ─── Traceability ─────────────────────────────────────────────────

  /** POST /blockchain/trace — Add a trace event to the product chain */
  static async addTrace(req: Request, res: Response, next: NextFunction) {
    try {
      const trace = await BlockchainService.addProductTrace({
        ...req.body,
        farmerId: req.user!.userId,
      });
      res.status(201).json({ success: true, data: trace });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/trace/:productId — Get full product chain */
  static async getTrace(req: Request, res: Response, next: NextFunction) {
    try {
      const trace = await BlockchainService.getProductTrace(req.params.productId);
      res.status(200).json({ success: true, data: trace });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/verify/:traceId — Verify a specific block */
  static async verifyBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await BlockchainService.verifyBlock(req.params.traceId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  // ─── Escrow / Smart Contract Payments ─────────────────────────────

  /** POST /blockchain/escrow — Create escrow for an order */
  static async createEscrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, farmerId, amount } = req.body;
      const escrow = await EscrowService.createEscrow(orderId, req.user!.userId, farmerId, amount);
      res.status(201).json({ success: true, data: escrow });
    } catch (error) { next(error); }
  }

  /** PATCH /blockchain/escrow/:id/deliver — Farmer confirms delivery */
  static async confirmDelivery(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EscrowService.confirmDelivery(req.params.id, req.user!.userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** PATCH /blockchain/escrow/:id/release — Buyer releases payment */
  static async releasePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EscrowService.releasePayment(req.params.id, req.user!.userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** PATCH /blockchain/escrow/:id/dispute — Buyer raises dispute */
  static async raiseDispute(req: Request, res: Response, next: NextFunction) {
    try {
      const { reason } = req.body;
      const result = await EscrowService.raiseDispute(req.params.id, req.user!.userId, reason);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/escrow/order/:orderId — Get escrow by order */
  static async getEscrowByOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EscrowService.getByOrder(req.params.orderId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/escrow/me — Get all escrows for logged-in user */
  static async getMyEscrows(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EscrowService.getUserEscrows(req.user!.userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  // ─── Decentralized Ratings ────────────────────────────────────────

  /** POST /blockchain/rating — Submit an on-chain rating */
  static async submitRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetId, rating, comment } = req.body;
      const result = await OnChainRatingService.submitRating(req.user!.userId, targetId, rating, comment);
      res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/reputation/:userId — Get on-chain reputation */
  static async getReputation(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OnChainRatingService.getReputation(req.params.userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  // ─── Fraud Detection ──────────────────────────────────────────────

  /** GET /blockchain/fraud/:orderId — Analyze a single order */
  static async analyzeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await FraudDetectionService.analyzeOrder(req.params.orderId);
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  /** GET /blockchain/fraud/scan — Scan all pending orders */
  static async scanOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await FraudDetectionService.scanPendingOrders();
      res.status(200).json({ success: true, data: result });
    } catch (error) { next(error); }
  }
}
