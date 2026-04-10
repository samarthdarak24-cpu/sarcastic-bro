import { Response } from 'express';
import { QualityService } from './quality.service';
import { sendSuccess, sendError } from '../../utils/response';

const qualityService = new QualityService();

export class QualityController {
  static async analyzeQuality(req: any, res: Response) {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return sendError(res, 'Image URL is required', 400);
      }

      console.log('Analyzing quality for image...');
      const analysis = await qualityService.analyzeQuality(imageUrl);
      console.log('Analysis result:', analysis);
      
      return sendSuccess(res, analysis, 'Quality analysis completed');
    } catch (error: any) {
      console.error('Quality analysis error:', error);
      console.error('Error stack:', error.stack);
      return sendError(res, error.message || 'Failed to analyze quality', 500);
    }
  }

  static async saveQualityScan(req: any, res: Response) {
    try {
      const farmerId = req.user?.userId;
      if (!farmerId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const scanData = req.body;
      
      if (!scanData.imageUrl || !scanData.grade || !scanData.score) {
        return sendError(res, 'Missing required fields', 400);
      }

      const savedScan = await qualityService.saveQualityScan(farmerId, scanData);
      return sendSuccess(res, savedScan, 'Quality scan saved successfully', 201);
    } catch (error: any) {
      console.error('Save quality scan error:', error);
      return sendError(res, 'Failed to save quality scan', 500);
    }
  }

  static async getQualityScanHistory(req: any, res: Response) {
    try {
      const farmerId = req.user?.userId;
      if (!farmerId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const history = await qualityService.getQualityScanHistory(farmerId, page, limit);
      return sendSuccess(res, history, 'Quality scan history retrieved');
    } catch (error: any) {
      console.error('Get quality history error:', error);
      return sendError(res, 'Failed to get quality history', 500);
    }
  }

  static async getQualityStats(req: any, res: Response) {
    try {
      const farmerId = req.user?.userId;
      if (!farmerId) {
        return sendError(res, 'Unauthorized', 401);
      }

      const stats = await qualityService.getQualityStats(farmerId);
      return sendSuccess(res, stats, 'Quality statistics retrieved');
    } catch (error: any) {
      console.error('Get quality stats error:', error);
      return sendError(res, 'Failed to get quality statistics', 500);
    }
  }
}
