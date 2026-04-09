'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Upload, Sparkles, TrendingUp, AlertCircle, CheckCircle, XCircle, Zap,
  Shield, Award, Target, BarChart3, Eye, Download, Share2, History,
  Layers, Cpu, Brain, Activity, Star, TrendingDown, Package, Droplet, Plus
} from 'lucide-react';

interface Detection {
  detection_id: number;
  bbox: number[];
  quality_grade: string;
  quality_score: number;
  classification_confidence: number;
  features: {
    color_uniformity: number;
    texture_score: number;
    shape_regularity: number;
    defects: Record<string, number>;
  };
  class_probabilities: Record<string, number>;
}

interface QualityResult {
  success: boolean;
  overall_quality_score: number;
  overall_grade: string;
  total_detections: number;
  detections: Detection[];
  technology_stack: {
    detection: string;
    classification: string;
    preprocessing: string;
    transfer_learning: string;
  };
  visualization_base64?: string;
}

export default function AIQualityShieldPremium() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<QualityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'analytics'>('scan');

  // Mock scan history
  const scanHistory = [
    { id: 1, crop: 'Tomatoes', grade: 'Premium', score: 95, date: '2 hours ago', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100' },
    { id: 2, crop: 'Potatoes', grade: 'Grade A', score: 88, date: '5 hours ago', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100' },
    { id: 3, crop: 'Wheat', grade: 'Grade B', score: 76, date: '1 day ago', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100' },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    await analyzeQuality(file);
  };

  const analyzeQuality = async (file: File) => {
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: QualityResult = {
        success: true,
        overall_quality_score: Math.floor(Math.random() * 20) + 80,
        overall_grade: ['Premium', 'Grade A', 'Grade B'][Math.floor(Math.random() * 3)],
        total_detections: 1,
        detections: [
          {
            detection_id: 1,
            bbox: [100, 100, 300, 300],
            quality_grade: 'Grade A',
            quality_score: 88,
            classification_confidence: 0.95,
            features: {
              color_uniformity: 92,
              texture_score: 85,
              shape_regularity: 90,
              defects: { bruising: 0, discoloration: 1 }
            },
            class_probabilities: { tomato: 0.98, other: 0.02 }
          }
        ],
        technology_stack: {
          detection: 'YOLOv8',
          classification: 'EfficientNet',
          preprocessing: 'OpenCV',
          transfer_learning: 'ImageNet'
        }
      };
      
      setResult(mockResult);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'Premium': 'from-green-500 to-emerald-600',
      'Grade A': 'from-green-400 to-green-600',
      'Grade B': 'from-yellow-400 to-amber-600',
      'Grade C': 'from-orange-400 to-orange-600',
      'Rejected': 'from-red-400 to-red-600',
    };
    return colors[grade] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 p-8">
      {/* Hero Section from Image */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center mb-12"
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center shadow-2xl shadow-cyan-200/50 mb-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Sparkles size={40} className="text-white drop-shadow-md" />
          <motion.div 
            className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Plus size={10} className="text-cyan-500 font-bold" />
          </motion.div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">
          Advanced AI Crop Analyzer
        </h1>
        <p className="text-xl text-slate-500 font-medium mb-6">
          Production-Grade Quality Analysis
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-slate-600">
          {[
            'Multi-Object Detection',
            'Real Defect Analysis',
            'Quality Grading'
          ].map((feature, i) => (
            <motion.div 
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={14} className="text-green-600" />
              </div>
              <span>{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Scans', value: '1,247', icon: Camera, color: 'from-blue-500 to-cyan-600', change: '+12%' },
          { label: 'Avg Quality', value: '92.5%', icon: Award, color: 'from-green-500 to-emerald-600', change: '+5%' },
          { label: 'Premium Grade', value: '68%', icon: Star, color: 'from-purple-500 to-pink-600', change: '+8%' },
          { label: 'AI Accuracy', value: '98.2%', icon: Brain, color: 'from-amber-500 to-orange-600', change: '+2%' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 relative overflow-hidden group cursor-pointer"
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />
            
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon size={24} className="text-white" />
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

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-200 mb-6 flex gap-2">
        {[
          { id: 'scan', label: 'AI Scanner', icon: Camera },
          { id: 'history', label: 'Scan History', icon: History },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 gap-6"
          >
            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Shield size={24} className="text-purple-600" />
                Upload for Analysis
              </h3>
              
              <label className="relative flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-purple-500 transition-all bg-gradient-to-br from-slate-50 to-purple-50/30 hover:from-purple-50 hover:to-pink-50/30 group overflow-hidden">
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
                
                <div className="relative z-10 flex flex-col items-center justify-center pt-5 pb-6">
                  {selectedImage ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative"
                    >
                      <img src={selectedImage} alt="Selected" className="max-h-80 rounded-xl shadow-2xl" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
                    </motion.div>
                  ) : (
                    <>
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 shadow-xl"
                      >
                        <Upload className="w-10 h-10 text-white" />
                      </motion.div>
                      <p className="mb-2 text-lg font-bold text-slate-700">
                        <span className="text-purple-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-sm text-slate-500 font-medium">PNG, JPG or JPEG (MAX. 10MB)</p>
                      <p className="text-xs text-slate-400 mt-2">Powered by YOLOv8 & EfficientNet</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={analyzing}
                />
              </label>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  <Camera size={18} />
                  Take Photo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-purple-500 hover:text-purple-600 transition-all"
                >
                  <History size={18} />
                  View History
                </motion.button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {analyzing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
                >
                  <div className="flex flex-col items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-600 mb-4"
                    />
                    <p className="text-lg font-bold text-slate-900 mb-2">Analyzing Quality...</p>
                    <p className="text-sm text-slate-500">Processing with AI models</p>
                    
                    <div className="w-full mt-6 space-y-2">
                      {['Detection', 'Classification', 'Quality Assessment'].map((step, i) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.3 }}
                          className="flex items-center gap-3"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                            className="w-2 h-2 rounded-full bg-purple-600"
                          />
                          <span className="text-sm text-slate-600">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {result && result.success && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Overall Score Card */}
                  <div className={`relative rounded-2xl p-6 shadow-2xl overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradeColor(result.overall_grade)}`} />
                    <div className="absolute inset-0 bg-grid-white opacity-10" />
                    
                    <div className="relative z-10 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Award size={32} />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black">{result.overall_grade}</h3>
                            <p className="text-sm opacity-90">Quality Grade</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-5xl font-black">{result.overall_quality_score.toFixed(1)}</div>
                          <p className="text-sm opacity-90">Score</p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-4 mb-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.overall_quality_score}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-4 rounded-full bg-white shadow-lg"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                          <p className="text-xs opacity-75 mb-1">Confidence</p>
                          <p className="text-lg font-bold">98.5%</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                          <p className="text-xs opacity-75 mb-1">Detections</p>
                          <p className="text-lg font-bold">{result.total_detections}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                          <p className="text-xs opacity-75 mb-1">Processing</p>
                          <p className="text-lg font-bold">2.3s</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature Analysis */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                      <Target size={20} className="text-purple-600" />
                      Feature Analysis
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {result.detections[0] && Object.entries(result.detections[0].features).filter(([key]) => key !== 'defects').map(([key, value]) => (
                        <div key={key} className="bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl p-4">
                          <p className="text-xs text-slate-600 font-medium mb-2 capitalize">{key.replace('_', ' ')}</p>
                          <div className="flex items-end gap-2">
                            <p className="text-2xl font-black text-slate-900">{typeof value === 'number' ? value.toFixed(1) : value}</p>
                            <TrendingUp size={16} className="text-green-600 mb-1" />
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600"
                              style={{ width: `${typeof value === 'number' ? value : 0}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Technology Stack */}
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-lg text-white">
                    <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                      <Brain size={20} />
                      AI Technology Stack
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(result.technology_stack).map(([key, value]) => (
                        <div key={key} className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                          <p className="text-xs opacity-75 mb-1 capitalize">{key.replace('_', ' ')}</p>
                          <p className="font-bold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg"
                    >
                      <Download size={18} />
                      Export
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-lg"
                    >
                      <Share2 size={18} />
                      Share
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-sm"
                    >
                      <Eye size={18} />
                      Details
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          >
            <h3 className="text-xl font-black text-slate-900 mb-6">Recent Scans</h3>
            <div className="space-y-4">
              {scanHistory.map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <img src={scan.image} alt={scan.crop} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{scan.crop}</p>
                    <p className="text-sm text-slate-500">{scan.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getGradeColor(scan.grade)} text-white`}>
                      {scan.grade}
                    </span>
                    <p className="text-sm text-slate-600 mt-1">{scan.score}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-black text-slate-900 mb-4">Quality Trends</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {[85, 88, 92, 87, 94, 91, 95].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-pink-600 rounded-t-xl relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {height}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-black text-slate-900 mb-4">Grade Distribution</h3>
              <div className="space-y-3">
                {[
                  { grade: 'Premium', percentage: 68, color: 'from-green-500 to-emerald-600' },
                  { grade: 'Grade A', percentage: 22, color: 'from-blue-500 to-cyan-600' },
                  { grade: 'Grade B', percentage: 8, color: 'from-yellow-500 to-amber-600' },
                  { grade: 'Grade C', percentage: 2, color: 'from-orange-500 to-red-600' },
                ].map((item, i) => (
                  <div key={item.grade}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-900">{item.grade}</span>
                      <span className="text-sm font-bold text-slate-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                        className={`h-3 rounded-full bg-gradient-to-r ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
