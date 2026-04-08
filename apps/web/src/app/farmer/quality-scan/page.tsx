'use client';

import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, Shield, CheckCircle, AlertTriangle, 
  Sparkles, ArrowRight, Activity, Eye,
  Zap, LayoutGrid, BarChart3, Droplets, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Detection {
  box: number[];
  label: string;
  confidence: number;
}

interface ScanResult {
  grade: string;
  health_score: number;
  moisture: number;
  confidence: number;
  defects: string[];
  recommendation: string;
  detections: Detection[];
  // Certificate fields (only from /quality-scan)
  certificate_id?: string;
  crop_type?: string;
  blockchain_hash?: string;
  timestamp?: string;
}

const GRADE_CONFIG: Record<string, { bg: string; text: string; glow: string; label: string }> = {
  'Premium': { bg: 'bg-emerald-500', text: 'text-emerald-600', glow: 'shadow-emerald-500/40', label: 'Export Premium' },
  'Grade A': { bg: 'bg-green-500',   text: 'text-green-600',   glow: 'shadow-green-500/40',   label: 'High Quality' },
  'Grade B': { bg: 'bg-amber-500',   text: 'text-amber-600',   glow: 'shadow-amber-500/40',   label: 'Standard' },
  'Grade C': { bg: 'bg-red-500',     text: 'text-red-600',     glow: 'shadow-red-500/40',     label: 'Needs Attention' },
  'Rejected': { bg: 'bg-red-700',    text: 'text-red-700',     glow: 'shadow-red-700/40',     label: 'Rejected' },
  // Legacy support
  'A+': { bg: 'bg-emerald-500', text: 'text-emerald-600', glow: 'shadow-emerald-500/40', label: 'Export Premium' },
  'A':  { bg: 'bg-green-500',   text: 'text-green-600',   glow: 'shadow-green-500/40',   label: 'High Quality' },
  'B':  { bg: 'bg-amber-500',   text: 'text-amber-600',   glow: 'shadow-amber-500/40',   label: 'Standard' },
  'C':  { bg: 'bg-red-500',     text: 'text-red-600',     glow: 'shadow-red-500/40',     label: 'Needs Attention' },
};

export default function AIQualityScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [certResult, setCertResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imgDimensions, setImgDimensions] = useState({ w: 640, h: 640 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Use FileReader for base64 Data URL instead of blob:
      // This guarantees rendering without CSP issues
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      setResult(null);
      setCertResult(null);
      setError(null);
    }
  };

  const onImageLoad = () => {
    if (imgRef.current) {
      setImgDimensions({
        w: imgRef.current.naturalWidth,
        h: imgRef.current.naturalHeight
      });
    }
  };

  const startScan = async () => {
    if (!file) return;

    setScanning(true);
    setProgress(0);
    setError(null);
    setResult(null);
    setCertResult(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 12;
      });
    }, 300);

    try {
      // Step 1: Raw AI analysis (with bounding boxes)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('crop_type', 'Auto'); // Auto-detect crop type

      // Use environment variable for AI service URL
      const aiServiceUrl = process.env.NEXT_PUBLIC_QUALITY_SHIELD_URL || 'http://localhost:8001';
      const response = await fetch(`${aiServiceUrl}/api/v1/trust/quality-scan`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `AI returned status ${response.status}`);
      }
      
      const data: ScanResult = await response.json();

      clearInterval(interval);
      setProgress(95);

      // Step 2: Generate blockchain certificate (optional - same endpoint)
      // Already included in the first call, so we can skip this
      setCertResult(data);

      setProgress(100);
      setTimeout(() => {
        setResult(data);
        setScanning(false);
        toast.success(`AI Analysis Complete — Grade: ${data.grade}`);
      }, 400);
    } catch (err: any) {
      clearInterval(interval);
      setScanning(false);
      setError(err.message || 'AI Service Connection Failed');
      toast.error(err.message || 'AI Service Connection Failed');
    }
  };

  const gradeStyle = GRADE_CONFIG[result?.grade || 'A'] || GRADE_CONFIG['A'];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-4 text-emerald-600 font-bold tracking-widest uppercase text-sm">
              <Zap size={18} />
              YOLOv8 + EfficientNet Pipeline
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              AI Quality <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">Shield</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl">
              Real computer vision analysis — defect detection, freshness classification, and blockchain-verified certification.
            </p>
          </motion.div>
          <div className="flex items-center gap-3">
             <div className="px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-3 font-bold text-slate-700">
               <Shield className="text-emerald-500" size={20} />
               Real AI Models
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative border-4 border-dashed rounded-[3rem] p-12 text-center transition-all overflow-hidden ${
                preview ? 'border-emerald-500/30 bg-emerald-50/20' : 'border-slate-200 bg-white shadow-xl hover:border-emerald-500/50'
              }`}
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
                  <div className="h-24 w-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Camera size={42} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Capture or Upload</h3>
                  <p className="text-slate-500 font-medium mb-8">Upload crop images for real AI-powered quality analysis</p>
                  <button className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-3 mx-auto">
                    <Upload size={20} />
                    Select Crop Image
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Image with bounding box overlay */}
                  <div className="relative overflow-hidden rounded-[2rem] shadow-2xl bg-black flex items-center justify-center h-96">
                    <div className="relative inline-block h-full w-full flex justify-center">
                      <div className="relative" style={{ height: '100%', aspectRatio: imgDimensions.w / imgDimensions.h }}>
                        <img 
                          ref={imgRef}
                          src={preview} 
                          alt="Crop preview" 
                          className="absolute inset-0 w-full h-full object-contain" 
                          onLoad={onImageLoad}
                        />
                        
                        {/* YOLO Bounding Boxes */}
                        {result?.detections && result.detections.length > 0 && (
                          <div className="absolute inset-0 pointer-events-none">
                            {result.detections.map((det, idx) => {
                              const scaleX = 100 / imgDimensions.w;
                              const scaleY = 100 / imgDimensions.h;
                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.15 }}
                                  className="absolute border-2 border-red-500 bg-red-500/10 rounded-sm"
                                  style={{
                                    left: `${det.box[0] * scaleX}%`,
                                    top: `${det.box[1] * scaleY}%`,
                                    width: `${(det.box[2] - det.box[0]) * scaleX}%`,
                                    height: `${(det.box[3] - det.box[1]) * scaleY}%`,
                                  }}
                                >
                                  <span className="absolute -top-5 left-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase whitespace-nowrap">
                                    {det.label} • {Math.round(det.confidence * 100)}%
                                  </span>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Scanning Overlay */}
                        {scanning && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                            <Sparkles className="animate-spin text-emerald-400 mb-6" size={64} />
                            <h3 className="text-3xl font-black mb-2 animate-pulse">Running AI Inference...</h3>
                            <p className="text-emerald-300/80 text-sm mb-4 font-medium">YOLOv8 → EfficientNet → Blockchain</p>
                            <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-emerald-400" 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="mt-4 text-emerald-300 font-bold uppercase tracking-widest text-xs">{Math.round(progress)}% Complete</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!scanning && (
                    <div className="flex gap-4">
                      <button 
                        onClick={startScan}
                        className="flex-1 h-16 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-3"
                      >
                        <Zap size={24} />
                        Run AI Analysis
                      </button>
                      <button 
                        onClick={() => { setPreview(null); setFile(null); setResult(null); setCertResult(null); setError(null); }}
                        className="h-16 px-8 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4"
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
                  {/* Grade Card */}
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6">
                      <div className={`h-24 w-24 ${gradeStyle.bg} rounded-[2rem] flex flex-col items-center justify-center text-white rotate-12 shadow-xl ${gradeStyle.glow} group-hover:rotate-0 transition-transform`}>
                        <span className="text-[10px] font-black uppercase opacity-70">Grade</span>
                        <span className="text-4xl font-black">{result.grade}</span>
                      </div>
                    </div>

                    <div className="pt-2 pr-28">
                      <div className={`flex items-center gap-3 ${gradeStyle.text} font-bold mb-2`}>
                        <Activity size={20} />
                        {gradeStyle.label}
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-6">{certResult?.crop_type || 'Crop'} Analysis</h3>
                      
                      {/* Metrics Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 size={14} className="text-slate-400" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Health</p>
                          </div>
                          <p className="text-2xl font-black text-slate-900">{result.health_score}<span className="text-sm text-slate-400">/100</span></p>
                          <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${result.health_score > 85 ? 'bg-emerald-500' : result.health_score > 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${result.health_score}%` }}
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Droplets size={14} className="text-blue-400" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Moisture</p>
                          </div>
                          <p className="text-2xl font-black text-slate-900">{result.moisture}<span className="text-sm text-slate-400">%</span></p>
                          <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full transition-all duration-1000" style={{ width: `${(result.moisture / 18) * 100}%` }} />
                          </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Target size={14} className="text-purple-400" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Confidence</p>
                          </div>
                          <p className="text-2xl font-black text-slate-900">{Math.round(result.confidence * 100)}<span className="text-sm text-slate-400">%</span></p>
                          <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-400 rounded-full transition-all duration-1000" style={{ width: `${result.confidence * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Defects Detected */}
                  <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                        <Eye size={20} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">Defects Detected</h4>
                      <span className={`ml-auto text-xs font-black uppercase px-3 py-1 rounded-full ${
                        result.defects[0] === 'None Detected' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {result.defects[0] === 'None Detected' ? 'CLEAN' : `${result.defects.length} ISSUE${result.defects.length > 1 ? 'S' : ''}`}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {result.defects.map((defect, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <div className={`h-2 w-2 rounded-full ${defect === 'None Detected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <span className="text-sm font-medium text-slate-700">{defect}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                    <Sparkles className="absolute top-[-20px] right-[-20px] text-emerald-500/20" size={200} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                          <CheckCircle size={20} />
                        </div>
                        <h4 className="text-xl font-bold">AI Recommendation</h4>
                      </div>
                      <p className="text-emerald-50 text-lg leading-relaxed font-medium mb-6">
                        &ldquo;{result.recommendation}&rdquo;
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full animate-ping ${result.grade.includes('A') ? 'bg-emerald-500' : result.grade === 'B' ? 'bg-amber-500' : 'bg-red-500'}`} />
                          <span className={`font-black tracking-widest uppercase text-xs ${result.grade.includes('A') ? 'text-emerald-500' : result.grade === 'B' ? 'text-amber-500' : 'text-red-500'}`}>
                            {result.grade.includes('A') ? 'Export Ready' : result.grade === 'B' ? 'Local Market' : 'Needs Processing'}
                          </span>
                        </div>
                        <button className="h-12 px-6 bg-emerald-600 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-500 transition-all">
                          Get Certificate
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Proof */}
                  {certResult?.blockchain_hash && (
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-lg flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                          <Shield size={24} />
                        </div>
                        <div>
                          <p className="text-slate-900 font-black text-sm">Blockchain Certificate</p>
                          <p className="text-slate-400 font-mono text-[10px]">{certResult.blockchain_hash.slice(0, 32)}...</p>
                          <p className="text-blue-500 font-bold text-[10px] mt-1">ID: {certResult.certificate_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <LayoutGrid size={16} />
                        Verified
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border border-slate-200 opacity-60">
                  <Activity size={64} className="text-slate-200 mb-6" />
                  <h3 className="text-2xl font-black text-slate-300">Awaiting AI Analysis</h3>
                  <p className="text-slate-400 mt-2 font-medium">Upload a crop image and click &ldquo;Run AI Analysis&rdquo;</p>
                  <div className="mt-8 flex flex-col gap-2 text-left text-sm text-slate-400">
                    <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> YOLOv8 Defect Detection</div>
                    <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> EfficientNet Freshness Classification</div>
                    <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-purple-500" /> HSV Moisture Estimation</div>
                    <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Blockchain Certificate Generation</div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
