import { Request, Response } from 'express';
import { ProductHubService } from './product-hub.service';

export class ProductHubController {
  private productHubService: ProductHubService;

  constructor() {
    this.productHubService = new ProductHubService();
  }

  async optimizeProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const userId = (req as any).user.id;
      
      const result = await this.productHubService.optimizeProduct(productId, userId);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPricingRecommendations(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const recommendations = await this.productHubService.getPricingRecommendations(userId);
      
      res.json({
        success: true,
        data: recommendations
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async analyzeQuality(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const userId = (req as any).user.id;
      
      const analysis = await this.productHubService.analyzeQuality(productId, userId);
      
      res.json({
        success: true,
        data: analysis
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getInventoryForecast(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const forecast = await this.productHubService.getInventoryForecast(userId);
      
      res.json({
        success: true,
        data: forecast
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async syncChannel(req: Request, res: Response) {
    try {
      const { channelId } = req.params;
      const userId = (req as any).user.id;
      
      const result = await this.productHubService.syncChannel(channelId, userId);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getBundleSuggestions(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const bundles = await this.productHubService.getBundleSuggestions(userId);
      
      res.json({
        success: true,
        data: bundles
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createBundle(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const bundleData = req.body;
      
      const bundle = await this.productHubService.createBundle(bundleData, userId);
      
      res.json({
        success: true,
        data: bundle
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPerformanceMetrics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const metrics = await this.productHubService.getPerformanceMetrics(userId);
      
      res.json({
        success: true,
        data: metrics
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCompetitorAnalysis(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const userId = (req as any).user.id;
      
      const analysis = await this.productHubService.getCompetitorAnalysis(productId, userId);
      
      res.json({
        success: true,
        data: analysis
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSeasonalTrends(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      
      const trends = await this.productHubService.getSeasonalTrends(productId);
      
      res.json({
        success: true,
        data: trends
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async generateListing(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const userId = (req as any).user.id;
      
      const listing = await this.productHubService.generateListing(productId, userId);
      
      res.json({
        success: true,
        data: listing
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async applyListing(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const listingData = req.body;
      const userId = (req as any).user.id;
      
      const result = await this.productHubService.applyListing(productId, listingData, userId);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
