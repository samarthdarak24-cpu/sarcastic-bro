import { Router } from 'express';
import { tenderController } from './tender.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/marketplace', tenderController.getMarketplace.bind(tenderController));
router.get('/my-bids', tenderController.getMyBids.bind(tenderController));
router.get('/analytics', tenderController.getAnalytics.bind(tenderController));
router.post('/ai-suggest', tenderController.getAISuggestion.bind(tenderController));
router.post('/submit-bid', tenderController.submitBid.bind(tenderController));
router.post('/update-status', tenderController.updateBidStatus.bind(tenderController));
router.post('/create', tenderController.createTender.bind(tenderController));

export default router;
