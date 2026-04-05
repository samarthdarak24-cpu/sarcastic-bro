import { Request, Response } from 'express';
import cropAdvisorService from './crop-advisor.service';
import { socketService } from '../../services/socketService';

export class CropAdvisorController {
  async getCropRecommendations(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const farmData = req.body;

      const recommendations = await cropAdvisorService.getCropRecommendations(userId, farmData);
      
      socketService.emitToUser(userId, 'crop:recommendations', recommendations);
      
      res.json({
        success: true,
        data: recommendations
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async trackGrowthStage(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { cropId } = req.params;

      const growthData = await cropAdvisorService.trackGrowthStage(userId, cropId);
      
      socketService.emitToUser(userId, 'crop:growth-update', growthData);
      
      res.json({
        success: true,
        data: growthData
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async analyzeDiseaseRisk(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { image } = req.body;

      const analysis = await cropAdvisorService.analyzeDiseaseRisk(userId, image);
      
      if (analysis.diseaseDetected) {
        socketService.emitToUser(userId, 'crop:disease-alert', analysis);
      }
      
      res.json({
        success: true,
        data: analysis
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getIrrigationPlan(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { cropId } = req.params;

      const plan = await cropAdvisorService.getIrrigationPlan(userId, cropId);
      
      res.json({
        success: true,
        data: plan
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async calculateFertilizer(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { cropId } = req.params;
      const soilData = req.body;

      const calculation = await cropAdvisorService.calculateFertilizer(userId, cropId, soilData);
      
      res.json({
        success: true,
        data: calculation
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async predictHarvest(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { cropId } = req.params;

      const prediction = await cropAdvisorService.predictHarvest(userId, cropId);
      
      res.json({
        success: true,
        data: prediction
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async generateRotationPlan(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const farmData = req.body;

      const plan = await cropAdvisorService.generateRotationPlan(userId, farmData);
      
      res.json({
        success: true,
        data: plan
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getMarketAdvice(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { cropType } = req.params;

      const advice = await cropAdvisorService.getMarketAdvice(userId, cropType);
      
      socketService.emitToUser(userId, 'crop:market-update', advice);
      
      res.json({
        success: true,
        data: advice
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async analyzeWeatherImpact(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { cropId } = req.params;

      const impact = await cropAdvisorService.analyzeWeatherImpact(userId, cropId);
      
      if (impact.riskLevel === 'HIGH') {
        socketService.emitToUser(userId, 'crop:weather-alert', impact);
      }
      
      res.json({
        success: true,
        data: impact
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getCropHealthScore(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { cropId } = req.params;

      const healthScore = await cropAdvisorService.getCropHealthScore(userId, cropId);
      
      res.json({
        success: true,
        data: healthScore
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new CropAdvisorController();
