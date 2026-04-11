// ========================================================================
// FPO Linking Routes
// Handles farmer requests to join FPOs and FPO approval/rejection
// ========================================================================

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import * as fpoLinkController from '../controllers/fpo-link.controller';

const router = Router();

// ─── FARMER ROUTES ──────────────────────────────────────────────────────
router.get(
  '/farmer/fpo/search',
  authenticateToken,
  roleMiddleware(['FARMER']),
  fpoLinkController.searchFPOs
);

router.post(
  '/farmer/fpo/link-request',
  authenticateToken,
  roleMiddleware(['FARMER']),
  fpoLinkController.createLinkRequest
);

router.get(
  '/farmer/fpo/my-status',
  authenticateToken,
  roleMiddleware(['FARMER']),
  fpoLinkController.getMyFPOStatus
);

router.delete(
  '/farmer/fpo/unlink',
  authenticateToken,
  roleMiddleware(['FARMER']),
  fpoLinkController.unlinkFromFPO
);

// ─── FPO ROUTES ─────────────────────────────────────────────────────────
router.get(
  '/fpo/link-requests',
  authenticateToken,
  roleMiddleware(['FPO']),
  fpoLinkController.getFPOLinkRequests
);

router.post(
  '/fpo/link-requests/:id/approve',
  authenticateToken,
  roleMiddleware(['FPO']),
  fpoLinkController.approveLinkRequest
);

router.post(
  '/fpo/link-requests/:id/reject',
  authenticateToken,
  roleMiddleware(['FPO']),
  fpoLinkController.rejectLinkRequest
);

router.get(
  '/fpo/linked-farmers',
  authenticateToken,
  roleMiddleware(['FPO']),
  fpoLinkController.getLinkedFarmers
);

router.put(
  '/fpo/farmers/:id/toggle-status',
  authenticateToken,
  roleMiddleware(['FPO']),
  fpoLinkController.toggleFarmerStatus
);

export default router;
