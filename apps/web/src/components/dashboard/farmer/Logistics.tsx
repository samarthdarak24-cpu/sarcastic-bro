'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, Box, ChevronRight, CheckCircle, MapPin, Package, ArrowRight, 
  ExternalLink, Clock, Navigation, Phone, User, Calendar, AlertCircle,
  TrendingUp, Filter, Search, Download, RefreshCw, Map, BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActiveLogistics } from '@/hooks/useLogistics';
import { format } from 'date-fns';

// Badge component
const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: string; className?: string }) => {
  const variantClasses = {
    default: 'bg-slate-100 text-slate-700',
    outline: 'bg-transparent border',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-rose-100 text-rose-700 border-rose-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
};

// Status color mapping
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'PENDING': 'amber',
    'PICKED_UP': 'blue',
    'IN_TRANSIT': 'cyan',
    'OUT_FOR_DELIVERY': 'indigo',
    'DELIVERED': 'emerald',
    'CANCELLED': 'rose'
  };
  return colors[status] || 'slate';
};

// Status badge variant
const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  const variants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    'PENDING': 'warning',
    'PICKED_UP': 'info',
    'IN_TRANSIT': 'info',
    'OUT_FOR_DELIVERY': 'info',
    'DELIVERED': 'success',
    'CANCELLED': 'danger'
  };
  return variants[status] || 'default';
};

export default function Logistics() {
  const router = useRouter();
  const { activeLogistics, loading, fetchActiveLogistics } = useActiveLogistics();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLogistic, setSelectedLogistic] = useState<any>(null);

  useEffect(() => {
    fetchActiveLogistics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchActiveLogistics, 30000);
    return () => clearInterval(interval);
  }, [fetchActiveLogistics]);

  // Ensure activeLogistics is always an array
  const logistics = Array.isArray(activeLogistics) ? activeLogistics : [];

  // Filter logistics
  const filteredLogistics = logistics.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;
    const matchesSearch = !searchQuery || 
      item.order?.lot?.cropName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.currentLocation?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: logistics.length,
    inTransit: logistics.filter(l => ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(l.status)).length,
    delivered: logistics.filter(l => l.status === 'DELIVERED').length,
    pending: logistics.filter(l => l.status === 'PENDING').length
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 p-8 text-white shadow-2xl">
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-400/20 rounded-full blur-3xl" />
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Truck size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white">Agri-Logistics Hub</h2>
                  <p className="text-green-100 mt-1 font-medium">Real-time supply chain tracking & management</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => fetchActiveLogistics()}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-black shadow-lg transition-all flex items-center gap-2 group disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              Refresh
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Shipments', value: stats.total, icon: Package, color: 'from-cyan-400 to-blue-500' },
              { label: 'In Transit', value: stats.inTransit, icon: Truck, color: 'from-blue-400 to-indigo-500' },
              { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'from-emerald-400 to-green-500' },
              { label: 'Pending Pickup', value: stats.pending, icon: Clock, color: 'from-amber-400 to-orange-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <p className="text-3xl font-black mb-1">{stat.value}</p>
                <p className="text-xs text-green-100 font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-slate-700">
              <Filter size={18} />
              <span className="font-bold text-sm">Filter:</span>
            </div>
            {['all', 'PENDING', 'IN_TRANSIT', 'DELIVERED'].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  selectedFilter === filter
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter === 'all' ? 'All' : filter.replace('_', ' ')}
              </button>
            ))}
          </div>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by crop or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none font-medium text-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Shipments List */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-black text-slate-900">Active Shipments</h3>
            <button className="text-emerald-600 hover:text-emerald-700 font-bold text-sm flex items-center gap-2">
              <Download size={16} />
              Export Report
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center">
              <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Loading shipments...</p>
            </div>
          ) : filteredLogistics.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-slate-300" size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No Shipments Found</h3>
              <p className="text-slate-500">
                {searchQuery || selectedFilter !== 'all' 
                  ? 'Try adjusting your filters or search query'
                  : 'No active logistics activity recorded yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogistics.map((item, index) => {
                const statusColor = getStatusColor(item.status);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedLogistic(item)}
                    className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:shadow-2xl hover:border-emerald-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-14 h-14 rounded-2xl bg-${statusColor}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Truck className={`text-${statusColor}-600`} size={24} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-black text-slate-900">
                              {item.order?.lot?.cropName || 'Batch Processing'}
                            </h4>
                            <Badge variant={getStatusVariant(item.status)}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin size={16} className="text-slate-400" />
                              <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Current Location</p>
                                <p className="text-sm font-bold">{item.currentLocation || 'In Transit'}</p>
                              </div>
                            </div>
                            
                            {item.driverName && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <User size={16} className="text-slate-400" />
                                <div>
                                  <p className="text-xs font-bold text-slate-400 uppercase">Driver</p>
                                  <p className="text-sm font-bold">{item.driverName}</p>
                                </div>
                              </div>
                            )}
                            
                            {item.estimatedDelivery && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <Calendar size={16} className="text-slate-400" />
                                <div>
                                  <p className="text-xs font-bold text-slate-400 uppercase">ETA</p>
                                  <p className="text-sm font-bold">{format(new Date(item.estimatedDelivery), 'MMM dd, HH:mm')}</p>
                                </div>
                              </div>
                            )}
                            
                            {item.vehicleNumber && (
                              <div className="flex items-center gap-2 text-slate-600">
                                <Truck size={16} className="text-slate-400" />
                                <div>
                                  <p className="text-xs font-bold text-slate-400 uppercase">Vehicle</p>
                                  <p className="text-sm font-bold">{item.vehicleNumber}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 group-hover:scale-105">
                        Track <Navigation size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar - Insights & Quick Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Package size={16} className="text-emerald-600" />
              </div>
              Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Request Pickup', icon: Truck, color: 'emerald', path: '/farmer/logistics' },
                { label: 'View All Logistics', icon: Map, color: 'blue', path: '/farmer/logistics' },
                { label: 'Logistics Analytics', icon: BarChart3, color: 'purple', path: '/farmer/dashboard?section=analytics' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => router.push(action.path)}
                  className={`w-full p-4 rounded-2xl bg-${action.color}-50 hover:bg-${action.color}-100 border border-${action.color}-100 hover:border-${action.color}-200 transition-all flex items-center justify-between group`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-${action.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className={`text-${action.color}-600`} size={20} />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{action.label}</span>
                  </div>
                  <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition-transform" size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Guarantee */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 border border-emerald-100 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-xl font-black text-emerald-900 mb-3 leading-tight">Safe Delivery Guarantee</h3>
              <p className="text-emerald-700 font-medium leading-relaxed mb-4 text-sm">
                AgriTrust tracking ensures automatic payment release upon buyer confirmation.
              </p>
              
              <div className="space-y-2">
                {[
                  "📸 Photo Evidence at Pickup",
                  "🗺️ GPS Route Optimization",
                  "🌡️ Temperature Monitoring",
                  "💰 Escrow-Linked Release"
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-4">System Status</h3>
            <div className="space-y-3">
              {[
                { label: 'GPS Tracking', status: 'Active', color: 'emerald' },
                { label: 'Real-time Updates', status: 'Live', color: 'blue' },
                { label: 'Driver Network', status: 'Online', color: 'emerald' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${item.color}-500 animate-pulse`} />
                    <span className={`text-xs font-black text-${item.color}-600 uppercase`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Logistic Detail Modal */}
      <AnimatePresence>
        {selectedLogistic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLogistic(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">
                    {selectedLogistic.order?.lot?.cropName || 'Shipment Details'}
                  </h2>
                  <Badge variant={getStatusVariant(selectedLogistic.status)}>
                    {selectedLogistic.status.replace('_', ' ')}
                  </Badge>
                </div>
                <button
                  onClick={() => setSelectedLogistic(null)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Tracking Info */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin size={18} />
                    Tracking Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Current Location</p>
                      <p className="font-bold text-slate-900">{selectedLogistic.currentLocation || 'In Transit'}</p>
                    </div>
                    {selectedLogistic.estimatedDelivery && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Estimated Delivery</p>
                        <p className="font-bold text-slate-900">
                          {format(new Date(selectedLogistic.estimatedDelivery), 'PPp')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Driver Info */}
                {selectedLogistic.driverName && (
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                      <User size={18} />
                      Driver Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Name</p>
                        <p className="font-bold text-slate-900">{selectedLogistic.driverName}</p>
                      </div>
                      {selectedLogistic.driverPhone && (
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Phone</p>
                          <p className="font-bold text-slate-900">{selectedLogistic.driverPhone}</p>
                        </div>
                      )}
                      {selectedLogistic.vehicleNumber && (
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Vehicle Number</p>
                          <p className="font-bold text-slate-900">{selectedLogistic.vehicleNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/farmer/logistics/${selectedLogistic.orderId}`)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2"
                  >
                    <Navigation size={18} />
                    Live Tracking
                  </button>
                  {selectedLogistic.driverPhone && (
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2">
                      <Phone size={18} />
                      Call Driver
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
