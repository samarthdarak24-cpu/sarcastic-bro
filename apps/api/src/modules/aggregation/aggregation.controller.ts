import { Request, Response } from 'express';
import { aggregationService } from './aggregation.service';

export class AggregationController {
  // Find nearby farmers
  async findNearbyFarmers(req: Request, res: Response) {
    try {
      const { farmerId, crop, maxDistance } = req.query;

      if (!farmerId || !crop) {
        return res.status(400).json({
          success: false,
          message: 'farmerId and crop are required',
        });
      }

      const nearbyFarmers = await aggregationService.findNearbyFarmers(
        farmerId as string,
        crop as string,
        maxDistance ? parseInt(maxDistance as string) : 50
      );

      res.json({
        success: true,
        data: nearbyFarmers,
        count: nearbyFarmers.length,
      });
    } catch (error: any) {
      console.error('Error finding nearby farmers:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to find nearby farmers',
      });
    }
  }

  // Auto-cluster farmers
  async autoCluster(req: Request, res: Response) {
    try {
      const { crop, region, minQuantity, maxQuantity } = req.query;

      if (!crop || !region) {
        return res.status(400).json({
          success: false,
          message: 'crop and region are required',
        });
      }

      const clusters = await aggregationService.autoCluster(
        crop as string,
        region as string,
        minQuantity ? parseInt(minQuantity as string) : 400,
        maxQuantity ? parseInt(maxQuantity as string) : 1000
      );

      res.json({
        success: true,
        data: clusters,
        count: clusters.length,
      });
    } catch (error: any) {
      console.error('Error auto-clustering:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to auto-cluster',
      });
    }
  }

  // Get farmer's contributions
  async getMyContributions(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;

      if (!farmerId) {
        return res.status(400).json({
          success: false,
          message: 'farmerId is required',
        });
      }

      const contributions = await aggregationService.getMyContributions(farmerId);

      res.json({
        success: true,
        data: contributions,
        count: contributions.length,
      });
    } catch (error: any) {
      console.error('Error getting contributions:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get contributions',
      });
    }
  }

  // Join bulk lot
  async joinBulkLot(req: Request, res: Response) {
    try {
      const { farmerId, lotId, productId } = req.body;

      if (!farmerId || !lotId || !productId) {
        return res.status(400).json({
          success: false,
          message: 'farmerId, lotId, and productId are required',
        });
      }

      const result = await aggregationService.joinBulkLot(farmerId, lotId, productId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Error joining bulk lot:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to join bulk lot',
      });
    }
  }

  // Get available lots for buyers
  async getAvailableLots(req: Request, res: Response) {
    try {
      const { crop, minQuality, maxPrice, region, verifiedOnly } = req.query;

      const filters: any = {};
      if (crop) filters.crop = crop as string;
      if (minQuality) filters.minQuality = parseInt(minQuality as string);
      if (maxPrice) filters.maxPrice = parseInt(maxPrice as string);
      if (region) filters.region = region as string;
      if (verifiedOnly) filters.verifiedOnly = verifiedOnly === 'true';

      const lots = await aggregationService.getAvailableLots(filters);

      res.json({
        success: true,
        data: lots,
        count: lots.length,
      });
    } catch (error: any) {
      console.error('Error getting available lots:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get available lots',
      });
    }
  }

  // Calculate potential earnings
  async calculateEarnings(req: Request, res: Response) {
    try {
      const { quantity, crop, currentPrice } = req.query;

      if (!quantity || !crop || !currentPrice) {
        return res.status(400).json({
          success: false,
          message: 'quantity, crop, and currentPrice are required',
        });
      }

      const earnings = await aggregationService.calculatePotentialEarnings(
        parseInt(quantity as string),
        crop as string,
        parseFloat(currentPrice as string)
      );

      res.json({
        success: true,
        data: earnings,
      });
    } catch (error: any) {
      console.error('Error calculating earnings:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to calculate earnings',
      });
    }
  }
}

export const aggregationController = new AggregationController();
