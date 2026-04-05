import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export class SupplierInsightsService {
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  async getSupplierPerformanceAnalytics(supplierId: string) {
    const orders = await prisma.order.findMany({
      where: { sellerId: supplierId },
      include: { product: true, buyer: true },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;
    const avgRating = orders.reduce((sum, o) => sum + (o.rating || 0), 0) / totalOrders || 0;
    
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

    // ML prediction for future performance
    try {
      const mlPrediction = await axios.post(`${this.aiServiceUrl}/api/supplier/predict-performance`, {
        supplierId,
        historicalData: {
          completionRate,
          avgRating,
          totalOrders,
          cancellationRate
        }
      });

      return {
        supplierId,
        totalOrders,
        completedOrders,
        cancelledOrders,
        completionRate: Math.round(completionRate * 10) / 10,
        cancellationRate: Math.round(cancellationRate * 10) / 10,
        avgRating: Math.round(avgRating * 10) / 10,
        performanceScore: mlPrediction.data.performanceScore || 0,
        predictedTrend: mlPrediction.data.trend || 'stable',
        recommendation: mlPrediction.data.recommendation || 'Good supplier',
        lastUpdated: new Date()
      };
    } catch (error) {
      return {
        supplierId,
        totalOrders,
        completedOrders,
        cancelledOrders,
        completionRate: Math.round(completionRate * 10) / 10,
        cancellationRate: Math.round(cancellationRate * 10) / 10,
        avgRating: Math.round(avgRating * 10) / 10,
        performanceScore: Math.min(100, completionRate * 0.6 + avgRating * 20 - cancellationRate * 0.4),
        predictedTrend: 'stable',
        recommendation: 'Good supplier',
        lastUpdated: new Date()
      };
    }
  }

  async getQualityConsistencyTracker(supplierId: string) {
    const orders = await prisma.order.findMany({
      where: { 
        sellerId: supplierId,
        status: 'DELIVERED'
      },
      include: { product: true },
      orderBy: { deliveredAt: 'desc' },
      take: 50
    });

    const qualityScores = orders.map(o => o.qualityScore || 0).filter(s => s > 0);
    const avgQuality = qualityScores.reduce((sum, s) => sum + s, 0) / qualityScores.length || 0;
    
    const recentQuality = qualityScores.slice(0, 10).reduce((sum, s) => sum + s, 0) / 10 || 0;
    const olderQuality = qualityScores.slice(10, 30).reduce((sum, s) => sum + s, 0) / 20 || 0;
    
    const trend = recentQuality > olderQuality ? 'improving' : recentQuality < olderQuality ? 'declining' : 'stable';
    const consistency = this.calculateConsistency(qualityScores);

    const monthlyData = this.groupByMonth(orders);

    return {
      supplierId,
      avgQuality: Math.round(avgQuality * 10) / 10,
      recentQuality: Math.round(recentQuality * 10) / 10,
      trend,
      consistencyScore: Math.round(consistency * 10) / 10,
      totalDeliveries: orders.length,
      monthlyData,
      lastUpdated: new Date()
    };
  }

  async getDeliveryReliabilityScore(supplierId: string) {
    const orders = await prisma.order.findMany({
      where: { sellerId: supplierId },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED' && o.deliveredAt);
    const onTimeDeliveries = deliveredOrders.filter(o => {
      const expectedDate = new Date(o.expectedDeliveryDate);
      const actualDate = new Date(o.deliveredAt!);
      return actualDate <= expectedDate;
    });

    const onTimeRate = deliveredOrders.length > 0 
      ? (onTimeDeliveries.length / deliveredOrders.length) * 100 
      : 0;

    const avgDelayDays = this.calculateAvgDelay(deliveredOrders);

    try {
      const prediction = await axios.post(`${this.aiServiceUrl}/api/supplier/predict-delivery`, {
        supplierId,
        onTimeRate,
        avgDelayDays,
        totalDeliveries: deliveredOrders.length
      });

      return {
        supplierId,
        onTimeRate: Math.round(onTimeRate * 10) / 10,
        avgDelayDays: Math.round(avgDelayDays * 10) / 10,
        totalDeliveries: deliveredOrders.length,
        reliabilityScore: prediction.data.reliabilityScore || Math.max(0, 100 - avgDelayDays * 5),
        predictedOnTime: prediction.data.predictedOnTime || onTimeRate,
        riskLevel: prediction.data.riskLevel || 'low',
        lastUpdated: new Date()
      };
    } catch (error) {
      return {
        supplierId,
        onTimeRate: Math.round(onTimeRate * 10) / 10,
        avgDelayDays: Math.round(avgDelayDays * 10) / 10,
        totalDeliveries: deliveredOrders.length,
        reliabilityScore: Math.max(0, 100 - avgDelayDays * 5),
        predictedOnTime: onTimeRate,
        riskLevel: avgDelayDays > 3 ? 'high' : avgDelayDays > 1 ? 'medium' : 'low',
        lastUpdated: new Date()
      };
    }
  }

  async getPriceCompetitivenessAnalysis(supplierId: string) {
    const supplierProducts = await prisma.product.findMany({
      where: { farmerId: supplierId },
      include: { farmer: true }
    });

    const marketData = await Promise.all(
      supplierProducts.map(async (product) => {
        const similarProducts = await prisma.product.findMany({
          where: {
            name: product.name,
            farmerId: { not: supplierId }
          },
          take: 20
        });

        const marketPrices = similarProducts.map(p => p.price);
        const avgMarketPrice = marketPrices.reduce((sum, p) => sum + p, 0) / marketPrices.length || 0;
        const minPrice = Math.min(...marketPrices, product.price);
        const maxPrice = Math.max(...marketPrices, product.price);

        const pricePosition = avgMarketPrice > 0 
          ? ((product.price - avgMarketPrice) / avgMarketPrice) * 100 
          : 0;

        return {
          productId: product.id,
          productName: product.name,
          supplierPrice: product.price,
          avgMarketPrice: Math.round(avgMarketPrice * 100) / 100,
          minPrice,
          maxPrice,
          pricePosition: Math.round(pricePosition * 10) / 10,
          competitiveness: pricePosition < -10 ? 'very_competitive' : pricePosition < 0 ? 'competitive' : pricePosition < 10 ? 'average' : 'expensive'
        };
      })
    );

    const overallCompetitiveness = marketData.reduce((sum, d) => {
      const score = d.pricePosition < -10 ? 100 : d.pricePosition < 0 ? 80 : d.pricePosition < 10 ? 60 : 40;
      return sum + score;
    }, 0) / marketData.length || 0;

    return {
      supplierId,
      overallScore: Math.round(overallCompetitiveness * 10) / 10,
      productsAnalyzed: marketData.length,
      marketData,
      lastUpdated: new Date()
    };
  }

  async getSupplierRiskAssessment(supplierId: string) {
    const supplier = await prisma.user.findUnique({
      where: { id: supplierId },
      include: {
        farmerProfile: true,
        sellerOrders: { take: 100 }
      }
    });

    if (!supplier) throw new Error('Supplier not found');

    const orders = supplier.sellerOrders;
    const disputes = orders.filter(o => o.disputeReason).length;
    const cancellations = orders.filter(o => o.status === 'CANCELLED').length;
    const lateDeliveries = orders.filter(o => {
      if (!o.deliveredAt || !o.expectedDeliveryDate) return false;
      return new Date(o.deliveredAt) > new Date(o.expectedDeliveryDate);
    }).length;

    const disputeRate = orders.length > 0 ? (disputes / orders.length) * 100 : 0;
    const cancellationRate = orders.length > 0 ? (cancellations / orders.length) * 100 : 0;
    const lateDeliveryRate = orders.length > 0 ? (lateDeliveries / orders.length) * 100 : 0;

    const accountAge = Math.floor((Date.now() - new Date(supplier.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const isVerified = supplier.farmerProfile?.verified || false;

    const riskScore = this.calculateRiskScore({
      disputeRate,
      cancellationRate,
      lateDeliveryRate,
      accountAge,
      isVerified,
      totalOrders: orders.length
    });

    return {
      supplierId,
      riskScore: Math.round(riskScore * 10) / 10,
      riskLevel: riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high',
      factors: {
        disputeRate: Math.round(disputeRate * 10) / 10,
        cancellationRate: Math.round(cancellationRate * 10) / 10,
        lateDeliveryRate: Math.round(lateDeliveryRate * 10) / 10,
        accountAge,
        isVerified,
        totalOrders: orders.length
      },
      recommendations: this.getRiskRecommendations(riskScore),
      lastUpdated: new Date()
    };
  }

  async getCommunicationResponseTime(supplierId: string) {
    // Simulated communication data - in production, track actual message timestamps
    const messages = await prisma.message.findMany({
      where: { 
        OR: [
          { senderId: supplierId },
          { receiverId: supplierId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const responseTimes: number[] = [];
    for (let i = 1; i < messages.length; i++) {
      if (messages[i].senderId !== supplierId && messages[i-1].senderId === supplierId) {
        const diff = new Date(messages[i-1].createdAt).getTime() - new Date(messages[i].createdAt).getTime();
        responseTimes.push(diff / (1000 * 60)); // minutes
      }
    }

    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length 
      : 0;

    const medianResponseTime = this.calculateMedian(responseTimes);
    const responseRate = messages.length > 0 ? (responseTimes.length / (messages.length / 2)) * 100 : 0;

    return {
      supplierId,
      avgResponseTime: Math.round(avgResponseTime * 10) / 10,
      medianResponseTime: Math.round(medianResponseTime * 10) / 10,
      responseRate: Math.round(responseRate * 10) / 10,
      totalMessages: messages.length,
      rating: avgResponseTime < 30 ? 'excellent' : avgResponseTime < 120 ? 'good' : avgResponseTime < 360 ? 'average' : 'poor',
      lastUpdated: new Date()
    };
  }

  async getProductAvailabilityForecast(supplierId: string) {
    const products = await prisma.product.findMany({
      where: { farmerId: supplierId },
      include: {
        orders: {
          where: { createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } }
        }
      }
    });

    const forecasts = await Promise.all(
      products.map(async (product) => {
        const salesHistory = product.orders.map(o => o.quantity);
        const avgSales = salesHistory.reduce((sum, q) => sum + q, 0) / salesHistory.length || 0;
        
        const daysUntilStockout = product.quantity > 0 && avgSales > 0 
          ? Math.floor(product.quantity / (avgSales / 30)) 
          : 999;

        try {
          const mlForecast = await axios.post(`${this.aiServiceUrl}/api/supplier/forecast-availability`, {
            productId: product.id,
            currentStock: product.quantity,
            salesHistory,
            seasonality: product.category
          });

          return {
            productId: product.id,
            productName: product.name,
            currentStock: product.quantity,
            avgMonthlySales: Math.round(avgSales * 10) / 10,
            daysUntilStockout,
            predictedDemand: mlForecast.data.predictedDemand || avgSales,
            restockRecommendation: mlForecast.data.restockDate || null,
            availabilityStatus: daysUntilStockout < 7 ? 'critical' : daysUntilStockout < 30 ? 'low' : 'good'
          };
        } catch (error) {
          return {
            productId: product.id,
            productName: product.name,
            currentStock: product.quantity,
            avgMonthlySales: Math.round(avgSales * 10) / 10,
            daysUntilStockout,
            predictedDemand: avgSales,
            restockRecommendation: null,
            availabilityStatus: daysUntilStockout < 7 ? 'critical' : daysUntilStockout < 30 ? 'low' : 'good'
          };
        }
      })
    );

    return {
      supplierId,
      totalProducts: products.length,
      forecasts,
      lastUpdated: new Date()
    };
  }

  async getSupplierComparison(supplierIds: string[]) {
    const comparisons = await Promise.all(
      supplierIds.map(async (id) => {
        const [performance, quality, delivery, price, risk] = await Promise.all([
          this.getSupplierPerformanceAnalytics(id),
          this.getQualityConsistencyTracker(id),
          this.getDeliveryReliabilityScore(id),
          this.getPriceCompetitivenessAnalysis(id),
          this.getSupplierRiskAssessment(id)
        ]);

        const supplier = await prisma.user.findUnique({
          where: { id },
          include: { farmerProfile: true }
        });

        return {
          supplierId: id,
          supplierName: supplier?.name || 'Unknown',
          location: supplier?.farmerProfile?.location || 'Unknown',
          performance: performance.performanceScore,
          quality: quality.avgQuality,
          delivery: delivery.reliabilityScore,
          pricing: price.overallScore,
          risk: risk.riskScore,
          overallScore: (
            performance.performanceScore * 0.25 +
            quality.avgQuality * 10 * 0.25 +
            delivery.reliabilityScore * 0.25 +
            price.overallScore * 0.15 +
            (100 - risk.riskScore) * 0.10
          )
        };
      })
    );

    return {
      suppliers: comparisons.sort((a, b) => b.overallScore - a.overallScore),
      lastUpdated: new Date()
    };
  }

  async getTrustVerificationStatus(supplierId: string) {
    const supplier = await prisma.user.findUnique({
      where: { id: supplierId },
      include: {
        farmerProfile: true,
        sellerOrders: { take: 50 }
      }
    });

    if (!supplier) throw new Error('Supplier not found');

    const verifications = {
      identity: supplier.farmerProfile?.verified || false,
      phone: !!supplier.phone,
      email: !!supplier.email,
      address: !!supplier.farmerProfile?.location,
      bankAccount: !!supplier.farmerProfile?.bankDetails,
      businessLicense: !!supplier.farmerProfile?.businessLicense,
      qualityCertification: !!supplier.farmerProfile?.certifications
    };

    const verificationScore = Object.values(verifications).filter(v => v).length / Object.keys(verifications).length * 100;

    const trustScore = this.calculateTrustScore(supplier, verifications);

    return {
      supplierId,
      verifications,
      verificationScore: Math.round(verificationScore * 10) / 10,
      trustScore: Math.round(trustScore * 10) / 10,
      trustLevel: trustScore > 80 ? 'high' : trustScore > 50 ? 'medium' : 'low',
      blockchainVerified: false, // Placeholder for blockchain integration
      lastUpdated: new Date()
    };
  }

  async getSupplierRecommendations(buyerId: string, requirements: any) {
    const allSuppliers = await prisma.user.findMany({
      where: { role: 'FARMER' },
      include: {
        farmerProfile: true,
        products: true
      }
    });

    const scoredSuppliers = await Promise.all(
      allSuppliers.map(async (supplier) => {
        const [performance, quality, delivery, price, risk] = await Promise.all([
          this.getSupplierPerformanceAnalytics(supplier.id),
          this.getQualityConsistencyTracker(supplier.id),
          this.getDeliveryReliabilityScore(supplier.id),
          this.getPriceCompetitivenessAnalysis(supplier.id),
          this.getSupplierRiskAssessment(supplier.id)
        ]);

        const matchScore = this.calculateMatchScore(supplier, requirements, {
          performance,
          quality,
          delivery,
          price,
          risk
        });

        return {
          supplierId: supplier.id,
          supplierName: supplier.name,
          location: supplier.farmerProfile?.location,
          matchScore,
          performance: performance.performanceScore,
          quality: quality.avgQuality,
          delivery: delivery.reliabilityScore,
          pricing: price.overallScore,
          risk: risk.riskScore,
          products: supplier.products.length,
          reason: this.getRecommendationReason(matchScore, performance, quality, delivery)
        };
      })
    );

    return {
      buyerId,
      recommendations: scoredSuppliers
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10),
      lastUpdated: new Date()
    };
  }

  // Helper methods
  private calculateConsistency(scores: number[]): number {
    if (scores.length < 2) return 100;
    const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 100 - stdDev * 10);
  }

  private groupByMonth(orders: any[]) {
    const grouped: any = {};
    orders.forEach(order => {
      const month = new Date(order.deliveredAt || order.createdAt).toISOString().slice(0, 7);
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(order.qualityScore || 0);
    });

    return Object.entries(grouped).map(([month, scores]: [string, any]) => ({
      month,
      avgQuality: scores.reduce((sum: number, s: number) => sum + s, 0) / scores.length || 0,
      count: scores.length
    }));
  }

  private calculateAvgDelay(orders: any[]): number {
    const delays = orders
      .filter(o => o.deliveredAt && o.expectedDeliveryDate)
      .map(o => {
        const expected = new Date(o.expectedDeliveryDate).getTime();
        const actual = new Date(o.deliveredAt).getTime();
        return Math.max(0, (actual - expected) / (1000 * 60 * 60 * 24));
      });

    return delays.length > 0 ? delays.reduce((sum, d) => sum + d, 0) / delays.length : 0;
  }

  private calculateRiskScore(factors: any): number {
    let score = 0;
    score += factors.disputeRate * 2;
    score += factors.cancellationRate * 1.5;
    score += factors.lateDeliveryRate * 1;
    score -= factors.accountAge > 365 ? 10 : factors.accountAge > 180 ? 5 : 0;
    score -= factors.isVerified ? 15 : 0;
    score -= factors.totalOrders > 50 ? 10 : factors.totalOrders > 20 ? 5 : 0;
    return Math.max(0, Math.min(100, score));
  }

  private getRiskRecommendations(riskScore: number): string[] {
    if (riskScore < 30) return ['Low risk supplier', 'Recommended for large orders'];
    if (riskScore < 60) return ['Medium risk', 'Start with small orders', 'Monitor performance'];
    return ['High risk supplier', 'Proceed with caution', 'Use escrow payment', 'Request additional verification'];
  }

  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  private calculateTrustScore(supplier: any, verifications: any): number {
    let score = 0;
    score += Object.values(verifications).filter(v => v).length * 10;
    score += supplier.sellerOrders.length > 50 ? 20 : supplier.sellerOrders.length > 20 ? 10 : 0;
    const avgRating = supplier.sellerOrders.reduce((sum: number, o: any) => sum + (o.rating || 0), 0) / supplier.sellerOrders.length || 0;
    score += avgRating * 5;
    return Math.min(100, score);
  }

  private calculateMatchScore(supplier: any, requirements: any, metrics: any): number {
    let score = 0;
    
    if (requirements.minPerformance) {
      score += metrics.performance.performanceScore >= requirements.minPerformance ? 20 : 0;
    }
    
    if (requirements.minQuality) {
      score += metrics.quality.avgQuality * 10 >= requirements.minQuality ? 20 : 0;
    }
    
    if (requirements.location) {
      score += supplier.farmerProfile?.location?.includes(requirements.location) ? 15 : 0;
    }
    
    if (requirements.maxRisk) {
      score += metrics.risk.riskScore <= requirements.maxRisk ? 20 : 0;
    }
    
    score += metrics.delivery.reliabilityScore * 0.15;
    score += metrics.price.overallScore * 0.10;
    
    return Math.min(100, score);
  }

  private getRecommendationReason(matchScore: number, performance: any, quality: any, delivery: any): string {
    if (matchScore > 80) return 'Excellent match - High performance and quality';
    if (matchScore > 60) return 'Good match - Reliable supplier';
    if (matchScore > 40) return 'Moderate match - Consider for specific needs';
    return 'Low match - May not meet requirements';
  }
}

export const supplierInsightsService = new SupplierInsightsService();
