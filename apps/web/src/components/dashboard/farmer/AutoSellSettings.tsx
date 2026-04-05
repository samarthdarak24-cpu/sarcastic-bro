"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, Plus, Trash2, Play, Pause, Clock, TrendingUp, Package,
  Activity, AlertCircle, History, Settings, BarChart3, Bell,
  RefreshCw, Sparkles, CheckCircle, Target
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export function AutoSellSettings() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'create-rule', label: 'New Rule', icon: Plus },
    { id: 'active-rules', label: 'Active Rules', icon: Zap },
    { id: 'matches', label: 'Matches', icon: Target },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Rules refreshed');
    }, 1000);
  };

  const activeRules = [
    { id: '1', product: 'Organic Wheat', minPrice: 42, quantity: 500, isActive: true, matches: 12 },
    { id: '2', product: 'Basmati Rice', minPrice: 88, quantity: 1000, isActive: true, matches: 8 },
    { id: '3', product: 'Tomatoes', minPrice: 28, quantity: 300, isActive: false, matches: 5 }
  ];

  const matches = [
    { id: '1', product: 'Wheat', buyer: 'ABC Traders', price: 45, quantity: 500, status: 'MATCHED', time: '2 hours ago' },
    { id: '2', product: 'Rice', buyer: 'XYZ Mills', price: 92, quantity: 800, status: 'PENDING', time: '5 hours ago' },
    { id: '3', product: 'Tomatoes', buyer: 'Fresh Mart', price: 30, quantity: 200, status: 'COMPLETED', time: '1 day ago' }
  ];

  const executionHistory = [
    { timestamp: '2024-04-05 14:12', product: 'Organic Wheat', price: 42.50, quantity: 500, status: 'SUCCESS' },
    { timestamp: '2024-04-04 09:45', product: 'Tomatoes', price: 28.00, quantity: 200, status: 'SUCCESS' },
    { timestamp: '2024-04-03 16:30', product: 'Basmati Rice', price: 92.00, quantity: 1000, status: 'SUCCESS' }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">Auto-Sell Engine.</h2>
              <Badge tone="brand" className="h-8 px-4 rounded-xl font-black gap-2 uppercase text-[9px]">
                <Sparkles size={14} className="animate-pulse" />
                AUTOMATED
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              Smart rules for automatic selling at your price
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
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem]">
                    <Zap size={32} className="text-blue-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Active Rules</p>
                    <p className="text-3xl font-black text-slate-900">3</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem]">
                    <Target size={32} className="text-green-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Matches Today</p>
                    <p className="text-3xl font-black text-slate-900">12</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem]">
                    <CheckCircle size={32} className="text-purple-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Success Rate</p>
                    <p className="text-3xl font-black text-slate-900">94%</p>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem]">
                    <Clock size={32} className="text-amber-600 mb-3" />
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Next Check</p>
                    <p className="text-xl font-black text-slate-900">4:52m</p>
                  </Card>
                </div>

                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6">How Auto-Sell Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6">
                      <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                        <Plus size={24} className="text-blue-600" />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">1. Set Rules</h4>
                      <p className="text-sm text-slate-600 font-medium">Define your minimum price and quantity</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6">
                      <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                        <Activity size={24} className="text-green-600" />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">2. We Match</h4>
                      <p className="text-sm text-slate-600 font-medium">AI finds best buyers automatically</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6">
                      <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle size={24} className="text-purple-600" />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2">3. Auto Execute</h4>
                      <p className="text-sm text-slate-600 font-medium">Deals close instantly at your price</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'create-rule' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Plus size={32} className="text-indigo-600" />
                    Create New Auto-Sell Rule
                  </h3>
                  <div className="bg-white rounded-2xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Select Product</label>
                        <select className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 font-bold">
                          <option>Organic Wheat</option>
                          <option>Basmati Rice</option>
                          <option>Tomatoes</option>
                          <option>Onions</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Minimum Price (₹/kg)</label>
                        <Input className="h-14 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold" placeholder="e.g. 42" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Max Quantity (kg)</label>
                        <Input className="h-14 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold" placeholder="e.g. 500" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Priority</label>
                        <select className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 font-bold">
                          <option>High</option>
                          <option>Medium</option>
                          <option>Low</option>
                        </select>
                      </div>
                    </div>
                    <Button className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-black text-lg">
                      Activate Auto-Sell Rule
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'active-rules' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Zap size={32} className="text-green-600" />
                    Active Auto-Sell Rules
                  </h3>
                  <div className="space-y-4">
                    {activeRules.map((rule) => (
                      <div key={rule.id} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center">
                              <Package size={32} className="text-green-600" />
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-slate-900">{rule.product}</h4>
                              <p className="text-sm font-bold text-slate-400">Rule #{rule.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge tone={rule.isActive ? 'brand' : 'ink'}>
                              {rule.isActive ? 'ACTIVE' : 'PAUSED'}
                            </Badge>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50">
                              <Trash2 size={20} />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Min Price</p>
                            <p className="text-2xl font-black text-slate-900">₹{rule.minPrice}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Max Quantity</p>
                            <p className="text-2xl font-black text-slate-900">{rule.quantity} kg</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-2">Matches</p>
                            <p className="text-2xl font-black text-green-600">{rule.matches}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'matches' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Target size={32} className="text-amber-600" />
                    Matched Buyers
                  </h3>
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div key={match.id} className="bg-white rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2">{match.product}</h4>
                            <p className="text-sm font-bold text-slate-600">Buyer: {match.buyer}</p>
                          </div>
                          <Badge tone={
                            match.status === 'COMPLETED' ? 'brand' :
                            match.status === 'MATCHED' ? 'ink' : 'amber'
                          }>
                            {match.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-6 p-6 bg-slate-50 rounded-xl">
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Price</p>
                            <p className="text-xl font-black text-green-600">₹{match.price}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Quantity</p>
                            <p className="text-xl font-black text-slate-900">{match.quantity} kg</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-400 uppercase mb-1">Time</p>
                            <p className="text-sm font-bold text-slate-600">{match.time}</p>
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
                    Execution History
                  </h3>
                  <div className="space-y-4">
                    {executionHistory.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle size={24} className="text-green-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900">{item.product}</h4>
                            <p className="text-sm font-bold text-slate-600">{item.timestamp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-slate-900 mb-1">₹{item.price} × {item.quantity}kg</p>
                          <Badge tone="brand">{item.status}</Badge>
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
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Total Sales</p>
                    <p className="text-3xl font-black text-slate-900 mb-2">₹2.4L</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-600" />
                      <span className="text-sm font-bold text-green-600">+18%</span>
                    </div>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Avg Price</p>
                    <p className="text-3xl font-black text-slate-900 mb-2">₹48</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-600" />
                      <span className="text-sm font-bold text-green-600">+5%</span>
                    </div>
                  </Card>
                  <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Time Saved</p>
                    <p className="text-3xl font-black text-slate-900 mb-2">24 hrs</p>
                    <CheckCircle size={16} className="text-green-600" />
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Clock size={32} className="text-cyan-600" />
                    Matching Schedule
                  </h3>
                  <div className="bg-white rounded-2xl p-8">
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Check Frequency</label>
                        <select className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 font-bold">
                          <option>Every 5 minutes</option>
                          <option>Every 15 minutes</option>
                          <option>Every 30 minutes</option>
                          <option>Every hour</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-400 uppercase mb-2 block">Active Hours</label>
                        <div className="grid grid-cols-2 gap-4">
                          <Input className="h-14 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold" placeholder="Start: 09:00" />
                          <Input className="h-14 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold" placeholder="End: 18:00" />
                        </div>
                      </div>
                      <div className="p-6 bg-blue-50 rounded-xl">
                        <p className="text-sm font-bold text-blue-900">Next scheduled check: Today at 15:30</p>
                      </div>
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
                    Auto-Sell Alerts
                  </h3>
                  <div className="space-y-4">
                    {[
                      { type: 'success', message: 'New match found: Wheat @ ₹45/kg', time: '10 mins ago' },
                      { type: 'info', message: 'Rule activated: Basmati Rice auto-sell', time: '2 hours ago' },
                      { type: 'warning', message: 'Low inventory: Tomatoes below threshold', time: '5 hours ago' }
                    ].map((alert, idx) => (
                      <div 
                        key={idx} 
                        className={`p-6 rounded-2xl border-l-4 ${
                          alert.type === 'success' ? 'bg-green-50 border-green-500' :
                          alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                          'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-lg font-black text-slate-900 mb-1">{alert.message}</p>
                            <p className="text-sm font-bold text-slate-500">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <TrendingUp size={32} className="text-purple-600" />
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-8">
                      <h4 className="text-xl font-black text-slate-900 mb-6">Success Rate</h4>
                      <div className="space-y-4">
                        {[
                          { product: 'Wheat', rate: 95 },
                          { product: 'Rice', rate: 88 },
                          { product: 'Tomatoes', rate: 92 }
                        ].map((item, idx) => (
                          <div key={idx}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-slate-900">{item.product}</span>
                              <span className="text-sm font-bold text-green-600">{item.rate}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                                style={{ width: `${item.rate}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-8">
                      <h4 className="text-xl font-black text-slate-900 mb-6">Response Time</h4>
                      <div className="text-center">
                        <p className="text-6xl font-black text-purple-600 mb-2">2.3s</p>
                        <p className="text-sm font-bold text-slate-600">Average match time</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card className="p-8 border-none shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <Settings size={32} className="text-slate-600" />
                    Auto-Sell Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="text-xl font-black text-slate-900 mb-4">Automation Preferences</h4>
                      <div className="space-y-3">
                        {['Auto-approve matches above minimum price', 'Send notifications for all matches', 'Pause rules during holidays'].map((setting, i) => (
                          <label key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
                            <input type="checkbox" className="h-5 w-5" defaultChecked={i < 2} />
                            <span className="text-sm font-bold text-slate-900">{setting}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6">
                      <h4 className="text-xl font-black text-slate-900 mb-4">Notification Settings</h4>
                      <div className="space-y-3">
                        {['New match alerts', 'Rule execution updates', 'Performance reports', 'Low inventory warnings'].map((pref, i) => (
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
