/* ========================================================================
   Blockchain Trace Routes — /blockchain-trace/*
   Advanced blockchain traceability features including supply chain journey,
   provenance verification, carbon footprint, and compliance validation
   ======================================================================== */

import { Router } from 'express';
import blockchainTraceController from './blockchain-trace.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// ─── Core Trace Operations ────────────────────────────────────────────
router.post('/trace', (req, res, next) => blockchainTraceController.createTraceEvent(req, res));
router.get('/trace/product/:productId', (req, res, next) => blockchainTraceController.getProductTraceHistory(req, res));
router.post('/verify', (req, res, next) => blockchainTraceController.verifyTraceIntegrity(req, res));

// ─── Supply Chain Journey ─────────────────────────────────────────────
router.get('/journey/:productId', (req, res, next) => blockchainTraceController.getSupplyChainJourney(req, res));

// ─── Provenance Verification ──────────────────────────────────────────
router.post('/provenance/:productId', (req, res, next) => blockchainTraceController.verifyProvenance(req, res));

// ─── Carbon Footprint ─────────────────────────────────────────────────
router.get('/carbon/:productId', (req, res, next) => blockchainTraceController.calculateCarbonFootprint(req, res));

// ─── Smart Contract Monitor ───────────────────────────────────────────
router.get('/contract/:contractAddress', (req, res, next) => blockchainTraceController.getSmartContractStatus(req, res));

// ─── Multi-Party Consensus ────────────────────────────────────────────
router.get('/consensus/:transactionId', (req, res, next) => blockchainTraceController.getConsensusStatus(req, res));

// ─── Fraud Detection ──────────────────────────────────────────────────
router.get('/fraud/:productId', (req, res, next) => blockchainTraceController.detectFraud(req, res));

// ─── Cross-Chain Bridge ───────────────────────────────────────────────
router.get('/cross-chain', (req, res, next) => blockchainTraceController.getCrossChainStatus(req, res));

// ─── NFT Certificate ──────────────────────────────────────────────────
router.post('/nft/:productId', (req, res, next) => blockchainTraceController.generateNFTCertificate(req, res));

// ─── Audit Analytics ──────────────────────────────────────────────────
router.get('/audit/:farmerId', (req, res, next) => blockchainTraceController.getAuditAnalytics(req, res));

// ─── Compliance Validation ────────────────────────────────────────────
router.post('/compliance/:productId', (req, res, next) => blockchainTraceController.validateCompliance(req, res));

export default router;
