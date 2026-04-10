/* ========================================================================
   Product Controller — HTTP handlers
   ======================================================================== */

import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware";
import { ProductService } from "./product.service";
import { createProductSchema, updateProductSchema } from "./product.validation";
import { sendSuccess, sendCreated, sendPaginated } from "../../utils/response";
import { getSocketService } from "../../services/socketService";
import prisma from "../../prisma/client";

export class ProductController {
  static async create(req: AuthRequest, res: Response) {
    const data = createProductSchema.parse(req.body);
    const imageUrls = req.files
      ? (req.files as Express.Multer.File[]).map((f) => `/uploads/images/${f.filename}`)
      : undefined;
    const product = await ProductService.create(req.user?.id || req.user?.userId || '', data, imageUrls);
    return sendCreated(res, product, "Product created");
  }

  static async getAll(req: AuthRequest, res: Response) {
    const { category, district, minPrice, maxPrice, search, page, limit } = req.query;
    const result = await ProductService.getAll({
      category: category as string,
      district: district as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      search: search as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    return sendPaginated(res, result.products, result.total, result.page, result.limit);
  }

  static async getById(req: AuthRequest, res: Response) {
    const product = await ProductService.getById(req.params.id);
    return sendSuccess(res, product);
  }

  static async update(req: AuthRequest, res: Response) {
    const data = updateProductSchema.parse(req.body);
    const imageUrls = req.files && (req.files as Express.Multer.File[]).length > 0
      ? (req.files as Express.Multer.File[]).map((f) => `/uploads/images/${f.filename}`)
      : undefined;
    
    // Get old product for price comparison
    const oldProduct = await ProductService.getById(req.params.id);
    const product = await ProductService.update(req.params.id, req.user?.id || req.user?.userId || '', data, imageUrls);
    
    // Emit price update if price changed
    if (data.price && oldProduct.price !== data.price) {
      try {
        const socketService = getSocketService();
        const change = data.price - oldProduct.price;
        const changePercent = (change / oldProduct.price) * 100;
        
        socketService.emitPriceUpdate(product.id, {
          newPrice: data.price,
          oldPrice: oldProduct.price,
          change,
          changePercent
        });
      } catch (err) {
        console.error('Socket emission failed:', err);
      }
    }
    
    return sendSuccess(res, product, "Product updated");
  }

  static async getByFarmer(req: AuthRequest, res: Response) {
    const products = await ProductService.getByFarmerId(req.user?.id || req.user?.userId || '');
    return sendSuccess(res, products);
  }

  static async toggleStatus(req: AuthRequest, res: Response) {
    const product = await ProductService.toggleStatus(req.params.id, req.user?.id || req.user?.userId || '');
    return sendSuccess(res, product, "Status toggled");
  }

  static async delete(req: AuthRequest, res: Response) {
    await ProductService.delete(req.params.id, req.user?.id || req.user?.userId || '');
    return sendSuccess(res, null, "Product deleted");
  }

  static async getInventoryLogs(req: AuthRequest, res: Response) {
    const logs = await prisma.inventoryLog.findMany({
      where: { productId: req.params.id },
      orderBy: { createdAt: "desc" },
    });
    return sendSuccess(res, logs);
  }
}
