// ========================================================================
// Logistics Controller
// Handles shipment tracking, status updates, and events
// ========================================================================

import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export class LogisticsController {
  /**
   * Create logistics entry for an order (FPO only)
   * POST /api/logistics
   */
  static async createLogistics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { orderId, carrier, trackingNumber, estimatedDelivery, notes } = req.body;
      const userId = req.user!.id;

      // Ensure FPO exists for this user
      const fpo = await prisma.fPO.findUnique({
        where: { adminUserId: userId }
      });

      if (!fpo) {
        return res.status(403).json({ success: false, error: 'Only FPO admin can create logistics' });
      }

      // Ensure order exists and belongs to this FPO
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { lot: true, crop: true }
      });

      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      // Check if order is associated with this FPO
      const isFPOOrder = (order.lot && order.lot.fpoId === fpo.id) || (order.crop && order.crop.fpoId === fpo.id);
      if (!isFPOOrder) {
        return res.status(403).json({ success: false, error: 'Access denied to this order' });
      }

      // Check if logistics already exists
      const existing = await prisma.fPOLogistics.findUnique({
        where: { orderId }
      });

      if (existing) {
        return res.status(400).json({ success: false, error: 'Logistics already initialized for this order' });
      }

      const logistics = await prisma.fPOLogistics.create({
        data: {
          orderId,
          fpoId: fpo.id,
          carrier,
          trackingNumber,
          estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
          notes,
          status: 'PENDING',
          events: {
            create: {
              status: 'PENDING',
              description: 'Logistics information initialized'
            }
          }
        },
        include: { events: true }
      });

      // Update order status if it's currently PENDING or CONFIRMED
      if (order.status === 'PENDING' || order.status === 'CONFIRMED') {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'CONFIRMED' }
        });
      }

      res.status(201).json({ success: true, data: logistics });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update logistics status (FPO only)
   * PATCH /api/logistics/:id
   */
  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, currentLocation, description, notes } = req.body;
      const userId = req.user!.id;

      const logistics = await prisma.fPOLogistics.findUnique({
        where: { id },
        include: { fpo: true, order: true }
      });

      if (!logistics) {
        return res.status(404).json({ success: false, error: 'Logistics not found' });
      }

      if (logistics.fpo.adminUserId !== userId) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }

      const updateData: any = {
        status,
        currentLocation,
        notes: notes || logistics.notes,
        updatedAt: new Date()
      };

      if (status === 'DELIVERED') {
        updateData.actualDelivery = new Date();
      }

      const updatedLogistics = await prisma.fPOLogistics.update({
        where: { id },
        data: {
          ...updateData,
          events: {
            create: {
              status,
              location: currentLocation,
              description: description || `Status updated to ${status}`
            }
          }
        },
        include: { events: true }
      });

      // Synchronize Order status
      let orderStatus: any = undefined;
      if (status === 'IN_TRANSIT') orderStatus = 'IN_TRANSIT';
      if (status === 'DELIVERED') orderStatus = 'DELIVERED';

      if (orderStatus) {
        await prisma.order.update({
          where: { id: logistics.orderId },
          data: { status: orderStatus }
        });
      }

      // Notify Buyer via Socket
      const io = req.app.get('io');
      if (io) {
        io.to(`user:${logistics.order.buyerId}`).emit('notification', {
          title: `Order ${status}`,
          message: `Your shipment for order ${logistics.orderId.substring(0,8)} is now ${status.toLowerCase()}.`,
          type: 'LOGISTICS_UPDATE',
          orderId: logistics.orderId,
          status,
          timestamp: new Date()
        });
      }

      res.json({ success: true, data: updatedLogistics });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get logistics details for an order
   * GET /api/logistics/order/:orderId
   */
  static async getByOrderId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const userId = req.user!.id;
      const role = req.user!.role;

      const logistics = await prisma.fPOLogistics.findUnique({
        where: { orderId },
        include: {
          events: { orderBy: { timestamp: 'desc' } },
          order: {
            include: {
              buyer: { select: { name: true, phone: true } },
              lot: true,
              crop: true
            }
          },
          fpo: true
        }
      });

      if (!logistics) {
        return res.status(404).json({ success: false, error: 'No logistics information found for this order' });
      }

      // Check access
      const isAuthorized = 
        (role === 'FPO' && logistics.fpo.adminUserId === userId) ||
        (role === 'BUYER' && logistics.order.buyerId === userId) ||
        (role === 'FARMER' && (
          (logistics.order.crop && logistics.order.crop.farmerId === userId) ||
          (logistics.order.lot && await prisma.crop.findFirst({ where: { aggregatedLotId: logistics.order.lot.id, farmerId: userId } }))
        ));

      if (!isAuthorized) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }

      res.json({ success: true, data: logistics });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all active logistics for the current user's role
   * GET /api/logistics/active
   */
  static async getActiveLogistics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const role = req.user!.role;

      let where: any = {};

      if (role === 'FPO') {
        const fpo = await prisma.fPO.findUnique({ where: { adminUserId: userId } });
        if (!fpo) return res.status(404).json({ success: false, error: 'FPO not found' });
        where = { fpoId: fpo.id, status: { not: 'DELIVERED' } };
      } else if (role === 'BUYER') {
        where = { order: { buyerId: userId }, status: { not: 'DELIVERED' } };
      } else if (role === 'FARMER') {
        where = {
          order: {
            OR: [
              { crop: { farmerId: userId } },
              { lot: { crops: { some: { farmerId: userId } } } }
            ]
          },
          status: { not: 'DELIVERED' }
        };
      }

      const logistics = await prisma.fPOLogistics.findMany({
        where,
        include: {
          order: {
            include: {
              crop: true,
              lot: true
            }
          },
          fpo: true
        },
        orderBy: { updatedAt: 'desc' }
      });

      res.json({ success: true, data: logistics });
    } catch (error) {
      next(error);
    }
  }
}
