"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, TrendingDown, DollarSign, AlertTriangle, History,
  CheckCircle, Lock, TrendingUp, Activity, Calculator, Plus,
  BarChart3, FileText, Settings, Bell, RefreshCw, Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export function PriceProtectionHub() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Policy Overview', icon: Activity },
    { id: 'create-policy', label: 'New Policy', icon: Plus },
    { id: 'active-policies', label: 'Active', icon: ShieldCheck },
    { id: 'claims', label: 'Claims', icon: DollarSign },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'market-trends', label: 'Market', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Data refreshed');
    }, 1000);
  };

  const activePolicies = [
    { id: '1', product: 'Basmati Rice', floorPrice: 85, quantity: 1200, premium: 2550, status: 'ACTIVE', endDate: '2025-04-12', coverage: 102000 },
    { id: '2', product: 'Organic Wheat', floorPrice: 42, quantity: 5000, premium: 5250, status: 'ACTIVE', endDate: '2025-05-20', coverage: 210000 },
    { id: '3', product: 'Tomatoes', floorPrice: 28, quantity: 800, premium: 560, status: 'ACTIVE', endDate: '2025-03-15', coverage: 22400 }
  ];

  const claims = [
    { id: '1', product: 'Wheat', amount: 12450, status: 'PAID', date: '2024-04-02', marketPrice: 38, floorPrice: 42 },
    { id: '2', product: 'Rice', amount: 8200, status: 'PAID', date: '2024-03-28', marketPrice: 78, floorPrice: 85 },
    { id: '3', product: 'Onions', amount: 4100, status: 'PROCESSING', date: '2024-04-05', marketPrice: 18, floorPrice: 22 }
  ];

  const marketTrends = [
    { crop: 'Tomatoes', currentPrice: 24, trend: 'down', change: -12, volatility: 'High' },
    { crop: 'Wheat', currentPrice: 40, trend: 'stable', change: 2, volatility: 'Low' },
    { crop: 'Rice', currentPrice: 82, trend: 'up', change: 8, volatility: 'Medium' },
    { crop: 'Onions', currentPrice: 19, trend: 'down', change: -15, volatility: 'High' }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">Price Protection.</h2>
              <Badge tone="brand" className="h-8 px-4 rounded-xl font-black gap-2 uppercase text-[9px]">
                <Sparkles size={14} className="animate-pulse" />
                INSURED
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              Protect your harvest against market crashes
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
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem]">
                    <ShieldCheck size={32} className="text-blue-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Active Policies</p>
                    <p className="text-3xl font-black text-slate-900">3</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem]">
                    <DollarSign size={32} className="text-green-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Total Coverage</p>
                    <p className="text-3xl font-black text-slate-900">₹3.3L</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem]">
                    <CheckCircle size={32} className="text-purple-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Claims Paid</p>
                    <p className="text-3xl font-black text-slate-900">₹24.7K</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem]">
                    <TrendingDown size={32} className="text-amber-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Risk Level</p>
                    <p className="text-3xl font-black text-slate-900">Low</p>
                  </Card>
                </div>

                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6">How Price Protection Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6">
                      <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                        <Lock size={24} className="text-blue-600" />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">1. Set Floor Price</h4>
                      <p className="text-sm text-slate-600 font-medium">Choose your minimum acceptable price per unit</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6">
                      <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                        <Activity size={24} className="text-green-600" />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">2. We Monitor</h4>
                      <p className="text-sm text-slate-600 font-medium">Real-time tracking of market prices</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6">
                      <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                        <DollarSign size={24} className="text-purple-600" />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">3. Auto Payout</h4>
                      <p className="text-sm text-slate-600 font-medium">Instant compensation if price drops</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'create-policy' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Plus size={32} className="text-indigo-600" />
                    Create New Protection Policy
                  </h3>
                  <div className="bg-white rounded-2xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Select Crop</label>
                        <select className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 font-bold">
                          <option>Basmati Rice</option>
                          <option>Organic Wheat</option>
                          <option>Tomatoes</option>
                          <option>Onions</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Floor Price (₹/kg)</label>
                        <Input className="h-14 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold" placeholder="e.g. 45" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Quantity (kg)</label>
                        <Input className="h-14 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold" placeholder="e.g. 1000" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Duration</label>
                        <select className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 font-bold">
                          <option>30 Days</option>
                          <option>60 Days</option>
                          <option>90 Days</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-2xl mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-400 uppercase mb-1">Estimated Premium</p>
                          <p className="text-3xl font-black text-blue-600">₹2,250</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-400 uppercase mb-1">Coverage Amount</p>
                          <p className="text-3xl font-black text-slate-900">₹45,000</p>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-black text-lg">
                      Activate Protection
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'active-policies' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <ShieldCheck size={32} className="text-green-600" />
                    Active Protection Policies
                  </h3>
                  <div className="space-y-4">
                    {activePolicies.map((policy) => (
                      <div key={policy.id} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center">
                              <Lock size={32} className="text-green-600" />
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-slate-900">{policy.product}</h4>
                              <p className="text-sm font-bold text-slate-400">Policy #{policy.id}</p>
                            </div>
                          </div>
                          <Badge tone="brand" className="bg-green-500 text-white">{policy.status}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Floor Price</p>
                            <p className="text-2xl font-black text-slate-900">₹{policy.floorPrice}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Quantity</p>
                            <p className="text-2xl font-black text-slate-900">{policy.quantity} kg</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Coverage</p>
                            <p className="text-2xl font-black text-slate-900">₹{policy.coverage.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Expires</p>
                            <p className="text-lg font-black text-slate-900">{policy.endDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'claims' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <DollarSign size={32} className="text-amber-600" />
                    Claims & Payouts
                  </h3>
                  <div className="space-y-4">
                    {claims.map((claim) => (
                      <div key={claim.id} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">{claim.product}</h4>
                            <p className="text-sm font-bold text-slate-600">Claim Date: {claim.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-black text-green-600 mb-2">₹{claim.amount.toLocaleString()}</p>
                            <Badge tone={claim.status === 'PAID' ? 'brand' : 'ink'}>
                              {claim.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl">
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Market Price</p>
                            <p className="text-xl font-black text-red-600">₹{claim.marketPrice}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Floor Price</p>
                            <p className="text-xl font-black text-green-600">₹{claim.floorPrice}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'calculator' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Calculator size={32} className="text-cyan-600" />
                    Premium Calculator
                  </h3>
                  <div className="bg-white rounded-2xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Crop Value (₹)</label>
                        <Input className="h-14 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold" placeholder="100000" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Risk Level</label>
                        <select className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 font-bold">
                          <option>Low (2.5%)</option>
                          <option>Medium (3.5%)</option>
                          <option>High (5%)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Duration</label>
                        <select className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 font-bold">
                          <option>30 Days</option>
                          <option>60 Days</option>
                          <option>90 Days</option>
                        </select>
                      </div>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-sm font-bold text-slate-400 uppercase mb-2">Premium Amount</p>
                          <p className="text-4xl font-black text-blue-600">₹2,500</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-400 uppercase mb-2">Coverage</p>
                          <p className="text-4xl font-black text-slate-900">₹100,000</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-400 uppercase mb-2">Rate</p>
                          <p className="text-4xl font-black text-purple-600">2.5%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'market-trends' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <TrendingUp size={32} className="text-purple-600" />
                    Market Price Trends
                  </h3>
                  <div className="space-y-4">
                    {marketTrends.map((trend, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">{trend.crop}</h4>
                            <p className="text-sm font-bold text-slate-600">Current Market Price</p>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-black text-slate-900 mb-2">₹{trend.currentPrice}</p>
                            <div className="flex items-center gap-2 justify-end">
                              {trend.trend === 'up' && <TrendingUp size={20} className="text-green-600" />}
                              {trend.trend === 'down' && <TrendingDown size={20} className="text-red-600" />}
                              <span className={`text-lg font-black ${trend.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.change > 0 ? '+' : ''}{trend.change}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-600">Volatility</span>
                            <Badge tone={trend.volatility === 'High' ? 'destructive' : 'brand'}>{trend.volatility}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <History size={32} className="text-slate-600" />
                    Policy History
                  </h3>
                  <div className="space-y-4">
                    {[
                      { id: '1', product: 'Wheat', status: 'EXPIRED', date: '2024-03-15', coverage: 50000 },
                      { id: '2', product: 'Rice', status: 'CLAIMED', date: '2024-02-28', coverage: 85000 },
                      { id: '3', product: 'Onions', status: 'EXPIRED', date: '2024-01-20', coverage: 30000 }
                    ].map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center">
                            <FileText size={24} className="text-slate-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900">{item.product}</h4>
                            <p className="text-sm font-bold text-slate-600">{item.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-slate-900 mb-1">₹{item.coverage.toLocaleString()}</p>
                          <Badge tone="ink">{item.status}</Badge>
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
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Total Premiums Paid</p>
                    <p className="text-3xl font-black text-slate-900 mb-2">₹8,360</p>
                    <TrendingUp size={16} className="text-green-600" />
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Claims Received</p>
                    <p className="text-3xl font-black text-slate-900 mb-2">₹24,750</p>
                    <TrendingUp size={16} className="text-green-600" />
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Net Benefit</p>
                    <p className="text-3xl font-black text-green-600 mb-2">₹16,390</p>
                    <CheckCircle size={16} className="text-green-600" />
                  </Card>
                </div>
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
                    {[
                      { type: 'warning', message: 'Tomato prices dropped 12% - Protection activated', time: '2 hours ago' },
                      { type: 'success', message: 'Claim processed: ₹12,450 credited to account', time: '1 day ago' },
                      { type: 'info', message: 'Policy renewal reminder: Wheat policy expires in 7 days', time: '2 days ago' }
                    ].map((alert, idx) => (
                      <div 
                        key={idx} 
                        className={`p-6 rounded-2xl border-l-4 ${
                          alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                          alert.type === 'success' ? 'bg-green-50 border-green-500' :
                          'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <AlertTriangle size={24} className={
                              alert.type === 'warning' ? 'text-yellow-600' :
                              alert.type === 'success' ? 'text-green-600' :
                              'text-blue-600'
                            } />
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

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Settings size={32} className="text-slate-600" />
                    Protection Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="text-xl font-black text-slate-900 mb-4">Auto-Renewal</h4>
                      <div className="space-y-3">
                        {['Enable auto-renewal for all policies', 'Send renewal reminders 7 days before expiry', 'Auto-claim when price drops below floor'].map((setting, i) => (
                          <label key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
                            <input type="checkbox" className="h-5 w-5" defaultChecked={i === 1} />
                            <span className="text-sm font-bold text-slate-900">{setting}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="text-xl font-black text-slate-900 mb-4">Notification Preferences</h4>
                      <div className="space-y-3">
                        {['Price drop alerts', 'Claim status updates', 'Policy expiry reminders', 'Market trend reports'].map((pref, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <span className="text-sm font-bold text-slate-900">{pref}</span>
                            <div className={`w-14 h-8 rounded-full transition-all cursor-pointer ${i < 3 ? 'bg-green-500' : 'bg-slate-300'}`}>
                              <div className={`h-6 w-6 bg-white rounded-full m-1 transition-all ${i < 3 ? 'translate-x-6' : ''}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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

export default PriceProtectionHub;