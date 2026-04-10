import api from './api';

export interface LogisticsEvent {
  id: string;
  logisticsId: string;
  status: string;
  location?: string;
  description?: string;
  timestamp: string;
}

export interface Logistics {
  id: string;
  orderId: string;
  fpoId: string;
  trackingNumber?: string;
  carrier?: string;
  status: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  events?: LogisticsEvent[];
  order?: any;
  fpo?: any;
}

export interface CreateLogisticsData {
  orderId: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface UpdateLogisticsStatusData {
  status: string;
  currentLocation?: string;
  description?: string;
  notes?: string;
}

export const logisticsService = {
  getLogisticsByOrderId: async (orderId: string): Promise<Logistics> => {
    const response = await api.get(`/logistics/order/${orderId}`);
    return response.data.data;
  },

  getActiveLogistics: async (): Promise<Logistics[]> => {
    const response = await api.get('/logistics/active');
    return response.data.data;
  },

  createLogistics: async (data: CreateLogisticsData): Promise<Logistics> => {
    const response = await api.post('/logistics', data);
    return response.data.data;
  },

  updateStatus: async (id: string, data: UpdateLogisticsStatusData): Promise<Logistics> => {
    const response = await api.patch(`/logistics/${id}/status`, data);
    return response.data.data;
  }
};
