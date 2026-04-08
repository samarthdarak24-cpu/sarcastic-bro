import { Router, Request, Response } from 'express';
import { ProposalController } from './proposal.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Proposal routes
router.post('/', ProposalController.create);
router.get('/', ProposalController.getAll);
router.get('/:id', ProposalController.getById);
router.put('/:id', ProposalController.update);
router.delete('/:id', ProposalController.delete);

export default router;
