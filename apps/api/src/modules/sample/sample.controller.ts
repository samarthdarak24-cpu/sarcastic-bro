/* ========================================================================
   Sample Request Controller — Sample Request Management Endpoints
   Handles HTTP endpoints for sample request features
   ======================================================================== */

import { Request, Response } from 'express';
import { SampleService } from './sample.service';

export class SampleController {
  /**
   * POST /api/samples
   * Create a sample request
   */
  static async createRequest(req: Request, res: Response) {
    try {
      const requesterId = req.user?.id;
      if (!requesterId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { productId, quantity, message, shippingAddress } = req.body;

      if (!productId || !quantity || !shippingAddress) {
        return res.status(400).json({ 
          error: 'Product ID, quantity, and shipping address are required' 
        });
      }

      const sampleRequest = await SampleService.createRequest({
        requesterId,
        productId,
        quantity: parseFloat(quantity),
        message,
        shippingAddress,
      });

      res.status(201).json({
        success: true,
        message: 'Sample request created successfully',
        data: sampleRequest,
      });
    } catch (error: any) {
      console.error('[SampleController] Create request error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/samples
   * Get sample requests (farmer or requester based on role)
   */
  static async getRequests(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const status = req.query.status as string | undefined;
      const type = req.query.type as string; // 'farmer' or 'requester'

      let requests;

      if (type === 'farmer' || userRole === 'FARMER') {
        requests = await SampleService.getFarmerRequests(userId, status);
      } else {
        requests = await SampleService.getRequesterRequests(userId, status);
      }

      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error: any) {
      console.error('[SampleController] Get requests error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /api/samples/:id/approve
   * Approve a sample request (farmer only)
   */
  static async approveRequest(req: Request, res: Response) {
    try {
      const farmerId = req.user?.id;
      if (!farmerId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id: sampleRequestId } = req.params;

      if (!sampleRequestId) {
        return res.status(400).json({ error: 'Sample request ID is required' });
      }

      const updated = await SampleService.approveRequest(sampleRequestId, farmerId);

      res.status(200).json({
        success: true,
        message: 'Sample request approved successfully',
        data: updated,
      });
    } catch (error: any) {
      console.error('[SampleController] Approve request error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /api/samples/:id/ship
   * Ship a sample (farmer only)
   */
  static async shipSample(req: Request, res: Response) {
    try {
      const farmerId = req.user?.id;
      if (!farmerId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id: sampleRequestId } = req.params;
      const { trackingNumber } = req.body;

      if (!sampleRequestId) {
        return res.status(400).json({ error: 'Sample request ID is required' });
      }

      const updated = await SampleService.shipSample(
        sampleRequestId,
        farmerId,
        trackingNumber
      );

      res.status(200).json({
        success: true,
        message: 'Sample shipped successfully',
        data: updated,
      });
    } catch (error: any) {
      console.error('[SampleController] Ship sample error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /api/samples/:id/received
   * Mark sample as received (requester only)
   */
  static async markReceived(req: Request, res: Response) {
    try {
      const requesterId = req.user?.id;
      if (!requesterId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id: sampleRequestId } = req.params;

      if (!sampleRequestId) {
        return res.status(400).json({ error: 'Sample request ID is required' });
      }

      const updated = await SampleService.markReceived(sampleRequestId, requesterId);

      res.status(200).json({
        success: true,
        message: 'Sample marked as received',
        data: updated,
      });
    } catch (error: any) {
      console.error('[SampleController] Mark received error:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}
