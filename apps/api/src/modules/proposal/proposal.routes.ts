/* ========================================================================
   Proposal Routes — /proposals/*
   ======================================================================== */

import { Router } from "express";
import { ProposalController } from "./proposal.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// Proposal endpoints
router.post("/", asyncHandler(ProposalController.sendProposal));
router.get("/", asyncHandler(ProposalController.getProposals));
router.get("/:proposalId", asyncHandler(ProposalController.getProposal));
router.patch("/:proposalId/accept", asyncHandler(ProposalController.acceptProposal));
router.patch("/:proposalId/reject", asyncHandler(ProposalController.rejectProposal));
router.post("/:proposalId/counter", asyncHandler(ProposalController.counterOffer));

export default router;
router.get("/",             asyncHandler(ProposalController.getAll));
router.patch("/:id/respond", asyncHandler(ProposalController.respond));

export default router;
