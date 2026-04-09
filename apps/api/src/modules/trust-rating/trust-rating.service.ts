import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";

export interface SubmitRatingDto {
  orderId: string;
  toUserId: string;
  stars: number;
  review?: string;
}

export class TrustRatingService {
  private static getCacheKey(userId: string) {
    return `reputation:${userId}`;
  }

  /**
   * Submit a rating for a user after order completion
   * Validates: Requirements 8.1, 8.2, 8.3
   */
  static async submitRating(fromUserId: string, data: SubmitRatingDto) {
    // Validate stars (1-5)
    if (!Number.isInteger(data.stars) || data.stars < 1 || data.stars > 5) {
      throw ApiError.badRequest("Rating must be between 1 and 5 stars");
    }

    // Validate review length
    if (data.review && data.review.length > 500) {
      throw ApiError.badRequest("Review must be 500 characters or less");
    }

    // Check if order exists and belongs to the users
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      select: { id: true, farmerId: true, buyerId: true, status: true },
    });

    if (!order) {
      throw ApiError.notFound("Order not found");
    }

    // Verify the rater is part of the order
    const isParticipant = order.farmerId === fromUserId || order.buyerId === fromUserId;
    if (!isParticipant) {
      throw ApiError.forbidden("You are not part of this order");
    }

    // Verify the rated user is the other party
    const isValidTarget = (order.farmerId === data.toUserId && order.buyerId === fromUserId) ||
                          (order.buyerId === data.toUserId && order.farmerId === fromUserId);
    if (!isValidTarget) {
      throw ApiError.badRequest("Invalid rating target");
    }

    // Check if order is completed
    if (order.status !== "COMPLETED") {
      throw ApiError.badRequest("Can only rate completed orders");
    }

    // Check for duplicate rating (Validates: Requirements 8.7)
    const existing = await prisma.rating.findUnique({
      where: { orderId: data.orderId },
    });

    if (existing && existing.fromUserId === fromUserId) {
      throw ApiError.conflict("You have already rated this order");
    }

    // Create rating
    const rating = await prisma.rating.create({
      data: {
        orderId: data.orderId,
        fromUserId,
        toUserId: data.toUserId,
        stars: data.stars,
        review: data.review,
      },
      include: {
        fromUser: { select: { id: true, name: true, avatarUrl: true } },
        toUser: { select: { id: true, name: true } },
      },
    });

    // Invalidate reputation cache for rated user
    await redis.del(this.getCacheKey(data.toUserId));

    // Flag low ratings (Validates: Requirements 8.6)
    if (data.stars < 2) {
      await this.flagLowRating(rating.id, data.toUserId);
    }

    // Emit real-time notification
    try {
      const socketService = getSocketService();
      socketService.emitNotification(data.toUserId, {
        type: "RATING",
        title: "New Rating Received",
        message: `${rating.fromUser.name} rated you ${data.stars} stars`,
        metadata: {
          ratingId: rating.id,
          stars: data.stars,
          fromUserId,
        },
      });
    } catch (err) {
      console.warn("[Socket] Rating notification failed:", err);
    }

    return rating;
  }

  /**
   * Calculate reputation score for a user
   * Validates: Requirements 8.4
   */
  static async calculateReputationScore(userId: string): Promise<number> {
    // Try cache first
    const cached = await redis.get<number>(this.getCacheKey(userId));
    if (cached !== null) {
      return cached;
    }

    const ratings = await prisma.rating.findMany({
      where: { toUserId: userId },
      select: { stars: true },
    });

    if (ratings.length === 0) {
      return 0;
    }

    const totalStars = ratings.reduce((sum, r) => sum + r.stars, 0);
    const score = totalStars / ratings.length;

    // Cache for 1 hour
    await redis.setex(this.getCacheKey(userId), 3600, score);

    return score;
  }

  /**
   * Get all ratings for a user
   * Validates: Requirements 8.5, 8.8
   */
  static async getRatings(userId: string, limit: number = 50) {
    const ratings = await prisma.rating.findMany({
      where: { toUserId: userId },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            role: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return ratings;
  }

  /**
   * Get user reputation profile
   */
  static async getUserReputation(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        reputationScore: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    const ratings = await this.getRatings(userId, 10);
    const score = await this.calculateReputationScore(userId);

    // Calculate rating distribution
    const distribution = {
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0,
    };

    ratings.forEach((r) => {
      if (r.stars === 5) distribution.fiveStar++;
      else if (r.stars === 4) distribution.fourStar++;
      else if (r.stars === 3) distribution.threeStar++;
      else if (r.stars === 2) distribution.twoStar++;
      else if (r.stars === 1) distribution.oneStar++;
    });

    return {
      user,
      reputationScore: score,
      totalRatings: ratings.length,
      recentRatings: ratings,
      ratingDistribution: distribution,
    };
  }

  /**
   * Flag a low rating for review
   * Validates: Requirements 8.6
   */
  static async flagLowRating(ratingId: string, userId: string) {
    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw ApiError.notFound("Rating not found");
    }

    // Create a flag record (assuming there's a RatingFlag model)
    // For now, we'll just log it
    console.log(`[Trust] Low rating flagged: ${ratingId} for user ${userId}`);

    // In production, you might want to:
    // 1. Create a RatingFlag record
    // 2. Notify admins
    // 3. Trigger review process
  }

  /**
   * Get average rating for a user
   */
  static async getAverageRating(userId: string): Promise<number> {
    return this.calculateReputationScore(userId);
  }

  /**
   * Get rating count for a user
   */
  static async getRatingCount(userId: string): Promise<number> {
    const count = await prisma.rating.count({
      where: { toUserId: userId },
    });

    return count;
  }

  /**
   * Get top rated users
   */
  static async getTopRatedUsers(limit: number = 10) {
    const users = await prisma.user.findMany({
      where: { role: "FARMER" },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        reputationScore: true,
      },
      orderBy: { reputationScore: "desc" },
      take: limit,
    });

    return users;
  }

  /**
   * Update user reputation score in database
   */
  static async updateUserReputationScore(userId: string) {
    const score = await this.calculateReputationScore(userId);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { reputationScore: score },
      select: {
        id: true,
        name: true,
        reputationScore: true,
      },
    });

    // Emit real-time update
    try {
      const socketService = getSocketService();
      socketService.emitNotification(userId, {
        type: "REPUTATION",
        title: "Reputation Updated",
        message: `Your reputation score is now ${score.toFixed(2)}`,
        metadata: {
          reputationScore: score,
        },
      });
    } catch (err) {
      console.warn("[Socket] Reputation update notification failed:", err);
    }

    return updated;
  }
}
