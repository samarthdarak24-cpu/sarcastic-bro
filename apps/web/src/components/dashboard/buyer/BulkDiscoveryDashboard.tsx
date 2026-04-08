'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, MapPin, TrendingUp, Shield, Star, Filter, Search,
  Layers, Users, DollarSign, CheckCircle, Award, Sparkles,
  ArrowRight, Eye, BarChart3, Clock, Target, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { aggregationService } from '@/services/aggregationService';
import { buyerEscrowService } from '@/services/buyerEscrowService';
import toast from 'react-hot-toast';

interface BulkLot {
  id: string;
  name: string;
  crop: string;
  totalQuantity: number;
  farmersCount: number;
  avgQuality: number;
  trustScore: number;
  pricePerKg: number;
  savings: number;
  location: string;
  distance: number;
  status: 'available' | 'limited' | 'reserved';
  harvestDate: string;
  deliveryTime: string;
  blockchainVerified: boolean;
  aiCertified: boolean;
  topFarmers: { name: string; contribution: number }[];
  qualityTrend: { day: string; score: number }[];
}

export default function BulkDiscoveryDashboard() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    quality: 'all',
    price: 'all',
    distance: 'all',
    verified: false
  });
  const [selectedLot, setSelectedLot] = useState<any | null>(null);
  const [bulkLots, setBulkLots] = useState<any[]>([]);

  useEffect(() => {
    loadBulkLots();
    const timer = setInterval(loadBulkLots, 5000); // 5s Real-time sync
    return () => clearInterval(timer);
  }, [selectedFilters]);

  const loadBulkLots = async () => {
    try {
      setLoading(true);
      
      const filters: any = {};
      if (selectedFilters.quality !== 'all') {
        filters.minQuality = selectedFilters.quality === 'premium' ? 90 : 80;
      }
      if (selectedFilters.verified) {
        filters.verifiedOnly = true;
      }

      const lots = await aggregationService.getAvailableLots(filters);
      setBulkLots(lots);
    } catch (error) {
      console.error('Error loading bulk lots:', error);
      toast.error('Failed to load bulk lots');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (lot: any) => {
    try {
      setLoading(true);
      await buyerEscrowService.createEscrow({
        order_id: 'MY_ORDER',
        farmer_id: 'FARMER_A',
        amount: lot.totalQuantity * lot.pricePerKg
      } as any);
      toast.success('Funds Locked in Escrow! Farmer notified.');
      setSelectedLot(null);
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to initiate escrow');
    } finally {
      setLoading(false);
    }
  };

  const discoveryMetrics = {
    totalLots: 24,
    avgSavings: 18.5,
    verifiedLots: 22,
    avgQuality: 93.5
  };

  const filteredLots = bulkLots.filter(lot => {
    if (searchQuery && !lot.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !lot.crop.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedFilters.quality !== 'all') {
      const minQuality = selectedFilters.quality === 'premium' ? 90 : 80;
      if (lot.avgQuality < minQuality) return false;
    }
    if (selectedFilters.verified && !lot.blockchainVerified) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-200 h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center gap-3">
            <Layers className="text-emerald-500" size={36} />
            Bulk Lots Marketplace
          </h1>
          <p className="text-slate-500 font-medium">Discover aggregated lots with verified quality & trust</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('grid')}
            className={`h-12 px-6 rounded-xl font-bold transition-all ${
              viewMode === 'grid' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Grid View
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`h-12 px-6 rounded-xl font-bold transition-all ${
              viewMode === 'map' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">AI Recommended: Best Value Lots</h3>
              <p className="text-indigo-50 text-sm font-medium">Based on your purchase history and preferences</p>
            </div>
          </div>
          <button className="h-12 px-6 bg-white text-indigo-600 rounded-xl font-bold hover:shadow-lg transition-all">
            View Recommendations
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
          <div className="flex justify-between items-start mb-6">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-500">
              <Package size={24} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-slate-400 font-black text-[11px] uppercase tracking-widest mb-1">Available Lots</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{discoveryMetrics.totalLots}</h3>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
          <div className="flex justify-between items-start mb-6">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-slate-400 font-black text-[11px] uppercase tracking-widest mb-1">Avg Savings</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{discoveryMetrics.avgSavings}%</h3>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
          <div className="flex justify-between items-start mb-6">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-500">
              <Shield size={24} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-slate-400 font-black text-[11px] uppercase tracking-widest mb-1">Verified Lots</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{discoveryMetrics.verifiedLots}</h3>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
          <div className="flex justify-between items-start mb-6">
            <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-500">
              <Star size={24} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-slate-400 font-black text-[11px] uppercase tracking-widest mb-1">Avg Quality</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{discoveryMetrics.avgQuality}</h3>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by crop, location, or lot name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={selectedFilters.quality}
            onChange={(e) => setSelectedFilters({...selectedFilters, quality: e.target.value})}
            className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Quality</option>
            <option value="premium">Premium (90+)</option>
            <option value="good">Good (80+)</option>
          </select>
          <select
            value={selectedFilters.price}
            onChange={(e) => setSelectedFilters({...selectedFilters, price: e.target.value})}
            className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Prices</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
          <button
            onClick={() => setSelectedFilters({...selectedFilters, verified: !selectedFilters.verified})}
            className={`h-12 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              selectedFilters.verified
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Shield size={18} />
            Verified Only
          </button>
        </div>
      </div>

      {/* Bulk Lots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLots.map(lot => (
          <motion.div
            key={lot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            onClick={() => setSelectedLot(lot)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-black text-slate-900">{lot.name}</h3>
                  {lot.blockchainVerified && (
                    <div className="h-6 w-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Shield className="text-emerald-600" size={14} />
                    </div>
                  )}
                  {lot.aiCertified && (
                    <div className="h-6 w-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="text-blue-600" size={14} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {lot.location}
                  </span>
                  <span>•</span>
                  <span>{lot.distance} km away</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                lot.status === 'available' ? 'bg-emerald-100 text-emerald-600' :
                lot.status === 'limited' ? 'bg-amber-100 text-amber-600' :
                'bg-red-100 text-red-600'
              }`}>
                {lot.status}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl font-black text-slate-900">{lot.totalQuantity}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">kg Total</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <div className="text-2xl font-black text-emerald-600">{lot.avgQuality}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Quality</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-black text-blue-600">{lot.trustScore}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Trust</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-black text-purple-600">{lot.farmersCount}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Farmers</div>
              </div>
            </div>

            {/* Quality Trend */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-700">Quality Trend</span>
                <span className="text-xs font-bold text-emerald-600">Stable ↗</span>
              </div>
              <ResponsiveContainer width="100%" height={60}>
                <AreaChart data={lot.qualityTrend}>
                  <defs>
                    <linearGradient id={`quality-${lot.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} fill={`url(#quality-${lot.id})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Farmers */}
            <div className="mb-6">
              <div className="text-sm font-bold text-slate-700 mb-3">Top Contributors</div>
              <div className="space-y-2">
                {(lot.topFarmers || []).slice(0, 2).map((farmer: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">{farmer.name}</span>
                    <span className="text-slate-900 font-bold">{farmer.contribution}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div>
                <div className="text-3xl font-black text-emerald-600">₹{lot.pricePerKg}</div>
                <div className="text-xs text-slate-500 font-bold">per kg • Save {lot.savings}%</div>
              </div>
              <button className="h-12 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2 group-hover:scale-105">
                Place Order <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lot Detail Modal */}
      <AnimatePresence>
        {selectedLot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedLot(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedLot.name}</h2>
                  <p className="text-slate-600 font-medium">{selectedLot.location} • {selectedLot.farmersCount} farmers</p>
                </div>
                <button
                  onClick={() => setSelectedLot(null)}
                  className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="text-sm font-bold text-slate-700 mb-2">Quality Score</div>
                  <div className="text-4xl font-black text-emerald-600">{selectedLot.avgQuality}/100</div>
                  <div className="text-xs text-slate-600 font-medium mt-2">AI Verified • Blockchain Certified</div>
                </div>
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="text-sm font-bold text-slate-700 mb-2">Trust Score</div>
                  <div className="text-4xl font-black text-blue-600">{selectedLot.trustScore}/100</div>
                  <div className="text-xs text-slate-600 font-medium mt-2">Based on farmer history & verification</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-sm font-bold text-slate-700">Total Quantity</span>
                  <span className="text-lg font-black text-slate-900">{selectedLot.totalQuantity} kg</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-sm font-bold text-slate-700">Price per kg</span>
                  <span className="text-lg font-black text-emerald-600">₹{selectedLot.pricePerKg}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-sm font-bold text-slate-700">Estimated Delivery</span>
                  <span className="text-lg font-black text-slate-900">{selectedLot.deliveryTime}</span>
                </div>
              </div>

              <button 
                onClick={() => handlePlaceOrder(selectedLot)}
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-bold text-white text-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                Place Order for ₹{(selectedLot.totalQuantity * selectedLot.pricePerKg).toLocaleString()}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
