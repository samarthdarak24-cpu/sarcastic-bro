import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Buyer Feature Services

export const buyerFeatureService = {
  // Cockpit Live
  cockpit: {
    getLiveDashboard: async () => {
      const { data } = await api.get('/buyer/cockpit/live-dashboard');
      return data.data;
    },
    getKPICards: async () => {
      const { data } = await api.get('/buyer/cockpit/kpi-cards');
      return data.data;
    },
    getMarketRadar: async () => {
      const { data } = await api.get('/buyer/cockpit/market-radar');
      return data.data;
    },
    getQuickActions: async () => {
      const { data } = await api.get('/buyer/cockpit/quick-actions');
      return data.data;
    },
    getAlerts: async () => {
      const { data } = await api.get('/buyer/cockpit/alerts');
      return data.data;
    },
  },

  // AI Procurement
  aiProcurement: {
    getRecommendations: async (filters?: any) => {
      const { data } = await api.get('/buyer/ai-procurement/recommendations', { params: filters });
      return data.data;
    },
    getAutomatedSourcing: async (requirements?: any) => {
      const { data } = await api.post('/buyer/ai-procurement/automated-sourcing', requirements);
      return data.data;
    },
    getPredictiveAnalytics: async () => {
      const { data } = await api.get('/buyer/ai-procurement/predictive-analytics');
      return data.data;
    },
    getSmartAlerts: async () => {
      const { data } = await api.get('/buyer/ai-procurement/smart-alerts');
      return data.data;
    },
  },

  // Smart Sourcing
  sourcing: {
    search: async (query: string, filters?: any) => {
      const { data } = await api.get('/buyer/sourcing/search', {
        params: { q: query, ...filters }
      });
      return data.data;
    },
    getSuppliers: async (filters?: any) => {
      const { data } = await api.get('/buyer/sourcing/suppliers', { params: filters });
      return data.data;
    },
    getSupplierDetails: async (supplierId: string) => {
      const { data } = await api.get(`/buyer/sourcing/suppliers/${supplierId}`);
      return data.data;
    },
    getProducts: async (filters?: any) => {
      const { data } = await api.get('/buyer/sourcing/products', { params: filters });
      return data.data;
    },
    sendInquiry: async (supplierId: string, inquiry: any) => {
      const { data } = await api.post(`/buyer/sourcing/suppliers/${supplierId}/inquiry`, inquiry);
      return data.data;
    },
  },

  // Reputation
  reputation: {
    getScore: async () => {
      const { data } = await api.get('/buyer/reputation/score');
      return data.data;
    },
    getMetrics: async () => {
      const { data } = await api.get('/buyer/reputation/metrics');
      return data.data;
    },
    getBuilding: async () => {
      const { data } = await api.get('/buyer/reputation/building');
      return data.data;
    },
    getTransparency: async () => {
      const { data } = await api.get('/buyer/reputation/transparency');
      return data.data;
    },
  },

  // Supplier Insights
  suppliers: {
    getAnalytics: async (supplierId?: string) => {
      const { data } = await api.get('/buyer/suppliers/analytics', {
        params: { supplierId }
      });
      return data.data;
    },
    getComparison: async (supplierIds: string[]) => {
      const { data } = await api.post('/buyer/suppliers/comparison', { supplierIds });
      return data.data;
    },
    getProfiles: async (filters?: any) => {
      const { data } = await api.get('/buyer/suppliers/profiles', { params: filters });
      return data.data;
    },
    getRelationships: async () => {
      const { data } = await api.get('/buyer/suppliers/relationships');
      return data.data;
    },
    getRiskAssessment: async (supplierId: string) => {
      const { data } = await api.get(`/buyer/suppliers/${supplierId}/risk`);
      return data.data;
    },
  },

  // Reviews
  reviews: {
    getReviews: async (filters?: any) => {
      const { data } = await api.get('/buyer/reviews', { params: filters });
      return data.data;
    },
    createReview: async (review: any) => {
      const { data } = await api.post('/buyer/reviews', review);
      return data.data;
    },
    updateReview: async (reviewId: string, review: any) => {
      const { data } = await api.put(`/buyer/reviews/${reviewId}`, review);
      return data.data;
    },
    deleteReview: async (reviewId: string) => {
      const { data } = await api.delete(`/buyer/reviews/${reviewId}`);
      return data.data;
    },
    getAnalytics: async () => {
      const { data } = await api.get('/buyer/reviews/analytics');
      return data.data;
    },
  },

  // Price Intelligence
  prices: {
    getTracking: async (filters?: any) => {
      const { data } = await api.get('/buyer/prices/tracking', { params: filters });
      return data.data;
    },
    getTrends: async (category?: string) => {
      const { data } = await api.get('/buyer/prices/trends', { params: { category } });
      return data.data;
    },
    getAlerts: async () => {
      const { data } = await api.get('/buyer/prices/alerts');
      return data.data;
    },
    createAlert: async (alert: any) => {
      const { data } = await api.post('/buyer/prices/alerts', alert);
      return data.data;
    },
    getDashboard: async () => {
      const { data } = await api.get('/buyer/prices/dashboard');
      return data.data;
    },
  },

  // Escrow
  escrow: {
    getEscrows: async () => {
      const { data } = await api.get('/buyer/escrow');
      return data.data;
    },
    createEscrow: async (escrow: any) => {
      const { data } = await api.post('/buyer/escrow', escrow);
      return data.data;
    },
    getEscrowDetails: async (escrowId: string) => {
      const { data } = await api.get(`/buyer/escrow/${escrowId}`);
      return data.data;
    },
    confirmDelivery: async (escrowId: string) => {
      const { data } = await api.patch(`/buyer/escrow/${escrowId}/confirm`, {});
      return data.data;
    },
    raiseDispute: async (escrowId: string, reason: string) => {
      const { data } = await api.patch(`/buyer/escrow/${escrowId}/dispute`, { reason });
      return data.data;
    },
  },

  // Negotiation
  negotiation: {
    getBids: async () => {
      const { data } = await api.get('/buyer/negotiation/bids');
      return data.data;
    },
    submitBid: async (bid: any) => {
      const { data } = await api.post('/buyer/negotiation/bids', bid);
      return data.data;
    },
    getAuctions: async () => {
      const { data } = await api.get('/buyer/negotiation/auctions');
      return data.data;
    },
    participateAuction: async (auctionId: string, bid: number) => {
      const { data } = await api.post(`/buyer/negotiation/auctions/${auctionId}/bid`, { bid });
      return data.data;
    },
    getDeals: async () => {
      const { data } = await api.get('/buyer/negotiation/deals');
      return data.data;
    },
  },

  // Intelligence
  intelligence: {
    getMarketIntelligence: async () => {
      const { data } = await api.get('/buyer/intelligence/market');
      return data.data;
    },
    getAnalytics: async () => {
      const { data } = await api.get('/buyer/intelligence/analytics');
      return data.data;
    },
    getRecommendations: async () => {
      const { data } = await api.get('/buyer/intelligence/recommendations');
      return data.data;
    },
    getReports: async (filters?: any) => {
      const { data } = await api.get('/buyer/intelligence/reports', { params: filters });
      return data.data;
    },
  },

  // Chat
  chat: {
    sendMessage: async (message: string, context?: any) => {
      const { data } = await api.post('/buyer/chat/messages', { message, context });
      return data.data;
    },
    getConversations: async () => {
      const { data } = await api.get('/buyer/chat/conversations');
      return data.data;
    },
    getSupplierChats: async () => {
      const { data } = await api.get('/buyer/chat/suppliers');
      return data.data;
    },
    sendSupplierMessage: async (supplierId: string, message: string) => {
      const { data } = await api.post(`/buyer/chat/suppliers/${supplierId}`, { message });
      return data.data;
    },
  },

  // Order Tracking
  orders: {
    getOrders: async (filters?: any) => {
      const { data } = await api.get('/buyer/orders', { params: filters });
      return data.data;
    },
    getOrderDetails: async (orderId: string) => {
      const { data } = await api.get(`/buyer/orders/${orderId}`);
      return data.data;
    },
    getTracking: async (orderId: string) => {
      const { data } = await api.get(`/buyer/orders/${orderId}/tracking`);
      return data.data;
    },
    getShipmentDetails: async (orderId: string) => {
      const { data } = await api.get(`/buyer/orders/${orderId}/shipment`);
      return data.data;
    },
  },

  // Blockchain Trace
  blockchain: {
    getTrace: async (productId: string) => {
      const { data } = await api.get(`/buyer/blockchain/trace/${productId}`);
      return data.data;
    },
    verifyTransaction: async (transactionId: string) => {
      const { data } = await api.get(`/buyer/blockchain/verify/${transactionId}`);
      return data.data;
    },
    getSmartContracts: async () => {
      const { data } = await api.get('/buyer/blockchain/contracts');
      return data.data;
    },
  },

  // Security
  security: {
    getAccountSecurity: async () => {
      const { data } = await api.get('/buyer/security/account');
      return data.data;
    },
    getTransactionSecurity: async () => {
      const { data } = await api.get('/buyer/security/transactions');
      return data.data;
    },
    getDataProtection: async () => {
      const { data } = await api.get('/buyer/security/data');
      return data.data;
    },
    getCompliance: async () => {
      const { data } = await api.get('/buyer/security/compliance');
      return data.data;
    },
  },

  // Bulk Trade
  bulkTrade: {
    getTerminal: async () => {
      const { data } = await api.get('/buyer/bulk-trade/terminal');
      return data.data;
    },
    getOrders: async () => {
      const { data } = await api.get('/buyer/bulk-trade/orders');
      return data.data;
    },
    createOrder: async (order: any) => {
      const { data } = await api.post('/buyer/bulk-trade/orders', order);
      return data.data;
    },
    getAnalysis: async () => {
      const { data } = await api.get('/buyer/bulk-trade/analysis');
      return data.data;
    },
  },

  // Cluster Intelligence
  cluster: {
    getAnalytics: async (region?: string) => {
      const { data } = await api.get('/buyer/cluster/analytics', { params: { region } });
      return data.data;
    },
    getOptimization: async () => {
      const { data } = await api.get('/buyer/cluster/optimization');
      return data.data;
    },
    getCompetitiveAnalysis: async () => {
      const { data } = await api.get('/buyer/cluster/competitive');
      return data.data;
    },
    getStrategicPlanning: async () => {
      const { data } = await api.get('/buyer/cluster/planning');
      return data.data;
    },
  },
};

export default buyerFeatureService;
