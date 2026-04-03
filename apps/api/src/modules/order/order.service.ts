/* ========================================================================
   Order Service — Business logic for orders + bulk CSV
   ======================================================================== */

import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import { SocketService } from "../../config/socket";
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
  static async create(buyerId: string, data: z.infer<typeof createOrderSchema>) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { farmer: { select: { id: true } } },
    });

    if (!product || !product.isActive) throw ApiError.notFound("Product not found or unavailable");
    if (product.quantity < data.quantity) throw ApiError.badRequest("Insufficient product quantity");

    const totalPrice = product.price * data.quantity;
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock
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
          product: { select: { id: true, name: true, price: true } },
          farmer: { select: { id: true, name: true, reputationScore: true, kycStatus: true } },
          buyer: { select: { id: true, name: true, reputationScore: true, kycStatus: true } },
        },
      });
    });

    // Create notification for farmer
    await prisma.notification.create({
      data: {
        userId: product.farmerId,
        type: "ORDER",
        title: "New Order Received",
        message: `You received an order for ${data.quantity} kg of ${product.name}`,
        metadata: JSON.stringify({ orderId: order.id }),
      },
    });

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

    return { orders, total, page, limit };
  }

  static async getById(id: string, userId: string) {
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

    return order;
  }

  static async updateStatus(id: string, userId: string, status: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw ApiError.notFound("Order not found");
    if (order.farmerId !== userId && order.buyerId !== userId) {
      throw ApiError.forbidden("You can't update this order");
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
        farmer: { select: { id: true, name: true, email: true } },
        buyer: { select: { id: true, name: true, email: true } },
      },
    });

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
    const socketData = {
      orderId: id,
      status: updated.status,
      timestamp: new Date(),
      orderNumber: updated.orderNumber,
      productName: updated.product.name
    };

    SocketService.emitToUser(updated.buyerId, "order:status:updated", socketData);
    SocketService.emitToUser(updated.farmerId, "order:status:updated", socketData);
    SocketService.emitToRoom(`order:${id}`, "order:status:updated", socketData);

    return updated;
  }

  static async cancel(id: string, userId: string) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw ApiError.notFound("Order not found");
    if (order.buyerId !== userId) {
      throw ApiError.forbidden("Only buyer can cancel order");
    }
    if (["SHIPPED", "DELIVERED"].includes(order.status)) {
      throw ApiError.badRequest("Cannot cancel shipped/delivered order");
    }

    // Restore product quantity
    await prisma.product.update({
      where: { id: order.productId },
      data: { quantity: { increment: order.quantity } },
    });

    const updated = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED", cancelledAt: new Date() },
      include: { product: { select: { name: true } } }
    });

    // Notify farmer
    await prisma.notification.create({
      data: {
        userId: order.farmerId,
        type: "ORDER",
        title: "Order Cancelled",
        message: `Order #${order.orderNumber} has been cancelled`,
        metadata: JSON.stringify({ orderId: id }),
      },
    });

    return updated;
  }
}
