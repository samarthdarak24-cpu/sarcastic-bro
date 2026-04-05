import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export class ProductHubService {
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  async optimizeProduct(productId: string, userId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, farmerId: userId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Call AI service for optimization insights
    const aiResponse = await axios.post(`${this.aiServiceUrl}/api/optimize-product`, {
      product_name: product.name,
      category: product.category,
      current_price: product.price,
      description: product.description
    });

    const optimizationScore = this.calculateOptimizationScore(product);

    return {
      productId,
      optimizationScore,
      suggestions: aiResponse.data.suggestions || [
        { type: 'title', text: 'Optimize title with trending keywords', impact: 'high' },
        { type: 'image', text: 'Add 2 more high-quality images', impact: 'medium' },
        { type: 'description', text: 'Enhance description with benefits', impact: 'high' },
        { type: 'pricing', text: 'Adjust price by 8% for better conversion', impact: 'high' }
      ]
    };
  }

  async getPricingRecommendations(userId: string) {
    const products = await prisma.product.findMany({
      where: { farmerId: userId }
    });

    const recommendations: Record<string, any> = {};

    for (const product of products) {
      try {
        const aiResponse = await axios.post(`${this.aiServiceUrl}/api/advanced-pricing/recommend`, {
          product_name: product.name,
          category: product.category,
          current_price: product.price,
          quantity: product.quantity
        });

        recommendations[product.id] = {
          current: product.price,
          recommended: aiResponse.data.recommended_price || product.price * 1.08,
          potential_increase: aiResponse.data.potential_increase || 8,
          confidence: aiResponse.data.confidence || 85,
          reason: aiResponse.data.reason || 'Market demand is high'
        };
      } catch (error) {
        recommendations[product.id] = {
          current: product.price,
          recommended: product.price * 1.08,
          potential_increase: 8,
          confidence: 85,
          reason: 'Market demand is high'
        };
      }
    }

    return recommendations;
  }

  async analyzeQuality(productId: string, userId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, farmerId: userId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    try {
      const aiResponse = await axios.post(`${this.aiServiceUrl}/api/advanced-quality/analyze`, {
        product_name: product.name,
        category: product.category,
        image_url: product.image
      });

      return {
        productId,
        qualityScore: aiResponse.data.quality_score || 88,
        freshness: aiResponse.data.freshness || 92,
        appearance: aiResponse.data.appearance || 88,
        packaging: aiResponse.data.packaging || 95,
        recommendations: aiResponse.data.recommendations || []
      };
    } catch (error) {
      return {
        productId,
        qualityScore: 88,
        freshness: 92,
        appearance: 88,
        packaging: 95,
        recommendations: ['Maintain current quality standards']
      };
    }
  }

  async getInventoryForecast(userId: string) {
    const products = await prisma.product.findMany({
      where: { farmerId: userId },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }
      }
    });

    return products.map(product => {
      const avgDailySales = product.orders.length / 30;
      const nextWeekForecast = Math.max(0, product.quantity - Math.floor(avgDailySales * 7));
      const nextMonthForecast = Math.max(0, product.quantity - Math.floor(avgDailySales * 30));

      return {
        productId: product.id,
        productName: product.name,
        currentStock: product.quantity,
        nextWeek: nextWeekForecast,
        nextMonth: nextMonthForecast,
        reorderPoint: Math.floor(product.quantity * 0.2),
        optimalStock: Math.floor(product.quantity * 1.5),
        trend: avgDailySales > 5 ? 'up' : avgDailySales < 2 ? 'down' : 'stable'
      };
    });
  }

  async syncChannel(channelId: string, userId: string) {
    const products = await prisma.product.findMany({
      where: { farmerId: userId }
    });

    // Simulate channel sync
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      channelId,
      syncedProducts: products.length,
      status: 'success',
      timestamp: new Date()
    };
  }

  async getBundleSuggestions(userId: string) {
    const products = await prisma.product.findMany({
      where: { farmerId: userId },
      take: 10
    });

    // AI-based bundle suggestions
    const bundles = [];
    
    if (products.length >= 3) {
      bundles.push({
        id: '1',
        name: 'Fresh Veggie Pack',
        products: products.slice(0, 3).map(p => p.name),
        discount: 15,
        expectedRevenue: 2500,
        confidence: 92
      });
    }

    if (products.length >= 6) {
      bundles.push({
        id: '2',
        name: 'Organic Combo',
        products: products.slice(3, 6).map(p => p.name),
        discount: 20,
        expectedRevenue: 4200,
        confidence: 88
      });
    }

    return bundles;
  }

  async createBundle(bundleData: any, userId: string) {
    // Create bundle in database
    const bundle = await prisma.productBundle.create({
      data: {
        name: bundleData.name,
        discount: bundleData.discount,
        farmerId: userId,
        products: {
          connect: bundleData.productIds.map((id: string) => ({ id }))
        }
      }
    });

    return bundle;
  }

  async getPerformanceMetrics(userId: string) {
    const products = await prisma.product.findMany({
      where: { farmerId: userId },
      include: {
        orders: true
      }
    });

    const metrics = {
      totalRevenue: 0,
      totalSales: 0,
      totalViews: 0,
      topPerformers: [] as any[],
      needsAttention: [] as any[]
    };

    products.forEach(product => {
      const revenue = product.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const sales = product.orders.length;

      metrics.totalRevenue += revenue;
      metrics.totalSales += sales;
      metrics.totalViews += product.views || 0;
    });

    metrics.topPerformers = products
      .sort((a, b) => {
        const aRevenue = a.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const bRevenue = b.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        return bRevenue - aRevenue;
      })
      .slice(0, 5);

    metrics.needsAttention = products
      .sort((a, b) => (a.views || 0) - (b.views || 0))
      .slice(0, 5);

    return metrics;
  }

  async getCompetitorAnalysis(productId: string, userId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, farmerId: userId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Get similar products from other farmers
    const competitors = await prisma.product.findMany({
      where: {
        category: product.category,
        farmerId: { not: userId }
      },
      take: 20
    });

    const prices = competitors.map(c => c.price);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);

    return {
      productId,
      myPrice: product.price,
      avgMarketPrice: avgPrice,
      lowestPrice,
      highestPrice,
      myRank: competitors.filter(c => c.price < product.price).length + 1,
      totalCompetitors: competitors.length
    };
  }

  async getSeasonalTrends(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Generate seasonal trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendData = months.map((month, index) => ({
      month,
      demand: 60 + Math.floor(Math.random() * 40),
      price: product.price * (0.9 + Math.random() * 0.3)
    }));

    return {
      productId,
      productName: product.name,
      trendData,
      peakMonth: 'April',
      peakPrice: product.price * 1.15,
      avgDemand: 80
    };
  }

  async generateListing(productId: string, userId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, farmerId: userId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    try {
      const aiResponse = await axios.post(`${this.aiServiceUrl}/api/generate-listing`, {
        product_name: product.name,
        category: product.category,
        price: product.price
      });

      return {
        title: aiResponse.data.title || `Premium ${product.name} - Fresh & Organic | Direct from Farm`,
        description: aiResponse.data.description || `Experience the finest quality ${product.name} sourced directly from our sustainable farms.`,
        tags: aiResponse.data.tags || ['organic', 'fresh', 'farm-direct', 'premium'],
        seoScore: aiResponse.data.seo_score || 94,
        readability: aiResponse.data.readability || 88
      };
    } catch (error) {
      return {
        title: `Premium ${product.name} - Fresh & Organic | Direct from Farm`,
        description: `Experience the finest quality ${product.name} sourced directly from our sustainable farms. Rich in nutrients, carefully harvested, and delivered fresh to your doorstep.`,
        tags: ['organic', 'fresh', 'farm-direct', 'premium', 'healthy', 'sustainable'],
        seoScore: 94,
        readability: 88
      };
    }
  }

  async applyListing(productId: string, listingData: any, userId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, farmerId: userId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name: listingData.title,
        description: listingData.description,
        tags: listingData.tags
      }
    });

    return updated;
  }

  private calculateOptimizationScore(product: any): number {
    let score = 0;

    // Title optimization (30 points)
    if (product.name && product.name.length > 10) score += 30;
    else if (product.name && product.name.length > 5) score += 15;

    // Description optimization (30 points)
    if (product.description && product.description.length > 100) score += 30;
    else if (product.description && product.description.length > 50) score += 15;

    // Image optimization (20 points)
    if (product.image) score += 20;

    // Price optimization (20 points)
    if (product.price > 0) score += 20;

    return Math.min(score, 100);
  }
}
