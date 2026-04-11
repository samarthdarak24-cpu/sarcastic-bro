import { Request, Response } from 'express';
import prisma from '../config/database';
import { SocketService } from '../config/socket';

export class OrderTrackingController {
  /**
   * Get all tracking events for an order
   */
  static async getTrackingEvents(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { userId, role } = (req as any).user;

      // Verify user has access to this order
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          crop: { include: { farmer: true, fpoFarmer: { include: { fpo: true } } } },
          lot: { include: { fpo: true } },
        },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Check access permissions
      const hasAccess =
        order.buyerId === userId ||
        order.crop?.farmerId === userId ||
        order.crop?.fpoFarmer?.fpo?.adminUserId === userId ||
        order.lot?.fpo?.adminUserId === userId;

      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      // Get tracking events
      const events = await prisma.orderTrackingEvent.findMany({
        where: { orderId },
        orderBy: { timestamp: 'desc' },
      });

      res.json({ success: true, events });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  /**
   * Get single order with full tracking details
   */
  static async getOrderDetails(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { userId } = (req as any).user;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          buyer: { select: { id: true, name: true, phone: true, email: true } },
          crop: {
            include: {
              farmer: { select: { id: true, name: true, phone: true, district: true } },
              fpoFarmer: { include: { fpo: { select: { id: true, name: true, adminUserId: true } } } },
            },
          },
          lot: { include: { fpo: { select: { id: true, name: true, adminUserId: true } } } },
          escrowTransaction: true,
          logistics: { include: { events: { orderBy: { timestamp: 'desc' } } } },
          trackingEvents: { orderBy: { timestamp: 'desc' } },
        },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Check access
      const hasAccess =
        order.buyerId === userId ||
        order.crop?.farmerId === userId ||
        order.crop?.fpoFarmer?.fpo?.adminUserId === userId ||
        order.lot?.fpo?.adminUserId === userId;

      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      res.json({ success: true, order });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  /**
   * Add tracking event
   */
  static async addTrackingEvent(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { userId, role } = (req as any).user;
      const { status, location, latitude, longitude, description, photos } = req.body;

      // Verify order exists and user has permission
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          buyer: true,
          crop: {
            include: {
              farmer: true,
              fpoFarmer: { include: { fpo: true } },
            },
          },
          lot: { include: { fpo: true } },
        },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Only FPO and Buyer can add tracking events
      const isFPO =
        role === 'FPO' &&
        (order.crop?.fpoFarmer?.fpo?.adminUserId === userId || order.lot?.fpo?.adminUserId === userId);
      const isBuyer = role === 'BUYER' && order.buyerId === userId;

      if (!isFPO && !isBuyer) {
        return res.status(403).json({ success: false, message: 'Only FPO and Buyer can add tracking updates' });
      }

      // Create tracking event
      const event = await prisma.orderTrackingEvent.create({
        data: {
          orderId,
          status,
          location,
          latitude,
          longitude,
          description,
          photos: photos || [],
          updatedBy: userId,
          updatedByRole: role,
        },
      });

      // Update order status if provided
      if (status) {
        const statusMap: Record<string, string> = {
          PLACED: 'PENDING',
          CONFIRMED: 'CONFIRMED',
          PACKED: 'CONFIRMED',
          PICKED_UP: 'IN_TRANSIT',
          IN_TRANSIT: 'IN_TRANSIT',
          OUT_FOR_DELIVERY: 'IN_TRANSIT',
          DELIVERED: 'DELIVERED',
        };

        if (statusMap[status]) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: statusMap[status] as any },
          });
        }
      }

      // Emit real-time update
      const eventData = {
        orderId,
        event,
        orderStatus: status,
        timestamp: new Date(),
      };

      SocketService.emitToUser(order.buyerId, 'order:tracking:updated', eventData);
      if (order.crop?.farmerId) {
        SocketService.emitToUser(order.crop.farmerId, 'order:tracking:updated', eventData);
      }
      if (order.crop?.fpoFarmer?.fpo?.adminUserId) {
        SocketService.emitToUser(order.crop.fpoFarmer.fpo.adminUserId, 'order:tracking:updated', eventData);
      }
      if (order.lot?.fpo?.adminUserId) {
        SocketService.emitToUser(order.lot.fpo.adminUserId, 'order:tracking:updated', eventData);
      }

      res.json({ success: true, event });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  /**
   * Buyer confirms delivery
   */
  static async confirmDelivery(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { userId, role } = (req as any).user;
      const { deliveryProof, deliveryNotes } = req.body;

      if (role !== 'BUYER') {
        return res.status(403).json({ success: false, message: 'Only buyers can confirm delivery' });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          escrowTransaction: true,
          crop: { include: { farmer: true, fpoFarmer: { include: { fpo: true } } } },
          lot: { include: { fpo: true } },
        },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (order.buyerId !== userId) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      if (order.confirmedByBuyer) {
        return res.status(400).json({ success: false, message: 'Delivery already confirmed' });
      }

      // Update order
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'DELIVERED',
          confirmedByBuyer: true,
          confirmedAt: new Date(),
          actualDelivery: new Date(),
          deliveryProof: deliveryProof || [],
          deliveryNotes,
        },
      });

      // Release escrow
      if (order.escrowTransaction && order.escrowTransaction.status === 'HELD') {
        await prisma.escrowTransaction.update({
          where: { id: order.escrowTransaction.id },
          data: {
            status: 'RELEASED',
            releasedAt: new Date(),
          },
        });

        // Create farmer earning record
        if (order.crop?.farmerId) {
          await prisma.farmerEarning.create({
            data: {
              farmerId: order.crop.farmerId,
              orderId,
              amount: order.totalAmount,
              status: 'COMPLETED',
              paidAt: new Date(),
            },
          });
        }
      }

      // Add tracking event
      await prisma.orderTrackingEvent.create({
        data: {
          orderId,
          status: 'DELIVERED',
          description: 'Delivery confirmed by buyer',
          updatedBy: userId,
          updatedByRole: role,
          photos: deliveryProof || [],
        },
      });

      // Emit real-time notification
      const notificationData = {
        orderId,
        status: 'DELIVERED',
        confirmedByBuyer: true,
        timestamp: new Date(),
      };

      if (order.crop?.farmerId) {
        SocketService.emitToUser(order.crop.farmerId, 'order:delivery:confirmed', notificationData);
      }
      if (order.crop?.fpoFarmer?.fpo?.adminUserId) {
        SocketService.emitToUser(order.crop.fpoFarmer.fpo.adminUserId, 'order:delivery:confirmed', notificationData);
      }
      if (order.lot?.fpo?.adminUserId) {
        SocketService.emitToUser(order.lot.fpo.adminUserId, 'order:delivery:confirmed', notificationData);
      }

      res.json({ success: true, order: updatedOrder });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
