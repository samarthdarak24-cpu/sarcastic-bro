import prisma from '../config/database';
import { CropGrade, CropStatus } from '@prisma/client';

export class AggregationService {
  // Create aggregated lot from multiple crops
  static async createAggregatedLot(fpoId: string, cropIds: string[]) {
    // Fetch all crops
    const crops = await prisma.crop.findMany({
      where: {
        id: { in: cropIds },
        fpoId,
        isAggregated: false,
        status: CropStatus.LISTED,
      },
    });

    if (crops.length === 0) {
      throw new Error('No valid crops found for aggregation');
    }

    // Validate all crops are same type and grade
    const firstCrop = crops[0];
    const allSameType = crops.every(
      (c) => c.cropName === firstCrop.cropName && c.grade === firstCrop.grade
    );

    if (!allSameType) {
      throw new Error('All crops must be of the same type and grade for aggregation');
    }

    // Calculate totals
    const totalQuantity = crops.reduce((sum, crop) => sum + crop.quantity, 0);
    const weightedPrice =
      crops.reduce((sum, crop) => sum + crop.pricePerKg * crop.quantity, 0) / totalQuantity;

    // Create aggregated lot
    const lot = await prisma.aggregatedLot.create({
      data: {
        fpoId,
        cropName: firstCrop.cropName,
        totalQuantity,
        pricePerKg: Math.round(weightedPrice * 100) / 100,
        qualityCertUrl: firstCrop.qualityCertUrl,
        status: CropStatus.LISTED,
      },
    });

    // Update crops to mark as aggregated
    await prisma.crop.updateMany({
      where: { id: { in: cropIds } },
      data: {
        isAggregated: true,
        aggregatedLotId: lot.id,
      },
    });

    return lot;
  }

  // Get all aggregated lots for marketplace
  static async getMarketplaceLots(filters?: {
    cropName?: string;
    grade?: CropGrade;
    district?: string;
    minQuantity?: number;
    maxPrice?: number;
  }) {
    const where: any = {
      status: CropStatus.LISTED,
    };

    if (filters?.cropName) {
      where.cropName = { contains: filters.cropName, mode: 'insensitive' };
    }

    if (filters?.minQuantity) {
      where.totalQuantity = { gte: filters.minQuantity };
    }

    if (filters?.maxPrice) {
      where.pricePerKg = { lte: filters.maxPrice };
    }

    const lots = await prisma.aggregatedLot.findMany({
      where,
      include: {
        fpo: {
          select: {
            name: true,
            district: true,
            state: true,
          },
        },
        crops: {
          select: {
            grade: true,
            category: true,
            variety: true,
          },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return lots;
  }

  // Get aggregated lot details
  static async getLotDetails(lotId: string) {
    const lot = await prisma.aggregatedLot.findUnique({
      where: { id: lotId },
      include: {
        fpo: {
          select: {
            name: true,
            district: true,
            state: true,
            admin: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        },
        crops: {
          include: {
            fpoFarmer: {
              select: {
                name: true,
                district: true,
              },
            },
          },
        },
      },
    });

    return lot;
  }
}
