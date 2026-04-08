import { Router } from 'express';
import { escrowController } from './escrow.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { roleMiddleware } from '../../middleware/role.middleware';

const router = Router();

// All escrow routes require authentication
router.use(authMiddleware);

/**
 * Core escrow endpoints (as per spec requirements)
 */

// Create escrow for an order
// POST /escrow/create
// Requires: BUYER or FARMER role
router.post(
  '/create',
  roleMiddleware('BUYER', 'FARMER'),
  escrowController.createEscrow.bind(escrowController)
);

// Release escrow funds to farmer
// PUT /escrow/:id/release
// Requires: BUYER or FARMER role (must be involved in the order)
router.put(
  '/:id/release',
  roleMiddleware('BUYER', 'FARMER'),
  escrowController.releaseEscrow.bind(escrowController)
);

// Raise dispute on escrow
// PUT /escrow/:id/dispute
// Requires: BUYER or FARMER role (must be involved in the order)
router.put(
  '/:id/dispute',
  roleMiddleware('BUYER', 'FARMER'),
  escrowController.raiseDispute.bind(escrowController)
);

/**
 * Additional escrow management endpoints
 */

// Get escrow details by ID
// GET /escrow/:id
// Requires: BUYER or FARMER role (must be involved in the order)
router.get(
  '/:id',
  roleMiddleware('BUYER', 'FARMER'),
  escrowController.getEscrowById.bind(escrowController)
);

// Get escrow analytics for current user
// GET /escrow/analytics
// Requires: BUYER or FARMER role
router.get(
  '/analytics',
  roleMiddleware('BUYER', 'FARMER'),
  escrowController.getEscrowAnalytics.bind(escrowController)
);

// Confirm delivery (buyer confirms receipt or farmer marks as delivered)
// PUT /escrow/:id/confirm
// Requires: BUYER or FARMER role (must be involved in the order)
router.put(
  '/:id/confirm',
  roleMiddleware('BUYER', 'FARMER'),
  escrowController.confirmDelivery.bind(escrowController)
);

export default router;
