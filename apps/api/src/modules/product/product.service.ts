/* ========================================================================
   Product Service — CRUD business logic with Redis caching
   ======================================================================== */

import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import { SearchService } from "../search/search.service";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";
import type { CreateProductInput, UpdateProductInput } from "./product.validation";

export class ProductService {
  private static readonly CACHE_TTL = 300; // 5 minutes
  private static readonly LIST_CACHE_TTL = 180; // 3 minutes

  static async create(farmerId: string, data: CreateProductInput, imageUrls?: string[]) {
    const product = await prisma.product.create({
      data: {
        ...data,
        farmerId,
        imageUrls: imageUrls ? JSON.stringify(imageUrls) : null,
      },
      include: { farmer: { select: { id: true, name: true, district: true } } },
    });

    // Add blockchain trace event for HARVEST
    try {
      const BlockchainTraceService = (await import('../blockchain-trace/blockchain-trace.service')).default;
      await BlockchainTraceService.addTraceEvent({
        productId: product.id,
        farmerId: product.farmerId,
        eventType: 'HARVEST',
        location: `${product.district}, ${product.state}`,
        metadata: {
          productName: product.name,
          category: product.category,
          quantity: product.quantity,
          unit: product.unit,
          harvestDate: product.harvestDate || new Date().toISOString()
        }
      });
    } catch (traceError) {
      console.warn('[Product Service] Blockchain trace event failed:', traceError);
    }

    // Index in Elasticsearch (soft fail)
    try {
      await SearchService.indexProduct(product);
    } catch (err) {
      console.warn("[ES] Index failed for product creation:", err);
    }

    // Cache the new product
    await redis.set(`product:${product.id}`, product, this.CACHE_TTL);

    // Invalidate list caches
    await redis.delPattern("products:list:*");

    // Real-time broadcast for new products
    try {
      const socketService = getSocketService();
      socketService.emitNotification("all", {
        type: "PRODUCT",
        title: "New Product Available",
        message: `${product.name} from ${product.farmer.name} is now available`,
        metadata: {
          productId: product.id,
          category: product.category,
          price: product.price,
        },
      });
    } catch (err) {
      console.warn("[Socket] Emission failed for product creation:", err);
    }

    return product;
  }


  static async getAll(filters?: {
    category?: string;
    district?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    // Generate cache key based on filters
    const cacheKey = `products:list:${JSON.stringify(filters || {})}`;

    // Try to get from cache
    const cached = await redis.get<{ products: any[]; total: number }>(cacheKey);
    if (cached) {
      return { ...cached, page, limit };
    }

    const where: any = { isActive: true };
    if (filters?.category && filters.category !== "All") where.category = filters.category;
    if (filters?.district) where.district = { contains: filters.district };
    if (filters?.minPrice) where.price = { ...where.price, gte: filters.minPrice };
    if (filters?.maxPrice) where.price = { ...where.price, lte: filters.maxPrice };
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { category: { contains: filters.search } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { farmer: { select: { id: true, name: true, district: true, state: true, reputationScore: true, kycStatus: true, ratingAvg: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    // Cache the result
    await redis.set(cacheKey, { products, total }, this.LIST_CACHE_TTL);

    return { products, total, page, limit };
  }

  static async getById(id: string) {
    // Try to get from cache
    const cached = await redis.get<any>(`product:${id}`);
    if (cached) {
      return cached;
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        farmer: { select: { id: true, name: true, district: true, state: true, avatarUrl: true, reputationScore: true, kycStatus: true, ratingAvg: true } },
        reviews: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    
    if (!product) throw ApiError.notFound("Product not found");

    // Cache the product
    await redis.set(`product:${id}`, product, this.CACHE_TTL);

    return product;
  }

  static async update(id: string, farmerId: string, data: UpdateProductInput) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound("Product not found");
    if (product.farmerId !== farmerId) throw ApiError.forbidden("You can only update your own products");

    const updated = await prisma.product.update({ 
      where: { id }, 
      data,
      include: { farmer: { select: { id: true, name: true, district: true } } },
    });

    // Re-index in Elasticsearch (soft fail)
    try {
      await SearchService.indexProduct(updated);
    } catch (e) {
      console.warn("[ES] Index fail ignored in update");
    }

    // Invalidate caches
    await redis.del(`product:${id}`);
    await redis.delPattern("products:list:*");

    // Emit real-time update if price changed
    if (data.price && product.price !== data.price) {
      try {
        const socketService = getSocketService();
        const change = data.price - product.price;
        const changePercent = ((change / product.price) * 100).toFixed(2);
        
        socketService.emitPriceUpdate(id, {
          newPrice: data.price,
          oldPrice: product.price,
          change,
          changePercent: parseFloat(changePercent),
        });
      } catch (err) {
        console.warn("[Socket] Price update emission failed:", err);
      }
    }

    return updated;
  }

  static async toggleStatus(id: string, farmerId: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound("Product not found");
    if (product.farmerId !== farmerId) throw ApiError.forbidden("Not your product");

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive }
    });

    // Invalidate caches
    await redis.del(`product:${id}`);
    await redis.delPattern("products:list:*");

    return updated;
  }

  static async delete(id: string, farmerId: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound("Product not found");
    if (product.farmerId !== farmerId) throw ApiError.forbidden("You can only delete your own products");

    const deleted = await prisma.product.update({ where: { id }, data: { isActive: false } });

    // Remove from Elasticsearch index (soft fail)
    try {
      await SearchService.removeProduct(id);
    } catch (e) {
      console.warn("[ES] Remove fail ignored in delete");
    }

    // Invalidate caches
    await redis.del(`product:${id}`);
    await redis.delPattern("products:list:*");

    return deleted;
  }

  /**
   * Update product quantity (for order processing)
   */
  static async updateQuantity(id: string, quantityChange: number) {
    const product = await prisma.product.update({
      where: { id },
      data: { quantity: { increment: quantityChange } },
    });

    // Invalidate cache
    await redis.del(`product:${id}`);

    // Emit low stock alert if quantity is low
    if (product.quantity < 10 && product.quantity > 0) {
      try {
        const socketService = getSocketService();
        socketService.emitNotification(product.farmerId, {
          type: "INVENTORY",
          title: "Low Stock Alert",
          message: `${product.name} is running low (${product.quantity} ${product.unit} remaining)`,
          metadata: { productId: id, quantity: product.quantity },
        });
      } catch (err) {
        console.warn("[Socket] Low stock alert failed:", err);
      }
    }

    return product;
  }

  /**
   * Get products by farmer with caching
   */
  static async getByFarmerId(farmerId: string) {
    const cacheKey = `products:farmer:${farmerId}`;
    
    // Try cache first
    const cached = await redis.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const products = await prisma.product.findMany({
      where: { farmerId, isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        farmer: { select: { name: true, district: true } }
      }
    });

    // Cache the result
    await redis.set(cacheKey, products, this.CACHE_TTL);

    return products;
  }
}