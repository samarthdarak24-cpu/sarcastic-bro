import prisma from '../../prisma/client';

export class AggregationService {
  // Find nearby farmers with similar crops
  async findNearbyFarmers(farmerId: string, crop: string, maxDistance: number = 50) {
    try {
      // Get the farmer's location
      const farmer = await prisma.user.findUnique({
        where: { id: farmerId },
        select: { location: true }
      });

      if (!farmer) {
        throw new Error('Farmer not found');
      }

      // Find farmers with similar crops (mock implementation)
      const nearbyFarmers = await prisma.user.findMany({
        where: {
          role: 'FARMER',
          id: { not: farmerId },
        },
        select: {
          id: true,
          fullName: true,
          location: true,
          products: {
            where: {
              category: crop,
              isActive: true
            },
            select: {
              id: true,
              name: true,
              quantity: true,
              unit: true,
              price: true
            }
          }
        },
        take: 10
      });

      return nearbyFarmers.filter(f => f.products.length > 0);
    } catch (error) {
      console.error('Error finding nearby farmers:', error);
      return [];
    }
  }

  // Auto-cluster farmers for bulk aggregation
  async autoCluster(crop: string, region: string, minQuantity: number = 400, maxQuantity: number = 1000) {
    try {
      // Find all farmers with the specified crop in the region
      const farmers = await prisma.user.findMany({
        where: {
          role: 'FARMER',
          location: { contains: region }
        },
        include: {
          products: {
            where: {
              category: crop,
              isActive: true
            }
          }
        }
      });

      // Group farmers into clusters based on quantity
      const clusters: any[] = [];
      let currentCluster: any = {
        id: `cluster-${Date.now()}`,
        crop,
        region,
        farmers: [],
        totalQuantity: 0,
        avgPrice: 0,
        status: 'forming'
      };

      for (const farmer of farmers) {
        for (const product of farmer.products) {
          if (currentCluster.totalQuantity + product.quantity <= maxQuantity) {
            currentCluster.farmers.push({
              farmerId: farmer.id,
              farmerName: farmer.fullName,
              productId: product.id,
              quantity: product.quantity,
              price: product.price
            });
            currentCluster.totalQuantity += product.quantity;
          }

          if (currentCluster.totalQuantity >= minQuantity) {
            // Calculate average price
            const totalPrice = currentCluster.farmers.reduce((sum: number, f: any) => sum + (f.price * f.quantity), 0);
            currentCluster.avgPrice = totalPrice / currentCluster.totalQuantity;
            clusters.push({ ...currentCluster });

            // Start new cluster
            currentCluster = {
              id: `cluster-${Date.now()}-${clusters.length}`,
              crop,
              region,
              farmers: [],
              totalQuantity: 0,
              avgPrice: 0,
              status: 'forming'
            };
          }
        }
      }

      return clusters;
    } catch (error) {
      console.error('Error auto-clustering:', error);
      return [];
    }
  }

  // Get farmer's contributions to bulk lots
  async getMyContributions(farmerId: string) {
    try {
      // Mock implementation - return sample data
      return [
        {
          id: '1',
          lotId: 'lot-001',
          crop: 'Tomatoes',
          quantity: 200,
          status: 'active',
          earnings: 12000,
          joinedAt: new Date()
        }
      ];
    } catch (error) {
      console.error('Error getting contributions:', error);
      return [];
    }
  }

  // Join a bulk lot
  async joinBulkLot(farmerId: string, lotId: string, productId: string) {
    try {
      // Verify product exists and belongs to farmer
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          farmerId: farmerId
        }
      });

      if (!product) {
        throw new Error('Product not found or does not belong to farmer');
      }

      // Mock implementation - return success
      return {
        success: true,
        lotId,
        productId,
        quantity: product.quantity,
        estimatedEarnings: product.price * product.quantity * 1.15, // 15% premium for bulk
        message: 'Successfully joined bulk lot'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to join bulk lot');
    }
  }

  // Get available lots for buyers
  async getAvailableLots(filters: any) {
    try {
      // Mock implementation - return sample lots
      const lots = [
        {
          id: 'lot-001',
          crop: 'Tomatoes',
          totalQuantity: 800,
          avgPrice: 55,
          quality: 'A',
          region: 'Maharashtra',
          farmersCount: 4,
          status: 'ready',
          verifiedFarmers: true
        },
        {
          id: 'lot-002',
          crop: 'Onions',
          totalQuantity: 1200,
          avgPrice: 32,
          quality: 'B',
          region: 'Maharashtra',
          farmersCount: 6,
          status: 'forming',
          verifiedFarmers: true
        }
      ];

      // Apply filters
      let filteredLots = lots;
      if (filters.crop) {
        filteredLots = filteredLots.filter(lot => lot.crop.toLowerCase().includes(filters.crop.toLowerCase()));
      }
      if (filters.region) {
        filteredLots = filteredLots.filter(lot => lot.region.toLowerCase().includes(filters.region.toLowerCase()));
      }
      if (filters.verifiedOnly) {
        filteredLots = filteredLots.filter(lot => lot.verifiedFarmers);
      }

      return filteredLots;
    } catch (error) {
      console.error('Error getting available lots:', error);
      return [];
    }
  }

  // Calculate potential earnings from bulk aggregation
  async calculatePotentialEarnings(quantity: number, crop: string, currentPrice: number) {
    try {
      const bulkPremium = 0.15; // 15% premium for bulk
      const qualityBonus = 0.05; // 5% bonus for quality certification
      const logisticsSavings = 0.03; // 3% savings on logistics

      const baseEarnings = quantity * currentPrice;
      const premiumEarnings = baseEarnings * (1 + bulkPremium + qualityBonus + logisticsSavings);
      const additionalEarnings = premiumEarnings - baseEarnings;

      return {
        baseEarnings,
        premiumEarnings,
        additionalEarnings,
        percentageIncrease: ((premiumEarnings - baseEarnings) / baseEarnings) * 100,
        breakdown: {
          bulkPremium: baseEarnings * bulkPremium,
          qualityBonus: baseEarnings * qualityBonus,
          logisticsSavings: baseEarnings * logisticsSavings
        }
      };
    } catch (error) {
      console.error('Error calculating earnings:', error);
      throw error;
    }
  }
}

export const aggregationService = new AggregationService();
