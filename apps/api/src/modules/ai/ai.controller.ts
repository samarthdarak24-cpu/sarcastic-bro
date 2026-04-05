import { Request, Response, NextFunction } from "express";
import { AIService } from "./ai.service";
import { getSocketService } from "../../services/socketService";

/**
 * Controller to handle AI-related requests.
 */
export class AIController {
  /**
   * Analyze quality of a product image.
   */
  static async analyzeQuality(req: Request, res: Response, Next: NextFunction) {
    try {
      const file = req.file;
      const { product_type, product_name } = req.body;
      
      const result = await AIService.analyzeQuality({
        image_path: file?.path,
        image_url: file ? `/uploads/images/${file.filename}` : req.body.image_url,
        product_type: product_type as string,
        product_name: product_name as string
      });
      
      // Emit real-time quality scan result
      try {
        const socketService = getSocketService();
        const userId = (req as any).user?.id;
        if (userId) {
          socketService.emitQualityScanResult(userId, {
            productName: product_name,
            grade: result.grade,
            score: result.score,
            defects: result.defects,
            timestamp: new Date()
          });
        }
      } catch (err) {
        console.error('Socket emission failed:', err);
      }
      
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      Next(error);
    }
  }

  /**
   * Get buyer recommendations.
   */
  static async getBuyerRecommendations(
    req: Request,
    res: Response,
    Next: NextFunction,
  ) {
    try {
      const result = await AIService.getBuyerRecommendations(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      Next(error);
    }
  }

  /**
   * Get supplier recommendations.
   */
  static async getSupplierRecommendations(
    req: Request,
    res: Response,
    Next: NextFunction,
  ) {
    try {
      const result = await AIService.getSupplierRecommendations(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      Next(error);
    }
  }

  /**
   * Get demand forecast.
   */
  static async getDemandForecast(
    req: Request,
    res: Response,
    Next: NextFunction,
  ) {
    try {
      const result = await AIService.getDemandForecast(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      Next(error);
    }
  }

  /**
   * Detect pests in a crop image.
   */
  static async detectPests(req: Request, res: Response, Next: NextFunction) {
    try {
      const result = await AIService.detectPests(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      Next(error);
    }
  }

  /**
   * Get smart crop recommendations.
   */
  static async getCropRecommendations(req: Request, res: Response, Next: NextFunction) {
    try {
      const { soilType, previousCrops, season } = req.query;
      
      const prevCropsArray = typeof previousCrops === 'string' 
        ? previousCrops.split(',') 
        : (Array.isArray(previousCrops) ? (previousCrops as string[]) : []);

      const result = await AIService.getCropRecommendations(
        soilType as string, 
        prevCropsArray, 
        season as string
      );
      
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      Next(error);
    }
  }

  /**
   * Get procurement assistant recommendations.
   */
  static async getProcurementRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const { productName, quantity, buyerLat, buyerLng } = req.body;
      const result = await AIService.getProcurementRecommendations({
        productName,
        quantity: parseFloat(quantity),
        buyerLat: buyerLat ? parseFloat(buyerLat) : undefined,
        buyerLng: buyerLng ? parseFloat(buyerLng) : undefined
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get dynamic price advice.
   */
  static async getPriceAdvice(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.getPriceAdvice(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get unified agri insights (Intent Router).
   */
  static async getUnifiedInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.getUnifiedInsights(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
