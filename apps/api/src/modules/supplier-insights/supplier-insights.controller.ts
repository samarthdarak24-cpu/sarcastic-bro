import { Request, Response } from 'express';
import { supplierInsightsService } from './supplier-insights.service';

export class SupplierInsightsController {
  async getPerformanceAnalytics(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const data = await supplierInsightsService.getSupplierPerformanceAnalytics(supplierId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getQualityTracker(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const data = await supplierInsightsService.getQualityConsistencyTracker(supplierId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getDeliveryReliability(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const data = await supplierInsightsService.getDeliveryReliabilityScore(supplierId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPriceCompetitiveness(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const data = await supplierInsightsService.getPriceCompetitivenessAnalysis(supplierId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getRiskAssessment(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const data = await supplierInsightsService.getSupplierRiskAssessment(supplierId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getCommunicationMetrics(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const data = await supplierInsightsService.getCommunicationResponseTime(supplierId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getAvailabilityForecast(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const data = await supplierInsightsService.getProductAvailabilityForecast(supplierId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async compareSuppliers(req: Request, res: Response) {
    try {
      const { supplierIds } = req.body;
      if (!Array.isArray(supplierIds)) {
        return res.status(400).json({ success: false, error: 'supplierIds must be an array' });
      }
      const data = await supplierInsightsService.getSupplierComparison(supplierIds);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getTrustVerification(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const data = await supplierInsightsService.getTrustVerificationStatus(supplierId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getRecommendations(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id;
      const requirements = req.body;
      const data = await supplierInsightsService.getSupplierRecommendations(buyerId, requirements);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new SupplierInsightsController();
