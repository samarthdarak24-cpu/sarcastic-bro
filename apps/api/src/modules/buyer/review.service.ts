import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReviewService {
  async getReviews(filters: {
    targetId?: string;
    targetType?: string;
    page?: number;
    limit?: number;
  }) {
    const { targetId, targetType, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      verified: true
    };

    if (targetId) where.targetId = targetId;
    if (targetType) where.targetType = targetType;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, avatarUrl: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.count({ where })
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getReviewById(id: string) {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    if (!review) {
      throw new Error('Review not found');
    }

    return review;
  }

  async createReview(data: {
    authorId: string;
    targetId: string;
    targetType: string;
    rating: number;
    comment: string;
    orderId?: string;
  }) {
    const { authorId, targetId, targetType, rating, comment, orderId } = data;

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if order exists if orderId is provided
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Check if user is the buyer of the order
      if (order.buyerId !== authorId) {
        throw new Error('Only the buyer can review this order');
      }

      // Check for duplicate review
      const existingReview = await prisma.review.findFirst({
        where: {
          authorId,
          orderId,
          targetId
        }
      });

      if (existingReview) {
        throw new Error('You have already reviewed this order');
      }
    }

    const review = await prisma.review.create({
      data: {
        authorId,
        targetId,
        targetType,
        rating,
        comment,
        orderId,
        verified: true
      },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    // Update supplier/target rating
    await this.updateTargetRating(targetId);

    return review;
  }

  async updateReview(id: string, data: {
    rating?: number;
    comment?: string;
  }) {
    const review = await this.getReviewById(id);

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        rating: data.rating || review.rating,
        comment: data.comment || review.comment
      },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    // Update target rating
    await this.updateTargetRating(review.targetId);

    return updated;
  }

  async deleteReview(id: string) {
    const review = await this.getReviewById(id);

    await prisma.review.delete({
      where: { id }
    });

    // Update target rating
    await this.updateTargetRating(review.targetId);

    return { success: true };
  }

  private async updateTargetRating(targetId: string) {
    const reviews = await prisma.review.findMany({
      where: { targetId, verified: true },
      select: { rating: true }
    });

    if (reviews.length === 0) return;

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    // Update supplier rating
    await prisma.supplier.updateMany({
      where: { id: targetId },
      data: { rating: avgRating }
    });
  }
}
