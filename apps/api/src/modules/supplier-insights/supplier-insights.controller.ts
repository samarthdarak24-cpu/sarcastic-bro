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

  // ========================================================================
  // NEW METHODS: Task 22.2 - Main Supplier Insights Endpoints
  // ========================================================================

  /**
   * GET /supplier-insights/:farmerId
   * Get comprehensive supplier insights including metrics, patterns, and scorecard
   * Requirement 20: Acceptance Criteria 1, 4, 6
   */
  async getSupplierInsights(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      
      // Calculate all supplier metrics
      const metrics = await supplierInsightsService.calculateSupplierMetrics(farmerId);
      
      // Identify patterns and trends
      const patterns = await supplierInsightsService.identifySupplierPatterns(farmerId);
      
      // Generate comprehensive scorecard
      const scorecard = await supplierInsightsService.generateSupplierScorecard(farmerId);

      const data = {
        farmerId,
        farmerName: metrics.supplierName,
        metrics: metrics.metrics,
        patterns: patterns.patterns,
        scorecard: scorecard.scorecard,
        strengths: scorecard.scorecard.strengths,
        weaknesses: scorecard.scorecard.weaknesses,
        recommendations: scorecard.scorecard.recommendations,
        lastUpdated: new Date()
      };

      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /supplier-insights/compare
   * Compare multiple suppliers side-by-side
   * Requirement 20: Acceptance Criteria 5
   */
  async compareSuppliersGet(req: Request, res: Response) {
    try {
      const supplierIds = req.query.supplierIds as string;
      
      if (!supplierIds) {
        return res.status(400).json({ 
          success: false, 
          error: 'supplierIds query parameter is required (comma-separated)' 
        });
      }

      const idsArray = supplierIds.split(',').map(id => id.trim());
      
      if (idsArray.length < 2) {
        return res.status(400).json({ 
          success: false, 
          error: 'At least 2 supplier IDs are required for comparison' 
        });
      }

      const data = await supplierInsightsService.getSupplierComparison(idsArray);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /supplier-insights/recommendations
   * Get AI-powered supplier recommendations based on buyer requirements
   * Requirement 20: Acceptance Criteria 3
   */
  async getRecommendationsGet(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id;
      
      if (!buyerId) {
        return res.status(401).json({ 
          success: false, 
          error: 'Authentication required' 
        });
      }

      // Parse query parameters as requirements
      const requirements = {
        category: req.query.category as string,
        minPerformance: req.query.minPerformance ? parseFloat(req.query.minPerformance as string) : undefined,
        minQuality: req.query.minQuality ? parseFloat(req.query.minQuality as string) : undefined,
        location: req.query.location as string,
        maxRisk: req.query.maxRisk ? parseFloat(req.query.maxRisk as string) : undefined,
      };

      const data = await supplierInsightsService.getSupplierRecommendations(buyerId, requirements);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /supplier-insights/:farmerId/metrics
   * Get detailed supplier metrics
   * Requirement 20: Acceptance Criteria 1
   */
  async getSupplierMetrics(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      const data = await supplierInsightsService.calculateSupplierMetrics(farmerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /supplier-insights/:farmerId/patterns
   * Get supplier patterns and trends
   * Requirement 20: Acceptance Criteria 4
   */
  async getSupplierPatterns(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      const data = await supplierInsightsService.identifySupplierPatterns(farmerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /supplier-insights/:farmerId/scorecard
   * Get comprehensive supplier scorecard
   * Requirement 20: Acceptance Criteria 6
   */
  async getSupplierScorecard(req: Request, res: Response) {
    try {
      const { farmerId } = req.params;
      const data = await supplierInsightsService.generateSupplierScorecard(farmerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new SupplierInsightsController();
