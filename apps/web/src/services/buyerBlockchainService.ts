import api from './api';

export const buyerBlockchainService = {
  async getProductTrace(productId: string, token: string) {
    const response = await axios.get(`${API_URL}/buyer/blockchain/trace/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getTransactions(filters: { type?: string; status?: string; page?: number; limit?: number }, token: string) {
    const response = await axios.get(`${API_URL}/buyer/blockchain/transactions`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async createTransaction(data: {
    type: string;
    amount?: number;
    fromAddress?: string;
    toAddress?: string;
    metadata?: any;
  }, token: string) {
    const response = await axios.post(`${API_URL}/buyer/blockchain/transactions`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getTransactionById(id: string, token: string) {
    const response = await axios.get(`${API_URL}/buyer/blockchain/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
