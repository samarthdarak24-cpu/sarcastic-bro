import api from './api';

export interface BulkProduct {
  id: string;
  supplierId: string;
  name: string;
  category: string;
  description?: string;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  pricePerUnit: number;
  qualityGrade?: string;
  certifications?: string[];
  imageUrls?: string[];
  district: string;
  state: string;
  isActive: boolean;
  supplier?: any;
}

export interface BulkProductFilters {
  category?: string;
  district?: string;
  state?: string;
  minQuantity?: number;
  maxPrice?: number;
  qualityGrade?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export const buyerBulkProductService = {
  async getBulkProducts(filters: BulkProductFilters, token: string) {
    const response = await axios.get(`${API_URL}/buyer/bulk-products`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getBulkProductById(id: string, token: string) {
    const response = await axios.get(`${API_URL}/buyer/bulk-products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async createInquiry(data: { productId: string; quantity: number; message?: string }, token: string) {
    const response = await axios.post(`${API_URL}/buyer/bulk-products/inquiry`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
