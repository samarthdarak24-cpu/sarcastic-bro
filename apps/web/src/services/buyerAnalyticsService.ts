import api from './api';

export const buyerAnalyticsService = {
  async getBehaviorAnalytics(days: number = 30, token?: string) {
    try {
      const response = await api.get('/buyer/analytics/behavior', {
        params: { days }
      });
      return response.data?.data || response.data || {};
    } catch (error) {
      console.error('Failed to get behavior analytics:', error);
      return { behaviors: [] };
    }
  },

  async getDashboardAnalytics(token?: string) {
    try {
      const response = await api.get("/buyer/analytics/dashboard");
      return response.data?.data || response.data || {
        totalOrders: 0,
        totalSpent: 0,
        activeSuppliers: 0,
        reputationScore: 100,
        recentActivity: 0,
        trustScore: 100
      };
    } catch (error) {
      console.error('Failed to get dashboard analytics:', error);
      return {
        totalOrders: 0,
        totalSpent: 0,
        activeSuppliers: 0,
        reputationScore: 100,
        recentActivity: 0,
        trustScore: 100
      };
    }
  },

  async getInsights(token?: string) {
    try {
      const response = await api.get("/buyer/analytics/insights");
      return response.data?.data || response.data || { insights: [] };
    } catch (error) {
      console.error('Failed to get insights:', error);
      return { insights: [] };
    }
  }
};

