import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { CsvService } from "../../utils/csv.service";
import { sendSuccess } from "../../utils/response";

export class CsvController {
  static async exportOrders(req: Request, res: Response) {
    const userId = req.user!.userId;
    const role = req.user!.role;

    // Get orders depending on role
    const where =
      role === "BUYER" ? { buyerId: userId } : role === "FARMER" ? { farmerId: userId } : {};

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const data = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      quantity: o.quantity,
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
    }));

    const filePath = await CsvService.exportToCsv(data, CsvService.getOrderHeaders(), "orders");
    return sendSuccess(res, { downloadUrl: filePath }, "Orders CSV generated");
  }

  static async exportProducts(req: Request, res: Response) {
    const userId = req.user!.userId;

    const products = await prisma.product.findMany({
      where: { farmerId: userId },
      orderBy: { createdAt: "desc" },
    });

    const data = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      quantity: p.quantity,
      isActive: p.isActive ? "YES" : "NO",
      createdAt: p.createdAt.toISOString(),
    }));

    const filePath = await CsvService.exportToCsv(data, CsvService.getProductHeaders(), "products");
    return sendSuccess(res, { downloadUrl: filePath }, "Products CSV generated");
  }
}
