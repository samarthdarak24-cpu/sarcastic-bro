import { create } from 'zustand';

export interface LivePrice {
  productId: string;
  productName: string;
  price: number;
  prevPrice: number;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'stable';
  updatedAt: Date;
}

export interface LiveNotification {
  id: string;
  type: 'order' | 'price' | 'proposal' | 'tender' | 'quality' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  metadata?: any;
}

export interface LiveOrder {
  id: string;
  orderNumber: string;
  status: string;
  updatedAt: Date;
}

interface RealtimeState {
  // Connection
  isConnected: boolean;
  connectedUsers: number;
  lastPing: Date | null;

  // Live prices
  livePrices: Record<string, LivePrice>;
  priceFlashIds: Set<string>;

  // Notifications
  notifications: LiveNotification[];
  unreadCount: number;

  // Live orders
  liveOrders: Record<string, LiveOrder>;

  // Dashboard stats (live)
  dashboardStats: {
    totalRevenue: number;
    totalOrders: number;
    activeProducts: number;
    successRate: number;
    lastUpdated: Date | null;
  };

  // Actions
  setConnected: (v: boolean) => void;
  setConnectedUsers: (n: number) => void;
  updateLivePrice: (price: LivePrice) => void;
  flashPrice: (productId: string) => void;
  addNotification: (n: Omit<LiveNotification, 'id' | 'read' | 'timestamp'>) => void;
  markAllRead: () => void;
  updateLiveOrder: (order: LiveOrder) => void;
  updateDashboardStats: (stats: Partial<RealtimeState['dashboardStats']>) => void;
  clearPriceFlash: (productId: string) => void;
}

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  isConnected: false,
  connectedUsers: 0,
  lastPing: null,
  livePrices: {},
  priceFlashIds: new Set(),
  notifications: [],
  unreadCount: 0,
  liveOrders: {},
  dashboardStats: {
    totalRevenue: 142500,
    totalOrders: 154,
    activeProducts: 24,
    successRate: 94.8,
    lastUpdated: null,
  },

  setConnected: (v) => set({ isConnected: v }),
  setConnectedUsers: (n) => set({ connectedUsers: n }),

  updateLivePrice: (price) => set((state) => ({
    livePrices: { ...state.livePrices, [price.productId]: price }
  })),

  flashPrice: (productId) => {
    set((state) => ({
      priceFlashIds: new Set([...state.priceFlashIds, productId])
    }));
    setTimeout(() => get().clearPriceFlash(productId), 1500);
  },

  clearPriceFlash: (productId) => set((state) => {
    const next = new Set(state.priceFlashIds);
    next.delete(productId);
    return { priceFlashIds: next };
  }),

  addNotification: (n) => set((state) => ({
    notifications: [{
      ...n,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date(),
    }, ...state.notifications].slice(0, 50),
    unreadCount: state.unreadCount + 1,
  })),

  markAllRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),

  updateLiveOrder: (order) => set((state) => ({
    liveOrders: { ...state.liveOrders, [order.id]: order }
  })),

  updateDashboardStats: (stats) => set((state) => ({
    dashboardStats: { ...state.dashboardStats, ...stats, lastUpdated: new Date() }
  })),
}));
