// ========================================================================
// Buyer Routes — /api/buyer/*
// ========================================================================

import { Router, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { WalletService } from '../services/wallet.service';
import { EscrowService } from '../services/escrow.service';
import { AggregationService } from '../services/aggregation.service';

const router = Router();

// All buyer routes require authentication
router.use(authenticate);
router.use(authorize('BUYER'));

// ─── GET /api/buyer/marketplace — Aggregated lots + individual crops ───
router.get('/marketplace', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { crop, grade, district, minQty, maxPrice } = req.query;

    // Get aggregated lots
    const lots = await AggregationService.getMarketplaceLots({
      cropName: crop as string,
      grade: grade as any,
      district: district as string,
      minQuantity: minQty ? Number(minQty) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });

    // Get individual listed crops (not aggregated)
    const cropWhere: any = { status: 'LISTED', isAggregated: false };
    if (crop) cropWhere.cropName = { contains: crop as string, mode: 'insensitive' };
    if (grade) cropWhere.grade = grade;
    if (minQty) cropWhere.quantity = { gte: Number(minQty) };
    if (maxPrice) cropWhere.pricePerKg = { lte: Number(maxPrice) };

    const individualCrops = await prisma.crop.findMany({
      where: cropWhere,
      include: {
        farmer: { select: { id: true, name: true, phone: true, kycVerified: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ lots, crops: individualCrops });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/buyer/marketplace/:lotId — Lot details ───────────────────
router.get('/marketplace/:lotId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lot = await AggregationService.getLotDetails(req.params.lotId);
    if (!lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }
    res.json(lot);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/buyer/order — Place bulk order ──────────────────────────
router.post('/order', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cropId, lotId, quantity, deliveryAddress } = req.body;

    if (!deliveryAddress) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }

    let totalAmount: number;
    let sellerId: string;

    if (lotId) {
      // Buying from aggregated lot
      const lot = await prisma.aggregatedLot.findUnique({
        where: { id: lotId },
        include: { fpo: true },
      });

      if (!lot || lot.status !== 'LISTED') {
        return res.status(400).json({ error: 'Lot not available' });
      }

      const qty = quantity ? Number(quantity) : lot.totalQuantity;
      if (qty > lot.totalQuantity) {
        return res.status(400).json({ error: 'Requested quantity exceeds available' });
      }

      totalAmount = qty * lot.pricePerKg;
      sellerId = lot.fpo.adminUserId;
    } else if (cropId) {
      // Buying individual crop
      const crop = await prisma.crop.findUnique({
        where: { id: cropId },
      });

      if (!crop || crop.status !== 'LISTED') {
        return res.status(400).json({ error: 'Crop not available' });
      }

      const qty = quantity ? Number(quantity) : crop.quantity;
      if (qty > crop.quantity) {
        return res.status(400).json({ error: 'Requested quantity exceeds available' });
      }

      totalAmount = qty * crop.pricePerKg;
      sellerId = crop.farmerId!;
    } else {
      return res.status(400).json({ error: 'Either cropId or lotId is required' });
    }

    // Check wallet balance
    const wallet = await WalletService.getBalance(req.user!.id);
    if (wallet.balance < totalAmount) {
      return res.status(400).json({
        error: 'Insufficient wallet balance',
        required: totalAmount,
        available: wallet.balance,
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId: req.user!.id,
        cropId: cropId || null,
        lotId: lotId || null,
        quantity: quantity ? Number(quantity) : 0,
        totalAmount,
        deliveryAddress,
        status: 'CONFIRMED',
        escrowStatus: 'HELD',
      },
    });

    // Hold funds in escrow
    await EscrowService.holdFunds(order.id, req.user!.id, sellerId, totalAmount);

    // Update crop/lot status
    if (cropId) {
      await prisma.crop.update({
        where: { id: cropId },
        data: { status: 'PENDING' },
      });
    }
    if (lotId) {
      await prisma.aggregatedLot.update({
        where: { id: lotId },
        data: { status: 'PENDING' },
      });
    }

    // Real-time notification to seller
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${sellerId}`).emit('notification', {
        title: 'New Order Received!',
        message: `₹${totalAmount.toLocaleString('en-IN')} order placed. Funds held in escrow.`,
        type: 'NEW_ORDER',
        timestamp: new Date(),
      });
    }

    res.status(201).json({
      order,
      escrow: { amount: totalAmount, status: 'HELD' },
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/buyer/wallet/add — Add funds (prototype) ────────────────
router.post('/wallet/add', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, razorpayPaymentId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const result = await WalletService.addFunds(req.user!.id, Number(amount), razorpayPaymentId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/buyer/wallet — Get wallet info ───────────────────────────
router.get('/wallet', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const wallet = await WalletService.getBalance(req.user!.id);
    const transactions = await WalletService.getTransactions(req.user!.id);
    res.json({ wallet, transactions });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/buyer/orders — My orders + supply tracking ───────────────
router.get('/orders', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      where: { buyerId: req.user!.id },
      include: {
        crop: {
          select: { id: true, cropName: true, variety: true, grade: true, qualityCertUrl: true },
        },
        lot: {
          select: { id: true, cropName: true, totalQuantity: true, qualityCertUrl: true },
          include: { fpo: { select: { name: true, district: true } } },
        },
        escrowTransaction: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/buyer/delivery/approve/:orderId — Release escrow ────────
router.post('/delivery/approve/:orderId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.buyerId !== req.user!.id) {
      return res.status(403).json({ error: 'Not your order' });
    }
    if (order.escrowStatus !== 'HELD') {
      return res.status(400).json({ error: 'Escrow already processed' });
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'DELIVERED' },
    });

    // Release escrow — triggers automatic payout split
    const result = await EscrowService.releaseFunds(orderId);

    // Mark crop as sold
    if (order.cropId) {
      await prisma.crop.update({ where: { id: order.cropId }, data: { status: 'SOLD' } });
    }
    if (order.lotId) {
      await prisma.aggregatedLot.update({ where: { id: order.lotId }, data: { status: 'SOLD' } });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/buyer/certificates/:cropId — View quality certificate ────
router.get('/certificates/:cropId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const certificates = await prisma.qualityCertificate.findMany({
      where: { cropId: req.params.cropId },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json(certificates);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/buyer/dashboard-stats — Dashboard summary ────────────────
router.get('/dashboard-stats', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const [orderCount, totalSpent, pendingOrders, wallet] = await Promise.all([
      prisma.order.count({ where: { buyerId: userId } }),
      prisma.order.aggregate({ where: { buyerId: userId, status: 'DELIVERED' }, _sum: { totalAmount: true } }),
      prisma.order.count({ where: { buyerId: userId, status: { in: ['PENDING', 'CONFIRMED', 'IN_TRANSIT'] } } }),
      prisma.wallet.findUnique({ where: { userId } }),
    ]);

    res.json({
      totalOrders: orderCount,
      totalSpent: totalSpent._sum.totalAmount || 0,
      pendingOrders,
      walletBalance: wallet?.balance || 0,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
