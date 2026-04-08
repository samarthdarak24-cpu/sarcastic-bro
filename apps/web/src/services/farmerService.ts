import api from './api';

export interface FarmerMetrics {
  totalCropsValue: number;
  activeOrders: number;
  pendingPayments: number;
  profitGain: number;
}

export interface MandiPrice {
  commodity: string;
  variety: string;
  price: number;
  change: number;
  trend: string;
  market: string;
}

export interface ExportOpportunity {
  country: string;
  commodity: string;
  demand: string;
  profitMargin: string;
  market: string;
}

export interface FarmerActivity {
  type: string;
  title: string;
  desc: string;
  time: string;
  status: string;
}

export const farmerService = {
  getMetrics: async (): Promise<FarmerMetrics> => {
    const response = await api.get('/api/farmer/metrics');
    return response.data.data;
  },

  getMandiPrices: async (): Promise<MandiPrice[]> => {
    // Calling the new Trust API on port 8000
    const response = await fetch('http://localhost:8000/api/v1/trust/mandi-prices');
    const data = await response.json();
    return data;
  },

  getAggregationLots: async (): Promise<any[]> => {
    const response = await fetch('http://localhost:8000/api/v1/trust/aggregation-lots');
    const data = await response.json();
    return data;
  },

  getExportOpportunities: async (): Promise<ExportOpportunity[]> => {
    const response = await api.get('/api/farmer/export-data');
    return response.data.data;
  },

  getRecentActivity: async (): Promise<FarmerActivity[]> => {
    const response = await api.get('/api/farmer/recent-activity');
    return response.data.data;
  },

  getCrops: async () => {
    const response = await api.get('/api/farmer/crops');
    return response.data.data;
  },

  getOrders: async () => {
    const response = await api.get('/api/farmer/orders');
    return response.data.data;
  }
};
