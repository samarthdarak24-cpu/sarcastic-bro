'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, TrendingUp, Shield, Target, Zap, BarChart3, 
  FileText, Package, Users, AlertCircle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Sparkles, Clock, DollarSign
} from 'lucide-react';
import { aiProcurementService } from '@/services/aiProcurementService';

// AI Procurement Component
const AIProcurement = () => {
  const [activeTab, setActiveTab] = useState('supplier-matching');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const tabs = [
    { id: 'supplier-matching', label: 'Smart Matching', icon: Target },
    { id: 'demand-forecast', label: 'Demand Forecast', icon: TrendingUp },
    { id: 'price-intelligence', label: 'Price Intel', icon: DollarSign },
    { id: 'risk-assessment', label: 'Risk Analysis', icon: Shield },
    { id: 'auto-bidding', label: 'Auto-Bidding', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      let result;
      switch (activeTab) {
        case 'supplier-matching':
          result = await aiProcurementService.getSupplierMatches({});
          break;
        case 'demand-forecast':
          result = await aiProcurementService.getDemandForecasts();
          break;
        case 'price-intelligence':
          result = await aiProcurementService.getPriceOptimizations();
          break;
        case 'risk-assessment':
          result = await aiProcurementService.getRiskAlerts();
          break;
        default:
          result = await aiProcurementService.getAIRecommendations();
      }
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
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
          <p className="text-gray-600 font-medium">Advanced AI-powered procurement automation and insights</p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
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
              {activeTab === 'demand-forecast' && <DemandForecastSection data={data} />}
              {activeTab === 'price-intelligence' && <PriceIntelligenceSection data={data} />}
              {activeTab === 'risk-assessment' && <RiskSection data={data} />}
              {activeTab === 'auto-bidding' && <AutoBiddingSection data={data} />}
              {activeTab === 'analytics' && <AnalyticsSection data={data} />}
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
      <div key={i} className="bg-white rounded-3xl p-8 h-72 animate-pulse border border-gray-100 shadow-sm">
        <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-50 rounded-full w-1/2 mb-8"></div>
        <div className="h-40 bg-gray-50/50 rounded-2xl"></div>
      </div>
    ))}
  </div>
);

const SmartSupplierMatching = ({ data }: any) => {
  const [matches, setMatches] = useState<any[]>(data || []);
  const [searching, setSearching] = useState(false);

  const findMatches = async () => {
    setSearching(true);
    try {
      const result = await aiProcurementService.getSupplierMatches({});
      setMatches(result);
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-indigo-50">
        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <Target className="w-8 h-8 text-indigo-600" />
          Smart Supplier Discovery
        </h3>
        <button
          onClick={findMatches}
          disabled={searching}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-indigo-200/50 shadow-lg transition-all"
        >
          {searching ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
          Refresh AI Matching
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((supplier: any, idx: number) => (
          <div key={idx} className="bg-white rounded-[2rem] p-7 shadow-lg border border-gray-100 hover:border-indigo-200 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-black text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">{supplier.name}</h4>
                <p className="text-gray-500 font-medium">{supplier.location}</p>
              </div>
              <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black text-sm">
                {supplier.matchScore}% Match
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold">Pricing</span>
                <span className="text-gray-900 font-black">{supplier.priceRange}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold">Delivery</span>
                <span className="text-gray-900 font-black">{supplier.avgDeliveryTime}</span>
              </div>
            </div>
            <button className="w-full py-3 bg-gray-50 hover:bg-indigo-600 hover:text-white text-gray-900 font-black rounded-xl transition-all">
              Initiate Contact
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const DemandForecastSection = ({ data }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {data?.map((item: any, i: number) => (
      <div key={i} className="bg-white rounded-[2rem] p-7 shadow-lg border border-gray-100 mt-4">
        <h4 className="font-black text-xl mb-4">{item.product}</h4>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-3xl font-black text-indigo-600">{item.forecastedDemand}</div>
          <div className={`px-2 py-1 rounded-lg text-xs font-bold ${item.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {item.trend === 'up' ? 'Trending Up' : 'Trending Down'}
          </div>
        </div>
        <div className="text-sm text-gray-500 font-medium">Confidence: {item.confidence}%</div>
      </div>
    )) || <div className="text-center p-10 font-bold text-gray-400">Loading AI Forecasts...</div>}
  </div>
);

const PriceIntelligenceSection = ({ data }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {data?.map((item: any, i: number) => (
      <div key={i} className="bg-white rounded-[2rem] p-7 shadow-lg border border-gray-100">
        <h4 className="font-black text-xl mb-2">{item.product}</h4>
        <div className="text-sm text-gray-500 mb-4">{item.recommendation}</div>
        <div className="bg-emerald-50 p-4 rounded-2xl">
          <div className="text-emerald-700 font-black text-lg">Potential Savings: ₹{item.savings}</div>
        </div>
      </div>
    )) || <div className="text-center p-10 font-bold text-gray-400">Scanning Market Data...</div>}
  </div>
);

const RiskSection = ({ data }: any) => (
  <div className="space-y-4">
    {data?.map((risk: any, i: number) => (
      <div key={i} className="bg-white rounded-3xl p-6 shadow-md border-l-8 border-red-500">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-black text-xl text-gray-900 underline decoration-red-200">{risk.title}</h4>
            <p className="text-gray-600 mt-2 font-medium">{risk.description}</p>
          </div>
          <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full font-black text-xs uppercase">{risk.severity}</span>
        </div>
      </div>
    )) || <div className="text-center p-10 font-bold text-gray-400">No High Risks Detected</div>}
  </div>
);

const AutoBiddingSection = ({ data }: any) => (
  <div className="bg-white rounded-[2rem] p-8 border border-gray-100 text-center">
    <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
    <h3 className="text-2xl font-black mb-2">Automated Procurement Bidding</h3>
    <p className="text-gray-500 max-w-lg mx-auto mb-6">Our AI is currently monitoring 12 active tenders for you.</p>
    <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black">Configure Rules</button>
  </div>
);

const AnalyticsSection = ({ data }: any) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 h-64 flex items-center justify-center">
        <BarChart3 className="w-12 h-12 text-gray-300 mr-4" />
        <span className="font-black text-gray-400">Spend Analytics Chart</span>
    </div>
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 h-64 flex items-center justify-center">
        <TrendingUp className="w-12 h-12 text-gray-300 mr-4" />
        <span className="font-black text-gray-400">Supplier Quality Trends</span>
    </div>
  </div>
);

export default AIProcurement;
