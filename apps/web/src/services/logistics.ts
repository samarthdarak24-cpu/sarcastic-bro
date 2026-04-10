import { api } from '@/lib/api';

export interface RequestPickupData {
  orderId: string;
  pickupLocation: string;
  pickupLat?: number;
  pickupLng?: number;
  dropLocation: string;
  dropLat?: number;
  dropLng?: number;
  notes?: string;
}

export interface AssignDriverData {
  logisticsId: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  estimatedDelivery: string;
  notes?: string;
}

export interface UpdateLocationData {
  logisticsId: string;
  lat: number;
  lng: number;
  status?: string;
}

export interface MarkDeliveredData {
  logisticsId: string;
  deliveryProof?: string[];
  deliveryNotes?: string;
}

export const logisticsService = {
  // Farmer requests pickup
  requestPickup: (data: RequestPickupData) => 
    api.post('/logistics/request', data),

  // FPO assigns driver
  assignDriver: (data: AssignDriverData) => 
    api.post('/logistics/assign', data),

  // Get logistics by order ID
  getByOrder: (orderId: string) => 
    api.get(`/logistics/order/${orderId}`),

  // Update driver location
  updateLocation: (data: UpdateLocationData) => 
    api.post('/logistics/location', data),

  // Mark as delivered
  markDelivered: (logisticsId: string, data: Omit<MarkDeliveredData, 'logisticsId'>) => 
    api.post(`/logistics/${logisticsId}/deliver`, data),

  // Get farmer's logistics
  getFarmerLogistics: () => 
    api.get('/logistics/farmer'),

  // Get FPO's logistics
  getFPOLogistics: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return api.get(`/logistics/fpo${query}`);
  },

  // Get buyer's logistics
  getBuyerLogistics: () => 
    api.get('/logistics/buyer'),

  // Cancel logistics
  cancelLogistics: (logisticsId: string, reason: string) => 
    api.post(`/logistics/${logisticsId}/cancel`, { reason }),
};
