import api from './api';

export interface FarmInsightsData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    period: string;
  };
  chartTimeSeries: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  priceComparison: Array<{
    productId: string;
    name: string;
    category: string;
    farmerPrice: number;
    marketAverage: number;
    premium: number;
  }>;
}

export const analyticsService = {
  async getFarmerInsights(timeRange?: string): Promise<FarmInsightsData> {
    const response: any = await api.get('/analytics/farmer', {
      params: { timeRange }
    });
    return response.data;
  }
};
