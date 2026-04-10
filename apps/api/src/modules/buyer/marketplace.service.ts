import { PrismaClient, CropGrade, CropStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class MarketplaceService {
  async getAggregatedProducts(filters: {
    cropName?: string;
    category?: string;
    minGrade?: CropGrade;
    district?: string;
    state?: string;
    minQuantity?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const { 
      cropName, 
      category, 
      minGrade, 
      district, 
      state, 
      minQuantity, 
      maxPrice,
      page = 1, 
      limit = 20 
    } = filters;
    
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: CropStatus.LISTED,
      isAggregated: true
    };

    if (cropName) where.cropName = { contains: cropName, mode: 'insensitive' };
    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (minGrade) {
      const gradeOrder = { A: 3, B: 2, C: 1 };
      where.grade = { in: Object.keys(gradeOrder).filter(g => gradeOrder[g as CropGrade] >= gradeOrder[minGrade]) };
    }
    if (minQuantity) where.quantity = { gte: minQuantity };
    if (maxPrice) where.pricePerKg = { lte: maxPrice };

    // Get aggregated lots
    const [lots, total] = await Promise.all([
      prisma.aggregatedLot.findMany({
        where: {
          status: CropStatus.LISTED,
          ...(cropName && { cropName: { contains: cropName, mode: 'insensitive' } }),
          ...(minQuantity && { totalQuantity: { gte: minQuantity } }),
          ...(maxPrice && { pricePerKg: { lte: maxPrice } })
        },
        include: {
          fpo: {
            select: {
              id: true,
              name: true,
              district: true,
              state: true
            }
          },
          crops: {
            select: {
              id: true,
              quantity: true,
              grade: true,
              qualityCertUrl: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.aggregatedLot.count({
        where: {
          status: CropStatus.LISTED,
          ...(cropName && { cropName: { contains: cropName, mode: 'insensitive' } }),
          ...(minQuantity && { totalQuantity: { gte: minQuantity } }),
          ...(maxPrice && { pricePerKg: { lte: maxPrice } })
        }
      })
    ]);

    // Also get individual crops
    const [crops, cropsTotal] = await Promise.all([
      prisma.crop.findMany({
        where,
        include: {
          farmer: {
            select: {
              id: true,
              name: true,
              farm: {
                select: {
                  district: true,
                  state: true,
                  location: true
                }
              }
            }
          },
          fpoFarmer: {
            select: {
              id: true,
              name: true,
              district: true,
              fpo: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.crop.count({ where })
    ]);

    return {
      aggregatedLots: lots.map(lot => ({
        id: lot.id,
        type: 'AGGREGATED',
        cropName: lot.cropName,
        totalQuantity: lot.totalQuantity,
        pricePerKg: lot.pricePerKg,
        fpo: lot.fpo,
        qualityCertUrl: lot.qualityCertUrl,
        numberOfFarmers: lot.crops.length,
        averageGrade: this.calculateAverageGrade(lot.crops),
        createdAt: lot.createdAt
      })),
      individualCrops: crops.map(crop => ({
        id: crop.id,
        type: 'INDIVIDUAL',
        cropName: crop.cropName,
        category: crop.category,
        variety: crop.variety,
        quantity: crop.quantity,
        pricePerKg: crop.pricePerKg,
        grade: crop.grade,
        qualityCertUrl: crop.qualityCertUrl,
        supplier: crop.farmer || crop.fpoFarmer,
        location: crop.farmer?.farm || { district: crop.fpoFarmer?.district },
        createdAt: crop.createdAt
      })),
      pagination: {
        page,
        limit,
        totalLots: total,
        totalCrops: cropsTotal,
        totalPages: Math.ceil((total + cropsTotal) / limit)
      }
    };
  }

  async getProductDetails(productId: string, type: 'crop' | 'lot') {
    if (type === 'lot') {
      const lot = await prisma.aggregatedLot.findUnique({
        where: { id: productId },
        include: {
          fpo: {
            select: {
              id: true,
              name: true,
              district: true,
              state: true,
              registrationNo: true
            }
          },
          crops: {
            include: {
              fpoFarmer: {
                select: {
                  id: true,
                  name: true,
                  district: true
                }
              }
            }
          }
        }
      });

      if (!lot) throw new Error('Aggregated lot not found');

      return {
        ...lot,
        type: 'AGGREGATED',
        numberOfFarmers: lot.crops.length,
        averageGrade: this.calculateAverageGrade(lot.crops)
      };
    } else {
      const crop = await prisma.crop.findUnique({
        where: { id: productId },
        include: {
          farmer: {
            select: {
              id: true,
              name: true,
              phone: true,
              farm: true
            }
          },
          fpoFarmer: {
            select: {
              id: true,
              name: true,
              phone: true,
              district: true,
              fpo: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      if (!crop) throw new Error('Crop not found');

      return {
        ...crop,
        type: 'INDIVIDUAL',
        supplier: crop.farmer || crop.fpoFarmer
      };
    }
  }

  async getQualityCertificate(productId: string, type: 'crop' | 'lot') {
    const certificates = await prisma.qualityCertificate.findMany({
      where: type === 'crop' ? { cropId: productId } : { lotId: productId },
      orderBy: { uploadedAt: 'desc' }
    });

    return certificates;
  }

  private calculateAverageGrade(crops: any[]): string {
    if (crops.length === 0) return 'N/A';
    
    const gradeValues = { A: 3, B: 2, C: 1 };
    const sum = crops.reduce((acc, crop) => acc + (gradeValues[crop.grade as CropGrade] || 0), 0);
    const avg = sum / crops.length;
    
    if (avg >= 2.5) return 'A';
    if (avg >= 1.5) return 'B';
    return 'C';
  }

  async getAvailableFilters() {
    const [categories, locations, crops] = await Promise.all([
      prisma.crop.findMany({
        where: { status: CropStatus.LISTED },
        select: { category: true },
        distinct: ['category']
      }),
      prisma.farm.findMany({
        select: { district: true, state: true },
        distinct: ['district', 'state']
      }),
      prisma.crop.findMany({
        where: { status: CropStatus.LISTED },
        select: { cropName: true },
        distinct: ['cropName']
      })
    ]);

    return {
      categories: [...new Set(categories.map(c => c.category))],
      locations: locations.map(l => ({ district: l.district, state: l.state })),
      crops: [...new Set(crops.map(c => c.cropName))],
      grades: ['A', 'B', 'C']
    };
  }
}
