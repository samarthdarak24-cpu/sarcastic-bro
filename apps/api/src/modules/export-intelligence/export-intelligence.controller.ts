/**
 * Export Intelligence Hub Controller
 * Handles all export market analysis requests
 */

import { Request, Response } from 'express';
import { MandiPricesService } from '../../services/mandi-prices.service';
import { GlobalPricesService } from '../../services/global-prices.service';
import { ExportRecommendationService } from '../../services/export-recommendation.service';
import { ProfitCalculatorService } from '../../services/profit-calculator.service';

export class ExportIntelligenceController {
  /**
   * Get current mandi prices for a crop
   */
  static async getMandiPrices(req: Request, res: Response) {
    try {
      const { crop, state } = req.query;

      if (!crop) {
        return res.status(400).json({ message: 'Crop name is required' });
      }

      const mandiData = await MandiPricesService.fetchMandiPrices(
        crop as string,
        state as string | undefined
      );

      return res.status(200).json({
        success: true,
        data: mandiData,
      });
    } catch (error: any) {
      console.error('[getMandiPrices] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get mandi price trends
   */
  static async getMandiTrends(req: Request, res: Response) {
    try {
      const { crop, days = '7' } = req.query;

      if (!crop) {
        return res.status(400).json({ message: 'Crop name is required' });
      }

      const trends = await MandiPricesService.getPriceHistory(
        crop as string,
        parseInt(days as string)
      );

      return res.status(200).json({
        success: true,
        data: trends,
        period: `${days} days`,
      });
    } catch (error: any) {
      console.error('[getMandiTrends] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get trending crops
   */
  static async getTrendingCrops(req: Request, res: Response) {
    try {
      const trendingCrops = await MandiPricesService.getTrendingCrops();

      return res.status(200).json({
        success: true,
        data: trendingCrops,
      });
    } catch (error: any) {
      console.error('[getTrendingCrops] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get global price comparison
   */
  static async getGlobalPrices(req: Request, res: Response) {
    try {
      const { crop } = req.query;

      if (!crop) {
        return res.status(400).json({ message: 'Crop name is required' });
      }

      // Get current mandi price
      const mandiData = await MandiPricesService.fetchMandiPrices(crop as string);
      const mandiPrice = mandiData.prices[0]?.price || 2000;

      const globalPrices = await GlobalPricesService.getGlobalPriceComparison(
        crop as string,
        mandiPrice
      );

      return res.status(200).json({
        success: true,
        data: globalPrices,
        localMandiPrice: mandiPrice,
      });
    } catch (error: any) {
      console.error('[getGlobalPrices] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get forex rates
   */
  static async getForexRates(req: Request, res: Response) {
    try {
      const forexRates = await GlobalPricesService.getForexRates();

      return res.status(200).json({
        success: true,
        data: forexRates,
        timestamp: new Date(),
      });
    } catch (error: any) {
      console.error('[getForexRates] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get seasonal trends
   */
  static async getSeasonalTrends(req: Request, res: Response) {
    try {
      const { crop } = req.query;

      if (!crop) {
        return res.status(400).json({ message: 'Crop name is required' });
      }

      const trends = await GlobalPricesService.getSeasonalTrends(crop as string);

      return res.status(200).json({
        success: true,
        data: trends,
        crop,
      });
    } catch (error: any) {
      console.error('[getSeasonalTrends] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get demand heatmap
   */
  static async getDemandHeatmap(req: Request, res: Response) {
    try {
      const heatmap = await GlobalPricesService.getDemandHeatmap();

      return res.status(200).json({
        success: true,
        data: heatmap,
      });
    } catch (error: any) {
      console.error('[getDemandHeatmap] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Calculate profit comparison
   */
  static async calculateProfit(req: Request, res: Response) {
    try {
      const { crop, quantity, destination, state } = req.query;

      if (!crop || !quantity) {
        return res
          .status(400)
          .json({ message: 'Crop name and quantity are required' });
      }

      const profitData = await ProfitCalculatorService.calculateProfit(
        crop as string,
        parseInt(quantity as string),
        destination as string | undefined,
        state as string | undefined
      );

      return res.status(200).json({
        success: true,
        data: profitData,
      });
    } catch (error: any) {
      console.error('[calculateProfit] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get profit sensitivity analysis
   */
  static async getProfitSensitivity(req: Request, res: Response) {
    try {
      const { crop, quantity, destination, minPrice, maxPrice } = req.query;

      if (!crop || !quantity || !destination || !minPrice || !maxPrice) {
        return res.status(400).json({
          message:
            'Crop, quantity, destination, minPrice, and maxPrice are required',
        });
      }

      const sensitivity = await ProfitCalculatorService.getSensitivityAnalysis(
        crop as string,
        parseInt(quantity as string),
        destination as string,
        {
          min: parseInt(minPrice as string),
          max: parseInt(maxPrice as string),
        }
      );

      return res.status(200).json({
        success: true,
        data: sensitivity,
      });
    } catch (error: any) {
      console.error('[getProfitSensitivity] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get AI export recommendations
   */
  static async getRecommendations(req: Request, res: Response) {
    try {
      const { crops, location } = req.body;

      if (!crops || !location) {
        return res
          .status(400)
          .json({ message: 'Crops array and location are required' });
      }

      const recommendations =
        await ExportRecommendationService.getBatchRecommendations(crops, location);

      return res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error: any) {
      console.error('[getRecommendations] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get export alerts
   */
  static async getExportAlerts(req: Request, res: Response) {
    try {
      const { crop, location } = req.query;

      if (!crop || !location) {
        return res
          .status(400)
          .json({ message: 'Crop and location are required' });
      }

      const alerts = await ExportRecommendationService.getExportAlerts(
        crop as string,
        location as string
      );

      return res.status(200).json({
        success: true,
        data: alerts,
      });
    } catch (error: any) {
      console.error('[getExportAlerts] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get optimal export quantity
   */
  static async getOptimalQuantity(req: Request, res: Response) {
    try {
      const { crop, available, budget, destination } = req.query;

      if (!crop || !available || !budget || !destination) {
        return res.status(400).json({
          message:
            'Crop, available quantity, budget, and destination are required',
        });
      }

      const optimal =
        await ProfitCalculatorService.getOptimalExportQuantity(
          crop as string,
          parseInt(available as string),
          parseInt(budget as string),
          destination as string
        );

      return res.status(200).json({
        success: true,
        data: optimal,
      });
    } catch (error: any) {
      console.error('[getOptimalQuantity] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get multi-country comparison
   */
  static async getMultiCountryComparison(req: Request, res: Response) {
    try {
      const { crop, quantity, countries } = req.query;

      if (!crop || !quantity || !countries) {
        return res.status(400).json({
          message: 'Crop, quantity, and countries are required',
        });
      }

      const comparison = await ProfitCalculatorService.multicountryComparison(
        crop as string,
        parseInt(quantity as string),
        (countries as string).split(',')
      );

      return res.status(200).json({
        success: true,
        data: comparison,
      });
    } catch (error: any) {
      console.error('[getMultiCountryComparison] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get detailed recommendation
   */
  static async getRecommendationDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // This would fetch from database in production
      // For now, returning informational message
      return res.status(200).json({
        success: true,
        message: 'Recommendation detail endpoint',
        recommendationId: id,
        // In production, fetch detailed data with historical info
      });
    } catch (error: any) {
      console.error('[getRecommendationDetail] Error:', error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
