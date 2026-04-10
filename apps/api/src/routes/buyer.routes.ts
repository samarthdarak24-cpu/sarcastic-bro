import { Router, Response } from 'express';
import prisma from '../config/database';
import { authMiddleware, requireBuyer, AuthRequest } from '../middleware/auth.middleware';
import { MarketService } from '../services/market.service';

import kycRoutes from '../modules/buyer/kyc.controller';
import walletRoutes from '../modules/buyer/wallet.controller';
import marketplaceRoutes from '../modules/buyer/marketplace.controller';
import bulkOrderRoutes from '../modules/buyer/bulk-order.controller';
import dashboardRoutes from '../modules/buyer/dashboard.controller';
import chatRoutes from '../modules/buyer/chat.controller';

const router = Router();

// All buyer routes require authenticated buyer session
router.use(authMiddleware);
router.use(requireBuyer);

// Core buyer feature modules used by the unified dashboard
router.use('/kyc', kycRoutes);
router.use('/wallet', walletRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/bulk-orders', bulkOrderRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/chat', chatRoutes);

/**
 * GET /api/buyer/escrow
 * Escrow summary backed by EscrowTransaction + Order relations
 */
router.get('/escrow', async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const skip = (page - 1) * limit;

    const where: any = { buyerId: req.user!.id };
    if (status) {
      where.status = status;
    }

    const [escrows, total] = await Promise.all([
      prisma.escrowTransaction.findMany({
        where,
        include: {
          order: {
            select: {
              id: true,
              quantity: true,
              totalAmount: true,
              status: true,
              crop: { select: { cropName: true } },
              lot: { select: { cropName: true } },
            },
          },
        },
        orderBy: { heldAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.escrowTransaction.count({ where }),
    ]);

    const normalizedEscrows = escrows.map((escrow) => ({
      ...escrow,
      createdAt: escrow.heldAt,
    }));

    res.json({
      success: true,
      data: {
        escrows: normalizedEscrows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/buyer/market-intelligence/prices
 * Real market widget feed derived from persisted market prices
 */
router.get('/market-intelligence/prices', async (req: AuthRequest, res: Response) => {
  try {
    const cropName = req.query.cropName as string | undefined;
    const district = req.query.district as string | undefined;

    const prices = await MarketService.getPrices({ cropName, district });

    const feed = await Promise.all(
      prices.slice(0, 20).map(async (priceRow) => {
        const previous = await prisma.marketPrice.findFirst({
          where: {
            cropName: priceRow.cropName,
            district: priceRow.district,
            date: { lt: priceRow.date },
          },
          orderBy: { date: 'desc' },
          select: { modalPrice: true },
        });

        const previousPrice = previous?.modalPrice ?? priceRow.modalPrice;
        const delta = previousPrice > 0
          ? ((priceRow.modalPrice - previousPrice) / previousPrice) * 100
          : 0;

        return {
          name: priceRow.cropName,
          price: priceRow.modalPrice,
          change: Number(delta.toFixed(1)),
          available: `${Math.round(priceRow.arrivalQuantity || 0)} qtl`,
          district: priceRow.district,
          state: priceRow.state,
          date: priceRow.date,
        };
      }),
    );

    res.json({ success: true, data: feed });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/buyer/market-intelligence/trends
 * Backward-compatible trends endpoint for buyer frontend service
 */
router.get('/market-intelligence/trends', async (req: AuthRequest, res: Response) => {
  try {
    const cropName = req.query.cropName as string | undefined;
    const district = req.query.district as string | undefined;
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;

    if (!cropName || !district) {
      return res.json({ success: true, data: [] });
    }

    const trends = await MarketService.getTrends(cropName, district, days);
    res.json({ success: true, data: trends });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/buyer/orders/:orderId/track
 * Buyer order tracking view with logistics + events
 */
router.get('/orders/:orderId/track', async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.orderId,
        buyerId: req.user!.id,
      },
      include: {
        trackingEvents: {
          orderBy: { timestamp: 'asc' },
        },
        logistics: {
          include: {
            events: {
              orderBy: { timestamp: 'asc' },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const logisticsEvents = (order.logistics?.events || []).map((event) => ({
      id: event.id,
      status: event.status,
      location: event.location,
      description: event.description,
      timestamp: event.timestamp,
      photos: [],
      updatedBy: order.logistics?.fpoId || '',
      updatedByRole: 'FPO',
    }));

    const trackingEvents = order.trackingEvents.length > 0 ? order.trackingEvents : logisticsEvents;

    res.json({
      success: true,
      data: {
        ...order,
        trackingEvents,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/buyer/dashboard-stats
 * Legacy endpoint kept for older buyer screens
 */
router.get('/dashboard-stats', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const [orderCount, totalSpent, pendingOrders, wallet] = await Promise.all([
      prisma.order.count({ where: { buyerId: userId } }),
      prisma.order.aggregate({
        where: { buyerId: userId, status: 'DELIVERED' },
        _sum: { totalAmount: true },
      }),
      prisma.order.count({
        where: {
          buyerId: userId,
          status: { in: ['PENDING', 'CONFIRMED', 'IN_TRANSIT'] },
        },
      }),
      prisma.wallet.findUnique({ where: { userId } }),
    ]);

    res.json({
      totalOrders: orderCount,
      totalSpent: totalSpent._sum.totalAmount || 0,
      pendingOrders,
      walletBalance: wallet?.balance || 0,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
