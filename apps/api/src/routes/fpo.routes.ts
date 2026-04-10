// ========================================================================
// FPO Routes — /api/fpo/*
// ========================================================================

import { Router, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { AggregationService } from '../services/aggregation.service';
import { EscrowService } from '../services/escrow.service';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// All FPO routes require authentication
router.use(authenticate);
router.use(authorize('FPO'));

// ─── POST /api/fpo/register — FPO org registration ────────────────────
router.post('/register', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, registrationNo, bankAccount, ifsc, district, state } = req.body;

    const fpo = await prisma.fPO.create({
      data: {
        adminUserId: req.user!.id,
        name,
        registrationNo,
        bankAccount,
        ifsc,
        district,
        state,
      },
    });

    res.status(201).json(fpo);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/fpo/farmer/onboard — Add farmer to FPO ─────────────────
router.post('/farmer/onboard', upload.array('photos', 5), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found. Register your FPO first.' });
    }

    const { name, phone, aadhaar, bankAccount, ifsc, district } = req.body;
    const photos = req.files ? (req.files as Express.Multer.File[]).map(f => `/uploads/${f.filename}`) : [];

    // Create FPOFarmer under this FPO
    const fpoFarmer = await prisma.fPOFarmer.create({
      data: {
        fpoId: fpo.id,
        name,
        phone,
        aadhaar,
        bankAccount: bankAccount || null,
        ifsc: ifsc || null,
        district: district || fpo.district,
        photos,
      },
    });

    // Also create a user account for the farmer (so they can log in)
    const existingUser = await prisma.user.findFirst({ where: { phone } });
    if (!existingUser) {
      const passwordHash = await bcrypt.hash('Welcome@123', 12);
      const farmerUser = await prisma.user.create({
        data: {
          name,
          phone,
          passwordHash,
          role: 'FARMER',
          aadhaar,
          bankAccount: bankAccount || null,
          ifsc: ifsc || null,
          bankName: null,
          language: 'mr',
        },
      });

      // Create wallet for farmer
      await prisma.wallet.create({ data: { userId: farmerUser.id, balance: 0 } });
    }

    res.status(201).json(fpoFarmer);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/fpo/farmers — List all managed farmers ───────────────────
router.get('/farmers', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const farmers = await prisma.fPOFarmer.findMany({
      where: { fpoId: fpo.id },
      include: {
        crops: {
          select: { id: true, cropName: true, quantity: true, pricePerKg: true, status: true, grade: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(farmers);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/fpo/incoming-crops — Fetch crops awaiting verification ─
router.get('/incoming-crops', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const crops = await prisma.crop.findMany({
      where: { 
        fpoId: fpo.id,
        status: 'SENT_TO_FPO'
      },
      include: { 
        fpoFarmer: { select: { name: true, phone: true, district: true } },
        farmer: { select: { name: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(crops);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/fpo/crops/:id/accept — Accept crop for aggregation ─────
router.post('/crops/:id/accept', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const crop = await prisma.crop.update({
      where: { id: req.params.id },
      data: { status: 'ACCEPTED' },
    });

    res.json({ message: 'Crop accepted successfully', crop });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/fpo/crops/:id/reject — Reject crop status ──────────────
router.post('/crops/:id/reject', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const crop = await prisma.crop.update({
      where: { id: req.params.id },
      data: { status: 'REJECTED' },
    });

    res.json({ message: 'Crop rejected successfully', crop });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/fpo/aggregate — Combine crops into lot ──────────────────
router.post('/aggregate', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const { cropIds } = req.body;
    if (!cropIds || !Array.isArray(cropIds) || cropIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 crop IDs required for aggregation' });
    }

    const lot = await AggregationService.createAggregatedLot(fpo.id, cropIds);
    res.status(201).json(lot);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/fpo/certificate/upload — Upload quality cert ────────────
router.post('/certificate/upload', upload.single('certificate'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cropId, lotId } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!fileUrl) {
      return res.status(400).json({ error: 'Certificate file is required' });
    }

    const cert = await prisma.qualityCertificate.create({
      data: {
        cropId: cropId || null,
        lotId: lotId || null,
        uploadedBy: req.user!.id,
        fileUrl,
        verifiedByFPO: true,
      },
    });

    // Update crop or lot with certificate URL
    if (cropId) {
      await prisma.crop.update({
        where: { id: cropId },
        data: { qualityCertUrl: fileUrl },
      });
    }
    if (lotId) {
      await prisma.aggregatedLot.update({
        where: { id: lotId },
        data: { qualityCertUrl: fileUrl },
      });
    }

    res.status(201).json(cert);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/fpo/orders — Orders for FPO lots ─────────────────────────
router.get('/orders', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { lot: { fpoId: fpo.id } },
          { crop: { fpoId: fpo.id } },
        ],
      },
      include: {
        buyer: { select: { id: true, name: true, phone: true, gst: true } },
        crop: true,
        lot: { include: { crops: { include: { fpoFarmer: true } } } },
        escrowTransaction: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/fpo/order/:orderId/dispatch — Mark as dispatched ────────
router.post('/order/:orderId/dispatch', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.orderId },
      data: { status: 'IN_TRANSIT' },
    });

    // Notify buyer
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${order.buyerId}`).emit('notification', {
        title: 'Order Dispatched!',
        message: `Your order has been dispatched and is on its way.`,
        type: 'ORDER_DISPATCHED',
        timestamp: new Date(),
      });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/fpo/payout/:orderId — Get payout breakdown ───────────────
router.get('/payout/:orderId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const earnings = await prisma.farmerEarning.findMany({
      where: { orderId: req.params.orderId },
      include: { farmer: { select: { id: true, name: true, phone: true } } },
    });

    res.json(earnings);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/fpo/distribute-payout — Distribute funds to farmers ─────
router.post('/distribute-payout', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const result = await EscrowService.releaseFunds(orderId);

    // Notify farmers via socket if possible
    const io = req.app.get('io');
    if (io) {
      io.to(`order:${orderId}`).emit('payout_completed', { orderId, timestamp: new Date() });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/fpo/dashboard-stats — Dashboard summary ──────────────────
router.get('/dashboard-stats', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const [farmerCount, totalCrops, activeLots, pendingOrders, completedOrders, inTransitOrders, totalQuantity, escrowHeld] = await Promise.all([
      prisma.fPOFarmer.count({ where: { fpoId: fpo.id, isActive: true } }),
      prisma.crop.count({ where: { fpoId: fpo.id } }),
      prisma.aggregatedLot.count({ where: { fpoId: fpo.id, status: 'LISTED' } }),
      prisma.order.count({ where: { OR: [{ lot: { fpoId: fpo.id } }, { crop: { fpoId: fpo.id } }], status: { in: ['PENDING', 'CONFIRMED'] } } }),
      prisma.order.count({ where: { OR: [{ lot: { fpoId: fpo.id } }, { crop: { fpoId: fpo.id } }], status: 'DELIVERED' } }),
      prisma.order.count({ where: { OR: [{ lot: { fpoId: fpo.id } }, { crop: { fpoId: fpo.id } }], status: 'IN_TRANSIT' } }),
      prisma.crop.aggregate({ where: { fpoId: fpo.id }, _sum: { quantity: true } }),
      prisma.escrowTransaction.aggregate({
        where: { status: 'HELD', order: { OR: [{ lot: { fpoId: fpo.id } }, { crop: { fpoId: fpo.id } }] } },
        _sum: { amount: true },
      }),
    ]);

    res.json({
      totalFarmers: farmerCount,
      totalCrops,
      activeLots,
      pendingOrders,
      completedOrders,
      inTransitOrders,
      totalQuantity: totalQuantity._sum.quantity || 0,
      escrowHeld: escrowHeld._sum.amount || 0,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/fpo/crops — All crops under FPO ──────────────────────────
router.get('/crops', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const crops = await prisma.crop.findMany({
      where: { fpoId: fpo.id },
      include: { fpoFarmer: { select: { name: true, phone: true, district: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(crops);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/fpo/lots — All aggregated lots ───────────────────────────
router.get('/lots', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const lots = await prisma.aggregatedLot.findMany({
      where: { fpoId: fpo.id },
      include: {
        crops: {
          include: { fpoFarmer: { select: { name: true, phone: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(lots);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/fpo/bulk-products — Create bulk listing from aggregation ─
router.post('/bulk-products', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const { aggregationId, pricePerKg } = req.body;
    if (!aggregationId) {
      return res.status(400).json({ error: 'Aggregation ID is required' });
    }

    const lot = await prisma.aggregatedLot.findUnique({
      where: { id: aggregationId, fpoId: fpo.id },
    });

    if (!lot) {
      return res.status(404).json({ error: 'Aggregated lot not found' });
    }

    // Update the lot with the final listing price
    const updatedLot = await prisma.aggregatedLot.update({
      where: { id: aggregationId },
      data: {
        pricePerKg: pricePerKg || lot.pricePerKg,
        status: 'LISTED',
      },
    });

    res.status(201).json(updatedLot);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/fpo/verify-quality — Verify crop quality & assign grade ──
router.post('/verify-quality', upload.single('certificate'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cropId, grade, notes } = req.body;
    if (!cropId || !grade) {
      return res.status(400).json({ error: 'Crop ID and grade are required' });
    }

    // Validate grade enum
    if (!['A', 'B', 'C'].includes(grade)) {
      return res.status(400).json({ error: 'Grade must be A, B, or C' });
    }

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Update crop grade and mark as accepted
    const crop = await prisma.crop.update({
      where: { id: cropId },
      data: {
        grade: grade as any,
        status: 'ACCEPTED',
        qualityCertUrl: fileUrl || undefined,
      },
    });

    // Create quality certificate if file is uploaded
    if (fileUrl) {
      await prisma.qualityCertificate.create({
        data: {
          cropId,
          uploadedBy: req.user!.id,
          fileUrl,
          certificateType: 'FPO_VERIFIED',
          verifiedByFPO: true,
          verifiedBy: req.user!.id,
          verifiedAt: new Date(),
          notes: notes || null,
        },
      });
    }

    res.json({ message: 'Quality verified successfully', crop });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/fpo/orders/:id/status — Update order status ──────────────
router.put('/orders/:id/status', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(status === 'DELIVERED' ? { actualDelivery: new Date() } : {}),
      },
    });

    // Socket notification
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${order.buyerId}`).emit('order_updated', {
        orderId: order.id,
        status,
        timestamp: new Date(),
      });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/fpo/logistics — Assign transporter to order ─────────────
router.post('/logistics', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const { orderId, driverName, driverPhone, vehicleNumber, pickupLocation, dropLocation, estimatedDelivery, notes } = req.body;
    if (!orderId || !driverName || !driverPhone || !vehicleNumber) {
      return res.status(400).json({ error: 'orderId, driverName, driverPhone, vehicleNumber are required' });
    }

    // Check if logistics already exist for this order
    const existing = await prisma.fPOLogistics.findUnique({ where: { orderId } });
    if (existing) {
      return res.status(400).json({ error: 'Logistics already assigned for this order' });
    }

    const logistics = await prisma.fPOLogistics.create({
      data: {
        orderId,
        fpoId: fpo.id,
        driverName,
        driverPhone,
        vehicleNumber,
        pickupLocation: pickupLocation || fpo.district,
        dropLocation: dropLocation || null,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
        notes: notes || null,
        status: 'ASSIGNED',
        assignedAt: new Date(),
      },
    });

    // Update order status to IN_TRANSIT
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'IN_TRANSIT' },
    });

    // Create logistics event
    await prisma.logisticsEvent.create({
      data: {
        logisticsId: logistics.id,
        status: 'ASSIGNED',
        description: `Driver ${driverName} assigned with vehicle ${vehicleNumber}`,
      },
    });

    // Socket event
    const io = req.app.get('io');
    if (io) {
      io.to(`order:${orderId}`).emit('logistics_updated', {
        orderId,
        status: 'ASSIGNED',
        driverName,
        vehicleNumber,
        timestamp: new Date(),
      });
    }

    res.status(201).json(logistics);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/fpo/logistics/:orderId — Get logistics for an order ───────
router.get('/logistics/:orderId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logistics = await prisma.fPOLogistics.findUnique({
      where: { orderId: req.params.orderId },
      include: {
        events: { orderBy: { timestamp: 'desc' } },
        order: {
          select: {
            id: true,
            quantity: true,
            totalAmount: true,
            status: true,
            buyer: { select: { name: true, phone: true } },
            crop: { select: { cropName: true } },
            lot: { select: { cropName: true, totalQuantity: true } },
          },
        },
      },
    });

    if (!logistics) {
      return res.status(404).json({ error: 'No logistics found for this order' });
    }

    res.json(logistics);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/fpo/logistics — All logistics for FPO ─────────────────────
router.get('/logistics', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const logisticsList = await prisma.fPOLogistics.findMany({
      where: { fpoId: fpo.id },
      include: {
        order: {
          select: {
            id: true,
            quantity: true,
            totalAmount: true,
            status: true,
            buyer: { select: { name: true, phone: true } },
            crop: { select: { cropName: true } },
            lot: { select: { cropName: true } },
          },
        },
        events: { orderBy: { timestamp: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(logisticsList);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/fpo/payouts — All payout records ──────────────────────────
router.get('/payouts', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    // Get payout splits for this FPO
    const payouts = await prisma.fPOPayoutSplit.findMany({
      where: { fpoId: fpo.id },
      include: {
        fpoFarmer: { select: { name: true, phone: true } },
        order: { select: { id: true, quantity: true, status: true } },
        crop: { select: { cropName: true, quantity: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Also get farmer earnings for this FPO's orders
    const earnings = await prisma.farmerEarning.findMany({
      where: {
        orderId: {
          in: (await prisma.order.findMany({
            where: { OR: [{ lot: { fpoId: fpo.id } }, { crop: { fpoId: fpo.id } }] },
            select: { id: true },
          })).map(o => o.id),
        },
      },
      include: {
        farmer: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute summary stats
    const totalDistributed = earnings
      .filter(e => e.status === 'COMPLETED')
      .reduce((s, e) => s + e.amount, 0);
    const totalPending = earnings
      .filter(e => e.status === 'PENDING')
      .reduce((s, e) => s + e.amount, 0);
    const totalPlatformFees = earnings.reduce((s, e) => s + e.platformFee, 0);

    res.json({
      payouts: earnings,
      summary: {
        totalDistributed,
        totalPending,
        totalPlatformFees,
        totalFarmersPaid: new Set(earnings.filter(e => e.status === 'COMPLETED').map(e => e.farmerId)).size,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/fpo/recent-activity — Live activity feed ──────────────────
router.get('/recent-activity', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    // Fetch recent crops, orders, payouts in parallel
    const [recentCrops, recentOrders, recentPayouts] = await Promise.all([
      prisma.crop.findMany({
        where: { fpoId: fpo.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, cropName: true, quantity: true, status: true, createdAt: true, fpoFarmer: { select: { name: true } } },
      }),
      prisma.order.findMany({
        where: { OR: [{ lot: { fpoId: fpo.id } }, { crop: { fpoId: fpo.id } }] },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, status: true, totalAmount: true, createdAt: true, buyer: { select: { name: true } } },
      }),
      prisma.farmerEarning.findMany({
        where: {
          orderId: {
            in: (await prisma.order.findMany({
              where: { OR: [{ lot: { fpoId: fpo.id } }, { crop: { fpoId: fpo.id } }] },
              select: { id: true },
            })).map(o => o.id),
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, amount: true, status: true, createdAt: true, farmer: { select: { name: true } } },
      }),
    ]);

    // Build unified feed
    const activities: any[] = [];

    recentCrops.forEach(c => {
      activities.push({
        id: c.id,
        type: 'crop',
        icon: '🌾',
        message: `${c.fpoFarmer?.name || 'Farmer'} sent ${c.quantity}kg ${c.cropName} — ${c.status}`,
        timestamp: c.createdAt,
      });
    });

    recentOrders.forEach(o => {
      activities.push({
        id: o.id,
        type: 'order',
        icon: '📦',
        message: `Order from ${o.buyer.name} — ₹${o.totalAmount.toLocaleString()} — ${o.status}`,
        timestamp: o.createdAt,
      });
    });

    recentPayouts.forEach(p => {
      activities.push({
        id: p.id,
        type: 'payout',
        icon: '💰',
        message: `₹${p.amount.toLocaleString()} ${p.status === 'COMPLETED' ? 'paid' : 'pending'} to ${p.farmer.name}`,
        timestamp: p.createdAt,
      });
    });

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json(activities.slice(0, 10));
  } catch (error) {
    next(error);
  }
});

export default router;

