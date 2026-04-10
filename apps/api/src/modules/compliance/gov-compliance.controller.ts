import { Router, Request, Response } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { GovComplianceService } from './gov-compliance.service';

const router = Router();
const complianceService = new GovComplianceService();

/**
 * 1. Liveliness Check API
 * POST /api/compliance/liveliness
 */
router.post('/liveliness', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { sessionId, photoData } = req.body;

  if (!sessionId || !photoData) {
    return res.status(400).json({
      success: false,
      message: 'sessionId and photoData are required'
    });
  }

  const result = await complianceService.checkLiveliness(userId, sessionId, photoData);

  res.status(200).json({
    success: true,
    message: result.success ? 'Liveliness verified' : 'Liveliness check failed',
    data: result
  });
}));

/**
 * 2. AADHAAR Bridge API
 * POST /api/compliance/aadhaar/verify
 */
router.post('/aadhaar/verify', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { aadhaarNumber } = req.body;

  if (!aadhaarNumber || aadhaarNumber.length !== 12) {
    return res.status(400).json({
      success: false,
      message: 'Valid 12-digit Aadhaar number is required'
    });
  }

  const result = await complianceService.verifyAadhaar(userId, aadhaarNumber);

  res.status(200).json({
    success: true,
    message: result.verified ? 'Aadhaar verified successfully' : 'Aadhaar verification failed',
    data: result
  });
}));

/**
 * 3. Geo-Audit API
 * POST /api/compliance/geo-audit
 */
router.post('/geo-audit', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: 'latitude and longitude are required'
    });
  }

  const result = await complianceService.performGeoAudit(
    userId,
    parseFloat(latitude),
    parseFloat(longitude)
  );

  res.status(200).json({
    success: true,
    message: result.verified ? 'Location verified' : 'Location outside authorized radius',
    data: result
  });
}));

/**
 * 4. Family Links API
 * GET /api/compliance/family-links
 */
router.get('/family-links', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const result = await complianceService.getFamilyLinks(userId);

  res.status(200).json({
    success: true,
    data: result
  });
}));

/**
 * 5. Subsidy Check API
 * GET /api/compliance/subsidies
 */
router.get('/subsidies', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const result = await complianceService.checkSubsidies(userId);

  res.status(200).json({
    success: true,
    data: result
  });
}));

/**
 * 6. Blacklist Check API
 * GET /api/compliance/blacklist-check
 */
router.get('/blacklist-check', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const result = await complianceService.checkBlacklist(userId);

  res.status(200).json({
    success: true,
    data: result
  });
}));

/**
 * 7. Re-KYC Timer API
 * GET /api/compliance/rekyc-timer
 */
router.get('/rekyc-timer', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const result = await complianceService.checkReKYCTimer(userId);

  res.status(200).json({
    success: true,
    data: result
  });
}));

/**
 * Get Compliance Logs
 * GET /api/compliance/logs
 */
router.get('/logs', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { limit } = req.query;

  const logs = await complianceService.getComplianceLogs(
    userId,
    limit ? parseInt(limit as string) : 20
  );

  res.status(200).json({
    success: true,
    data: logs
  });
}));

export default router;
