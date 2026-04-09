import api from './api';

export interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  buyerId: string;
  farmerId: string;
  quantity: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  product?: any;
  buyer?: any;
  farmer?: any;
}

export interface CreateOrderData {
  productId: string;
  quantity: number;
  notes?: string;
  shippingAddress?: string;
}


export const orderService = {
  // Get all orders
  async getAll(): Promise<Order[]> {
    try {
      const response = await api.get("/orders");
      const data = response.data.data || response.data || [];
      return Array.isArray(data) ? data : (data.orders || []);
    } catch (error) {
      console.error('getAll orders error:', error);
      return [];
    }
  },

  // Get all orders for current user
  async getMyOrders(): Promise<Order[]> {
    try {
      const response: any = await api.get("/orders");
      const data = response.data || response || [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      // Silently fail - likely due to authentication, use mock data instead
      return [];
    }
  },

  // Get farmer orders
  async getFarmerOrders(): Promise<Order[]> {
    try {
      const response: any = await api.get("/orders");
      const data = response.data || response || [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  },

  // Get buyer orders
  async getBuyerOrders(): Promise<Order[]> {
    try {
      const response: any = await api.get("/orders");
      const data = response.data || response || [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  },

  // Get single order
  async getOrder(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create order (buyer)
  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Update order status (farmer)
  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.warn('updateOrderStatus failed (may be using demo data):', id, status);
      return null;
    }
  },

  // Cancel order
  async cancelOrder(id: string, reason?: string): Promise<Order | null> {
    try {
      const response = await api.delete(`/orders/${id}`, { data: { reason } });
      return response.data;
    } catch (error) {
      console.warn('cancelOrder failed (may be using demo data):', id);
      return null;
    }
  },

  // Get order statistics
  async getOrderStats(): Promise<any> {
    try {
      const response = await api.get("/orders/stats");
      return response.data.data || response.data;
    } catch (error) {
      console.error('getOrderStats error:', error);
      return null;
    }
  },

  // Track order
  async trackOrder(orderNumber: string): Promise<any> {
    try {
      const response = await api.get(`/orders/track/${orderNumber}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('trackOrder error:', error);
      return null;
    }
  },

  // Bulk status update
  async bulkUpdateStatus(orderIds: string[], status: string): Promise<any> {
    const response = await api.post('/orders/bulk-status', { orderIds, status });
    return response.data.data || response.data;
  }
};

