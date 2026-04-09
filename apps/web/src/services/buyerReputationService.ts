import api from './api';

export const buyerReputationService = {
  async getReputation(token?: string) {
    try {
      const response = await api.get("/buyer/reputation");
      return response.data?.data || response.data || {};
    } catch (error) {
      console.error('Failed to get reputation:', error);
      return { score: 100, trustScore: 5.0 };
    }
  },

  async getReputationHistory(page: number = 1, limit: number = 20, token?: string) {
    try {
      const response = await api.get('/buyer/reputation/history', {
        params: { page, limit }
      });
      return response.data?.data || response.data || { history: [] };
    } catch (error) {
      console.error('Failed to get reputation history:', error);
      return { history: [] };
    }
  },

  async getReputationBreakdown(token?: string) {
    try {
      const response = await api.get("/buyer/reputation/breakdown");
      return response.data?.data || response.data || {};
    } catch (error) {
      console.error('Failed to get reputation breakdown:', error);
      return {};
    }
  }
};

