import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  imageUrl?: string;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  fulfillmentStatus: 'UNFULFILLED' | 'PARTIAL' | 'FULFILLED';
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  notes?: string;
  tags?: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  source: 'WEB' | 'MOBILE' | 'API' | 'MANUAL';
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  fulfillmentRate: number;
  onTimeDelivery: number;
  returnRate: number;
}

export interface OrderFilter {
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  search?: string;
}

class OrderManagementService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async getAllOrders(filter?: OrderFilter): Promise<Order[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.status) params.append('status', filter.status);
      if (filter?.paymentStatus) params.append('paymentStatus', filter.paymentStatus);
      if (filter?.startDate) params.append('startDate', filter.startDate);
      if (filter?.endDate) params.append('endDate', filter.endDate);
      if (filter?.search) params.append('search', filter.search);

      const response = await axios.get(
        `${API_BASE_URL}/orders?${params.toString()}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/${id}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders`,
        order,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/orders/${id}`,
        updates,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/${id}/status`,
        { status },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async confirmOrder(id: string): Promise<Order> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/${id}/confirm`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error confirming order:', error);
      throw error;
    }
  }

  async shipOrder(id: string, trackingNumber: string, carrier: string): Promise<Order> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/${id}/ship`,
        { trackingNumber, carrier },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error shipping order:', error);
      throw error;
    }
  }

  async deliverOrder(id: string): Promise<Order> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/${id}/deliver`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error delivering order:', error);
      throw error;
    }
  }

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/${id}/cancel`,
        { reason },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }

  async returnOrder(id: string, reason: string): Promise<Order> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/${id}/return`,
        { reason },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error processing return:', error);
      throw error;
    }
  }

  async getOrderStats(): Promise<OrderStats> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/stats`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  async bulkUpdateOrders(orderIds: string[], updates: Partial<Order>): Promise<Order[]> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/bulk-update`,
        { orderIds, updates },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error bulk updating orders:', error);
      throw error;
    }
  }

  async exportOrders(format: 'csv' | 'pdf' | 'excel', filter?: OrderFilter): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      if (filter?.status) params.append('status', filter.status);
      if (filter?.startDate) params.append('startDate', filter.startDate);
      if (filter?.endDate) params.append('endDate', filter.endDate);

      const response = await axios.get(
        `${API_BASE_URL}/orders/export?${params.toString()}`,
        {
          ...this.getAuthHeaders(),
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }

  async sendNotification(id: string, type: 'email' | 'sms', message: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/orders/${id}/notify`,
        { type, message },
        this.getAuthHeaders()
      );
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
}

export const orderManagementService = new OrderManagementService();
