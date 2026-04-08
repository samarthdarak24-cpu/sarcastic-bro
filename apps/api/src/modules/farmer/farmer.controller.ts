import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { sendSuccess, sendError } from "../../utils/response";
import { getSocketService } from "../../services/socketService";

export class FarmerDashboardController {
  /**
   * Get main dashboard metrics (KPIs)
   */
  static async getDashboardMetrics(req: any, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      // Total Crops Value (Active products sum)
      const products = await prisma.product.findMany({
        where: { farmerId: userId, isActive: true }
      });
      const totalCropsValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);

      // Active Orders
      const activeOrdersCount = await prisma.order.count({
        where: { farmerId: userId, status: { in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"] } }
      });

      // Pending Payments (Payments for farmer that are still in Escrow or Pending)
      const pendingPayments = await prisma.payment.aggregate({
        where: { sellerId: userId, status: "PENDING" },
        _sum: { amount: true }
      });

      // Profit Gain (Mocked based on recent trend from analytics)
      const profitGain = 18.5; // Heuristic from last month

      return sendSuccess(res, {
        totalCropsValue,
        activeOrders: activeOrdersCount,
        pendingPayments: pendingPayments._sum.amount || 0,
        profitGain
      }, "Farmer dashboard metrics retrieved");
    } catch (err) {
      console.error(err);
      return sendError(res, "Failed to retrieve metrics");
    }
  }

  /**
   * Get Live Mandi Prices (Simulator)
   */
  static async getMandiPrices(req: Request, res: Response) {
    const mandiData = [
      { commodity: 'Wheat', variety: 'Sharbati', price: 2450, change: 45, trend: 'up', market: 'Indore Mandi' },
      { commodity: 'Rice', variety: 'Basmati', price: 3800, change: -20, trend: 'down', market: 'Karnal Mandi' },
      { commodity: 'Tomato', variety: 'Local', price: 1200, change: 150, trend: 'up', market: 'Azadpur Mandi' },
      { commodity: 'Onion', variety: 'Nasik Red', price: 2100, change: 10, trend: 'up', market: 'Lasalgaon Mandi' },
      { commodity: 'Turmeric', variety: 'Erode', price: 9200, change: -100, trend: 'down', market: 'Erode Mandi' },
    ];
    return sendSuccess(res, mandiData, "Mandi prices retrieved");
  }

  /**
   * Get Global Export Opportunities
   */
  static async getExportOpportunities(req: Request, res: Response) {
    const exportOpps = [
      { country: 'United Arab Emirates', commodity: 'Basmati Rice', demand: 'High', profitMargin: '22%', market: 'Dubai' },
      { country: 'Germany', commodity: 'Organic Spices', demand: 'Medium', profitMargin: '35%', market: 'Hamburg' },
      { country: 'United Kingdom', commodity: 'Fresh Mangoes', demand: 'Critical', profitMargin: '40%', market: 'London' },
      { country: 'Vietnam', commodity: 'Cashew Nuts', demand: 'High', profitMargin: '18%', market: 'Ho Chi Minh' },
    ];
    return sendSuccess(res, exportOpps, "Export opportunities retrieved");
  }

  /**
   * Get Recent Activity Intelligence
   */
  static async getRecentActivity(req: any, res: Response) {
    const userId = req.user?.userId;
    // Mocking recent events for now, ideally fetch from AuditLog or Notifications
    const activities = [
        { type: 'order', title: 'Order Confirmed', desc: 'Order #TX-9402 for Wheat (10t) accepted', time: '1h ago', status: 'success' },
        { type: 'price', title: 'High Price Alert', desc: 'Rice prices up 15% in nearby markets', time: '3h ago', status: 'warning' },
        { type: 'quality', title: 'Quality Cert Issued', desc: 'Scan #QC-821 verified as Grade A', time: '5h ago', status: 'info' }
    ];
    return sendSuccess(res, activities, "Recent activity retrieved");
  }

  /**
   * Get Farmer's Crop Inventory
   */
  static async getCrops(req: any, res: Response) {
    try {
      const userId = req.user?.userId;
      const products = await prisma.product.findMany({
        where: { farmerId: userId },
        orderBy: { createdAt: "desc" }
      });
      return sendSuccess(res, products, "Crops retrieved");
    } catch (err) {
      return sendError(res, "Failed to retrieve crops");
    }
  }

  /**
   * Get Farmer's Orders
   */
  static async getOrders(req: any, res: Response) {
    try {
      const userId = req.user?.userId;
      const orders = await prisma.order.findMany({
        where: { farmerId: userId },
        include: { product: true, buyer: { select: { name: true, district: true } } },
        orderBy: { createdAt: "desc" }
      });
      return sendSuccess(res, orders, "Orders retrieved");
    } catch (err) {
      return sendError(res, "Failed to retrieve orders");
    }
  }
}
