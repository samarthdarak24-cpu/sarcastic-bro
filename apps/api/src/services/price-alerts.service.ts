import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as cron from 'node-cron';

interface PriceAlert {
  id: string;
  userId: string;
  cropName: string;
  targetPrice: number;
  alertType: 'above' | 'below';
  isActive: boolean;
  createdAt: Date;
}

interface Recommendation {
  id: string;
  userId: string;
  type: 'price' | 'crop' | 'market';
  title: string;
  description: string;
  relevanceScore: number;
  createdAt: Date;
}

@Injectable()
export class PriceAlertsService {
  private readonly logger = new Logger(PriceAlertsService.name);
  private priceAlerts: Map<string, PriceAlert> = new Map();

  constructor(private prisma: PrismaService) {
    this.initializePriceMonitoring();
  }

  async createPriceAlert(
    userId: string,
    cropName: string,
    targetPrice: number,
    alertType: 'above' | 'below'
  ): Promise<PriceAlert> {
    try {
      this.logger.log(`Creating price alert for user: ${userId}`);

      const alert: PriceAlert = {
        id: `alert-${Date.now()}`,
        userId,
        cropName,
        targetPrice,
        alertType,
        isActive: true,
        createdAt: new Date(),
      };

      this.priceAlerts.set(alert.id, alert);

      // Save to database
      // await this.prisma.priceAlert.create({ data: alert });

      return alert;
    } catch (error) {
      this.logger.error(`Failed to create price alert: ${error.message}`);
      throw error;
    }
  }

  async getPriceAlerts(userId: string): Promise<PriceAlert[]> {
    try {
      const alerts = Array.from(this.priceAlerts.values()).filter((a) => a.userId === userId);
      return alerts;
    } catch (error) {
      this.logger.error(`Failed to get price alerts: ${error.message}`);
      throw error;
    }
  }

  async deletePriceAlert(alertId: string): Promise<void> {
    try {
      this.priceAlerts.delete(alertId);
      this.logger.log(`Price alert deleted: ${alertId}`);
    } catch (error) {
      this.logger.error(`Failed to delete price alert: ${error.message}`);
      throw error;
    }
  }

  private initializePriceMonitoring(): void {
    // Run price monitoring every hour
    cron.schedule('0 * * * *', async () => {
      this.logger.log('Running price monitoring');
      await this.monitorPrices();
    });
  }

  private async monitorPrices(): Promise<void> {
    try {
      for (const alert of this.priceAlerts.values()) {
        if (!alert.isActive) continue;

        const currentPrice = await this.getCurrentPrice(alert.cropName);

        if (this.shouldTriggerAlert(currentPrice, alert.targetPrice, alert.alertType)) {
          await this.triggerAlert(alert, currentPrice);
        }
      }
    } catch (error) {
      this.logger.error(`Price monitoring failed: ${error.message}`);
    }
  }

  private async getCurrentPrice(cropName: string): Promise<number> {
    try {
      const product = await this.prisma.product.findFirst({
        where: { name: { contains: cropName, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
      });

      return product?.price || 0;
    } catch (error) {
      this.logger.error(`Failed to get current price: ${error.message}`);
      return 0;
    }
  }

  private shouldTriggerAlert(currentPrice: number, targetPrice: number, alertType: 'above' | 'below'): boolean {
    if (alertType === 'above') {
      return currentPrice >= targetPrice;
    } else {
      return currentPrice <= targetPrice;
    }
  }

  private async triggerAlert(alert: PriceAlert, currentPrice: number): Promise<void> {
    try {
      this.logger.log(`Triggering alert for user: ${alert.userId}`);

      // Create notification
      await this.prisma.notification.create({
        data: {
          userId: alert.userId,
          type: 'PRICE_ALERT',
          title: `Price Alert: ${alert.cropName}`,
          message: `${alert.cropName} price is now ₹${currentPrice}`,
          relatedId: alert.id,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to trigger alert: ${error.message}`);
    }
  }

  async getRecommendations(userId: string): Promise<Recommendation[]> {
    try {
      this.logger.log(`Getting recommendations for user: ${userId}`);

      const recommendations: Recommendation[] = [];

      // Get user's crop history
      const userCrops = await this.prisma.product.findMany({
        where: { farmerId: userId },
        select: { name: true, price: true },
      });

      // Generate price recommendations
      for (const crop of userCrops) {
        const avgPrice = await this.getAveragePrice(crop.name);
        if (crop.price < avgPrice * 0.8) {
          recommendations.push({
            id: `rec-${Date.now()}`,
            userId,
            type: 'price',
            title: `Price Opportunity: ${crop.name}`,
            description: `Your ${crop.name} is priced below market average. Consider increasing price.`,
            relevanceScore: 0.9,
            createdAt: new Date(),
          });
        }
      }

      // Generate market recommendations
      const marketTrends = await this.getMarketTrends();
      for (const trend of marketTrends) {
        recommendations.push({
          id: `rec-${Date.now()}`,
          userId,
          type: 'market',
          title: `Market Trend: ${trend.name}`,
          description: trend.description,
          relevanceScore: trend.relevance,
          createdAt: new Date(),
        });
      }

      return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      this.logger.error(`Failed to get recommendations: ${error.message}`);
      return [];
    }
  }

  private async getAveragePrice(cropName: string): Promise<number> {
    try {
      const products = await this.prisma.product.findMany({
        where: { name: { contains: cropName, mode: 'insensitive' } },
        select: { price: true },
      });

      if (products.length === 0) return 0;

      const total = products.reduce((sum, p) => sum + p.price, 0);
      return total / products.length;
    } catch (error) {
      this.logger.error(`Failed to get average price: ${error.message}`);
      return 0;
    }
  }

  private async getMarketTrends(): Promise<any[]> {
    try {
      // Placeholder for market trends
      return [
        {
          name: 'Wheat',
          description: 'Wheat prices are rising due to increased demand',
          relevance: 0.85,
        },
        {
          name: 'Rice',
          description: 'Rice market is stable with steady demand',
          relevance: 0.75,
        },
      ];
    } catch (error) {
      this.logger.error(`Failed to get market trends: ${error.message}`);
      return [];
    }
  }

  async personalizeRecommendations(userId: string, preferences: any): Promise<Recommendation[]> {
    try {
      const recommendations = await this.getRecommendations(userId);

      // Filter based on preferences
      return recommendations.filter((rec) => {
        if (preferences.types && !preferences.types.includes(rec.type)) {
          return false;
        }
        if (preferences.minRelevance && rec.relevanceScore < preferences.minRelevance) {
          return false;
        }
        return true;
      });
    } catch (error) {
      this.logger.error(`Failed to personalize recommendations: ${error.message}`);
      return [];
    }
  }

  async deliverRecommendations(userId: string, recommendations: Recommendation[]): Promise<void> {
    try {
      for (const rec of recommendations) {
        await this.prisma.notification.create({
          data: {
            userId,
            type: 'RECOMMENDATION',
            title: rec.title,
            message: rec.description,
            relatedId: rec.id,
          },
        });
      }

      this.logger.log(`Delivered ${recommendations.length} recommendations to user: ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to deliver recommendations: ${error.message}`);
    }
  }
}
