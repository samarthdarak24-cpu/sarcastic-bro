"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, Users, TrendingUp, Brain, Activity, Zap, ShieldCheck,
  AlertCircle, Eye, BarChart3, Sparkles, CheckCircle,
  TrendingDown, ArrowUpRight, PieChart, UserCheck
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MinimalHeader } from "./shared/MinimalHeader";
import toast from "react-hot-toast";

export function BehavioralInsights() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'segmentation', label: 'Segmentation', icon: Target },
    { id: 'engagement', label: 'Engagement', icon: Users },
    { id: 'conversion', label: 'Conversion', icon: Zap },
    { id: 'retention', label: 'Retention', icon: ShieldCheck },
    { id: 'churn', label: 'Churn Predict', icon: AlertCircle },
    { id: 'recommendations', label: 'Recommendations', icon: Brain },
    { id: 'ab-testing', label: 'A/B Testing', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'insights', label: 'AI Insights', icon: Sparkles }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Insights refreshed');
    }, 1000);
  };

  const segments = [
    { name: 'Premium Buyers', count: 45, value: '₹12.4L', growth: 18, color: 'purple' },
    { name: 'Regular Buyers', count: 128, value: '₹8.2L', growth: 12, color: 'blue' },
    { name: 'Occasional Buyers', count: 74, value: '₹3.1L', growth: -5, color: 'amber' }
  ];

  const engagementMetrics = [
    { metric: 'Page Views', value: '24.5K', change: '+15%', trend: 'up' },
    { metric: 'Time on Site', value: '4.2 min', change: '+8%', trend: 'up' },
    { metric: 'Interactions', value: '1,847', change: '+22%', trend: 'up' },
    { metric: 'Return Rate', value: '64%', change: '+5%', trend: 'up' }
  ];

  const churnRisks = [
    { buyer: 'ABC Traders', risk: 'High', score: 85, lastOrder: '45 days ago', value: '₹2.4L' },
    { buyer: 'XYZ Mills', risk: 'Medium', score: 62, lastOrder: '28 days ago', value: '₹1.8L' },
    { buyer: 'Fresh Mart', risk: 'Low', score: 28, lastOrder: '5 days ago', value: '₹3.2L' }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <MinimalHeader title="Behavioral Insights" loading={refreshing} />
      
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
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
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <Users size={32} className="text-blue-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Active Buyers</p>
                    <p className="text-3xl font-black text-slate-900">247</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <Target size={32} className="text-purple-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Segments</p>
                    <p className="text-3xl font-black text-slate-900">3</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <CheckCircle size={32} className="text-green-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Retention Rate</p>
                    <p className="text-3xl font-black text-slate-900">64%</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <Brain size={32} className="text-indigo-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">AI Accuracy</p>
                    <p className="text-3xl font-black text-slate-900">98%</p>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'segmentation' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Target size={32} className="text-purple-600" />
                    Customer Segmentation
                  </h3>
                  <div className="space-y-4">
                    {segments.map((segment, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">{segment.name}</h4>
                            <p className="text-sm font-bold text-slate-600">{segment.count} buyers</p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-black text-slate-900 mb-2">{segment.value}</p>
                            <div className="flex items-center gap-2 justify-end">
                              {segment.growth > 0 ? <TrendingUp size={20} className="text-green-600" /> : <TrendingDown size={20} className="text-red-600" />}
                              <span className={`text-lg font-black ${segment.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {segment.growth > 0 ? '+' : ''}{segment.growth}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'engagement' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {engagementMetrics.map((metric, i) => (
                    <Card key={i} className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-2">{metric.metric}</p>
                      <p className="text-3xl font-black text-slate-900 mb-2">{metric.value}</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-sm font-bold text-green-600">{metric.change}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'conversion' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Zap size={32} className="text-amber-600" />
                    Conversion Funnel
                  </h3>
                  <div className="space-y-4">
                    {[
                      { stage: 'Visitors', count: 1250, rate: 100 },
                      { stage: 'Product Views', count: 890, rate: 71 },
                      { stage: 'Add to Cart', count: 445, rate: 36 },
                      { stage: 'Checkout', count: 312, rate: 25 },
                      { stage: 'Purchase', count: 247, rate: 20 }
                    ].map((stage, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xl font-black text-slate-900">{stage.stage}</h4>
                          <Badge tone="brand">{stage.rate}%</Badge>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-4 rounded-full"
                            style={{ width: `${stage.rate}%` }}
                          />
                        </div>
                        <p className="text-sm font-bold text-slate-600 mt-2">{stage.count} users</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'retention' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <ShieldCheck size={32} className="text-green-600" />
                    Retention Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-3">30-Day Retention</p>
                      <p className="text-5xl font-black text-green-600 mb-2">78%</p>
                      <TrendingUp size={24} className="text-green-600 mx-auto" />
                    </div>
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-3">60-Day Retention</p>
                      <p className="text-5xl font-black text-blue-600 mb-2">64%</p>
                      <TrendingUp size={24} className="text-blue-600 mx-auto" />
                    </div>
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-3">90-Day Retention</p>
                      <p className="text-5xl font-black text-purple-600 mb-2">52%</p>
                      <CheckCircle size={24} className="text-purple-600 mx-auto" />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'churn' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-red-50 to-rose-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <AlertCircle size={32} className="text-red-600" />
                    Churn Risk Prediction
                  </h3>
                  <div className="space-y-4">
                    {churnRisks.map((buyer, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">{buyer.buyer}</h4>
                            <p className="text-sm font-bold text-slate-600">Last order: {buyer.lastOrder}</p>
                          </div>
                          <Badge tone={buyer.risk === 'High' ? 'destructive' : buyer.risk === 'Medium' ? 'amber' : 'brand'}>
                            {buyer.risk} Risk
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Churn Score</p>
                            <p className="text-3xl font-black text-red-600">{buyer.score}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Lifetime Value</p>
                            <p className="text-3xl font-black text-slate-900">{buyer.value}</p>
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
                    <Brain size={32} className="text-indigo-600" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Target Premium Segment', description: 'Focus on premium buyers - 18% growth potential', priority: 'High' },
                      { title: 'Re-engage Inactive Buyers', description: 'Send personalized offers to 45 inactive buyers', priority: 'Medium' },
                      { title: 'Optimize Pricing', description: 'Adjust prices for regular segment to increase conversion', priority: 'High' }
                    ].map((rec, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-black text-slate-900 mb-2">{rec.title}</h4>
                            <p className="text-slate-600 font-medium">{rec.description}</p>
                          </div>
                          <Badge tone={rec.priority === 'High' ? 'brand' : 'amber'}>{rec.priority}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'ab-testing' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Eye size={32} className="text-cyan-600" />
                    A/B Test Results
                  </h3>
                  <div className="space-y-4">
                    {[
                      { test: 'Pricing Strategy A vs B', winner: 'B', improvement: 12, metric: 'Conversion' },
                      { test: 'Product Display Layout', winner: 'A', improvement: 8, metric: 'Engagement' },
                      { test: 'Checkout Flow', winner: 'B', improvement: 15, metric: 'Completion' }
                    ].map((test, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <h4 className="text-xl font-black text-slate-900 mb-4">{test.test}</h4>
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Winner</p>
                            <p className="text-3xl font-black text-green-600">Variant {test.winner}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Improvement</p>
                            <p className="text-3xl font-black text-blue-600">+{test.improvement}%</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Metric</p>
                            <p className="text-xl font-black text-slate-900">{test.metric}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Total Revenue</p>
                    <p className="text-3xl font-black text-slate-900 mb-2">₹23.7L</p>
                    <TrendingUp size={16} className="text-green-600" />
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Avg Order Value</p>
                    <p className="text-3xl font-black text-slate-900 mb-2">₹9,600</p>
                    <TrendingUp size={16} className="text-green-600" />
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Customer LTV</p>
                    <p className="text-3xl font-black text-slate-900 mb-2">₹45K</p>
                    <CheckCircle size={16} className="text-green-600" />
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Sparkles size={32} className="text-pink-600" />
                    AI-Generated Insights
                  </h3>
                  <div className="space-y-4">
                    {[
                      { insight: 'Premium buyers show 3x higher lifetime value', confidence: 94 },
                      { insight: 'Weekend purchases have 22% higher cart value', confidence: 88 },
                      { insight: 'Mobile users convert 15% better with simplified checkout', confidence: 91 }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <div className="flex items-start justify-between">
                          <p className="text-lg font-black text-slate-900 flex-1">{item.insight}</p>
                          <div className="text-right ml-4">
                            <p className="text-3xl font-black text-pink-600">{item.confidence}%</p>
                            <p className="text-xs font-bold text-slate-400">Confidence</p>
                          </div>
                        </div>
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
