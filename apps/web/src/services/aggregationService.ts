import api from './api';

export interface NearbyFarmer {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  distance: number;
}

export interface BulkLot {
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

export interface FarmerContribution {
  id: string;
  crop: string;
  quantity: number;
  lotId: string;
  lotName: string;
  status: 'active' | 'forming' | 'completed';
  earnings: number;
  bulkPrice: number;
  individualPrice: number;
  savings: number;
  joinedAt: Date;
}

export interface EarningsCalculation {
  individualEarnings: number;
  bulkEarnings: number;
  difference: number;
  percentageIncrease: number;
  bulkPrice: number;
}

class AggregationService {
  // Find nearby farmers for clustering
  async findNearbyFarmers(
    farmerId: string,
    crop: string,
    maxDistance: number = 50
  ): Promise<NearbyFarmer[]> {
    return this.getMockNearbyFarmers();
  }

  // Auto-cluster farmers into bulk lots
  async autoCluster(
    crop: string,
    region: string,
    minQuantity: number = 400,
    maxQuantity: number = 1000
  ): Promise<BulkLot[]> {
    return [];
  }

  // Get farmer's contributions to bulk lots
  async getMyContributions(farmerId: string): Promise<FarmerContribution[]> {
    return this.getMockContributions();
  }

  // Join a bulk lot
  async joinBulkLot(
    farmerId: string,
    lotId: string,
    productId: string
  ): Promise<{ success: boolean; message: string; estimatedEarnings: number }> {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/trust/aggregation-lots/${lotId}/join`, {
        method: 'POST'
      });
      const data = await response.json();
      return { success: data.status === 'success', message: 'Joined lot successfully', estimatedEarnings: 5000 };
    } catch (error) {
       console.error('Join lot error:', error);
       return { success: false, message: 'Failed to join', estimatedEarnings: 0 };
    }
  }

  async getAvailableLots(filters?: {
    crop?: string;
    minQuality?: number;
    maxPrice?: number;
    region?: string;
    verifiedOnly?: boolean;
  }): Promise<BulkLot[]> {
    try {
      const response = await fetch('http://localhost:8000/api/v1/trust/aggregation-lots');
      const data = await response.json();
      
      return data.map((lot: any) => ({
        id: lot.id,
        name: `Bulk ${lot.commodity} Lot`,
        crop: lot.commodity,
        totalQuantity: lot.total_quantity * 1000,
        farmersCount: lot.farmer_count,
        avgQuality: 92,
        trustScore: 95,
        pricePerKg: lot.target_price,
        savings: 15,
        location: 'Regional Cluster',
        distance: 12,
        status: 'available',
        harvestDate: '2024-11-20',
        deliveryTime: '2-3 Days',
        blockchainVerified: true,
        aiCertified: true,
        qualityTrend: Array.from({length: 10}, (_, i) => ({day: `Day ${i}`, score: 85 + Math.random() * 10}))
      }));
    } catch (error) {
      console.log('📦 Using mock data for available lots (backend error)');
      return this.getMockAvailableLots();
    }
  }

  // Calculate potential earnings
  async calculateEarnings(
    quantity: number,
    crop: string,
    currentPrice: number
  ): Promise<EarningsCalculation> {
    // Simulated calculation
    return this.getMockEarningsCalculation(quantity, currentPrice);
  }

  // Mock data for demo (when backend is not available)
  private getMockNearbyFarmers(): NearbyFarmer[] {
    return [
      { id: 'NF1', name: 'Ramesh Yadav', location: 'Pune', latitude: 18.5204, longitude: 73.8567, distance: 3 },
      { id: 'NF2', name: 'Ganesh Bhosale', location: 'Pune', latitude: 18.5304, longitude: 73.8667, distance: 7 },
      { id: 'NF3', name: 'Santosh Jadhav', location: 'Pune', latitude: 18.5404, longitude: 73.8767, distance: 10 },
      { id: 'NF4', name: 'Mohan Singh', location: 'Pune', latitude: 18.5104, longitude: 73.8467, distance: 12 },
      { id: 'NF5', name: 'Prakash Desai', location: 'Nashik', latitude: 19.9975, longitude: 73.7898, distance: 15 },
    ];
  }

  private getMockContributions(): FarmerContribution[] {
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
      {
        id: '3',
        crop: 'Basmati Rice',
        quantity: 100,
        lotId: 'LOT-2024-003',
        lotName: 'Premium Rice - Central Region',
        status: 'completed',
        earnings: 8500,
        bulkPrice: 85,
        individualPrice: 75,
        savings: 13,
        joinedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
      },
    ];
  }

  private getMockAvailableLots(): BulkLot[] {
    return [
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
      {
        id: 'LOT-2024-003',
        name: 'Premium Basmati Rice',
        crop: 'Rice',
        totalQuantity: 1200,
        farmers: [
          { id: 'F19', name: 'Ramesh Yadav', contribution: 120, percentage: 10, quality: 90 },
          { id: 'F20', name: 'Ganesh Bhosale', contribution: 150, percentage: 12.5, quality: 92 },
          { id: 'F21', name: 'Santosh Jadhav', contribution: 100, percentage: 8.3, quality: 89 },
          { id: 'F22', name: 'Mohan Singh', contribution: 130, percentage: 10.8, quality: 91 },
          { id: 'F23', name: 'Prakash Desai', contribution: 140, percentage: 11.7, quality: 93 },
          { id: 'F24', name: 'Vijay Pawar', contribution: 110, percentage: 9.2, quality: 90 },
          { id: 'F25', name: 'Suresh Patil', contribution: 125, percentage: 10.4, quality: 92 },
          { id: 'F26', name: 'Amit Sharma', contribution: 135, percentage: 11.25, quality: 91 },
          { id: 'F27', name: 'Rajesh Kumar', contribution: 115, percentage: 9.6, quality: 94 },
          { id: 'F28', name: 'Anil Pawar', contribution: 75, percentage: 6.25, quality: 88 },
        ],
        avgQuality: 91,
        bulkPrice: 85,
        individualPrice: 75,
        savings: 13,
        location: 'Nashik',
        region: 'Maharashtra',
        status: 'ready',
        formationProgress: 100,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        estimatedCompletion: new Date(),
      },
    ];
  }

  private getMockEarningsCalculation(
    quantity: number,
    currentPrice: number
  ): EarningsCalculation {
    const bulkPremium = 1.15 + Math.random() * 0.05; // 15-20%
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
