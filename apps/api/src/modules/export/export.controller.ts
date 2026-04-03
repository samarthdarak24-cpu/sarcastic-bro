import type { Request, Response } from "express";
import { ExportService } from "./export.service";
import { exportOrdersSchema, exportProductsSchema, exportAnalyticsSchema } from "./export.validation";
import { asyncHandler } from "../../utils/asyncHandler";

export class ExportController {
  static async exportOrders(req: Request, res: Response) {
    const filters = exportOrdersSchema.parse(req.query);
    const csv = await ExportService.exportOrders(req.user!.userId, filters);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="orders.csv"');
    return res.send(csv);
  }

  static async exportProducts(req: Request, res: Response) {
    const filters = exportProductsSchema.parse(req.query);
    const csv = await ExportService.exportProducts(req.user!.userId, filters);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="products.csv"');
    return res.send(csv);
  }

  static async exportAnalytics(req: Request, res: Response) {
    const filters = exportAnalyticsSchema.parse(req.query);
    const csv = await ExportService.exportAnalytics(req.user!.userId, filters);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="analytics.csv"');
    return res.send(csv);
  }
}
