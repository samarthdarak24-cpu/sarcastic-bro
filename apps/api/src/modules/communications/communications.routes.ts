/* ========================================================================
   Communications Routes — /api/communications/*
   Advanced communication features endpoints
   ======================================================================== */

import { Router } from 'express';
import { CommunicationsController } from './communications.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Translation endpoints
router.post('/translate', asyncHandler(CommunicationsController.translateMessage));

// Smart Matching endpoints - Buyers
router.get('/suppliers/matches', asyncHandler(CommunicationsController.findSupplierMatches));

// Smart Matching endpoints - Farmers (find buyers)
router.get('/buyers/matches', asyncHandler(CommunicationsController.findBuyerMatches));

// Sentiment Analysis endpoints
router.post('/sentiment/analyze', asyncHandler(CommunicationsController.analyzeSentiment));

// Negotiation endpoints
router.post('/negotiations', asyncHandler(CommunicationsController.createNegotiation));
router.patch('/negotiations/:id', asyncHandler(CommunicationsController.updateNegotiationPrice));

// Analytics endpoints - Buyers
router.get('/analytics', asyncHandler(CommunicationsController.getAnalytics));

// Analytics endpoints - Farmers
router.get('/farmer/sales-analytics', asyncHandler(CommunicationsController.getFarmerSalesAnalytics));

// Verification endpoints
router.get('/verification/:userId', asyncHandler(CommunicationsController.getVerificationStatus));

// Farm Verification endpoints
router.get('/farm/verification', asyncHandler(CommunicationsController.getFarmVerificationStatus));

// Notifications endpoints
router.get('/notifications', asyncHandler(CommunicationsController.getNotifications));

// Harvest Listing endpoints
router.post('/harvest/listings', asyncHandler(CommunicationsController.createHarvestListing));

export default router;
