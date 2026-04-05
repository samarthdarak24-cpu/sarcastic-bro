"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Camera, CheckCircle2, AlertTriangle, TrendingUp,
  BarChart3, Target, Zap, Settings, History, FileText,
  Upload, Eye, Award, Star, RefreshCw, Activity, Layers
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from "react-hot-toast";

export function CropQualityDetector() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [scanning, setScanning] = useState(false);

  const qualityScans = [
    { id: 'QS001', crop: 'Tomatoes', grade: 'A+', score: 95, defects: 2, date: '2024-04-05', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400' },
    { id: 'QS002', crop: 'Wheat', grade: 'A', score: 88, defects: 5, date: '2024-04-04', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400' },
    { id: 'QS003', crop: 'Rice', grade: 'B+', score: 82, defects: 8, date: '2024-04-03', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }
  ];

  const gradeDistribution = [
    { name: 'A+', value: 35, color: '#10b981' },
    { name: 'A', value: 40, color: '#3b82f6' },
    { name: 'B+', value: 20, color: '#f59e0b' },
    { name: 'B', value: 5, color: '#ef4444' }
  ];

  const qualityTrend = [
    { month: 'Jan', score: 82 },
    { month: 'Feb', score: 85 },
    { month: 'Mar', score: 88 },
    { month: 'Apr', score: 90 },
    { month: 'May', score: 92 },
    { month: 'Jun', score: 95 }
  ];

  const defectTypes = [
    { type: 'Color Variation', count: 12, severity: 'Low' },
    { type: 'Size Inconsistency', count: 8, severity: 'Medium' },
    { type: 'Surface Damage', count: 5, severity: 'High' },
    { type: 'Shape Irregularity', count: 15, severity: 'Low' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'scanner', label: 'AI Scanner', icon: Camera },
    { id: 'results', label: 'Scan Results', icon: FileText },
    { id: 'grading', label: 'Quality Grading', icon: Award },
    { id: 'defects', label: 'Defect Analysis', icon: AlertTriangle },
    { id: 'trends', label: 'Quality Trends', icon: TrendingUp },
    { id: 'standards', label: 'Standards', icon: Target },
    { id: 'certification', label: 'Certification', icon: Shield },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'history', label: 'History', icon: History }
  ];

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast.success('Quality scan completed!');
    }, 2000);
  };

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
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">AI Quality Shield.</h2>
              <Badge tone="brand" className="h-8 px-4 rounded-xl font-black gap-2 uppercase text-[9px]">
                <Shield size={14} className="animate-pulse" />
                AI POWERED
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              Intelligent crop quality detection and grading
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
                    { label: 'Avg Quality Score', value: '92%', icon: Star, gradient: 'from-green-500 to-emerald-500' },
                    { label: 'Total Scans', value: '1,245', icon: Camera, gradient: 'from-blue-500 to-cyan-500' },
                    { label: 'A+ Grade', value: '35%', icon: Award, gradient: 'from-purple-500 to-pink-500' },
                    { label: 'Defect Rate', value: '3.2%', icon: AlertTriangle, gradient: 'from-amber-500 to-orange-500' }
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Grade Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                          {gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Quality Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={qualityTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'scanner' && (
              <div className="max-w-2xl mx-auto">
                <Card className="p-12 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[4rem]">
                  <div className="text-center space-y-8">
                    <div className="h-32 w-32 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-lg">
                      <Camera size={64} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 mb-3">AI Quality Scanner</h3>
                      <p className="text-slate-600 font-bold mb-8">Upload crop images for instant quality analysis</p>
                    </div>
                    <Button
                      onClick={handleScan}
                      disabled={scanning}
                      className="h-16 px-12 rounded-2xl font-black text-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl"
                    >
                      {scanning ? (
                        <>
                          <RefreshCw size={24} className="mr-3 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Upload size={24} className="mr-3" />
                          Start Scan
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {qualityScans.map((scan) => (
                  <Card key={scan.id} className="p-6 border-none shadow-lg bg-white rounded-[3rem] hover:shadow-xl transition-all">
                    <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-[3rem]">
                      <img src={scan.image} alt={scan.crop} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4">
                        <Badge tone="brand" className="bg-white/90 backdrop-blur-sm">Grade {scan.grade}</Badge>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-4">{scan.crop}</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-600">Quality Score</span>
                        <span className="text-2xl font-black text-green-600">{scan.score}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-600">Defects Found</span>
                        <span className="text-lg font-black text-slate-900">{scan.defects}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-600">Scan Date</span>
                        <span className="text-sm font-bold text-slate-400">{scan.date}</span>
                      </div>
                    </div>

                    <Button className="w-full mt-6 h-12 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'defects' && (
              <div className="space-y-4">
                {defectTypes.map((defect, i) => (
                  <Card key={i} className={`p-8 border-none shadow-lg rounded-[3rem] ${
                    defect.severity === 'High' ? 'bg-gradient-to-br from-red-50 to-orange-50' :
                    defect.severity === 'Medium' ? 'bg-gradient-to-br from-amber-50 to-yellow-50' :
                    'bg-gradient-to-br from-blue-50 to-cyan-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">{defect.type}</h3>
                        <div className="flex items-center gap-4">
                          <Badge tone={defect.severity === 'High' ? 'amber' : 'brand'}>{defect.severity} Severity</Badge>
                          <span className="text-sm font-bold text-slate-600">{defect.count} instances</span>
                        </div>
                      </div>
                      <AlertTriangle size={48} className={defect.severity === 'High' ? 'text-red-600' : 'text-amber-600'} />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {['grading', 'trends', 'standards', 'certification', 'reports', 'history'].includes(activeTab) && (
              <Card className="p-12 text-center border-none shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 rounded-[4rem]">
                <div className="h-20 w-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {tabs.find(t => t.id === activeTab)?.icon && 
                    React.createElement(tabs.find(t => t.id === activeTab)!.icon, { size: 40, className: 'text-blue-600' })
                  }
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-3">{tabs.find(t => t.id === activeTab)?.label}</h3>
                <p className="text-slate-600 font-bold">Advanced quality analysis features coming soon</p>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
