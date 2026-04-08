/* ========================================================================
   User Controller — Profile and Reputation Management Endpoints
   Handles HTTP endpoints for user profile and reputation features
   ======================================================================== */

import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { UserService } from './user.service';

export class UserController {
  /**
   * GET /api/user/profile
   * Get authenticated user's profile
   */
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await UserService.getProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      console.error('[UserController] Get profile error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /api/user/profile
   * Update authenticated user's profile
   */
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, phone, district, state, address, language, avatarUrl } = req.body;

      const profile = await UserService.updateProfile(userId, {
        name,
        phone,
        district,
        state,
        address,
        language,
        avatarUrl,
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: profile,
      });
    } catch (error: any) {
      console.error('[UserController] Update profile error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /api/user/upload-photo
   * Upload profile photo
   */
  static async uploadPhoto(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      // In a real implementation, you would upload to cloud storage
      // For now, we'll just return a mock URL
      const avatarUrl = `/uploads/${file.filename}`;

      const profile = await UserService.updateProfile(userId, { avatarUrl });

      res.status(200).json({
        success: true,
        message: 'Profile photo uploaded successfully',
        data: { avatarUrl, profile },
      });
    } catch (error: any) {
      console.error('[UserController] Upload photo error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /api/user/kyc
   * Upload KYC documents
   */
  static async uploadKYC(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { kycDocumentUrl, aadhaarNumber, panNumber } = req.body;

      if (!kycDocumentUrl) {
        return res.status(400).json({ error: 'KYC document URL is required' });
      }

      const result = await UserService.uploadKYC(userId, {
        kycDocumentUrl,
        aadhaarNumber,
        panNumber,
      });

      res.status(200).json({
        success: true,
        message: 'KYC documents uploaded successfully',
        data: result,
      });
    } catch (error: any) {
      console.error('[UserController] Upload KYC error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/user/:id/reputation
   * Get user reputation (public)
   */
  static async getReputation(req: AuthRequest, res: Response) {
    try {
      const { id: userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const reputation = await UserService.getReputation(userId);

      res.status(200).json({
        success: true,
        data: reputation,
      });
    } catch (error: any) {
      console.error('[UserController] Get reputation error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/user/:id/stats
   * Get user statistics (public)
   */
  static async getStats(req: AuthRequest, res: Response) {
    try {
      const { id: userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const stats = await UserService.getStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('[UserController] Get stats error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /api/user/reputation/refresh/:id
   * Force refresh reputation stats
   */
  static async updateReputation(req: AuthRequest, res: Response) {
    try {
      const { id: userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Force recalculation of reputation
      const reputation = await UserService.getReputation(userId);

      res.status(200).json({
        success: true,
        message: 'Reputation refreshed successfully',
        data: reputation,
      });
    } catch (error: any) {
      console.error('[UserController] Update reputation error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}
