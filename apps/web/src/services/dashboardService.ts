import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface DashboardStats {
  activeOrders: number;
  revenueToday: number;
  productsListed: number;
  pendingPayments: number;
  totalEarnings: number;
  receivedPayments: number;
  pendingAmount: number;
}

export interface RevenueData {
  day: string;
  amount: number;
}

export interface InventoryItem {
  name: string;
  stock: number;
  unit: string;
  status: 'high' | 'medium' | 'low';
}

export interface RecentOrder {
  id: string;
  product: string;
  quantity: string;
  amount: number;
  status: 'Delivered' | 'In Transit' | 'Processing' | 'Pending';
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export interface MarketTrend {
  product: string;
  currentPrice: number;
  change: number;
  unit: string;
}

export interface Task {
  id: string;
  title: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface FarmHealth {
  cropVitality: number;
  soilQuality: number;
  waterLevel: number;
}

class DashboardService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock data as fallback
      return {
        activeOrders: 24,
        revenueToday: 45200,
        productsListed: 156,
        pendingPayments: 8,
        totalEarnings: 240000,
        receivedPayments: 180000,
        pendingAmount: 60000,
      };
    }
  }

  // Get revenue data for chart
  async getRevenueData(days: number = 7): Promise<RevenueData[]> {
    try {
      const response = await axios.get(`${API_URL}/dashboard/revenue?days=${days}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      // Return mock data
      return [
        { day: 'Mon', amount: 65000 },
        { day: 'Tue', amount: 78000 },
        { day: 'Wed', amount: 85000 },
        { day: 'Thu', amount: 72000 },
        { day: 'Fri', amount: 90000 },
        { day: 'Sat', amount: 88000 },
        { day: 'Sun', amount: 95000 },
      ];
    }
  }

  // Get recent orders
  async getRecentOrders(limit: number = 4): Promise<RecentOrder[]> {
    try {
      const response = await axios.get(`${API_URL}/dashboard/orders/recent?limit=${limit}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [
        {
          id: 'ORD-2847',
          product: 'Organic Tomatoes',
          quantity: '500 kg',
          amount: 12500,
          status: 'Delivered',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'ORD-2846',
          product: 'Fresh Potatoes',
          quantity: '1000 kg',
          amount: 18000,
          status: 'In Transit',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'ORD-2845',
          product: 'Wheat Grain',
          quantity: '2000 kg',
          amount: 45000,
          status: 'Processing',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'ORD-2844',
          product: 'Rice Premium',
          quantity: '1500 kg',
          amount: 38500,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        },
      ];
    }
  }

  // Get notifications
  async getNotifications(limit: number = 4): Promise<Notification[]> {
    try {
      const response = await axios.get(`${API_URL}/dashboard/notifications?limit=${limit}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [
        {
          id: '1',
          type: 'success',
          title: 'Payment Received',
          message: 'Order #2847 - ₹12,500 credited',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        },
        {
          id: '2',
          type: 'warning',
          title: 'Low Stock Alert',
          message: 'Wheat inventory below 150kg',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        },
        {
          id: '3',
          type: 'info',
          title: 'New Tender Available',
          message: '500kg Organic Tomatoes - ₹25/kg',
          timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        },
        {
          id: '4',
          type: 'success',
          title: 'Quality Check Passed',
          message: 'Batch #TB-2024 approved',
          timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
        },
      ];
    }
  }

  // Get market trends
  async getMarketTrends(): Promise<MarketTrend[]> {
    try {
      const response = await axios.get(`${API_URL}/dashboard/market-trends`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching market trends:', error);
      return [
        { product: 'Tomatoes', currentPrice: 42, change: 8, unit: 'kg' },
        { product: 'Potatoes', currentPrice: 28, change: -3, unit: 'kg' },
        { product: 'Wheat', currentPrice: 35, change: 5, unit: 'kg' },
        { product: 'Rice', currentPrice: 48, change: 12, unit: 'kg' },
        { product: 'Onions', currentPrice: 32, change: -2, unit: 'kg' },
        { product: 'Carrots', currentPrice: 38, change: 6, unit: 'kg' },
      ];
    }
  }

  // Get tasks
  async getTasks(): Promise<Task[]> {
    try {
      const response = await axios.get(`${API_URL}/dashboard/tasks`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [
        {
          id: '1',
          title: 'Irrigation Check - Sector B',
          time: '08:00 AM',
          priority: 'high',
          completed: false,
        },
        {
          id: '2',
          title: 'Quality Inspection - Tomato Batch',
          time: '10:30 AM',
          priority: 'high',
          completed: false,
        },
        {
          id: '3',
          title: 'Fertilizer Application - North Field',
          time: '02:00 PM',
          priority: 'medium',
          completed: false,
        },
        {
          id: '4',
          title: 'Harvest Planning Meeting',
          time: '04:00 PM',
          priority: 'low',
          completed: false,
        },
      ];
    }
  }

  // Update task status
  async updateTaskStatus(taskId: string, completed: boolean): Promise<void> {
    try {
      await axios.patch(
        `${API_URL}/dashboard/tasks/${taskId}`,
        { completed },
        { headers: this.getHeaders() }
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  // Get farm health metrics
  async getFarmHealth(): Promise<FarmHealth> {
    try {
      const response = await axios.get(`${API_URL}/dashboard/farm-health`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching farm health:', error);
      return {
        cropVitality: 94,
        soilQuality: 87,
        waterLevel: 76,
      };
    }
  }

  // Get inventory summary
  async getInventorySummary(): Promise<InventoryItem[]> {
    try {
      const response = await axios.get(`${API_URL}/dashboard/inventory/summary`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
      return [
        { name: 'Tomatoes', stock: 450, unit: 'kg', status: 'high' },
        { name: 'Potatoes', stock: 280, unit: 'kg', status: 'medium' },
        { name: 'Wheat', stock: 120, unit: 'kg', status: 'low' },
      ];
    }
  }

  // Mark notification as read
  async markNotificationRead(notificationId: string): Promise<void> {
    try {
      await axios.patch(
        `${API_URL}/dashboard/notifications/${notificationId}/read`,
        {},
        { headers: this.getHeaders() }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }
}

export const dashboardService = new DashboardService();
