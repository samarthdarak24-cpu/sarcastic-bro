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
  CheckCircle, AlertTriangle, Info, ChevronRight, Play, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { orderService, Order } from "@/services/orderService";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import toast from "react-hot-toast";

export function OrderControlCenter() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [filter, setFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

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
      id: '5',
      orderNumber: 'ORD-2024-005',
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
  }, []);

  useEffect(() => {
    calculateStats();
  }, [orders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getMyOrders();
      // Use mock data if API returns empty or fails
      if (!data || data.length === 0) {
        setOrders(mockOrders);
      } else {
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      // Fallback to mock data
      setOrders(mockOrders);
      toast.error('Using demo data - API unavailable');
    } finally {
      setLoading(false);
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
      shipped: safeOrders.filter(o => o.status === 'SHIPPED').length,
      delivered: safeOrders.filter(o => o.status === 'DELIVERED').length,
      cancelled: safeOrders.filter(o => o.status === 'CANCELLED').length
    });
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      await orderService.cancelOrder(orderId, reason);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      toast.error(error.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      PENDING: 'orange',
      CONFIRMED: 'blue',
      PROCESSING: 'purple',
      SHIPPED: 'cyan',
      DELIVERED: 'green',
      CANCELLED: 'red'
    };
    return colors[status] || 'gray';
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

  const safeOrders = Array.isArray(orders) ? orders : [];
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
                { label: 'Total Orders', value: stats.total || mockOrders.length, icon: Package, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
                { label: 'Active Orders', value: (stats.pending + stats.confirmed + stats.shipped) || 4, icon: Activity, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
                { label: 'Completed', value: stats.delivered || 1, icon: CheckCircle2, color: 'green', gradient: 'from-green-500 to-emerald-500' },
                { label: 'Revenue', value: '₹2.60L', icon: TrendingUp, color: 'emerald', gradient: 'from-emerald-500 to-teal-500' }
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
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  placeholder="Search orders by number or product..."
                  className="h-14 pl-12 pr-6 rounded-2xl bg-white border-2 border-slate-100 font-bold text-slate-900 placeholder:text-slate-300 focus:border-brand-primary transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="h-14 px-6 bg-slate-50 hover:bg-neut-200 text-slate-900 rounded-2xl font-black flex items-center gap-2">
                <Filter size={18} />
                Filter
              </Button>
            </div>

            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-20 text-center border-none shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 rounded-[4rem]">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="h-32 w-32 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-lg">
                      <Package size={64} className="text-slate-300" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">No Orders Found</h3>
                      <p className="text-slate-600 font-bold text-sm">
                        {searchTerm ? 'Try adjusting your search terms' : 'Orders will appear here once buyers place them'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: "spring" }}
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem] hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
                      {/* Background Gradient on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                        {/* Left Section */}
                        <div className="flex items-start gap-6 flex-1">
                          {/* Product Image */}
                          {order.product?.image && (
                            <div className="relative h-24 w-24 rounded-2xl overflow-hidden shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <img 
                                src={order.product.image} 
                                alt={order.product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Order Info */}
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                #{order.orderNumber}
                              </h3>
                              <Badge tone={getStatusColor(order.status) as any} className="h-7 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest">
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {order.product?.name || 'Product'}
                            </p>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider flex-wrap">
                              <span className="flex items-center gap-2">
                                <Package size={14} />
                                {order.quantity} units
                              </span>
                              <span className="h-1 w-1 bg-neut-200 rounded-full" />
                              <span className="flex items-center gap-2">
                                <Calendar size={14} />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              {order.address && (
                                <>
                                  <span className="h-1 w-1 bg-neut-200 rounded-full" />
                                  <span className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    {order.address.split(',')[0]}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-6">
                          <div className="text-right space-y-1">
                            <p className="text-4xl font-black text-slate-900 tracking-tight">
                              ₹{order.totalPrice.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Total Value</p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {order.status === 'PENDING' && (
                              <Button
                                onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                              >
                                <CheckCircle2 size={16} className="mr-2" />
                                Confirm
                              </Button>
                            )}
                            {order.status === 'CONFIRMED' && (
                              <Button
                                onClick={() => handleStatusUpdate(order.id, 'PROCESSING')}
                                className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                              >
                                <Play size={16} className="mr-2" />
                                Process
                              </Button>
                            )}
                            {order.status === 'PROCESSING' && (
                              <Button
                                onClick={() => handleStatusUpdate(order.id, 'SHIPPED')}
                                className="h-12 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                              >
                                <Truck size={16} className="mr-2" />
                                Ship
                              </Button>
                            )}
                            {order.status === 'SHIPPED' && (
                              <Button
                                onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                                className="h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-glow-primary hover:scale-105 transition-all"
                              >
                                <CheckCircle size={16} className="mr-2" />
                                Deliver
                              </Button>
                            )}
                            {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
                              <Button
                                onClick={() => handleCancelOrder(order.id)}
                                variant="outline"
                                className="h-12 px-6 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all"
                              >
                                <XCircle size={16} className="mr-2" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-6 pt-6 border-t border-slate-100 relative z-10">
                          <div className="flex items-start gap-3">
                            <Info size={16} className="text-blue-600 mt-1 shrink-0" />
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                              {order.notes}
                            </p>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'tracking':
        return (
          <div className="space-y-6">
            <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-[3rem]">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <MapPin className="text-blue-600" size={28} />
                Real-Time Order Tracking
              </h3>
              <div className="space-y-5">
                {shippingTracking.map((track, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="font-black text-slate-900 text-lg">{track.order}</span>
                        <p className="text-sm text-slate-600 mt-1">{track.location}</p>
                      </div>
                      <div className="text-right">
                        <Badge tone="brand" className="mb-2">{track.status}</Badge>
                        <p className="text-xs font-bold text-slate-400">ETA: {track.eta}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${track.progress > 80 ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`} />
                      <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${track.progress}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                        />
                      </div>
                      <span className="text-sm font-black text-slate-900">{track.progress}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[3rem]">
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Truck size={28} className="text-cyan-600" />
                Active Shipments
              </h3>
              <div className="space-y-4">
                {filteredOrders.filter(o => o.status === 'SHIPPED').length === 0 ? (
                  <div className="text-center py-12">
                    <Truck size={64} className="text-neut-200 mx-auto mb-4" />
                    <p className="text-lg font-bold text-slate-600">No active shipments</p>
                  </div>
                ) : (
                  filteredOrders.filter(o => o.status === 'SHIPPED').map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 bg-cyan-100 rounded-xl flex items-center justify-center">
                            <Truck size={24} className="text-cyan-600" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-lg">#{order.orderNumber}</p>
                            <p className="text-sm text-slate-600 mt-1">{order.product?.name}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Route size={14} className="text-cyan-600" />
                              <span className="text-xs font-bold text-cyan-600">In Transit to {order.address?.split(',')[0]}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleStatusUpdate(order.id, 'DELIVERED')} 
                          className="h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-slate-900 rounded-2xl font-black text-xs hover:scale-105 transition-all"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Mark Delivered
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
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

      case 'bulk':
        return (
          <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Zap size={24} className="text-yellow-600" />
              Bulk Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-16 bg-blue-600 text-slate-900 rounded-2xl font-black">
                Bulk Confirm Orders
              </Button>
              <Button className="h-16 bg-purple-600 text-slate-900 rounded-2xl font-black">
                Bulk Ship Orders
              </Button>
              <Button className="h-16 bg-green-600 text-slate-900 rounded-2xl font-black">
                Export Selected
              </Button>
              <Button className="h-16 bg-orange-600 text-slate-900 rounded-2xl font-black">
                Print Labels
              </Button>
            </div>
          </Card>
        );

      case 'history':
        return (
          <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
            <h3 className="text-xl font-black text-slate-900 mb-6">Complete Order History</h3>
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-4">
                    <Calendar size={20} className="text-slate-400" />
                    <div>
                      <p className="font-black text-slate-900">#{order.orderNumber}</p>
                      <p className="text-xs text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge tone={getStatusColor(order.status) as any}>{order.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {performanceMetrics.map((metric, i) => (
                <Card key={i} className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{metric.metric}</p>
                  <p className="text-3xl font-black text-slate-900 mb-2">{metric.value}</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-green-600" />
                    <span className="text-sm font-bold text-green-600">{metric.change}</span>
                  </div>
                </Card>
              ))}
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
              {[
                { rule: 'Auto-confirm orders under ₹5,000', status: 'Active' },
                { rule: 'Send shipping notification on dispatch', status: 'Active' },
                { rule: 'Request review after delivery', status: 'Active' },
                { rule: 'Auto-refund cancelled orders', status: 'Inactive' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <p className="font-bold text-slate-900">{item.rule}</p>
                  <Badge tone={item.status === 'Active' ? 'brand' : 'ink'}>{item.status}</Badge>
                </div>
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
      </div>
    </div>
  );
}
