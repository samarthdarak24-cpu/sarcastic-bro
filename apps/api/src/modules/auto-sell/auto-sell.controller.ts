/* ========================================================================
   Auto-Sell Controller — Smart Deal Engine
   Handles HTTP requests for auto-sell rules
   ======================================================================== */

import { Request, Response, NextFunction } from 'express';
import { AutoSellService } from './auto-sell.service';

export class AutoSellController {
  /**
   * Create a new auto-sell rule
   * POST /api/auto-sell/rules
   */
  static async createRule(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const { productId, minPrice, quantity } = req.body;

      if (!productId || !minPrice || !quantity) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: productId, minPrice, quantity',
        });
      }

      const rule = await AutoSellService.createRule({
        farmerId: userId,
        productId,
        minPrice: parseFloat(minPrice),
        quantity: parseFloat(quantity),
      });

      res.status(201).json({
        success: true,
        message: 'Auto-sell rule created successfully',
        data: rule,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get all rules for the authenticated farmer
   * GET /api/auto-sell/rules
   */
  static async getRules(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;

      const rules = await AutoSellService.getRules(userId);

      res.status(200).json({
        success: true,
        data: rules,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update an auto-sell rule
   * PUT /api/auto-sell/rules/:id
   */
  static async updateRule(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;
      const { minPrice, quantity, isActive } = req.body;

      const rule = await AutoSellService.updateRule(id, userId, {
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        quantity: quantity ? parseFloat(quantity) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Auto-sell rule updated successfully',
        data: rule,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Delete an auto-sell rule
   * DELETE /api/auto-sell/rules/:id
   */
  static async deleteRule(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      const result = await AutoSellService.deleteRule(id, userId);

      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Manually trigger rule evaluation (admin only)
   * POST /api/auto-sell/evaluate
   */
  static async evaluateRules(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AutoSellService.evaluateRules();

      res.status(200).json({
        success: true,
        message: 'Rule evaluation completed',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get auto-sell statistics for the authenticated farmer
   * GET /api/auto-sell/statistics
   */
  static async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;

      const stats = await AutoSellService.getStatistics(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
