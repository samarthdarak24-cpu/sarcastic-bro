"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, TrendingDown, DollarSign, Target, Users, 
  Calendar, Bell, BarChart3, Zap, Brain, AlertCircle,
  ArrowUpRight, ArrowDownRight, Activity, Sparkles, RefreshCw,
  CheckCircle, LineChart, PieChart, Globe
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function AIPriceAdvisor() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'market-intelligence', label: 'Market Intel', icon: Brain },
    { id: 'pricing-strategy', label: 'Strategy', icon: Target },
    { id: 'competitors', label: 'Competitors', icon: Users },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'negotiation', label: 'Negotiation', icon: Zap },
    { id: 'seasonal', label: 'Seasonal', icon: Calendar },
    { id: 'bulk-pricing', label: 'Bulk Pricing', icon: BarChart3 },
    { id: 'sentiment', label: 'Sentiment', icon: Sparkles },
    { id: 'alerts', label: 'Alerts', icon: Bell }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Data refreshed');
    }, 1000);
  };

  const overviewStats = [
    { label: 'Current Price', value: '₹2,450', change: '+12.5%', trend: 'up', icon: DollarSign },
    { label: 'AI Recommended', value: '₹2,680', change: '94% conf', trend: 'up', icon: Brain },
    { label: 'Market Avg', value: '₹2,380', change: '+8.2%', trend: 'up', icon: Globe },
    { label: 'Profit Potential', value: '₹230', change: 'Per unit', trend: 'up', icon: TrendingUp }
  ];

  const competitors = [
    { name: 'Farm A', price: 2400, quality: 'High', distance: '12 km', trend: 'stable', rating: 4.5 },
    { name: 'Farm B', price: 2550, quality: 'Premium', distance: '8 km', trend: 'up', rating: 4.8 },
    { name: 'Farm C', price: 2300, quality: 'Medium', distance: '15 km', trend: 'down', rating: 4.2 },
    { name: 'Farm D', price: 2480, quality: 'High', distance: '10 km', trend: 'stable', rating: 4.6 }
  ];

  const forecastData = [
    { day: 'Mon', price: 2450, demand: 'High' },
    { day: 'Tue', price: 2480, demand: 'High' },
    { day: 'Wed', price: 2520, demand: 'Very High' },
    { day: 'Thu', price: 2550, demand: 'Very High' },
    { day: 'Fri', price: 2580, demand: 'High' },
    { day: 'Sat', price: 2600, demand: 'Medium' },
    { day: 'Sun', price: 2620, demand: 'Medium' }
  ];

  const seasonalPatterns = [
    { season: 'Summer', avgPrice: 2800, demand: 'Very High', bestCrops: 'Tomatoes, Cucumbers' },
    { season: 'Monsoon', avgPrice: 2200, demand: 'Medium', bestCrops: 'Rice, Leafy Greens' },
    { season: 'Winter', avgPrice: 2500, demand: 'High', bestCrops: 'Wheat, Carrots' },
    { season: 'Spring', avgPrice: 2600, demand: 'High', bestCrops: 'Strawberries, Peas' }
  ];

  const bulkPricingTiers = [
    { quantity: '0-100 kg', price: 2680, discount: '0%', savings: 0 },
    { quantity: '101-500 kg', price: 2550, discount: '5%', savings: 130 },
    { quantity: '501-1000 kg', price: 2410, discount: '10%', savings: 270 },
    { quantity: '1000+ kg', price: 2280, discount: '15%', savings: 400 }
  ];

  const priceAlerts = [
    { type: 'success', message: 'Price increased by 12% - Good time to sell!', time: '2 mins ago' },
    { type: 'warning', message: 'Competitor dropped price by 5%', time: '15 mins ago' },
    { type: 'info', message: 'High demand predicted for next 48 hours', time: '1 hour ago' },
    { type: 'success', message: 'Your price is 8% above market average', time: '3 hours ago' }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">AI Price Advisor.</h2>
              <Badge tone="brand" className="h-8 px-4 rounded-xl font-black gap-2 uppercase text-[9px]">
                <Sparkles size={14} className="animate-pulse" />
                AI POWERED
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              Intelligent pricing powered by machine learning
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
                        <stat.icon size={24} className="text-blue-600" />
                        {stat.trend === 'up' && <TrendingUp size={20} className="text-green-600" />}
                      </div>
                      <p className="text-sm font-bold text-slate-400 uppercase mb-2">{stat.label}</p>
                      <p className="text-3xl font-black text-slate-900 mb-2">{stat.value}</p>
                      <span className="text-sm font-bold text-green-600">{stat.change}</span>
                    </Card>
                  ))}
                </div>

                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Brain size={32} className="text-blue-600" />
                    AI Market Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl">
                      <TrendingUp size={24} className="text-green-600 mt-1" />
                      <div>
                        <p className="text-lg font-black text-slate-900">Strong Demand Detected</p>
                        <p className="text-slate-600 font-medium">Market demand increased by 18% in your region</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl">
                      <Users size={24} className="text-blue-600 mt-1" />
                      <div>
                        <p className="text-lg font-black text-slate-900">Buyer Competition High</p>
                        <p className="text-slate-600 font-medium">23 active buyers looking for similar products</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl">
                      <Calendar size={24} className="text-purple-600 mt-1" />
                      <div>
                        <p className="text-lg font-black text-slate-900">Optimal Selling Window</p>
                        <p className="text-slate-600 font-medium">Next 5-7 days predicted as best time to sell</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'market-intelligence' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[3rem]">
                    <Activity size={48} className="text-blue-600 mb-4" />
                    <p className="text-sm text-slate-600 mb-2">Current Market Price</p>
                    <p className="text-4xl font-black text-slate-900 mb-2">₹2,450</p>
                    <div className="flex items-center gap-2">
                      <ArrowUpRight size={16} className="text-green-600" />
                      <span className="text-sm font-bold text-green-600">+12.5% vs last week</span>
                    </div>
                  </Card>
                  <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem]">
                    <Target size={48} className="text-purple-600 mb-4" />
                    <p className="text-sm text-slate-600 mb-2">AI Recommended Price</p>
                    <p className="text-4xl font-black text-slate-900 mb-2">₹2,680</p>
                    <span className="text-sm font-bold text-purple-600">94% confidence</span>
                  </Card>
                  <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                    <DollarSign size={48} className="text-green-600 mb-4" />
                    <p className="text-sm text-slate-600 mb-2">Potential Extra Profit</p>
                    <p className="text-4xl font-black text-slate-900 mb-2">₹230</p>
                    <span className="text-sm font-bold text-green-600">Per unit sold</span>
                  </Card>
                </div>

                <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6">Real-time Market Insights</h3>
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp size={24} className="text-green-600" />
                        <span className="text-lg font-black text-slate-900">Price Surge Alert</span>
                      </div>
                      <p className="text-slate-600 font-medium">Tomato prices up 15% due to supply shortage in neighboring states</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe size={24} className="text-blue-600" />
                        <span className="text-lg font-black text-slate-900">Regional Demand</span>
                      </div>
                      <p className="text-slate-600 font-medium">High demand detected in Mumbai, Delhi, and Bangalore markets</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Activity size={24} className="text-amber-600" />
                        <span className="text-lg font-black text-slate-900">Market Activity</span>
                      </div>
                      <p className="text-slate-600 font-medium">156 transactions in last 24 hours, avg price ₹2,420</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'pricing-strategy' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Target size={32} className="text-indigo-600" />
                    Recommended Pricing Strategies
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-8 border-4 border-indigo-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap size={28} className="text-yellow-500" />
                        <span className="text-xl font-black text-slate-900">Premium Strategy</span>
                        <Badge tone="brand" className="ml-auto">Recommended</Badge>
                      </div>
                      <p className="text-4xl font-black text-indigo-600 mb-4">₹2,680</p>
                      <p className="text-slate-600 font-medium mb-6">Target high-value buyers with quality premium</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle size={20} className="text-green-600" />
                          <span className="text-sm font-bold text-slate-900">Expected profit: +₹230/unit</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle size={20} className="text-green-600" />
                          <span className="text-sm font-bold text-slate-900">Success rate: 87%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle size={20} className="text-green-600" />
                          <span className="text-sm font-bold text-slate-900">Best for: Premium buyers</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <BarChart3 size={28} className="text-blue-600" />
                        <span className="text-xl font-black text-slate-900">Volume Strategy</span>
                      </div>
                      <p className="text-4xl font-black text-blue-600 mb-4">₹2,350</p>
                      <p className="text-slate-600 font-medium mb-6">Competitive pricing for faster turnover</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle size={20} className="text-green-600" />
                          <span className="text-sm font-bold text-slate-900">Expected profit: +₹100/unit</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle size={20} className="text-green-600" />
                          <span className="text-sm font-bold text-slate-900">Success rate: 95%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle size={20} className="text-green-600" />
                          <span className="text-sm font-bold text-slate-900">Best for: Quick sales</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'competitors' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-orange-50 to-red-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Users size={32} className="text-orange-600" />
                    Competitor Price Analysis
                  </h3>
                  <div className="space-y-4">
                    {competitors.map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-6 bg-white rounded-2xl">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                            {comp.name.charAt(comp.name.length - 1)}
                          </div>
                          <div>
                            <p className="text-xl font-black text-slate-900">{comp.name}</p>
                            <p className="text-sm text-slate-600 font-bold">{comp.distance} away • {comp.quality} quality</p>
                            <div className="flex items-center gap-2 mt-2">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className={`h-2 w-2 rounded-full ${i < comp.rating ? 'bg-yellow-500' : 'bg-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-slate-900">₹{comp.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {comp.trend === 'up' && <TrendingUp size={16} className="text-green-600" />}
                            {comp.trend === 'down' && <TrendingDown size={16} className="text-red-600" />}
                            <span className="text-sm font-bold text-slate-600 capitalize">{comp.trend}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'forecast' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <TrendingUp size={32} className="text-cyan-600" />
                    7-Day Price Forecast
                  </h3>
                  <div className="grid grid-cols-7 gap-3">
                    {forecastData.map((day, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-4 text-center">
                        <p className="text-xs font-bold text-slate-400 mb-3">{day.day}</p>
                        <p className="text-xl font-black text-slate-900 mb-3">₹{day.price}</p>
                        <div 
                          className="bg-gradient-to-t from-cyan-500 to-blue-500 rounded-xl mx-auto" 
                          style={{ height: `${60 + idx * 10}px`, width: '40px' }} 
                        />
                        <p className="text-xs font-bold text-slate-600 mt-3">{day.demand}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-6 bg-white rounded-2xl">
                    <div className="flex items-start gap-4">
                      <Brain size={32} className="text-blue-600 mt-1" />
                      <div>
                        <p className="text-lg font-black text-slate-900 mb-2">AI Prediction</p>
                        <p className="text-slate-600 font-medium">Prices expected to rise by 7% over the next week. Best selling window: Thursday-Saturday.</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'negotiation' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Brain size={32} className="text-purple-600" />
                    AI Negotiation Assistant
                  </h3>
                  <div className="bg-white rounded-2xl p-8">
                    <p className="text-sm font-bold text-slate-400 uppercase mb-3">Buyer's Offer</p>
                    <p className="text-5xl font-black text-slate-900 mb-6">₹2,200</p>
                    <div className="space-y-4">
                      <div className="p-6 bg-red-50 rounded-2xl border-l-4 border-red-500">
                        <p className="text-lg font-black text-red-900 mb-2">Below Market Value</p>
                        <p className="text-sm text-red-700 font-medium">This offer is 10% below current market price</p>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-2xl">
                        <p className="text-lg font-black text-blue-900 mb-3">AI Recommended Counter-Offer</p>
                        <p className="text-4xl font-black text-blue-600 mb-3">₹2,550</p>
                        <p className="text-sm text-blue-700 font-medium">This gives room for negotiation while protecting your margin</p>
                      </div>
                      <div className="flex gap-4">
                        <Button className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg">
                          Send Counter-Offer
                        </Button>
                        <Button className="px-8 h-14 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black">
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'seasonal' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Calendar size={32} className="text-amber-600" />
                    Seasonal Price Patterns
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {seasonalPatterns.map((season, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <h4 className="text-2xl font-black text-slate-900 mb-4">{season.season}</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Average Price</p>
                            <p className="text-3xl font-black text-slate-900">₹{season.avgPrice}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Demand Level</p>
                            <Badge tone="brand" className="text-sm">{season.demand}</Badge>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Best Crops</p>
                            <p className="text-sm font-bold text-slate-600">{season.bestCrops}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'bulk-pricing' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <BarChart3 size={32} className="text-green-600" />
                    Bulk Pricing Tiers
                  </h3>
                  <div className="space-y-4">
                    {bulkPricingTiers.map((tier, idx) => (
                      <div key={idx} className="flex items-center justify-between p-8 bg-white rounded-2xl">
                        <div>
                          <p className="text-xl font-black text-slate-900 mb-2">{tier.quantity}</p>
                          <p className="text-sm font-bold text-slate-600">Discount: {tier.discount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-slate-900 mb-2">₹{tier.price}</p>
                          {tier.savings > 0 && (
                            <p className="text-sm font-bold text-green-600">Save ₹{tier.savings}/unit</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'sentiment' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Sparkles size={32} className="text-pink-600" />
                    Market Sentiment Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-3">Overall Sentiment</p>
                      <p className="text-5xl font-black text-green-600 mb-2">Positive</p>
                      <p className="text-sm font-bold text-slate-600">82% confidence</p>
                    </div>
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-3">Buyer Interest</p>
                      <p className="text-5xl font-black text-blue-600 mb-2">High</p>
                      <p className="text-sm font-bold text-slate-600">156 active buyers</p>
                    </div>
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <p className="text-sm font-bold text-slate-400 uppercase mb-3">Price Trend</p>
                      <p className="text-5xl font-black text-purple-600 mb-2">Rising</p>
                      <p className="text-sm font-bold text-slate-600">+12% this week</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-8">
                    <h4 className="text-xl font-black text-slate-900 mb-4">Social Media Insights</h4>
                    <div className="space-y-3">
                      <p className="text-slate-600 font-medium">• High demand discussions on farmer forums</p>
                      <p className="text-slate-600 font-medium">• Positive reviews about product quality</p>
                      <p className="text-slate-600 font-medium">• Buyers actively seeking suppliers in your region</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Bell size={32} className="text-red-600" />
                    Price Alerts & Notifications
                  </h3>
                  <div className="space-y-4">
                    {priceAlerts.map((alert, idx) => (
                      <div 
                        key={idx} 
                        className={`p-6 rounded-2xl border-l-4 ${
                          alert.type === 'success' ? 'bg-green-50 border-green-500' :
                          alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                          'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            {alert.type === 'success' && <CheckCircle size={24} className="text-green-600 mt-1" />}
                            {alert.type === 'warning' && <AlertCircle size={24} className="text-yellow-600 mt-1" />}
                            {alert.type === 'info' && <Activity size={24} className="text-blue-600 mt-1" />}
                            <div>
                              <p className="text-lg font-black text-slate-900 mb-1">{alert.message}</p>
                              <p className="text-sm font-bold text-slate-500">{alert.time}</p>
                            </div>
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
