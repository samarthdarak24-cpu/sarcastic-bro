import { Router } from 'express';
import { insightsController } from './insights.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/all', insightsController.getAllInsights.bind(insightsController));
router.get('/soil-health', insightsController.getSoilHealth.bind(insightsController));
router.get('/crop-performance', insightsController.getCropPerformance.bind(insightsController));
router.get('/financial', insightsController.getFinancialAnalytics.bind(insightsController));
router.get('/resources', insightsController.getResourceOptimization.bind(insightsController));
router.get('/benchmarking', insightsController.getBenchmarking.bind(insightsController));
router.get('/maintenance', insightsController.getPredictiveMaintenance.bind(insightsController));

router.post('/soil-data', insightsController.updateSoilData.bind(insightsController));
router.post('/expense', insightsController.recordExpense.bind(insightsController));
router.post('/equipment', insightsController.addEquipment.bind(insightsController));
router.put('/equipment/:equipmentId', insightsController.updateEquipmentStatus.bind(insightsController));

// Price Intelligence routes
router.get('/price-trends', insightsController.getPriceTrends.bind(insightsController));
router.get('/price-forecast', insightsController.getPriceForecast.bind(insightsController));
router.post('/price-alert', insightsController.createPriceAlert.bind(insightsController));
router.get('/price-alerts', insightsController.getPriceAlerts.bind(insightsController));
router.delete('/price-alert/:alertId', insightsController.deletePriceAlert.bind(insightsController));

export default router;
