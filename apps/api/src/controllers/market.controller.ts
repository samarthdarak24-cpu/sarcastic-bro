import { Request, Response, NextFunction } from 'express';
import { MarketService } from '../services/market.service';

export class MarketController {
  /**
   * GET /api/market-prices
   */
  static async getPrices(req: Request, res: Response, next: NextFunction) {
    try {
      const { cropName, district } = req.query;
      const prices = await MarketService.getPrices({
        cropName: cropName as string,
        district: district as string,
      });
      res.json(prices);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/market-prices/trends
   */
  static async getTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const { cropName, district, days } = req.query;
      if (!cropName || !district) {
        return res.status(400).json({ error: 'Crop name and district are required for trends.' });
      }

      const trends = await MarketService.getTrends(
        cropName as string,
        district as string,
        days ? parseInt(days as string) : 30
      );

      const recommendation = await MarketService.getRecommendation(
        cropName as string,
        district as string
      );

      res.json({
        trends,
        recommendation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/market-prices/fetch
   * Trigger manual sync
   */
  static async fetchPrices(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await MarketService.fetchExternalPrices();
      res.status(201).json({
        message: 'Market prices fetched and updated successfully.',
        count: results.length,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/market-prices/crops
   * Helper to get distinct crops for filters
   */
  static async getDistinctCrops(req: Request, res: Response, next: NextFunction) {
    try {
      const prices = await MarketService.getPrices({});
      const distinctCrops = Array.from(new Set(prices.map(p => p.cropName)));
      res.json(distinctCrops);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/market-prices/districts
   * Helper to get distinct districts for filters
   */
  static async getDistinctDistricts(req: Request, res: Response, next: NextFunction) {
    try {
      const prices = await MarketService.getPrices({});
      const distinctDistricts = Array.from(new Set(prices.map(p => p.district)));
      res.json(distinctDistricts);
    } catch (error) {
      next(error);
    }
  }
}
