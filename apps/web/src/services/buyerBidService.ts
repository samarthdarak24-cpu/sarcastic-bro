import api from './api';

export interface Bid {
  id: string;
  buyerId: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  validUntil: Date;
  status: string;
  counterOfferPrice?: number;
  aiRecommendation?: any;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const buyerBidService = {
  async getBids(filters: { status?: string; page?: number; limit?: number }, token: string) {
    const response = await axios.get(`${API_URL}/buyer/bids`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getBidById(id: string, token: string) {
    const response = await axios.get(`${API_URL}/buyer/bids/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async placeBid(data: {
    productId: string;
    quantity: number;
    pricePerUnit: number;
    validUntil: Date;
    notes?: string;
  }, token: string) {
    const response = await axios.post(`${API_URL}/buyer/bids`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async updateBid(id: string, data: { pricePerUnit?: number; quantity?: number; status?: string }, token: string) {
    const response = await axios.put(`${API_URL}/buyer/bids/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
