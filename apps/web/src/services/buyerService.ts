import api from './api';

// ============================================================================
// BUYER SERVICE - All 10 Features
// ============================================================================

export const buyerService = {
  // -------------------------------------------------------------------------
  // 1. Business KYC
  // -------------------------------------------------------------------------
  kyc: {
    getStatus: async () => {
      const response = await api.get('/api/buyer/kyc/status');
      return response.data;
    },
    
    submit: async (data: {
      gst: string;
      companyName?: string;
      companyAddress?: string;
      bankAccount: string;
      ifsc: string;
      bankName: string;
    }) => {
      const response = await api.post('/api/buyer/kyc/submit', data);
      return response.data;
    },
    
    verifyGST: async (gst: string) => {
      const response = await api.post('/api/buyer/kyc/verify-gst', { gst });
      return response.data;
    }
  },

  // -------------------------------------------------------------------------
  // 2. Wallet System
  // -------------------------------------------------------------------------
  wallet: {
    getWallet: async () => {
      const response = await api.get('/api/buyer/wallet');
      return response.data;
    },
    
    getBalance: async () => {
      const response = await api.get('/api/buyer/wallet/balance');
      return response.data;
    },
    
    addFunds: async (data: {
      amount: number;
      razorpayPaymentId?: string;
      razorpayOrderId?: string;
      method?: string;
    }) => {
      const response = await api.post('/api/buyer/wallet/add-funds', data);
      return response.data;
    },
    
    getTransactions: async (params?: {
      type?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await api.get('/api/buyer/wallet/transactions', { params });
      return response.data;
    }
  },

  // -------------------------------------------------------------------------
  // 3. Aggregated Marketplace & 4. Filters
  // -------------------------------------------------------------------------
  marketplace: {
    getProducts: async (params?: {
      cropName?: string;
      category?: string;
      minGrade?: string;
      district?: string;
      state?: string;
      minQuantity?: number;
      maxPrice?: number;
      page?: number;
      limit?: number;
    }) => {
      const response = await api.get('/api/buyer/marketplace/products', { params });
      return response.data;
    },
    
    getProductDetails: async (type: 'crop' | 'lot', id: string) => {
      const response = await api.get(`/api/buyer/marketplace/products/${type}/${id}`);
      return response.data;
    },
    
    getFilters: async () => {
      const response = await api.get('/api/buyer/marketplace/filters');
      return response.data;
    }
  },

  // -------------------------------------------------------------------------
  // 5. Quality Viewer
  // -------------------------------------------------------------------------
  quality: {
    getCertificates: async (type: 'crop' | 'lot', id: string) => {
      const response = await api.get(`/api/buyer/marketplace/products/${type}/${id}/quality`);
      return response.data;
    }
  },

  // -------------------------------------------------------------------------
  // 6. Bulk Order & 8. Delivery Approval
  // -------------------------------------------------------------------------
  orders: {
    create: async (data: {
      productId: string;
      productType: 'crop' | 'lot';
      quantity: number;
      deliveryAddress: string;
      deliveryDate?: string;
      notes?: string;
    }) => {
      const response = await api.post('/api/buyer/bulk-orders', data);
      return response.data;
    },
    
    getAll: async (params?: {
      status?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await api.get('/api/buyer/bulk-orders', { params });
      return response.data;
    },
    
    getDetails: async (orderId: string) => {
      const response = await api.get(`/api/buyer/bulk-orders/${orderId}`);
      return response.data;
    },
    
    confirmDelivery: async (orderId: string) => {
      const response = await api.post(`/api/buyer/bulk-orders/${orderId}/confirm-delivery`);
      return response.data;
    },
    
    cancel: async (orderId: string, reason: string) => {
      const response = await api.post(`/api/buyer/bulk-orders/${orderId}/cancel`, { reason });
      return response.data;
    }
  },

  // -------------------------------------------------------------------------
  // 7. Escrow System
  // -------------------------------------------------------------------------
  escrow: {
    getOrders: async (params?: {
      status?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await api.get('/api/buyer/escrow', { params });
      return response.data;
    }
  },

  // -------------------------------------------------------------------------
  // 9. Chat System
  // -------------------------------------------------------------------------
  chat: {
    send: async (data: {
      receiverId: string;
      content: string;
      orderId?: string;
    }) => {
      const response = await api.post('/api/buyer/chat/send', data);
      return response.data;
    },
    
    getHistory: async (otherUserId: string, orderId?: string) => {
      const params = orderId ? { orderId } : {};
      const response = await api.get(`/api/buyer/chat/history/${otherUserId}`, { params });
      return response.data;
    },
    
    getConversations: async () => {
      const response = await api.get('/api/buyer/chat/conversations');
      return response.data;
    },
    
    getUnreadCount: async () => {
      const response = await api.get('/api/buyer/chat/unread-count');
      return response.data;
    },
    
    markAsRead: async (senderId: string) => {
      const response = await api.post(`/api/buyer/chat/mark-read/${senderId}`);
      return response.data;
    }
  },

  // -------------------------------------------------------------------------
  // 10. Order Tracking
  // -------------------------------------------------------------------------
  tracking: {
    getOrderTracking: async (orderId: string) => {
      const response = await api.get(`/api/buyer/orders/${orderId}/track`);
      return response.data;
    }
  },

  // -------------------------------------------------------------------------
  // Dashboard & Analytics
  // -------------------------------------------------------------------------
  dashboard: {
    getStats: async () => {
      const response = await api.get('/api/buyer/dashboard/stats');
      return response.data;
    },
    
    getOrdersSummary: async () => {
      const response = await api.get('/api/buyer/dashboard/orders-summary');
      return response.data;
    },
    
    getSpendingAnalytics: async (period: 'week' | 'month' | 'year' = 'month') => {
      const response = await api.get('/api/buyer/dashboard/analytics/spending', {
        params: { period }
      });
      return response.data;
    },
    
    getTopSuppliers: async (limit: number = 5) => {
      const response = await api.get('/api/buyer/dashboard/top-suppliers', {
        params: { limit }
      });
      return response.data;
    }
  },

  // -------------------------------------------------------------------------
  // Suppliers
  // -------------------------------------------------------------------------
  suppliers: {
    getAll: async () => {
      const response = await api.get('/api/buyer/suppliers');
      return response.data;
    }
  }
};

export default buyerService;
