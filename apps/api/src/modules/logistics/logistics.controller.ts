import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { LogisticsService } from "./logistics.service";
import { sendSuccess, sendCreated } from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";
import { Role } from "@prisma/client";

export class LogisticsController {
  /**
   * FARMER: Request pickup for an order
   */
  static requestPickup = asyncHandler(async (req: AuthRequest, res: Response) => {
    const farmerId = req.user!.id;
    const logistics = await LogisticsService.requestPickup(farmerId, req.body);
    return sendCreated(res, logistics, "Pickup request created successfully");
  });

  /**
   * FPO: Assign driver and vehicle to logistics
   */
  static assignDriver = asyncHandler(async (req: AuthRequest, res: Response) => {
    const fpoId = req.user!.id;
    const logistics = await LogisticsService.assignDriver(fpoId, req.body);
    return sendSuccess(res, logistics, "Driver assigned successfully");
  });

  /**
   * Get logistics by order ID (role-based access)
   */
  static getByOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const role = req.user!.role as string;
    const logistics = await LogisticsService.getLogisticsByOrder(req.params.orderId, userId, role);
    return sendSuccess(res, logistics);
  });

  /**
   * Update driver location (live tracking)
   */
  static updateLocation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const role = req.user!.role as string;
    const updated = await LogisticsService.updateLocation(userId, role, req.body);
    return sendSuccess(res, updated, "Location updated successfully");
  });

  /**
   * Mark logistics as delivered (triggers escrow release)
   */
  static markDelivered = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const role = req.user!.role as string;
    const logistics = await LogisticsService.markDelivered(userId, role, {
      logisticsId: req.params.id,
      ...req.body,
    });
    return sendSuccess(res, logistics, "Delivery completed successfully");
  });

  /**
   * FPO: Get all logistics for dashboard
   */
  static getFPOLogistics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const fpoId = req.user!.id;
    const { status } = req.query;
    const logistics = await LogisticsService.getFPOLogistics(fpoId, status as string);
    return sendSuccess(res, logistics);
  });

  /**
   * FARMER: Get farmer's active logistics
   */
  static getFarmerLogistics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const farmerId = req.user!.id;
    const logistics = await LogisticsService.getFarmerLogistics(farmerId);
    return sendSuccess(res, logistics);
  });

  /**
   * BUYER: Get buyer's incoming deliveries
   */
  static getBuyerLogistics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const buyerId = req.user!.id;
    const logistics = await LogisticsService.getBuyerLogistics(buyerId);
    return sendSuccess(res, logistics);
  });

  /**
   * Cancel logistics
   */
  static cancelLogistics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const role = req.user!.role as string;
    const { reason } = req.body;
    const logistics = await LogisticsService.cancelLogistics(req.params.id, reason, userId, role);
    return sendSuccess(res, logistics, "Logistics cancelled successfully");
  });

  // ========== DEPRECATED METHODS (keeping for backward compatibility) ==========
  
  static getOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const ownerId = req.user?.id || '';
    const overview = await LogisticsService.getFPOLogistics(ownerId);
    return sendSuccess(res, overview);
  });

  static createWarehouse = asyncHandler(async (_req: AuthRequest, res: Response) => {
    return sendSuccess(res, { message: "Deprecated - use /request endpoint" });
  });

  static getWarehouses = asyncHandler(async (_req: AuthRequest, res: Response) => {
    return sendSuccess(res, { message: "Deprecated - use /farmer or /fpo endpoints" });
  });

  static getShipments = asyncHandler(async (_req: AuthRequest, res: Response) => {
    return sendSuccess(res, { message: "Deprecated - use /buyer endpoint" });
  });

  static updateShipment = asyncHandler(async (_req: AuthRequest, res: Response) => {
    return sendSuccess(res, { message: "Deprecated - use /location or /deliver endpoints" });
  });

  static getMarketPrices = asyncHandler(async (_req: AuthRequest, res: Response) => {
    return sendSuccess(res, { message: "Deprecated" });
  });
}
