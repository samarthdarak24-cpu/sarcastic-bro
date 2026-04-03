import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        district: true,
        state: true,
        address: true,
        language: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }

  static async updateProfile(userId: string, data: any) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        district: true,
        state: true,
        address: true,
        language: true,
        avatarUrl: true,
      },
    });
  }

  static async uploadPhoto(userId: string, filePath: string) {
    const filename = filePath.split('/').pop() || filePath.split('\\').pop();
    const url = `/uploads/images/${filename}`;

    return prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: url },
      select: {
        id: true,
        avatarUrl: true, 
      }
    });
  }

  /**
   * Get user reputation data.
   */
  static async getReputation(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        ratingAvg: true,
        totalOrders: true,
        successfulDeliveries: true,
        cancellationRate: true,
        reputationScore: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Trust level calculation
    let trustLevel: "Gold" | "Silver" | "Risky" = "Risky";
    if (user.reputationScore >= 80) trustLevel = "Gold";
    else if (user.reputationScore >= 50) trustLevel = "Silver";

    return {
      ...user,
      trustLevel,
    };
  }

  /**
   * Update reputation score after order completion or cancellation.
   */
  static async updateReputationScore(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reviewsReceived: true,
        ordersAsFarmer: true,
        ordersAsBuyer: true,
      },
    });

    if (!user) return;

    // 1. Calculate Average Rating
    const reviews = user.reviewsReceived;
    const ratingAvg = reviews.length > 0 
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
      : 5.0;

    // 2. Calculate Order Success Rate
    const orders = [...user.ordersAsFarmer, ...user.ordersAsBuyer];
    const totalOrders = orders.length;
    const successfulDeliveries = orders.filter(o => o.status === 'DELIVERED').length;
    const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;
    
    const cancellationRate = totalOrders > 0 
      ? (cancelledOrders / totalOrders) * 100 
      : 0;

    // 3. Logic: reputationScore = (ratingAvg * 0.4) + (successRate * 0.4) - (cancellationRate * 0.2)
    // Normalized to 0-100:
    // (ratingAvg / 5 * 40) + ((success / total) * 40) + ((1 - cancellation / 100) * 20)
    
    const ratingScore = (ratingAvg / 5) * 40;
    const successRateScore = totalOrders > 0 ? (successfulDeliveries / totalOrders) * 40 : 40; // Default 40 if no orders
    const loyaltyScore = (1 - (cancellationRate / 100)) * 20;

    const reputationScore = Math.min(100, Math.max(0, ratingScore + successRateScore + loyaltyScore));

    await prisma.user.update({
      where: { id: userId },
      data: {
        ratingAvg,
        totalOrders,
        successfulDeliveries,
        cancellationRate,
        reputationScore,
      },
    });
  }
}
