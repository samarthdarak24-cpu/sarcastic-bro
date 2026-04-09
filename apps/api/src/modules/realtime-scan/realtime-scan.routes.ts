import { Router, Request, Response } from 'express';
import { realtimeScanService } from './realtime-scan.service';
import { authMiddleware } from '../../middleware/auth.middleware';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const router = Router();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Initialize a new real-time scan session
 * POST /api/realtime-scan/session/init
 */
router.post('/session/init', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const sessionId = await realtimeScanService.initializeSession(userId);

    res.json({
      success: true,
      sessionId,
      message: 'Real-time scan session initialized'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Process detection frame
 * POST /api/realtime-scan/frame/process
 */
router.post('/frame/process', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { sessionId, imageBuffer } = req.body;

    if (!sessionId || !imageBuffer) {
      return res.status(400).json({
        success: false,
        error: 'sessionId and imageBuffer are required'
      });
    }

    const detection = await realtimeScanService.processDetectionFrame(sessionId, {
      imageBuffer: Buffer.from(imageBuffer, 'base64'),
      timestamp: Date.now()
    });

    res.json({
      success: true,
      detection
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * End scan session
 * POST /api/realtime-scan/session/end
 */
router.post('/session/end', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required'
      });
    }

    const result = await realtimeScanService.endSession(sessionId);

    res.json({
      success: true,
      result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get session statistics
 * GET /api/realtime-scan/session/:sessionId/stats
 */
router.get('/session/:sessionId/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const stats = await realtimeScanService.getSessionStats(sessionId);

    res.json({
      success: true,
      stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get user scan history
 * GET /api/realtime-scan/history
 */
router.get('/history', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 50;

    const history = await realtimeScanService.getUserScanHistory(userId, limit);

    res.json({
      success: true,
      history
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * AI Quality Shield - Real-time scan with YOLOv8 + EfficientNet simulation
 * POST /api/realtime-scan/quality-shield/scan
 */
router.post('/quality-shield/scan', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { imageBuffer, cropType } = req.body;

    const result = await realtimeScanService.runAIQualityShieldScan(
      userId, 
      imageBuffer ? Buffer.from(imageBuffer, 'base64') : Buffer.alloc(0),
      cropType || 'Tomato'
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Legacy Quality Scan Route (Used by CropQualityDetector)
 * POST /api/realtime-scan/trust/quality-scan
 * Accepts multipart/form-data with 'file' field
 */
router.post('/trust/quality-scan', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { crop_type } = req.query;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    // Try to call Python AI service first
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.path));

      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const response = await axios.post(
        `${aiServiceUrl}/analyze`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 30000 // 30 second timeout for advanced AI
        }
      );

      // Clean up uploaded file
      fs.unlinkSync(file.path);

      return res.json(response.data);
    } catch (aiError: any) {
      console.warn('AI service unavailable, using fallback:', aiError.message);
      
      // Clean up uploaded file
      fs.unlinkSync(file.path);

      // Fallback to Node.js simulation
      const result = await realtimeScanService.runAIQualityShieldScan(
        userId, 
        Buffer.alloc(0),
        (crop_type as string) || 'Tomato'
      );

      return res.json({
        success: true,
        certificate_id: `CERT-${Date.now()}`,
        crop_type: (crop_type as string) || 'Tomato',
        grade: `Grade ${result.overall_grade}`,
        health_score: result.overall_quality_score,
        moisture: 12 + Math.random() * 5,
        confidence: result.detections[0]?.classification_confidence || 0.95,
        blockchain_hash: result.blockchain_hash,
        features: result.detections[0]?.features || {},
        defects: result.detections[0]?.features?.defects || {},
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }
  } catch (error: any) {
    // Clean up file if it exists
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;
