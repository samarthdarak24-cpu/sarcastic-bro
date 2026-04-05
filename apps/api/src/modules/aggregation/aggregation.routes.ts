import { Router } from 'express';
import { aggregationController } from './aggregation.controller';

const router = Router();

// Find nearby farmers for clustering
router.get('/nearby-farmers', aggregationController.findNearbyFarmers);

// Auto-cluster farmers into bulk lots
router.get('/auto-cluster', aggregationController.autoCluster);

// Get farmer's contributions to bulk lots
router.get('/my-contributions/:farmerId', aggregationController.getMyContributions);

// Join a bulk lot
router.post('/join-lot', aggregationController.joinBulkLot);

// Get available bulk lots for buyers
router.get('/available-lots', aggregationController.getAvailableLots);

// Calculate potential earnings
router.get('/calculate-earnings', aggregationController.calculateEarnings);

export default router;
