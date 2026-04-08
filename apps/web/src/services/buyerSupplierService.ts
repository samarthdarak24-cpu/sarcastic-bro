import api from './api';

export interface Supplier {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  certifications?: string[];
  specialties?: string[];
  minOrderQty?: number;
  maxOrderQty?: number;
  leadTime?: number;
  rating: number;
  totalOrders: number;
  responseTime: number;
  verificationStatus: string;
  isActive: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    district: string;
    state: string;
    avatarUrl?: string;
    ratingAvg: number;
  };
  bulkProducts?: any[];
}

export interface SupplierFilters {
  search?: string;
  district?: string;
  state?: string;
  minRating?: number;
  category?: string;
  page?: number;
  limit?: number;
}

export const buyerSupplierService = {
  async getSuppliers(filters: SupplierFilters, token: string) {
    const response = await axios.get(`${API_URL}/buyer/suppliers`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getSupplierById(id: string, token: string) {
    const response = await axios.get(`${API_URL}/buyer/suppliers/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getSupplierAnalytics(id: string, token: string) {
    const response = await axios.get(`${API_URL}/buyer/suppliers/${id}/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getSupplierProducts(id: string, filters: { category?: string; page?: number; limit?: number }, token: string) {
    const response = await axios.get(`${API_URL}/buyer/suppliers/${id}/products`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
