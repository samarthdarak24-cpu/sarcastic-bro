'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sprout, Package, ShieldCheck, TrendingUp, Target, Zap,
  BarChart3, Eye, Layers, RefreshCw, Calendar, AlertTriangle,
  CheckCircle, Award, Sparkles, Activity, LineChart, PieChart
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

// Import existing crop-related components
import { SmartInventoryHub } from './SmartInventoryHub';
import { CropQualityDetector } from './CropQualityDetector';
import FarmInsights from './FarmInsights';
import AIPriceAdvisor from './AIPriceAdvisor';
import { AutoSellSettings } from './AutoSellSettings';

export default function CropManagementHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Agri Hub Overview', icon: Layers },
    { id: 'inventory', label: 'Smart Inventory', icon: Package },
    { id: 'quality', label: 'Quality Scanner', icon: ShieldCheck },
    { id: 'insights', label: 'Farm Insights', icon: BarChart3 },
    { id: 'pricing', label: 'AI Price Advisor', icon: TrendingUp },
    { id: 'auto-sell', label: 'Auto-Sell Rules', icon: Zap },
  ];

  // Mock crop data
  const cropSummary = {
    totalCrops: 8,
    activeCrops: 6,
    totalQuantity: 12500,
    totalValue: 456780,
    avgQuality: 92.5,
    readyForHarvest: 3,
  };

  const cropsByCategory = [
    { category: 'Vegetables', count: 3, value: 145000, color: 'green' },
    { category: 'Grains', count: 2, value: 198000, color: 'amber' },
    { category: 'Fruits', count: 2, value: 89000, color: 'red' },
    { category: 'Pulses', count: 1, value: 24780, color: 'purple' },
  ];

  const topCrops = [
    { name: 'Tomatoes', quantity: 2500, unit: 'kg', value: 112500, quality: 95, status: 'excellent', trend: '+12%' },
    { name: 'Wheat', quantity: 5000, unit: 'kg', value: 140000, quality: 88, status: 'good', trend: '+8%' },
    { name: 'Rice', quantity: 3000, unit: 'kg', value: 156000, quality: 90, status: 'excellent', trend: '+15%' },
    { name: 'Cotton', quantity: 1500, unit: 'kg', value: 142500, quality: 92, status: 'excellent', trend: '+10%' },
  ];

  const recentActivities = [
    { icon: Package, title: 'New Crop Added', desc: 'Basmati Rice - 500kg', time: '2 hours ago', color: 'blue' },
    { icon: ShieldCheck, title: 'Quality Check', desc: 'Tomatoes - Grade A+', time: '4 hours ago', color: 'green' },
    { icon: TrendingUp, title: 'Price Alert', desc: 'Wheat price increased 8%', time: '6 hours ago', color: 'amber' },
    { icon: CheckCircle, title: 'Harvest Complete', desc: 'Cotton - 300kg harvested', time: '1 day ago', color: 'emerald' },
  ];

  const qualityDistribution = [
    { grade: 'A+', count: 3, percentage: 37.5, color: 'green' },
    { grade: 'A', count: 3, percentage: 37.5, color: 'blue' },
    { grade: 'B+', count: 2, percentage: 25, color: 'amber' },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Crop data refreshed');
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">Crop Management Hub.</h2>
              <Badge tone="brand" className="h-8 px-4 rounded-xl font-black gap-2 uppercase text-[9px]">
                <Sprout size={14} />
                ALL-IN-ONE
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              Complete crop inventory, quality & insights
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-12 px-6 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-black border-2 border-slate-200"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin mr-2' : 'mr-2'} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="w-full bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-200 min-h-[600px]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem]">
                    <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                      <Sprout size={24} className="text-white" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 mb-1">{cropSummary.totalCrops}</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">Total Crops</p>
                  </Card>

                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem]">
                    <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                      <Activity size={24} className="text-white" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 mb-1">{cropSummary.activeCrops}</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">Active Crops</p>
                  </Card>

                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem]">
                    <div className="h-12 w-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                      <Package size={24} className="text-white" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 mb-1">{(cropSummary.totalQuantity / 1000).toFixed(1)}K</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">Total Quantity</p>
                  </Card>

                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem]">
                    <div className="h-12 w-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4">
                      <TrendingUp size={24} className="text-white" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 mb-1">₹{(cropSummary.totalValue / 1000).toFixed(0)}K</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">Total Value</p>
                  </Card>

                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[2rem]">
                    <div className="h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
                      <ShieldCheck size={24} className="text-white" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 mb-1">{cropSummary.avgQuality}%</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">Avg Quality</p>
                  </Card>

                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-rose-50 to-red-50 rounded-[2rem]">
                    <div className="h-12 w-12 bg-rose-500 rounded-xl flex items-center justify-center mb-4">
                      <Calendar size={24} className="text-white" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 mb-1">{cropSummary.readyForHarvest}</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">Ready to Harvest</p>
                  </Card>
                </div>

                {/* Crops by Category & Top Crops */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Crops by Category */}
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Crops by Category</h3>
                    <div className="space-y-4">
                      {cropsByCategory.map((cat, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 bg-${cat.color}-100 rounded-lg flex items-center justify-center`}>
                                <Layers size={20} className={`text-${cat.color}-600`} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{cat.category}</p>
                                <p className="text-xs text-slate-500">{cat.count} crops</p>
                              </div>
                            </div>
                            <p className="font-black text-lg text-slate-900">₹{(cat.value / 1000).toFixed(0)}K</p>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-${cat.color}-500 rounded-full`}
                              style={{ width: `${(cat.value / cropSummary.totalValue) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Top Performing Crops */}
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Top Performing Crops</h3>
                    <div className="space-y-3">
                      {topCrops.map((crop, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Sprout size={20} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{crop.name}</p>
                              <p className="text-xs text-slate-500">{crop.quantity} {crop.unit}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-900">₹{(crop.value / 1000).toFixed(0)}K</p>
                            <div className="flex items-center gap-2 justify-end">
                              <Badge tone="brand" className="text-xs">{crop.quality}%</Badge>
                              <span className="text-xs font-bold text-green-600">{crop.trend}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Quality Distribution & Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quality Distribution */}
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2rem]">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Quality Distribution</h3>
                    <div className="space-y-4">
                      {qualityDistribution.map((grade, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Award size={20} className={`text-${grade.color}-600`} />
                              <span className="font-bold text-slate-900">Grade {grade.grade}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-600">{grade.count} crops</span>
                              <span className="text-sm font-black text-slate-900">{grade.percentage}%</span>
                            </div>
                          </div>
                          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-${grade.color}-500 rounded-full`}
                              style={{ width: `${grade.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Recent Activities */}
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Recent Activities</h3>
                    <div className="space-y-3">
                      {recentActivities.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className={`h-10 w-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center shrink-0`}>
                            <activity.icon size={20} className={`text-${activity.color}-600`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-sm">{activity.title}</p>
                            <p className="text-xs text-slate-600">{activity.desc}</p>
                            <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem]">
                  <h3 className="text-xl font-black text-slate-900 mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: Package, label: 'Add New Crop', color: 'green', tab: 'inventory' },
                      { icon: ShieldCheck, label: 'Quality Scan', color: 'blue', tab: 'quality' },
                      { icon: BarChart3, label: 'View Insights', color: 'purple', tab: 'insights' },
                      { icon: Zap, label: 'Auto-Sell Setup', color: 'amber', tab: 'auto-sell' },
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTab(action.tab)}
                        className="flex flex-col items-center gap-3 p-6 bg-white hover:bg-slate-50 rounded-2xl transition-all hover:shadow-lg"
                      >
                        <div className={`h-14 w-14 bg-${action.color}-100 rounded-xl flex items-center justify-center`}>
                          <action.icon size={28} className={`text-${action.color}-600`} />
                        </div>
                        <span className="font-bold text-slate-900 text-sm text-center">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'inventory' && <SmartInventoryHub />}
            {activeTab === 'quality' && <CropQualityDetector />}
            {activeTab === 'insights' && <FarmInsights />}
            {activeTab === 'pricing' && <AIPriceAdvisor />}
            {activeTab === 'auto-sell' && <AutoSellSettings />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
