'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, TrendingUp, Target, Zap, ShieldCheck,
  Activity, Database, DollarSign, CheckCircle, AlertTriangle,
  ArrowUpRight, Layers, Users, RefreshCw
} from 'lucide-react';

export default function AgriIntelligence() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'predictions', label: 'Predictions', icon: Brain },
    { id: 'yield', label: 'Yield Forecast', icon: Target },
    { id: 'resources', label: 'Resources', icon: Zap },
    { id: 'risk', label: 'Risk Analysis', icon: ShieldCheck },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const overviewStats = [
    { label: 'AI Accuracy', value: '98.2%', change: '+2.1%', icon: Brain, color: 'from-purple-500 to-pink-600' },
    { label: 'Data Points', value: '14.2K', change: '+1.2K', icon: Database, color: 'from-blue-500 to-cyan-600' },
    { label: 'Predictions', value: '247', change: '+18', icon: Target, color: 'from-green-500 to-emerald-600' },
    { label: 'Revenue Impact', value: '₹24.8K', change: '+12%', icon: DollarSign, color: 'from-amber-500 to-orange-600' }
  ];

  const predictions = [
    { title: 'Crop Rotation', description: 'AI suggests rotating wheat with pulses for better soil health', confidence: 92, impact: 'High', icon: Sparkles, color: 'from-green-500 to-emerald-600' },
    { title: 'Irrigation Schedule', description: 'Optimize water usage by 25% with smart scheduling', confidence: 88, impact: 'Medium', icon: Zap, color: 'from-blue-500 to-cyan-600' },
    { title: 'Harvest Timing', description: 'Best harvest window: Next 7 days for maximum yield', confidence: 95, impact: 'High', icon: Target, color: 'from-purple-500 to-pink-600' },
    { title: 'Fertilizer Mix', description: 'Adjust NPK ratio for 15% better yield', confidence: 90, impact: 'High', icon: CheckCircle, color: 'from-amber-500 to-orange-600' }
  ];

  const yieldForecasts = [
    { crop: 'Tomatoes', current: 850, predicted: 920, unit: 'kg', confidence: 92, change: 8.2 },
    { crop: 'Wheat', current: 1200, predicted: 1350, unit: 'kg', confidence: 88, change: 12.5 },
    { crop: 'Rice', current: 980, predicted: 1050, unit: 'kg', confidence: 90, change: 7.1 },
    { crop: 'Corn', current: 750, predicted: 840, unit: 'kg', confidence: 87, change: 12.0 }
  ];

  const resourceOptimization = [
    { resource: 'Water', current: '1200 L/day', optimized: '900 L/day', savings: '25%', cost: '₹450', icon: Activity },
    { resource: 'Fertilizer', current: '45 kg/week', optimized: '38 kg/week', savings: '15%', cost: '₹280', icon: Layers },
    { resource: 'Energy', current: '180 kWh', optimized: '135 kWh', savings: '25%', cost: '₹360', icon: Zap },
    { resource: 'Labor', current: '40 hrs/week', optimized: '32 hrs/week', savings: '20%', cost: '₹800', icon: Users }
  ];

  const riskAssessments = [
    { risk: 'Pest Infestation', level: 'Low', probability: 15, impact: 'Medium', action: 'Monitor weekly', color: 'green' },
    { risk: 'Water Shortage', level: 'Medium', probability: 45, impact: 'High', action: 'Install drip irrigation', color: 'amber' },
    { risk: 'Price Volatility', level: 'High', probability: 72, impact: 'High', action: 'Lock in contracts', color: 'red' },
    { risk: 'Weather Damage', level: 'Low', probability: 22, impact: 'Medium', action: 'Use protective covers', color: 'green' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">AI Intelligence</h2>
            <p className="text-sm text-slate-500">Powered by Machine Learning</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span className="text-sm font-bold">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => (
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
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                <stat.icon size={20} className="text-white" />
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

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-lg font-black text-slate-900 mb-4">Top Predictions</h3>
                <div className="space-y-3">
                  {predictions.slice(0, 3).map((pred, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pred.color} flex items-center justify-center flex-shrink-0`}>
                        <pred.icon size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm">{pred.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{pred.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-bold text-purple-600">{pred.confidence}% confidence</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-bold text-green-600">{pred.impact} impact</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-lg font-black text-slate-900 mb-4">Risk Overview</h3>
                <div className="space-y-3">
                  {riskAssessments.map((risk, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{risk.risk}</p>
                        <p className="text-xs text-slate-500 mt-1">{risk.action}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          risk.color === 'green' ? 'bg-green-100 text-green-700' :
                          risk.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {risk.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map((pred, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pred.color} flex items-center justify-center shadow-md`}>
                      <pred.icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 mb-1">{pred.title}</h4>
                      <p className="text-sm text-slate-600">{pred.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">Confidence</p>
                      <p className="text-lg font-black text-purple-600">{pred.confidence}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Impact</p>
                      <p className={`text-sm font-bold ${pred.impact === 'High' ? 'text-green-600' : 'text-amber-600'}`}>
                        {pred.impact}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'yield' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {yieldForecasts.map((forecast, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
                >
                  <h4 className="font-black text-slate-900 mb-4">{forecast.crop}</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Current</p>
                      <p className="text-2xl font-black text-slate-900">{forecast.current} {forecast.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Predicted</p>
                      <p className="text-2xl font-black text-green-600">{forecast.predicted} {forecast.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight size={16} className="text-green-600" />
                      <span className="text-sm font-bold text-green-600">+{forecast.change}%</span>
                    </div>
                    <span className="text-xs text-slate-500">{forecast.confidence}% confidence</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resourceOptimization.map((resource, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <resource.icon size={20} className="text-blue-600" />
                    </div>
                    <h4 className="font-black text-slate-900">{resource.resource}</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Current</span>
                      <span className="text-sm font-bold text-slate-900">{resource.current}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Optimized</span>
                      <span className="text-sm font-bold text-green-600">{resource.optimized}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-slate-100">
                      <span className="text-sm font-bold text-purple-600">Savings: {resource.savings}</span>
                      <span className="text-sm font-bold text-green-600">{resource.cost}/month</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="space-y-4">
              {riskAssessments.map((risk, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">{risk.risk}</h4>
                      <p className="text-sm text-slate-600">{risk.action}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      risk.color === 'green' ? 'bg-green-100 text-green-700' :
                      risk.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {risk.level}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Probability</p>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            risk.color === 'green' ? 'bg-green-500' :
                            risk.color === 'amber' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${risk.probability}%` }}
                        />
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-1">{risk.probability}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Impact</p>
                      <p className="text-sm font-bold text-slate-900">{risk.impact}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
