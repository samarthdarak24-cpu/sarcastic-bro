"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sprout, TrendingUp, Bug, Droplets, Leaf, Calendar,
  RotateCcw, DollarSign, Cloud, Activity, RefreshCw,
  BarChart3, Target, Zap, Settings, History, FileText,
  MessageSquare, AlertCircle, CheckCircle2, Sun
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from "react-hot-toast";

interface CropAdvisorProps {
  userId: string;
}

export default function CropAdvisor({ userId }: CropAdvisorProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const recommendations = [
    { crop: 'Tomatoes', season: 'Kharif', confidence: 92, yield: '25 tons/acre', profit: '₹3.2L' },
    { crop: 'Wheat', season: 'Rabi', confidence: 88, yield: '4.5 tons/acre', profit: '₹1.8L' },
    { crop: 'Cotton', season: 'Kharif', confidence: 85, yield: '8 quintals/acre', profit: '₹2.5L' }
  ];

  const growthData = [
    { week: 'Week 1', height: 5, health: 85 },
    { week: 'Week 2', height: 12, health: 88 },
    { week: 'Week 3', height: 22, health: 90 },
    { week: 'Week 4', height: 35, health: 92 },
    { week: 'Week 5', height: 48, health: 89 },
    { week: 'Week 6', height: 62, health: 91 }
  ];

  const diseases = [
    { name: 'Leaf Blight', severity: 'Medium', affected: '12%', treatment: 'Copper fungicide', status: 'detected' },
    { name: 'Root Rot', severity: 'Low', affected: '5%', treatment: 'Improve drainage', status: 'monitored' },
    { name: 'Powdery Mildew', severity: 'High', affected: '25%', treatment: 'Sulfur spray', status: 'critical' }
  ];

  const irrigation = [
    { zone: 'Zone A', moisture: 65, status: 'Optimal', nextWatering: '2 days', method: 'Drip' },
    { zone: 'Zone B', moisture: 45, status: 'Low', nextWatering: 'Today', method: 'Sprinkler' },
    { zone: 'Zone C', moisture: 78, status: 'High', nextWatering: '4 days', method: 'Drip' }
  ];

  const fertilizer = [
    { type: 'Nitrogen (N)', current: 45, required: 60, deficit: 15, cost: '₹2,400' },
    { type: 'Phosphorus (P)', current: 35, required: 40, deficit: 5, cost: '₹800' },
    { type: 'Potassium (K)', current: 50, required: 55, deficit: 5, cost: '₹1,200' }
  ];

  const harvest = [
    { crop: 'Tomatoes', planted: '2024-02-15', expected: '2024-05-20', daysLeft: 45, readiness: 75 },
    { crop: 'Wheat', planted: '2024-01-10', expected: '2024-04-25', daysLeft: 20, readiness: 90 },
    { crop: 'Cotton', planted: '2024-03-01', expected: '2024-07-15', daysLeft: 100, readiness: 45 }
  ];

  const rotation = [
    { season: 'Kharif 2024', crop: 'Rice', benefit: 'Nitrogen fixation', nextCrop: 'Wheat' },
    { season: 'Rabi 2024-25', crop: 'Wheat', benefit: 'Soil structure', nextCrop: 'Pulses' },
    { season: 'Kharif 2025', crop: 'Pulses', benefit: 'Pest control', nextCrop: 'Cotton' }
  ];

  const market = [
    { crop: 'Tomatoes', currentPrice: '₹28/kg', forecast: '₹32/kg', trend: 'up', demand: 'High' },
    { crop: 'Wheat', currentPrice: '₹22/kg', forecast: '₹20/kg', trend: 'down', demand: 'Medium' },
    { crop: 'Cotton', currentPrice: '₹85/kg', forecast: '₹90/kg', trend: 'up', demand: 'High' }
  ];

  const weather = [
    { day: 'Today', temp: '28°C', humidity: '65%', rainfall: '0mm', condition: 'Sunny' },
    { day: 'Tomorrow', temp: '30°C', humidity: '70%', rainfall: '5mm', condition: 'Partly Cloudy' },
    { day: 'Day 3', temp: '26°C', humidity: '80%', rainfall: '15mm', condition: 'Rainy' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sprout },
    { id: 'growth', label: 'Growth Tracking', icon: TrendingUp },
    { id: 'disease', label: 'Disease Detection', icon: Bug },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'fertilizer', label: 'Fertilizer', icon: Leaf },
    { id: 'harvest', label: 'Harvest Predict', icon: Calendar },
    { id: 'rotation', label: 'Crop Rotation', icon: RotateCcw },
    { id: 'market', label: 'Market Insights', icon: DollarSign },
    { id: 'weather', label: 'Weather', icon: Cloud }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Data refreshed');
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">Crop Advisor.</h2>
              <Badge tone="brand" className="h-8 px-4 rounded-xl font-black gap-2 uppercase text-[9px]">
                <Sprout size={14} className="animate-pulse" />
                AI POWERED
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              Intelligent crop management and optimization
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
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Active Crops', value: '8', icon: Sprout, gradient: 'from-green-500 to-emerald-500' },
                    { label: 'Health Score', value: '92%', icon: Activity, gradient: 'from-blue-500 to-cyan-500' },
                    { label: 'Yield Forecast', value: '145T', icon: TrendingUp, gradient: 'from-purple-500 to-pink-500' },
                    { label: 'Est. Revenue', value: '₹12.5L', icon: DollarSign, gradient: 'from-amber-500 to-orange-500' }
                  ].map((kpi, i) => (
                    <Card key={i} className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                      <div className={`h-14 w-14 bg-gradient-to-br ${kpi.gradient} rounded-xl flex items-center justify-center text-white mb-4`}>
                        <kpi.icon size={28} />
                      </div>
                      <p className="text-4xl font-black text-slate-900 mb-2">{kpi.value}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase">{kpi.label}</p>
                    </Card>
                  ))}
                </div>

                <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                  <h3 className="text-xl font-black text-slate-900 mb-6">Growth Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="week" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Area type="monotone" dataKey="height" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#growthGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                {recommendations.map((rec, i) => (
                  <Card key={i} className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">{rec.crop}</h3>
                        <Badge tone="brand">{rec.season} Season</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-black text-green-600 mb-1">{rec.confidence}%</p>
                        <p className="text-xs text-slate-400 font-bold">Confidence</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-2xl">
                      <div>
                        <p className="text-xs text-slate-400 font-bold mb-1">Expected Yield</p>
                        <p className="text-lg font-black text-slate-900">{rec.yield}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold mb-1">Est. Profit</p>
                        <p className="text-lg font-black text-green-600">{rec.profit}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'growth' && (
              <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                <h3 className="text-xl font-black text-slate-900 mb-6">Growth Monitoring</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="week" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="height" fill="#10b981" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="health" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {activeTab === 'disease' && (
              <div className="space-y-4">
                {diseases.map((disease, i) => (
                  <Card key={i} className={`p-8 border-none shadow-lg rounded-[3rem] ${
                    disease.status === 'critical' ? 'bg-gradient-to-br from-red-50 to-orange-50' :
                    disease.status === 'detected' ? 'bg-gradient-to-br from-amber-50 to-yellow-50' :
                    'bg-gradient-to-br from-blue-50 to-cyan-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">{disease.name}</h3>
                        <p className="text-sm text-slate-600 mb-4">Treatment: {disease.treatment}</p>
                        <div className="flex items-center gap-4">
                          <Badge tone={disease.status === 'critical' ? 'amber' : 'brand'}>{disease.severity} Severity</Badge>
                          <span className="text-sm font-bold text-slate-600">{disease.affected} affected</span>
                        </div>
                      </div>
                      <AlertCircle size={48} className={disease.status === 'critical' ? 'text-red-600' : 'text-amber-600'} />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {['irrigation', 'fertilizer', 'harvest', 'rotation', 'market', 'weather'].includes(activeTab) && (
              <>
                {activeTab === 'irrigation' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {irrigation.map((zone, i) => (
                      <Card key={i} className="p-8 border-none shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[3rem]">
                        <Droplets size={48} className="text-cyan-600 mb-4" />
                        <h3 className="text-2xl font-black text-slate-900 mb-4">{zone.zone}</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-slate-600">Moisture</span>
                            <span className="text-lg font-black text-slate-900">{zone.moisture}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-slate-600">Status</span>
                            <Badge tone={zone.status === 'Optimal' ? 'brand' : 'amber'}>{zone.status}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-slate-600">Next Watering</span>
                            <span className="text-sm font-black text-slate-900">{zone.nextWatering}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-slate-600">Method</span>
                            <span className="text-sm font-black text-slate-900">{zone.method}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'fertilizer' && (
                  <div className="space-y-4">
                    {fertilizer.map((fert, i) => (
                      <Card key={i} className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">{fert.type}</h3>
                            <p className="text-sm text-slate-600">Deficit: {fert.deficit} units</p>
                          </div>
                          <Leaf size={48} className="text-green-600" />
                        </div>
                        <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl">
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">Current</p>
                            <p className="text-lg font-black text-slate-900">{fert.current}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">Required</p>
                            <p className="text-lg font-black text-slate-900">{fert.required}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">Deficit</p>
                            <p className="text-lg font-black text-red-600">{fert.deficit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">Cost</p>
                            <p className="text-lg font-black text-slate-900">{fert.cost}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'harvest' && (
                  <div className="space-y-4">
                    {harvest.map((item, i) => (
                      <Card key={i} className="p-8 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[3rem]">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">{item.crop}</h3>
                            <p className="text-sm text-slate-600">Planted: {item.planted}</p>
                          </div>
                          <Calendar size={48} className="text-amber-600" />
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-600">Expected Harvest</span>
                            <span className="text-lg font-black text-slate-900">{item.expected}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-600">Days Left</span>
                            <span className="text-2xl font-black text-amber-600">{item.daysLeft}</span>
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-bold text-slate-600">Readiness</span>
                              <span className="text-sm font-black text-slate-900">{item.readiness}%</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${item.readiness}%` }} />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'rotation' && (
                  <div className="space-y-4">
                    {rotation.map((rot, i) => (
                      <Card key={i} className="p-8 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem]">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-2xl font-black text-slate-900 mb-2">{rot.season}</h3>
                            <p className="text-lg font-bold text-slate-600 mb-4">Current: {rot.crop}</p>
                            <div className="flex items-center gap-4">
                              <Badge tone="brand">{rot.benefit}</Badge>
                              <span className="text-sm font-bold text-slate-600">Next: {rot.nextCrop}</span>
                            </div>
                          </div>
                          <RotateCcw size={48} className="text-purple-600" />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'market' && (
                  <div className="space-y-4">
                    {market.map((item, i) => (
                      <Card key={i} className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">{item.crop}</h3>
                            <Badge tone={item.demand === 'High' ? 'brand' : 'ink'}>{item.demand} Demand</Badge>
                          </div>
                          <DollarSign size={48} className={item.trend === 'up' ? 'text-green-600' : 'text-red-600'} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl">
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">Current</p>
                            <p className="text-lg font-black text-slate-900">{item.currentPrice}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">Forecast</p>
                            <p className="text-lg font-black text-slate-900">{item.forecast}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">Trend</p>
                            <p className={`text-lg font-black ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                              {item.trend === 'up' ? '↑' : '↓'}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'weather' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {weather.map((day, i) => (
                      <Card key={i} className="p-8 border-none shadow-lg bg-gradient-to-br from-sky-50 to-blue-50 rounded-[3rem]">
                        <Cloud size={48} className="text-sky-600 mb-4" />
                        <h3 className="text-2xl font-black text-slate-900 mb-4">{day.day}</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-slate-600">Temperature</span>
                            <span className="text-lg font-black text-slate-900">{day.temp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-slate-600">Humidity</span>
                            <span className="text-lg font-black text-slate-900">{day.humidity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-slate-600">Rainfall</span>
                            <span className="text-lg font-black text-slate-900">{day.rainfall}</span>
                          </div>
                          <Badge tone="brand" className="w-full justify-center">{day.condition}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
