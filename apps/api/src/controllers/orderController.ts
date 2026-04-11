import { Request, Response } from "express";
import prisma from "../prisma/client";
import { SocketService } from "../config/socket";

export class OrderController {
  /**
   * Get all orders for the current user (Farmer or Buyer)
   */
  public static async getAll(req: Request, res: Response) {
    try {
      const { userId, role } = (req as any).user;

      const orders = await prisma.order.findMany({
        where: role === "FARMER" ? { farmerId: userId } : { buyerId: userId },
        include: {
          product: true,
          buyer: { select: { name: true, email: true, district: true } },
          farmer: { select: { name: true, email: true, district: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({ success: true, orders });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  /**
   * Update order status with timestamps and real-time notification
   */
  public static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { userId } = (req as any).user;

      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });

      // Build update data with timestamps
      const updateData: any = { status };
      if (status === "CONFIRMED") updateData.confirmedAt = new Date();
      if (status === "SHIPPED") updateData.shippedAt = new Date();
      if (status === "DELIVERED") updateData.deliveredAt = new Date();
      if (status === "CANCELLED") updateData.cancelledAt = new Date();

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: updateData,
        include: { product: true, buyer: true, farmer: true }
      });

      // Emit real-time status update to both buyer and farmer
      const eventData = {
        orderId: id,
        status: updatedOrder.status,
        timestamp: new Date(),
        orderNumber: updatedOrder.orderNumber,
        productName: updatedOrder.product.name
      };

      SocketService.emitToUser(updatedOrder.buyerId, "order:status:updated", eventData);
      SocketService.emitToUser(updatedOrder.farmerId, "order:status:updated", eventData);
      SocketService.emitToRoom(`order:${id}`, "order:status:updated", eventData);

      res.json({ success: true, order: updatedOrder });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
