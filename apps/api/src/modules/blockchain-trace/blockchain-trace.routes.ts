import { Router } from 'express';
import blockchainTraceController from './blockchain-trace.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/supply-chain/:productId', blockchainTraceController.getSupplyChainJourney);
router.get('/contract/:contractAddress', blockchainTraceController.getSmartContractStatus);
router.post('/verify/:productId', blockchainTraceController.verifyProvenance);
router.get('/carbon/:productId', blockchainTraceController.calculateCarbonFootprint);
router.get('/consensus/:transactionId', blockchainTraceController.getConsensusStatus);
router.get('/fraud/:productId', blockchainTraceController.detectFraud);
router.get('/cross-chain', blockchainTraceController.getCrossChainStatus);
router.post('/nft/:productId', blockchainTraceController.generateNFTCertificate);
router.get('/audit/:farmerId', blockchainTraceController.getAuditAnalytics);
router.post('/compliance/:productId', blockchainTraceController.validateCompliance);

export default router;
