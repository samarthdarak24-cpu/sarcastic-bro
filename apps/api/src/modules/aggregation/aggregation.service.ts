import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FarmerLocation {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

interface ProductListing {
  id: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  quantity: number;
  quality: number;
  pricePerKg: number;
  location: string;
  latitude: number;
  longitude: number;
  harvestDate: Date;
  status: 'available' | 'aggregating' | 'aggregated';
}

interface BulkLot {
  id: string;
  name: string;
  crop: string;
  totalQuantity: number;
  farmers: {
    id: string;
    name: string;
    contribution: number;
    percentage: number;
    quality: number;
  }[];
  avgQuality: number;
  bulkPrice: number;
  individualPrice: number;
  savings: number;
  location: string;
  region: string;
  status: 'forming' | 'ready' | 'published' | 'sold';
  formationProgress: number;
  createdAt: Date;
  estimatedCompletion: Date;
}

export class AggregationService {
  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Find nearby farmers with similar crops
  async findNearbyFarmers(
    farmerId: string,
    crop: string,
    maxDistance: number = 50 // km
  ): Promise<FarmerLocation[]> {
    try {
      // Get the farmer's location
      const farmer = await prisma.user.findUnique({
        where: { id: farmerId },
        select: {
          id: true,
          fullName: true,
          district: true,
          state: true,
        },
      });

      if (!farmer) {
        throw new Error('Farmer not found');
      }

      // Mock coordinates for demo (in production, use actual geocoding)
      const farmerCoords = this.getCoordinatesForLocation(farmer.district || 'Pune');

      // Find other farmers with the same crop
      const products = await prisma.product.findMany({
        where: {
          name: {
            contains: crop,
            mode: 'insensitive',
          },
          isActive: true,
          userId: {
            not: farmerId,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              district: true,
              state: true,
            },
          },
        },
        take: 20,
      });

      // Calculate distances and filter
      const nearbyFarmers: FarmerLocation[] = products
        .map((product) => {
          const coords = this.getCoordinatesForLocation(
            product.user.district || 'Pune'
          );
          const distance = this.calculateDistance(
            farmerCoords.lat,
            farmerCoords.lon,
            coords.lat,
            coords.lon
          );

          return {
            id: product.user.id,
            name: product.user.fullName,
            location: product.user.district || 'Unknown',
            latitude: coords.lat,
            longitude: coords.lon,
            distance: Math.round(distance),
          };
        })
        .filter((f) => f.distance <= maxDistance)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

      return nearbyFarmers;
    } catch (error) {
      console.error('Error finding nearby farmers:', error);
      return [];
    }
  }

  // Auto-cluster farmers into bulk lots
  async autoCluster(
    crop: string,
    region: string,
    minQuantity: number = 400,
    maxQuantity: number = 1000
  ): Promise<BulkLot[]> {
    try {
      // Get all available products for this crop
      const products = await prisma.product.findMany({
        where: {
          name: {
            contains: crop,
            mode: 'insensitive',
          },
          isActive: true,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              district: true,
              state: true,
            },
          },
        },
      });

      // Group by region
      const regionalProducts = products.filter(
        (p) => p.user.state === region || p.user.district === region
      );

      // Create clusters
      const clusters: BulkLot[] = [];
      let currentCluster: ProductListing[] = [];
      let totalQuantity = 0;

      for (const product of regionalProducts) {
        const coords = this.getCoordinatesForLocation(product.user.district || 'Pune');
        
        currentCluster.push({
          id: product.id,
          farmerId: product.userId,
          farmerName: product.user.fullName,
          crop: product.name,
          quantity: product.quantity,
          quality: this.calculateQualityScore(product),
          pricePerKg: product.price,
          location: product.user.district || 'Unknown',
          latitude: coords.lat,
          longitude: coords.lon,
          harvestDate: product.createdAt,
          status: 'available',
        });

        totalQuantity += product.quantity;

        // If cluster reaches optimal size, create bulk lot
        if (totalQuantity >= minQuantity && totalQuantity <= maxQuantity) {
          const lot = this.createBulkLot(currentCluster, region);
          clusters.push(lot);
          currentCluster = [];
          totalQuantity = 0;
        }
      }

      return clusters;
    } catch (error) {
      console.error('Error auto-clustering:', error);
      return [];
    }
  }

  // Create a bulk lot from clustered products
  private createBulkLot(products: ProductListing[], region: string): BulkLot {
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const avgQuality = products.reduce((sum, p) => sum + p.quality, 0) / products.length;
    const avgPrice = products.reduce((sum, p) => sum + p.pricePerKg, 0) / products.length;

    // Calculate bulk premium (15-20% more than individual)
    const bulkPremium = 1.15 + Math.random() * 0.05; // 15-20%
    const bulkPrice = Math.round(avgPrice * bulkPremium);
    const savings = Math.round(((bulkPrice - avgPrice) / avgPrice) * 100);

    const farmers = products.map((p) => ({
      id: p.farmerId,
      name: p.farmerName,
      contribution: p.quantity,
      percentage: Math.round((p.quantity / totalQuantity) * 100),
      quality: p.quality,
    }));

    const formationProgress = Math.min(
      100,
      Math.round((totalQuantity / 500) * 100)
    );

    return {
      id: `LOT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Premium ${products[0].crop} - ${region}`,
      crop: products[0].crop,
      totalQuantity,
      farmers,
      avgQuality: Math.round(avgQuality),
      bulkPrice,
      individualPrice: Math.round(avgPrice),
      savings,
      location: products[0].location,
      region,
      status: formationProgress >= 80 ? 'ready' : 'forming',
      formationProgress,
      createdAt: new Date(),
      estimatedCompletion: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    };
  }

  // Calculate quality score from product data
  private calculateQualityScore(product: any): number {
    // Base score from product grade
    let score = 85;

    if (product.qualityGrade === 'A') score = 95;
    else if (product.qualityGrade === 'B') score = 85;
    else if (product.qualityGrade === 'C') score = 75;

    // Add randomness for demo
    score += Math.floor(Math.random() * 5);

    return Math.min(100, score);
  }

  // Get mock coordinates for locations (in production, use geocoding API)
  private getCoordinatesForLocation(location: string): { lat: number; lon: number } {
    const locations: { [key: string]: { lat: number; lon: number } } = {
      Pune: { lat: 18.5204, lon: 73.8567 },
      Mumbai: { lat: 19.076, lon: 72.8777 },
      Nashik: { lat: 19.9975, lon: 73.7898 },
      Aurangabad: { lat: 19.8762, lon: 75.3433 },
      Nagpur: { lat: 21.1458, lon: 79.0882 },
      Solapur: { lat: 17.6599, lon: 75.9064 },
      Kolhapur: { lat: 16.7050, lon: 74.2433 },
      Satara: { lat: 17.6805, lon: 74.0183 },
      Sangli: { lat: 16.8524, lon: 74.5815 },
      Ahmednagar: { lat: 19.0948, lon: 74.7480 },
    };

    return locations[location] || locations['Pune'];
  }

  // Get farmer's contribution to bulk lots
  async getMyContributions(farmerId: string): Promise<any[]> {
    try {
      // In production, query actual bulk lot participation
      // For demo, return mock data
      return [
        {
          id: '1',
          crop: 'Organic Tomatoes',
          quantity: 50,
          lotId: 'LOT-2024-001',
          lotName: 'Premium Tomatoes - North Region',
          status: 'active',
          earnings: 2400,
          bulkPrice: 48,
          individualPrice: 42,
          savings: 14,
          joinedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          id: '2',
          crop: 'Fresh Mangoes',
          quantity: 30,
          lotId: 'LOT-2024-002',
          lotName: 'Organic Mangoes - West Region',
          status: 'forming',
          earnings: 3750,
          bulkPrice: 125,
          individualPrice: 110,
          savings: 13,
          joinedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
      ];
    } catch (error) {
      console.error('Error getting contributions:', error);
      return [];
    }
  }

  // Join a bulk lot
  async joinBulkLot(farmerId: string, lotId: string, productId: string): Promise<any> {
    try {
      // In production, create actual participation record
      // For demo, return success
      return {
        success: true,
        message: 'Successfully joined bulk lot',
        lotId,
        estimatedEarnings: 2400,
        bulkPremium: 15,
      };
    } catch (error) {
      console.error('Error joining bulk lot:', error);
      throw error;
    }
  }

  // Get available bulk lots for buyers
  async getAvailableLots(filters?: {
    crop?: string;
    minQuality?: number;
    maxPrice?: number;
    region?: string;
    verifiedOnly?: boolean;
  }): Promise<BulkLot[]> {
    try {
      // In production, query actual bulk lots
      // For demo, return mock data with filters applied
      let lots: BulkLot[] = [
        {
          id: 'LOT-2024-001',
          name: 'Premium Organic Tomatoes',
          crop: 'Tomatoes',
          totalQuantity: 500,
          farmers: [
            { id: 'F1', name: 'Rajesh Kumar', contribution: 50, percentage: 10, quality: 92 },
            { id: 'F2', name: 'Amit Sharma', contribution: 75, percentage: 15, quality: 88 },
            { id: 'F3', name: 'Suresh Patil', contribution: 60, percentage: 12, quality: 90 },
            { id: 'F4', name: 'Prakash Desai', contribution: 80, percentage: 16, quality: 94 },
            { id: 'F5', name: 'Vijay Pawar', contribution: 55, percentage: 11, quality: 89 },
            { id: 'F6', name: 'Ramesh Yadav', contribution: 45, percentage: 9, quality: 91 },
            { id: 'F7', name: 'Ganesh Bhosale', contribution: 50, percentage: 10, quality: 93 },
            { id: 'F8', name: 'Santosh Jadhav', contribution: 40, percentage: 8, quality: 87 },
            { id: 'F9', name: 'Mohan Singh', contribution: 45, percentage: 9, quality: 90 },
          ],
          avgQuality: 91,
          bulkPrice: 48,
          individualPrice: 42,
          savings: 14,
          location: 'Pune',
          region: 'Maharashtra',
          status: 'ready',
          formationProgress: 100,
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
          estimatedCompletion: new Date(),
        },
        {
          id: 'LOT-2024-002',
          name: 'Fresh Alphonso Mangoes',
          crop: 'Mangoes',
          totalQuantity: 800,
          farmers: [
            { id: 'F10', name: 'Prakash Desai', contribution: 100, percentage: 12.5, quality: 95 },
            { id: 'F11', name: 'Vijay Pawar', contribution: 80, percentage: 10, quality: 92 },
            { id: 'F12', name: 'Ramesh Yadav', contribution: 90, percentage: 11.25, quality: 94 },
            { id: 'F13', name: 'Ganesh Bhosale', contribution: 85, percentage: 10.6, quality: 93 },
            { id: 'F14', name: 'Santosh Jadhav', contribution: 75, percentage: 9.4, quality: 96 },
            { id: 'F15', name: 'Mohan Singh', contribution: 95, percentage: 11.9, quality: 94 },
            { id: 'F16', name: 'Suresh Patil', contribution: 88, percentage: 11, quality: 95 },
            { id: 'F17', name: 'Amit Sharma', contribution: 92, percentage: 11.5, quality: 93 },
            { id: 'F18', name: 'Rajesh Kumar', contribution: 95, percentage: 11.9, quality: 96 },
          ],
          avgQuality: 94,
          bulkPrice: 125,
          individualPrice: 110,
          savings: 13,
          location: 'Ratnagiri',
          region: 'Maharashtra',
          status: 'ready',
          formationProgress: 100,
          createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
          estimatedCompletion: new Date(),
        },
      ];

      // Apply filters
      if (filters) {
        if (filters.crop) {
          lots = lots.filter((lot) =>
            lot.crop.toLowerCase().includes(filters.crop!.toLowerCase())
          );
        }
        if (filters.minQuality) {
          lots = lots.filter((lot) => lot.avgQuality >= filters.minQuality!);
        }
        if (filters.maxPrice) {
          lots = lots.filter((lot) => lot.bulkPrice <= filters.maxPrice!);
        }
        if (filters.region) {
          lots = lots.filter((lot) =>
            lot.region.toLowerCase().includes(filters.region!.toLowerCase())
          );
        }
      }

      return lots;
    } catch (error) {
      console.error('Error getting available lots:', error);
      return [];
    }
  }

  // Calculate potential earnings for a farmer
  async calculatePotentialEarnings(
    quantity: number,
    crop: string,
    currentPrice: number
  ): Promise<{
    individualEarnings: number;
    bulkEarnings: number;
    difference: number;
    percentageIncrease: number;
    bulkPrice: number;
  }> {
    // Calculate bulk premium (15-20%)
    const bulkPremium = 1.15 + Math.random() * 0.05;
    const bulkPrice = Math.round(currentPrice * bulkPremium);

    const individualEarnings = quantity * currentPrice;
    const bulkEarnings = quantity * bulkPrice;
    const difference = bulkEarnings - individualEarnings;
    const percentageIncrease = Math.round((difference / individualEarnings) * 100);

    return {
      individualEarnings,
      bulkEarnings,
      difference,
      percentageIncrease,
      bulkPrice,
    };
  }
}

export const aggregationService = new AggregationService();
