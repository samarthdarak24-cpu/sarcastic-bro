import { Request, Response } from 'express';
import escrowService from './escrow.service';

export class EscrowController {
  /**
   * Create escrow for an order
   * POST /escrow/create
   * Requires authentication
   */
  async createEscrow(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { orderId, amount, buyerId, sellerId } = req.body;

      // Validate required fields
      if (!orderId || !amount || !buyerId || !sellerId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: orderId, amount, buyerId, sellerId',
        });
      }

      // Validate amount is positive
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0',
        });
      }

      // Verify user is authorized (must be buyer or seller)
      if (userId !== buyerId && userId !== sellerId) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized to create escrow for this order',
        });
      }

      const result = await escrowService.createSmartEscrow({
        orderId,
        amount,
        buyerId,
        sellerId,
      });

      res.status(201).json({
        success: true,
        data: result.escrow,
        message: result.message,
      });
    } catch (error) {
      console.error('Error creating escrow:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create escrow',
      });
    }
  }

  /**
   * Release escrow funds to farmer
   * PUT /escrow/:id/release
   * Requires authentication and authorization (buyer or farmer)
   */
  async releaseEscrow(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Escrow ID is required',
        });
      }

      const result = await escrowService.releaseFunds(id, userId);

      res.json({
        success: true,
        data: result.escrow,
        message: 'Escrow funds released successfully',
      });
    } catch (error) {
      console.error('Error releasing escrow:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message === 'Escrow not found') {
          return res.status(404).json({
            success: false,
            error: 'Escrow not found',
          });
        }
        if (error.message === 'Unauthorized to release funds') {
          return res.status(403).json({
            success: false,
            error: 'Unauthorized to release funds',
          });
        }
        if (error.message === 'Both parties must confirm before release') {
          return res.status(400).json({
            success: false,
            error: 'Both parties must confirm before release',
          });
        }
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to release escrow',
      });
    }
  }

  /**
   * Raise dispute on escrow
   * PUT /escrow/:id/dispute
   * Requires authentication and authorization (buyer or farmer)
   */
  async raiseDispute(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const { reason } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Escrow ID is required',
        });
      }

      if (!reason || reason.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Dispute reason is required',
        });
      }

      const result = await escrowService.raiseDispute(id, userId, reason);

      res.json({
        success: true,
        data: result.dispute,
        message: 'Dispute raised successfully. Admin has been notified.',
      });
    } catch (error) {
      console.error('Error raising dispute:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message === 'Escrow not found') {
          return res.status(404).json({
            success: false,
            error: 'Escrow not found',
          });
        }
        if (error.message === 'Unauthorized to raise dispute') {
          return res.status(403).json({
            success: false,
            error: 'Unauthorized to raise dispute',
          });
        }
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to raise dispute',
      });
    }
  }

  /**
   * Get escrow details by ID
   * GET /escrow/:id
   * Requires authentication and authorization (buyer or farmer)
   */
  async getEscrowById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Escrow ID is required',
        });
      }

      const escrow = await escrowService.getEscrowById(id, userId);

      res.json({
        success: true,
        data: escrow,
      });
    } catch (error) {
      console.error('Error fetching escrow:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message === 'Escrow not found') {
          return res.status(404).json({
            success: false,
            error: 'Escrow not found',
          });
        }
        if (error.message === 'Unauthorized to view this escrow') {
          return res.status(403).json({
            success: false,
            error: 'Unauthorized to view this escrow',
          });
        }
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch escrow',
      });
    }
  }

  /**
   * Get escrow analytics for user
   * GET /escrow/analytics
   * Requires authentication
   */
  async getEscrowAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const analytics = await escrowService.getEscrowAnalytics(userId, userRole);

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error('Error fetching escrow analytics:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch escrow analytics',
      });
    }
  }

  /**
   * Confirm delivery (buyer confirms or farmer marks as delivered)
   * PUT /escrow/:id/confirm
   * Requires authentication and authorization (buyer or farmer)
   */
  async confirmDelivery(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Escrow ID is required',
        });
      }

      // Determine role for confirmation
      const role = userRole === 'BUYER' ? 'buyer' : 'farmer';

      const result = await escrowService.confirmDelivery(id, userId, role);

      res.json({
        success: true,
        data: result.escrow,
        message: `Delivery confirmation recorded for ${role}`,
      });
    } catch (error) {
      console.error('Error confirming delivery:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message === 'Escrow not found') {
          return res.status(404).json({
            success: false,
            error: 'Escrow not found',
          });
        }
        if (error.message === 'Unauthorized') {
          return res.status(403).json({
            success: false,
            error: 'Unauthorized to confirm delivery',
          });
        }
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to confirm delivery',
      });
    }
  }
}

export const escrowController = new EscrowController();
