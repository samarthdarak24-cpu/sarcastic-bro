import { Router } from 'express';
import fpoController from './fpo.controller';

const router = Router();

// Mount FPO controller
router.use('/', fpoController);

export default router;
