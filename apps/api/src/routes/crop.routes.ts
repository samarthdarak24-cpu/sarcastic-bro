import { Router } from 'express';
import { createCrop, getMarketplaceCrops, getMyCrops, getCropById, updateCrop, deleteCrop } from '../controllers/crop.controller';
import { memoryUpload } from '../middleware/upload.middleware';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getMarketplaceCrops);

// Protected routes (require authentication) - specific routes BEFORE parameterized routes
router.post('/', authenticate, memoryUpload.array('images', 5), createCrop);
router.get('/my-listings', authenticate, getMyCrops);

// Parameterized routes MUST come after specific routes
router.get('/:id', getCropById);
router.put('/:id', authenticate, updateCrop);
router.delete('/:id', authenticate, deleteCrop);

export default router;
