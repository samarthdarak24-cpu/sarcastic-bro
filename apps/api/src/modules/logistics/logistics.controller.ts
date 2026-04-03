import type { Request, Response } from "express";
import { LogisticsService } from "./logistics.service";
import { bookShipmentSchema, updateShipmentStatusSchema, listShipmentsSchema } from "./logistics.validation";
import { sendCreated, sendSuccess, sendPaginated } from "../../utils/response";

export class LogisticsController {
  static async bookShipment(req: Request, res: Response) {
    const data = bookShipmentSchema.parse(req.body);
    const shipment = await LogisticsService.bookShipment(req.user!.userId, data);
    return sendCreated(res, shipment, "Shipment booked successfully");
  }

  static async getShipmentById(req: Request, res: Response) {
    const shipment = await LogisticsService.getShipmentById(req.user!.userId, req.params.id);
    return sendSuccess(res, shipment, "Shipment details retrieved");
  }

  static async listMyShipments(req: Request, res: Response) {
    const filters = listShipmentsSchema.parse(req.query);
    const { shipments, pagination } = await LogisticsService.listMyShipments(req.user!.userId, filters);
    return sendPaginated(res, shipments, pagination.total, pagination.page, pagination.limit);
  }

  static async updateStatus(req: Request, res: Response) {
    const data = updateShipmentStatusSchema.parse(req.body);
    const shipment = await LogisticsService.updateShipmentStatus(req.user!.userId, req.params.id, data);
    return sendSuccess(res, shipment, "Shipment status updated successfully");
  }

  static async getShipmentTracking(req: Request, res: Response) {
    const shipment = await LogisticsService.getShipmentTracking(req.params.trackingId);
    return sendSuccess(res, shipment, "Shipment tracking info retrieved");
  }
}
