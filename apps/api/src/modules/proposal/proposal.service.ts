/* ========================================================================
   Proposal Service — Business logic for proposals with Redis caching
   ======================================================================== */

import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";

interface SendProposalInput {
  productId: string;
  receiverId: string;
  quantity: number;
  pricePerUnit: number;
  message?: string;
  validUntil?: Date;
}

export class ProposalService {
  private static readonly CACHE_TTL = 180; // 3 minutes

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
        product: { select: { id: true, name: true, unit: true } },
      },
    });

    // Invalidate caches
    await redis.delPattern(`proposals:*:${senderId}`);
    await redis.delPattern(`proposals:*:${data.receiverId}`);

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

    // Real-time notification
    try {
      const socketService = getSocketService();
      socketService.emitProposalUpdate(data.receiverId, {
        proposalId: proposal.id,
        status: 'PENDING',
        message: `New proposal from ${proposal.sender.name}`,
      });
    } catch (err) {
      console.warn('[Socket] Proposal notification failed:', err);
    }

    return proposal;
  }

  static async getProposals(
    userId: string,
    options: { role: "sent" | "received"; page: number; limit: number }
  ) {
    const skip = (options.page - 1) * options.limit;

    const where = options.role === "sent" ? { senderId: userId } : { receiverId: userId };

    // Generate cache key
    const cacheKey = `proposals:${options.role}:${userId}:${options.page}:${options.limit}`;

    // Try cache first
    const cached = await redis.get<{ proposals: any[]; total: number }>(cacheKey);
    if (cached) {
      return cached;
    }

    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: options.limit,
        include: {
          sender: { select: { id: true, name: true, avatarUrl: true } },
          receiver: { select: { id: true, name: true, avatarUrl: true } },
          product: { select: { id: true, name: true, unit: true } },
        },
      }),
      prisma.proposal.count({ where }),
    ]);

    const result = { proposals, total };

    // Cache the result
    await redis.set(cacheKey, result, this.CACHE_TTL);

    return result;
  }

  static async getProposal(proposalId: string, userId: string) {
    // Try cache first
    const cacheKey = `proposal:${proposalId}`;
    const cached = await redis.get<any>(cacheKey);
    if (cached) {
      // Verify access
      if (cached.senderId !== userId && cached.receiverId !== userId) {
        throw ApiError.forbidden("No access to this proposal");
      }
      return cached;
    }

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

    // Cache the proposal
    await redis.set(cacheKey, proposal, this.CACHE_TTL);

    return proposal;
  }

  static async acceptProposal(proposalId: string, userId: string) {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        product: { select: { name: true, unit: true } },
      },
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

    // Create order and update proposal atomically
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.proposal.update({
        where: { id: proposalId },
        data: { status: "ACCEPTED" },
        include: {
          sender: { select: { id: true, name: true } },
          receiver: { select: { id: true, name: true } },
          product: { select: { name: true, unit: true } },
        },
      });

      // Create order from accepted proposal
      const order = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}`,
          buyerId: proposal.receiverId,
          farmerId: proposal.senderId,
          productId: proposal.productId,
          quantity: proposal.quantity,
          totalPrice: proposal.totalPrice,
          status: 'PENDING',
        },
      });

      return { proposal: updated, order };
    });

    // Invalidate caches
    await redis.del(`proposal:${proposalId}`);
    await redis.delPattern(`proposals:*:${proposal.senderId}`);
    await redis.delPattern(`proposals:*:${proposal.receiverId}`);

    // Create notification for sender
    await prisma.notification.create({
      data: {
        userId: proposal.senderId,
        type: "PROPOSAL",
        title: "Proposal Accepted",
        message: `${result.proposal.receiver.name} accepted your proposal`,
        metadata: JSON.stringify({ proposalId, orderId: result.order.id }),
      },
    });

    // Real-time notification
    try {
      const socketService = getSocketService();
      socketService.emitProposalUpdate(proposal.senderId, {
        proposalId,
        status: 'ACCEPTED',
        message: 'Your proposal was accepted!',
      });
    } catch (err) {
      console.warn('[Socket] Proposal acceptance notification failed:', err);
    }

    return result;
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
      include: {
        receiver: { select: { name: true } },
      },
    });

    // Invalidate caches
    await redis.del(`proposal:${proposalId}`);
    await redis.delPattern(`proposals:*:${proposal.senderId}`);
    await redis.delPattern(`proposals:*:${proposal.receiverId}`);

    // Notify sender
    await prisma.notification.create({
      data: {
        userId: proposal.senderId,
        type: "PROPOSAL",
        title: "Proposal Rejected",
        message: `${updated.receiver.name} rejected your proposal`,
        metadata: JSON.stringify({ proposalId }),
      },
    });

    // Real-time notification
    try {
      const socketService = getSocketService();
      socketService.emitProposalUpdate(proposal.senderId, {
        proposalId,
        status: 'REJECTED',
        message: 'Your proposal was rejected',
      });
    } catch (err) {
      console.warn('[Socket] Proposal rejection notification failed:', err);
    }

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
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    // Invalidate caches
    await redis.del(`proposal:${proposalId}`);
    await redis.delPattern(`proposals:*:${proposal.senderId}`);
    await redis.delPattern(`proposals:*:${proposal.receiverId}`);

    // Notify sender
    await prisma.notification.create({
      data: {
        userId: proposal.senderId,
        type: "PROPOSAL",
        title: "Counter Offer Received",
        message: `${updated.receiver.name} sent a counter offer: ₹${data.pricePerUnit} per unit`,
        metadata: JSON.stringify({ proposalId }),
      },
    });

    // Real-time notification
    try {
      const socketService = getSocketService();
      socketService.emitProposalUpdate(proposal.senderId, {
        proposalId,
        status: 'COUNTER',
        message: `Counter offer: ₹${data.pricePerUnit} per unit`,
      });
    } catch (err) {
      console.warn('[Socket] Counter offer notification failed:', err);
    }

    return updated;
  }
}
