import api from './api';

export interface OrderTrackingEvent {
  id: string;
  orderId: string;
  status: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  updatedBy: string;
  updatedByRole: string;
  photos: string[];
  timestamp: string;
}

export interface OrderDetails {
  id: string;
  buyerId: string;
  cropId?: string;
  lotId?: string;
  quantity: number;
  totalAmount: number;
  status: string;
  escrowStatus: string;
  deliveryAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  deliveryProof: string[];
  deliveryNotes?: string;
  confirmedByBuyer: boolean;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
  crop?: any;
  lot?: any;
  escrowTransaction?: any;
  logistics?: any;
  trackingEvents: OrderTrackingEvent[];
}

export interface AddTrackingEventData {
  status: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  photos?: string[];
}

export interface ConfirmDeliveryData {
  deliveryProof?: string[];
  deliveryNotes?: string;
}

class OrderTrackingService {
  async getTrackingEvents(orderId: string): Promise<OrderTrackingEvent[]> {
    const response = await api.get(`/api/orders/${orderId}/tracking`);
    return response.data.events;
  }

  async getOrderDetails(orderId: string): Promise<OrderDetails> {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data.order;
  }

  async addTrackingEvent(orderId: string, data: AddTrackingEventData): Promise<OrderTrackingEvent> {
    const response = await api.post(`/api/orders/${orderId}/tracking`, data);
    return response.data.event;
  }

  async confirmDelivery(orderId: string, data: ConfirmDeliveryData): Promise<OrderDetails> {
    const response = await api.patch(`/api/orders/${orderId}/confirm-delivery`, data);
    return response.data.order;
  }
}

export const orderTrackingService = new OrderTrackingService();
