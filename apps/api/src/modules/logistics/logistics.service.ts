import prisma from '../../prisma/client';
import { ApiError } from '../../utils/ApiError';
import { SocketService } from '../../config/socket';
import { RequestPickupInput, AssignDriverInput, UpdateLocationInput, MarkDeliveredInput } from './logistics.validation';

/**
 * Logistics Service — Order-focused delivery management
 * Handles pickup requests, driver assignment, live tracking, and delivery confirmation
 */
export class LogisticsService {
  /**
   * Valid status transitions
   */
  private static validTransitions: Record<string, string[]> = {
    REQUESTED: ['ASSIGNED', 'CANCELLED'],
    ASSIGNED: ['PICKED_UP', 'CANCELLED'],
    PICKED_UP: ['IN_TRANSIT', 'CANCELLED'],
    IN_TRANSIT: ['OUT_FOR_DELIVERY', 'CANCELLED'],
    OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: [],
  };

  /**
   * Validate status transition
   */
  private static validateStatusTransition(current: string, next: string): void {
    const allowed = this.validTransitions[current];
    if (!allowed || !allowed.includes(next)) {
      throw ApiError.badRequest(`Cannot transition from ${current} to ${next}`);
    }
  }

  /**
   * Emit Socket.io event for logistics update
   */
  private static emitLogisticsUpdate(logisticsId: string, event: string, data: any): void {
    SocketService.emitToRoom(`logistics:${logisticsId}`, event, data);
  }

  /**
   * FARMER: Request pickup for an order
   */
  static async requestPickup(farmerId: string, data: RequestPickupInput) {
    // Verify order exists and belongs to farmer
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: { crop: true, lot: true },
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    // Check if order is confirmed
    if (order.status !== 'CONFIRMED') {
      throw ApiError.badRequest('Can only request pickup for confirmed orders');
    }

    // Check if logistics already exists
    const existingLogistics = await prisma.fPOLogistics.findUnique({
      where: { orderId: data.orderId },
    });

    if (existingLogistics) {
      throw ApiError.badRequest('Logistics already requested for this order');
    }

    // Get FPO ID (from crop or aggregated lot)
    const fpoId = order.crop?.fpoId;
    if (!fpoId) {
      throw ApiError.badRequest('Order must be associated with an FPO for logistics');
    }

    // Create logistics request
    const logistics = await prisma.fPOLogistics.create({
      data: {
        orderId: data.orderId,
        fpoId,
        status: 'REQUESTED',
        pickupLocation: data.pickupLocation,
        pickupLat: data.pickupLat,
        pickupLng: data.pickupLng,
        dropLocation: data.dropLocation,
        dropLat: data.dropLat,
        dropLng: data.dropLng,
        notes: data.notes,
        trackingNumber: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      },
      include: {
        order: {
          include: {
            crop: true,
            buyer: { select: { name: true, phone: true } },
          },
        },
        fpo: { select: { name: true } },
      },
    });

    // Notify FPO about new pickup request
    SocketService.emitToUser(fpoId, 'logistics:new-request', {
      logisticsId: logistics.id,
      orderId: data.orderId,
      pickupLocation: data.pickupLocation,
      timestamp: new Date(),
    });

    return logistics;
  }

  /**
   * FPO: Assign driver and vehicle to logistics
   */
  static async assignDriver(fpoId: string, data: AssignDriverInput) {
    const logistics = await prisma.fPOLogistics.findUnique({
      where: { id: data.logisticsId },
      include: { order: true },
    });

    if (!logistics) {
      throw ApiError.notFound('Logistics record not found');
    }

    if (logistics.fpoId !== fpoId) {
      throw ApiError.forbidden('Not authorized to manage this logistics');
    }

    if (logistics.status !== 'REQUESTED') {
      throw ApiError.badRequest('Can only assign driver to REQUESTED logistics');
    }

    // Update logistics with driver info
    const updated = await prisma.fPOLogistics.update({
      where: { id: data.logisticsId },
      data: {
        status: 'ASSIGNED',
        driverName: data.driverName,
        driverPhone: data.driverPhone,
        vehicleNumber: data.vehicleNumber,
        estimatedDelivery: new Date(data.estimatedDelivery),
        assignedAt: new Date(),
        notes: data.notes || logistics.notes,
      },
      include: {
        order: {
          include: {
            buyer: { select: { name: true, phone: true, email: true } },
          },
        },
      },
    });

    // Create logistics event
    await prisma.logisticsEvent.create({
      data: {
        logisticsId: data.logisticsId,
        status: 'ASSIGNED',
        description: `Driver ${data.driverName} assigned (${data.vehicleNumber})`,
      },
    });

    // Notify farmer and buyer
    const farmerId = updated.order.crop?.farmerId;
    if (farmerId) {
      SocketService.emitToUser(farmerId, 'logistics:driver-assigned', {
        logisticsId: data.logisticsId,
        driverName: data.driverName,
        vehicleNumber: data.vehicleNumber,
        timestamp: new Date(),
      });
    }

    SocketService.emitToUser(updated.order.buyerId, 'logistics:driver-assigned', {
      logisticsId: data.logisticsId,
      driverName: data.driverName,
      estimatedDelivery: data.estimatedDelivery,
      timestamp: new Date(),
    });

    // Emit to logistics room
    this.emitLogisticsUpdate(data.logisticsId, 'logistics:status-updated', {
      status: 'ASSIGNED',
      driverName: data.driverName,
      vehicleNumber: data.vehicleNumber,
      timestamp: new Date(),
    });

    return updated;
  }

  /**
   * Get logistics by order ID (role-based access)
   */
  static async getLogisticsByOrder(orderId: string, userId: string, role: string) {
    const logistics = await prisma.fPOLogistics.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            crop: true,
            buyer: { select: { id: true, name: true, phone: true } },
          },
        },
        fpo: { select: { id: true, name: true } },
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!logistics) {
      throw ApiError.notFound('Logistics not found for this order');
    }

    // Role-based access control
    const order = logistics.order;
    const isBuyer = order.buyerId === userId;
    const isFarmer = order.crop?.farmerId === userId;
    const isFPO = logistics.fpoId === userId;

    if (!isBuyer && !isFarmer && !isFPO) {
      throw ApiError.forbidden('Not authorized to view this logistics');
    }

    return logistics;
  }

  /**
   * Update driver location (live tracking)
   */
  static async updateLocation(userId: string, role: string, data: UpdateLocationInput) {
    const logistics = await prisma.fPOLogistics.findUnique({
      where: { id: data.logisticsId },
      include: { order: true },
    });

    if (!logistics) {
      throw ApiError.notFound('Logistics not found');
    }

    // Only allow updates if logistics is in active status
    const activeStatuses = ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'];
    if (!activeStatuses.includes(logistics.status)) {
      throw ApiError.badRequest('Cannot update location for inactive logistics');
    }

    // Build update data
    const updateData: any = {
      currentLat: data.lat,
      currentLng: data.lng,
    };

    // If status is provided, validate and update
    if (data.status) {
      this.validateStatusTransition(logistics.status, data.status);
      updateData.status = data.status;

      // Set timestamp for status
      if (data.status === 'PICKED_UP') updateData.pickedUpAt = new Date();
      if (data.status === 'IN_TRANSIT') updateData.inTransitAt = new Date();
      if (data.status === 'OUT_FOR_DELIVERY') updateData.outForDeliveryAt = new Date();
    }

    const updated = await prisma.fPOLogistics.update({
      where: { id: data.logisticsId },
      data: updateData,
    });

    // Create logistics event
    await prisma.logisticsEvent.create({
      data: {
        logisticsId: data.logisticsId,
        status: data.status || logistics.status,
        location: `Lat: ${data.lat}, Lng: ${data.lng}`,
        description: data.status ? `Status updated to ${data.status}` : 'Location updated',
      },
    });

    // Emit real-time location update
    this.emitLogisticsUpdate(data.logisticsId, 'logistics:location-updated', {
      lat: data.lat,
      lng: data.lng,
      status: data.status || logistics.status,
      timestamp: new Date(),
    });

    // If status changed, emit status update
    if (data.status) {
      this.emitLogisticsUpdate(data.logisticsId, 'logistics:status-updated', {
        status: data.status,
        timestamp: new Date(),
      });

      // Notify buyer
      SocketService.emitToUser(logistics.order.buyerId, 'logistics:status-updated', {
        logisticsId: data.logisticsId,
        status: data.status,
        timestamp: new Date(),
      });
    }

    return updated;
  }

  /**
   * Mark logistics as delivered (triggers escrow release)
   */
  static async markDelivered(userId: string, role: string, data: MarkDeliveredInput) {
    const logistics = await prisma.fPOLogistics.findUnique({
      where: { id: data.logisticsId },
      include: {
        order: {
          include: {
            escrowTransaction: true,
          },
        },
      },
    });

    if (!logistics) {
      throw ApiError.notFound('Logistics not found');
    }

    // Validate status
    if (!['IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(logistics.status)) {
      throw ApiError.badRequest('Can only mark delivery for active shipments');
    }

    // Update logistics
    const updated = await prisma.fPOLogistics.update({
      where: { id: data.logisticsId },
      data: {
        status: 'DELIVERED',
        actualDelivery: new Date(),
        deliveryProof: data.deliveryProof || [],
        deliveryNotes: data.deliveryNotes,
      },
    });

    // Create logistics event
    await prisma.logisticsEvent.create({
      data: {
        logisticsId: data.logisticsId,
        status: 'DELIVERED',
        description: 'Package delivered successfully',
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: logistics.orderId },
      data: {
        status: 'DELIVERED',
        actualDelivery: new Date(),
        confirmedByBuyer: true,
        confirmedAt: new Date(),
        deliveryProof: data.deliveryProof || [],
        deliveryNotes: data.deliveryNotes,
      },
    });

    // Release escrow if exists
    if (logistics.order.escrowTransaction && logistics.order.escrowTransaction.status === 'HELD') {
      await prisma.escrowTransaction.update({
        where: { id: logistics.order.escrowTransaction.id },
        data: {
          status: 'RELEASED',
          releasedAt: new Date(),
        },
      });

      // TODO: Trigger wallet credit to farmer/FPO
      // This would be handled by a separate payment service
    }

    // Emit delivery completion event
    this.emitLogisticsUpdate(data.logisticsId, 'logistics:delivery-completed', {
      logisticsId: data.logisticsId,
      orderId: logistics.orderId,
      deliveredAt: new Date(),
      escrowReleased: !!logistics.order.escrowTransaction,
    });

    // Notify all parties
    const farmerId = logistics.order.crop?.farmerId;
    if (farmerId) {
      SocketService.emitToUser(farmerId, 'logistics:delivered', {
        logisticsId: data.logisticsId,
        orderId: logistics.orderId,
        timestamp: new Date(),
      });
    }

    SocketService.emitToUser(logistics.order.buyerId, 'logistics:delivered', {
      logisticsId: data.logisticsId,
      orderId: logistics.orderId,
      escrowReleased: !!logistics.order.escrowTransaction,
      timestamp: new Date(),
    });

    return updated;
  }

  /**
   * Get all logistics for FPO dashboard
   */
  static async getFPOLogistics(fpoId: string, status?: string) {
    return prisma.fPOLogistics.findMany({
      where: {
        fpoId,
        ...(status && { status: status as any }),
      },
      include: {
        order: {
          include: {
            crop: { select: { cropName: true, variety: true, quantity: true } },
            buyer: { select: { name: true, phone: true, district: true } },
          },
        },
        events: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Get farmer's active logistics
   */
  static async getFarmerLogistics(farmerId: string) {
    return prisma.fPOLogistics.findMany({
      where: {
        order: {
          crop: {
            farmerId,
          },
        },
      },
      include: {
        order: {
          include: {
            crop: true,
            buyer: { select: { name: true } },
          },
        },
        events: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Get buyer's incoming deliveries
   */
  static async getBuyerLogistics(buyerId: string) {
    return prisma.fPOLogistics.findMany({
      where: {
        order: {
          buyerId,
        },
      },
      include: {
        order: {
          include: {
            crop: { select: { cropName: true, variety: true, quantity: true } },
          },
        },
        events: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Cancel logistics (with reason)
   */
  static async cancelLogistics(logisticsId: string, reason: string, userId: string, role: string) {
    const logistics = await prisma.fPOLogistics.findUnique({
      where: { id: logisticsId },
      include: { order: true },
    });

    if (!logistics) {
      throw ApiError.notFound('Logistics not found');
    }

    this.validateStatusTransition(logistics.status, 'CANCELLED');

    const updated = await prisma.fPOLogistics.update({
      where: { id: logisticsId },
      data: {
        status: 'CANCELLED',
        notes: `${logistics.notes || ''}\n[Cancelled: ${reason}]`,
      },
    });

    // Create event
    await prisma.logisticsEvent.create({
      data: {
        logisticsId,
        status: 'CANCELLED',
        description: `Cancelled: ${reason}`,
      },
    });

    // Update order status back to CONFIRMED
    await prisma.order.update({
      where: { id: logistics.orderId },
      data: { status: 'CONFIRMED' },
    });

    // Emit cancellation event
    this.emitLogisticsUpdate(logisticsId, 'logistics:cancelled', {
      logisticsId,
      reason,
      timestamp: new Date(),
    });

    return updated;
  }
}
