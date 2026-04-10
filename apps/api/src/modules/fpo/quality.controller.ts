import { Router, Response } from 'express';
import { QualityService } from './quality.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const router = Router();
const qualityService = new QualityService();

/**
 * GET /api/fpo/quality/pending
 * Get pending quality certificates
 */
router.get('/pending', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const certificates = await qualityService.getPendingCertificates(fpoId);
    res.json({ success: true, data: certificates });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/quality/verify/:id
 * Verify or reject quality certificate
 */
router.post('/verify/:id', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { approved, aiScore } = req.body;
    const certificate = await qualityService.verifyCertificate(
      fpoId,
      req.params.id,
      approved,
      aiScore
    );
    
    res.json({ success: true, data: certificate });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/fpo/quality/upload
 * Upload quality certificate
 */
router.post('/upload', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const certificate = await qualityService.uploadCertificate(fpoId, req.body);
    res.status(201).json({ success: true, data: certificate });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/fpo/quality/certificates
 * Get all certificates
 */
router.get('/certificates', async (req: AuthRequest, res: Response) => {
  try {
    const fpoId = req.user?.userId;
    if (!fpoId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const filters = {
      verifiedByFPO: req.query.verifiedByFPO as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await qualityService.getAllCertificates(fpoId, filters);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
