/* ========================================================================
   Proposal Service — Business logic for proposals
   ======================================================================== */

import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";

interface SendProposalInput {
  productId: string;
  receiverId: string;
  quantity: number;
  pricePerUnit: number;
  message?: string;
  validUntil?: Date;
}

export class ProposalService {
  static async sendProposal(senderId: string, data: SendProposalInput) {
    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw ApiError.notFound("Product not found");
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: data.receiverId },
    });

    if (!receiver) {
      throw ApiError.notFound("Receiver not found");
    }

    const totalPrice = data.pricePerUnit * data.quantity;
    const validUntil = data.validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const proposal = await prisma.proposal.create({
      data: {
        senderId,
        receiverId: data.receiverId,
        productId: data.productId,
        quantity: data.quantity,
        pricePerUnit: data.pricePerUnit,
        totalPrice,
        message: data.message,
        status: "PENDING",
        validUntil,
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
    });

    // Notify receiver
    await prisma.notification.create({
      data: {
        userId: data.receiverId,
        type: "PROPOSAL",
        title: "New Proposal Received",
        message: `${proposal.sender.name} sent a proposal for ${data.quantity} ${product.unit} of ${proposal.product.name}`,
        metadata: JSON.stringify({ proposalId: proposal.id }),
      },
    });

    return proposal;
  }

  static async getProposals(
    userId: string,
    options: { role: "sent" | "received"; page: number; limit: number }
  ) {
    const skip = (options.page - 1) * options.limit;

    const where = options.role === "sent" ? { senderId: userId } : { receiverId: userId };

    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: options.limit,
        include: {
          sender: { select: { id: true, name: true, avatarUrl: true } },
          receiver: { select: { id: true, name: true, avatarUrl: true } },
          product: { select: { id: true, name: true } },
        },
      }),
      prisma.proposal.count({ where }),
    ]);

    return { proposals, total };
  }

  static async getProposal(proposalId: string, userId: string) {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        sender: { select: { id: true, name: true, email: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, email: true, avatarUrl: true } },
        product: true,
      },
    });

    if (!proposal) {
      throw ApiError.notFound("Proposal not found");
    }

    if (proposal.senderId !== userId && proposal.receiverId !== userId) {
      throw ApiError.forbidden("No access to this proposal");
    }

    return proposal;
  }

  static async acceptProposal(proposalId: string, userId: string) {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw ApiError.notFound("Proposal not found");
    }

    if (proposal.receiverId !== userId) {
      throw ApiError.forbidden("Only receiver can accept proposal");
    }

    if (proposal.status !== "PENDING") {
      throw ApiError.badRequest(`Cannot accept proposal with status: ${proposal.status}`);
    }

    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "ACCEPTED" },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
        product: { select: { name: true, unit: true } },
      },
    });

    // Create notification for sender
    await prisma.notification.create({
      data: {
        userId: proposal.senderId,
        type: "PROPOSAL",
        title: "Proposal Accepted",
        message: `${updated.receiver.name} accepted your proposal`,
        metadata: JSON.stringify({ proposalId }),
      },
    });

    return updated;
  }

  static async rejectProposal(proposalId: string, userId: string) {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw ApiError.notFound("Proposal not found");
    }

    if (proposal.receiverId !== userId) {
      throw ApiError.forbidden("Only receiver can reject proposal");
    }

    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: "REJECTED" },
    });

    // Notify sender
    await prisma.notification.create({
      data: {
        userId: proposal.senderId,
        type: "PROPOSAL",
        title: "Proposal Rejected",
        message: "Your proposal was rejected",
        metadata: JSON.stringify({ proposalId }),
      },
    });

    return updated;
  }

  static async counterOffer(proposalId: string, userId: string, data: { pricePerUnit: number; quantity: number }) {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw ApiError.notFound("Proposal not found");
    }

    if (proposal.receiverId !== userId) {
      throw ApiError.forbidden("Only receiver can send counter offer");
    }

    const totalPrice = data.pricePerUnit * data.quantity;

    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        quantity: data.quantity,
        pricePerUnit: data.pricePerUnit,
        totalPrice,
        status: "COUNTER",
      },
      include: {
        sender: { select: { name: true } },
        receiver: { select: { name: true } },
      },
    });

    // Notify sender
    await prisma.notification.create({
      data: {
        userId: proposal.senderId,
        type: "PROPOSAL",
        title: "Counter Offer Received",
        message: `${updated.receiver.name} sent a counter offer`,
        metadata: JSON.stringify({ proposalId }),
      },
    });

    return updated;
  }
}
