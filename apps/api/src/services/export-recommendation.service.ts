/**
 * Export Recommendation Engine
 * AI-powered recommendation logic for farmers on best export markets
 */

import { MandiPricesService } from "./mandi-prices.service";
import { GlobalPricesService } from "./global-prices.service";

interface ExportRecommendation {
  crop: string;
  quantity: number;
  location: string;
  recommendedCountry: string;
  profitPercentage: number;
  estimatedRevenue: number;
  riskLevel: 'low' | 'medium' | 'high';
  deliveryDays: number;
  demandLevel: 'high' | 'medium' | 'low';
  confidence: number;
  insights: string[];
  timing: string;
  alternativeCountries: Array<{
    country: string;
    profitPercentage: number;
    riskLevel: string;
  }>;
}

export class ExportRecommendationService {
  /**
   * Get AI-powered export recommendation
   */
  static async getRecommendation(
    crop: string,
    quantity: number,
    farmLocation: string
  ): Promise<ExportRecommendation> {
    try {
      // Get mandi price
      const mandiData = await MandiPricesService.fetchMandiPrices(crop);
      const currentMandiPrice = mandiData.prices[0]?.price || 2000;

      // Get global prices
      const globalPrices = await GlobalPricesService.getGlobalPriceComparison(
        crop,
        currentMandiPrice
      );

      // Get seasonal trends
      const seasonalTrends = await GlobalPricesService.getSeasonalTrends(crop);

      // Calculate current season factor
      const currentMonth = new Date().getMonth() + 1;
      const currentSeasonData = seasonalTrends.find(s => {
        const monthMap: Record<string, number> = {
          'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
          'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
        };
        return monthMap[s.month] === currentMonth;
      });

      // Score each country
      const countryScores = globalPrices.globalMarkets.map(market => ({
        country: market.country,
        profit: market.finalPrice - currentMandiPrice,
        profitPercentage: Math.round(
          ((market.finalPrice - currentMandiPrice) / currentMandiPrice) * 100
        ),
        demand: market.demand,
        demandScore: market.demand === 'high' ? 3 : market.demand === 'medium' ? 2 : 1,
        logistics: market.logistics,
        riskScore: this.calculateRiskScore(market.country, crop),
      }));

      // Apply seasonal adjustment
      const adjustedScores = countryScores.map(score => ({
        ...score,
        adjustedProfit: score.profit * (currentSeasonData?.demand === 'high' ? 1.2 : 1),
      }));

      // Find best option
      const bestOption = adjustedScores.reduce((best, current) => 
        current.adjustedProfit > best.adjustedProfit ? current : best
      );

      // Get top alternatives
      const alternatives = adjustedScores
        .filter(s => s.country !== bestOption.country)
        .sort((a, b) => b.adjustedProfit - a.adjustedProfit)
        .slice(0, 2);

      // Generate insights
      const insights = this.generateInsights(
        crop,
        bestOption,
        currentSeasonData,
        farmLocation
      );

      const recommendation: ExportRecommendation = {
        crop,
        quantity,
        location: farmLocation,
        recommendedCountry: bestOption.country,
        profitPercentage: bestOption.profitPercentage,
        estimatedRevenue: Math.round((currentMandiPrice * quantity) * (1 + bestOption.profitPercentage / 100)),
        riskLevel: this.getRiskLevel(bestOption.riskScore),
        deliveryDays: this.getDeliveryDays(bestOption.country),
        demandLevel: bestOption.demand as 'high' | 'medium' | 'low',
        confidence: Math.round(bestOption.demandScore * (1 - bestOption.riskScore) * 100),
        insights,
        timing: this.getOptimalTiming(crop, currentSeasonData),
        alternativeCountries: alternatives.map(alt => ({
          country: alt.country,
          profitPercentage: alt.profitPercentage,
          riskLevel: this.getRiskLevel(alt.riskScore),
        })),
      };

      return recommendation;
    } catch (error: any) {
      console.error('[ExportRecommendation] Error:', error.message);
      throw error;
    }
  }

  /**
   * Calculate risk score for a country-crop pair
   * Lower score = lower risk
   */
  private static calculateRiskScore(country: string, crop: string): number {
    // Base risk by country
    const countryRiskMap: Record<string, number> = {
      'UAE': 0.2,      // Low risk - stable, nearby
      'Germany': 0.3,  // Low-medium risk
      'Netherlands': 0.3,
      'USA': 0.4,      // Medium risk
      'UK': 0.35,
      'China': 0.5,    // Medium-high risk
      'Russia': 0.6,   // High risk - supply chain issues
      'Turkey': 0.35,
      'Vietnam': 0.4,
    };

    let riskScore = countryRiskMap[country] || 0.5;

    // Adjust based on crop volatility
    const cropVolatility: Record<string, number> = {
      'Tomato': 0.3,   // High volatility
      'Onion': 0.2,    // Lower volatility
      'Potato': 0.15,  // Very stable
      'Wheat': 0.2,
      'Rice': 0.25,
      'Cotton': 0.25,
    };

    riskScore += cropVolatility[crop] || 0.2;
    return Math.min(1, riskScore); // Cap at 1
  }

  /**
   * Convert risk score to level
   */
  private static getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score < 0.4) return 'low';
    if (score < 0.6) return 'medium';
    return 'high';
  }

  /**
   * Get estimated delivery days for country
   */
  private static getDeliveryDays(country: string): number {
    const deliveryMap: Record<string, number> = {
      'UAE': 3,
      'Germany': 15,
      'Netherlands': 14,
      'UK': 16,
      'USA': 20,
      'Turkey': 10,
      'China': 18,
      'Russia': 12,
      'Vietnam': 8,
    };
    return deliveryMap[country] || 15;
  }

  /**
   * Generate actionable insights
   */
  private static generateInsights(
    crop: string,
    bestOption: any,
    seasonalData: any,
    location: string
  ): string[] {
    const insights: string[] = [];

    // Profit insight
    if (bestOption.profitPercentage > 30) {
      insights.push(
        `🎯 Excellent opportunity! ${bestOption.country} offers ${bestOption.profitPercentage}% profit margin`
      );
    } else if (bestOption.profitPercentage > 15) {
      insights.push(
        `✅ Good profit opportunity. ${bestOption.country} gives ${bestOption.profitPercentage}% profit`
      );
    }

    // Seasonal insight
    if (seasonalData?.demand === 'high') {
      insights.push('📈 High demand season right now - better to sell soon');
    } else if (seasonalData?.demand === 'low') {
      insights.push('📉 Low demand season - consider storing for better timing');
    }

    // Logistics insight
    if (bestOption.logistics < 400) {
      insights.push(`🚚 Low logistics cost (₹${bestOption.logistics}/quintal) - favorable`);
    } else if (bestOption.logistics > 900) {
      insights.push(`⚠️ High logistics cost (₹${bestOption.logistics}/quintal) - affects profit`);
    }

    // Add crop-specific insights
    if (crop === 'Tomato' || crop === 'Onion') {
      insights.push(`🌶️ ${crop} has high market demand in EU countries`);
    }
    
    if (crop === 'Cotton') {
      insights.push('🌾 Cotton export to China and USA is highly profitable');
    }

    // Regional advantage
    if (location && (location.includes('Maharashtra') || location.includes('Karnataka'))) {
      insights.push('📍 Your location is ideal for export - good port access');
    }

    return insights;
  }

  /**
   * Get optimal timing for export
   */
  private static getOptimalTiming(crop: string, seasonalData: any): string {
    if (seasonalData?.demand === 'high') {
      return 'Ship immediately - market conditions are optimal';
    } else if (seasonalData?.demand === 'medium') {
      return 'Good timing - favorable market conditions';
    } else {
      return 'Wait 2-3 weeks for better demand season';
    }
  }

  /**
   * Batch recommendations for multiple crops
   */
  static async getBatchRecommendations(
    crops: Array<{ name: string; quantity: number }>,
    location: string
  ): Promise<ExportRecommendation[]> {
    try {
      const recommendations = await Promise.all(
        crops.map(crop =>
          this.getRecommendation(crop.name, crop.quantity, location)
        )
      );

      return recommendations.sort((a, b) => b.profitPercentage - a.profitPercentage);
    } catch (error: any) {
      console.error('[Batch Recommendations] Error:', error.message);
      throw error;
    }
  }

  /**
   * Get real-time alerts for export opportunities
   */
  static async getExportAlerts(crop: string, farmLocation: string): Promise<any[]> {
    try {
      const mandiData = await MandiPricesService.fetchMandiPrices(crop);
      const currentPrice = mandiData.prices[0]?.price || 2000;
      const priceChange = mandiData.prices[0]?.priceChange || 0;

      const alerts = [];

      // Price spike alert
      if (priceChange > 200) {
        alerts.push({
          type: 'PRICE_SPIKE',
          severity: 'high',
          message: `${crop} price increased by ₹${priceChange}! Sell now for maximum profit`,
          action: 'Export now',
          timestamp: new Date(),
        });
      }

      // Demand alert
      const globalPrices = await GlobalPricesService.getGlobalPriceComparison(crop, currentPrice);
      const highDemandCountries = globalPrices.globalMarkets.filter(m => m.demand === 'high');
      
      if (highDemandCountries.length > 0) {
        alerts.push({
          type: 'HIGH_DEMAND',
          severity: 'medium',
          message: `High demand detected in ${highDemandCountries[0].country} for ${crop}`,
          action: 'Check export rates',
          timestamp: new Date(),
        });
      }

      return alerts;
    } catch (error: any) {
      console.error('[Export Alerts] Error:', error.message);
      throw error;
    }
  }
}
