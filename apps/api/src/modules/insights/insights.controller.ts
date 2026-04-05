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
}

export const insightsController = new InsightsController();
