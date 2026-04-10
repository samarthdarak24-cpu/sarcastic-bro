import prisma from '../../prisma/client';
import { CropGrade } from '@prisma/client';

interface AggregationCriteria {
  cropName: string;
  variety: string;
  grade: CropGrade;
  category: string;
}

export class AggregationService {
  /**
   * Get products eligible for aggregation
   * Groups by: same crop type + grade + location
   */
  async getEligibleProducts(fpoUserId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    // Get all non-aggregated products
    const products = await prisma.crop.findMany({
      where: {
        fpoId: fpo.id,
        status: 'LISTED',
        isAggregated: false
      },
      include: {
        fpoFarmer: {
          select: {
            id: true,
            name: true,
            district: true
          }
        }
      }
    });

    // Group by crop name, variety, grade, and category
    const grouped = products.reduce((acc: any, product) => {
      const key = `${product.cropName}_${product.variety}_${product.grade}_${product.category}`;
      
      if (!acc[key]) {
        acc[key] = {
          cropName: product.cropName,
          variety: product.variety,
          grade: product.grade,
          category: product.category,
          products: [],
          totalQuantity: 0,
          avgPrice: 0,
          farmerCount: 0
        };
      }

      acc[key].products.push(product);
      acc[key].totalQuantity += product.quantity;
      
      return acc;
    }, {});

    // Calculate weighted average price and farmer count
    Object.keys(grouped).forEach(key => {
      const group = grouped[key];
      const totalValue = group.products.reduce((sum: number, p: any) => 
        sum + (p.quantity * p.pricePerKg), 0
      );
      group.avgPrice = totalValue / group.totalQuantity;
      group.farmerCount = new Set(group.products.map((p: any) => p.fpoFarmerId)).size;
    });

    return Object.values(grouped);
  }

  /**
   * Create aggregated lot from selected products
   */
  async createAggregatedLot(fpoUserId: string, criteria: AggregationCriteria, productIds: string[]) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    // Verify all products belong to FPO and match criteria
    const products = await prisma.crop.findMany({
      where: {
        id: { in: productIds },
        fpoId: fpo.id,
        status: 'LISTED',
        isAggregated: false,
        cropName: criteria.cropName,
        variety: criteria.variety,
        grade: criteria.grade,
        category: criteria.category
      }
    });

    if (products.length !== productIds.length) {
      throw new Error('Some products are invalid or already aggregated');
    }

    // Calculate total quantity and weighted average price
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.pricePerKg), 0);
    const avgPrice = totalValue / totalQuantity;

    // Create aggregated lot
    const lot = await prisma.aggregatedLot.create({
      data: {
        fpoId: fpo.id,
        cropName: criteria.cropName,
        totalQuantity,
        pricePerKg: avgPrice,
        status: 'LISTED'
      }
    });

    // Update products to mark as aggregated
    await prisma.crop.updateMany({
      where: { id: { in: productIds } },
      data: {
        isAggregated: true,
        aggregatedLotId: lot.id
      }
    });

    return lot;
  }

  /**
   * Get aggregated lots
   */
  async getAggregatedLots(fpoUserId: string, filters: any) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const where: any = { fpoId: fpo.id };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.cropName) {
      where.cropName = { contains: filters.cropName, mode: 'insensitive' };
    }

    const [lots, total] = await Promise.all([
      prisma.aggregatedLot.findMany({
        where,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          crops: {
            include: {
              fpoFarmer: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          _count: {
            select: { crops: true }
          }
        }
      }),
      prisma.aggregatedLot.count({ where })
    ]);

    return {
      lots,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit)
      }
    };
  }

  /**
   * Get lot details with farmer contributions
   */
  async getLotDetails(fpoUserId: string, lotId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const lot = await prisma.aggregatedLot.findFirst({
      where: {
        id: lotId,
        fpoId: fpo.id
      },
      include: {
        crops: {
          include: {
            fpoFarmer: true
          }
        }
      }
    });

    if (!lot) {
      throw new Error('Aggregated lot not found');
    }

    // Calculate farmer contributions
    const farmerContributions = lot.crops.reduce((acc: any, crop) => {
      const farmerId = crop.fpoFarmerId;
      if (!farmerId) return acc;

      if (!acc[farmerId]) {
        acc[farmerId] = {
          farmer: crop.fpoFarmer,
          quantity: 0,
          percentage: 0,
          value: 0
        };
      }

      acc[farmerId].quantity += crop.quantity;
      acc[farmerId].value += crop.quantity * crop.pricePerKg;

      return acc;
    }, {});

    // Calculate percentages
    Object.keys(farmerContributions).forEach(farmerId => {
      const contribution = farmerContributions[farmerId];
      contribution.percentage = (contribution.quantity / lot.totalQuantity) * 100;
    });

    return {
      ...lot,
      farmerContributions: Object.values(farmerContributions)
    };
  }

  /**
   * Dissolve aggregated lot (break back into individual products)
   */
  async dissolveLot(fpoUserId: string, lotId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const lot = await prisma.aggregatedLot.findFirst({
      where: {
        id: lotId,
        fpoId: fpo.id,
        status: 'LISTED' // Can only dissolve unsold lots
      }
    });

    if (!lot) {
      throw new Error('Lot not found or cannot be dissolved');
    }

    // Update products back to non-aggregated
    await prisma.crop.updateMany({
      where: { aggregatedLotId: lotId },
      data: {
        isAggregated: false,
        aggregatedLotId: null
      }
    });

    // Delete the lot
    await prisma.aggregatedLot.delete({
      where: { id: lotId }
    });
  }
}
