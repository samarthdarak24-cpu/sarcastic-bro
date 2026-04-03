import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";
import type { BookShipmentInput, UpdateShipmentStatusInput, ListShipmentsInput } from "./logistics.validation";

export class LogisticsService {
  static async bookShipment(userId: string, data: BookShipmentInput) {
    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: {
        farmer: { select: { id: true, name: true, email: true } },
        buyer: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) throw ApiError.notFound("Order not found");

    // Verify user is farmer or buyer in this order
    if (userId !== order.farmerId && userId !== order.buyerId) {
      throw ApiError.forbidden("You cannot book shipment for this order");
    }

    // Create logistics record
    const shipment = await prisma.logistics.create({
      data: {
        orderId: data.orderId,
        provider: data.provider,
        status: "PENDING",
        fromLocation: data.fromLocation,
        toLocation: data.toLocation,
        estimatedDeliveryDate: data.estimatedDeliveryDate ? new Date(data.estimatedDeliveryDate) : null,
        temperature: data.temperature,
        humidity: data.humidity,
      },
      include: {
        order: { select: { orderNumber: true } },
      },
    });

    // Create notifications
    const otherUserId = userId === order.farmerId ? order.buyerId : order.farmerId;
    const senderName = userId === order.farmerId ? order.farmer?.name : order.buyer?.name;

    await prisma.notification.create({
      data: {
        userId: otherUserId,
        type: "ORDER",
        title: "Shipment Booked",
        message: `${senderName} booked shipment with ${data.provider}`,
        metadata: JSON.stringify({ orderId: order.id, shipmentId: shipment.id }),
      },
    });

    return shipment;
  }

  static async getShipmentById(userId: string, shipmentId: string) {
    const shipment = await prisma.logistics.findUnique({
      where: { id: shipmentId },
      include: {
        order: {
          include: {
            farmer: { select: { id: true, name: true } },
            buyer: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!shipment) throw ApiError.notFound("Shipment not found");

    // Verify access
    if (userId !== shipment.order.farmerId && userId !== shipment.order.buyerId) {
      throw ApiError.forbidden("You don't have access to this shipment");
    }

    return shipment;
  }

  static async listMyShipments(userId: string, filters: ListShipmentsInput) {
    const { page, limit, status, provider, sort, order: orderDir } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      order: {
        OR: [{ farmerId: userId }, { buyerId: userId }],
      },
    };

    if (status) where.status = status;
    if (provider) where.provider = { contains: provider, mode: "insensitive" };

    const [shipments, total] = await Promise.all([
      prisma.logistics.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: orderDir },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
              farmer: { select: { name: true } },
              buyer: { select: { name: true } },
            },
          },
        },
      }),
      prisma.logistics.count({ where }),
    ]);

    return {
      shipments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async updateShipmentStatus(userId: string, shipmentId: string, data: UpdateShipmentStatusInput) {
    const shipment = await this.getShipmentById(userId, shipmentId);

    const updated = await prisma.logistics.update({
      where: { id: shipmentId },
      data: {
        status: data.status,
        ...(data.trackingId && { trackingId: data.trackingId }),
        ...(data.temperature !== undefined && { temperature: data.temperature }),
        ...(data.humidity !== undefined && { humidity: data.humidity }),
        ...(data.notes && { notes: data.notes }),
        updatedAt: new Date(),
      },
      include: {
        order: {
          include: {
            farmer: { select: { id: true, name: true } },
            buyer: { select: { id: true, name: true } },
          },
        },
      },
    });

    // Notify the other party
    const otherUserId = userId === shipment.order.farmerId ? shipment.order.buyerId : shipment.order.farmerId;
    const senderName = userId === shipment.order.farmerId ? shipment.order.farmer?.name : shipment.order.buyer?.name;

    await prisma.notification.create({
      data: {
        userId: otherUserId,
        type: "ORDER",
        title: `Shipment ${data.status}`,
        message: `Shipment status updated to ${data.status}`,
        metadata: JSON.stringify({ shipmentId, status: data.status }),
      },
    });

    // If delivered, update order status too
    if (data.status === "DELIVERED") {
      await prisma.order.update({
        where: { id: shipment.order.id },
        data: { status: "DELIVERED" },
      });
    }

    return updated;
  }

  static async getShipmentTracking(trackingId: string) {
    const shipment = await prisma.logistics.findFirst({
      where: { trackingId },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            product: { select: { name: true } },
          },
        },
      },
    });

    if (!shipment) throw ApiError.notFound("Shipment not found");

    return shipment;
  }
}
