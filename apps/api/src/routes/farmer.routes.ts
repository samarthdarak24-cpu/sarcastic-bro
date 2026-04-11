// ========================================================================
// Farmer Routes — /api/farmer/*
// ========================================================================

import { Router, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = Router();

// Multer config for farm photos & quality certificates
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// All farmer routes require authentication
router.use(authenticate);
router.use(authorize('FARMER'));

// ─── POST /api/farmer/farm — Add farm details + photos ─────────────────
router.post('/farm', upload.array('photos', 5), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { location, district, state, areaAcres, soilType, irrigationType } = req.body;
    const photos = req.files ? (req.files as Express.Multer.File[]).map(f => `/uploads/${f.filename}`) : [];

    const farm = await prisma.farm.upsert({
      where: { farmerId: req.user!.id },
      update: { location, district, state, areaAcres: parseFloat(areaAcres), soilType, irrigationType, photos },
      create: {
        farmerId: req.user!.id,
        location,
        district,
        state,
        areaAcres: parseFloat(areaAcres),
        photos,
        soilType,
        irrigationType,
      },
    });

    res.status(201).json(farm);
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/farmer/crop — List new crop ─────────────────────────────
router.post('/crop', upload.single('qualityCert'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cropName, category, variety, quantity, pricePerKg, grade } = req.body;
    const qualityCertUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const crop = await prisma.crop.create({
      data: {
        farmerId: req.user!.id,
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

    // Emit real-time notification to connected buyers
    const io = req.app.get('io');
    if (io) {
      io.emit('new-crop-listed', {
        cropName: crop.cropName,
        quantity: crop.quantity,
        pricePerKg: crop.pricePerKg,
        grade: crop.grade,
      });
    }

    res.status(201).json(crop);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/farmer/crops — My listed crops ───────────────────────────
router.get('/crops', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const crops = await prisma.crop.findMany({
      where: { farmerId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(crops);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/farmer/orders — Order tracking ───────────────────────────
router.get('/orders', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { crop: { farmerId: req.user!.id } },
          { lot: { crops: { some: { farmerId: req.user!.id } } } },
        ],
      },
      include: {
        buyer: { select: { id: true, name: true, phone: true } },
        crop: { select: { id: true, cropName: true, variety: true, quantity: true, pricePerKg: true } },
        lot: { select: { id: true, cropName: true, totalQuantity: true, pricePerKg: true } },
        escrowTransaction: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/farmer/earnings — Revenue + transaction history ──────────
router.get('/earnings', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const earnings = await prisma.farmerEarning.findMany({
      where: { farmerId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenue = earnings.reduce((sum, e) => sum + e.amount, 0);
    const totalPlatformFees = earnings.reduce((sum, e) => sum + e.platformFee, 0);

    // Monthly breakdown
    const monthlyEarnings: Record<string, number> = {};
    earnings.forEach(e => {
      const month = e.createdAt.toISOString().slice(0, 7); // YYYY-MM
      monthlyEarnings[month] = (monthlyEarnings[month] || 0) + e.amount;
    });

    // Wallet info
    const wallet = await prisma.wallet.findUnique({
      where: { userId: req.user!.id },
      include: {
        transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });

    res.json({
      totalRevenue,
      totalPlatformFees,
      walletBalance: wallet?.balance || 0,
      monthlyEarnings,
      transactions: earnings,
      walletTransactions: wallet?.transactions || [],
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/farmer/market-prices — Price history for district ────────
router.get('/market-prices', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { cropName, district } = req.query;

    const where: any = {};
    if (cropName) where.cropName = { contains: cropName as string, mode: 'insensitive' };
    if (district) where.district = { contains: district as string, mode: 'insensitive' };

    const prices = await prisma.marketPrice.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 180, // ~6 months daily data
    });

    // Current average price per crop per district
    const latestPrices = await prisma.marketPrice.groupBy({
      by: ['cropName', 'district'],
      _avg: { pricePerKg: true },
      where: {
        recordedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // last 30 days
      },
    });

    res.json({ history: prices, currentAverages: latestPrices });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/farmer/fpo-request — Request to join FPO ────────────────
router.post('/fpo-request', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { fpoId } = req.body;

    const fpo = await prisma.fPO.findUnique({ where: { id: fpoId } });
    if (!fpo) {
      return res.status(404).json({ error: 'FPO not found' });
    }

    // Notify FPO admin via socket
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${fpo.adminUserId}`).emit('notification', {
        title: 'New Join Request',
        message: `A farmer has requested to join your FPO`,
        type: 'FPO_JOIN_REQUEST',
        timestamp: new Date(),
      });
    }

    res.json({ success: true, message: 'Join request sent to FPO admin' });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/farmer/dashboard-stats — Dashboard summary ───────────────
router.get('/dashboard-stats', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const [cropCount, totalQuantity, earnings, pendingOrders] = await Promise.all([
      prisma.crop.count({ where: { farmerId: userId } }),
      prisma.crop.aggregate({ where: { farmerId: userId }, _sum: { quantity: true } }),
      prisma.farmerEarning.aggregate({ where: { farmerId: userId }, _sum: { amount: true } }),
      prisma.order.count({ where: { crop: { farmerId: userId }, status: 'PENDING' } }),
    ]);

    res.json({
      totalCrops: cropCount,
      totalQuantity: totalQuantity._sum.quantity || 0,
      totalEarnings: earnings._sum.amount || 0,
      pendingOrders,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
