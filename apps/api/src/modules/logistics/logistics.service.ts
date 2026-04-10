/* ========================================================================
   Logistics Service — Warehouse & Fulfillment Logic
   ======================================================================== */

import prisma from "../../prisma/client";
import { ApiError } from "../../utils/ApiError";

export class LogisticsService {
  /**
   * Warehouse Management
   */
  static async createWarehouse(ownerId: string, data: any) {
    return prisma.warehouse.create({
      data: {
        ...data,
        ownerId,
      },
    });
  }

  static async getWarehouses(ownerId: string) {
    return prisma.warehouse.findMany({
      where: { ownerId },
      include: {
        _count: {
          select: { logs: true }
        }
      }
    });
  }

  static async getWarehouseDetails(id: string, ownerId: string) {
    const warehouse = await prisma.warehouse.findFirst({
      where: { id, ownerId },
      include: {
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });
    if (!warehouse) throw ApiError.notFound("Warehouse not found");
    return warehouse;
  }

  /**
   * Shipment / Fulfillment
   */
  static async createShipment(data: any) {
    return prisma.shipment.create({
      data: {
        ...data,
        trackingId: `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      },
    });
  }

  static async getShipments(ownerId: string) {
    // Shipments where the user is either the farmer or there's a link to their orders
    return prisma.shipment.findMany({
      where: {
        order: {
          OR: [
            { farmerId: ownerId },
            { buyerId: ownerId }
          ]
        }
      },
      include: {
        order: {
          include: {
            product: true,
            farmer: { select: { name: true, district: true } },
            buyer: { select: { name: true, district: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  static async updateShipmentStatus(id: string, status: string, location?: string) {
    return prisma.shipment.update({
      where: { id },
      data: { 
        status,
        ...(location && { destination: location }) // Update current position if tracking
      }
    });
  }

  /**
   * Market Price Index (Mandi Rates)
   */
  static async getMarketPrices(district?: string, cropName?: string) {
    return prisma.marketPrice.findMany({
      where: {
        ...(district && { district }),
        ...(cropName && { cropName })
      },
      orderBy: { date: 'desc' },
      take: 20
    });
  }

  static async seedMarketPrices(prices: any[]) {
    // Used to simulate/feed live market data
    return prisma.marketPrice.createMany({
      data: prices
    });
  }

  /**
   * Analytics & Optimization
   */
  static async getLogisticsOverview(ownerId: string) {
    const warehouses = await prisma.warehouse.findMany({ where: { ownerId } });
    const shipments = await prisma.shipment.findMany({
      where: {
        order: { OR: [{ farmerId: ownerId }, { buyerId: ownerId }] }
      }
    });

    const totalCapacity = warehouses.reduce((acc, w) => acc + w.capacity, 0);
    const usedCapacity = warehouses.reduce((acc, w) => acc + w.usedCapacity, 0);
    
    return {
      warehouses: warehouses.length,
      utilization: totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0,
      activeShipments: shipments.filter(s => s.status !== 'DELIVERED').length,
      deliveredToday: shipments.filter(s => {
        const arrival = s.actualArrival ? new Date(s.actualArrival) : null;
        return arrival && arrival.toDateString() === new Date().toDateString();
      }).length
    };
  }
}
