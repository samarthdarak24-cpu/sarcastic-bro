/* ========================================================================
   Order Service — Business logic for orders with Redis caching
   ======================================================================== */

import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import { getSocketService } from "../../services/socketService";
import { redis } from "../../services/redis.service";
import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().positive(),
  shippingAddress: z.string().min(1).optional(),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "IN_TRANSIT", "DELIVERED", "CANCELLED"]),
});

export const bulkOrderSchema = z.array(
  z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    notes: z.string().optional(),
  })
);

export class OrderService {
  private static readonly CACHE_TTL = 180; // 3 minutes

  static async create(buyerId: string, data: z.infer<typeof createOrderSchema>) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { farmer: { select: { id: true, name: true } } },
    });

    if (!product || !product.isActive) throw ApiError.notFound("Product not found or unavailable");
    if (product.quantity < data.quantity) throw ApiError.badRequest("Insufficient product quantity");

    const totalPrice = product.price * data.quantity;
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock atomically
      await tx.product.update({
        where: { id: data.productId },
        data: { quantity: { decrement: data.quantity } },
      });

      return tx.order.create({
        data: {
          orderNumber,
          buyerId,
          farmerId: product.farmerId,
          productId: data.productId,
          quantity: data.quantity,
          totalPrice,
          shippingAddress: data.shippingAddress,
          notes: data.notes,
        },
        include: {
          product: { select: { id: true, name: true, price: true, unit: true } },
          farmer: { select: { id: true, name: true, reputationScore: true, kycStatus: true } },
          buyer: { select: { id: true, name: true, reputationScore: true, kycStatus: true } },
        },
      });
    });

    // Invalidate caches
    await redis.delPattern(`orders:*:${buyerId}`);
    await redis.delPattern(`orders:*:${product.farmerId}`);
    await redis.del(`product:${data.productId}`);

    // Create notification for farmer
    await prisma.notification.create({
      data: {
        userId: product.farmerId,
        type: "ORDER",
        title: "New Order Received",
        message: `You received an order for ${data.quantity} ${product.unit} of ${product.name}`,
        metadata: JSON.stringify({ orderId: order.id }),
      },
    });

    // Real-time socket notification to Farmer
    try {
      const socketService = getSocketService();
      socketService.emitOrderUpdate(product.farmerId, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
      });
      socketService.emitNotification(product.farmerId, {
        type: "ORDER",
        title: "New Order Received",
        message: `${order.buyer.name} ordered ${data.quantity} ${product.unit} of ${product.name}`,
        metadata: { orderId: order.id, totalPrice: order.totalPrice },
      });
    } catch (err) {
      console.warn("[Socket] Notification failed for new order:", err);
    }

    return order;
  }


  static async bulkCreate(buyerId: string, orders: z.infer<typeof bulkOrderSchema>) {
    const results = [];
    for (const orderData of orders) {
      try {
        const order = await this.create(buyerId, {
          productId: orderData.productId,
          quantity: orderData.quantity,
          notes: orderData.notes,
        });
        results.push({ success: true, order });
      } catch (err: any) {
        results.push({ success: false, productId: orderData.productId, error: err.message });
      }
    }
    return results;
  }

  static async getAll(userId: string, role: string, filters?: { status?: string; page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = role === "FARMER" ? { farmerId: userId } : { buyerId: userId };
    if (filters?.status) where.status = filters.status;

    // Generate cache key
    const cacheKey = `orders:${role}:${userId}:${JSON.stringify(filters || {})}`;

    // Try cache first
    const cached = await redis.get<{ orders: any[]; total: number }>(cacheKey);
    if (cached) {
      return { ...cached, page, limit };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          product: { select: { id: true, name: true, price: true, unit: true, imageUrls: true } },
          farmer: { select: { id: true, name: true, reputationScore: true, kycStatus: true } },
          buyer: { select: { id: true, name: true, reputationScore: true, kycStatus: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    // Cache the result
    await redis.set(cacheKey, { orders, total }, this.CACHE_TTL);

    return { orders, total, page, limit };
  }

  static async getById(id: string, userId: string) {
    // Try cache first
    const cacheKey = `order:${id}`;
    const cached = await redis.get<any>(cacheKey);
    if (cached) {
      // Verify access
      if (cached.buyerId !== userId && cached.farmerId !== userId) {
        throw ApiError.forbidden("You don't have access to this order");
      }
      return cached;
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        product: true,
        farmer: { select: { id: true, name: true, email: true, phone: true, district: true, reputationScore: true, kycStatus: true } },
        buyer: { select: { id: true, name: true, email: true, phone: true, reputationScore: true, kycStatus: true } },
        logistics: true,
      },
    });

    if (!order) throw ApiError.notFound("Order not found");
    if (order.buyerId !== userId && order.farmerId !== userId) {
      throw ApiError.forbidden("You don't have access to this order");
    }

    // Cache the order
    await redis.set(cacheKey, order, this.CACHE_TTL);

    return order;
  }

  static async updateStatus(id: string, userId: string, status: string) {
    const order = await prisma.order.findUnique({ 
      where: { id },
      include: {
        farmer: { select: { id: true, district: true, state: true } }
      }
    });
    if (!order) throw ApiError.notFound("Order not found");
    if (order.farmerId !== userId && order.buyerId !== userId) {
      throw ApiError.forbidden("You can't update this order");
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["PROCESSING", "CANCELLED"],
      PROCESSING: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["IN_TRANSIT"],
      IN_TRANSIT: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw ApiError.badRequest(`Cannot transition from ${order.status} to ${status}`);
    }

    // Build update data with timestamps
    const updateData: any = { status };
    if (status === "CONFIRMED") updateData.confirmedAt = new Date();
    if (status === "SHIPPED") updateData.shippedAt = new Date();
    if (status === "DELIVERED") updateData.deliveredAt = new Date();
    if (status === "CANCELLED") updateData.cancelledAt = new Date();

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        product: { select: { id: true, name: true } },
        farmer: { select: { id: true, name: true, email: true, district: true, state: true } },
        buyer: { select: { id: true, name: true, email: true } },
      },
    });

    // Add blockchain trace events for LOGISTICS and DELIVERED
    if (status === "SHIPPED" || status === "DELIVERED") {
      try {
        const BlockchainTraceService = (await import('../blockchain-trace/blockchain-trace.service')).default;
        
        if (status === "SHIPPED") {
          await BlockchainTraceService.addTraceEvent({
            productId: order.productId,
            farmerId: order.farmerId,
            eventType: 'LOGISTICS',
            location: `${updated.farmer.district}, ${updated.farmer.state}`,
            metadata: {
              orderId: order.id,
              orderNumber: order.orderNumber,
              trackingNumber: order.trackingNumber || 'N/A',
              quantity: order.quantity,
              destination: order.shippingAddress || 'N/A',
              shippedAt: updateData.shippedAt
            }
          });
        } else if (status === "DELIVERED") {
          await BlockchainTraceService.addTraceEvent({
            productId: order.productId,
            farmerId: order.farmerId,
            eventType: 'DELIVERED',
            location: order.shippingAddress || 'Delivery Location',
            metadata: {
              orderId: order.id,
              orderNumber: order.orderNumber,
              quantity: order.quantity,
              deliveredAt: updateData.deliveredAt,
              buyerName: updated.buyer.name
            }
          });
        }
      } catch (traceError) {
        console.warn('[Order Service] Blockchain trace event failed:', traceError);
      }
    }

    // Create audit log for detailed history
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action: "UPDATE",
          entity: "ORDER",
          entityId: id,
          changes: JSON.stringify({
            previousStatus: order.status,
            newStatus: status,
            timestamp: new Date()
          })
        }
      });
    } catch (auditError) {
      console.warn('[Order Service] Audit log failed:', auditError);
    }

    // Invalidate caches
    await redis.del(`order:${id}`);
    await redis.delPattern(`orders:*:${updated.buyerId}`);
    await redis.delPattern(`orders:*:${updated.farmerId}`);

    // Notify other party
    const notifiedUserId = userId === updated.buyerId ? updated.farmerId : updated.buyerId;
    await prisma.notification.create({
      data: {
        userId: notifiedUserId,
        type: "ORDER",
        title: `Order ${status}`,
        message: `Order #${updated.orderNumber} status changed to ${status}`,
        metadata: JSON.stringify({ orderId: id }),
      },
    });

    // Real-time notification
    try {
      const socketService = getSocketService();
      const socketData = {
        orderId: id,
        orderNumber: updated.orderNumber,
        status: updated.status,
      };

      socketService.emitOrderUpdate(updated.buyerId, socketData);
      socketService.emitOrderUpdate(updated.farmerId, socketData);
      
      socketService.emitNotification(notifiedUserId, {
        type: "ORDER",
        title: `Order ${status}`,
        message: `Order #${updated.orderNumber} is now ${status}`,
        metadata: { orderId: id },
      });
    } catch (err) {
      console.warn("[Socket] Order status update emission failed:", err);
    }

    return updated;
  }

  static async getHistory(id: string, userId: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw ApiError.notFound("Order not found");
    if (order.buyerId !== userId && order.farmerId !== userId) {
      throw ApiError.forbidden("Access denied");
    }

    const logs = await prisma.auditLog.findMany({
      where: { entity: "ORDER", entityId: id },
      orderBy: { createdAt: "desc" }
    });

    return logs.map(log => ({
      id: log.id,
      action: log.action,
      timestamp: log.createdAt,
      details: JSON.parse(log.changes || "{}")
    }));
  }

  static async cancel(id: string, userId: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw ApiError.notFound("Order not found");
    
    // Allow both buyer and farmer to cancel
    if (order.buyerId !== userId && order.farmerId !== userId) {
      throw ApiError.forbidden("You don't have permission to cancel this order");
    }

    if (["SHIPPED", "IN_TRANSIT", "DELIVERED"].includes(order.status)) {
      throw ApiError.badRequest("Cannot cancel shipped/delivered order");
    }

    // Restore product quantity atomically
    const updated = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: order.productId },
        data: { quantity: { increment: order.quantity } },
      });

      return tx.order.update({
        where: { id },
        data: { status: "CANCELLED", cancelledAt: new Date() },
        include: { 
          product: { select: { name: true, unit: true } },
          farmer: { select: { id: true, name: true } },
          buyer: { select: { id: true, name: true } },
        }
      });
    });

    // Invalidate caches
    await redis.del(`order:${id}`);
    await redis.del(`product:${order.productId}`);
    await redis.delPattern(`orders:*:${order.buyerId}`);
    await redis.delPattern(`orders:*:${order.farmerId}`);

    // Notify the other party
    const notifiedUserId = userId === order.buyerId ? order.farmerId : order.buyerId;
    const cancellerName = userId === order.buyerId ? updated.buyer.name : updated.farmer.name;

    await prisma.notification.create({
      data: {
        userId: notifiedUserId,
        type: "ORDER",
        title: "Order Cancelled",
        message: `Order #${order.orderNumber} has been cancelled by ${cancellerName}`,
        metadata: JSON.stringify({ orderId: id }),
      },
    });

    // Real-time notification
    try {
      const socketService = getSocketService();
      // Notify BOTH parties so UI updates everywhere
      const socketData = {
        orderId: id,
        orderNumber: order.orderNumber,
        status: "CANCELLED",
      };
      
      socketService.emitOrderUpdate(order.buyerId, socketData);
      socketService.emitOrderUpdate(order.farmerId, socketData);

      socketService.emitNotification(notifiedUserId, {
        type: "ORDER",
        title: "Order Cancelled",
        message: `Order #${order.orderNumber} was cancelled`,
        metadata: { orderId: id },
      });
    } catch (err) {
      console.warn("[Socket] Order cancellation notification failed:", err);
    }

    return updated;
  }

  static async bulkStatusUpdate(userId: string, orderIds: string[], status: string) {
    const results = [];
    for (const id of orderIds) {
      try {
        const order = await this.updateStatus(id, userId, status);
        results.push({ id, success: true, status: order.status });
      } catch (err: any) {
        results.push({ id, success: false, error: err.message });
      }
    }
    return results;
  }

  static async getStats(userId: string, role: string) {
    const where: any = role === "FARMER" ? { farmerId: userId } : { buyerId: userId };
    
    const [total, pending, confirmed, processing, shipped, inTransit, delivered, cancelled, revenue] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.count({ where: { ...where, status: "PENDING" } }),
      prisma.order.count({ where: { ...where, status: "CONFIRMED" } }),
      prisma.order.count({ where: { ...where, status: "PROCESSING" } }),
      prisma.order.count({ where: { ...where, status: "SHIPPED" } }),
      prisma.order.count({ where: { ...where, status: "IN_TRANSIT" } }),
      prisma.order.count({ where: { ...where, status: "DELIVERED" } }),
      prisma.order.count({ where: { ...where, status: "CANCELLED" } }),
      prisma.order.aggregate({
        where: { ...where, status: "DELIVERED" },
        _sum: { totalPrice: true }
      })
    ]);

    return {
      total,
      pending,
      confirmed,
      processing,
      shipped,
      inTransit,
      delivered,
      cancelled,
      totalRevenue: revenue._sum.totalPrice || 0
    };
  }
}
