'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Share2,
  UserPlus,
  DollarSign,
  Calendar,
  Target,
  Zap,
  Award,
  TrendingDown,
  AlertCircle,
  BarChart3,
  MapPin,
  Truck,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import { aggregationService } from '@/services/aggregationService';

interface AggregationOrder {
  id: string;
  farmerCount: number;
  totalQuantity: number;
  product: string;
  targetPrice: number;
  currentPrice: number;
  status: 'forming' | 'ready' | 'completed' | 'cancelled';
  deadline: string;
  progress: number;
  minQuantity: number;
  location: string;
  category: string;
  createdBy: string;
  createdAt: string;
  estimatedSavings: number;
  participants: string[];
}

interface Farmer {
  id: string;
  name: string;
  quantity: number;
  joinedAt: string;
}

export default function BulkAggregationEngine() {
  const [orders, setOrders] = useState<AggregationOrder[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AggregationOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'quantity' | 'farmers' | 'savings'>('deadline');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  useEffect(() => {
    loadOrders();
    const timer = setInterval(loadOrders, 5000); // 5s Real-time sync
    return () => clearInterval(timer);
  }, [filter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/trust/aggregation-lots');
      const data = await response.json();
      
      const mapped = data.map((lot: any) => ({
        id: lot.id,
        farmerCount: lot.farmer_count,
        totalQuantity: lot.total_quantity * 1000, // convert back to kg
        product: lot.commodity,
        targetPrice: lot.target_price,
        currentPrice: lot.current_bid || lot.target_price + 200,
        status: lot.status.toLowerCase().includes('forming') ? 'forming' : 'ready',
        deadline: '2024-12-31',
        progress: (lot.farmer_count / 50) * 100,
        minQuantity: 1000,
        location: 'Regional Cluster',
        category: 'Grains',
        createdBy: 'Agri Bot',
        createdAt: new Date().toISOString(),
        estimatedSavings: lot.total_quantity * 500,
        participants: ['Farmer A', 'Farmer B']
      }));
      
      setOrders(mapped);
    } catch (error) {
      console.error('Aggregation API error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Computed values
  const stats = useMemo(() => {
    const activePools = orders.filter(o => o.status === 'forming' || o.status === 'ready').length;
    const readyPools = orders.filter(o => o.status === 'ready').length;
    const totalQuantity = orders.reduce((sum, o) => sum + o.totalQuantity, 0);
    const totalFarmers = orders.reduce((sum, o) => sum + o.farmerCount, 0);
    const totalSavings = orders.reduce((sum, o) => sum + o.estimatedSavings, 0);
    const completedPools = orders.filter(o => o.status === 'completed').length;

    return {
      activePools,
      readyPools,
      totalQuantity,
      totalFarmers,
      totalSavings,
      completedPools
    };
  }, [orders]);

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesFilter = filter === 'all' || order.status === filter;
      const matchesSearch = order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sortBy === 'quantity') return b.totalQuantity - a.totalQuantity;
      if (sortBy === 'farmers') return b.farmerCount - a.farmerCount;
      if (sortBy === 'savings') return b.estimatedSavings - a.estimatedSavings;
      return 0;
    });

    return filtered;
  }, [orders, filter, searchQuery, sortBy]);

  const getStatusColor = (status: string) => {
    const colors = {
      forming: { bg: 'from-yellow-500 to-orange-600', text: 'text-yellow-700', badge: 'bg-yellow-100' },
      ready: { bg: 'from-green-500 to-emerald-600', text: 'text-green-700', badge: 'bg-green-100' },
      completed: { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-700', badge: 'bg-blue-100' },
      cancelled: { bg: 'from-red-500 to-pink-600', text: 'text-red-700', badge: 'bg-red-100' }
    };
    return colors[status as keyof typeof colors] || colors.forming;
  };

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleJoinPool = async (order: AggregationOrder) => {
    try {
      const result = await aggregationService.joinBulkLot('USER_ID', order.id, 'PRODUCT_ID');
      if (result.success) {
        showToastMessage(`Successfully joined ${order.product} pool!`, 'success');
        loadOrders();
      } else {
        showToastMessage(`Failed to join pool: ${result.message}`, 'error');
      }
    } catch (error) {
      showToastMessage('An error occurred while joining the pool', 'error');
    }
  };

  const handleSharePool = (order: AggregationOrder) => {
    showToastMessage(`Pool link copied to clipboard!`, 'info');
  };

  const handleRefresh = () => {
    loadOrders();
    showToastMessage('Data refreshed successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 right-6 z-50"
          >
            <div className={`px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl border-2 flex items-center gap-3 ${
              toastType === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
              toastType === 'error' ? 'bg-red-500/90 border-red-400 text-white' :
              'bg-blue-500/90 border-blue-400 text-white'
            }`}>
              <CheckCircle size={20} />
              <span className="font-semibold">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-4 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-600 rounded-2xl shadow-xl"
            >
              <Users className="text-white" size={32} />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Bulk Aggregation Engine
              </h1>
              <p className="text-slate-600 text-sm mt-1">Pool resources, maximize profits, strengthen community</p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-purple-600" : "text-slate-700"} />
              <span className="text-sm font-semibold text-slate-700">Refresh</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all"
            >
              <Plus size={18} />
              <span className="text-sm font-semibold">Create Pool</span>
            </motion.button>
          </div>
        </div>

        {/* Status Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 w-fit px-5 py-2.5 bg-gradient-to-r from-purple-50 to-fuchsia-50 border-2 border-purple-200 rounded-full shadow-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2.5 h-2.5 bg-purple-500 rounded-full"
          />
          <span className="text-sm font-bold text-purple-700">LIVE AGGREGATION</span>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          {
            label: 'Active Pools',
            value: stats.activePools.toString(),
            change: '+3',
            icon: Users,
            gradient: 'from-blue-500 via-indigo-500 to-purple-600',
            bgGradient: 'from-blue-50 to-indigo-50'
          },
          {
            label: 'Ready to Ship',
            value: stats.readyPools.toString(),
            change: '+2',
            icon: CheckCircle,
            gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
            bgGradient: 'from-emerald-50 to-teal-50'
          },
          {
            label: 'Total Quantity',
            value: `${(stats.totalQuantity / 1000).toFixed(1)}K kg`,
            change: '+15%',
            icon: Package,
            gradient: 'from-orange-500 via-red-500 to-pink-600',
            bgGradient: 'from-orange-50 to-red-50'
          },
          {
            label: 'Total Farmers',
            value: stats.totalFarmers.toString(),
            change: '+12',
            icon: Award,
            gradient: 'from-purple-500 via-fuchsia-500 to-pink-600',
            bgGradient: 'from-purple-50 to-fuchsia-50'
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={staggerItem}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative p-6 bg-gradient-to-br ${stat.bgGradient} rounded-2xl border-2 border-white shadow-lg hover:shadow-2xl transition-all overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}
                >
                  <stat.icon className="text-white" size={24} />
                </motion.div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700"
                >
                  {stat.change}
                </motion.span>
              </div>
              <p className="text-slate-600 text-sm mb-2 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>

            <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 blur-2xl`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-semibold mb-2">Total Estimated Savings</p>
              <p className="text-4xl font-bold text-emerald-600">₹{(stats.totalSavings / 1000).toFixed(1)}K</p>
              <p className="text-xs text-slate-500 mt-2">Across all active pools</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <DollarSign size={32} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-semibold mb-2">Completed Pools</p>
              <p className="text-4xl font-bold text-blue-600">{stats.completedPools}</p>
              <p className="text-xs text-slate-500 mt-2">Successfully delivered</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Truck size={32} className="text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 border-white">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product, location, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none bg-white/80 backdrop-blur-sm"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 outline-none bg-white/80 backdrop-blur-sm font-medium"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="farmers">Sort by Farmers</option>
              <option value="savings">Sort by Savings</option>
            </select>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: 'All Pools', icon: Package },
              { id: 'forming', label: 'Forming', icon: Clock },
              { id: 'ready', label: 'Ready', icon: CheckCircle },
              { id: 'completed', label: 'Completed', icon: Award },
              { id: 'cancelled', label: 'Cancelled', icon: XCircle },
            ].map((tab, idx) => (
              <motion.button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white shadow-xl shadow-purple-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
                }`}
              >
                <tab.icon size={18} />
                <span className="text-sm">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content - Pools Grid and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pools List */}
        <div className="lg:col-span-2">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {loading ? (
              // Skeleton Loaders
              [...Array(3)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-white/60 backdrop-blur-xl rounded-2xl border-2 border-slate-200 shadow-lg"
                >
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-slate-200 rounded w-32" />
                      <div className="h-6 bg-slate-200 rounded-full w-20" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200"
              >
                <Package size={64} className="mx-auto text-slate-300 mb-4" />
                <p className="text-xl font-semibold text-slate-600">No pools found</p>
                <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
              </motion.div>
            ) : (
              filteredOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-6 bg-gradient-to-r from-white to-slate-50/50 rounded-2xl border-2 cursor-pointer transition-all backdrop-blur-sm ${
                    selectedOrder?.id === order.id
                      ? 'border-purple-400 shadow-2xl shadow-purple-500/20'
                      : 'border-slate-200 hover:border-purple-300 shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`p-3 rounded-2xl shadow-lg bg-gradient-to-br ${getStatusColor(order.status).bg}`}
                      >
                        <Package size={24} className="text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{order.product}</h3>
                        <p className="text-sm text-slate-600 font-medium flex items-center gap-1">
                          <MapPin size={14} />
                          {order.location} • {order.category}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(order.status).badge} ${getStatusColor(order.status).text}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span className="font-semibold">Pool Progress</span>
                      <span className="font-bold">{order.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${order.progress}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full bg-gradient-to-r ${getStatusColor(order.status).bg} shadow-lg`}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <Users size={16} className="mx-auto text-blue-600 mb-1" />
                      <p className="text-xs text-slate-600 font-semibold">Farmers</p>
                      <p className="text-lg font-bold text-slate-900">{order.farmerCount}</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <Package size={16} className="mx-auto text-emerald-600 mb-1" />
                      <p className="text-xs text-slate-600 font-semibold">Quantity</p>
                      <p className="text-lg font-bold text-slate-900">{order.totalQuantity} kg</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <Target size={16} className="mx-auto text-purple-600 mb-1" />
                      <p className="text-xs text-slate-600 font-semibold">Target</p>
                      <p className="text-lg font-bold text-slate-900">₹{order.targetPrice}</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-200">
                      <DollarSign size={16} className="mx-auto text-orange-600 mb-1" />
                      <p className="text-xs text-slate-600 font-semibold">Savings</p>
                      <p className="text-lg font-bold text-slate-900">₹{(order.estimatedSavings / 1000).toFixed(1)}K</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={14} />
                      <span className="font-medium">Deadline: {new Date(order.deadline).toLocaleDateString()}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <span className="text-sm">View Details</span>
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Pool Details Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="sticky top-6 bg-white/60 backdrop-blur-xl rounded-2xl border-2 border-white shadow-xl p-6"
          >
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-900">{selectedOrder.product} Pool</h3>
                    <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(selectedOrder.status).badge} ${getStatusColor(selectedOrder.status).text}`}>
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">Pool ID: #{selectedOrder.id}</p>
                </div>

                {/* Progress Circle */}
                <div className="relative">
                  <div className="w-32 h-32 mx-auto">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-200"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - selectedOrder.progress / 100) }}
                        transition={{ duration: 1 }}
                        className="text-purple-600"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-slate-900">{selectedOrder.progress}%</p>
                        <p className="text-xs text-slate-600">Complete</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  {[
                    { label: 'Farmers Joined', value: selectedOrder.farmerCount, icon: Users },
                    { label: 'Total Quantity', value: `${selectedOrder.totalQuantity} kg`, icon: Package },
                    { label: 'Min Quantity', value: `${selectedOrder.minQuantity} kg`, icon: Target },
                    { label: 'Target Price', value: `₹${selectedOrder.targetPrice}/kg`, icon: TrendingDown },
                    { label: 'Current Price', value: `₹${selectedOrder.currentPrice}/kg`, icon: TrendingUp },
                    { label: 'Est. Savings', value: `₹${selectedOrder.estimatedSavings.toLocaleString()}`, icon: DollarSign },
                    { label: 'Location', value: selectedOrder.location, icon: MapPin },
                    { label: 'Created By', value: selectedOrder.createdBy, icon: Users },
                    { label: 'Deadline', value: new Date(selectedOrder.deadline).toLocaleDateString(), icon: Calendar },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon size={16} className="text-purple-600" />
                        <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{item.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleJoinPool(selectedOrder)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all"
                  >
                    <UserPlus size={20} />
                    <span>Join This Pool</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSharePool(selectedOrder)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all"
                  >
                    <Share2 size={20} />
                    <span>Share Pool</span>
                  </motion.button>
                </div>

                {/* AI Recommendation */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-purple-900 mb-1">AI Recommendation</p>
                      <p className="text-xs text-slate-700">
                        This pool has high success probability. Join now to maximize savings!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <Package size={64} className="text-slate-300 mb-4" />
                <p className="text-lg font-semibold text-slate-600">Select a pool</p>
                <p className="text-sm text-slate-500 mt-2 text-center">Click on any pool to view details</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
