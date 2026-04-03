/* ========================================================================
   Escrow Service — Smart Contract Payment System (Simulated)
   Holds funds in escrow until buyer confirms delivery.
   Production: integrate with ethers.js and a Solidity EscrowContract.
   ======================================================================== */

import crypto from "crypto";
import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import { SocketService } from "../../config/socket";

function simulateTxHash(): string {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

function simulateContractAddress(): string {
  return "0x" + crypto.randomBytes(20).toString("hex");
}

export class EscrowService {
  /**
   * Create an escrow hold when a buyer places an order.
   * Simulates: buyer calls createOrder(orderId, amount) on smart contract.
   */
  static async createEscrow(orderId: string, buyerId: string, farmerId: string, amount: number) {
    // Check order exists
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw ApiError.notFound("Order not found");

    // Check no duplicate escrow
    const existing = await prisma.escrowOrder.findFirst({ where: { orderId } });
    if (existing) throw ApiError.badRequest("Escrow already exists for this order");

    const escrow = await prisma.escrowOrder.create({
      data: {
        orderId,
        buyerId,
        farmerId,
        amount,
        status: "HELD",
        escrowAddress: simulateContractAddress(),
        depositTxHash: simulateTxHash(),
      },
      include: {
        order: { select: { id: true, orderNumber: true, status: true } },
        buyer: { select: { id: true, name: true } },
        farmer: { select: { id: true, name: true } },
      },
    });

    // Notify both parties
    await Promise.all([
      prisma.notification.create({
        data: {
          userId: farmerId,
          type: "ORDER",
          title: "Payment Secured in Escrow 🔒",
          message: `₹${amount} has been locked in smart contract for order #${order.orderNumber}`,
          metadata: JSON.stringify({ escrowId: escrow.id, orderId }),
        },
      }),
      prisma.notification.create({
        data: {
          userId: buyerId,
          type: "ORDER",
          title: "Escrow Deposit Confirmed",
          message: `Your payment of ₹${amount} is held securely until delivery is confirmed.`,
          metadata: JSON.stringify({ escrowId: escrow.id, orderId }),
        },
      }),
    ]);

    // Real-time socket push
    SocketService.emitToUser(farmerId, "escrow:created", escrow);
    SocketService.emitToUser(buyerId, "escrow:created", escrow);

    return escrow;
  }

  /**
   * Farmer marks the order as delivered.
   * Simulates: farmer calls confirmDelivery(orderId) on smart contract.
   */
  static async confirmDelivery(escrowId: string, farmerId: string) {
    const escrow = await prisma.escrowOrder.findUnique({ where: { id: escrowId } });
    if (!escrow) throw ApiError.notFound("Escrow not found");
    if (escrow.farmerId !== farmerId) throw ApiError.forbidden("Only the farmer can confirm delivery");
    if (escrow.status !== "HELD") throw ApiError.badRequest("Escrow is not in HELD status");

    const updated = await prisma.escrowOrder.update({
      where: { id: escrowId },
      data: { farmerDelivered: true },
      include: {
        order: { select: { id: true, orderNumber: true } },
        buyer: { select: { id: true, name: true } },
      },
    });

    // Notify buyer to confirm receipt
    await prisma.notification.create({
      data: {
        userId: escrow.buyerId,
        type: "ORDER",
        title: "Delivery Marked — Confirm Receipt",
        message: `The farmer has marked your order as delivered. Please confirm to release payment.`,
        metadata: JSON.stringify({ escrowId }),
      },
    });

    SocketService.emitToUser(escrow.buyerId, "escrow:delivery_confirmed", updated);

    return updated;
  }

  /**
   * Buyer confirms receipt → funds are released to farmer.
   * Simulates: buyer calls releasePayment(orderId) on smart contract.
   */
  static async releasePayment(escrowId: string, buyerId: string) {
    const escrow = await prisma.escrowOrder.findUnique({ where: { id: escrowId } });
    if (!escrow) throw ApiError.notFound("Escrow not found");
    if (escrow.buyerId !== buyerId) throw ApiError.forbidden("Only the buyer can release payment");
    if (escrow.status !== "HELD") throw ApiError.badRequest("Escrow is not in HELD status");

    const releaseTxHash = simulateTxHash();

    const updated = await prisma.escrowOrder.update({
      where: { id: escrowId },
      data: {
        status: "RELEASED",
        buyerConfirmed: true,
        releaseTxHash,
        releasedAt: new Date(),
      },
      include: {
        order: { select: { id: true, orderNumber: true } },
        farmer: { select: { id: true, name: true } },
        buyer: { select: { id: true, name: true } },
      },
    });

    // Update order status to DELIVERED
    await prisma.order.update({
      where: { id: escrow.orderId },
      data: { status: "DELIVERED", deliveredAt: new Date() },
    });

    // Notify farmer
    await prisma.notification.create({
      data: {
        userId: escrow.farmerId,
        type: "ORDER",
        title: "Payment Released! 💰",
        message: `₹${escrow.amount} has been released from escrow to your account.`,
        metadata: JSON.stringify({ escrowId, releaseTxHash }),
      },
    });

    SocketService.emitToUser(escrow.farmerId, "escrow:payment_released", updated);
    SocketService.emitToUser(escrow.buyerId, "escrow:payment_released", updated);

    return { ...updated, explorerUrl: `https://sepolia.etherscan.io/tx/${releaseTxHash}` };
  }

  /**
   * Buyer raises a dispute.
   */
  static async raiseDispute(escrowId: string, buyerId: string, reason: string) {
    const escrow = await prisma.escrowOrder.findUnique({ where: { id: escrowId } });
    if (!escrow) throw ApiError.notFound("Escrow not found");
    if (escrow.buyerId !== buyerId) throw ApiError.forbidden("Only the buyer can raise a dispute");
    if (escrow.status !== "HELD") throw ApiError.badRequest("Escrow is not in HELD status");

    const updated = await prisma.escrowOrder.update({
      where: { id: escrowId },
      data: { status: "DISPUTED", disputeReason: reason },
    });

    await prisma.notification.create({
      data: {
        userId: escrow.farmerId,
        type: "ORDER",
        title: "Escrow Dispute Raised ⚠️",
        message: `The buyer has raised a dispute: "${reason}"`,
        metadata: JSON.stringify({ escrowId }),
      },
    });

    return updated;
  }

  /**
   * Get escrow details for an order.
   */
  static async getByOrder(orderId: string) {
    const escrow = await prisma.escrowOrder.findFirst({
      where: { orderId },
      include: {
        order: { select: { id: true, orderNumber: true, status: true, totalPrice: true } },
        buyer: { select: { id: true, name: true } },
        farmer: { select: { id: true, name: true } },
      },
    });
    if (!escrow) throw ApiError.notFound("No escrow found for this order");
    return escrow;
  }

  /**
   * Get all escrows for a user (buyer or farmer).
   */
  static async getUserEscrows(userId: string) {
    return prisma.escrowOrder.findMany({
      where: { OR: [{ buyerId: userId }, { farmerId: userId }] },
      include: {
        order: { select: { id: true, orderNumber: true, status: true, totalPrice: true } },
        buyer: { select: { id: true, name: true } },
        farmer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
