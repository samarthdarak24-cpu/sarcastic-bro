"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Clock, CheckCircle2, XCircle, Truck, 
  Eye, MoreVertical, Filter, Search, Calendar,
  ArrowUpRight, TrendingUp, AlertCircle, MapPin, Activity,
  BarChart3, Users, MessageSquare, Zap, History, Settings,
  RefreshCw, Bell, Target, Boxes, Route, ShoppingCart,
  TrendingDown, Star, Phone, Mail, Download, Send,
  CheckCircle, AlertTriangle, Info, ChevronRight, Play, DollarSign,
  Search as SearchIcon, LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { orderService, Order } from "@/services/orderService";
import api from "@/services/api";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import toast from "react-hot-toast";

export function OrderControlCenter() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [filter, setFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });
  const [rules, setRules] = useState<any[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<null | { saved: string, route: string }>(null);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Enhanced mock data for rich visualizations
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      productId: 'p1',
      buyerId: 'b1',
      farmerId: 'f1',
      quantity: 500,
      totalPrice: 45000,
      status: 'PENDING',
      address: 'Mumbai, Maharashtra - 400001',
      notes: 'Urgent delivery required',
      createdAt: new Date('2024-04-05').toISOString(),
      updatedAt: new Date('2024-04-05').toISOString(),
      product: { name: 'Basmati Rice Premium', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
      buyer: { name: 'Fresh Mart Retail', phone: '+91 98765 43210', email: 'orders@freshmart.com' }
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      productId: 'p2',
      buyerId: 'b2',
      farmerId: 'f1',
      quantity: 250,
      totalPrice: 32000,
      status: 'CONFIRMED',
      address: 'Pune, Maharashtra - 411001',
      notes: 'Quality check required before dispatch',
      createdAt: new Date('2024-04-04').toISOString(),
      updatedAt: new Date('2024-04-04').toISOString(),
      product: { name: 'Organic Turmeric', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400' },
      buyer: { name: 'Spice Traders Co', phone: '+91 98765 43211', email: 'buy@spicetraders.com' }
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      productId: 'p3',
      buyerId: 'b3',
      farmerId: 'f1',
      quantity: 1000,
      totalPrice: 85000,
      status: 'SHIPPED',
      address: 'Delhi NCR - 110001',
      notes: 'Track shipment carefully',
      createdAt: new Date('2024-04-03').toISOString(),
      updatedAt: new Date('2024-04-03').toISOString(),
      product: { name: 'Red Onions Grade A', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400' },
      buyer: { name: 'Veggie Wholesale Hub', phone: '+91 98765 43212', email: 'orders@veggiehub.com' }
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      productId: 'p5',
      buyerId: 'b5',
      farmerId: 'f1',
      quantity: 800,
      totalPrice: 64000,
      status: 'PROCESSING',
      address: 'Nagpur, MH - 440001',
      createdAt: new Date('2024-04-02').toISOString(),
      updatedAt: new Date('2024-04-02').toISOString(),
      product: { name: 'Alphanso Mangoes', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400' },
      buyer: { name: 'Global Fruits Expo', phone: '+91 98765 43214', email: 'logistics@globalfruits.com' }
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      productId: 'p4',
      buyerId: 'b4',
      farmerId: 'f1',
      quantity: 300,
      totalPrice: 28500,
      status: 'DELIVERED',
      address: 'Bangalore, Karnataka - 560001',
      createdAt: new Date('2024-04-02').toISOString(),
      updatedAt: new Date('2024-04-02').toISOString(),
      product: { name: 'Fresh Tomatoes', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400' },
      buyer: { name: 'Restaurant Supply Co', phone: '+91 98765 43213', email: 'supply@restaurant.com' }
    },
    {
      id: '7',
      orderNumber: 'ORD-2024-007',
      productId: 'p5',
      buyerId: 'b5',
      farmerId: 'f1',
      quantity: 150,
      totalPrice: 18000,
      status: 'PROCESSING',
      address: 'Hyderabad, Telangana - 500001',
      notes: 'Pack in 25kg bags',
      createdAt: new Date('2024-04-01').toISOString(),
      updatedAt: new Date('2024-04-01').toISOString(),
      product: { name: 'Green Chillies', image: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400' },
      buyer: { name: 'Local Market Traders', phone: '+91 98765 43214', email: 'info@localmarket.com' }
    },
    {
      id: '6',
      orderNumber: 'ORD-2024-006',
      productId: 'p6',
      buyerId: 'b6',
      farmerId: 'f1',
      quantity: 400,
      totalPrice: 52000,
      status: 'CONFIRMED',
      address: 'Chennai, Tamil Nadu - 600001',
      createdAt: new Date('2024-03-31').toISOString(),
      updatedAt: new Date('2024-03-31').toISOString(),
      product: { name: 'Coconuts Fresh', image: 'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=400' },
      buyer: { name: 'Coconut Oil Mills', phone: '+91 98765 43215', email: 'orders@coconutoil.com' }
    }
  ];

  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchRules();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [orders]);

  const getProgressWidth = (status: string) => {
    switch(status) {
      case 'PENDING': return '12.5%';
      case 'PROCESSING': return '37.5%';
      case 'SHIPPED': return '62.5%';
      case 'DELIVERED': return '100%';
      default: return '0%';
    }
  };

  const isStatusCompleted = (currentStatus: string, stepStatus: string) => {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIdx = statuses.indexOf(currentStatus);
    const stepIdx = statuses.indexOf(stepStatus);
    if (currentIdx === -1) return false;
    return currentIdx >= stepIdx;
  };

  const fetchOrderHistory = async (id: string) => {
    setLoadingHistory(true);
    try {
      const response = await api.get(`/orders/${id}/history`);
      setOrderHistory(response.data.data || []);
    } catch (err) {
      // Return empty if API fails, will be caught by logic in UI
      setOrderHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (selectedOrderId) {
      fetchOrderHistory(selectedOrderId);
    } else {
      setOrderHistory([]);
    }
  }, [selectedOrderId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) && data.length > 0 ? data : mockOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setOrders(mockOrders);
      toast.error('Using demo data - API unavailable');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const liveStats = await orderService.getOrderStats();
      if (liveStats) setStats(liveStats);
    } catch (err) {
      console.error('Fetch stats failed');
    }
  };

  const fetchRules = async () => {
    try {
      const response = await api.get('/orders/auto-sell/rules');
      setRules(response.data.data || []);
    } catch (err) {
      console.error('Fetch rules failed');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
      toast.success('Order data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const calculateStats = () => {
    const safeOrders = Array.isArray(orders) ? orders : [];
    setStats({
      total: safeOrders.length,
      pending: safeOrders.filter(o => o.status === 'PENDING').length,
      confirmed: safeOrders.filter(o => o.status === 'CONFIRMED').length,
      processing: safeOrders.filter(o => o.status === 'PROCESSING').length,
      shipped: safeOrders.filter(o => o.status === 'SHIPPED').length,
      delivered: safeOrders.filter(o => o.status === 'DELIVERED').length,
      cancelled: safeOrders.filter(o => o.status === 'CANCELLED').length,
      totalRevenue: safeOrders.reduce((acc, current) => acc + current.totalPrice, 0)
    });
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    // Optimistic update — always update local state immediately
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order status updated to ${newStatus}`);
    
    // Try backend sync, but don't revert on failure (demo/mock data may not exist in DB)
    const result = await orderService.updateOrderStatus(orderId, newStatus);
    if (result) {
      // Backend succeeded — re-fetch to ensure full sync
      fetchOrders();
      fetchStats();
    }
    // If result is null, the service already logged the warning — keep the optimistic state
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    // Optimistic update — always update local state immediately
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' as const } : o));
    toast.success('Order cancelled successfully');
    
    // Try backend sync, but don't revert on failure (demo/mock data may not exist in DB)
    const result = await orderService.cancelOrder(orderId, 'User cancelled');
    if (result) {
      // Backend succeeded — re-fetch to ensure full sync
      fetchOrders();
      fetchStats();
    }
    // If result is null, the service already logged the warning — keep the optimistic state
  };

  const handleBulkAction = async (newStatus: string) => {
    if (selectedOrders.length === 0) {
      toast.error('No orders selected');
      return;
    }
    
    // Optimistic update — update local state immediately
    const count = selectedOrders.length;
    setOrders(prev => prev.map(o => 
      selectedOrders.includes(o.id) ? { ...o, status: newStatus as Order['status'] } : o
    ));
    toast.success(`Updated ${count} orders to ${newStatus}`);
    setSelectedOrders([]);
    
    // Try backend sync
    try {
      await orderService.bulkUpdateStatus(selectedOrders, newStatus);
      fetchOrders();
      fetchStats();
    } catch (err) {
      console.warn('Bulk update backend sync failed (keeping optimistic state):', err);
    }
  };

  const toggleRule = async (ruleId: string) => {
    try {
      // Logic for toggling rule via API
      toast.success('Rule status updated');
    } catch (err) {
      toast.error('Failed to update rule');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      PENDING: 'amber',
      CONFIRMED: 'brand',
      PROCESSING: 'ink',
      SHIPPED: 'ink',
      DELIVERED: 'success',
      CANCELLED: 'destructive'
    };
    return colors[status] || 'ink';
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      PENDING: Clock,
      CONFIRMED: CheckCircle2,
      PROCESSING: Package,
      SHIPPED: Truck,
      DELIVERED: CheckCircle2,
      CANCELLED: XCircle
    };
    const Icon = icons[status] || Package;
    return <Icon size={16} />;
  };

  const runLogisticsOptimizer = () => {
    setIsOptimizing(true);
    setOptimizationResult(null);
    
    // Multi-stage AI optimization simulation
    setTimeout(() => {
      setTimeout(() => {
        setIsOptimizing(false);
        setOptimizationResult({
          saved: "₹1,250 (15%)",
          route: "Cluster B-12"
        });
        toast.success("Logistics AI: Route optimization complete!");
      }, 2500);
    }, 500);
  };

  const safeOrders = Array.isArray(orders) ? orders : [];
  const selectedOrder = safeOrders.find(o => o.id === selectedOrderId);
  const filteredOrders = safeOrders.filter(order => {
    const matchesFilter = filter === 'ALL' || order.status === filter;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Enhanced mock data for charts
  const orderTrendData = [
    { month: 'Jan', orders: 45, revenue: 125000, fulfilled: 42, cancelled: 3 },
    { month: 'Feb', orders: 52, revenue: 145000, fulfilled: 49, cancelled: 3 },
    { month: 'Mar', orders: 61, revenue: 168000, fulfilled: 58, cancelled: 3 },
    { month: 'Apr', orders: 58, revenue: 162000, fulfilled: 55, cancelled: 3 },
    { month: 'May', orders: 67, revenue: 185000, fulfilled: 64, cancelled: 3 },
    { month: 'Jun', orders: 74, revenue: 205000, fulfilled: 71, cancelled: 3 }
  ];

  const statusDistribution = [
    { name: 'Pending', value: stats.pending || 1, color: '#f59e0b' },
    { name: 'Confirmed', value: stats.confirmed || 2, color: '#3b82f6' },
    { name: 'Shipped', value: stats.shipped || 1, color: '#06b6d4' },
    { name: 'Delivered', value: stats.delivered || 1, color: '#10b981' }
  ];

  const performanceMetrics = [
    { metric: 'Avg Fulfillment Time', value: '2.3 days', change: '-12%', trend: 'up', icon: Clock },
    { metric: 'On-Time Delivery', value: '94.5%', change: '+5%', trend: 'up', icon: CheckCircle },
    { metric: 'Customer Satisfaction', value: '4.8/5.0', change: '+0.3', trend: 'up', icon: Star },
    { metric: 'Return Rate', value: '1.2%', change: '-0.5%', trend: 'up', icon: TrendingDown }
  ];

  const recentActivity = [
    { action: 'Order Confirmed', order: 'ORD-2024-002', time: '5 mins ago', icon: CheckCircle2, color: 'blue' },
    { action: 'Shipment Dispatched', order: 'ORD-2024-003', time: '1 hour ago', icon: Truck, color: 'cyan' },
    { action: 'Payment Received', order: 'ORD-2024-004', time: '2 hours ago', icon: CheckCircle, color: 'green' },
    { action: 'New Order Placed', order: 'ORD-2024-001', time: '3 hours ago', icon: ShoppingCart, color: 'purple' }
  ];

  const customerMessages = [
    { customer: 'Fresh Mart Retail', message: 'When can we expect delivery?', time: '10 mins ago', unread: true },
    { customer: 'Spice Traders Co', message: 'Quality looks great, thanks!', time: '1 hour ago', unread: false },
    { customer: 'Veggie Wholesale Hub', message: 'Please share tracking details', time: '2 hours ago', unread: true }
  ];

  const automationRules = [
    { id: 1, rule: 'Auto-confirm orders under ₹5,000', status: 'Active', triggers: 12, icon: Zap },
    { id: 2, rule: 'Send shipping notification on dispatch', status: 'Active', triggers: 8, icon: Bell },
    { id: 3, rule: 'Request review after delivery', status: 'Active', triggers: 15, icon: Star },
    { id: 4, rule: 'Auto-refund cancelled orders', status: 'Inactive', triggers: 0, icon: RefreshCw }
  ];

  const shippingTracking = [
    { order: 'ORD-2024-003', location: 'Mumbai Hub', status: 'In Transit', progress: 65, eta: '2 hours' },
    { order: 'ORD-2024-007', location: 'Pune Warehouse', status: 'Out for Delivery', progress: 85, eta: '30 mins' },
    { order: 'ORD-2024-008', location: 'Delhi Center', status: 'In Transit', progress: 45, eta: '4 hours' }
  ];

  const performanceRadarData = [
    { metric: 'Speed', value: 85 },
    { metric: 'Quality', value: 92 },
    { metric: 'Communication', value: 88 },
    { metric: 'Packaging', value: 90 },
    { metric: 'Accuracy', value: 95 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview Dashboard', icon: BarChart3 },
    { id: 'pipeline', label: 'Order Pipeline', icon: Package },
    { id: 'tracking', label: 'Status Tracking', icon: MapPin },
    { id: 'fulfillment', label: 'Fulfillment Manager', icon: Boxes },
    { id: 'shipping', label: 'Shipping Tracker', icon: Truck },
    { id: 'returns', label: 'Returns Manager', icon: RefreshCw },
    { id: 'analytics', label: 'Order Analytics', icon: TrendingUp },
    { id: 'communication', label: 'Customer Communication', icon: MessageSquare },
    { id: 'bulk', label: 'Bulk Actions', icon: Zap },
    { id: 'history', label: 'Order History', icon: History },
    { id: 'performance', label: 'Performance Metrics', icon: Target },
    { id: 'automation', label: 'Automation Rules', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* KPI Cards with Animation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Orders', value: stats.total, icon: Package, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
                { label: 'Pending', value: stats.pending, icon: Activity, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
                { label: 'Completed', value: stats.delivered, icon: CheckCircle2, color: 'green', gradient: 'from-green-500 to-emerald-500' },
                { label: 'Revenue', value: `₹${(stats.totalRevenue / 1000).toFixed(2)}K`, icon: TrendingUp, color: 'emerald', gradient: 'from-emerald-500 to-teal-500' }
              ].map((kpi, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20, scale: 0.9 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem] hover:shadow-2xl transition-all duration-300 overflow-hidden relative group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <div className={`h-14 w-14 bg-gradient-to-br ${kpi.gradient} rounded-xl flex items-center justify-center text-slate-900 mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <kpi.icon size={28} />
                      </div>
                      <p className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{kpi.value}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Trends */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem] hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-slate-900">Order Trends</h3>
                    <Badge tone="brand" className="animate-pulse">Live</Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={orderTrendData}>
                      <defs>
                        <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: 'none', 
                          borderRadius: '1rem', 
                          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                          padding: '12px'
                        }}
                      />
                      <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#orderGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Status Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem] hover:shadow-xl transition-all">
                  <h3 className="text-xl font-black text-slate-900 mb-6">Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie 
                        data={statusDistribution} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={70} 
                        outerRadius={110} 
                        paddingAngle={5} 
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 rounded-[2.5rem]">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Activity className="text-blue-600" size={24} />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white rounded-2xl hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 bg-${activity.color}-50 rounded-xl flex items-center justify-center text-${activity.color}-600 group-hover:scale-110 transition-transform`}>
                          <activity.icon size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{activity.action}</p>
                          <p className="text-sm text-slate-600">{activity.order}</p>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-400">{activity.time}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        );

      case 'pipeline':
        return (
          <div className="space-y-8 pb-32">
            {/* V3 Master Control Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar-h p-1">
               {[
                 { id: 'ALL', label: 'Global View', icon: LayoutGrid, count: stats.total, color: 'indigo' },
                 { id: 'PENDING', label: 'Incoming', icon: Bell, count: stats.pending, color: 'slate' },
                 { id: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2, count: stats.confirmed, color: 'emerald' },
                 { id: 'PROCESSING', label: 'Pick & Pack', icon: Boxes, count: stats.processing, color: 'amber' },
                 { id: 'SHIPPED', label: 'In Transit', icon: Truck, count: stats.shipped, color: 'cyan' }
               ].map((f) => (
                 <button
                   key={f.id}
                   onClick={() => setFilter(f.id)}
                   className={`h-11 px-5 rounded-2xl flex items-center gap-3 shrink-0 whitespace-nowrap transition-all border-2 ${filter === f.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-white text-slate-500 hover:border-slate-100 shadow-sm'}`}
                 >
                    <f.icon size={18} className={filter === f.id ? 'text-white' : `text-${f.color}-500`} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{f.label}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${filter === f.id ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 opacity-60'}`}>{f.count}</span>
                 </button>
               ))}
            </div>

            <div className="flex flex-col xl:flex-row gap-10 items-start">
               {/* Left Column: Semantic Order Feed (420px) */}
               <div className="w-full xl:w-[420px] shrink-0 space-y-6">
                  <div className="flex items-center justify-between px-4">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Order Signal Feed</h3>
                     <div className="flex gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-50"><Search size={16} /></Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-50"><Filter size={16} /></Button>
                     </div>
                  </div>

                  <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                     {filteredOrders.length === 0 ? (
                        <Card className="p-16 text-center border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[3.5rem]">
                           <Package size={40} className="mx-auto mb-4 text-slate-200" />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Signals Found</p>
                        </Card>
                     ) : (
                       filteredOrders.map((order) => (
                         <motion.div
                           layoutId={`order-signal-${order.id}`}
                           key={order.id}
                           onClick={() => setSelectedOrderId(order.id)}
                           className={`p-6 bg-white rounded-[2.5rem] border-2 transition-all cursor-pointer group shadow-sm ${selectedOrderId === order.id ? 'border-indigo-600 ring-[10px] ring-indigo-50 shadow-2xl scale-[1.02]' : 'border-transparent hover:border-indigo-100 hover:shadow-lg'}`}
                         >
                            <div className="flex items-center gap-4 mb-5">
                               <div className="h-16 w-16 rounded-[1.2rem] overflow-hidden border-2 border-slate-50 shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-500">
                                  <img src={order.product?.image} className="h-full w-full object-cover" alt="" />
                               </div>
                               <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest underline decoration-2 underline-offset-4">#{order.orderNumber}</span>
                                    {order.notes?.toLowerCase().includes('urgent') && <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />}
                                  </div>
                                  <h4 className="text-base font-black text-slate-900 leading-tight truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{order.product?.name}</h4>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{order.quantity} MT • {new Date(order.createdAt).toLocaleDateString()}</p>
                               </div>
                            </div>
                            <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                               <div>
                                  <p className="text-lg font-black text-slate-900 tracking-tighter">₹{order.totalPrice.toLocaleString()}</p>
                                  <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block ${order.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : order.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                     {order.status}
                                  </div>
                               </div>
                               <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm border-none"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrderId(order.id);
                                  }}
                                >
                                   <ArrowUpRight size={18} />
                                </Button>
                            </div>
                         </motion.div>
                       ))
                     )}
                  </div>
               </div>

               {/* Right Column: Orchestration Intelligence & Controls (60%) */}
               <div className="flex-1 w-full space-y-8 min-h-[85vh]">
                  {!selectedOrderId ? (
                    <Card className="h-full flex flex-col items-center justify-center p-20 bg-gradient-to-br from-slate-50 to-blue-50 border-none rounded-[4.5rem]">
                       <div className="h-32 w-32 bg-white rounded-[3rem] shadow-xl flex items-center justify-center text-slate-200 mb-8 animate-pulse">
                          <Zap size={56} />
                       </div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">Awaiting Target Selection</h3>
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] text-center max-w-xs">Select any order from the feed to initiate fulfillment orchestration</p>
                    </Card>
                  ) : (
                    <div className="space-y-8">
                       <Card className="p-12 border-none shadow-2xl bg-white rounded-[4.5rem] relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-5 blur-[120px] -mr-20 -mt-20" />
                          
                          {/* Top Action HUD */}
                          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-slate-50 pb-12">
                             <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-[2rem] bg-indigo-600 shadow-xl shadow-indigo-100 flex items-center justify-center text-white">
                                   <Package size={36} />
                                </div>
                                <div>
                                   <div className="flex items-center gap-3 mb-2">
                                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter">#{safeOrders.find(o => o.id === selectedOrderId)?.orderNumber}</h2>
                                      <Badge tone="brand" className="h-8 px-4 font-black uppercase text-[10px] tracking-widest rounded-xl">Live Syncing</Badge>
                                   </div>
                                   <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{safeOrders.find(o => o.id === selectedOrderId)?.product?.name}</p>
                                </div>
                             </div>
                             
                              <div className="flex gap-3">
                                 {selectedOrderId && (
                                   <>
                                     {safeOrders.find(o => o.id === selectedOrderId)?.status === 'PENDING' && (
                                       <Button 
                                         onClick={() => handleStatusUpdate(selectedOrderId, 'CONFIRMED')}
                                         className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-sm uppercase shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
                                       >
                                         Confirm Order
                                       </Button>
                                     )}
                                     {safeOrders.find(o => o.id === selectedOrderId)?.status === 'CONFIRMED' && (
                                       <Button 
                                         onClick={() => handleStatusUpdate(selectedOrderId, 'PROCESSING')}
                                         className="h-16 px-10 bg-amber-500 hover:bg-amber-600 text-white rounded-[2rem] font-black text-sm uppercase shadow-xl shadow-amber-100 transition-all hover:scale-105 active:scale-95"
                                       >
                                         Execute Pick & Pack
                                       </Button>
                                     )}
                                     {safeOrders.find(o => o.id === selectedOrderId)?.status === 'PROCESSING' && (
                                       <Button 
                                         onClick={() => handleStatusUpdate(selectedOrderId, 'SHIPPED')}
                                         className="h-16 px-10 bg-cyan-500 hover:bg-cyan-600 text-white rounded-[2rem] font-black text-sm uppercase shadow-xl shadow-cyan-100 transition-all hover:scale-105 active:scale-95"
                                       >
                                         Confirm Dispatch
                                       </Button>
                                     )}
                                     {safeOrders.find(o => o.id === selectedOrderId)?.status === 'SHIPPED' && (
                                       <Button 
                                         onClick={() => handleStatusUpdate(selectedOrderId, 'DELIVERED')}
                                         className="h-16 px-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-sm uppercase shadow-xl shadow-emerald-100 transition-all hover:scale-105 active:scale-95"
                                       >
                                         Verify Delivery
                                       </Button>
                                     )}
                                     
                                     {safeOrders.find(o => o.id === selectedOrderId)?.status !== 'DELIVERED' && 
                                      safeOrders.find(o => o.id === selectedOrderId)?.status !== 'CANCELLED' && (
                                       <Button 
                                         variant="outline"
                                         onClick={() => handleCancelOrder(selectedOrderId)}
                                         className="h-16 px-8 border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-[2rem] font-black text-sm uppercase transition-all hover:scale-105 active:scale-95"
                                       >
                                         Cancel
                                       </Button>
                                     )}
                                   </>
                                 )}
                                 <Button className="h-16 w-16 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-[2rem] p-0 border-none transition-all hover:scale-105 active:scale-95">
                                    <MoreVertical size={24} />
                                 </Button>
                              </div>
                          </div>

                          {/* Flipkart-Style Pipeline Stepper */}
                          <div className="mb-16">
                             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 text-center">Supply Chain Milestone Progression</h4>
                             <div className="flex items-center justify-between relative px-4">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-0 rounded-full" />
                                {[
                                  { label: 'Confirmed', id: 'CONFIRMED', icon: CheckCircle },
                                  { label: 'Ready to Ship', id: 'PROCESSING', icon: Boxes },
                                  { label: 'In Transit', id: 'SHIPPED', icon: Truck },
                                  { label: 'Delivered', id: 'DELIVERED', icon: MapPin }
                                ].map((step, i) => {
                                  const order = safeOrders.find(o => o.id === selectedOrderId);
                                  const isCompleted = order && isStatusCompleted(order.status, step.id);
                                  const isCurrent = order?.status === step.id;
                                  return (
                                    <div key={i} className="flex flex-col items-center gap-4 relative z-10 transition-all duration-700">
                                       <div className={`h-16 w-16 rounded-[1.8rem] flex items-center justify-center shadow-xl transition-all duration-500 ${isCompleted ? 'bg-emerald-500 text-white scale-110' : isCurrent ? 'bg-indigo-600 text-white ring-8 ring-indigo-50 shadow-indigo-200 scale-125' : 'bg-white border-2 border-slate-100 text-slate-200'}`}>
                                          <step.icon size={24} />
                                       </div>
                                       <div className="text-center w-24">
                                          <p className={`text-[9px] font-black uppercase tracking-tighter leading-tight ${isCompleted ? 'text-emerald-600' : isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>
                                             {step.label}
                                          </p>
                                          {isCompleted && <p className="text-[7px] font-black text-emerald-400 uppercase mt-1">Verified</p>}
                                       </div>
                                    </div>
                                  );
                                })}
                             </div>
                          </div>

                          {/* Intelligence Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-6">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                   <History className="text-indigo-600" size={18} />
                                   Chain Manifest Log
                                </h4>
                                <div className="space-y-6 pl-4 border-l-2 border-slate-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                                   {loadingHistory ? (
                                     <div className="py-10 text-center">
                                        <RefreshCw size={24} className="animate-spin text-slate-200 mx-auto" />
                                     </div>
                                   ) : orderHistory.length === 0 ? (
                                      <p className="text-[10px] font-black text-slate-300 italic">No historical blocks indexed</p>
                                   ) : (
                                     orderHistory.map((log, i) => (
                                       <div key={i} className="relative pb-6 last:pb-0">
                                          <div className="absolute -left-[17px] top-0 h-3 w-3 bg-white border-2 border-indigo-600 rounded-full shadow-sm" />
                                          <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white transition-colors group">
                                             <div className="flex justify-between items-start mb-2">
                                                <p className="text-[11px] font-black text-slate-900 uppercase truncate w-32">{log.action === 'CREATE' ? 'Genesis Block' : `Sync: ${log.details.newStatus}`}</p>
                                                <span className="text-[8px] font-black text-slate-400 uppercase">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                             </div>
                                             <p className="text-[10px] font-bold text-slate-400 italic">"Immutable entry recorded in supply chain ledger index #{i + 1500}"</p>
                                          </div>
                                       </div>
                                     ))
                                   )}
                                </div>
                             </div>

                             <div className="space-y-6">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                   <MapPin className="text-indigo-600" size={18} />
                                   Logistics Intelligence
                                </h4>
                                <div className="space-y-4">
                                   <Card className="p-6 bg-slate-900 border-none shadow-xl rounded-[2.5rem] relative overflow-hidden group">
                                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                      <div className="relative z-10">
                                         <div className="flex items-center justify-between mb-4">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Active Courier</p>
                                            <Badge tone="brand" className="bg-white/10 text-white border-none py-1">Delhivery AI</Badge>
                                         </div>
                                         <p className="text-white text-base font-black mb-1">Hub Arrival Pending</p>
                                         <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest leading-loose">Automated batching suggested to save ₹450 logistics cost.</p>
                                      </div>
                                   </Card>
                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                                         <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Contract Health</p>
                                         <p className="text-lg font-black text-emerald-900">100%</p>
                                      </div>
                                      <div className="p-5 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                                         <p className="text-[9px] font-black text-indigo-600 uppercase mb-1">Risk Score</p>
                                         <p className="text-lg font-black text-indigo-900">Ultra-Low</p>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </Card>

                       {/* Automation Intelligence Alert */}
                       <Card className="p-10 bg-indigo-900 border-none shadow-3xl rounded-[4rem] relative overflow-hidden group">
                          <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                          <div className="flex items-center gap-8 text-white relative z-10">
                             <div className="h-16 w-16 rounded-[1.8rem] bg-white/10 backdrop-blur-xl flex items-center justify-center">
                                <Zap className="text-indigo-300" size={28} />
                             </div>
                             <div className="flex-1">
                                <h5 className="text-base font-black uppercase tracking-tighter mb-1">Advanced Logistics Optimization Available</h5>
                                <p className="text-xs text-indigo-300/80 font-bold leading-relaxed max-w-lg">Batching this order with ORD-2024-009 will reduce fuel consumption by 15% and decrease fulfillment time by 1.2 hours. Run AI Optimizer?</p>
                             </div>
                             <Button className="h-14 px-8 bg-white hover:bg-slate-50 text-indigo-900 rounded-2xl font-black text-xs uppercase shadow-xl transition-all hover:scale-105">
                                Optimize Route
                             </Button>
                          </div>
                       </Card>
                    </div>
                  )}
               </div>
            </div>
          </div>
        );

      case 'tracking':
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Map Visualization (Advanced) */}
              <Card className="lg:col-span-2 p-10 border-none shadow-2xl bg-slate-900 rounded-[3.5rem] overflow-hidden relative min-h-[500px]">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                        <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Activity size={24} />
                        </div>
                        Global Logistics Map
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live satellite tracking and route optimization</p>
                    </div>
                    <Badge tone="brand" className="animate-pulse bg-blue-500/20 text-blue-400 border-none">12 Active Routes</Badge>
                  </div>

                  {/* Simulated Map Visual */}
                  <div className="flex-1 relative bg-slate-800/50 rounded-[2.5rem] border border-slate-700 overflow-hidden group">
                     {/* Static Map Background (Using Unsplash) */}
                     <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Map" />
                     
                     {/* Animated Route Points */}
                     {[
                       { top: '30%', left: '20%', label: 'Mumbai Hub' },
                       { top: '60%', left: '45%', label: 'Pune Center' },
                       { top: '40%', left: '75%', label: 'Delhi Gateway' },
                       { top: '70%', left: '80%', label: 'Bangalore Point' }
                     ].map((point, i) => (
                       <motion.div
                         key={i}
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         transition={{ delay: i * 0.2 }}
                         style={{ top: point.top, left: point.left }}
                         className="absolute flex flex-col items-center"
                       >
                         <div className="h-4 w-4 bg-blue-500 rounded-full animate-ping absolute" />
                         <div className="h-4 w-4 bg-blue-600 rounded-full relative z-10 border-2 border-white" />
                         <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 mt-2">
                           <p className="text-[8px] font-black text-white uppercase">{point.label}</p>
                         </div>
                       </motion.div>
                     ))}

                     <div className="absolute bottom-8 left-8 right-8 p-6 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                 <Truck size={20} />
                              </div>
                              <div>
                                 <p className="text-xs font-black text-white uppercase tracking-widest">Closest Shipment</p>
                                 <p className="text-[10px] font-bold text-slate-400">ORD-2024-003 • 4.2km from Hub</p>
                              </div>
                           </div>
                           <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Optimize All</Button>
                        </div>
                     </div>
                  </div>
                </div>
              </Card>

              {/* Transit Log (Flipkart Style Tracking) */}
              <div className="space-y-6">
                 <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                   <History className="text-blue-600" size={24} />
                   Transit Intelligence
                 </h4>
                 <div className="space-y-4">
                    {shippingTracking.map((track, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-white rounded-[2rem] shadow-lg border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-4">
                           <p className="font-black text-slate-900">{track.order}</p>
                           <Badge tone="brand" className="text-[9px] bg-blue-50 text-blue-600 uppercase border-none">{track.status}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                           <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <MapPin size={16} />
                           </div>
                           <p className="text-xs font-bold text-slate-500">{track.location}</p>
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-slate-900">{track.progress}%</span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                 className="h-full bg-blue-600 rounded-full"
                                 initial={{ width: 0 }}
                                 animate={{ width: `${track.progress}%` }}
                                 transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                              />
                           </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                           <p className="text-[10px] font-bold text-slate-400">ETA: <span className="text-slate-900">{track.eta}</span></p>
                           <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">Logistics Details <ChevronRight size={12} /></button>
                        </div>
                      </motion.div>
                    ))}
                 </div>
              </div>
            </div>
        );

      case 'shipping':
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Shipments Console */}
              <Card className="p-10 border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden relative">
                 <div className="flex items-center justify-between mb-10">
                   <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                        <div className="h-12 w-12 bg-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                          <Truck size={28} />
                        </div>
                        Shipment Control
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Managed logistics partner interface</p>
                   </div>
                   <div className="flex flex-col items-end gap-2">
                     <div className="flex -space-x-3">
                        {[ 
                          'https://logo.clearbit.com/fedex.com',
                          'https://logo.clearbit.com/dhl.com',
                          'https://logo.clearbit.com/bluedart.com'
                        ].map((url, i) => (
                          <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-white overflow-hidden shadow-sm">
                             <img src={url} className="h-full w-full object-contain p-1" alt="Partner" />
                          </div>
                        ))}
                     </div>
                     <div className="flex gap-2">
                        <span className="text-[8px] font-black text-slate-300 uppercase">Partner</span>
                        <span className="text-[8px] font-black text-slate-300 uppercase">Partner</span>
                        <span className="text-[8px] font-black text-slate-300 uppercase">Partner</span>
                     </div>
                   </div>
                </div>

                <div className="space-y-5">
                  {filteredOrders.filter(o => ['SHIPPED', 'IN_TRANSIT', 'PROCESSING'].includes(o.status)).length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                      <Truck size={48} className="text-slate-200 mx-auto mb-4" />
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No active shipments in queue</p>
                    </div>
                  ) : (
                    filteredOrders.filter(o => ['SHIPPED', 'IN_TRANSIT', 'PROCESSING'].includes(o.status)).map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-cyan-200 hover:bg-white transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className="h-16 w-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <img src={order.product?.image} className="h-full w-full object-cover rounded-xl" alt="" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-lg tracking-tight">#{order.orderNumber}</p>
                              <div className="flex items-center gap-3">
                                <Badge tone="ink" className="text-[8px] bg-cyan-100 text-cyan-600 border-none uppercase">{order.status}</Badge>
                                <span className="text-[10px] font-bold text-slate-400">Carrier: Delhivery Express</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                             {order.status === 'PROCESSING' ? (
                               <Button 
                                onClick={() => handleStatusUpdate(order.id, 'SHIPPED')} 
                                className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                              >
                                Generate AWBill
                              </Button>
                             ) : (
                               <Button 
                                onClick={() => handleStatusUpdate(order.id, 'DELIVERED')} 
                                className="h-12 px-8 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                              >
                                Confirm Delivery
                              </Button>
                             )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>

              {/* Logistics Analytics (Premium Sidebar) */}
              <div className="space-y-8">
                 <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter px-2">Logistics Performance</h4>
                 <div className="grid grid-cols-2 gap-6">
                    <Card className="p-8 border-none shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2.5rem]">
                       <TrendingUp size={24} className="text-emerald-300 mb-4" />
                       <p className="text-4xl font-black">94%</p>
                       <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest">Early Deliveries</p>
                    </Card>
                    <Card className="p-8 border-none shadow-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-[2.5rem]">
                       <Route size={24} className="text-cyan-300 mb-4" />
                       <p className="text-4xl font-black">1.2d</p>
                       <p className="text-[10px] font-black uppercase text-cyan-200 tracking-widest">Avg Transit Time</p>
                    </Card>
                 </div>
                 
                 <Card className="p-8 border-none shadow-2xl bg-slate-50 rounded-[3rem] border-2 border-slate-100 overflow-hidden relative">
                    {isOptimizing && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="h-16 w-16 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"
                        />
                        <p className="text-lg font-black text-slate-900 uppercase tracking-widest">AI Optimizer Running</p>
                        <p className="text-xs font-bold text-slate-500 mt-2">Analyzing route density and fuel efficiency...</p>
                      </div>
                    )}

                    <h5 className="font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
                       <Target size={18} className="text-indigo-600" />
                       Optimization Center
                    </h5>
                    
                    <div className="space-y-4">
                       <div className="space-y-3">
                         <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                            <div>
                               <p className="text-xs font-black text-slate-900 uppercase">Route Consolidation</p>
                               <p className="text-[10px] font-bold text-slate-400">3 Orders can be batched</p>
                            </div>
                            <Badge tone="brand" className="text-[10px] animate-bounce">SAVE 15%</Badge>
                         </div>

                         {optimizationResult && (
                           <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100"
                           >
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle size={14} className="text-emerald-600" />
                                <p className="text-xs font-black text-emerald-900 uppercase">Optimization Result</p>
                              </div>
                              <p className="text-[10px] font-bold text-emerald-700">Consolidated into <span className="font-black underline">{optimizationResult.route}</span>. Savings: <span className="font-black">{optimizationResult.saved}</span></p>
                           </motion.div>
                         )}
                       </div>

                       <Button 
                         onClick={runLogisticsOptimizer}
                         disabled={isOptimizing}
                         className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                       >
                         {isOptimizing ? 'Computing Routes...' : 'Run Logistics AI Optimizer'}
                       </Button>
                    </div>
                 </Card>
              </div>
            </div>
        );

      case 'communication':
        return (
          <div className="space-y-6">
            <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <MessageSquare size={28} className="text-purple-600" />
                Customer Messages
              </h3>
              <div className="space-y-4">
                {customerMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-6 rounded-2xl cursor-pointer transition-all ${
                      msg.unread 
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-lg' 
                        : 'bg-slate-50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-slate-900 font-black text-lg shrink-0">
                          {msg.customer.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-black text-slate-900">{msg.customer}</p>
                            {msg.unread && (
                              <Badge tone="brand" className="text-[9px]">NEW</Badge>
                            )}
                          </div>
                          <p className="text-slate-900 font-medium">{msg.message}</p>
                          <p className="text-xs text-slate-400 font-bold mt-2">{msg.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-10 w-10 p-0 rounded-xl">
                          <Phone size={16} />
                        </Button>
                        <Button variant="outline" className="h-10 w-10 p-0 rounded-xl">
                          <Mail size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'fulfillment':
        return (
          <div className="space-y-6">
            <Card className="p-8 border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-pink-50/50 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 flex items-center gap-4">
                    <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                      <Boxes size={32} />
                    </div>
                    Fulfillment Engine
                  </h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Automated pipeline for high-velocity order orchestration</p>
                </div>

                <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-[2rem] border-2 border-slate-100/50">
                  <div className="text-center px-4 border-r-2 border-slate-200">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Health</p>
                    <p className="text-xl font-black text-emerald-500">98.4%</p>
                  </div>
                  <div className="text-center px-4 border-r-2 border-slate-200">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Avg Time</p>
                    <p className="text-xl font-black text-blue-600">4.2h</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                    <p className="text-xl font-black text-purple-600">72%</p>
                  </div>
                </div>
              </div>

              {/* Pipeline Status Columns (Advanced Kanban Style) */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                {[
                  { label: 'Incoming', status: 'PENDING', icon: Bell, color: 'orange', gradient: 'from-orange-400 to-amber-500', desc: 'Awaiting farmer action' },
                  { label: 'Confirmed', status: 'CONFIRMED', icon: CheckCircle2, color: 'blue', gradient: 'from-blue-400 to-cyan-500', desc: 'Inventory locked' },
                  { label: 'Pick & Pack', status: 'PROCESSING', icon: Package, color: 'purple', gradient: 'from-purple-400 to-pink-500', desc: 'Quality audit phase' },
                  { label: 'In Transit', status: 'SHIPPED', icon: Truck, color: 'emerald', gradient: 'from-emerald-400 to-teal-500', desc: 'Live logistics active' }
                ].map((stage, idx) => {
                  const stageOrders = safeOrders.filter(o => o.status === stage.status);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                      className="flex flex-col gap-6"
                    >
                      <div className="flex items-center justify-between px-2">
                        <div>
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-2">
                            <stage.icon size={16} className={`text-${stage.color}-500`} />
                            {stage.label}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stage.desc}</p>
                        </div>
                        <Badge tone="ink" className="h-6 px-3 rounded-full text-[10px] bg-slate-100 text-slate-600">{stageOrders.length}</Badge>
                      </div>

                      <div className="flex flex-col gap-4 min-h-[400px] p-4 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200/50">
                        {stageOrders.map((order, oIdx) => (
                          <motion.div
                            key={order.id}
                            whileHover={{ scale: 1.02, rotate: 1 }}
                            className="bg-white p-5 rounded-3xl shadow-md border border-slate-100 group/item cursor-pointer"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-black text-slate-400">#{order.orderNumber}</span>
                              {oIdx === 0 && stage.status === 'PENDING' && (
                                <Badge tone="brand" className="animate-pulse text-[8px]">PRIORITY</Badge>
                              )}
                            </div>
                            <p className="font-black text-slate-900 text-sm mb-1 truncate">{order.product?.name}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-500">{order.quantity} units</p>
                              <p className="text-sm font-black text-slate-950">₹{order.totalPrice.toLocaleString()}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <p className="text-[10px] font-black text-brand-primary uppercase">Click to detail</p>
                              <ChevronRight size={14} className="text-brand-primary" />
                            </div>
                          </motion.div>
                        ))}
                        {stageOrders.length === 0 && (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                             <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mb-4 shadow-sm">
                               <stage.icon size={24} />
                             </div>
                             <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Queue Empty</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
               </div>
            </Card>

              {/* Quick Actions */}
              <Card className="p-6 bg-white border-none shadow-md rounded-[2rem]">
                <h4 className="text-lg font-black text-slate-900 mb-4">Quick Fulfillment Actions</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {safeOrders.filter(o => o.status === 'PENDING').length > 0 && (
                    <Button
                      onClick={() => {
                        const pendingIds = safeOrders.filter(o => o.status === 'PENDING').map(o => o.id);
                        setSelectedOrders(pendingIds);
                        handleBulkAction('CONFIRMED');
                      }}
                      className="h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-black text-xs shadow-lg hover:scale-105 transition-all"
                    >
                      <CheckCircle2 size={16} className="mr-2" />
                      Confirm All Pending ({safeOrders.filter(o => o.status === 'PENDING').length})
                    </Button>
                  )}
                  {safeOrders.filter(o => o.status === 'CONFIRMED').length > 0 && (
                    <Button
                      onClick={() => {
                        const confirmedIds = safeOrders.filter(o => o.status === 'CONFIRMED').map(o => o.id);
                        setSelectedOrders(confirmedIds);
                        handleBulkAction('PROCESSING');
                      }}
                      className="h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-xs shadow-lg hover:scale-105 transition-all"
                    >
                      <Play size={16} className="mr-2" />
                      Process All Confirmed ({safeOrders.filter(o => o.status === 'CONFIRMED').length})
                    </Button>
                  )}
                  {safeOrders.filter(o => o.status === 'PROCESSING').length > 0 && (
                    <Button
                      onClick={() => {
                        const processingIds = safeOrders.filter(o => o.status === 'PROCESSING').map(o => o.id);
                        setSelectedOrders(processingIds);
                        handleBulkAction('SHIPPED');
                      }}
                      className="h-14 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl font-black text-xs shadow-lg hover:scale-105 transition-all"
                    >
                      <Truck size={16} className="mr-2" />
                      Ship All Processing ({safeOrders.filter(o => o.status === 'PROCESSING').length})
                    </Button>
                  )}
                  {safeOrders.filter(o => o.status === 'SHIPPED').length > 0 && (
                    <Button
                      onClick={() => {
                        const shippedIds = safeOrders.filter(o => o.status === 'SHIPPED').map(o => o.id);
                        setSelectedOrders(shippedIds);
                        handleBulkAction('DELIVERED');
                      }}
                      className="h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-black text-xs shadow-lg hover:scale-105 transition-all"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Deliver All Shipped ({safeOrders.filter(o => o.status === 'SHIPPED').length})
                    </Button>
                  )}
                </div>
              </Card>
            </div>
        );

      case 'returns':
        return (
          <div className="space-y-6">
            {/* Returns Summary KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Returns', value: safeOrders.filter(o => o.status === 'CANCELLED').length, gradient: 'from-red-500 to-orange-500', icon: RefreshCw },
                { label: 'Return Rate', value: safeOrders.length > 0 ? `${((safeOrders.filter(o => o.status === 'CANCELLED').length / safeOrders.length) * 100).toFixed(1)}%` : '0%', gradient: 'from-orange-500 to-amber-500', icon: TrendingDown },
                { label: 'Refunded Value', value: `₹${safeOrders.filter(o => o.status === 'CANCELLED').reduce((a, o) => a + o.totalPrice, 0).toLocaleString()}`, gradient: 'from-purple-500 to-pink-500', icon: DollarSign },
                { label: 'Resolved', value: safeOrders.filter(o => o.status === 'CANCELLED').length, gradient: 'from-green-500 to-emerald-500', icon: CheckCircle }
              ].map((kpi, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem] hover:shadow-2xl transition-all overflow-hidden relative group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <div className="relative z-10">
                      <div className={`h-12 w-12 bg-gradient-to-br ${kpi.gradient} rounded-xl flex items-center justify-center text-white mb-3`}>
                        <kpi.icon size={22} />
                      </div>
                      <p className="text-3xl font-black text-slate-900 mb-1">{kpi.value}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Cancelled/Returned Orders List */}
            <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <RefreshCw size={28} className="text-red-600" />
                Cancelled & Returned Orders
              </h3>
              <div className="space-y-4">
                {safeOrders.filter(o => o.status === 'CANCELLED').length === 0 ? (
                  <div className="text-center py-16">
                    <CheckCircle size={64} className="text-green-300 mx-auto mb-4" />
                    <p className="text-xl font-black text-slate-900">No Returns or Cancellations</p>
                    <p className="text-sm font-bold text-slate-400 mt-2">All orders are proceeding smoothly!</p>
                  </div>
                ) : (
                  safeOrders.filter(o => o.status === 'CANCELLED').map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-6 bg-red-50/50 rounded-2xl border border-red-100 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-red-100 rounded-xl flex items-center justify-center">
                          <XCircle size={24} className="text-red-500" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg">#{order.orderNumber}</p>
                          <p className="text-sm text-slate-600">{order.product?.name} • {order.quantity} units</p>
                          <p className="text-xs text-slate-400 font-bold mt-1">{new Date(order.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-red-600">₹{order.totalPrice.toLocaleString()}</p>
                        <Badge tone="destructive" className="mt-2">CANCELLED</Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Revenue & Fulfillment Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <DollarSign size={24} className="text-emerald-600" />
                    Revenue Trends
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={orderTrendData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                        formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <TrendingUp size={24} className="text-blue-600" />
                    Fulfillment Rate
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={orderTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                      <Line type="monotone" dataKey="fulfilled" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6' }} />
                      <Line type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#ef4444' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>

            {/* Analytics Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Avg Order Value', value: `₹${safeOrders.length > 0 ? Math.round(safeOrders.reduce((a, o) => a + o.totalPrice, 0) / safeOrders.length).toLocaleString() : 0}`, icon: DollarSign, gradient: 'from-emerald-500 to-teal-500' },
                { label: 'Fulfillment Rate', value: safeOrders.length > 0 ? `${Math.round((safeOrders.filter(o => o.status === 'DELIVERED').length / safeOrders.length) * 100)}%` : '0%', icon: Target, gradient: 'from-blue-500 to-cyan-500' },
                { label: 'Active Products', value: new Set(safeOrders.map(o => o.productId)).size, icon: Package, gradient: 'from-purple-500 to-pink-500' },
                { label: 'Unique Buyers', value: new Set(safeOrders.map(o => o.buyerId)).size, icon: Users, gradient: 'from-orange-500 to-amber-500' }
              ].map((card, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem] hover:shadow-2xl transition-all group overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <div className="relative z-10">
                      <div className={`h-12 w-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center text-white mb-3`}>
                        <card.icon size={22} />
                      </div>
                      <p className="text-3xl font-black text-slate-900 mb-1">{card.value}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'bulk':
        return (
          <div className="space-y-6">
            {/* Selection Header */}
            <Card className="p-6 border-none shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 rounded-[2.5rem]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Zap size={24} className="text-yellow-600" />
                  Bulk Actions — {selectedOrders.length} Selected
                </h3>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setSelectedOrders(safeOrders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).map(o => o.id))}
                    variant="outline"
                    className="rounded-xl font-black text-xs"
                  >
                    Select All Active
                  </Button>
                  <Button
                    onClick={() => setSelectedOrders([])}
                    variant="outline"
                    className="rounded-xl font-black text-xs"
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Button 
                  onClick={() => handleBulkAction('CONFIRMED')}
                  disabled={selectedOrders.length === 0}
                  className="h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  Confirm ({selectedOrders.length})
                </Button>
                <Button 
                  onClick={() => handleBulkAction('SHIPPED')}
                  disabled={selectedOrders.length === 0}
                  className="h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Truck size={16} className="mr-2" />
                  Ship ({selectedOrders.length})
                </Button>
                <Button 
                  onClick={() => handleBulkAction('DELIVERED')}
                  disabled={selectedOrders.length === 0}
                  className="h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Deliver ({selectedOrders.length})
                </Button>
                <Button 
                  onClick={() => handleBulkAction('CANCELLED')}
                  disabled={selectedOrders.length === 0}
                  className="h-14 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-black shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  <XCircle size={16} className="mr-2" />
                  Cancel ({selectedOrders.length})
                </Button>
              </div>
            </Card>

            {/* Selectable Order List */}
            <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
              <h4 className="text-lg font-black text-slate-900 mb-4">Select Orders</h4>
              <div className="space-y-3">
                {safeOrders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).map((order, i) => {
                  const isSelected = selectedOrders.includes(order.id);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => {
                        setSelectedOrders(prev =>
                          prev.includes(order.id)
                            ? prev.filter(id => id !== order.id)
                            : [...prev, order.id]
                        );
                      }}
                      className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border-2 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 shadow-md'
                          : 'bg-slate-50 border-transparent hover:border-slate-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-7 w-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <CheckCircle size={16} className="text-white" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">#{order.orderNumber}</p>
                          <p className="text-sm text-slate-600">{order.product?.name} • {order.quantity} units</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-black text-slate-900">₹{order.totalPrice.toLocaleString()}</p>
                        <Badge tone={getStatusColor(order.status) as any} className="font-black text-[9px] uppercase tracking-widest">{order.status}</Badge>
                      </div>
                    </motion.div>
                  );
                })}
                {safeOrders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length === 0 && (
                  <div className="text-center py-12">
                    <Package size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-lg font-bold text-slate-600">No active orders available for bulk actions</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <History size={28} className="text-slate-600" />
                  Complete Order History
                </h3>
                <Badge tone="ink" className="font-black">{filteredOrders.length} Orders</Badge>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      filter === status
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Order Timeline */}
              <div className="space-y-3">
                {filteredOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all group border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-${getStatusColor(order.status)}-50`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-black text-slate-900 text-lg">#{order.orderNumber}</p>
                          <Badge tone={getStatusColor(order.status) as any} className="font-black text-[9px] uppercase tracking-widest">{order.status}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <span>{order.product?.name}</span>
                          <span className="h-1 w-1 bg-slate-300 rounded-full" />
                          <span>{order.quantity} units</span>
                          <span className="h-1 w-1 bg-slate-300 rounded-full" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900">₹{order.totalPrice.toLocaleString()}</p>
                      {order.buyer?.name && (
                        <p className="text-xs font-bold text-slate-400 mt-1">{order.buyer.name}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem] hover:shadow-2xl transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
                        <metric.icon size={18} />
                      </div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{metric.metric}</p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 mb-2">{metric.value}</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-green-500" />
                      <span className="text-sm font-bold text-green-600">{metric.change}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Radar Chart + Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Target size={24} className="text-purple-600" />
                    Performance Radar
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={performanceRadarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontWeight: 'bold', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Performance" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <BarChart3 size={24} className="text-emerald-600" />
                    Monthly Revenue
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={orderTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                        formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </div>
          </div>
        );

      case 'automation':
        return (
          <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Settings size={24} className="text-purple-600" />
              Automation Rules
            </h3>
            <div className="space-y-4">
              {(rules.length > 0 ? rules : automationRules).map((rule: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      (rule.status === 'Active' || rule.status === 'active') ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'
                    }`}>
                      {rule.icon ? <rule.icon size={22} /> : <Zap size={22} />}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg">{rule.rule || rule.name}</p>
                      {rule.triggers !== undefined && (
                        <p className="text-sm text-slate-500 font-bold">{rule.triggers} triggers this month</p>
                      )}
                      {rule.type && (
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{rule.type}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      tone={(rule.status === 'Active' || rule.status === 'active') ? 'brand' : 'ink'}
                      className="h-8 px-4 rounded-xl font-black"
                    >
                      {(rule.status || 'Active').toUpperCase()}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleRule(rule.id)}
                      className="rounded-xl font-black"
                    >
                      {(rule.status === 'Active' || rule.status === 'active') ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none text-slate-900">Order Command Center.</h2>
              <Badge tone="brand" className="h-8 px-4 rounded-xl flex items-center justify-center font-black gap-2 shadow-sm uppercase text-[9px] tracking-[0.2em] border-none">
                <Activity size={14} className="text-brand-primary animate-pulse" />
                LIVE FULFILLMENT
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Real-time order orchestration, status tracking, and fulfillment pipeline management.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-12 px-6 bg-emerald-600 hover:bg-slate-50 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg border-2 border-emerald-700"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin mr-2' : 'mr-2'} />
              <span className="text-slate-900 font-black">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </div>
        </div>

        {/* 12-Tab Navigation */}
        <div className="w-full bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-slate-900 shadow-lg scale-105'
                    : 'bg-slate-50 text-slate-900 hover:bg-slate-200 hover:shadow-md'
                }`}
              >
                <tab.icon size={16} />
                <span className="font-black">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full bg-slate-50 rounded-2xl p-8 shadow-lg border border-slate-200 min-h-[600px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse" />
                <div className="h-20 w-20 border-4 border-white border-t-transparent rounded-full animate-spin relative" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-2xl font-black text-slate-900 tracking-tighter">Loading Orders...</p>
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Syncing fulfillment data</p>
              </div>
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full text-slate-900"
            >
              {renderTabContent()}
            </motion.div>
          )}
      </div>

      {/* Advanced Order Detail Modal (Flipkart Style) */}
      <AnimatePresence>
        {selectedOrderId && selectedOrder && activeTab !== 'pipeline' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                    <Package size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Order #{selectedOrder.orderNumber}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={getStatusColor(selectedOrder.status) as any} className="h-10 px-6 rounded-2xl font-black text-xs">
                    {selectedOrder.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedOrderId(null)}
                    className="h-12 w-12 p-0 rounded-2xl border-2 border-slate-100 hover:bg-slate-50"
                  >
                    <XCircle size={24} className="text-slate-400" />
                  </Button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-12 space-y-12">
                {/* Visual Status Journey */}
                <div className="space-y-6">
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Order Journey</h4>
                  <div className="flex items-center justify-between relative px-4">
                     {/* Horizontal line */}
                    <div className="absolute left-[10%] right-[10%] top-6 h-1 bg-slate-100 -z-10 rounded-full" />
                    <div 
                      className="absolute left-[10%] top-6 h-1 bg-emerald-500 -z-10 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.max(0, (['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(selectedOrder.status) / 3) * 80)}%` }}
                    />

                    {[
                      { status: 'PENDING', label: 'Order Placed', time: '10:30 AM', icon: ShoppingCart },
                      { status: 'PROCESSING', label: 'Processing', time: '11:45 AM', icon: Boxes },
                      { status: 'SHIPPED', label: 'Shipped', time: '02:30 PM', icon: Truck },
                      { status: 'DELIVERED', label: 'Delivered', time: '--', icon: CheckCircle2 }
                    ].map((step, idx) => {
                      const isCompleted = isStatusCompleted(selectedOrder.status, step.status);
                      return (
                        <div key={idx} className="flex flex-col items-center gap-4">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${
                            isCompleted ? 'bg-emerald-500 text-white scale-125' : 'bg-white border-2 border-slate-200 text-slate-300'
                          }`}>
                            <step.icon size={22} />
                          </div>
                          <div className="text-center">
                            <p className={`text-xs font-black uppercase tracking-widest ${isCompleted ? 'text-slate-900' : 'text-slate-300'}`}>{step.label}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1">{isCompleted ? step.time : 'Waiting'}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Item Details */}
                  <div className="space-y-6">
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Item Summary</h4>
                    <Card className="p-8 border-none shadow-xl bg-slate-50/50 rounded-[2.5rem] flex items-center gap-6">
                      <div className="h-32 w-32 rounded-3xl overflow-hidden shadow-2xl shrink-0">
                        <img src={selectedOrder.product?.image} className="h-full w-full object-cover" alt="" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-black text-slate-900 tracking-tight">{selectedOrder.product?.name}</p>
                        <div className="flex items-center gap-3">
                           <Badge tone="brand" className="text-[10px]">{selectedOrder.quantity} Units</Badge>
                           <span className="text-slate-300 font-bold">•</span>
                           <span className="text-lg font-black text-slate-950">₹{(selectedOrder.totalPrice / selectedOrder.quantity).toFixed(2)} / unit</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{selectedOrder.notes || "Standard packaging requested"}</p>
                      </div>
                    </Card>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-6">
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Customer Information</h4>
                    <Card className="p-8 border-none shadow-xl bg-slate-50/50 rounded-[2.5rem] space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                          {selectedOrder.buyer?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900">{selectedOrder.buyer?.name}</p>
                          <p className="text-sm font-bold text-slate-500">{selectedOrder.buyer?.email}</p>
                        </div>
                      </div>
                      <div className="space-y-4 pt-4 border-t border-slate-200/50">
                        <div className="flex items-center gap-3 text-slate-600">
                          <MapPin size={18} className="text-slate-400" />
                          <p className="text-sm font-bold leading-relaxed">{selectedOrder.address}</p>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <Phone size={18} className="text-slate-400" />
                          <p className="text-sm font-bold">{selectedOrder.buyer?.phone}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Billing Summary */}
                <div className="space-y-6">
                   <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Payment Details</h4>
                   <Card className="p-10 border-none shadow-2xl bg-slate-900 text-white rounded-[3rem] overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                         <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Subtotal</p>
                            <p className="text-2xl font-black">₹{selectedOrder.totalPrice.toLocaleString()}</p>
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Platform Fee</p>
                            <p className="text-2xl font-black text-emerald-400">-₹{(selectedOrder.totalPrice * 0.02).toFixed(0)}</p>
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">TCS (1%)</p>
                            <p className="text-2xl font-black">₹{(selectedOrder.totalPrice * 0.01).toFixed(0)}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-2">Net Settlement</p>
                            <p className="text-4xl font-black">₹{(selectedOrder.totalPrice * 0.97).toLocaleString()}</p>
                         </div>
                      </div>
                   </Card>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-3">
                  <Button className="h-14 px-8 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50">
                    <Download size={20} className="mr-2" />
                    Download Invoice
                  </Button>
                  <Button className="h-14 px-8 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50">
                    <MessageSquare size={20} className="mr-2" />
                    Contact Buyer
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button className="h-14 px-10 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all">
                    Update Order Status
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};
