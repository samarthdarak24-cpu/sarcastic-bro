import api from './api';

export interface MarketplaceProduct {
  id: string;
  type: 'AGGREGATED' | 'INDIVIDUAL';
  cropName: string;
  category?: string;
  variety?: string;
  quantity: number;
  totalQuantity?: number;
  pricePerKg: number;
  grade?: string;
  qualityCertUrl?: string;
  fpo?: {
    id: string;
    name: string;
    district: string;
    state: string;
  };
  supplier?: any;
  location?: {
    district?: string;
    state?: string;
  };
  numberOfFarmers?: number;
  averageGrade?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  cropId?: string;
  lotId?: string;
  quantity: number;
  totalAmount: number;
  status: string;
  escrowStatus: string;
  paymentStatus: string;
  deliveryAddress: string;
  trackingNumber?: string;
  confirmedByBuyer: boolean;
  confirmedAt?: string;
  createdAt: string;
  crop?: {
    cropName: string;
    variety: string;
    grade: string;
    pricePerKg: number;
    images: string[];
  };
  lot?: {
    cropName: string;
    pricePerKg: number;
    fpo: {
      name: string;
    };
  };
  escrowTransaction?: {
    status: string;
    amount: number;
    heldAt: string;
    releasedAt?: string;
  };
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  heldBalance?: number;
  currency?: string;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description?: string;
  referenceId?: string;
  createdAt: string;
}

export interface MarketplaceFilters {
  cropName?: string;
  category?: string;
  minGrade?: string;
  district?: string;
  state?: string;
  minQuantity?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const buyerAPI = {
  // Marketplace
  getProducts: (filters: MarketplaceFilters) => 
    api.get('/api/buyer/marketplace/products', { params: filters }),
  
  getProductDetails: (type: 'crop' | 'lot', id: string) => 
    api.get(`/api/buyer/marketplace/products/${type}/${id}`),
  
  getProductQuality: (type: 'crop' | 'lot', id: string) => 
    api.get(`/api/buyer/marketplace/products/${type}/${id}/quality`),
  
  getAvailableFilters: () => 
    api.get('/api/buyer/marketplace/filters'),

  // Orders
  placeOrder: (data: {
    productId: string;
    productType: 'crop' | 'lot';
    quantity: number;
    deliveryAddress: string;
    deliveryDate?: string;
    notes?: string;
  }) => api.post('/api/buyer/bulk-orders', data),
  
  getOrders: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/api/buyer/bulk-orders', { params });
    return {
      ...response,
      data: response.data?.data || response.data,
    };
  },
  
  getOrderDetails: async (orderId: string) => {
    const response = await api.get(`/api/buyer/bulk-orders/${orderId}`);
    return {
      ...response,
      data: response.data?.data || response.data,
    };
  },
  
  confirmDelivery: (orderId: string) => 
    api.post(`/api/buyer/bulk-orders/${orderId}/confirm-delivery`),
  
  cancelOrder: (orderId: string, reason?: string) => 
    api.post(`/api/buyer/bulk-orders/${orderId}/cancel`, { reason }),

  // Wallet
  getWallet: () => 
    api.get('/api/buyer/wallet'),
  
  addFunds: (data: { amount: number; method?: string }) => 
    api.post('/api/buyer/wallet/add-funds', data),
  
  getTransactions: (params?: { page?: number; limit?: number }) => 
    api.get('/api/buyer/wallet/transactions', { params }),

  // Escrow
  getEscrowOrders: (params?: { status?: string; page?: number; limit?: number }) => 
    api.get('/api/buyer/escrow', { params }),
  
  confirmEscrowDelivery: (escrowId: string) => 
    api.put(`/api/buyer/escrow/${escrowId}/confirm`),
  
  raiseDispute: (escrowId: string, reason: string) => 
    api.put(`/api/buyer/escrow/${escrowId}/dispute`, { reason }),

  // Chat
  getConversations: async () => {
    const response = await api.get('/api/buyer/chat/conversations');
    return {
      ...response,
      data: response.data?.data || response.data,
    };
  },
  
  sendMessage: (data: { receiverId: string; content: string; orderId?: string }) => 
    api.post('/api/buyer/chat/send', data),
  
  getMessages: (otherUserId: string, orderId?: string) => 
    api.get(`/api/buyer/chat/history/${otherUserId}`, {
      params: orderId ? { orderId } : undefined,
    }),

  // Market Intelligence
  getMarketPrices: () => 
    api.get('/api/buyer/market-intelligence/prices'),
  
  getMarketTrends: () => 
    api.get('/api/buyer/market-intelligence/trends'),
};

export default buyerAPI;
