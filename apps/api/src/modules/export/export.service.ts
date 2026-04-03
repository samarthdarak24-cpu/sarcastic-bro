import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import type { ExportOrdersInput, ExportProductsInput, ExportAnalyticsInput } from "./export.validation";

export class ExportService {
  private static convertArrayToCSV(data: any[]): string {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value || "";
        }).join(",")
      ),
    ].join("\n");

    return csvContent;
  }

  static async exportOrders(userId: string, filters: ExportOrdersInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound("User not found");

    const where: any = {};

    // Filter based on user role
    if (user.role === "FARMER") {
      where.farmerId = userId;
    } else if (user.role === "BUYER") {
      where.buyerId = userId;
    }

    // Apply date filter
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    // Apply status filter
    if (filters.status) {
      where.status = filters.status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        product: { select: { name: true, category: true } },
        buyer: { select: { name: true, email: true } },
        farmer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const csvData = orders.map(order => ({
      "Order ID": order.orderNumber,
      "Product": order.product.name,
      "Quantity": order.quantity,
      "Unit": order.unit,
      "Total Price": order.totalPrice,
      "Status": order.status,
      "Payment Status": order.paymentStatus,
      "Buyer": order.buyer.name,
      "Farmer": order.farmer.name,
      "Date": new Date(order.createdAt).toLocaleDateString(),
    }));

    return this.convertArrayToCSV(csvData);
  }

  static async exportProducts(userId: string, filters: ExportProductsInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound("User not found");

    if (user.role !== "FARMER") {
      throw ApiError.forbidden("Only farmers can export products");
    }

    const where: any = { farmerId: userId };

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const csvData = products.map(product => ({
      "Product ID": product.id,
      "Product Name": product.name,
      "Category": product.category,
      "Description": product.description || "",
      "Quantity": product.quantity,
      "Unit": product.unit,
      "Price (per unit)": product.pricePerUnit,
      "Quality Score": product.qualityScore || 0,
      "Location": product.district,
      "Status": product.status,
      "Date Added": new Date(product.createdAt).toLocaleDateString(),
    }));

    return this.convertArrayToCSV(csvData);
  }

  static async exportAnalytics(userId: string, filters: ExportAnalyticsInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound("User not found");

    const dateFilter: any = {};
    if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
    if (filters.endDate) dateFilter.lte = new Date(filters.endDate);

    const analytics: any = {};

    // Orders analytics
    if (!filters.metrics || filters.metrics.includes("orders")) {
      const orders = await prisma.order.findMany({
        where: {
          ...(user.role === "FARMER" ? { farmerId: userId } : { buyerId: userId }),
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
        },
      });

      analytics.totalOrders = orders.length;
      analytics.ordersDelivered = orders.filter(o => o.status === "DELIVERED").length;
      analytics.ordersAverageValue = orders.length > 0 ? orders.reduce((sum, o) => sum + o.totalPrice, 0) / orders.length : 0;
    }

    // Revenue analytics
    if (!filters.metrics || filters.metrics.includes("revenue")) {
      const orders = await prisma.order.findMany({
        where: {
          ...(user.role === "FARMER" ? { farmerId: userId } : { buyerId: userId }),
          status: "DELIVERED",
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
        },
      });

      analytics.totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    }

    // Products analytics
    if (!filters.metrics || filters.metrics.includes("products")) {
      analytics.totalProducts = await prisma.product.count({
        where: { farmerId: userId },
      });
    }

    // Reviews analytics
    if (!filters.metrics || filters.metrics.includes("reviews")) {
      const reviews = await prisma.review.findMany({
        where: {
          OR: [{ reviewerId: userId }, { revieweeId: userId }],
        },
      });

      analytics.averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
      analytics.totalReviews = reviews.length;
    }

    const csvData = [{ Metric: "Metric", Value: "Value" }, ...Object.entries(analytics).map(([key, value]) => ({
      Metric: key,
      Value: value,
    }))];

    return this.convertArrayToCSV(csvData);
  }
}
