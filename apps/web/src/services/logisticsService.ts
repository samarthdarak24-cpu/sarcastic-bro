import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Shipment {
  id: string;
  shipmentNumber: string;
  orderId: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED' | 'CANCELLED';
  origin: string;
  destination: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  currentLocation?: string;
  distance: number;
  weight: number;
  temperature?: number;
  humidity?: number;
  items: ShipmentItem[];
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
}

export interface ShipmentItem {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  weight: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export interface LogisticsStats {
  totalShipments: number;
  pendingShipments: number;
  inTransitShipments: number;
  deliveredShipments: number;
  delayedShipments: number;
  onTimeDeliveryRate: number;
  avgDeliveryTime: number;
  totalDistance: number;
}

class LogisticsService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async getAllShipments(filter?: { status?: string }): Promise<Shipment[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.status) params.append('status', filter.status);

      const response = await axios.get(
        `${API_BASE_URL}/logistics/shipments?${params.toString()}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching shipments:', error);
      throw error;
    }
  }

  async getShipmentById(id: string): Promise<Shipment> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/logistics/shipments/${id}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching shipment:', error);
      throw error;
    }
  }

  async createShipment(shipment: Partial<Shipment>): Promise<Shipment> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/logistics/shipments`,
        shipment,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  }

  async updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/logistics/shipments/${id}`,
        updates,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating shipment:', error);
      throw error;
    }
  }

  async updateShipmentStatus(id: string, status: Shipment['status'], location?: string): Promise<Shipment> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/logistics/shipments/${id}/status`,
        { status, location },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating shipment status:', error);
      throw error;
    }
  }

  async trackShipment(trackingNumber: string): Promise<Shipment> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/logistics/track/${trackingNumber}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error tracking shipment:', error);
      throw error;
    }
  }

  async getLogisticsStats(): Promise<LogisticsStats> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/logistics/stats`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching logistics stats:', error);
      throw error;
    }
  }

  async cancelShipment(id: string, reason: string): Promise<Shipment> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/logistics/shipments/${id}/cancel`,
        { reason },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error canceling shipment:', error);
      throw error;
    }
  }
}

export const logisticsService = new LogisticsService();
