import api from './api';

export interface AnalyticsSummary {
  totalRevenue?: number;
  totalOrders?: number;
  totalQuantitySold?: number;
  totalEarnings?: number;
  pendingEarnings?: number;
  completedEarnings?: number;
  totalSpent?: number;
  totalQuantity?: number;
  averageOrderValue?: number;
  totalCommission?: number;
  commissionRate?: number;
  totalFarmers?: number;
  activeFarmers?: number;
  totalLots?: number;
  activeLots?: number;
  period: string;
}

export interface ChartDataPoint {
  date: string;
  revenue?: number;
  orders?: number;
  spending?: number;
}

export interface TopItem {
  name: string;
  quantity: number;
  revenue?: number;
  amount?: number;
  orders: number;
}

export interface FarmerAnalytics {
  summary: AnalyticsSummary;
  chartTimeSeries: ChartDataPoint[];
  topCrops: TopItem[];
  activeCrops: number;
  soldCrops: number;
}

export interface BuyerAnalytics {
  summary: AnalyticsSummary;
  chartTimeSeries: ChartDataPoint[];
  topPurchases: TopItem[];
  ordersByStatus: {
    pending: number;
    confirmed: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
}

export interface FPOAnalytics {
  summary: AnalyticsSummary;
  chartTimeSeries: ChartDataPoint[];
  topLots: TopItem[];
}

class AnalyticsService {
  async getFarmerAnalytics(timeRange: string = '30d'): Promise<FarmerAnalytics> {
    const response = await api.get(`/api/analytics/farmer?timeRange=${timeRange}`);
    return response.data.data;
  }

  async getBuyerAnalytics(timeRange: string = '30d'): Promise<BuyerAnalytics> {
    const response = await api.get(`/api/analytics/buyer?timeRange=${timeRange}`);
    return response.data.data;
  }

  async getFPOAnalytics(timeRange: string = '30d'): Promise<FPOAnalytics> {
    const response = await api.get(`/api/analytics/fpo?timeRange=${timeRange}`);
    return response.data.data;
  }
}

export const analyticsService = new AnalyticsService();
