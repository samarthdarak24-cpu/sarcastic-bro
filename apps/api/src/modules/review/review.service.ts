import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";

interface CreateReviewInput {
  targetId: string;
  productId?: string;
  rating: number;
  comment?: string;
}

export class ReviewService {
  static async createReview(authorId: string, data: CreateReviewInput) {
    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: data.targetId },
    });

    if (!targetUser) {
      throw ApiError.notFound("User not found");
    }

    if (authorId === data.targetId) {
      throw ApiError.badRequest("Cannot review yourself");
    }

    if (data.rating < 1 || data.rating > 5) {
      throw ApiError.badRequest("Rating must be between 1 and 5");
    }

    const review = await prisma.review.create({
      data: {
        authorId,
        targetId: data.targetId,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        target: { select: { id: true, name: true } },
      },
    });

    // Update product rating if exists
    if (data.productId) {
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
      });

      if (product) {
        const allReviews = await prisma.review.findMany({
          where: { productId: data.productId },
        });

        const avgScore = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await prisma.product.update({
          where: { id: data.productId },
          data: { qualityScore: avgScore },
        });
      }
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: data.targetId,
        type: "SYSTEM",
        title: "New Review",
        message: `${review.author.name} left a ${data.rating}-star review`,
        metadata: JSON.stringify({ reviewId: review.id }),
      },
    });

    return review;
  }

  static async getReviews(userId: string, options: { page: number; limit: number }) {
    const skip = (options.page - 1) * options.limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { targetId: userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: options.limit,
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          product: { select: { id: true, name: true } },
        },
      }),
      prisma.review.count({ where: { targetId: userId } }),
    ]);

    return { reviews, total };
  }

  static async getProductReviews(productId: string, options?: { page: number; limit: number }) {
    const skip = options ? (options.page - 1) * options.limit : 0;
    const take = options?.limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
        skip,
        ...(take && { take }),
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.review.count({ where: { productId } }),
    ]);

    return { reviews, total };
  }

  static async updateReview(reviewId: string, userId: string, data: { rating?: number; comment?: string }) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw ApiError.notFound("Review not found");
    }

    if (review.authorId !== userId) {
      throw ApiError.forbidden("Only author can update review");
    }

    return prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.comment !== undefined && { comment: data.comment }),
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  static async deleteReview(reviewId: string, userId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw ApiError.notFound("Review not found");
    }

    if (review.authorId !== userId) {
      throw ApiError.forbidden("Only author can delete review");
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });
  }
}
