/* ========================================================================
   Communications Controller — Advanced Communication Features  
   Handles all communication endpoints
   ======================================================================== */

import { Request, Response } from 'express';
import { CommunicationsService } from '../services/communications.service';

export class CommunicationsController {
  /**
   * POST /api/communications/translate
   * Translate a message to another language
   */
  static async translateMessage(req: Request, res: Response) {
    try {
      const { text, targetLanguage, sourceLanguage } = req.body;

      if (!text || !targetLanguage) {
        return res.status(400).json({
          error: 'Text and targetLanguage are required',
        });
      }

      const result = await CommunicationsService.translateMessage({
        text,
        targetLanguage,
        sourceLanguage,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('[Communications] Translation error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/communications/suppliers/matches
   * Find matching suppliers for buyer
   */
  static async findSupplierMatches(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { cropType, quantity } = req.query;

      if (!cropType || !quantity) {
        return res.status(400).json({
          error: 'cropType and quantity are required',
        });
      }

      const matches = await CommunicationsService.findSupplierMatches(
        userId,
        cropType as string,
        parseInt(quantity as string)
      );

      res.status(200).json({
        success: true,
        data: matches,
      });
    } catch (error: any) {
      console.error('[Communications] Matching error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  /**
   * POST /api/communications/sentiment/analyze
   * Analyze sentiment of a message
   */
  static async analyzeSentiment(req: Request, res: Response) {
    try {
      const { messageId, content } = req.body;

      if (!messageId || !content) {
        return res.status(400).json({
          error: 'messageId and content are required',
        });
      }

      const analysis = await CommunicationsService.analyzeSentiment(messageId, content);

      res.status(200).json({
        success: true,
        data: analysis,
      });
    } catch (error: any) {
      console.error('[Communications] Sentiment analysis error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  /**
   * POST /api/communications/negotiations
   * Create a new negotiation deal
   */
  static async createNegotiation(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        sellerId,
        productId,
        quantity,
        unit,
        initialPrice,
      } = req.body;

      if (!sellerId || !productId || !quantity || !unit || !initialPrice) {
        return res.status(400).json({
          error: 'All negotiation fields are required',
        });
      }

      const deal = await CommunicationsService.createNegotiation({
        buyerId: userId,
        sellerId,
        productId,
        quantity,
        unit,
        initialPrice,
      });

      res.status(201).json({
        success: true,
        data: deal,
      });
    } catch (error: any) {
      console.error('[Communications] Negotiation creation error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  /**
   * PATCH /api/communications/negotiations/:id
   * Update negotiation price
   */
  static async updateNegotiationPrice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newPrice } = req.body;

      if (!newPrice) {
        return res.status(400).json({
          error: 'newPrice is required',
        });
      }

      const updated = await CommunicationsService.updateNegotiationPrice(id, newPrice);

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error: any) {
      console.error('[Communications] Price update error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/communications/analytics
   * Get conversation analytics
   */
  static async getAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { period } = req.query;
      const analytics = await CommunicationsService.getConversationAnalytics(
        userId,
        (period as any) || 'week'
      );

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      console.error('[Communications] Analytics error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/communications/verification/:userId
   * Get user verification status
   */
  static async getVerificationStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const verification = await CommunicationsService.getVerificationStatus(userId);

      res.status(200).json({
        success: true,
        data: verification,
      });
    } catch (error: any) {
      console.error('[Communications] Verification error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/communications/notifications
   * Get smart notifications
   */
  static async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { limit } = req.query;
      const notifications = await CommunicationsService.getSmartNotifications(
        userId,
        parseInt(limit as string) || 10
      );

      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error: any) {
      console.error('[Communications] Notifications error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/communications/buyers/matches
   * Find matching buyers for farmer
   */
  static async findBuyerMatches(req: Request, res: Response) {
    try {
      const farmerId = req.user?.userId;
      if (!farmerId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { crops, quantity } = req.query;

      if (!crops || !quantity) {
        return res.status(400).json({
          error: 'crops and quantity are required',
        });
      }

      const cropArray = typeof crops === 'string' ? crops.split(',') : crops as string[];
      const matches = await CommunicationsService.findBuyerMatches(
        farmerId,
        cropArray,
        parseInt(quantity as string)
      );

      res.status(200).json({
        success: true,
        data: matches,
      });
    } catch (error: any) {
      console.error('[Communications] Buyer matching error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/communications/farmer/sales-analytics
   * Get farmer sales analytics
   */
  static async getFarmerSalesAnalytics(req: Request, res: Response) {
    try {
      const farmerId = req.user?.userId;
      if (!farmerId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { period } = req.query;
      const analytics = await CommunicationsService.getFarmerSalesAnalytics(
        farmerId,
        (period as 'week' | 'month' | 'year') || 'month'
      );

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      console.error('[Communications] Sales analytics error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  /**
   * GET /api/communications/farm/verification
   * Get farm verification status
   */
  static async getFarmVerificationStatus(req: Request, res: Response) {
    try {
      const farmerId = req.user?.userId;
      if (!farmerId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const verification = await CommunicationsService.getFarmVerificationStatus(farmerId);

      res.status(200).json({
        success: true,
        data: verification,
      });
    } catch (error: any) {
      console.error('[Communications] Farm verification error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  /**
   * POST /api/communications/harvest/listings
   * Create a harvest listing
   */
  static async createHarvestListing(req: Request, res: Response) {
    try {
      const farmerId = req.user?.userId;
      if (!farmerId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        cropName,
        quantity,
        unit,
        minPrice,
        quality,
        harvestDate,
        expiryDate,
        description,
      } = req.body;

      if (!cropName || !quantity || !unit || !minPrice || !quality) {
        return res.status(400).json({
          error: 'cropName, quantity, unit, minPrice, and quality are required',
        });
      }

      const listing = await CommunicationsService.createHarvestListing(farmerId, {
        cropName,
        quantity: parseInt(quantity),
        unit,
        minPrice: parseFloat(minPrice),
        quality,
        harvestDate: new Date(harvestDate),
        expiryDate: new Date(expiryDate),
        description: description || '',
      });

      res.status(201).json({
        success: true,
        data: listing,
      });
    } catch (error: any) {
      console.error('[Communications] Harvest listing error:', error.message);
      res.status(500).json({
        error: error.message,
      });
    }
  }
}
