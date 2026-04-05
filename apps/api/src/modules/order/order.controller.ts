/* ========================================================================
   Order Controller — HTTP handlers for order management
   ======================================================================== */

import type { Request, Response } from "express";
import { OrderService } from "./order.service";
import { UserService } from "../user/user.service";
import { createOrderSchema, updateOrderStatusSchema } from "./order.service";
import { sendSuccess, sendCreated, sendPaginated } from "../../utils/response";
import { getSocketService } from "../../services/socketService";

export class OrderController {
  static async create(req: Request, res: Response) {
    const data = createOrderSchema.parse(req.body);
    const order = await OrderService.create(req.user!.userId, data);
    
    // Emit real-time notification to farmer
    try {
      const socketService = getSocketService();
      socketService.emitOrderUpdate(order.farmerId, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status
      });
      socketService.emitNotification(order.farmerId, {
        type: 'ORDER',
        title: 'New Order Received',
        message: `You have a new order #${order.orderNumber}`
      });
    } catch (err) {
      console.error('Socket emission failed:', err);
    }
    
    return sendCreated(res, order, "Order placed successfully");
  }

  static async bulkCreate(req: Request, res: Response) {
    const orders = req.body.orders;
    if (!Array.isArray(orders)) {
      return sendSuccess(res, { error: "Invalid format" });
    }
    const results = await OrderService.bulkCreate(req.user!.userId, orders);
    return sendCreated(res, results, `Bulk order processed`);
  }

  static async getAll(req: Request, res: Response) {
    const { status, page = "1", limit = "20" } = req.query;
    const result = await OrderService.getAll(req.user!.userId, req.user!.role, {
      status: status as string,
      page: Number(page),
      limit: Number(limit),
    });
    return sendPaginated(res, result.orders, result.total, result.page, result.limit);
  }

  static async getById(req: Request, res: Response) {
    const order = await OrderService.getById(req.params.id, req.user!.userId);
    return sendSuccess(res, order);
  }

  static async updateStatus(req: Request, res: Response) {
    const { status } = updateOrderStatusSchema.parse(req.body);
    const order = await OrderService.updateStatus(req.params.id, req.user!.userId, status);
    
    // Emit real-time updates to both parties
    try {
      const socketService = getSocketService();
      socketService.emitOrderUpdate(order.buyerId, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status
      });
      socketService.emitOrderUpdate(order.farmerId, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status
      });
    } catch (err) {
      console.error('Socket emission failed:', err);
    }
    
    // Trigger reputation update for both parties
    if (status === 'DELIVERED' || status === 'CANCELLED') {
      await UserService.updateReputationScore(order.buyerId);
      await UserService.updateReputationScore(order.farmerId);
    }

    return sendSuccess(res, order, "Order status updated");
  }

  static async cancel(req: Request, res: Response) {
    const order = await OrderService.cancel(req.params.id, req.user!.userId);
    
    // Emit real-time cancellation notification
    try {
      const socketService = getSocketService();
      const otherUserId = order.buyerId === req.user!.userId ? order.farmerId : order.buyerId;
      socketService.emitOrderUpdate(otherUserId, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: 'CANCELLED'
      });
      socketService.emitNotification(otherUserId, {
        type: 'ORDER',
        title: 'Order Cancelled',
        message: `Order #${order.orderNumber} has been cancelled`
      });
    } catch (err) {
      console.error('Socket emission failed:', err);
    }
    
    // Trigger reputation update for both parties on cancellation
    await UserService.updateReputationScore(order.buyerId);
    await UserService.updateReputationScore(order.farmerId);

    return sendSuccess(res, order, "Order cancelled");
  }
}
