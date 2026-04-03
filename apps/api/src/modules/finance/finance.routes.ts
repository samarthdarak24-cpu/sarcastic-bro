/* ========================================================================
   Finance Routes — ODOP Connect
   Payments, Loans, and Price Protection Insurance
   ======================================================================== */

import { Router } from "express";
import { FinanceController } from "./finance.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// Protected routes
router.use(authMiddleware);

// ─── Payments ─────────────────────────────────────────────────────────
router.get("/payments", asyncHandler(FinanceController.getPaymentHistory));
router.post("/payments", asyncHandler(FinanceController.recordPayment));
router.get("/payments/:id", asyncHandler(FinanceController.getPaymentDetails));

// ─── Credit & Loans ───────────────────────────────────────────────────
router.get("/credit-score/:userId", asyncHandler(FinanceController.getCreditScore));
router.get("/loan-eligibility/:userId", asyncHandler(FinanceController.getLoanEligibility));
router.post("/loan-request", asyncHandler(FinanceController.requestLoan));

// ─── Insurance / Price Protection ─────────────────────────────────────
router.post("/insurance/calculate", asyncHandler(FinanceController.calculatePremium));
router.post("/insurance/policy", asyncHandler(FinanceController.createPolicy));
router.get("/insurance/my-policies", asyncHandler(FinanceController.getMyPolicies));
router.get("/insurance/check", asyncHandler(FinanceController.checkClaims));

export default router;
