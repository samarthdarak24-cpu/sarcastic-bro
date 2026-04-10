import api from './api';

export interface FarmerDashboard {
  user: any;
  farm: any;
  stats: {
    activeCrops: number;
    soldCrops: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    walletBalance: number;
    heldAmount: number;
  };
}

class FarmerService {
  // Dashboard
  async getDashboard(): Promise<FarmerDashboard> {
    const response = await api.get('/farmers/dashboard');
    return response.data;
  }

  // 1. KYC
  async updateKYC(data: any) {
    const response = await api.post('/farmers/kyc', data);
    return response.data;
  }

  async getKYCStatus() {
    const response = await api.get('/farmers/kyc/status');
    return response.data;
  }

  // 2. Crop Listing
  async createCrop(data: any) {
    const response = await api.post('/farmers/crops', data);
    return response.data;
  }

  async getCrops(filters?: any) {
    const response = await api.get('/farmers/crops', { params: filters });
    return response.data;
  }

  async updateCrop(cropId: string, data: any) {
    const response = await api.put(`/farmers/crops/${cropId}`, data);
    return response.data;
  }

  async deleteCrop(cropId: string) {
    const response = await api.delete(`/farmers/crops/${cropId}`);
    return response.data;
  }

  // 3. AI Quality
  async analyzeQuality(imageUrl: string) {
    const response = await api.post('/farmers/quality/analyze', { imageUrl });
    return response.data;
  }

  // 4. FPO Linking
  async linkToFPO(fpoId: string) {
    const response = await api.post('/farmers/fpo/link', { fpoId });
    return response.data;
  }

  async getLinkedFPOs() {
    const response = await api.get('/farmers/fpo/linked');
    return response.data;
  }

  async sendCropToFPO(cropId: string, fpoFarmerId: string) {
    const response = await api.post(`/farmers/crops/${cropId}/send-to-fpo`, { fpoFarmerId });
    return response.data;
  }

  // 5. Market Prices
  async getMarketPrices(filters?: any) {
    const response = await api.get('/farmers/market-prices', { params: filters });
    return response.data;
  }

  async getHistoricalPrices(cropName: string, days?: number) {
    const response = await api.get('/farmers/market-prices/historical', {
      params: { cropName, days }
    });
    return response.data;
  }

  // 6. Orders
  async getOrders(filters?: any) {
    const response = await api.get('/farmers/orders', { params: filters });
    return response.data;
  }

  async getOrderStats() {
    const response = await api.get('/farmers/orders/stats');
    return response.data;
  }

  // 7. Wallet
  async getWallet() {
    const response = await api.get('/farmers/wallet');
    return response.data;
  }

  // 8. Earnings
  async getEarnings(filters?: any) {
    const response = await api.get('/farmers/earnings', { params: filters });
    return response.data;
  }

  // 9. Logistics
  async requestPickup(data: any) {
    const response = await api.post('/farmers/logistics/pickup', data);
    return response.data;
  }
}

export default new FarmerService();
