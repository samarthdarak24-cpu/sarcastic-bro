import { Router } from 'express';
import farmerController from './farmer-new.controller';

const router = Router();

// Mount farmer controller
router.use('/', farmerController);

export default router;
