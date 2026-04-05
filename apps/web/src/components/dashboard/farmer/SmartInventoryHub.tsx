'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, TrendingUp, DollarSign, BarChart3, Activity, 
  Zap, Eye, ShoppingCart, AlertCircle, CheckCircle,
  Clock, MapPin, Truck, Box, Archive, RefreshCw,
  Filter, Search, Download, Upload, Edit, Trash2,
  Star, Award, Target, Layers, Grid, List,
  PieChart, LineChart, ArrowUpRight, ArrowDownRight,
  Plus, Settings, Bell, Share2, Calendar, Tag
} from 'lucide-react';
import { LineChart as RechartsLine, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, 
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function SmartInventoryHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const inventoryData = [
    { id: '1', name: 'Organic Tomatoes', category: 'Vegetables', quantity: 450, unit: 'kg', price: 48, status: 'in-stock', quality: 95, location: 'Warehouse A', lastUpdated: '2h ago', views: 234, orders: 12, revenue: 21600, image: 'https://images.unsplash.com/photo-1546470427-227e9e3e0e4e?w=400&h=300&fit=crop' },
    { id: '2', name: 'Basmati Rice', category: 'Grains', quantity: 1200, unit: 'kg', price: 85, status: 'in-stock', quality: 92, location: 'Warehouse B', lastUpdated: '4h ago', views: 456, orders: 28, revenue: 102000, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop' },
    { id: '3', name: 'Fresh Mangoes', category: 'Fruits', quantity: 180, unit: 'kg', price: 125, status: 'low-stock', quality: 98, location: 'Warehouse A', lastUpdated: '1h ago', views: 567, orders: 34, revenue: 22500, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop' },
    { id: '4', name: 'Turmeric Powder', category: 'Spices', quantity: 80, unit: 'kg', price: 320, status: 'low-stock', quality: 96, location: 'Warehouse C', lastUpdated: '6h ago', views: 189, orders: 8, revenue: 25600, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop' },
    { id: '5', name: 'Green Chillies', category: 'Vegetables', quantity: 0, unit: 'kg', price: 65, status: 'out-of-stock', quality: 0, location: 'Warehouse A', lastUpdated: '1d ago', views: 123, orders: 0, revenue: 0, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop' },
    { id: '6', name: 'Wheat Flour', category: 'Grains', quantity: 850, unit: 'kg', price: 42, status: 'in-stock', quality: 90, location: 'Warehouse B', lastUpdated: '3h ago', views: 345, orders: 18, revenue: 35700, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop' },
  ];

  const kpiMetrics = [
    { label: 'Total Inventory Value', value: '₹2.4L', change: '+12%', icon: DollarSign, color: 'emerald' },
    { label: 'Active Listings', value: '24', change: '+3', icon: Package, color: 'blue' },
    { label: 'Low Stock Alerts', value: '5', change: '-2', icon: AlertCircle, color: 'amber' },
    { label: 'Fulfillment Rate', value: '94%', change: '+5%', icon: CheckCircle, color: 'indigo' },
  ];

  const categoryDistribution = [
    { name: 'Vegetables', value: 35, color: '#10b981' },
    { name: 'Fruits', value: 25, color: '#f59e0b' },
    { name: 'Grains', value: 20, color: '#3b82f6' },
    { name: 'Spices', value: 15, color: '#8b5cf6' },
    { name: 'Others', value: 5, color: '#ec4899' },
  ];

  const priceIndexData = [
    { date: 'Mon', tomatoes: 42, rice: 82, mangoes: 120 },
    { date: 'Tue', tomatoes: 44, rice: 83, mangoes: 122 },
    { date: 'Wed', tomatoes: 46, rice: 84, mangoes: 123 },
    { date: 'Thu', tomatoes: 48, rice: 85, mangoes: 125 },
    { date: 'Fri', tomatoes: 50, rice: 86, mangoes: 128 },
  ];

  const fulfillmentStatus = [
    { status: 'Pending', count: 12, percentage: 15 },
    { status: 'Processing', count: 18, percentage: 22 },
    { status: 'Shipped', count: 28, percentage: 35 },
    { status: 'Delivered', count: 23, percentage: 28 },
  ];

  const warehouseData = [
    { name: 'Warehouse A', capacity: 5000, used: 3200, items: 12, utilization: 64 },
    { name: 'Warehouse B', capacity: 4000, used: 2800, items: 8, utilization: 70 },
    { name: 'Warehouse C', capacity: 3000, used: 1500, items: 4, utilization: 50 },
  ];

  const recentActivity = [
    { action: 'Stock Added', item: 'Organic Tomatoes', quantity: '+50kg', time: '10 min ago', user: 'System' },
    { action: 'Order Fulfilled', item: 'Basmati Rice', quantity: '120kg', time: '25 min ago', user: 'Buyer #234' },
    { action: 'Price Updated', item: 'Fresh Mangoes', quantity: '₹125/kg', time: '1h ago', user: 'Admin' },
    { action: 'Low Stock Alert', item: 'Turmeric Powder', quantity: '80kg', time: '2h ago', user: 'System' },
  ];

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Package className="text-emerald-500" size={36} />
              Smart Inventory Hub
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-xl">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">LIVE OPS ACTIVE</span>
            </div>
          </div>
          <p className="text-slate-500 font-medium">Centralized node for commodities, price indexing & fulfillment</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <RefreshCw size={18} />
            Sync
          </button>
          <button className="h-12 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2">
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`h-12 w-12 rounded-xl bg-${metric.color}-50 flex items-center justify-center text-${metric.color}-600 group-hover:scale-110 transition-transform`}>
                <metric.icon size={24} strokeWidth={2.5} />
              </div>
              <div className={`px-3 py-1 bg-${metric.color}-50 border border-${metric.color}-100 rounded-full text-[10px] font-black text-${metric.color}-600 uppercase tracking-widest`}>
                {metric.change}
              </div>
            </div>
            <p className="text-slate-400 font-black text-[11px] uppercase tracking-widest mb-1">{metric.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{metric.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 bg-white rounded-2xl p-2 border border-slate-200 shadow-sm overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'inventory', label: 'Inventory List', icon: List },
          { id: 'price-index', label: 'Price Index', icon: TrendingUp },
          { id: 'fulfillment', label: 'Fulfillment', icon: Truck },
          { id: 'warehouse', label: 'Warehouse', icon: Archive },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'quality', label: 'Quality Control', icon: Award },
          { id: 'alerts', label: 'Smart Alerts', icon: Bell },
          { id: 'activity', label: 'Activity Log', icon: Activity },
          { id: 'optimization', label: 'AI Optimize', icon: Zap },
          { id: 'reports', label: 'Reports', icon: PieChart },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 h-12 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Category Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={(entry) => `${entry.name} ${entry.value}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 'bold' }} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Activity size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-bold text-slate-900">{activity.action}</h3>
                          <span className="text-xs text-slate-400 font-bold">{activity.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium">{activity.item} • {activity.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="all">All Categories</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Spices">Spices</option>
                </select>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                      viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                      viewMode === 'list' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredInventory.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-white rounded-2xl overflow-hidden border-2 ${
                    item.status === 'out-of-stock' ? 'border-red-200 bg-red-50/50' :
                    item.status === 'low-stock' ? 'border-amber-200 bg-amber-50/50' :
                    'border-slate-200'
                  } hover:shadow-xl transition-all group cursor-pointer`}
                >
                  {/* Product Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-black uppercase backdrop-blur-sm ${
                      item.status === 'in-stock' ? 'bg-emerald-500/90 text-white' :
                      item.status === 'low-stock' ? 'bg-amber-500/90 text-white' :
                      'bg-red-500/90 text-white'
                    }`}>
                      {item.status}
                    </div>
                    {item.quality > 0 && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-black bg-white/90 backdrop-blur-sm text-slate-900 flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        {item.quality}%
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h3>
                        <span className="text-sm text-slate-500 font-medium">{item.category}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-slate-500 font-bold mb-1">Quantity</div>
                        <div className="text-2xl font-black text-slate-900">{item.quantity} {item.unit}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-bold mb-1">Price</div>
                        <div className="text-2xl font-black text-emerald-600">₹{item.price}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {item.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingCart size={14} />
                          {item.orders}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center">
                          <Edit size={14} />
                        </button>
                        <button className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'price-index' && (
          <motion.div
            key="price-index"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg"
          >
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={24} />
              Live Price Index
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={priceIndexData}>
                <defs>
                  <linearGradient id="tomatoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="riceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mangoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 'bold' }} />
                <Legend />
                <Area type="monotone" dataKey="tomatoes" stroke="#10b981" strokeWidth={3} fill="url(#tomatoGrad)" name="Tomatoes (₹/kg)" />
                <Area type="monotone" dataKey="rice" stroke="#3b82f6" strokeWidth={3} fill="url(#riceGrad)" name="Rice (₹/kg)" />
                <Area type="monotone" dataKey="mangoes" stroke="#f59e0b" strokeWidth={3} fill="url(#mangoGrad)" name="Mangoes (₹/kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {activeTab === 'fulfillment' && (
          <motion.div
            key="fulfillment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
                <Truck className="text-blue-500" size={24} />
                Fulfillment Status
              </h2>
              <div className="space-y-4">
                {fulfillmentStatus.map((status, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900">{status.status}</span>
                        <span className="text-sm font-black text-slate-900">{status.count} orders</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                          style={{ width: `${status.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-lg font-black text-emerald-600">{status.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'warehouse' && (
          <motion.div
            key="warehouse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {warehouseData.map((warehouse, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">{warehouse.name}</h3>
                    <Archive className="text-indigo-500" size={24} />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Capacity</span>
                      <span className="font-black text-slate-900">{warehouse.capacity} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Used</span>
                      <span className="font-black text-emerald-600">{warehouse.used} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Items</span>
                      <span className="font-black text-blue-600">{warehouse.items}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">Utilization</span>
                        <span className="text-sm font-black text-slate-900">{warehouse.utilization}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
                          style={{ width: `${warehouse.utilization}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <BarChart3 className="text-blue-500" size={24} />
                  Revenue Analytics
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '10px', fontWeight: 'bold' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 'bold' }} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">Top Performers</h2>
                <div className="space-y-4">
                  {inventoryData.sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-black">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{item.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-emerald-600">₹{item.revenue.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 font-bold">{item.views} views</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'quality' && (
          <motion.div
            key="quality"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
                <Award className="text-amber-500" size={24} />
                Quality Control Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventoryData.filter(item => item.status !== 'out-of-stock').map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        item.quality >= 95 ? 'bg-emerald-100 text-emerald-600' :
                        item.quality >= 90 ? 'bg-blue-100 text-blue-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        <Award size={20} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-600">Quality Score</span>
                        <span className="text-2xl font-black text-slate-900">{item.quality}%</span>
                      </div>
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            item.quality >= 95 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                            item.quality >= 90 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            'bg-gradient-to-r from-amber-500 to-amber-600'
                          }`}
                          style={{ width: `${item.quality}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                        item.quality >= 95 ? 'bg-emerald-100 text-emerald-600' :
                        item.quality >= 90 ? 'bg-blue-100 text-blue-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {item.quality >= 95 ? 'Premium' : item.quality >= 90 ? 'Grade A' : 'Grade B'}
                      </span>
                      <button className="ml-auto text-xs font-bold text-indigo-600 hover:underline">Certify</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                  <Bell className="text-red-500" size={24} />
                  Smart Alerts
                </h2>
                <button className="h-10 px-4 bg-indigo-500 rounded-xl text-sm font-bold text-white hover:bg-indigo-600 transition-all">
                  Configure Alerts
                </button>
              </div>
              <div className="space-y-4">
                {inventoryData.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').map((item, i) => (
                  <div key={i} className={`p-6 rounded-2xl border-2 ${
                    item.status === 'out-of-stock' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                  } hover:shadow-lg transition-all`}>
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        item.status === 'out-of-stock' ? 'bg-red-500' : 'bg-amber-500'
                      } text-white`}>
                        <AlertCircle size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {item.status === 'out-of-stock' ? 'Out of Stock' : 'Low Stock Alert'}
                          </h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${
                            item.status === 'out-of-stock' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                          }`}>
                            {item.status === 'out-of-stock' ? 'Critical' : 'Warning'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 font-medium mb-3">
                          {item.name} - Current stock: {item.quantity} {item.unit}
                        </p>
                        <div className="flex items-center gap-2">
                          <button className="h-9 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                            View Details
                          </button>
                          <button className="h-9 px-4 bg-emerald-500 rounded-xl text-sm font-bold text-white hover:bg-emerald-600 transition-all">
                            Restock Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg"
          >
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
              <Activity className="text-purple-500" size={24} />
              Activity Log
            </h2>
            <div className="space-y-3">
              {recentActivity.concat([
                { action: 'Inventory Sync', item: 'All Products', quantity: 'Completed', time: '3h ago', user: 'System' },
                { action: 'Quality Check', item: 'Organic Tomatoes', quantity: 'Passed', time: '4h ago', user: 'QC Team' },
                { action: 'Warehouse Transfer', item: 'Basmati Rice', quantity: '200kg', time: '5h ago', user: 'Logistics' },
                { action: 'Price Adjustment', item: 'Green Chillies', quantity: '₹65/kg', time: '6h ago', user: 'Admin' },
              ]).map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-slate-900">{activity.action}</h3>
                      <span className="text-xs text-slate-400 font-bold">{activity.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{activity.item} • {activity.quantity}</p>
                    <p className="text-xs text-slate-400 font-medium">By {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'optimization' && (
          <motion.div
            key="optimization"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-amber-300" size={32} />
                <h2 className="text-2xl font-black">AI Optimization Engine</h2>
              </div>
              <p className="text-indigo-100 font-medium mb-6">Smart recommendations to maximize your inventory performance</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-black mb-1">₹45K</div>
                  <div className="text-sm text-indigo-100 font-medium">Potential Revenue Increase</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-black mb-1">12</div>
                  <div className="text-sm text-indigo-100 font-medium">Optimization Opportunities</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-black mb-1">94%</div>
                  <div className="text-sm text-indigo-100 font-medium">AI Confidence Score</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Price Optimization', desc: 'Increase Basmati Rice price by ₹5/kg based on demand', impact: '+₹6,000', confidence: 92 },
                { title: 'Stock Rebalancing', desc: 'Transfer 100kg Tomatoes from Warehouse B to A', impact: '+15% sales', confidence: 88 },
                { title: 'Bundle Suggestion', desc: 'Create combo: Rice + Turmeric for ₹400', impact: '+₹8,500', confidence: 85 },
                { title: 'Timing Optimization', desc: 'List Fresh Mangoes on Friday 6-8 AM', impact: '+22% views', confidence: 90 },
              ].map((opt, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{opt.title}</h3>
                      <p className="text-sm text-slate-600 font-medium">{opt.desc}</p>
                    </div>
                    <div className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-xs font-black">
                      {opt.confidence}% AI
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="text-xs text-slate-500 font-bold mb-1">Expected Impact</div>
                      <div className="text-xl font-black text-emerald-600">{opt.impact}</div>
                    </div>
                    <button className="h-10 px-4 bg-indigo-500 rounded-xl text-sm font-bold text-white hover:bg-indigo-600 transition-all group-hover:scale-105">
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
                <PieChart className="text-green-500" size={24} />
                Reports & Export
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Inventory Summary', desc: 'Complete inventory overview', icon: Package, color: 'emerald' },
                  { name: 'Revenue Report', desc: 'Sales and revenue analytics', icon: DollarSign, color: 'blue' },
                  { name: 'Quality Report', desc: 'Quality scores and certifications', icon: Award, color: 'amber' },
                  { name: 'Fulfillment Report', desc: 'Order processing metrics', icon: Truck, color: 'indigo' },
                  { name: 'Price Index Report', desc: 'Historical price trends', icon: TrendingUp, color: 'purple' },
                  { name: 'Custom Report', desc: 'Build your own report', icon: Settings, color: 'slate' },
                ].map((report, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group cursor-pointer">
                    <div className={`h-12 w-12 rounded-xl bg-${report.color}-100 text-${report.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <report.icon size={24} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{report.name}</h3>
                    <p className="text-sm text-slate-600 font-medium mb-4">{report.desc}</p>
                    <button className="w-full h-10 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all flex items-center justify-center gap-2">
                      <Download size={16} />
                      Export PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
                <Settings className="text-slate-500" size={24} />
                Inventory Settings
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Auto-Restock Alerts', desc: 'Get notified when stock falls below threshold', enabled: true },
                  { title: 'Price Auto-Adjustment', desc: 'AI-powered dynamic pricing', enabled: false },
                  { title: 'Quality Auto-Check', desc: 'Automatic quality verification on new stock', enabled: true },
                  { title: 'Multi-Warehouse Sync', desc: 'Real-time synchronization across warehouses', enabled: true },
                  { title: 'Low Stock Notifications', desc: 'Email alerts for low inventory', enabled: true },
                  { title: 'Performance Analytics', desc: 'Weekly performance reports', enabled: false },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900 mb-1">{setting.title}</h3>
                      <p className="text-sm text-slate-600 font-medium">{setting.desc}</p>
                    </div>
                    <button className={`relative w-14 h-7 rounded-full transition-all ${
                      setting.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}>
                      <div className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform ${
                        setting.enabled ? 'translate-x-7' : ''
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
