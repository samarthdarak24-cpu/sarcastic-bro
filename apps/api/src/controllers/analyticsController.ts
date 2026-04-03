import { Request, Response } from "express";
import prisma from "../prisma/client";

export class AnalyticsController {
  public static async getFarmerInsights(req: Request, res: Response) {
    try {
      const { userId } = (req as any).user;
      const { timeRange } = req.query; // '7d', '30d', '90d', '1y'

      // Set date boundaries
      const endDate = new Date();
      let startDate = new Date();
      if (timeRange === '7d') startDate.setDate(startDate.getDate() - 7);
      else if (timeRange === '90d') startDate.setDate(startDate.getDate() - 90);
      else if (timeRange === '1y') startDate.setFullYear(startDate.getFullYear() - 1);
      else startDate.setDate(startDate.getDate() - 30); // 30d default

      // 1. Revenue & Sales Aggregations
      const orders = await prisma.order.findMany({
        where: {
          farmerId: userId,
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] } // Count valid orders only
        },
        include: { product: true }
      });

      let totalRevenue = 0;
      let totalOrders = orders.length;

      // Group by Day for Time-Series Data
      const revenueByDate: Record<string, number> = {};
      const ordersByDate: Record<string, number> = {};
      const topProductsMap: Record<string, { name: string; quantity: number; revenue: number }> = {};

      orders.forEach(order => {
        const dateKey = order.createdAt.toISOString().split('T')[0];
        totalRevenue += order.totalPrice;

        revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + order.totalPrice;
        ordersByDate[dateKey] = (ordersByDate[dateKey] || 0) + 1;

        if (order.product) {
          const pid = order.productId;
          if (!topProductsMap[pid]) {
            topProductsMap[pid] = { name: order.product.name, quantity: 0, revenue: 0 };
          }
          topProductsMap[pid].quantity += order.quantity;
          topProductsMap[pid].revenue += order.totalPrice;
        }
      });

      // Prepare Chart Data format
      const chartData = Object.keys(revenueByDate).sort().map(date => ({
        date,
        revenue: revenueByDate[date],
        orders: ordersByDate[date]
      }));

      // Sort Top Products by Revenue
      const topProducts = Object.values(topProductsMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5); // Top 5

      // 2. Price Comparison Intelligence (Market vs Farmer)
      const farmerProducts = await prisma.product.findMany({
        where: { farmerId: userId, isActive: true },
        select: { id: true, category: true, name: true, price: true }
      });

      const categories = [...new Set(farmerProducts.map(p => p.category))];
      
      const marketAverages = await prisma.product.groupBy({
        by: ['category'],
        where: { category: { in: categories } },
        _avg: { price: true }
      });

      const priceComparison = farmerProducts.map(p => {
        const marketAvg = marketAverages.find(m => m.category === p.category)?._avg.price || p.price;
        return {
          productId: p.id,
          name: p.name,
          category: p.category,
          farmerPrice: p.price,
          marketAverage: Math.round(marketAvg * 100) / 100,
          premium: p.price > marketAvg ? ((p.price - marketAvg) / marketAvg) * 100 : 0
        };
      });

      res.json({
        success: true,
        data: {
          summary: {
            totalRevenue,
            totalOrders,
            period: timeRange || '30d'
          },
          chartTimeSeries: chartData,
          topProducts,
          priceComparison
        }
      });

    } catch (err: any) {
      console.error("[Analytics] Error fetching farmer insights:", err);
      res.status(500).json({ success: false, message: "Engine Failure retrieving aggregation metrics" });
    }
  }
}
