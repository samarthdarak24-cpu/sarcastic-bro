import api from './api';

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED';
  origin: string;
  destination: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  updates: ShipmentUpdate[];
  createdAt: string;
}

export interface ShipmentUpdate {
  timestamp: string;
  status: string;
  location: string;
  message: string;
}

export const logisticsService = {
  // Get all shipments
  async getAll(): Promise<{ shipments: Shipment[] }> {
    const response = await api.get('/logistics');
    return response.data.data || response.data;
  },

  // Get all shipments (alias)
  async getShipments(): Promise<Shipment[]> {
    const response = await api.get('/logistics');
    return response.data;
  },

  // Get single shipment
  async getShipment(id: string): Promise<Shipment> {
    const response = await api.get(`/logistics/${id}`);
    return response.data;
  },

  // Track shipment by tracking number
  async trackShipment(trackingNumber: string): Promise<Shipment> {
    const response = await api.get(`/logistics/track/${trackingNumber}`);
    return response.data;
  },

  // Create shipment
  async create(data: {
    orderId: string;
    provider?: string;
    carrier?: string;
    fromLocation?: string;
    toLocation?: string;
    origin?: string;
    destination?: string;
    temperature?: string;
    humidity?: string;
  }): Promise<Shipment> {
    const response = await api.post('/logistics', {
      orderId: data.orderId,
      carrier: data.provider || data.carrier || 'BlueDart Express',
      origin: data.fromLocation || data.origin || 'Farm Location',
      destination: data.toLocation || data.destination || 'Buyer Location',
      temperature: data.temperature,
      humidity: data.humidity
    });
    return response.data.data || response.data;
  },

  // Create shipment (alias)
  async createShipment(data: {
    orderId: string;
    carrier: string;
    origin: string;
    destination: string;
  }): Promise<Shipment> {
    const response = await api.post('/logistics', data);
    return response.data;
  },

  // Update shipment status
  async updateShipmentStatus(id: string, data: {
    status: Shipment['status'];
    location: string;
    message: string;
  }): Promise<Shipment> {
    const response = await api.patch(`/logistics/${id}/status`, data);
    return response.data;
  },

  // Get logistics analytics
  async getLogisticsAnalytics(): Promise<any> {
    const response = await api.get('/logistics/analytics');
    return response.data;
  }
};
