import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export class MarketIntelligenceService {
  async getMarketIntelligence(filters: {
    category?: string;
    location?: string;
    days?: number;
  }) {
    const { category, location, days = 30 } = filters;

    // Get price data from orders
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        farmer: {
          select: { district: true, state: true }
        }
      }
    });

    // Filter by location if provided
    let filteredOrders = orders;
    if (location) {
      filteredOrders = orders.filter(o => 
        o.farmer.district?.toLowerCase().includes(location.toLowerCase()) ||
        o.farmer.state?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Calculate market metrics
    const avgPrice = filteredOrders.length > 0
      ? filteredOrders.reduce((sum, o) => sum + o.totalPrice, 0) / filteredOrders.length
      : 0;

    const minPrice = filteredOrders.length > 0
      ? Math.min(...filteredOrders.map(o => o.totalPrice))
      : 0;

    const maxPrice = filteredOrders.length > 0
      ? Math.max(...filteredOrders.map(o => o.totalPrice))
      : 0;

    return {
      category: category || 'All',
      location: location || 'All',
      period: `Last ${days} days`,
      metrics: {
        avgPrice,
        minPrice,
        maxPrice,
        priceRange: maxPrice - minPrice,
        totalTransactions: filteredOrders.length,
        avgOrderValue: avgPrice
      },
      trend: 'stable' // Would be calculated from historical data
    };
  }

  async getPriceTrends(filters: {
    category?: string;
    location?: string;
    days?: number;
  }) {
    const { category, location, days = 90 } = filters;

    // Get historical price data
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        farmer: {
          select: { district: true, state: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by week
    const weeklyData: { [key: string]: number[] } = {};
    orders.forEach(order => {
      const week = this.getWeekKey(order.createdAt);
      if (!weeklyData[week]) {
        weeklyData[week] = [];
      }
      weeklyData[week].push(order.totalPrice);
    });

    // Calculate weekly averages
    const trends = Object.entries(weeklyData).map(([week, prices]) => ({
      week,
      avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      volume: prices.length
    }));

    return {
      category: category || 'All',
      location: location || 'All',
      period: `Last ${days} days`,
      trends
    };
  }

  async getForecasts(filters: {
    category?: string;
    location?: string;
  }) {
    const { category, location } = filters;

    // Get recent price data for forecasting
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        farmer: {
          select: { district: true, state: true }
        }
      }
    });

    // Calculate average price
    const avgPrice = recentOrders.length > 0
      ? recentOrders.reduce((sum, o) => sum + o.totalPrice, 0) / recentOrders.length
      : 0;

    // Simple forecast: assume 5% monthly variation
    const nextMonth = avgPrice * 1.05;
    const nextQuarter = avgPrice * 1.08;

    // Call AI service for advanced forecasting if available
    let aiForecasts = null;
    try {
      const aiResponse = await axios.post(
        `${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/market/forecast`,
        {
          category,
          location,
          historicalData: recentOrders.map(o => ({
            price: o.totalPrice,
            date: o.createdAt
          }))
        },
        { timeout: 5000 }
      );
      aiForecasts = aiResponse.data;
    } catch (error) {
      console.log('AI service unavailable, using basic forecast');
    }

    return {
      category: category || 'All',
      location: location || 'All',
      forecasts: [
        {
          period: 'Next Month',
          predictedPrice: nextMonth,
          confidence: 0.75,
          trend: 'upward'
        },
        {
          period: 'Next Quarter',
          predictedPrice: nextQuarter,
          confidence: 0.65,
          trend: 'upward'
        }
      ],
      aiForecasts: aiForecasts || null,
      lastUpdated: new Date()
    };
  }

  async getMarketInsights(filters: {
    category?: string;
    location?: string;
  }) {
    const { category, location } = filters;

    // Get market data
    const intelligence = await this.getMarketIntelligence(filters);
    const trends = await this.getPriceTrends(filters);
    const forecasts = await this.getForecasts(filters);

    // Generate insights
    const insights = [];

    // Seasonal pattern insight
    if (trends.trends.length > 0) {
      const firstWeekPrice = trends.trends[0].avgPrice;
      const lastWeekPrice = trends.trends[trends.trends.length - 1].avgPrice;
      const priceChange = ((lastWeekPrice - firstWeekPrice) / firstWeekPrice) * 100;

      if (priceChange > 5) {
        insights.push({
          type: 'price_increase',
          message: `Prices have increased by ${priceChange.toFixed(1)}% over the period`,
          recommendation: 'Consider buying now before prices increase further'
        });
      } else if (priceChange < -5) {
        insights.push({
          type: 'price_decrease',
          message: `Prices have decreased by ${Math.abs(priceChange).toFixed(1)}% over the period`,
          recommendation: 'Wait for stabilization before making large purchases'
        });
      }
    }

    // Supply-demand insight
    if (intelligence.metrics.totalTransactions > 100) {
      insights.push({
        type: 'high_demand',
        message: 'High trading volume indicates strong market demand',
        recommendation: 'Secure supply early to avoid shortages'
      });
    }

    // Optimal purchase window
    if (forecasts.forecasts[0].trend === 'upward') {
      insights.push({
        type: 'optimal_window',
        message: 'Prices are expected to increase in the coming month',
        recommendation: 'This is a good time to make bulk purchases'
      });
    }

    return {
      category: category || 'All',
      location: location || 'All',
      intelligence,
      trends,
      forecasts,
      insights,
      generatedAt: new Date()
    };
  }

  private getWeekKey(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const week = Math.ceil((d.getDate() - d.getDay() + 1) / 7);
    return `${year}-W${week}`;
  }
}
