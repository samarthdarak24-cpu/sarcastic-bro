/* ========================================================================
   Proposal Controller — HTTP handlers for proposals
   ======================================================================== */

import type { Request, Response } from "express";
import { ProposalService } from "./proposal.service";
import { sendSuccess, sendCreated, sendPaginated } from "../../utils/response";

export class ProposalController {
  static async sendProposal(req: Request, res: Response) {
    const { productId, receiverId, quantity, pricePerUnit, message, validUntil } = req.body;
    const proposal = await ProposalService.sendProposal(req.user!.userId, {
      productId,
      receiverId,
      quantity,
      pricePerUnit,
      message,
      validUntil,
    });
    return sendCreated(res, proposal, "Proposal sent");
  }

  static async getProposals(req: Request, res: Response) {
    const { role = "received", page = "1", limit = "20" } = req.query;
    const result = await ProposalService.getProposals(req.user!.userId, {
      role: role as "sent" | "received",
      page: Number(page),
      limit: Number(limit),
    });
    return sendPaginated(res, result.proposals, result.total, Number(page), Number(limit));
  }

  static async getProposal(req: Request, res: Response) {
    const proposal = await ProposalService.getProposal(req.params.proposalId, req.user!.userId);
    return sendSuccess(res, proposal);
  }

  static async acceptProposal(req: Request, res: Response) {
    const proposal = await ProposalService.acceptProposal(req.params.proposalId, req.user!.userId);
    return sendSuccess(res, proposal, "Proposal accepted");
  }

  static async rejectProposal(req: Request, res: Response) {
    await ProposalService.rejectProposal(req.params.proposalId, req.user!.userId);
    return sendSuccess(res, null, "Proposal rejected");
  }

  static async counterOffer(req: Request, res: Response) {
    const { pricePerUnit, quantity } = req.body;
    const proposal = await ProposalService.counterOffer(req.params.proposalId, req.user!.userId, {
      pricePerUnit,
      quantity,
    });
    return sendSuccess(res, proposal, "Counter offer sent");
  }
}
