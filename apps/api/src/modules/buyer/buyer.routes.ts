import { Router, Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import { authMiddleware } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

// Import new buyer module controllers
import supplierController from "./supplier.controller";
import bulkProductController from "./bulk-product.controller";
import procurementController from "./procurement.controller";
import reputationController from "./reputation.controller";
import bidController from "./bid.controller";
import preBookingController from "./pre-booking.controller";
import orderTrackingController from "./order-tracking.controller";
import bulkTradeController from "./bulk-trade.controller";
import blockchainController from "./blockchain.controller";
import chatController from "./chat.controller";
import analyticsController from "./analytics.controller";
import escrowController from "./escrow.controller";
import securityController from "./security.controller";
import reviewController from "./review.controller";
import marketIntelligenceController from "./market-intelligence.controller";
import clusterController from "./cluster.controller";
import cockpitController from "./cockpit.controller";
import tradeDeskController from "./trade-desk.controller";

const router = Router();

// Mount new buyer module routes
router.use("/suppliers", supplierController);
router.use("/bulk-products", bulkProductController);
router.use("/procurement", procurementController);
router.use("/reputation", reputationController);
router.use("/bids", bidController);
router.use("/pre-bookings", preBookingController);
router.use("/orders", orderTrackingController);
router.use("/bulk-trades", bulkTradeController);
router.use("/blockchain", blockchainController);
router.use("/chat", chatController);
router.use("/analytics", analyticsController);
router.use("/escrow", escrowController);
router.use("/security", securityController);
router.use("/reviews", reviewController);
router.use("/market-intelligence", marketIntelligenceController);
router.use("/clusters", clusterController);
router.use("/cockpit", cockpitController);
router.use("/trade-desk", tradeDeskController);

/**
 * Get buyer overview stats.
 */
router.get("/overview", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  
  const [totalSpent, ordersCount, rfqCount] = await Promise.all([
    prisma.order.aggregate({
      where: { buyerId: userId, status: "DELIVERED" },
      _sum: { totalPrice: true }
    }),
    prisma.order.count({
      where: { buyerId: userId }
    }),
    prisma.tender.count({ // Tenders represent RFQs in this schema
      where: { creatorId: userId }
    })
  ]);

  const activeSuppliers = await prisma.user.count({
    where: { 
      role: "FARMER",
      ordersAsFarmer: {
        some: { buyerId: userId }
      }
    }
  });

  res.status(200).json({
    success: true,
    data: {
      totalSpent: totalSpent._sum.totalPrice || 0,
      ordersPlaced: ordersCount,
      activeSuppliers: activeSuppliers,
      activeRFQs: rfqCount,
    }
  });
}));

/**
 * Get list of suppliers (farmers).
 */
router.get("/suppliers", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const farmers = await prisma.user.findMany({
    where: { role: "FARMER" },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      district: true,
      state: true,
      _count: {
        select: {
          products: true,
          ordersAsFarmer: true,
          reviewsReceived: true,
        }
      },
      reviewsReceived: {
        select: { rating: true }
      }
    }
  });

  const mappedFarmers = farmers.map(f => {
    const avgRating = f.reviewsReceived.length > 0
      ? f.reviewsReceived.reduce((acc, r) => acc + r.rating, 0) / f.reviewsReceived.length
      : 4.5; // Default rating for new farmers

    return {
      id: f.id,
      name: f.name,
      rating: avgRating,
      productsCount: f._count.products,
      totalOrders: f._count.ordersAsFarmer,
      responseTime: "2-4 hours", // Simulated for now
      imageUrl: f.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${f.name}`,
      location: `${f.district}, ${f.state}`
    };
  });

  res.status(200).json({
    success: true,
    data: mappedFarmers
  });
}));

/**
 * Get list of RFQs (Tenders) for the buyer.
 */
router.get("/rfqs", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const rfqs = await prisma.tender.findMany({
    where: { creatorId: userId },
    include: {
      _count: {
        select: { applications: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const mappedRFQs = rfqs.map(r => ({
    id: r.id,
    productName: r.title,
    quantity: r.quantity,
    unit: r.unit,
    offersReceived: r._count.applications,
    status: r.status,
    createdAt: r.createdAt
  }));

  res.status(200).json({
    success: true,
    data: mappedRFQs
  });
}));

/**
 * Create a new RFQ (Tender).
 */
router.post("/rfqs", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { productName, category, quantity, unit, minQuality, preferredDeliveryDate, notes } = req.body;

  const newTender = await prisma.tender.create({
    data: {
      title: productName,
      description: notes || `RFQ for ${productName}`,
      category: category,
      quantity: parseFloat(quantity),
      unit: unit,
      maxPrice: 0, // Optional
      deadline: preferredDeliveryDate ? new Date(preferredDeliveryDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      creatorId: userId,
      status: "OPEN"
    }
  });

  res.status(201).json({
    success: true,
    data: newTender
  });
}));

/**
 * Get offers for a specific RFQ.
 */
router.get("/rfqs/:rfqId/offers", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { rfqId } = req.params;

  const offers = await prisma.tenderApplication.findMany({
    where: { tenderId: rfqId },
    include: {
      applicant: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const mappedOffers = offers.map(o => ({
    id: o.id,
    farmerId: o.applicant.id,
    farmerName: o.applicant.name,
    pricePerUnit: o.priceOffer,
    quantity: 0, // Should probably come from the Tender itself or the application
    validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Mock 5 days
    status: o.status === "ACCEPTED" ? "ACCEPTED" : o.status === "REJECTED" ? "REJECTED" : "PENDING"
  }));

  res.status(200).json({
    success: true,
    data: mappedOffers
  });
}));

/**
 * Accept an offer.
 */
router.post("/offers/:offerId/accept", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { offerId } = req.params;

  const updatedOffer = await prisma.tenderApplication.update({
    where: { id: offerId },
    data: { status: "ACCEPTED" }
  });

  // Also close the RFQ (Tender)
  await prisma.tender.update({
    where: { id: updatedOffer.tenderId },
    data: { status: "CLOSED" }
  });

  res.status(200).json({
    success: true,
    data: updatedOffer
  });
}));

/**
 * Get orders for the buyer.
 */
router.get("/orders", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const orders = await prisma.order.findMany({
    where: { buyerId: userId },
    orderBy: { createdAt: "desc" }
  });

  const mappedOrders = orders.map(o => ({
    id: o.id,
    date: o.createdAt,
    total: o.totalPrice,
    status: o.status,
    items: 1 // Simplified: typically would come from a relation
  }));

  res.status(200).json({
    success: true,
    data: mappedOrders
  });
}));

/**
 * Track an order (Logistics).
 */
router.get("/orders/:orderId/track", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  // Mocking real-time tracking from a logistics provider
  const trackingInfo = {
    orderId,
    status: "IN_TRANSIT",
    currentLocation: "Regional Distribution Center",
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    steps: [
      { status: "ORDER_PLACED", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), details: "Confirmed" },
      { status: "SHIPPED", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), details: "Handed over to Delhivery" },
      { status: "IN_TRANSIT", date: new Date(), details: "Arrived at Distribution Hub" },
      { status: "OUT_FOR_DELIVERY", date: null, details: "Pending" }
    ]
  };

  res.status(200).json({
    success: true,
    data: trackingInfo
  });
}));

export default router;
