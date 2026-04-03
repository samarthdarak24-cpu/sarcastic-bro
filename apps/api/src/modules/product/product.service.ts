/* ========================================================================
   Product Service — CRUD business logic
   ======================================================================== */

import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import { SearchService } from "../search/search.service";
import type { CreateProductInput, UpdateProductInput } from "./product.validation";

export class ProductService {
  static async create(farmerId: string, data: CreateProductInput, imageUrls?: string[]) {
    const product = await prisma.product.create({
      data: {
        ...data,
        farmerId,
        imageUrls: imageUrls ? JSON.stringify(imageUrls) : null,
      },
      include: { farmer: { select: { id: true, name: true, district: true } } },
    });

    // Index in Elasticsearch
    await SearchService.indexProduct(product);

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

    return { products, total, page, limit };
  }

  static async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        farmer: { select: { id: true, name: true, district: true, state: true, avatarUrl: true, reputationScore: true, kycStatus: true, ratingAvg: true } },
        reviews: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    if (!product) throw ApiError.notFound("Product not found");
    return product;
  }

  static async update(id: string, farmerId: string, data: UpdateProductInput) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound("Product not found");
    if (product.farmerId !== farmerId) throw ApiError.forbidden("You can only update your own products");

    const updated = await prisma.product.update({ where: { id }, data });

    // Re-index in Elasticsearch
    await SearchService.indexProduct(updated);

    return updated;
  }

  static async delete(id: string, farmerId: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw ApiError.notFound("Product not found");
    if (product.farmerId !== farmerId) throw ApiError.forbidden("You can only delete your own products");

    const deleted = await prisma.product.update({ where: { id }, data: { isActive: false } });

    // Remove from Elasticsearch index
    await SearchService.removeProduct(id);

    return deleted;
  }
}
