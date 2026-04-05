/* ========================================================================
   Proposal Controller — HTTP handlers for proposals
   ======================================================================== */

import type { Request, Response } from "express";
import { ProposalService } from "./proposal.service";
import { sendSuccess, sendCreated, sendPaginated } from "../../utils/response";
import { getSocketService } from "../../services/socketService";

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
    
    // Emit real-time proposal notification
    try {
      const socketService = getSocketService();
      socketService.emitProposalUpdate(receiverId, {
        proposalId: proposal.id,
        status: proposal.status,
        message: `New proposal received`
      });
    } catch (err) {
      console.error('Socket emission failed:', err);
    }
    
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
    
    // Emit real-time acceptance notification
    try {
      const socketService = getSocketService();
      socketService.emitProposalUpdate(proposal.senderId, {
        proposalId: proposal.id,
        status: 'ACCEPTED',
        message: `Your proposal has been accepted!`
      });
    } catch (err) {
      console.error('Socket emission failed:', err);
    }
    
    return sendSuccess(res, proposal, "Proposal accepted");
  }

  static async rejectProposal(req: Request, res: Response) {
    const proposal = await ProposalService.rejectProposal(req.params.proposalId, req.user!.userId);
    
    // Emit real-time rejection notification
    try {
      const socketService = getSocketService();
      socketService.emitProposalUpdate(proposal.senderId, {
        proposalId: proposal.id,
        status: 'REJECTED',
        message: `Your proposal was declined`
      });
    } catch (err) {
      console.error('Socket emission failed:', err);
    }
    
    return sendSuccess(res, null, "Proposal rejected");
  }

  static async counterOffer(req: Request, res: Response) {
    const { pricePerUnit, quantity } = req.body;
    const proposal = await ProposalService.counterOffer(req.params.proposalId, req.user!.userId, {
      pricePerUnit,
      quantity,
    });
    
    // Emit real-time counter offer notification
    try {
      const socketService = getSocketService();
      const recipientId = proposal.senderId === req.user!.userId ? proposal.receiverId : proposal.senderId;
      socketService.emitProposalUpdate(recipientId, {
        proposalId: proposal.id,
        status: 'COUNTER_OFFER',
        message: `Counter offer received: ₹${pricePerUnit}/unit for ${quantity} units`
      });
    } catch (err) {
      console.error('Socket emission failed:', err);
    }
    
    return sendSuccess(res, proposal, "Counter offer sent");
  }
}
