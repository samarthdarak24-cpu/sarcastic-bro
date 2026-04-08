import { Request, Response } from 'express';
import { insightsService } from './insights.service';

export class InsightsController {
  async getAllInsights(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const insights = await insightsService.getAllInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error('Get all insights error:', error);
      res.status(500).json({ error: 'Failed to fetch insights' });
    }
  }

  async getSoilHealth(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { fieldId } = req.query;
      const data = await insightsService.getSoilHealth(userId, fieldId as string);
      res.json(data);
    } catch (error) {
      console.error('Get soil health error:', error);
      res.status(500).json({ error: 'Failed to fetch soil health data' });
    }
  }

  async getCropPerformance(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await insightsService.getCropPerformance(userId);
      res.json(data);
    } catch (error) {
      console.error('Get crop performance error:', error);
      res.status(500).json({ error: 'Failed to fetch crop performance data' });
    }
  }

  async getFinancialAnalytics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { startDate, endDate } = req.query;
      const data = await insightsService.getFinancialAnalytics(
        userId,
        startDate as string,
        endDate as string
      );
      res.json(data);
    } catch (error) {
      console.error('Get financial analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch financial analytics' });
    }
  }

  async getResourceOptimization(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await insightsService.getResourceOptimization(userId);
      res.json(data);
    } catch (error) {
      console.error('Get resource optimization error:', error);
      res.status(500).json({ error: 'Failed to fetch resource data' });
    }
  }

  async getBenchmarking(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { region } = req.query;
      const data = await insightsService.getBenchmarking(userId, region as string);
      res.json(data);
    } catch (error) {
      console.error('Get benchmarking error:', error);
      res.status(500).json({ error: 'Failed to fetch benchmarking data' });
    }
  }

  async getPredictiveMaintenance(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await insightsService.getPredictiveMaintenance(userId);
      res.json(data);
    } catch (error) {
      console.error('Get predictive maintenance error:', error);
      res.status(500).json({ error: 'Failed to fetch maintenance data' });
    }
  }

  async updateSoilData(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const soilData = req.body;
      const result = await insightsService.updateSoilData(userId, soilData);
      res.json(result);
    } catch (error) {
      console.error('Update soil data error:', error);
      res.status(500).json({ error: 'Failed to update soil data' });
    }
  }

  async recordExpense(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const expense = req.body;
      const result = await insightsService.recordExpense(userId, expense);
      res.json(result);
    } catch (error) {
      console.error('Record expense error:', error);
      res.status(500).json({ error: 'Failed to record expense' });
    }
  }

  async addEquipment(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const equipment = req.body;
      const result = await insightsService.addEquipment(userId, equipment);
      res.json(result);
    } catch (error) {
      console.error('Add equipment error:', error);
      res.status(500).json({ error: 'Failed to add equipment' });
    }
  }

  async updateEquipmentStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { equipmentId } = req.params;
      const status = req.body;
      const result = await insightsService.updateEquipmentStatus(userId, equipmentId, status);
      res.json(result);
    } catch (error) {
      console.error('Update equipment status error:', error);
      res.status(500).json({ error: 'Failed to update equipment status' });
    }
  }

  // Price Intelligence endpoints
  async getPriceTrends(req: Request, res: Response) {
    try {
      const { category, district, state, days } = req.query;
      
      if (!category) {
        return res.status(400).json({ error: 'Category is required' });
      }

      const data = await insightsService.getPriceTrends(
        category as string,
        district as string,
        state as string,
        days ? parseInt(days as string) : 30
      );
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Get price trends error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch price trends' 
      });
    }
  }

  async getPriceForecast(req: Request, res: Response) {
    try {
      const { category, district, state, quantity, qualityGrade } = req.query;
      
      if (!category || !district || !state || !quantity) {
        return res.status(400).json({ 
          error: 'Category, district, state, and quantity are required' 
        });
      }

      const data = await insightsService.getPriceForecast(
        category as string,
        district as string,
        state as string,
        parseFloat(quantity as string),
        qualityGrade as string
      );
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Get price forecast error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch price forecast' 
      });
    }
  }

  async createPriceAlert(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { category, targetPrice, condition, district, state } = req.body;
      
      if (!category || !targetPrice || !condition) {
        return res.status(400).json({ 
          error: 'Category, targetPrice, and condition are required' 
        });
      }

      if (!['ABOVE', 'BELOW'].includes(condition)) {
        return res.status(400).json({ 
          error: 'Condition must be either ABOVE or BELOW' 
        });
      }

      const result = await insightsService.createPriceAlert(
        userId,
        category,
        targetPrice,
        condition,
        district,
        state
      );
      
      res.json(result);
    } catch (error) {
      console.error('Create price alert error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to create price alert' 
      });
    }
  }

  async getPriceAlerts(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const alerts = await insightsService.getPriceAlerts(userId);
      
      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      console.error('Get price alerts error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch price alerts' 
      });
    }
  }

  async deletePriceAlert(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { alertId } = req.params;
      
      const result = await insightsService.deletePriceAlert(userId, alertId);
      
      res.json(result);
    } catch (error) {
      console.error('Delete price alert error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to delete price alert' 
      });
    }
  }
}

export const insightsController = new InsightsController();
