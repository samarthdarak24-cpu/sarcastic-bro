import { Router } from 'express';
import complianceController from './gov-compliance.controller';

const router = Router();

// Mount the compliance controller - all routes are defined in the controller
router.use('/', complianceController);

export default router;
