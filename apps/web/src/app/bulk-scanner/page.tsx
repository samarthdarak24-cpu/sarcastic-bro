'use client';

import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, Shield, CheckCircle, AlertTriangle, 
  Sparkles, ArrowRight, Activity, Eye, Zap, LayoutGrid, 
  BarChart3, Package, TrendingUp, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ItemAnalysis {
  item_id: number;
  bbox: number[];
  status: 'GOOD' | 'DEFECTED';
  quality_score: number;
  detection_confidence: number;
  defect_reasons: string[];
  features: {
    color_uniformity: number;
    texture_score: number;
    shape_regularity: number;
  };
}

interface BulkScanResult {
  success: boolean;
  crop_type: string;
  total_items: number;
  good_items: number;
  defective_items: number;
  quality_percentage: number;
  grade: string;
  export_readiness: {
    export_ready: boolean;
    market_recommendation: string;
    price_multiplier: number;
    confidence: string;
  };
  recommendation: string;
  items: ItemAnalysis[];
  visualization_base64: string;
  technology_stack: {
    detection: string;
    classification: string;
    preprocessing: string;
    grading: string;
  };
}

const GRADE_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  'A+': { bg: 'bg-emerald-500', text: 'text-emerald-600', glow: 'shadow-emerald-500/40' },
  'A':  { bg: 'bg-green-500',   text: 'text-green-600',   glow: 'shadow-green-500/40' },
  'B+': { bg: 'bg-lime-500',    text: 'text-lime-600',    glow: 'shadow-lime-500/40' },
  'B':  { bg: 'bg-yellow-500',  text: 'text-yellow-600',  glow: 'shadow-yellow-500/40' },
  'C':  { bg: 'bg-orange-500',  text: 'text-orange-600',  glow: 'shadow-orange-500/40' },
  'D':  { bg: 'bg-red-500',     text: 'text-red-600',     glow: 'shadow-red-500/40' },
};

export default function BulkScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<BulkScanResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const startScan = async () => {
    if (!file) return;

    setScanning(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('return_visualization', 'true');

      const aiServiceUrl = process.env.NEXT_PUBLIC_QUALITY_SHIELD_URL || 'http://localhost:8001';
      const response = await fetch(`${aiServiceUrl}/quality-shield/bulk-scan`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `AI returned status ${response.status}`);
      }
      
      const data: BulkScanResult = await response.json();

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setResult(data);
        setScanning(false);
        toast.success(`Bulk Analysis Complete — ${data.total_items} items detected!`);
      }, 400);
    } catch (err: any) {
      clearInterval(interval);
      setScanning(false);
      setError(err.message || 'AI Service Connection Failed');
      toast.error(err.message || 'AI Service Connection Failed');
    }
  };

  const gradeStyle = result ? (GRADE_COLORS[result.grade] || GRADE_COLORS['B']) : GRADE_COLORS['B'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4 text-emerald-600 font-bold tracking-widest uppercase text-sm">
            <Zap size={18} />
            Industry-Grade Bulk Analysis
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            Bulk Crop <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600">Quality Scanner</span>
          </h1>
          <p className="text-slate-600 text-lg font-medium max-w-3xl">
            YOLOv8 instance detection + per-item quality analysis. Detects multiple crops, classifies each as GOOD or DEFECTED, and provides batch-level export readiness insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative border-4 border-dashed rounded-[3rem] p-12 text-center transition-all overflow-hidden bg-white shadow-2xl"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onFileSelect} 
                className="hidden" 
                accept="image/*"
              />

              {!preview ? (
                <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer group">
                  <div className="h-32 w-32 bg-gradient-to-br from-emerald-500 to-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                    <Package size={64} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Upload Bulk Crops</h3>
                  <p className="text-slate-500 font-medium mb-8">Upload images with multiple crops for batch analysis</p>
                  <button className="h-16 px-10 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-3 mx-auto">
                    <Upload size={24} />
                    Select Image
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-[2rem] shadow-2xl bg-black">
                    {result && result.visualization_base64 ? (
                      <img 
                        src={`data:image/jpeg;base64,${result.visualization_base64}`}
                        alt="Analysis result with bounding boxes" 
                        className="w-full h-auto"
                      />
                    ) : (
                      <img 
                        src={preview} 
                        alt="Crop preview" 
                        className="w-full h-auto"
                      />
                    )}
                    
                    {scanning && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                        <Sparkles className="animate-spin text-emerald-400 mb-6" size={64} />
                        <h3 className="text-3xl font-black mb-2 animate-pulse">Analyzing Batch...</h3>
                        <p className="text-emerald-300 text-sm mb-4 font-medium">YOLOv8 Detection → Per-Item Analysis</p>
                        <div className="w-72 h-3 bg-white/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-blue-500" 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="mt-4 text-emerald-300 font-bold text-sm">{Math.round(progress)}%</p>
                      </div>
                    )}
                  </div>

                  {!scanning && (
                    <div className="flex gap-4">
                      <button 
                        onClick={startScan}
                        className="flex-1 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                      >
                        <Zap size={24} />
                        Run Bulk Analysis
                      </button>
                      <button 
                        onClick={() => { setPreview(null); setFile(null); setResult(null); setError(null); }}
                        className="h-16 px-8 bg-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-300 transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-4"
              >
                <AlertTriangle className="text-red-500 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-red-800 mb-1">Analysis Failed</h4>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Batch Summary Card */}
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6">
                      <div className={`h-28 w-28 ${gradeStyle.bg} rounded-[2rem] flex flex-col items-center justify-center text-white shadow-2xl ${gradeStyle.glow}`}>
                        <span className="text-xs font-black uppercase opacity-80">Grade</span>
                        <span className="text-5xl font-black">{result.grade}</span>
                      </div>
                    </div>

                    <div className="pr-32">
                      <h3 className="text-3xl font-black text-slate-900 mb-2">{result.crop_type} Batch</h3>
                      <p className="text-slate-600 font-medium mb-6">{result.total_items} items detected</p>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={16} className="text-emerald-600" />
                            <p className="text-xs font-black uppercase text-emerald-600">Good</p>
                          </div>
                          <p className="text-3xl font-black text-emerald-700">{result.good_items}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={16} className="text-red-600" />
                            <p className="text-xs font-black uppercase text-red-600">Defected</p>
                          </div>
                          <p className="text-3xl font-black text-red-700">{result.defective_items}</p>
                        </div>
                      </div>

                      {/* Quality Percentage */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-slate-600">Quality Percentage</span>
                          <span className="text-2xl font-black text-slate-900">{result.quality_percentage}%</span>
                        </div>
                        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${gradeStyle.bg} transition-all duration-1000`}
                            style={{ width: `${result.quality_percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Export Readiness */}
                  <div className={`rounded-[2rem] p-6 ${result.export_readiness.export_ready ? 'bg-gradient-to-br from-emerald-500 to-blue-600' : 'bg-gradient-to-br from-orange-500 to-red-600'} text-white shadow-2xl`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Award size={24} />
                      <h4 className="text-xl font-black">Export Readiness</h4>
                    </div>
                    <p className="text-2xl font-black mb-2">{result.export_readiness.market_recommendation}</p>
                    <p className="text-sm opacity-90 mb-4">Price Multiplier: {result.export_readiness.price_multiplier}x • Confidence: {result.export_readiness.confidence}</p>
                    <div className="flex items-center gap-2">
                      {result.export_readiness.export_ready ? (
                        <><CheckCircle size={18} /> <span className="font-bold">Export Ready</span></>
                      ) : (
                        <><AlertTriangle size={18} /> <span className="font-bold">Not Export Ready</span></>
                      )}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp size={20} />
                      <h4 className="text-lg font-bold">AI Recommendation</h4>
                    </div>
                    <p className="text-emerald-50 leading-relaxed">{result.recommendation}</p>
                  </div>

                  {/* Technology Stack */}
                  <div className="bg-white rounded-[2rem] p-6 border-2 border-slate-200 shadow-lg">
                    <h4 className="text-sm font-black uppercase text-slate-400 mb-4">Technology Stack</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-500 font-medium">Detection</p>
                        <p className="font-bold text-slate-900">{result.technology_stack.detection}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Classification</p>
                        <p className="font-bold text-slate-900">{result.technology_stack.classification}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Preprocessing</p>
                        <p className="font-bold text-slate-900">{result.technology_stack.preprocessing}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Grading</p>
                        <p className="font-bold text-slate-900">{result.technology_stack.grading}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border-2 border-slate-200 opacity-60">
                  <Package size={64} className="text-slate-200 mb-6" />
                  <h3 className="text-2xl font-black text-slate-300 mb-2">Awaiting Bulk Analysis</h3>
                  <p className="text-slate-400 font-medium">Upload bulk crops and click "Run Bulk Analysis"</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
