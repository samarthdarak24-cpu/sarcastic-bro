import api from './api';

export const buyerProcurementService = {
  async getRecommendations(
    params: { category?: string; quantity?: number; budget?: number; district?: string },
    token: string
  ) {
    const response = await axios.post(`${API_URL}/buyer/procurement/recommendations`, params, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getProcurementHistory(page: number = 1, limit: number = 20, token: string) {
    const response = await axios.get(`${API_URL}/buyer/procurement/history`, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
