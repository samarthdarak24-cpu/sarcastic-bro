import api from './api';
import { authService } from './auth';

export const buyerOrderTrackingService = {
  async getOrders(filters: { status?: string; page?: number; limit?: number }, token?: string) {
    const response = await api.get('/orders', {
      params: filters,
    });
    return response.data;
  },

  async getOrderTracking(orderId: string, token?: string) {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response.data;
  }
};
