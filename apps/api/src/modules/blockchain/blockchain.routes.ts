/* ========================================================================
   Blockchain Routes — /blockchain/*
   Supply Chain Traceability + Escrow + Ratings + Fraud Detection
   ======================================================================== */

import { Router } from "express";
import { BlockchainController } from "./blockchain.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// ─── Traceability ─────────────────────────────────────────────────────
router.post("/trace",                asyncHandler(BlockchainController.addTrace));
router.get("/trace/:productId",      asyncHandler(BlockchainController.getTrace));
router.get("/verify/:traceId",       asyncHandler(BlockchainController.verifyBlock));

// ─── Escrow / Smart Contract Payments ─────────────────────────────────
router.post("/escrow",               asyncHandler(BlockchainController.createEscrow));
router.patch("/escrow/:id/deliver",  asyncHandler(BlockchainController.confirmDelivery));
router.patch("/escrow/:id/release",  asyncHandler(BlockchainController.releasePayment));
router.patch("/escrow/:id/dispute",  asyncHandler(BlockchainController.raiseDispute));
router.get("/escrow/order/:orderId", asyncHandler(BlockchainController.getEscrowByOrder));
router.get("/escrow/me",             asyncHandler(BlockchainController.getMyEscrows));

// ─── Decentralized Reputation ─────────────────────────────────────────
router.post("/rating",               asyncHandler(BlockchainController.submitRating));
router.get("/reputation/:userId",    asyncHandler(BlockchainController.getReputation));

// ─── Fraud Detection ─────────────────────────────────────────────────
router.get("/fraud/scan",            asyncHandler(BlockchainController.scanOrders));
router.get("/fraud/:orderId",        asyncHandler(BlockchainController.analyzeOrder));

export default router;
