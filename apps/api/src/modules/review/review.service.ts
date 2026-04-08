/* ========================================================================
   Review Service — Rating and Review Management
   Manages user reviews, ratings, and reputation updates
   ======================================================================== */

import prisma from "../../prisma/client";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";
import { UserService } from "../user/user.service";

export class ReviewService {
  /**
   * Create a review
   * Enhanced with reputation update and Socket.IO notification
   */
  static async createReview(data: {
    authorId: string;
    targetId: string;
    productId?: string;
    rating: number;
    comment?: string;
  }) {
    try {
      // Validate rating
      if (data.rating < 1 || data.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Check if author and target are different
      if (data.authorId === data.targetId) {
        throw new Error('Cannot review yourself');
      }

      // Check if review already exists for this product
      if (data.productId) {
        const existingReview = await prisma.review.findFirst({
          where: {
            authorId: data.authorId,
            targetId: data.targetId,
            productId: data.productId,
          },
        });

        if (existingReview) {
          throw new Error('You have already reviewed this product from this user');
        }
      }

      // Create review
      const review = await prisma.review.create({
        data: {
          authorId: data.authorId,
          targetId: data.targetId,
          productId: data.productId,
          rating: data.rating,
          comment: data.comment,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          target: {
            select: {
              id: true,
              name: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Update target user's reputation score
      await UserService.updateReputationScore(data.targetId, data.rating);

      // Invalidate cache
      await redis.delPattern(`reviews:user:${data.targetId}*`);
      await redis.delPattern(`reviews:product:${data.productId}*`);

      // Emit Socket.IO event to target user
      try {
        const socketService = getSocketService();
        socketService.emitNotification(data.targetId, {
          type: 'NEW_REVIEW',
          title: 'New Review Received',
          message: `${review.author.name} gave you a ${data.rating}-star review`,
          metadata: {
            reviewId: review.id,
            authorId: data.authorId,
            authorName: review.author.name,
            rating: data.rating,
            productId: data.productId,
          },
        });
      } catch (socketError) {
        console.error('[Review] Socket.IO emission failed:', socketError);
      }

      return review;
    } catch (error: any) {
      console.error('[Review] Create review failed:', error.message);
      throw new Error(`Failed to create review: ${error.message}`);
    }
  }

  /**
   * Get reviews for a user
   * Enhanced with Redis caching (5 min TTL)
   */
  static async getUserReviews(userId: string, limit: number = 20) {
    try {
      // Try cache first
      const cacheKey = `reviews:user:${userId}:${limit}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[Review] User reviews cache hit for user ${userId}`);
        return cached;
      }

      const reviews = await prisma.review.findMany({
        where: { targetId: userId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              imageUrls: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      // Calculate rating distribution
      const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      };

      const result = {
        reviews,
        totalReviews: reviews.length,
        ratingDistribution,
      };

      // Cache for 5 minutes
      await redis.set(cacheKey, result, 300);

      return result;
    } catch (error: any) {
      console.error('[Review] Get user reviews failed:', error.message);
      throw new Error(`Failed to get user reviews: ${error.message}`);
    }
  }

  /**
   * Get reviews for a product
   * Enhanced with Redis caching (5 min TTL)
   */
  static async getProductReviews(productId: string, limit: number = 20) {
    try {
      // Try cache first
      const cacheKey = `reviews:product:${productId}:${limit}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[Review] Product reviews cache hit for product ${productId}`);
        return cached;
      }

      const reviews = await prisma.review.findMany({
        where: { productId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          target: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      // Calculate average rating
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      const result = {
        reviews,
        totalReviews: reviews.length,
        avgRating: parseFloat(avgRating.toFixed(2)),
      };

      // Cache for 5 minutes
      await redis.set(cacheKey, result, 300);

      return result;
    } catch (error: any) {
      console.error('[Review] Get product reviews failed:', error.message);
      throw new Error(`Failed to get product reviews: ${error.message}`);
    }
  }

  /**
   * Report a review for moderation
   * Enhanced with Socket.IO notification to admin
   */
  static async reportReview(reviewId: string, reporterId: string, reason: string) {
    try {
      // Verify review exists
      const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          target: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!review) {
        throw new Error('Review not found');
      }

      // Create notification for admin
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true },
      });

      // Emit Socket.IO event to all admins
      try {
        const socketService = getSocketService();
        for (const admin of admins) {
          socketService.emitNotification(admin.id, {
            type: 'REVIEW_REPORTED',
            title: 'Review Reported',
            message: `A review has been reported for moderation`,
            metadata: {
              reviewId,
              reporterId,
              reason,
              authorId: review.authorId,
              authorName: review.author.name,
              targetId: review.targetId,
              targetName: review.target.name,
              rating: review.rating,
            },
          });
        }
      } catch (socketError) {
        console.error('[Review] Socket.IO emission failed:', socketError);
      }

      return {
        success: true,
        message: 'Review reported successfully',
      };
    } catch (error: any) {
      console.error('[Review] Report review failed:', error.message);
      throw new Error(`Failed to report review: ${error.message}`);
    }
  }

  /**
   * Get review statistics for a user
   */
  static async getReviewStats(userId: string) {
    try {
      const reviews = await prisma.review.findMany({
        where: { targetId: userId },
        select: { rating: true },
      });

      const totalReviews = reviews.length;
      const avgRating = totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

      const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      };

      return {
        totalReviews,
        avgRating: parseFloat(avgRating.toFixed(2)),
        ratingDistribution,
      };
    } catch (error: any) {
      console.error('[Review] Get review stats failed:', error.message);
      throw new Error(`Failed to get review stats: ${error.message}`);
    }
  }
}
