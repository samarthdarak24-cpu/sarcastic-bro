import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import { redis } from "../../services/redis.service";

export interface AddFavoriteDto {
  farmerId: string;
  notes?: string;
}

export interface UpdateFavoriteDto {
  notes?: string;
}

export class FavoritesService {
  private static getCacheKey(buyerId: string) {
    return `favorites:${buyerId}`;
  }

  /**
   * Add a farmer to favorites
   * Validates: Requirements 15.1
   */
  static async addFavorite(buyerId: string, data: AddFavoriteDto) {
    // Check if farmer exists
    const farmer = await prisma.user.findUnique({
      where: { id: data.farmerId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!farmer) {
      throw ApiError.notFound("Farmer not found");
    }

    if (farmer.role !== "FARMER") {
      throw ApiError.badRequest("Can only favorite farmers");
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        buyerId_farmerId: {
          buyerId,
          farmerId: data.farmerId,
        },
      },
    });

    if (existing) {
      throw ApiError.conflict("Farmer is already in favorites");
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        buyerId,
        farmerId: data.farmerId,
        notes: data.notes,
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            reputationScore: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Invalidate cache
    await redis.del(this.getCacheKey(buyerId));

    return favorite;
  }

  /**
   * Remove a farmer from favorites
   * Validates: Requirements 15.2
   */
  static async removeFavorite(buyerId: string, farmerId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        buyerId_farmerId: {
          buyerId,
          farmerId,
        },
      },
    });

    if (!favorite) {
      throw ApiError.notFound("Favorite not found");
    }

    await prisma.favorite.delete({
      where: {
        buyerId_farmerId: {
          buyerId,
          farmerId,
        },
      },
    });

    // Invalidate cache
    await redis.del(this.getCacheKey(buyerId));

    return { success: true };
  }

  /**
   * Get all favorites for a buyer
   * Validates: Requirements 15.3
   */
  static async getFavorites(buyerId: string) {
    // Try cache first
    const cached = await redis.get(this.getCacheKey(buyerId));
    if (cached) {
      return JSON.parse(cached);
    }

    const favorites = await prisma.favorite.findMany({
      where: { buyerId },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            district: true,
            state: true,
            reputationScore: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        farmer_products: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
            qualityGrade: true,
            imageUrls: true,
          },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = favorites.map((fav) => ({
      id: fav.id,
      farmerId: fav.farmerId,
      farmer: fav.farmer,
      notes: fav.notes,
      recentProducts: fav.farmer_products || [],
      createdAt: fav.createdAt,
    }));

    // Cache for 1 hour
    await redis.setex(this.getCacheKey(buyerId), 3600, JSON.stringify(result));

    return result;
  }

  /**
   * Update favorite notes
   * Validates: Requirements 15.7
   */
  static async updateFavorite(buyerId: string, farmerId: string, data: UpdateFavoriteDto) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        buyerId_farmerId: {
          buyerId,
          farmerId,
        },
      },
    });

    if (!favorite) {
      throw ApiError.notFound("Favorite not found");
    }

    const updated = await prisma.favorite.update({
      where: {
        buyerId_farmerId: {
          buyerId,
          farmerId,
        },
      },
      data: {
        notes: data.notes,
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            reputationScore: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Invalidate cache
    await redis.del(this.getCacheKey(buyerId));

    return updated;
  }

  /**
   * Get favorite count for a farmer
   * Validates: Requirements 15.8
   */
  static async getFavoriteCount(farmerId: string) {
    const count = await prisma.favorite.count({
      where: { farmerId },
    });

    return { farmerId, count };
  }

  /**
   * Check if farmer is favorited by buyer
   */
  static async isFavorited(buyerId: string, farmerId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        buyerId_farmerId: {
          buyerId,
          farmerId,
        },
      },
    });

    return !!favorite;
  }

  /**
   * Get top favorited farmers
   */
  static async getTopFarmersByFavorites(limit: number = 10) {
    const farmers = await prisma.favorite.groupBy({
      by: ["farmerId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: limit,
    });

    const farmerIds = farmers.map((f) => f.farmerId);

    const farmerDetails = await prisma.user.findMany({
      where: { id: { in: farmerIds } },
      select: {
        id: true,
        name: true,
        email: true,
        reputationScore: true,
        avatarUrl: true,
      },
    });

    return farmerDetails.map((farmer) => {
      const favoriteCount = farmers.find((f) => f.farmerId === farmer.id)?._count.id || 0;
      return {
        ...farmer,
        favoriteCount,
      };
    });
  }
}
