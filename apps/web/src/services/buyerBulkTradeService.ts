import api from './api';

export const buyerBulkTradeService = {
  async getBulkTrades(filters: { status?: string; page?: number; limit?: number }, token: string) {
    const response = await axios.get(`${API_URL}/buyer/bulk-trades`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getBulkTradeById(id: string, token: string) {
    const response = await axios.get(`${API_URL}/buyer/bulk-trades/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async createBulkTrade(data: {
    bulkProductId: string;
    quantity: number;
    pricePerUnit: number;
    deliveryDate?: Date;
    notes?: string;
  }, token: string) {
    const response = await axios.post(`${API_URL}/buyer/bulk-trades`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async updateBulkTrade(id: string, data: any, token: string) {
    const response = await axios.put(`${API_URL}/buyer/bulk-trades/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
