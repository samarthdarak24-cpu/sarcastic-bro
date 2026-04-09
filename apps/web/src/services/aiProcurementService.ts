// AI Procurement Service - Mock data for AI-powered procurement features

export interface SupplierMatch {
  id: string;
  name: string;
  matchScore: number;
  location: string;
  rating: number;
  totalOrders: number;
  avgDeliveryTime: string;
  specialties: string[];
  priceRange: string;
  verified: boolean;
}

export interface PriceOptimization {
  id: string;
  product: string;
  currentPrice: number;
  optimizedPrice: number;
  savings: number;
  savingsPercent: number;
  confidence: number;
  marketAverage: number;
  recommendation: string;
}

export interface DemandForecast {
  product: string;
  currentDemand: number;
  forecastedDemand: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: string;
  factors: string[];
}

export interface RiskAlert {
  id: string;
  type: 'supply' | 'price' | 'quality' | 'delivery';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affectedProducts: string[];
  recommendation: string;
  timestamp: string;
}

class AIProcurementService {
  // Get AI-matched suppliers based on requirements
  async getSupplierMatches(requirements: any): Promise<SupplierMatch[]> {
    // Mock data
    return [
      {
        id: 'SUP001',
        name: 'Green Valley Farms',
        matchScore: 95,
        location: 'Punjab, India',
        rating: 4.8,
        totalOrders: 234,
        avgDeliveryTime: '2-3 days',
        specialties: ['Basmati Rice', 'Wheat', 'Organic Produce'],
        priceRange: '₹40-45/kg',
        verified: true
      },
      {
        id: 'SUP002',
        name: 'Sunrise Agro Co.',
        matchScore: 92,
        location: 'Haryana, India',
        rating: 4.7,
        totalOrders: 189,
        avgDeliveryTime: '3-4 days',
        specialties: ['Rice', 'Pulses', 'Grains'],
        priceRange: '₹38-43/kg',
        verified: true
      },
      {
        id: 'SUP003',
        name: 'Golden Harvest Ltd.',
        matchScore: 88,
        location: 'Uttar Pradesh, India',
        rating: 4.6,
        totalOrders: 156,
        avgDeliveryTime: '4-5 days',
        specialties: ['Wheat', 'Rice', 'Vegetables'],
        priceRange: '₹42-47/kg',
        verified: true
      }
    ];
  }

  // Get price optimization recommendations
  async getPriceOptimizations(): Promise<PriceOptimization[]> {
    return [
      {
        id: 'OPT001',
        product: 'Basmati Rice (1000kg)',
        currentPrice: 45000,
        optimizedPrice: 42000,
        savings: 3000,
        savingsPercent: 6.7,
        confidence: 92,
        marketAverage: 43500,
        recommendation: 'Switch to Green Valley Farms for better pricing'
      },
      {
        id: 'OPT002',
        product: 'Wheat (500kg)',
        currentPrice: 18000,
        optimizedPrice: 16500,
        savings: 1500,
        savingsPercent: 8.3,
        confidence: 88,
        marketAverage: 17200,
        recommendation: 'Bulk order discount available from current supplier'
      },
      {
        id: 'OPT003',
        product: 'Organic Vegetables (200kg)',
        currentPrice: 12000,
        optimizedPrice: 11200,
        savings: 800,
        savingsPercent: 6.7,
        confidence: 85,
        marketAverage: 11800,
        recommendation: 'Consider seasonal procurement for better rates'
      }
    ];
  }

  // Get demand forecasts
  async getDemandForecasts(): Promise<DemandForecast[]> {
    return [
      {
        product: 'Basmati Rice',
        currentDemand: 1000,
        forecastedDemand: 1350,
        trend: 'up',
        confidence: 89,
        timeframe: 'Next 30 days',
        factors: ['Festival season', 'Export demand', 'Weather conditions']
      },
      {
        product: 'Wheat',
        currentDemand: 800,
        forecastedDemand: 750,
        trend: 'down',
        confidence: 82,
        timeframe: 'Next 30 days',
        factors: ['Harvest season', 'Market surplus']
      },
      {
        product: 'Organic Vegetables',
        currentDemand: 500,
        forecastedDemand: 520,
        trend: 'stable',
        confidence: 76,
        timeframe: 'Next 30 days',
        factors: ['Steady consumer demand', 'Seasonal availability']
      }
    ];
  }

  // Get risk alerts
  async getRiskAlerts(): Promise<RiskAlert[]> {
    return [
      {
        id: 'RISK001',
        type: 'supply',
        severity: 'high',
        title: 'Supply Chain Disruption',
        description: 'Heavy rainfall in Punjab may affect rice supply',
        affectedProducts: ['Basmati Rice', 'Wheat'],
        recommendation: 'Consider alternative suppliers or increase buffer stock',
        timestamp: '2 hours ago'
      },
      {
        id: 'RISK002',
        type: 'price',
        severity: 'medium',
        title: 'Price Volatility Alert',
        description: 'Wheat prices expected to increase by 8-12% next week',
        affectedProducts: ['Wheat'],
        recommendation: 'Lock in current prices with forward contracts',
        timestamp: '5 hours ago'
      },
      {
        id: 'RISK003',
        type: 'quality',
        severity: 'low',
        title: 'Quality Concern',
        description: 'Minor quality variations reported in recent vegetable batches',
        affectedProducts: ['Organic Vegetables'],
        recommendation: 'Request quality certificates for next order',
        timestamp: '1 day ago'
      }
    ];
  }

  // Get AI recommendations
  async getAIRecommendations(): Promise<any[]> {
    return [
      {
        id: 'REC001',
        type: 'cost-saving',
        title: 'Bulk Order Opportunity',
        description: 'Combine orders for Rice and Wheat to save 12% on logistics',
        potentialSavings: 5400,
        confidence: 91,
        action: 'Review and Apply'
      },
      {
        id: 'REC002',
        type: 'supplier',
        title: 'New Verified Supplier',
        description: 'Golden Harvest Ltd. offers 5% better rates for your requirements',
        potentialSavings: 2200,
        confidence: 87,
        action: 'View Supplier'
      },
      {
        id: 'REC003',
        type: 'timing',
        title: 'Optimal Purchase Window',
        description: 'Best time to purchase Wheat is in next 3-5 days',
        potentialSavings: 1800,
        confidence: 84,
        action: 'Set Reminder'
      }
    ];
  }
}

export const aiProcurementService = new AIProcurementService();
