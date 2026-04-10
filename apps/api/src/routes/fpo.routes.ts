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

// ─── POST /api/fpo/crop/list — List crop on behalf of farmer ──────────
router.post('/crop/list', upload.single('qualityCert'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const { fpoFarmerId, cropName, category, variety, quantity, pricePerKg, grade } = req.body;
    const qualityCertUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Verify farmer belongs to this FPO
    const fpoFarmer = await prisma.fPOFarmer.findFirst({
      where: { id: fpoFarmerId, fpoId: fpo.id },
    });
    if (!fpoFarmer) {
      return res.status(404).json({ error: 'Farmer not found in your FPO' });
    }

    const crop = await prisma.crop.create({
      data: {
        fpoFarmerId,
        fpoId: fpo.id,
        cropName,
        category,
        variety,
        quantity: parseFloat(quantity),
        pricePerKg: parseFloat(pricePerKg),
        grade: grade as any,
        qualityCertUrl,
        status: 'LISTED',
      },
    });

    res.status(201).json(crop);
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

// ─── GET /api/fpo/dashboard-stats — Dashboard summary ──────────────────
router.get('/dashboard-stats', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fpo = await prisma.fPO.findUnique({ where: { adminUserId: req.user!.id } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    const [farmerCount, totalCrops, activeLots, pendingOrders, totalQuantity, escrowHeld] = await Promise.all([
      prisma.fPOFarmer.count({ where: { fpoId: fpo.id, isActive: true } }),
      prisma.crop.count({ where: { fpoId: fpo.id } }),
      prisma.aggregatedLot.count({ where: { fpoId: fpo.id, status: 'LISTED' } }),
      prisma.order.count({ where: { lot: { fpoId: fpo.id }, status: { in: ['PENDING', 'CONFIRMED', 'IN_TRANSIT'] } } }),
      prisma.crop.aggregate({ where: { fpoId: fpo.id }, _sum: { quantity: true } }),
      prisma.escrowTransaction.aggregate({
        where: { status: 'HELD', order: { lot: { fpoId: fpo.id } } },
        _sum: { amount: true },
      }),
    ]);

    res.json({
      totalFarmers: farmerCount,
      totalCrops,
      activeLots,
      pendingOrders,
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

export default router;
