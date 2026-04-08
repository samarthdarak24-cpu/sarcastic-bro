/* ========================================================================
   Analytics Service — Dashboard Analytics and Insights
   Provides aggregated analytics with Redis caching
   ======================================================================== */

import prisma from "../../prisma/client";
import { redis } from "../../services/redis.service";

export class AnalyticsService {
  /**
   * Get dashboard analytics for a user
   * Enhanced with Redis caching (5 min TTL)
   */
  static async getDashboardAnalytics(userId: string, role: string) {
    try {
      // Try cache first
      const cacheKey = `analytics:dashboard:${userId}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[Analytics] Dashboard cache hit for user ${userId}`);
        return cached;
      }

      let analytics: any = {};

      if (role === 'FARMER') {
        analytics = await this.getFarmerDashboard(userId);
      } else if (role === 'BUYER') {
        analytics = await this.getBuyerDashboard(userId);
      } else {
        analytics = await this.getAdminDashboard();
      }

      // Cache for 5 minutes
      await redis.set(cacheKey, analytics, 300);

      return analytics;
    } catch (error: any) {
      console.error('[Analytics] Get dashboard analytics failed:', error.message);
      throw new Error(`Failed to get dashboard analytics: ${error.message}`);
    }
  }

  /**
   * Get farmer-specific dashboard analytics
   */
  private static async getFarmerDashboard(farmerId: string) {
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      completedOrders,
      totalRevenue,
      pendingOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count({ where: { farmerId } }),
      prisma.product.count({ where: { farmerId, isActive: true } }),
      prisma.order.count({ where: { farmerId } }),
      prisma.order.count({ where: { farmerId, status: 'DELIVERED' } }),
      prisma.order.aggregate({
        where: { farmerId, status: 'DELIVERED' },
        _sum: { totalPrice: true },
      }),
      prisma.order.count({
        where: { farmerId, status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING'] } },
      }),
      prisma.order.findMany({
        where: { farmerId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { name: true } },
          buyer: { select: { name: true } },
        },
      }),
    ]);

    const successRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    return {
      totalProducts,
      activeProducts,
      inactiveProducts: totalProducts - activeProducts,
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders: totalOrders - completedOrders - pendingOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      successRate: Math.round(successRate * 10) / 10,
      recentOrders: recentOrders.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        product: order.product.name,
        buyer: order.buyer.name,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
      })),
    };
  }

  /**
   * Get buyer-specific dashboard analytics
   */
  private static async getBuyerDashboard(buyerId: string) {
    const [
      totalOrders,
      completedOrders,
      totalSpent,
      pendingOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count({ where: { buyerId } }),
      prisma.order.count({ where: { buyerId, status: 'DELIVERED' } }),
      prisma.order.aggregate({
        where: { buyerId, status: 'DELIVERED' },
        _sum: { totalPrice: true },
      }),
      prisma.order.count({
        where: { buyerId, status: { in: ['PENDING', 'CONFIRMED', 'PROCESSING'] } },
      }),
      prisma.order.findMany({
        where: { buyerId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { name: true } },
          farmer: { select: { name: true } },
        },
      }),
    ]);

    const successRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders: totalOrders - completedOrders - pendingOrders,
      totalSpent: totalSpent._sum.totalPrice || 0,
      successRate: Math.round(successRate * 10) / 10,
      recentOrders: recentOrders.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        product: order.product.name,
        farmer: order.farmer.name,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
      })),
    };
  }

  /**
   * Get admin dashboard analytics
   */
  private static async getAdminDashboard() {
    const [
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalProducts,
      totalOrders,
      totalRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'FARMER' } }),
      prisma.user.count({ where: { role: 'BUYER' } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { totalPrice: true },
      }),
    ]);

    return {
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
    };
  }

  /**
   * Get revenue analytics with time-series data
   * Enhanced with Redis caching (10 min TTL)
   */
  static async getRevenueAnalytics(userId: string, role: string, period: 'week' | 'month' | 'year' = 'month') {
    try {
      // Try cache first
      const cacheKey = `analytics:revenue:${userId}:${period}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[Analytics] Revenue cache hit for user ${userId}`);
        return cached;
      }

      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }

      const whereClause: any = {
        status: 'DELIVERED',
        deliveredAt: { gte: startDate },
      };

      if (role === 'FARMER') {
        whereClause.farmerId = userId;
      } else if (role === 'BUYER') {
        whereClause.buyerId = userId;
      }

      const orders = await prisma.order.findMany({
        where: whereClause,
        select: {
          totalPrice: true,
          deliveredAt: true,
        },
        orderBy: { deliveredAt: 'asc' },
      });

      // Group by date
      const revenueByDate: any = {};
      orders.forEach((order: any) => {
        const date = order.deliveredAt.toISOString().split('T')[0];
        revenueByDate[date] = (revenueByDate[date] || 0) + order.totalPrice;
      });

      const timeSeries = Object.entries(revenueByDate).map(([date, revenue]) => ({
        date,
        revenue,
      }));

      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
      const averageRevenue = orders.length > 0 ? totalRevenue / orders.length : 0;

      const result = {
        period,
        startDate,
        endDate: now,
        totalRevenue,
        averageRevenue: Math.round(averageRevenue * 100) / 100,
        totalOrders: orders.length,
        timeSeries,
      };

      // Cache for 10 minutes
      await redis.set(cacheKey, result, 600);

      return result;
    } catch (error: any) {
      console.error('[Analytics] Get revenue analytics failed:', error.message);
      throw new Error(`Failed to get revenue analytics: ${error.message}`);
    }
  }

  /**
   * Get order analytics with category breakdown
   * Enhanced with Redis caching (10 min TTL)
   */
  static async getOrderAnalytics(userId: string, role: string) {
    try {
      // Try cache first
      const cacheKey = `analytics:orders:${userId}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[Analytics] Order analytics cache hit for user ${userId}`);
        return cached;
      }

      const whereClause: any = {};
      if (role === 'FARMER') {
        whereClause.farmerId = userId;
      } else if (role === 'BUYER') {
        whereClause.buyerId = userId;
      }

      const [ordersByStatus, ordersByCategory] = await Promise.all([
        prisma.order.groupBy({
          by: ['status'],
          where: whereClause,
          _count: true,
          _sum: { totalPrice: true },
        }),
        prisma.order.findMany({
          where: whereClause,
          include: {
            product: { select: { category: true } },
          },
        }),
      ]);

      // Group by category
      const categoryStats: any = {};
      ordersByCategory.forEach((order: any) => {
        const category = order.product.category;
        if (!categoryStats[category]) {
          categoryStats[category] = { count: 0, revenue: 0 };
        }
        categoryStats[category].count++;
        if (order.status === 'DELIVERED') {
          categoryStats[category].revenue += order.totalPrice;
        }
      });

      const result = {
        byStatus: ordersByStatus.map((item: any) => ({
          status: item.status,
          count: item._count,
          revenue: item._sum.totalPrice || 0,
        })),
        byCategory: Object.entries(categoryStats).map(([category, stats]: any) => ({
          category,
          count: stats.count,
          revenue: stats.revenue,
        })),
      };

      // Cache for 10 minutes
      await redis.set(cacheKey, result, 600);

      return result;
    } catch (error: any) {
      console.error('[Analytics] Get order analytics failed:', error.message);
      throw new Error(`Failed to get order analytics: ${error.message}`);
    }
  }

  /**
   * Get product analytics
   * Enhanced with Redis caching (10 min TTL)
   */
  static async getProductAnalytics(farmerId: string) {
    try {
      // Try cache first
      const cacheKey = `analytics:products:${farmerId}`;
      const cached = await redis.get<any>(cacheKey);
      if (cached) {
        console.log(`[Analytics] Product analytics cache hit for farmer ${farmerId}`);
        return cached;
      }

      const [productsByCategory, topProducts] = await Promise.all([
        prisma.product.groupBy({
          by: ['category'],
          where: { farmerId },
          _count: true,
          _avg: { price: true },
        }),
        prisma.order.groupBy({
          by: ['productId'],
          where: { farmerId, status: 'DELIVERED' },
          _count: true,
          _sum: { totalPrice: true },
          orderBy: { _count: { productId: 'desc' } },
          take: 5,
        }),
      ]);

      // Get product details for top products
      const topProductDetails = await prisma.product.findMany({
        where: {
          id: { in: topProducts.map((p: any) => p.productId) },
        },
        select: {
          id: true,
          name: true,
          category: true,
          price: true,
        },
      });

      const result = {
        byCategory: productsByCategory.map((item: any) => ({
          category: item.category,
          count: item._count,
          averagePrice: Math.round((item._avg.price || 0) * 100) / 100,
        })),
        topProducts: topProducts.map((item: any) => {
          const product = topProductDetails.find((p: any) => p.id === item.productId);
          return {
            productId: item.productId,
            name: product?.name,
            category: product?.category,
            orderCount: item._count,
            totalRevenue: item._sum.totalPrice || 0,
          };
        }),
      };

      // Cache for 10 minutes
      await redis.set(cacheKey, result, 600);

      return result;
    } catch (error: any) {
      console.error('[Analytics] Get product analytics failed:', error.message);
      throw new Error(`Failed to get product analytics: ${error.message}`);
    }
  }
}
