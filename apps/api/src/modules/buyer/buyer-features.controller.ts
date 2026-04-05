import { Router, Request, Response } from 'express';
import { buyerFeaturesService } from './buyer-features.service';

const router = Router();

// Get all features data
router.get('/features', async (req: Request, res: Response) => {
  try {
    const features = await buyerFeaturesService.getAllFeatures();
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

// Get specific feature data
router.get('/features/:featureName', async (req: Request, res: Response) => {
  try {
    const { featureName } = req.params;
    const featureData = await buyerFeaturesService.getFeatureData(featureName);
    res.json(featureData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feature data' });
  }
});

// Get sub-feature data
router.get('/features/:featureName/:subFeatureName', async (req: Request, res: Response) => {
  try {
    const { featureName, subFeatureName } = req.params;
    const subFeatureData = await buyerFeaturesService.getSubFeatureData(featureName, subFeatureName);
    res.json(subFeatureData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sub-feature data' });
  }
});

// Update feature data
router.post('/features/:featureName', async (req: Request, res: Response) => {
  try {
    const { featureName } = req.params;
    const updatedData = await buyerFeaturesService.updateFeatureData(featureName, req.body);
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update feature data' });
  }
});

export default router;
