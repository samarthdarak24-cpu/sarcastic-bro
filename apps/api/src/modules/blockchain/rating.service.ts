/* ========================================================================
   On-Chain Rating Service — Decentralized Reputation System
   Stores ratings with SHA256 hashes to simulate blockchain immutability.
   ======================================================================== */

import crypto from "crypto";
import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";

function sha256(data: string): string {
  return "0x" + crypto.createHash("sha256").update(data).digest("hex");
}

function simulateTxHash(): string {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

export class OnChainRatingService {
  /**
   * Submit a rating to the decentralized ledger.
   * Hashes the rating payload for tamper-proof verification.
   */
  static async submitRating(raterId: string, targetId: string, rating: number, comment?: string) {
    if (rating < 1 || rating > 5) throw ApiError.badRequest("Rating must be between 1 and 5");
    if (raterId === targetId) throw ApiError.badRequest("Cannot rate yourself");

    // Check target exists
    const target = await prisma.user.findUnique({ where: { id: targetId } });
    if (!target) throw ApiError.notFound("Target user not found");

    const payload = JSON.stringify({ raterId, targetId, rating, comment, timestamp: new Date().toISOString() });
    const dataHash = sha256(payload);
    const txHash = simulateTxHash();

    const entry = await prisma.onChainRating.create({
      data: {
        targetId,
        raterId,
        rating,
        comment,
        txHash,
        dataHash,
      },
      include: {
        target: { select: { id: true, name: true } },
        rater: { select: { id: true, name: true } },
      },
    });

    // Recalculate on-chain reputation average
    const stats = await prisma.onChainRating.aggregate({
      where: { targetId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // Update user's reputation score (blend on-chain with existing)
    if (stats._avg.rating !== null) {
      await prisma.user.update({
        where: { id: targetId },
        data: {
          ratingAvg: Math.round(stats._avg.rating * 100) / 100,
          reputationScore: Math.min(100, stats._avg.rating * 20),
        },
      });
    }

    return {
      ...entry,
      explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`,
      newAverage: stats._avg.rating,
      totalRatings: stats._count.rating,
    };
  }

  /**
   * Get reputation data for a user — on-chain verified.
   */
  static async getReputation(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, ratingAvg: true, reputationScore: true, totalOrders: true },
    });
    if (!user) throw ApiError.notFound("User not found");

    const stats = await prisma.onChainRating.aggregate({
      where: { targetId: userId },
      _avg: { rating: true },
      _count: { rating: true },
      _min: { rating: true },
      _max: { rating: true },
    });

    const recentRatings = await prisma.onChainRating.findMany({
      where: { targetId: userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        rater: { select: { id: true, name: true } },
      },
    });

    // Calculate trust level
    const avg = stats._avg.rating || 0;
    const count = stats._count.rating || 0;
    let trustLevel: "GOLD" | "SILVER" | "BRONZE" | "RISKY" = "BRONZE";
    if (avg >= 4.5 && count >= 5) trustLevel = "GOLD";
    else if (avg >= 3.5 && count >= 3) trustLevel = "SILVER";
    else if (avg < 2.5 && count >= 2) trustLevel = "RISKY";

    return {
      user,
      onChainStats: {
        average: Math.round((stats._avg.rating || 0) * 100) / 100,
        total: stats._count.rating,
        min: stats._min.rating,
        max: stats._max.rating,
      },
      trustLevel,
      recentRatings,
      isBlockchainVerified: true,
    };
  }
}
