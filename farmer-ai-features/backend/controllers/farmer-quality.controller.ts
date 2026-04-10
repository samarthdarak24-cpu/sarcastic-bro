import { Router, Response } from 'express';
import { FarmerQualityService } from '../services/farmer-quality.service';
import { authenticateToken, requireFarmer, AuthRequest } from '../../../middleware/auth.middleware';

const router = Router();
const qualityService = new FarmerQualityService();

/**
 * POST /api/farmers/quality/analyze
 * Analyze crop quality from uploaded image
 * 
 * Request Body:
 * {
 *   imageUrl: string (base64 or URL)
 * }
 * 
 * Response:
 * {
 *   grade: string (A+, A, B+, B, C)
 *   score: number (0-100)
 *   defects: number
 *   freshness: number (0-100)
 *   color: number (0-100)
 *   size: number (0-100)
 *   recommendations: string[]
 * }
 */
router.post('/quality/analyze', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const analysis = await qualityService.analyzeQuality(imageUrl);
    res.json(analysis);
  } catch (error: any) {
    console.error('Quality analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze quality',
      message: error.message 
    });
  }
});

/**
 * POST /api/farmers/quality/save
 * Save quality scan results to database
 * 
 * Request Body:
 * {
 *   cropId: string
 *   imageUrl: string
 *   grade: string
 *   score: number
 *   defects: number
 *   freshness: number
 *   color: number
 *   size: number
 * }
 */
router.post('/quality/save', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const scanData = req.body;
    
    const savedScan = await qualityService.saveQualityScan(farmerId, scanData);
    res.status(201).json(savedScan);
  } catch (error: any) {
    console.error('Save quality scan error:', error);
    res.status(500).json({ 
      error: 'Failed to save quality scan',
      message: error.message 
    });
  }
});

/**
 * GET /api/farmers/quality/history
 * Get farmer's quality scan history
 */
router.get('/quality/history', authenticateToken, requireFarmer, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const history = await qualityService.getQualityScanHistory(farmerId, page, limit);
    res.json(history);
  } catch (error: any) {
    console.error('Get quality history error:', error);
    res.status(500).json({ 
      error: 'Failed to get quality history',
      message: error.message 
    });
  }
});

export default router;
