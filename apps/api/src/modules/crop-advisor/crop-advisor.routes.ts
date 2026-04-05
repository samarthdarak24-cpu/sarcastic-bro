import { Router } from 'express';
import cropAdvisorController from './crop-advisor.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/recommendations', cropAdvisorController.getCropRecommendations);
router.get('/growth/:cropId', cropAdvisorController.trackGrowthStage);
router.post('/disease-analysis', cropAdvisorController.analyzeDiseaseRisk);
router.get('/irrigation/:cropId', cropAdvisorController.getIrrigationPlan);
router.post('/fertilizer/:cropId', cropAdvisorController.calculateFertilizer);
router.get('/harvest-prediction/:cropId', cropAdvisorController.predictHarvest);
router.post('/rotation-plan', cropAdvisorController.generateRotationPlan);
router.get('/market-advice/:cropType', cropAdvisorController.getMarketAdvice);
router.get('/weather-impact/:cropId', cropAdvisorController.analyzeWeatherImpact);
router.get('/health-score/:cropId', cropAdvisorController.getCropHealthScore);

export default router;
