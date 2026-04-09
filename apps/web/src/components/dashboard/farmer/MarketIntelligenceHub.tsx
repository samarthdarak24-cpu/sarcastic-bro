'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  LineChart,
  AlertCircle,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Bell,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Calendar,
  MapPin,
  Package,
  Users,
  ShoppingCart,
  Sparkles,
  Eye,
  Download,
  Share2,
  Star,
  TrendingUpIcon,
  Flame,
  CheckCircle,
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';

interface MarketData {
  id: string;
  product: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  demand: 'high' | 'medium' | 'low';
  forecast: string;
  category: string;
  location: string;
  volume: number;
  suppliers: number;
  buyers: number;
  lastUpdated: string;
  weeklyHigh: number;
  weeklyLow: number;
  volatility: 'high' | 'medium' | 'low';
  seasonality: string;
}

interface PriceAlert {
  id: string;
  product: string;
  targetPrice: number;
  currentPrice: number;
  type: 'above' | 'below';
  status: 'active' | 'triggered' | 'expired';
}

interface MarketInsight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  timestamp: string;
}

export default function MarketIntelligenceHub() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume' | 'demand'>('change');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedProduct, setSelectedProduct] = useState<MarketData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadMarketData();
  }, [filter]);

  const loadMarketData = async () => {
    setLoading(true);
    setTimeout(() => {
      setMarketData([
        {
          id: 'MKT001',
          product: 'Wheat',
          currentPrice: 2800,
          previousPrice: 2660,
          change: 5.2,
          trend: 'up',
          demand: 'high',
          forecast: 'Rising',
          category: 'Grains',
          location: 'Punjab',
          volume: 15000,
          suppliers: 245,
          buyers: 180,
          lastUpdated: '2 hours ago',
          weeklyHigh: 2850,
          weeklyLow: 2600,
          volatility: 'medium',
          seasonality: 'Peak Season'
        },
        {
          id: 'MKT002',
          product: 'Rice',
          currentPrice: 3500,
          previousPrice: 3575,
          change: -2.1,
          trend: 'down',
          demand: 'medium',
          forecast: 'Stable',
          category: 'Grains',
          location: 'Haryana',
          volume: 12000,
          suppliers: 198,
          buyers: 150,
          lastUpdated: '1 hour ago',
          weeklyHigh: 3600,
          weeklyLow: 3450,
          volatility: 'low',
          seasonality: 'Off Season'
        },
        {
          id: 'MKT003',
          product: 'Corn',
          currentPrice: 2200,
          previousPrice: 2189,
          change: 0.5,
          trend: 'stable',
          demand: 'high',
          forecast: 'Rising',
          category: 'Grains',
          location: 'Maharashtra',
          volume: 18000,
          suppliers: 320,
          buyers: 220,
          lastUpdated: '3 hours ago',
          weeklyHigh: 2250,
          weeklyLow: 2150,
          volatility: 'low',
          seasonality: 'Peak Season'
        },
        {
          id: 'MKT004',
          product: 'Soybeans',
          currentPrice: 4500,
          previousPrice: 4155,
          change: 8.3,
          trend: 'up',
          demand: 'high',
          forecast: 'Rising',
          category: 'Pulses',
          location: 'Madhya Pradesh',
          volume: 10000,
          suppliers: 156,
          buyers: 95,
          lastUpdated: '30 mins ago',
          weeklyHigh: 4550,
          weeklyLow: 4100,
          volatility: 'high',
          seasonality: 'Peak Season'
        },
        {
          id: 'MKT005',
          product: 'Cotton',
          currentPrice: 6000,
          previousPrice: 5850,
          change: 2.6,
          trend: 'up',
          demand: 'medium',
          forecast: 'Stable',
          category: 'Cash Crops',
          location: 'Gujarat',
          volume: 8500,
          suppliers: 142,
          buyers: 78,
          lastUpdated: '4 hours ago',
          weeklyHigh: 6100,
          weeklyLow: 5800,
          volatility: 'medium',
          seasonality: 'Mid Season'
        },
        {
          id: 'MKT006',
          product: 'Tomatoes',
          currentPrice: 3500,
          previousPrice: 3800,
          change: -7.9,
          trend: 'down',
          demand: 'low',
          forecast: 'Declining',
          category: 'Vegetables',
          location: 'Karnataka',
          volume: 5000,
          suppliers: 89,
          buyers: 120,
          lastUpdated: '1 hour ago',
          weeklyHigh: 3900,
          weeklyLow: 3400,
          volatility: 'high',
          seasonality: 'Off Season'
        },
        {
          id: 'MKT007',
          product: 'Onions',
          currentPrice: 2800,
          previousPrice: 2700,
          change: 3.7,
          trend: 'up',
          demand: 'high',
          forecast: 'Rising',
          category: 'Vegetables',
          location: 'Maharashtra',
          volume: 12000,
          suppliers: 210,
          buyers: 185,
          lastUpdated: '2 hours ago',
          weeklyHigh: 2850,
          weeklyLow: 2650,
          volatility: 'medium',
          seasonality: 'Peak Season'
        },
        {
          id: 'MKT008',
          product: 'Potatoes',
          currentPrice: 1500,
          previousPrice: 1550,
          change: -3.2,
          trend: 'down',
          demand: 'medium',
          forecast: 'Stable',
          category: 'Vegetables',
          location: 'Uttar Pradesh',
          volume: 20000,
          suppliers: 380,
          buyers: 290,
          lastUpdated: '5 hours ago',
          weeklyHigh: 1600,
          weeklyLow: 1480,
          volatility: 'low',
          seasonality: 'Peak Season'
        },
        {
          id: 'MKT009',
          product: 'Turmeric',
          currentPrice: 12000,
          previousPrice: 11500,
          change: 4.3,
          trend: 'up',
          demand: 'high',
          forecast: 'Rising',
          category: 'Spices',
          location: 'Telangana',
          volume: 3000,
          suppliers: 65,
          buyers: 48,
          lastUpdated: '1 hour ago',
          weeklyHigh: 12100,
          weeklyLow: 11400,
          volatility: 'medium',
          seasonality: 'Peak Season'
        },
        {
          id: 'MKT010',
          product: 'Chilli',
          currentPrice: 14000,
          previousPrice: 13500,
          change: 3.7,
          trend: 'up',
          demand: 'medium',
          forecast: 'Stable',
          category: 'Spices',
          location: 'Andhra Pradesh',
          volume: 2500,
          suppliers: 52,
          buyers: 38,
          lastUpdated: '3 hours ago',
          weeklyHigh: 14200,
          weeklyLow: 13400,
          volatility: 'medium',
          seasonality: 'Mid Season'
        },
      ]);
      setLoading(false);
    }, 800);
  };

  // Computed statistics
  const stats = useMemo(() => {
    const trendingUp = marketData.filter(m => m.trend === 'up').length;
    const trendingDown = marketData.filter(m => m.trend === 'down').length;
    const highDemand = marketData.filter(m => m.demand === 'high').length;
    const avgPrice = marketData.length > 0 
      ? Math.round(marketData.reduce((sum, m) => sum + m.currentPrice, 0) / marketData.length)
      : 0;
    const totalVolume = marketData.reduce((sum, m) => sum + m.volume, 0);
    const totalSuppliers = marketData.reduce((sum, m) => sum + m.suppliers, 0);
    const avgChange = marketData.length > 0
      ? (marketData.reduce((sum, m) => sum + m.change, 0) / marketData.length).toFixed(1)
      : '0.0';

    return {
      trendingUp,
      trendingDown,
      highDemand,
      avgPrice,
      totalVolume,
      totalSuppliers,
      avgChange: parseFloat(avgChange)
    };
  }, [marketData]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = marketData.filter(item => {
      const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (filter === 'trending') matchesFilter = item.trend === 'up';
      if (filter === 'high_demand') matchesFilter = item.demand === 'high';
      if (filter === 'stable') matchesFilter = item.trend === 'stable';
      if (filter === 'declining') matchesFilter = item.trend === 'down';

      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'price') return multiplier * (a.currentPrice - b.currentPrice);
      if (sortBy === 'change') return multiplier * (a.change - b.change);
      if (sortBy === 'volume') return multiplier * (a.volume - b.volume);
      if (sortBy === 'demand') {
        const demandOrder = { high: 3, medium: 2, low: 1 };
        return multiplier * (demandOrder[a.demand] - demandOrder[b.demand]);
      }
      return 0;
    });

    return filtered;
  }, [marketData, searchQuery, filter, sortBy, sortOrder]);

  const getTrendColor = (trend: string) => {
    const colors = {
      up: { text: 'text-green-600', bg: 'from-green-500 to-emerald-600', badge: 'bg-green-100' },
      down: { text: 'text-red-600', bg: 'from-red-500 to-pink-600', badge: 'bg-red-100' },
      stable: { text: 'text-slate-600', bg: 'from-slate-500 to-gray-600', badge: 'bg-slate-100' }
    };
    return colors[trend as keyof typeof colors] || colors.stable;
  };

  const getDemandColor = (demand: string) => {
    const colors = {
      high: { bg: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-700' },
      medium: { bg: 'from-yellow-500 to-orange-600', badge: 'bg-yellow-100 text-yellow-700' },
      low: { bg: 'from-red-500 to-pink-600', badge: 'bg-red-100 text-red-700' }
    };
    return colors[demand as keyof typeof colors] || colors.medium;
  };

  const getVolatilityColor = (volatility: string) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colors[volatility as keyof typeof colors] || colors.medium;
  };

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRefresh = () => {
    loadMarketData();
    showToastMessage('Market data refreshed successfully', 'success');
  };

  const handleAddAlert = () => {
    showToastMessage('Price alert created successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
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

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          {
            label: 'Trending Up',
            value: stats.trendingUp.toString(),
            change: '+' + stats.trendingUp,
            icon: TrendingUp,
            gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
            bgGradient: 'from-emerald-50 to-teal-50'
          },
          {
            label: 'Trending Down',
            value: stats.trendingDown.toString(),
            change: stats.trendingDown.toString(),
            icon: TrendingDown,
            gradient: 'from-red-500 via-pink-500 to-rose-600',
            bgGradient: 'from-red-50 to-pink-50'
          },
          {
            label: 'High Demand',
            value: stats.highDemand.toString(),
            change: '+' + stats.highDemand,
            icon: Flame,
            gradient: 'from-orange-500 via-red-500 to-pink-600',
            bgGradient: 'from-orange-50 to-red-50'
          },
          {
            label: 'Avg Price',
            value: `₹${stats.avgPrice}`,
            change: `${stats.avgChange > 0 ? '+' : ''}${stats.avgChange}%`,
            icon: DollarSign,
            gradient: 'from-blue-500 via-indigo-500 to-purple-600',
            bgGradient: 'from-blue-50 to-indigo-50'
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
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    stat.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}
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
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="p-6 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl border-2 border-purple-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-semibold mb-2">Total Volume</p>
              <p className="text-4xl font-bold text-purple-600">{(stats.totalVolume / 1000).toFixed(1)}K kg</p>
              <p className="text-xs text-slate-500 mt-2">Across all markets</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl shadow-lg">
              <Package size={32} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-semibold mb-2">Total Suppliers</p>
              <p className="text-4xl font-bold text-cyan-600">{stats.totalSuppliers}</p>
              <p className="text-xs text-slate-500 mt-2">Active in market</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg">
              <Users size={32} className="text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-semibold mb-2">Market Trend</p>
              <p className="text-4xl font-bold text-emerald-600">
                {stats.avgChange > 0 ? 'Bullish' : stats.avgChange < 0 ? 'Bearish' : 'Neutral'}
              </p>
              <p className="text-xs text-slate-500 mt-2">{stats.avgChange}% avg change</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <Activity size={32} className="text-white" />
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
                placeholder="Search by product, category, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none bg-white/80 backdrop-blur-sm"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none bg-white/80 backdrop-blur-sm font-medium"
            >
              <option value="change">Sort by Change</option>
              <option value="price">Sort by Price</option>
              <option value="volume">Sort by Volume</option>
              <option value="demand">Sort by Demand</option>
            </select>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm hover:border-blue-400 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
                className="px-4 py-3 border-2 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm hover:border-blue-400 transition-colors"
              >
                {viewMode === 'grid' ? '☰' : '⊞'}
              </motion.button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: 'All Markets', icon: BarChart3 },
              { id: 'trending', label: 'Trending Up', icon: TrendingUp },
              { id: 'high_demand', label: 'High Demand', icon: Flame },
              { id: 'stable', label: 'Stable', icon: Minus },
              { id: 'declining', label: 'Declining', icon: TrendingDown },
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
                    ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-xl shadow-blue-500/30'
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

      {/* Market Data Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}
      >
        {loading ? (
          // Skeleton Loaders
          [...Array(6)].map((_, idx) => (
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
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            </motion.div>
          ))
        ) : filteredData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full text-center py-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200"
          >
            <BarChart3 size={64} className="mx-auto text-slate-300 mb-4" />
            <p className="text-xl font-semibold text-slate-600">No market data found</p>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          filteredData.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setSelectedProduct(item)}
              className={`p-6 bg-gradient-to-r from-white to-slate-50/50 rounded-2xl border-2 cursor-pointer transition-all backdrop-blur-sm ${
                selectedProduct?.id === item.id
                  ? 'border-blue-400 shadow-2xl shadow-blue-500/20'
                  : 'border-slate-200 hover:border-blue-300 shadow-lg'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-3 rounded-2xl shadow-lg bg-gradient-to-br ${getTrendColor(item.trend).bg}`}
                  >
                    {item.trend === 'up' ? <TrendingUp size={24} className="text-white" /> :
                     item.trend === 'down' ? <TrendingDown size={24} className="text-white" /> :
                     <Minus size={24} className="text-white" />}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{item.product}</h3>
                    <p className="text-sm text-slate-600 font-medium">{item.category}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-bold ${getDemandColor(item.demand).badge}`}>
                  {item.demand.toUpperCase()}
                </span>
              </div>

              {/* Price Section */}
              <div className="mb-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-slate-600 font-semibold">Current Price</span>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-slate-900">₹{item.currentPrice}</span>
                    <span className="text-sm text-slate-500">/kg</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Previous: ₹{item.previousPrice}</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-lg font-bold ${getTrendColor(item.trend).text}`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                    {item.trend === 'up' ? <ArrowUpRight size={20} className="text-green-600" /> :
                     item.trend === 'down' ? <ArrowDownRight size={20} className="text-red-600" /> :
                     <Minus size={20} className="text-slate-600" />}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <Package size={16} className="mx-auto text-blue-600 mb-1" />
                  <p className="text-xs text-slate-600 font-semibold">Volume</p>
                  <p className="text-sm font-bold text-slate-900">{(item.volume / 1000).toFixed(1)}K</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <Users size={16} className="mx-auto text-emerald-600 mb-1" />
                  <p className="text-xs text-slate-600 font-semibold">Suppliers</p>
                  <p className="text-sm font-bold text-slate-900">{item.suppliers}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <ShoppingCart size={16} className="mx-auto text-purple-600 mb-1" />
                  <p className="text-xs text-slate-600 font-semibold">Buyers</p>
                  <p className="text-sm font-bold text-slate-900">{item.buyers}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 flex items-center gap-1">
                    <MapPin size={14} />
                    Location
                  </span>
                  <span className="font-semibold text-slate-900">{item.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Forecast</span>
                  <span className={`font-semibold ${
                    item.forecast === 'Rising' ? 'text-green-600' :
                    item.forecast === 'Declining' ? 'text-red-600' :
                    'text-slate-600'
                  }`}>{item.forecast}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Volatility</span>
                  <span className={`font-semibold ${getVolatilityColor(item.volatility)}`}>
                    {item.volatility.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Activity size={14} />
                  <span>{item.lastUpdated}</span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Eye size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    <Bell size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Market Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl shadow-lg">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">AI Market Insights</h3>
            <p className="text-sm text-slate-600">Smart recommendations based on market trends</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Best Time to Sell',
              description: 'Wheat prices expected to peak in next 3-5 days',
              impact: 'high',
              icon: Target
            },
            {
              title: 'Demand Surge',
              description: 'Onion demand increasing by 15% this week',
              impact: 'medium',
              icon: TrendingUp
            },
            {
              title: 'Price Alert',
              description: 'Soybeans reached your target price of ₹4500',
              impact: 'high',
              icon: Bell
            },
          ].map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-4 bg-white rounded-xl border-2 border-purple-200 shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  insight.impact === 'high' ? 'bg-red-100' :
                  insight.impact === 'medium' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <insight.icon size={20} className={
                    insight.impact === 'high' ? 'text-red-600' :
                    insight.impact === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  } />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-slate-600">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
