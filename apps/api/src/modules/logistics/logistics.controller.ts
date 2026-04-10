import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { LogisticsService } from "./logistics.service";
import { sendSuccess, sendCreated } from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";

export class LogisticsController {
  static getOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const ownerId = req.user?.id || '';
    const overview = await LogisticsService.getLogisticsOverview(ownerId);
    return sendSuccess(res, overview);
  });

  static createWarehouse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const ownerId = req.user?.id || '';
    const warehouse = await LogisticsService.createWarehouse(ownerId, req.body);
    return sendCreated(res, warehouse, "Warehouse registered successfully");
  });

  static getWarehouses = asyncHandler(async (req: AuthRequest, res: Response) => {
    const ownerId = req.user?.id || '';
    const warehouses = await LogisticsService.getWarehouses(ownerId);
    return sendSuccess(res, warehouses);
  });

  static getShipments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const ownerId = req.user?.id || '';
    const shipments = await LogisticsService.getShipments(ownerId);
    return sendSuccess(res, shipments);
  });

  static updateShipment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const shipment = await LogisticsService.updateShipmentStatus(req.params.id, req.body.status, req.body.location);
    return sendSuccess(res, shipment, "Shipment updated");
  });

  static getMarketPrices = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { district, cropName } = req.query;
    const prices = await LogisticsService.getMarketPrices(district as string, cropName as string);
    return sendSuccess(res, prices);
  });
}
