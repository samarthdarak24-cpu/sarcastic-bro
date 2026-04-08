import api from './api';

export interface Rule {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'draft';
  conditions: {
    minPrice?: number;
    maxPrice?: number;
    sentiment?: string;
    inventoryLevel?: string;
    weatherCondition?: string;
    qualityThreshold?: number;
  };
  actions: {
    quantity?: number;
    pricingStrategy?: string;
    platforms?: string[];
    notifyBuyers?: boolean;
  };
  performance: {
    triggered: number;
    revenue: number;
    savings: number;
  };
  lastTriggered?: string;
  createdAt: string;
  userId: string;
}

export interface MarketData {
  currentPrice: number;
  trend: 'up' | 'down' | 'stable';
  sentiment: number;
  competitors: number;
  demand: number;
  forecast: {
    nextWeek: number;
    confidence: number;
  };
}

export interface Stats {
  totalRules: number;
  activeRules: number;
  totalRevenue: number;
  autoSales: number;
  avgProfit: number;
  successRate: number;
}

export interface PriceTrigger {
  id: string;
  productId: string;
  targetPrice: number;
  currentPrice: number;
  confidence: number;
  recommendation: string;
  factors: {
    demand: number;
    supply: number;
    seasonality: number;
    competition: number;
  };
}

export interface InventoryOptimization {
  productId: string;
  currentStock: number;
  optimalStock: number;
  storageCost: number;
  recommendation: string;
  urgency: 'low' | 'medium' | 'high';
  potentialSavings: number;
}

export interface BuyerPrediction {
  buyerId: string;
  buyerName: string;
  matchScore: number;
  preferredProducts: string[];
  avgOrderValue: number;
  reliability: number;
  lastPurchase: string;
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'drought' | 'storm' | 'frost';
  severity: 'low' | 'medium' | 'high';
  impact: string;
  recommendation: string;
  affectedProducts: string[];
  startDate: string;
  endDate: string;
}

export interface QualityMonitor {
  productId: string;
  productName: string;
  currentQuality: number;
  decayRate: number;
  daysRemaining: number;
  recommendedAction: string;
  priceAdjustment: number;
}

export interface CompetitorPrice {
  competitorId: string;
  competitorName: string;
  productName: string;
  price: number;
  priceChange: number;
  marketShare: number;
  lastUpdated: string;
}

class AutoSellService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  // Rules Management
  async getRules(): Promise<Rule[]> {
    try {
      const response = await axios.get(`${API_URL}/api/auto-sell/rules`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Failed to fetch rules:', error);
      return [];
    }
  }

  async createRule(ruleData: Partial<Rule>): Promise<Rule> {
    const response = await axios.post(`${API_URL}/api/auto-sell/rules`, ruleData, this.getAuthHeaders());
    return response.data;
  }

  async updateRule(ruleId: string, updates: Partial<Rule>): Promise<Rule> {
    const response = await axios.put(`${API_URL}/api/auto-sell/rules/${ruleId}`, updates, this.getAuthHeaders());
    return response.data;
  }

  async updateRuleStatus(ruleId: string, status: string): Promise<Rule> {
    const response = await axios.patch(
      `${API_URL}/api/auto-sell/rules/${ruleId}/status`,
      { status },
      this.getAuthHeaders()
    );
    return response.data;
  }

  async deleteRule(ruleId: string): Promise<void> {
    await axios.delete(`${API_URL}/api/auto-sell/rules/${ruleId}`, this.getAuthHeaders());
  }

  // Market Data
  async getMarketData(): Promise<MarketData> {
    try {
      const response = await axios.get(`${API_URL}/api/auto-sell/market-data`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      return {
        currentPrice: 75,
        trend: 'up',
        sentiment: 68,
        competitors: 24,
        demand: 82,
        forecast: { nextWeek: 78, confidence: 85 }
      };
    }
  }

  // Statistics
  async getStats(): Promise<Stats> {
    try {
      const response = await axios.get(`${API_URL}/api/auto-sell/stats`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return {
        totalRules: 0,
        activeRules: 0,
        totalRevenue: 0,
        autoSales: 0,
        avgProfit: 0,
        successRate: 0
      };
    }
  }

  // AI Price Trigger
  async getPriceTriggers(productId?: string): Promise<PriceTrigger[]> {
    const url = productId 
      ? `${API_URL}/api/auto-sell/price-triggers?productId=${productId}`
      : `${API_URL}/api/auto-sell/price-triggers`;
    const response = await axios.get(url, this.getAuthHeaders());
    return response.data;
  }

  async analyzePriceTrigger(productId: string, targetPrice: number): Promise<PriceTrigger> {
    const response = await axios.post(
      `${API_URL}/api/auto-sell/price-triggers/analyze`,
      { productId, targetPrice },
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Market Sentiment
  async getMarketSentiment(productType?: string): Promise<any> {
    const url = productType
      ? `${API_URL}/api/auto-sell/sentiment?productType=${productType}`
      : `${API_URL}/api/auto-sell/sentiment`;
    const response = await axios.get(url, this.getAuthHeaders());
    return response.data;
  }

  // Inventory Optimization
  async getInventoryOptimizations(): Promise<InventoryOptimization[]> {
    const response = await axios.get(`${API_URL}/api/auto-sell/inventory-optimization`, this.getAuthHeaders());
    return response.data;
  }

  async optimizeInventory(productId: string): Promise<InventoryOptimization> {
    const response = await axios.post(
      `${API_URL}/api/auto-sell/inventory-optimization/${productId}`,
      {},
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Seasonal Strategy
  async getSeasonalPatterns(productType: string): Promise<any> {
    const response = await axios.get(
      `${API_URL}/api/auto-sell/seasonal-patterns?productType=${productType}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async createSeasonalStrategy(strategyData: any): Promise<any> {
    const response = await axios.post(
      `${API_URL}/api/auto-sell/seasonal-strategy`,
      strategyData,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Multi-Platform Sync
  async syncToPlatforms(ruleId: string, platforms: string[]): Promise<any> {
    const response = await axios.post(
      `${API_URL}/api/auto-sell/multi-platform/sync`,
      { ruleId, platforms },
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getPlatformListings(): Promise<any[]> {
    const response = await axios.get(`${API_URL}/api/auto-sell/multi-platform/listings`, this.getAuthHeaders());
    return response.data;
  }

  // Buyer Behavior Prediction
  async getBuyerPredictions(): Promise<BuyerPrediction[]> {
    const response = await axios.get(`${API_URL}/api/auto-sell/buyer-predictions`, this.getAuthHeaders());
    return response.data;
  }

  async matchBuyers(productId: string): Promise<BuyerPrediction[]> {
    const response = await axios.post(
      `${API_URL}/api/auto-sell/buyer-predictions/match`,
      { productId },
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Weather-Based Auto-Sell
  async getWeatherAlerts(): Promise<WeatherAlert[]> {
    const response = await axios.get(`${API_URL}/api/auto-sell/weather-alerts`, this.getAuthHeaders());
    return response.data;
  }

  async createWeatherRule(ruleData: any): Promise<Rule> {
    const response = await axios.post(
      `${API_URL}/api/auto-sell/weather-rules`,
      ruleData,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Quality Decay Monitor
  async getQualityMonitors(): Promise<QualityMonitor[]> {
    const response = await axios.get(`${API_URL}/api/auto-sell/quality-monitors`, this.getAuthHeaders());
    return response.data;
  }

  async updateQualityStatus(productId: string, qualityData: any): Promise<QualityMonitor> {
    const response = await axios.put(
      `${API_URL}/api/auto-sell/quality-monitors/${productId}`,
      qualityData,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Competitive Price Tracker
  async getCompetitorPrices(productType?: string): Promise<CompetitorPrice[]> {
    const url = productType
      ? `${API_URL}/api/auto-sell/competitor-prices?productType=${productType}`
      : `${API_URL}/api/auto-sell/competitor-prices`;
    const response = await axios.get(url, this.getAuthHeaders());
    return response.data;
  }

  async trackCompetitor(competitorId: string): Promise<void> {
    await axios.post(
      `${API_URL}/api/auto-sell/competitor-prices/track`,
      { competitorId },
      this.getAuthHeaders()
    );
  }

  // Profit Maximizer
  async getProfitOptimization(productId: string): Promise<any> {
    const response = await axios.get(
      `${API_URL}/api/auto-sell/profit-optimization/${productId}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async optimizeProfit(productId: string, constraints: any): Promise<any> {
    const response = await axios.post(
      `${API_URL}/api/auto-sell/profit-optimization/${productId}`,
      constraints,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Rule Execution
  async executeRule(ruleId: string): Promise<any> {
    const response = await axios.post(
      `${API_URL}/api/auto-sell/rules/${ruleId}/execute`,
      {},
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Analytics
  async getRulePerformance(ruleId: string, period: string = '30d'): Promise<any> {
    const response = await axios.get(
      `${API_URL}/api/auto-sell/rules/${ruleId}/performance?period=${period}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  async getRevenueAnalytics(period: string = '30d'): Promise<any> {
    const response = await axios.get(
      `${API_URL}/api/auto-sell/analytics/revenue?period=${period}`,
      this.getAuthHeaders()
    );
    return response.data;
  }
}

export const autoSellService = new AutoSellService();
