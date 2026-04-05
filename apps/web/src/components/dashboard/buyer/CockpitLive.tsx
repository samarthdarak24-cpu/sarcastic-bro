'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, TrendingUp, TrendingDown, DollarSign, Package,
  Users, ShoppingCart, AlertTriangle, CheckCircle, Clock,
  BarChart3, PieChart, LineChart, Zap, Target, Brain,
  Shield, Gauge, Map, Wifi, Database, Bell, Eye,
  ArrowUpRight, ArrowDownRight, RefreshCw, Download
} from 'lucide-react';

const CockpitLive = () => {
  const [activeMetric, setActiveMetric] = useState('overview');
  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const metrics = [
    { id: 'overview', label: 'Live Overview', icon: Activity, color: 'blue' },
    { id: 'orders', label: 'Order Flow', icon: ShoppingCart, color: 'green' },
    { id: 'suppliers', label: 'Supplier Status', icon: Users, color: 'purple' },
    { id: 'inventory', label: 'Inventory Levels', icon: Package, color: 'orange' },
    { id: 'pricing', label: 'Price Trends', icon: TrendingUp, color: 'cyan' },
    { id: 'quality', label: 'Quality Metrics', icon: Shield, color: 'emerald' },
    { id: 'delivery', label: 'Delivery Tracking', icon: Clock, color: 'yellow' },
    { id: 'alerts', label: 'Smart Alerts', icon: Bell, color: 'red' },
    { id: 'analytics', label: 'AI Analytics', icon: Brain, color: 'indigo' },
    { id: 'performance', label: 'Performance KPIs', icon: Gauge, color: 'pink' },
    { id: 'market', label: 'Market Intelligence', icon: LineChart, color: 'teal' },
    { id: 'risk', label: 'Risk Monitor', icon: AlertTriangle, color: 'amber' },
    { id: 'compliance', label: 'Compliance Check', icon: CheckCircle, color: 'lime' },
    { id: 'forecast', label: 'Demand Forecast', icon: Target, color: 'violet' },
    { id: 'network', label: 'Network Health', icon: Wifi, color: 'sky' },
    { id: 'costs', label: 'Cost Analysis', icon: DollarSign, color: 'rose' },
    { id: 'efficiency', label: 'Efficiency Score', icon: Zap, color: 'fuchsia' },
    { id: 'sustainability', label: 'Sustainability', icon: Leaf, color: 'green' },
    { id: 'insights', label: 'AI Insights', icon: Eye, color: 'blue' },
    { id: 'reports', label: 'Live Reports', icon: BarChart3, color: 'purple' }
  ];

  const kpiCards = [
    { label: 'Active Orders', value: '247', change: '+12%', trend: 'up', icon: ShoppingCart },
    { label: 'Total Suppliers', value: '89', change: '+5', trend: 'up', icon: Users },
    { label: 'Avg Response Time', value: '2.3h', change: '-15%', trend: 'down', icon: Clock },
    { label: 'Quality Score', value: '94.2%', change: '+2.1%', trend: 'up', icon: Shield },
    { label: 'Cost Savings', value: '$45.2K', change: '+8%', trend: 'up', icon: DollarSign },
    { label: 'On-Time Delivery', value: '96.8%', change: '+1.2%', trend: 'up', icon: CheckCircle }
  ];

  useEffect(() => {
    loadLiveData();
    const interval = setInterval(loadLiveData, 5000);
    return () => clearInterval(interval);
  }, [activeMetric]);

  const loadLiveData = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setLiveData({
        timestamp: new Date().toISOString(),
        metric: activeMetric
      });
      setRefreshing(false);
    }, 500);
  };

  const handleRefresh = () => {
    loadLiveData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
            >
              🎯 Cockpit Live
            </motion.h1>
            <p className="text-slate-600">Real-time procurement command center</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium
              bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg
              ${refreshing ? 'opacity-50' : ''}
            `}
            disabled={refreshing}
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {kpiCards.map((kpi, idx) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="w-5 h-5 text-blue-500" />
                {kpi.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-xs text-slate-600 mb-1">{kpi.label}</p>
              <p className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
          {metrics.map((metric, idx) => (
            <motion.button
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setActiveMetric(metric.id)}
              className={`
                p-4 rounded-xl transition-all text-left
                ${activeMetric === metric.id
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl scale-105'
                  : 'bg-white text-slate-700 hover:bg-blue-50 hover:shadow-lg'
                }
              `}
            >
              <metric.icon className="w-6 h-6 mb-2" />
              <p className="text-sm font-medium">{metric.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeMetric}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {metrics.find(m => m.id === activeMetric)?.label}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Activity className="w-4 h-4 animate-pulse text-green-500" />
                    Live
                  </div>
                </div>

                {/* Dynamic Content Based on Active Metric */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Real-Time Data</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Status</span>
                        <span className="flex items-center gap-2 text-green-600 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Last Updated</span>
                        <span className="text-slate-900 font-medium">Just now</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Data Points</span>
                        <span className="text-slate-900 font-medium">1,247</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">AI Insights</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Brain className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Optimization Opportunity</p>
                          <p className="text-xs text-slate-600">Potential 12% cost reduction identified</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-pink-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Performance Alert</p>
                          <p className="text-xs text-slate-600">3 suppliers exceeding targets</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-slate-50 rounded-xl p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Live Analytics Chart</p>
                    <p className="text-sm text-slate-400 mt-2">Real-time data visualization</p>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CockpitLive;
