/* ========================================================================
   User Service — Profile and Reputation Management
   Manages user profiles, KYC, and reputation scores
   ======================================================================== */

import prisma from "../../prisma/client";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";

export class UserService {
  /**
   * Get user profile
   * Enhanced with Redis caching (5 min TTL)
   */
  static async getProfile(userId: string) {
    try {
      // Try cache first
      const cacheKey = `user:profile:${userId}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[User] Profile cache hit for user ${userId}`);
        return cached;
      }

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
          kycStatus: true,
          kycDocumentUrl: true,
          ratingAvg: true,
          totalOrders: true,
          successfulDeliveries: true,
          cancellationRate: true,
          reputationScore: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Cache for 5 minutes
      await redis.set(cacheKey, user, 300);

      return user;
    } catch (error: any) {
      console.error('[User] Get profile failed:', error.message);
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  }

  /**
   * Update user profile
   * Enhanced with cache invalidation
   */
  static async updateProfile(userId: string, data: {
    name?: string;
    phone?: string;
    district?: string;
    state?: string;
    address?: string;
    language?: string;
    avatarUrl?: string;
  }) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
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
          updatedAt: true,
        },
      });

      // Invalidate cache
      await redis.del(`user:profile:${userId}`);
      await redis.delPattern(`user:stats:${userId}`);

      return user;
    } catch (error: any) {
      console.error('[User] Update profile failed:', error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  /**
   * Upload KYC document
   * Enhanced with cache invalidation
   */
  static async uploadKYC(userId: string, data: {
    kycDocumentUrl: string;
    aadhaarNumber?: string;
    panNumber?: string;
  }) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          kycDocumentUrl: data.kycDocumentUrl,
          aadhaarNumber: data.aadhaarNumber,
          panNumber: data.panNumber,
          kycStatus: 'PENDING',
          updatedAt: new Date(),
        },
        select: {
          id: true,
          kycStatus: true,
          kycDocumentUrl: true,
          updatedAt: true,
        },
      });

      // Invalidate cache
      await redis.del(`user:profile:${userId}`);

      return user;
    } catch (error: any) {
      console.error('[User] Upload KYC failed:', error.message);
      throw new Error(`Failed to upload KYC: ${error.message}`);
    }
  }

  /**
   * Get user reputation
   * Enhanced with Redis caching (5 min TTL)
   */
  static async getReputation(userId: string) {
    try {
      // Try cache first
      const cacheKey = `user:reputation:${userId}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[User] Reputation cache hit for user ${userId}`);
        return cached;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          ratingAvg: true,
          totalOrders: true,
          successfulDeliveries: true,
          cancellationRate: true,
          reputationScore: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate additional metrics
      const deliveryRate = user.totalOrders > 0
        ? (user.successfulDeliveries / user.totalOrders) * 100
        : 0;

      const reputation = {
        ...user,
        deliveryRate: parseFloat(deliveryRate.toFixed(2)),
        badge: this.getReputationBadge(user.reputationScore),
      };

      // Cache for 5 minutes
      await redis.set(cacheKey, reputation, 300);

      return reputation;
    } catch (error: any) {
      console.error('[User] Get reputation failed:', error.message);
      throw new Error(`Failed to get reputation: ${error.message}`);
    }
  }

  /**
   * Get user statistics
   * Enhanced with Redis caching (5 min TTL)
   */
  static async getStats(userId: string) {
    try {
      // Try cache first
      const cacheKey = `user:stats:${userId}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[User] Stats cache hit for user ${userId}`);
        return cached;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              products: true,
              ordersAsBuyer: true,
              ordersAsFarmer: true,
              reviewsGiven: true,
              reviewsReceived: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const stats = {
        userId: user.id,
        role: user.role,
        totalProducts: user._count.products,
        totalOrdersAsBuyer: user._count.ordersAsBuyer,
        totalOrdersAsFarmer: user._count.ordersAsFarmer,
        totalReviewsGiven: user._count.reviewsGiven,
        totalReviewsReceived: user._count.reviewsReceived,
        ratingAvg: user.ratingAvg,
        reputationScore: user.reputationScore,
        successfulDeliveries: user.successfulDeliveries,
        cancellationRate: user.cancellationRate,
      };

      // Cache for 5 minutes
      await redis.set(cacheKey, stats, 300);

      return stats;
    } catch (error: any) {
      console.error('[User] Get stats failed:', error.message);
      throw new Error(`Failed to get stats: ${error.message}`);
    }
  }

  /**
   * Update reputation score
   * Called when a review is submitted
   * Enhanced with Socket.IO notification
   */
  static async updateReputationScore(userId: string, newRating: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          ratingAvg: true,
          _count: {
            select: {
              reviewsReceived: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate new average rating
      const totalReviews = user._count.reviewsReceived;
      const currentAvg = user.ratingAvg;
      const newAvg = ((currentAvg * totalReviews) + newRating) / (totalReviews + 1);

      // Calculate new reputation score (weighted formula)
      // Base: 100, Rating impact: 40%, Delivery rate: 30%, Cancellation penalty: 30%
      const ratingScore = (newAvg / 5) * 40;
      
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          successfulDeliveries: true,
          totalOrders: true,
          cancellationRate: true,
        },
      });

      if (!updatedUser) {
        throw new Error('User not found');
      }

      const deliveryScore = updatedUser.totalOrders > 0
        ? (updatedUser.successfulDeliveries / updatedUser.totalOrders) * 30
        : 0;
      
      const cancellationPenalty = updatedUser.cancellationRate * 30;
      
      const newReputationScore = Math.max(0, Math.min(100, 
        ratingScore + deliveryScore + (30 - cancellationPenalty)
      ));

      // Update user
      await prisma.user.update({
        where: { id: userId },
        data: {
          ratingAvg: newAvg,
          reputationScore: parseFloat(newReputationScore.toFixed(2)),
        },
      });

      // Invalidate cache
      await redis.delPattern(`user:*:${userId}`);

      // Emit Socket.IO event
      try {
        const socketService = getSocketService();
        socketService.emitNotification(userId, {
          type: 'REPUTATION_UPDATE',
          title: 'Reputation Updated',
          message: `Your reputation score is now ${newReputationScore.toFixed(1)}`,
          metadata: {
            oldScore: user.ratingAvg,
            newScore: newAvg,
            reputationScore: newReputationScore,
          },
        });
      } catch (socketError) {
        console.error('[User] Socket.IO emission failed:', socketError);
      }

      return {
        ratingAvg: parseFloat(newAvg.toFixed(2)),
        reputationScore: parseFloat(newReputationScore.toFixed(2)),
      };
    } catch (error: any) {
      console.error('[User] Update reputation score failed:', error.message);
      throw new Error(`Failed to update reputation score: ${error.message}`);
    }
  }

  /**
   * Get reputation badge based on score
   */
  private static getReputationBadge(score: number): string {
    if (score >= 90) return 'PLATINUM';
    if (score >= 75) return 'GOLD';
    if (score >= 60) return 'SILVER';
    if (score >= 40) return 'BRONZE';
    return 'STARTER';
  }
}
