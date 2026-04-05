'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, TrendingUp, Shield, Target, Zap, BarChart3, 
  FileText, Package, Users, AlertCircle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Sparkles, Clock, DollarSign
} from 'lucide-react';
import { aiProcurementService } from '@/services/aiProcurementService';

const AIProcurement = () => {
  const [activeTab, setActiveTab] = useState('supplier-matching');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const tabs = [
    { id: 'supplier-matching', label: 'Smart Matching', icon: Target },
    { id: 'demand-forecast', label: 'Demand Forecast', icon: TrendingUp },
    { id: 'price-intelligence', label: 'Price Intel', icon: DollarSign },
    { id: 'quality-prediction', label: 'Quality AI', icon: Sparkles },
    { id: 'risk-assessment', label: 'Risk Analysis', icon: Shield },
    { id: 'auto-bidding', label: 'Auto-Bidding', icon: Zap },
    { id: 'contract-intel', label: 'Contract AI', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'inventory-optimizer', label: 'Inventory AI', icon: Package },
    { id: 'supplier-performance', label: 'Performance', icon: Users }
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await aiProcurementService.getData(activeTab);
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Brain className="w-10 h-10 text-indigo-600" />
            AI Procurement Intelligence
          </h1>
          <p className="text-gray-600">Advanced AI-powered procurement automation and insights</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSkeleton key="loading" />
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'supplier-matching' && <SmartSupplierMatching data={data} />}
              {activeTab === 'demand-forecast' && <DemandForecast data={data} />}
              {activeTab === 'price-intelligence' && <PriceIntelligence data={data} />}
              {activeTab === 'quality-prediction' && <QualityPrediction data={data} />}
              {activeTab === 'risk-assessment' && <RiskAssessment data={data} />}
              {activeTab === 'auto-bidding' && <AutoBidding data={data} />}
              {activeTab === 'contract-intel' && <ContractIntelligence data={data} />}
              {activeTab === 'analytics' && <ProcurementAnalytics data={data} />}
              {activeTab === 'inventory-optimizer' && <InventoryOptimizer data={data} />}
              {activeTab === 'supplier-performance' && <SupplierPerformance data={data} />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <motion.div
        key={i}
        className="bg-white rounded-2xl p-6 h-64"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </motion.div>
    ))}
  </div>
);

const SmartSupplierMatching = ({ data }: any) => {
  const [requirements, setRequirements] = useState({
    product: 'Wheat',
    quantity: 1000,
    quality: 'Premium',
    location: 'Maharashtra'
  });
  const [matches, setMatches] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const findMatches = async () => {
    setSearching(true);
    try {
      const result = await aiProcurementService.findSuppliers(requirements);
      setMatches(result.matches);
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (data?.matches) setMatches(data.matches);
  }, [data]);

  return (
    <div className="space-y-6">
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-indigo-600" />
          AI-Powered Supplier Matching
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Product"
            value={requirements.product}
            onChange={(e) => setRequirements({ ...requirements, product: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <input
            type="number"
            placeholder="Quantity (kg)"
            value={requirements.quantity}
            onChange={(e) => setRequirements({ ...requirements, quantity: Number(e.target.value) })}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <select
            value={requirements.quality}
            onChange={(e) => setRequirements({ ...requirements, quality: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          >
            <option>Premium</option>
            <option>Standard</option>
            <option>Economy</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            value={requirements.location}
            onChange={(e) => setRequirements({ ...requirements, location: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>

        <motion.button
          onClick={findMatches}
          disabled={searching}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {searching ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Finding Best Matches...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Find AI-Matched Suppliers
            </>
          )}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((supplier, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-indigo-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{supplier.name}</h4>
                <p className="text-sm text-gray-500">{supplier.location}</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                {supplier.matchScore}% Match
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Price/kg</span>
                <span className="font-bold text-gray-900">₹{supplier.pricePerKg}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Rating</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900">{supplier.rating}</span>
                  <span className="text-yellow-500">★</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Delivery</span>
                <span className="font-semibold text-gray-900">{supplier.deliveryDays} days</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              {supplier.certifications?.map((cert: string, i: number) => (
                <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                  {cert}
                </span>
              ))}
            </div>

            <motion.button
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Connect Now
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
