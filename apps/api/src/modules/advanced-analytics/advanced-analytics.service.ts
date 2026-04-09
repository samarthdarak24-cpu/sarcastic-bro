import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AdvancedAnalyticsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async predictDisease(data: {
    cropType: string;
    weatherData: {
      temperature: number;
      humidity: number;
      rainfall: number;
    };
    soilData: {
      ph: number;
      nitrogen: number;
      phosphorus: number;
    };
    imageAnalysis?: string;
  }) {
    // ML model simulation for disease prediction
    const riskFactors = this.calculateRiskFactors(data);
    const diseaseRisk = this.predictDiseaseRisk(riskFactors);

    return {
      cropType: data.cropType,
      diseaseRisk,
      recommendations: this.getDiseaseRecommendations(diseaseRisk),
      preventiveMeasures: this.getPreventiveMeasures(data.cropType, diseaseRisk),
      confidence: 0.85,
    };
  }

  async forecastYield(data: {
    farmerId: string;
    cropType: string;
    areaInHectares: number;
    historicalYields: number[];
    weatherForecast: any;
    soilQuality: number;
  }) {
    const baseYield = this.calculateBaseYield(data.cropType);
    const historicalTrend = this.calculateTrend(data.historicalYields);
    const weatherImpact = this.calculateWeatherImpact(data.weatherForecast);
    const soilImpact = data.soilQuality * 0.15;

    const forecastedYield =
      baseYield * (1 + historicalTrend) * (1 + weatherImpact) * (1 + soilImpact);

    return {
      forecastedYield: Math.round(forecastedYield * 100) / 100,
      confidence: 0.82,
      factors: {
        baseYield,
        historicalTrend,
        weatherImpact,
        soilImpact,
      },
      recommendations: this.getYieldOptimizationTips(data.cropType),
    };
  }

  async getAdvancedReportingDashboard(farmerId: string) {
    const crops = await this.prisma.product.findMany({
      where: { farmerId },
    });

    const analytics = await Promise.all(
      crops.map(async (crop) => ({
        cropId: crop.id,
        cropType: crop.category,
        totalProduction: crop.quantity,
        averagePrice: crop.price,
        diseaseRisk: Math.random() * 0.3,
        yieldTrend: (Math.random() - 0.5) * 0.2,
        profitMargin: Math.random() * 0.4 + 0.2,
      }))
    );

    return {
      farmerId,
      totalCrops: crops.length,
      totalProduction: crops.reduce((sum, c) => sum + c.quantity, 0),
      averageProfit: analytics.reduce((sum, a) => sum + a.profitMargin, 0) / analytics.length,
      crops: analytics,
      insights: this.generateInsights(analytics),
    };
  }

  private calculateRiskFactors(data: any): number {
    const tempRisk = Math.abs(data.weatherData.temperature - 25) * 0.02;
    const humidityRisk = Math.abs(data.weatherData.humidity - 60) * 0.01;
    const phRisk = Math.abs(data.soilData.ph - 7) * 0.05;

    return tempRisk + humidityRisk + phRisk;
  }

  private predictDiseaseRisk(riskFactors: number): string {
    if (riskFactors < 0.2) return 'LOW';
    if (riskFactors < 0.5) return 'MEDIUM';
    return 'HIGH';
  }

  private getDiseaseRecommendations(risk: string): string[] {
    const recommendations: Record<string, string[]> = {
      LOW: ['Continue regular monitoring', 'Maintain current practices'],
      MEDIUM: ['Increase monitoring frequency', 'Apply preventive fungicides'],
      HIGH: ['Immediate intervention required', 'Consult agricultural expert'],
    };
    return recommendations[risk] || [];
  }

  private getPreventiveMeasures(cropType: string, risk: string): string[] {
    return [
      'Ensure proper drainage',
      'Maintain optimal spacing between plants',
      'Use disease-resistant varieties',
      'Implement crop rotation',
    ];
  }

  private calculateBaseYield(cropType: string): number {
    const baseYields: Record<string, number> = {
      wheat: 50,
      rice: 60,
      corn: 80,
      cotton: 20,
      sugarcane: 70,
    };
    return baseYields[cropType.toLowerCase()] || 50;
  }

  private calculateTrend(historicalYields: number[]): number {
    if (historicalYields.length < 2) return 0;
    const recent = historicalYields.slice(-3);
    const older = historicalYields.slice(0, 3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    return (recentAvg - olderAvg) / olderAvg;
  }

  private calculateWeatherImpact(weatherForecast: any): number {
    return (Math.random() - 0.5) * 0.2;
  }

  private getYieldOptimizationTips(cropType: string): string[] {
    return [
      'Optimize irrigation schedule',
      'Apply balanced fertilizers',
      'Monitor pest populations',
      'Harvest at optimal maturity',
    ];
  }

  private generateInsights(analytics: any[]): string[] {
    return [
      'Crop diversity is good for risk management',
      'Focus on high-margin crops',
      'Monitor disease trends closely',
    ];
  }
}
