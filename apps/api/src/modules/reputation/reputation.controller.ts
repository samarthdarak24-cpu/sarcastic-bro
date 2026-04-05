import { Request, Response } from 'express';
import reputationService from './reputation.service';

export class ReputationController {
  async getTrustScore(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id || req.params.buyerId;
      const data = await reputationService.getTrustScore(buyerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getReviews(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id || req.params.buyerId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await reputationService.getReviews(buyerId, page, limit);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPerformanceMetrics(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id || req.params.buyerId;
      const data = await reputationService.getPerformanceMetrics(buyerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getReputationTimeline(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id || req.params.buyerId;
      const data = await reputationService.getReputationTimeline(buyerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPeerComparison(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id || req.params.buyerId;
      const data = await reputationService.getPeerComparison(buyerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getBadges(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id || req.params.buyerId;
      const data = await reputationService.getBadges(buyerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getAIInsights(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id || req.params.buyerId;
      const data = await reputationService.getAIInsights(buyerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getTestimonials(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id || req.params.buyerId;
      const data = await reputationService.getTestimonials(buyerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getDisputes(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id || req.params.buyerId;
      const data = await reputationService.getDisputes(buyerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getBoostCampaigns(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id || req.params.buyerId;
      const data = await reputationService.getBoostCampaigns(buyerId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async resolveDispute(req: Request, res: Response) {
    try {
      const { disputeId } = req.params;
      const { resolution } = req.body;
      await reputationService.resolveDispute(disputeId, resolution);
      res.json({ success: true, message: 'Dispute resolved successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async verifyBadge(req: Request, res: Response) {
    try {
      const buyerId = req.user?.id;
      const { badgeId } = req.params;
      const hash = await reputationService.requestBadgeVerification(buyerId, badgeId);
      res.json({ success: true, data: { blockchainHash: hash } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new ReputationController();
