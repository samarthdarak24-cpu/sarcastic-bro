import api from './api';

export interface QualityGradeResult {
  grade: string;
  score: number;
  defects: string[];
  recommendations: string[];
  imageAnalysis?: any;
}

export interface PricePrediction {
  predictedPrice: number;
  confidence: number;
  factors: string[];
  marketTrends: any[];
}

export interface DemandForecast {
  product: string;
  forecast: {
    date: string;
    demand: number;
    confidence: number;
  }[];
  insights: string[];
}

export const aiService = {
  // Quality grading
  async gradeQuality(productId: string, imageUrl?: string): Promise<QualityGradeResult> {
    const response = await api.post('/ai/quality-grade', { productId, imageUrl });
    return response.data;
  },

  // Price prediction
  async predictPrice(productData: {
    name: string;
    category: string;
    quantity: number;
    district?: string;
    state?: string;
  }): Promise<PricePrediction> {
    const response = await api.post('/ai/price-prediction', productData);
    return response.data;
  },

  // Demand forecasting
  async forecastDemand(productCategory: string, timeframe: string = '30d'): Promise<DemandForecast> {
    const response = await api.post('/ai/demand-forecast', { productCategory, timeframe });
    return response.data;
  },

  // Crop recommendations
  async getCropRecommendations(location: { district: string; state: string }): Promise<any> {
    const response = await api.post('/ai/crop-recommendations', location);
    return response.data;
  },

  // Pest detection
  async detectPest(imageUrl: string): Promise<any> {
    const response = await api.post('/ai/pest-detection', { imageUrl });
    return response.data;
  },

  // Yield prediction
  async predictYield(cropData: any): Promise<any> {
    const response = await api.post('/ai/yield-prediction', cropData);
    return response.data;
  },

  // Smart buyer matching
  async matchBuyers(productId: string): Promise<any[]> {
    const response = await api.post('/ai/match-buyers', { productId });
    return response.data;
  },

  // Smart supplier matching (for buyers)
  async matchSuppliers(requirements: any): Promise<any[]> {
    const response = await api.post('/ai/match-suppliers', requirements);
    return response.data;
  },

  // Behavioral insights
  async getBehavioralInsights(): Promise<any> {
    const response = await api.get('/ai/behavioral-insights');
    return response.data;
  },

  // Product Hub - Optimize Product
  async optimizeProduct(productId: string): Promise<any> {
    try {
      const response = await api.post(`/product-hub/optimize/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Optimize product error:', error);
      return { success: false };
    }
  },

  // Product Hub - Get Pricing Recommendations
  async getPricingRecommendations(): Promise<any> {
    try {
      const response = await api.get('/product-hub/pricing/recommendations');
      return response.data;
    } catch (error) {
      console.error('Get pricing recommendations error:', error);
      return { data: {} };
    }
  },

  // Product Hub - Analyze Quality
  async analyzeQuality(productId: string): Promise<any> {
    try {
      const response = await api.post(`/product-hub/quality/analyze/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Analyze quality error:', error);
      return { success: false };
    }
  },

  // Product Hub - Get Bundle Suggestions
  async getBundleSuggestions(): Promise<any> {
    try {
      const response = await api.get('/product-hub/bundles/suggestions');
      return response.data;
    } catch (error) {
      console.error('Get bundle suggestions error:', error);
      return { data: [] };
    }
  }
};
