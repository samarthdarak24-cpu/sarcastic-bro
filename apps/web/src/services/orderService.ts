import api from './api';

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  farmerId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  shippingAddress?: string;
  trackingNumber?: string;
  notes?: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    price: number;
    unit: string;
    imageUrls?: string;
  };
  buyer?: {
    id: string;
    name: string;
    reputationScore?: number;
    kycStatus?: string;
  };
  farmer?: {
    id: string;
    name: string;
    reputationScore?: number;
    kycStatus?: string;
  };
}

export const orderService = {
  async getAll(status?: string) {
    const response: any = await api.get('/orders', { params: { status } });
    return response.data; // Standard response structure from Paginated utility
  },

  async getById(id: string) {
    const response: any = await api.get(`/orders/${id}`);
    return response.data;
  },

  async updateStatus(id: string, status: string) {
    const response: any = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  async cancel(id: string) {
    const response: any = await api.delete(`/orders/${id}`);
    return response.data;
  }
};
