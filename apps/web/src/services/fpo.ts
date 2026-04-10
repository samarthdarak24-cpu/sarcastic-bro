import api from './api';

export interface FPODashboard {
  fpo: any;
  stats: {
    totalFarmers: number;
    activeListings: number;
    totalRevenue: number;
    pendingOrders: number;
  };
}

export interface FPOFarmer {
  id: string;
  name: string;
  phone: string;
  aadhaar: string;
  bankAccount?: string;
  ifsc?: string;
  district?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AggregatedLot {
  id: string;
  cropName: string;
  totalQuantity: number;
  pricePerKg: number;
  qualityCertUrl?: string;
  status: string;
  createdAt: string;
  crops: any[];
}

export interface FPOChat {
  id: string;
  buyerId: string;
  buyer: { id: string; name: string; email: string };
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface FPOLogistics {
  id: string;
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
  status: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  order: any;
  events: any[];
}

class FPOService {
  // 1. Dashboard
  async getDashboard(): Promise<FPODashboard> {
    const response = await api.get('/fpo/dashboard');
    return response.data;
  }

  // 2. Farmer Onboarding
  async onboardFarmer(data: Partial<FPOFarmer>) {
    const response = await api.post('/fpo/farmers', data);
    return response.data;
  }

  // 3. Farmer Management
  async getFarmers(filters?: any) {
    const response = await api.get('/fpo/farmers', { params: filters });
    return response.data;
  }

  async getFarmerById(farmerId: string) {
    const response = await api.get(`/fpo/farmers/${farmerId}`);
    return response.data;
  }

  // 4. Delegated Listing
  async addProductForFarmer(farmerId: string, productData: any) {
    const response = await api.post(`/fpo/farmers/${farmerId}/products`, productData);
    return response.data;
  }

  // 5. Aggregation
  async getAggregatableCrops() {
    const response = await api.get('/fpo/aggregatable-crops');
    return response.data;
  }

  async aggregateCrops(data: { cropName: string; variety: string; grade: string; cropIds: string[] }) {
    const response = await api.post('/fpo/aggregate', data);
    return response.data;
  }

  // 6. Quality Verification
  async verifyQuality(cropId: string, data: { qualityCertUrl?: string; grade?: string }) {
    const response = await api.put(`/fpo/crops/${cropId}/verify`, data);
    return response.data;
  }

  // 7. Bulk Listing
  async getAggregatedLots(filters?: any) {
    const response = await api.get('/fpo/lots', { params: filters });
    return response.data;
  }

  // 8. Chat
  async getChats() {
    const response = await api.get('/fpo/chats');
    return response.data;
  }

  async getChatMessages(chatId: string) {
    const response = await api.get(`/fpo/chats/${chatId}/messages`);
    return response.data;
  }

  async sendMessage(chatId: string, content: string, attachments?: string[]) {
    const response = await api.post(`/fpo/chats/${chatId}/messages`, { content, attachments });
    return response.data;
  }

  // 9. Payout
  async processEscrowPayout(orderId: string) {
    const response = await api.post(`/fpo/orders/${orderId}/payout`);
    return response.data;
  }

  async getPayouts(filters?: any) {
    const response = await api.get('/fpo/payouts', { params: filters });
    return response.data;
  }

  // 10. Logistics
  async createLogistics(data: { orderId: string; trackingNumber?: string; carrier?: string; estimatedDelivery?: string; notes?: string }) {
    const response = await api.post('/fpo/logistics', data);
    return response.data;
  }

  async getLogistics(filters?: any) {
    const response = await api.get('/fpo/logistics', { params: filters });
    return response.data;
  }

  async getLogisticsById(logisticsId: string) {
    const response = await api.get(`/fpo/logistics/${logisticsId}`);
    return response.data;
  }

  async updateLogistics(logisticsId: string, data: { status?: string; location?: string; description?: string; notes?: string }) {
    const response = await api.put(`/fpo/logistics/${logisticsId}`, data);
    return response.data;
  }
}

export default new FPOService();
