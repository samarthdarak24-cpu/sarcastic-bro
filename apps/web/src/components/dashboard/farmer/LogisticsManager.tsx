'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, Clock, CheckCircle, AlertTriangle, RefreshCw, Package,
  MapPin, Phone, Mail, Navigation, TrendingUp, DollarSign,
  Calendar, User, FileText, Download, Search, Filter,
  BarChart3, ThermometerSun, Droplets, Box, ArrowRight,
  ExternalLink, Star, Shield, Zap, Eye, Activity
} from 'lucide-react';

interface Shipment {
  id: string;
  shipmentNumber: string;
  orderId: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED';
  origin: string;
  destination: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  currentLocation?: string;
  distance: number;
  weight: number;
  temperature?: number;
  humidity?: number;
  cost: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  rating?: number;
  carrierContact?: string;
  items: Array<{ name: string; quantity: number; unit: string }>;
}

export function LogisticsManager() {
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const [shipments] = useState<Shipment[]>([
    {
      id: 'SHP-001',
      shipmentNumber: 'SHP-001',
      orderId: 'ORD-2024-001',
      status: 'IN_TRANSIT',
      origin: 'Nashik Farm, Maharashtra',
      destination: 'Mumbai Market, Maharashtra',
      carrier: 'BlueDart Express',
      trackingNumber: 'BD123456789IN',
      estimatedDelivery: '2024-04-06T18:00:00',
      currentLocation: 'Thane Junction',
      distance: 185,
      weight: 1200,
      temperature: 22,
      humidity: 65,
      cost: 8500,
      priority: 'HIGH',
      rating: 4.5,
      carrierContact: '+91 98765 43210',
      items: [
        { name: 'Wheat', quantity: 500, unit: 'kg' },
        { name: 'Rice', quantity: 700, unit: 'kg' },
      ],
    },
    {
      id: 'SHP-002',
      shipmentNumber: 'SHP-002',
      orderId: 'ORD-2024-002',
      status: 'PENDING',
      origin: 'Pune Warehouse, Maharashtra',
      destination: 'Delhi Hub, Delhi',
      carrier: 'Rivigo Logistics',
      trackingNumber: 'RV987654321IN',
      estimatedDelivery: '2024-04-08T12:00:00',
      distance: 1450,
      weight: 2500,
      cost: 15000,
      priority: 'MEDIUM',
      carrierContact: '+91 87654 32109',
      items: [
        { name: 'Tomatoes', quantity: 1000, unit: 'kg' },
        { name: 'Onions', quantity: 1500, unit: 'kg' },
      ],
    },
    {
      id: 'SHP-003',
      shipmentNumber: 'SHP-003',
      orderId: 'ORD-2024-003',
      status: 'DELIVERED',
      origin: 'Bangalore Center, Karnataka',
      destination: 'Chennai Port, Tamil Nadu',
      carrier: 'Snowman Logistics',
      trackingNumber: 'SM456789123IN',
      estimatedDelivery: '2024-04-05T16:00:00',
      actualDelivery: '2024-04-05T15:30:00',
      distance: 350,
      weight: 800,
      temperature: 4,
      humidity: 85,
      cost: 6200,
      priority: 'URGENT',
      rating: 5.0,
      carrierContact: '+91 76543 21098',
      items: [
        { name: 'Grapes', quantity: 400, unit: 'kg' },
        { name: 'Strawberries', quantity: 400, unit: 'kg' },
      ],
    },
    {
      id: 'SHP-004',
      shipmentNumber: 'SHP-004',
      orderId: 'ORD-2024-004',
      status: 'DELAYED',
      origin: 'Hyderabad Hub, Telangana',
      destination: 'Kolkata Market, West Bengal',
      carrier: 'Delhivery',
      trackingNumber: 'DL789123456IN',
      estimatedDelivery: '2024-04-07T10:00:00',
      currentLocation: 'Nagpur Junction - Delayed',
      distance: 1500,
      weight: 1500,
      cost: 11000,
      priority: 'LOW',
      rating: 3.0,
      carrierContact: '+91 65432 10987',
      items: [
        { name: 'Potatoes', quantity: 800, unit: 'kg' },
        { name: 'Carrots', quantity: 700, unit: 'kg' },
      ],
    },
  ]);

  const statusCounts = useMemo(() => ({
    ALL: shipments.length,
    PENDING: shipments.filter(s => s.status === 'PENDING').length,
    IN_TRANSIT: shipments.filter(s => s.status === 'IN_TRANSIT').length,
    DELIVERED: shipments.filter(s => s.status === 'DELIVERED').length,
    DELAYED: shipments.filter(s => s.status === 'DELAYED').length,
  }), [shipments]);

  const filteredShipments = useMemo(() => {
    let filtered = shipments;
    if (filter !== 'ALL') {
      filtered = filtered.filter(s => s.status === filter);
    }
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.carrier.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [shipments, filter, searchQuery]);

  const stats = useMemo(() => {
    const totalCost = shipments.reduce((sum, s) => sum + s.cost, 0);
    const totalDistance = shipments.reduce((sum, s) => sum + s.distance, 0);
    const totalWeight = shipments.reduce((sum, s) => sum + s.weight, 0);
    const deliveredCount = shipments.filter(s => s.status === 'DELIVERED').length;
    const onTimeRate = shipments.length > 0 ? ((deliveredCount / shipments.length) * 100).toFixed(1) : '0';
    
    return { totalCost, totalDistance, totalWeight, onTimeRate };
  }, [shipments]);

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: { color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
      IN_TRANSIT: { color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50', text: 'text-blue-700', icon: Truck },
      DELIVERED: { color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
      DELAYED: { color: 'from-red-500 to-rose-600', bg: 'bg-red-50', text: 'text-red-700', icon: AlertTriangle },
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  const getProgress = (shipment: Shipment) => {
    if (shipment.status === 'DELIVERED') return 100;
    if (shipment.status === 'PENDING') return 10;
    if (shipment.status === 'DELAYED') return 45;
    if (shipment.status === 'IN_TRANSIT') return 65;
    return 0;
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Shipments', value: shipments.length, icon: Package, color: 'from-blue-500 to-cyan-600', change: '+12' },
          { label: 'In Transit', value: statusCounts.IN_TRANSIT, icon: Truck, color: 'from-green-500 to-emerald-600', change: '+3' },
          { label: 'Total Cost', value: `₹${(stats.totalCost / 1000).toFixed(0)}K`, icon: DollarSign, color: 'from-purple-500 to-pink-600', change: '+8%' },
          { label: 'On-Time Rate', value: `${stats.onTimeRate}%`, icon: TrendingUp, color: 'from-amber-500 to-orange-600', change: '+5%' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 relative overflow-hidden group"
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />
            
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-slate-200"
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by shipment number, tracking ID, or carrier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2">
            {[
              { id: 'ALL', label: 'All', icon: Package },
              { id: 'PENDING', label: 'Pending', icon: Clock },
              { id: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
              { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
              { id: 'DELAYED', label: 'Delayed', icon: AlertTriangle },
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Shipments Layout */}
      <div className="grid grid-cols-12 gap-6">
        <div className={`${selectedShipment ? 'col-span-7' : 'col-span-12'} transition-all duration-300`}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl p-12 text-center shadow-lg"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-slate-500 font-medium">Loading shipments...</p>
              </motion.div>
            ) : filteredShipments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-12 text-center shadow-lg"
              >
                <Package size={64} className="text-slate-300 mx-auto mb-4" />
                <p className="text-xl font-bold text-slate-900 mb-2">No shipments found</p>
                <p className="text-slate-500">Try adjusting your search or filters</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredShipments.map((shipment, index) => {
                  const statusConfig = getStatusConfig(shipment.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <motion.div
                      key={shipment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      onClick={() => setSelectedShipment(shipment)}
                      className={`bg-white rounded-2xl p-6 shadow-lg border-2 cursor-pointer transition-all ${
                        selectedShipment?.id === shipment.id
                          ? 'border-blue-500 shadow-blue-200'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-black text-slate-900">{shipment.shipmentNumber}</h3>
                            <span className="text-xs text-slate-500">• {shipment.orderId}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                            <MapPin size={14} />
                            <span>{shipment.origin}</span>
                            <ArrowRight size={14} />
                            <span>{shipment.destination}</span>
                          </div>
                          <p className="text-sm text-slate-500">{shipment.carrier}</p>
                        </div>
                        
                        <div className={`px-3 py-1.5 rounded-xl ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1.5`}>
                          <StatusIcon size={14} />
                          <span className="text-xs font-bold uppercase">{shipment.status.replace('_', ' ')}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span>Progress</span>
                          <span className="font-bold">{getProgress(shipment)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgress(shipment)}%` }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                            className={`h-2 rounded-full bg-gradient-to-r ${statusConfig.color}`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Box size={14} />
                            <span className="font-semibold">{shipment.weight} kg</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <DollarSign size={14} />
                            <span className="font-semibold">₹{(shipment.cost / 1000).toFixed(1)}K</span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">{formatDate(shipment.estimatedDelivery)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Shipment Details Panel */}
        <AnimatePresence>
          {selectedShipment && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="col-span-5"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 sticky top-6">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 mb-1">{selectedShipment.shipmentNumber}</h2>
                      <p className="text-slate-500">{selectedShipment.trackingNumber}</p>
                    </div>
                    <button
                      onClick={() => setSelectedShipment(null)}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  
                  {(() => {
                    const statusConfig = getStatusConfig(selectedShipment.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <div className={`px-4 py-2 rounded-xl ${statusConfig.bg} ${statusConfig.text} flex items-center gap-2 w-fit`}>
                        <StatusIcon size={16} />
                        <span className="text-sm font-bold uppercase">{selectedShipment.status.replace('_', ' ')}</span>
                      </div>
                    );
                  })()}
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 font-medium">Carrier</span>
                      <span className="text-sm font-black text-slate-900">{selectedShipment.carrier}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 font-medium">Weight</span>
                      <span className="text-sm font-black text-slate-900">{selectedShipment.weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 font-medium">Distance</span>
                      <span className="text-sm font-black text-slate-900">{selectedShipment.distance} km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 font-medium">Cost</span>
                      <span className="text-sm font-black text-green-600">₹{selectedShipment.cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 font-medium">ETA</span>
                      <span className="text-sm font-black text-slate-900">{formatDate(selectedShipment.estimatedDelivery)}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Items</h3>
                    <div className="space-y-2">
                      {selectedShipment.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <span className="text-sm font-medium text-slate-900">{item.name}</span>
                          <span className="text-sm font-bold text-slate-600">{item.quantity} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-200 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Eye size={18} />
                    Track Shipment
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone size={18} />
                    Contact Carrier
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default LogisticsManager;