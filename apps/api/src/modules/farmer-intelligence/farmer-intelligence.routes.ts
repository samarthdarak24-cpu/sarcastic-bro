/**
 * Weather & Subsidy Intelligence Routes
 */

import { Router, Request, Response } from 'express';
import { WeatherSubsidyService } from '../../services/weather-subsidy.service';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();

/**
 * @route GET /api/weather/impact
 * @query {string} region - Region/State name
 * @desc Get weather impact on crop prices
 */
router.get('/weather/impact', authenticate, async (req: Request, res: Response) => {
  try {
    const { region } = req.query;

    const impacts = await WeatherSubsidyService.getWeatherImpact(region as string | undefined);

    return res.status(200).json({
      success: true,
      data: impacts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route GET /api/subsidies/government
 * @query {string} state - State name
 * @query {string} crop - Crop name (optional)
 * @desc Get applicable government subsidies
 */
router.get('/subsidies/government', authenticate, async (req: Request, res: Response) => {
  try {
    const { state, crop } = req.query;

    if (!state) {
      return res.status(400).json({ message: 'State name is required' });
    }

    const subsidies = await WeatherSubsidyService.getGovernmentSubsidies(
      state as string,
      crop as string | undefined
    );

    return res.status(200).json({
      success: true,
      data: subsidies,
      totalAvailable: subsidies.length,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route GET /api/planting/recommendations
 * @query {string} region - Region name
 * @query {string} season - Season (Kharif/Rabi/Summer)
 * @desc Get planting recommendations based on weather
 */
router.get('/planting/recommendations', authenticate, async (req: Request, res: Response) => {
  try {
    const { region, season } = req.query;

    if (!region) {
      return res.status(400).json({ message: 'Region is required' });
    }

    const recommendations = await WeatherSubsidyService.getPlantingRecommendations(
      region as string,
      season as string | undefined
    );

    return res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route GET /api/pest-disease/alerts
 * @query {string} region - Region name
 * @query {string} crop - Crop name
 * @desc Get pest and disease alerts
 */
router.get('/pest-disease/alerts', authenticate, async (req: Request, res: Response) => {
  try {
    const { region, crop } = req.query;

    const alerts = await WeatherSubsidyService.getPestAlerts(
      region as string | undefined,
      crop as string | undefined
    );

    return res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route GET /api/seasonal/export-analysis
 * @query {string} crop - Crop name
 * @desc Get seasonal impact on export prices
 */
router.get('/seasonal/export-analysis', authenticate, async (req: Request, res: Response) => {
  try {
    const { crop } = req.query;

    if (!crop) {
      return res.status(400).json({ message: 'Crop name is required' });
    }

    const analysis = await WeatherSubsidyService.getSeasonalExportAnalysis(crop as string);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route GET /api/climate/adaptation-strategies
 * @query {string} region - Region name
 * @desc Get climate change adaptation strategies
 */
router.get('/climate/adaptation-strategies', authenticate, async (req: Request, res: Response) => {
  try {
    const { region } = req.query;

    if (!region) {
      return res.status(400).json({ message: 'Region is required' });
    }

    const strategies = await WeatherSubsidyService.getClimateAdaptationStrategies(region as string);

    return res.status(200).json({
      success: true,
      data: strategies,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
