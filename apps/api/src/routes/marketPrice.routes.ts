// ========================================================================
// Market Price Routes — /api/market-prices/*
// ========================================================================

import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

const router = Router();

// ─── GET /api/market-prices — Public price transparency data ──────────
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cropName, variety, grade, district, from, to } = req.query;

    const where: any = {};
    if (cropName) where.cropName = { contains: cropName as string, mode: 'insensitive' };
    if (variety) where.variety = { contains: variety as string, mode: 'insensitive' };
    if (grade) where.grade = grade;
    if (district) where.district = { contains: district as string, mode: 'insensitive' };
    if (from || to) {
      where.recordedAt = {};
      if (from) where.recordedAt.gte = new Date(from as string);
      if (to) where.recordedAt.lte = new Date(to as string);
    }

    const prices = await prisma.marketPrice.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 500,
    });

    res.json(prices);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/market-prices/summary — Current averages ─────────────────
router.get('/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const averages = await prisma.marketPrice.groupBy({
      by: ['cropName', 'district'],
      _avg: { pricePerKg: true },
      _min: { pricePerKg: true },
      _max: { pricePerKg: true },
      _count: true,
      where: {
        recordedAt: { gte: thirtyDaysAgo },
      },
    });

    res.json(averages);
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/market-prices/crops — List distinct crops ────────────────
router.get('/crops', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const crops = await prisma.marketPrice.findMany({
      distinct: ['cropName'],
      select: { cropName: true },
      orderBy: { cropName: 'asc' },
    });

    res.json(crops.map(c => c.cropName));
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/market-prices/districts — List distinct districts ────────
router.get('/districts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const districts = await prisma.marketPrice.findMany({
      distinct: ['district'],
      select: { district: true },
      orderBy: { district: 'asc' },
    });

    res.json(districts.map(d => d.district));
  } catch (error) {
    next(error);
  }
});

export default router;
