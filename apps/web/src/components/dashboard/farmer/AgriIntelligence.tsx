"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, TrendingUp, Target, Zap, ShieldCheck, Globe, Activity,
  Cpu, Brain, ArrowUpRight, BarChart3, Eye, Database, LineChart,
  PieChart, TrendingDown, AlertTriangle, CheckCircle, Download,
  Calendar, MapPin, Users, DollarSign, Layers, Cloud
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MinimalHeader } from "./shared/MinimalHeader";
import toast from "react-hot-toast";

export default function AgriIntelligence() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'predictive-analytics', label: 'Predictive', icon: Brain },
    { id: 'market-trends', label: 'Market Trends', icon: TrendingUp },
    { id: 'yield-forecast', label: 'Yield Forecast', icon: Target },
    { id: 'resource-optimization', label: 'Resources', icon: Zap },
    { id: 'risk-assessment', label: 'Risk', icon: ShieldCheck },
    { id: 'benchmarking', label: 'Benchmarking', icon: BarChart3 },
    { id: 'recommendations', label: 'AI Insights', icon: Sparkles },
    { id: 'visualization', label: 'Visualization', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: Download }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Intelligence data refreshed');
    }, 1000);
  };

  const overviewStats = [
    { label: 'AI Accuracy', value: '98.2%', change: '+2.1%', icon: Brain, color: 'purple' },
    { label: 'Data Points', value: '14.2K', change: '+1.2K', icon: Database, color: 'blue' },
    { label: 'Predictions', value: '247', change: '+18', icon: Target, color: 'green' },
    { label: 'Revenue Impact', value: '₹24.8K', change: '+12%', icon: DollarSign, color: 'emerald' }
  ];

  const predictions = [
    { title: 'Crop Rotation', description: 'AI suggests rotating wheat with pulses', confidence: 92, impact: 'High' },
    { title: 'Irrigation Schedule', description: 'Optimize water usage by 25%', confidence: 88, impact: 'Medium' },
    { title: 'Harvest Timing', description: 'Best harvest window: Next 7 days', confidence: 95, impact: 'High' },
    { title: 'Fertilizer Mix', description: 'Adjust NPK ratio for better yield', confidence: 90, impact: 'High' }
  ];

  const yieldForecasts = [
    { crop: 'Tomatoes', current: 850, predicted: 920, unit: 'kg', confidence: 92, change: 8.2 },
    { crop: 'Wheat', current: 1200, predicted: 1350, unit: 'kg', confidence: 88, change: 12.5 },
    { crop: 'Rice', current: 980, predicted: 1050, unit: 'kg', confidence: 90, change: 7.1 },
    { crop: 'Corn', current: 750, predicted: 840, unit: 'kg', confidence: 87, change: 12.0 }
  ];

  const resourceOptimization = [
    { resource: 'Water', current: '1200 L/day', optimized: '900 L/day', savings: '25%', cost: '₹450' },
    { resource: 'Fertilizer', current: '45 kg/week', optimized: '38 kg/week', savings: '15%', cost: '₹280' },
    { resource: 'Energy', current: '180 kWh', optimized: '135 kWh', savings: '25%', cost: '₹360' },
    { resource: 'Labor', current: '40 hrs/week', optimized: '32 hrs/week', savings: '20%', cost: '₹800' }
  ];

  const riskAssessments = [
    { risk: 'Pest Infestation', level: 'Low', probability: 15, impact: 'Medium', action: 'Monitor weekly' },
    { risk: 'Water Shortage', level: 'Medium', probability: 45, impact: 'High', action: 'Install drip irrigation' },
    { risk: 'Price Volatility', level: 'High', probability: 72, impact: 'High', action: 'Lock in contracts' },
    { risk: 'Weather Damage', level: 'Low', probability: 22, impact: 'Medium', action: 'Use protective covers' }
  ];

  const benchmarkData = [
    { metric: 'Yield per Acre', yourFarm: 920, avgRegion: 780, avgNational: 850, unit: 'kg' },
    { metric: 'Water Efficiency', yourFarm: 85, avgRegion: 72, avgNational: 68, unit: '%' },
    { metric: 'Cost per Unit', yourFarm: 42, avgRegion: 55, avgNational: 58, unit: '₹' },
    { metric: 'Quality Score', yourFarm: 92, avgRegion: 78, avgNational: 75, unit: '/100' }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">Agri-Intelligence.</h2>
              <Badge tone="brand" className="h-8 px-4 rounded-xl font-black gap-2 uppercase text-[9px]">
                <Sparkles size={14} className="animate-pulse" />
                AI POWERED
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              AI-powered analytics and insights for smarter farming
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

        <div className="w-full bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white shadow-lg scale-105'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-200 min-h-[600px]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {overviewStats.map((stat, i) => (
                    <Card key={i} className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                      <div className="flex items-center justify-between mb-4">
                        <stat.icon size={24} className={`text-${stat.color}-600`} />
                        <TrendingUp size={20} className="text-green-600" />
                      </div>
                      <p className="text-sm font-bold text-slate-400 uppercase mb-2">{stat.label}</p>
                      <p className="text-3xl font-black text-slate-900 mb-2">{stat.value}</p>
                      <span className="text-sm font-bold text-green-600">{stat.change}</span>
                    </Card>
                  ))}
                </div>

                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Brain size={32} className="text-purple-600" />
                    AI Intelligence Dashboard
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="text-lg font-black text-slate-900 mb-4">Top Predictions</h4>
                      <div className="space-y-3">
                        {predictions.slice(0, 3).map((pred, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <CheckCircle size={20} className="text-green-600" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900">{pred.title}</p>
                              <p className="text-xs text-slate-600">{pred.confidence}% confidence</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="text-lg font-black text-slate-900 mb-4">Quick Insights</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded-xl">
                          <p className="text-sm font-bold text-green-900">Yield up 12% this season</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <p className="text-sm font-bold text-blue-900">Water savings: 25%</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl">
                          <p className="text-sm font-bold text-purple-900">Cost reduction: ₹1,890</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'predictive-analytics' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Brain size={32} className="text-purple-600" />
                    AI Predictions & Insights
                  </h3>
                  <div className="space-y-4">
                    {predictions.map((pred, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                              <Sparkles size={32} className="text-white" />
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-slate-900 mb-1">{pred.title}</h4>
                              <p className="text-slate-600 font-medium">{pred.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-black text-purple-600 mb-1">{pred.confidence}%</p>
                            <p className="text-xs text-slate-400 font-bold">Confidence</p>
                            <Badge tone="brand" className="mt-2">{pred.impact} Impact</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'market-trends' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <LineChart size={32} className="text-blue-600" />
                    Market Trend Analysis
                  </h3>
                  <div className="grid grid-cols-7 gap-3 mb-8">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                      const heights = [60, 75, 85, 90, 95, 100, 105];
                      const prices = [2400, 2450, 2500, 2550, 2600, 2650, 2700];
                      return (
                        <div key={idx} className="text-center bg-white rounded-2xl p-4">
                          <p className="text-xs font-bold text-slate-400 mb-3">{day}</p>
                          <div 
                            className="bg-gradient-to-t from-blue-500 to-cyan-500 rounded-xl mx-auto" 
                            style={{ height: `${heights[idx]}px`, width: '40px' }} 
                          />
                          <p className="text-lg font-black text-slate-900 mt-3">₹{prices[idx]}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6">
                      <TrendingUp size={32} className="text-green-600 mb-3" />
                      <p className="text-sm font-bold text-slate-400 uppercase mb-2">Price Trend</p>
                      <p className="text-3xl font-black text-green-600">+12.5%</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6">
                      <Activity size={32} className="text-blue-600 mb-3" />
                      <p className="text-sm font-bold text-slate-400 uppercase mb-2">Market Volume</p>
                      <p className="text-3xl font-black text-blue-600">High</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6">
                      <Users size={32} className="text-purple-600 mb-3" />
                      <p className="text-sm font-bold text-slate-400 uppercase mb-2">Active Buyers</p>
                      <p className="text-3xl font-black text-purple-600">156</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'yield-forecast' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Target size={32} className="text-green-600" />
                    Yield Predictions by Crop
                  </h3>
                  <div className="space-y-4">
                    {yieldForecasts.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-2xl font-black text-slate-900">{item.crop}</h4>
                          <Badge tone="brand" className="text-sm">+{item.change}%</Badge>
                        </div>
                        <div className="flex items-center gap-8 mb-4">
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Current Yield</p>
                            <p className="text-3xl font-black text-slate-900">{item.current} {item.unit}</p>
                          </div>
                          <ArrowUpRight size={32} className="text-green-600" />
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Predicted Yield</p>
                            <p className="text-3xl font-black text-green-600">{item.predicted} {item.unit}</p>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" 
                            style={{ width: `${item.confidence}%` }} 
                          />
                        </div>
                        <p className="text-sm font-bold text-slate-600 mt-2">Confidence: {item.confidence}%</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'resource-optimization' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Zap size={32} className="text-orange-600" />
                    Resource Optimization Recommendations
                  </h3>
                  <div className="space-y-4">
                    {resourceOptimization.map((resource, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-2xl font-black text-slate-900">{resource.resource}</h4>
                          <div className="text-right">
                            <p className="text-3xl font-black text-green-600">{resource.savings}</p>
                            <p className="text-sm font-bold text-slate-400">Savings</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Current Usage</p>
                            <p className="text-xl font-black text-slate-900">{resource.current}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Optimized Usage</p>
                            <p className="text-xl font-black text-blue-600">{resource.optimized}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Cost Savings</p>
                            <p className="text-xl font-black text-green-600">{resource.cost}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'risk-assessment' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-red-50 to-rose-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <ShieldCheck size={32} className="text-red-600" />
                    Risk Assessment & Mitigation
                  </h3>
                  <div className="space-y-4">
                    {riskAssessments.map((risk, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${
                              risk.level === 'High' ? 'bg-red-100' :
                              risk.level === 'Medium' ? 'bg-yellow-100' :
                              'bg-green-100'
                            }`}>
                              <AlertTriangle size={32} className={
                                risk.level === 'High' ? 'text-red-600' :
                                risk.level === 'Medium' ? 'text-yellow-600' :
                                'text-green-600'
                              } />
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-slate-900 mb-1">{risk.risk}</h4>
                              <p className="text-sm font-bold text-slate-600">Impact: {risk.impact}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge tone={risk.level === 'High' ? 'destructive' : 'brand'} className="mb-2">
                              {risk.level} Risk
                            </Badge>
                            <p className="text-3xl font-black text-slate-900">{risk.probability}%</p>
                            <p className="text-xs text-slate-400 font-bold">Probability</p>
                          </div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <p className="text-sm font-bold text-blue-900">Recommended Action: {risk.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'benchmarking' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-cyan-50 to-teal-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <BarChart3 size={32} className="text-cyan-600" />
                    Performance Benchmarking
                  </h3>
                  <div className="space-y-6">
                    {benchmarkData.map((metric, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <h4 className="text-xl font-black text-slate-900 mb-6">{metric.metric}</h4>
                        <div className="grid grid-cols-3 gap-6">
                          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Your Farm</p>
                            <p className="text-4xl font-black text-green-600 mb-1">{metric.yourFarm}</p>
                            <p className="text-xs font-bold text-slate-600">{metric.unit}</p>
                          </div>
                          <div className="text-center p-6 bg-slate-50 rounded-2xl">
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Regional Avg</p>
                            <p className="text-4xl font-black text-slate-900 mb-1">{metric.avgRegion}</p>
                            <p className="text-xs font-bold text-slate-600">{metric.unit}</p>
                          </div>
                          <div className="text-center p-6 bg-slate-50 rounded-2xl">
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">National Avg</p>
                            <p className="text-4xl font-black text-slate-900 mb-1">{metric.avgNational}</p>
                            <p className="text-xs font-bold text-slate-600">{metric.unit}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Sparkles size={32} className="text-indigo-600" />
                    AI-Powered Recommendations
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                          <CheckCircle size={32} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-900 mb-2">Increase Tomato Planting</h4>
                          <p className="text-slate-600 font-medium mb-3">Market analysis shows 25% price increase expected. Recommend increasing tomato cultivation by 30%.</p>
                          <Badge tone="brand">High Priority</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shrink-0">
                          <Zap size={32} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-900 mb-2">Optimize Irrigation Schedule</h4>
                          <p className="text-slate-600 font-medium mb-3">AI detected water wastage. Switch to drip irrigation to save 25% water and reduce costs by ₹450/month.</p>
                          <Badge tone="brand">Medium Priority</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shrink-0">
                          <Target size={32} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-900 mb-2">Adjust Fertilizer Mix</h4>
                          <p className="text-slate-600 font-medium mb-3">Soil analysis suggests increasing nitrogen by 15% and reducing phosphorus by 10% for optimal yield.</p>
                          <Badge tone="brand">High Priority</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'visualization' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <PieChart size={32} className="text-pink-600" />
                    Data Visualization Dashboard
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-8">
                      <h4 className="text-xl font-black text-slate-900 mb-6">Crop Distribution</h4>
                      <div className="space-y-4">
                        {[
                          { crop: 'Tomatoes', percentage: 35, color: 'red' },
                          { crop: 'Wheat', percentage: 28, color: 'amber' },
                          { crop: 'Rice', percentage: 22, color: 'green' },
                          { crop: 'Corn', percentage: 15, color: 'yellow' }
                        ].map((item, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-slate-900">{item.crop}</span>
                              <span className="text-sm font-bold text-slate-600">{item.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3">
                              <div 
                                className={`bg-${item.color}-500 h-3 rounded-full`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-8">
                      <h4 className="text-xl font-black text-slate-900 mb-6">Resource Usage</h4>
                      <div className="space-y-4">
                        {[
                          { resource: 'Water', usage: 75, color: 'blue' },
                          { resource: 'Fertilizer', usage: 62, color: 'green' },
                          { resource: 'Energy', usage: 58, color: 'yellow' },
                          { resource: 'Labor', usage: 80, color: 'purple' }
                        ].map((item, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-slate-900">{item.resource}</span>
                              <span className="text-sm font-bold text-slate-600">{item.usage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3">
                              <div 
                                className={`bg-${item.color}-500 h-3 rounded-full`}
                                style={{ width: `${item.usage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Download size={32} className="text-slate-600" />
                    Export Analytics & Reports
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: 'Monthly Performance Report', description: 'Complete analysis of farm performance', format: 'PDF' },
                      { title: 'Yield Forecast Report', description: 'AI-powered yield predictions', format: 'Excel' },
                      { title: 'Resource Optimization Report', description: 'Detailed resource usage analysis', format: 'PDF' },
                      { title: 'Risk Assessment Report', description: 'Comprehensive risk analysis', format: 'PDF' },
                      { title: 'Market Trends Report', description: 'Market analysis and trends', format: 'Excel' },
                      { title: 'Benchmarking Report', description: 'Performance comparison report', format: 'PDF' }
                    ].map((report, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all cursor-pointer">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shrink-0">
                            <Download size={24} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-black text-slate-900 mb-2">{report.title}</h4>
                            <p className="text-sm text-slate-600 font-medium mb-3">{report.description}</p>
                            <Badge tone="brand">{report.format}</Badge>
                          </div>
                        </div>
                        <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-black">
                          Download Report
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
