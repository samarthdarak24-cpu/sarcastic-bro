import { Router } from "express";
import { LogisticsController } from "./logistics.controller";
import { authMiddleware, requireRole } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validation.middleware";
import { 
  requestPickupSchema, 
  assignDriverSchema, 
  updateLocationSchema, 
  markDeliveredSchema 
} from "./logistics.validation";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// ==================== FARMER ROUTES ====================

/**
 * POST /api/logistics/request
 * Farmer requests pickup for a confirmed order
 */
router.post(
  "/request",
  requireRole("FARMER"),
  validateBody(requestPickupSchema),
  LogisticsController.requestPickup
);

/**
 * GET /api/logistics/farmer
 * Get farmer's active logistics
 */
router.get(
  "/farmer",
  requireRole("FARMER"),
  LogisticsController.getFarmerLogistics
);

// ==================== FPO ROUTES ====================

/**
 * POST /api/logistics/assign
 * FPO assigns driver and vehicle to logistics
 */
router.post(
  "/assign",
  requireRole("FPO"),
  validateBody(assignDriverSchema),
  LogisticsController.assignDriver
);

/**
 * GET /api/logistics/fpo
 * Get all logistics for FPO dashboard
 */
router.get(
  "/fpo",
  requireRole("FPO"),
  LogisticsController.getFPOLogistics
);

// ==================== COMMON ROUTES ====================

/**
 * GET /api/logistics/order/:orderId
 * Get logistics by order ID (accessible by farmer, buyer, or FPO)
 */
router.get(
  "/order/:orderId",
  LogisticsController.getByOrder
);

/**
 * POST /api/logistics/location
 * Update driver location (live tracking)
 * Can be called by driver app or FPO
 */
router.post(
  "/location",
  validateBody(updateLocationSchema),
  LogisticsController.updateLocation
);

/**
 * POST /api/logistics/:id/deliver
 * Mark logistics as delivered (triggers escrow release)
 */
router.post(
  "/:id/deliver",
  validateBody(markDeliveredSchema),
  LogisticsController.markDelivered
);

/**
 * GET /api/logistics/buyer
 * Get buyer's incoming deliveries
 */
router.get(
  "/buyer",
  requireRole("BUYER"),
  LogisticsController.getBuyerLogistics
);

/**
 * POST /api/logistics/:id/cancel
 * Cancel logistics (with reason)
 */
router.post(
  "/:id/cancel",
  LogisticsController.cancelLogistics
);

// ==================== DEPRECATED ROUTES (keeping for backward compatibility) ====================

router.get("/overview", LogisticsController.getOverview);
router.get("/warehouses", LogisticsController.getWarehouses);
router.post("/warehouses", LogisticsController.createWarehouse);
router.get("/shipments", LogisticsController.getShipments);
router.patch("/shipments/:id", LogisticsController.updateShipment);
router.get("/market-prices", LogisticsController.getMarketPrices);

export default router;
