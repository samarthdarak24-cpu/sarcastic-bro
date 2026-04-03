/* ========================================================================
   Product Controller — HTTP handlers
   ======================================================================== */

import type { Request, Response } from "express";
import { ProductService } from "./product.service";
import { createProductSchema, updateProductSchema } from "./product.validation";
import { sendSuccess, sendCreated, sendPaginated } from "../../utils/response";

export class ProductController {
  static async create(req: Request, res: Response) {
    const data = createProductSchema.parse(req.body);
    const imageUrls = req.files
      ? (req.files as Express.Multer.File[]).map((f) => `/uploads/images/${f.filename}`)
      : undefined;
    const product = await ProductService.create(req.user!.userId, data, imageUrls);
    return sendCreated(res, product, "Product created");
  }

  static async getAll(req: Request, res: Response) {
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

  static async getById(req: Request, res: Response) {
    const product = await ProductService.getById(req.params.id);
    return sendSuccess(res, product);
  }

  static async update(req: Request, res: Response) {
    const data = updateProductSchema.parse(req.body);
    const product = await ProductService.update(req.params.id, req.user!.userId, data);
    return sendSuccess(res, product, "Product updated");
  }

  static async delete(req: Request, res: Response) {
    await ProductService.delete(req.params.id, req.user!.userId);
    return sendSuccess(res, null, "Product deleted");
  }
}
