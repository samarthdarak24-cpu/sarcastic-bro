import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { BulkOrderService } from "./bulk-order.service";

const router = Router();
const bulkOrderService = new BulkOrderService();

/**
 * Create a bulk order
 */
router.post("/", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const buyerId = (req as any).user.userId;
  const { productId, productType, quantity, deliveryAddress, deliveryDate, notes } = req.body;

  if (!productId || !productType || !quantity || !deliveryAddress) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  const result = await bulkOrderService.createOrder(buyerId, {
    productId,
    productType,
    quantity: parseFloat(quantity),
    deliveryAddress,
    deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
    notes
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: result
  });
}));

/**
 * Get all orders for buyer
 */
router.get("/", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const buyerId = (req as any).user.userId;
  const { status, page, limit } = req.query;

  const result = await bulkOrderService.getOrders(buyerId, {
    status: status as any,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined
  });

  res.status(200).json({
    success: true,
    data: result
  });
}));

/**
 * Get order details
 */
router.get("/:orderId", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const buyerId = (req as any).user.userId;
  const { orderId } = req.params;

  const order = await bulkOrderService.getOrderDetails(orderId, buyerId);

  res.status(200).json({
    success: true,
    data: order
  });
}));

/**
 * Confirm delivery and release payment
 */
router.post("/:orderId/confirm-delivery", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const buyerId = (req as any).user.userId;
  const { orderId } = req.params;

  const result = await bulkOrderService.confirmDelivery(orderId, buyerId);

  res.status(200).json({
    success: true,
    message: "Delivery confirmed successfully",
    data: result
  });
}));

/**
 * Cancel order
 */
router.post("/:orderId/cancel", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const buyerId = (req as any).user.userId;
  const { orderId } = req.params;
  const { reason } = req.body;

  const result = await bulkOrderService.cancelOrder(orderId, buyerId, reason || 'Cancelled by buyer');

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: result
  });
}));

export default router;
