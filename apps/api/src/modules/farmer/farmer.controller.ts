import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { sendSuccess, sendError } from "../../utils/response";
import axios from "axios";

export class FarmerDashboardController {
  /**
   * Get main dashboard metrics (KPIs)
   */
  static async getDashboardMetrics(req: any, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, "Unauthorized", 401);

      const products = await prisma.product.findMany({
        where: { farmerId: userId, isActive: true }
      });
      const totalCropsValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);

      const activeOrdersCount = await prisma.order.count({
        where: { farmerId: userId, status: { in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"] } }
      });

      const pendingPayments = await prisma.payment.aggregate({
        where: { sellerId: userId, status: "PENDING" },
        _sum: { amount: true }
      });

      const profitGain = 18.5;

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
      { commodity: "Wheat", price: 2150, change: 2.5, market: "Pune APMC" },
      { commodity: "Rice", price: 3200, change: -1.2, market: "Mumbai APMC" },
      { commodity: "Tomato", price: 45, change: 8.3, market: "Nashik APMC" },
      { commodity: "Onion", price: 32, change: -3.1, market: "Lasalgaon APMC" },
      { commodity: "Potato", price: 28, change: 1.8, market: "Pune APMC" }
    ];
    return res.json(mandiData);
  }

  /**
   * Get Global Export Opportunities
   */
  static async getExportOpportunities(req: Request, res: Response) {
    const exportData = [
      { country: "UAE", demand: "Basmati Rice", volume: "500 MT", price: "$850/MT" },
      { country: "USA", demand: "Organic Turmeric", volume: "200 MT", price: "$1200/MT" },
      { country: "UK", demand: "Fresh Mangoes", volume: "150 MT", price: "$950/MT" }
    ];
    return res.json(exportData);
  }

  /**
   * Get Recent Activity Intelligence
   */
  static async getRecentActivity(req: any, res: Response) {
    try {
      const userId = req.user?.userId;
      const activities = await prisma.order.findMany({
        where: { farmerId: userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { buyer: { select: { name: true } }, product: { select: { name: true } } }
      });

      const formatted = activities.map(a => ({
        type: "Order",
        description: `${a.buyer?.name || 'Buyer'} ordered ${a.product?.name || 'product'}`,
        timestamp: a.createdAt,
        status: a.status
      }));

      return res.json(formatted);
    } catch (err) {
      console.error(err);
      return sendError(res, "Failed to retrieve activity");
    }
  }

  /**
   * Get Farmer's Crop Inventory
   */
  static async getCrops(req: any, res: Response) {
    try {
      const userId = req.user?.userId;
      const crops = await prisma.product.findMany({
        where: { farmerId: userId },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(crops);
    } catch (err) {
      console.error(err);
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
        include: { buyer: true, product: true },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(orders);
    } catch (err) {
      console.error(err);
      return sendError(res, "Failed to retrieve orders");
    }
  }

  /**
   * Get Production Overview
   */
  static async getProductionOverview(req: any, res: Response) {
    try {
      const userId = req.user?.userId;
      const products = await prisma.product.findMany({
        where: { farmerId: userId }
      });

      const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

      return res.json({
        totalProducts: products.length,
        totalQuantity,
        totalValue,
        products
      });
    } catch (err) {
      console.error(err);
      return sendError(res, "Failed to retrieve production overview");
    }
  }

  /**
   * AI Quality Analysis
   */
  static async analyzeQuality(req: any, res: Response) {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return sendError(res, "Image URL is required", 400);
      }

      // Try to call AI service
      try {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
        const response = await axios.post(
          `${aiServiceUrl}/quality-shield/scan`,
          { imageUrl },
          { timeout: 30000 }
        );

        return sendSuccess(res, {
          grade: response.data.grade,
          score: response.data.score,
          defects: response.data.defects || 0,
          freshness: response.data.freshness || 0,
          color: response.data.color || 0,
          size: response.data.size || 0,
          recommendations: response.data.recommendations || []
        }, "Quality analysis completed");
      } catch (aiError) {
        // Fallback to mock analysis
        console.warn('AI service unavailable, using mock analysis');
        
        const grades = ['A+', 'A', 'B+', 'B', 'C'];
        const randomGrade = grades[Math.floor(Math.random() * grades.length)];
        
        const baseScore = randomGrade === 'A+' ? 95 : 
                          randomGrade === 'A' ? 85 : 
                          randomGrade === 'B+' ? 75 : 
                          randomGrade === 'B' ? 65 : 55;
        
        const score = baseScore + Math.floor(Math.random() * 5);
        const defects = randomGrade === 'A+' || randomGrade === 'A' ? 
                        Math.floor(Math.random() * 2) : 
                        Math.floor(Math.random() * 5) + 2;
        
        return sendSuccess(res, {
          grade: randomGrade,
          score,
          defects,
          freshness: Math.floor(Math.random() * 15) + 85,
          color: Math.floor(Math.random() * 10) + 90,
          size: Math.floor(Math.random() * 15) + 85,
          recommendations: [
            'Store in cool, dry place',
            'Handle with care to avoid bruising',
            randomGrade === 'A+' || randomGrade === 'A' ? 'Premium quality - suitable for export' : 'Consider sorting to remove defective items'
          ]
        }, "Quality analysis completed (mock mode)");
      }
    } catch (err) {
      console.error('Quality analysis error:', err);
      return sendError(res, "Failed to analyze quality");
    }
  }
}
