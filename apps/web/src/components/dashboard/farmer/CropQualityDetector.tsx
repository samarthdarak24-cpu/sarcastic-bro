"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Loader2,
  Sparkles,
  Search,
  History,
  Info,
  Maximize2,
  RefreshCw,
  BadgeAlert
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import toast from "react-hot-toast";

interface BBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
}

interface QualityResult {
  grade: "A" | "B" | "C";
  score: number;
  defects: number;
  color_quality: string;
  size_uniformity: number;
  freshness_score: number;
  damaged_percent: number;
  recommendations: string[];
  confidence: number;
  processing_time_ms: number;
  bboxes: BBox[];
  disease: string;
}

interface CropQualityDetectorProps {
  onQualityDetected?: (grade: string) => void;
  productName?: string;
  productType?: string;
}

export function CropQualityDetector({ onQualityDetected, productName, productType }: CropQualityDetectorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QualityResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle drawing bounding boxes on canvas
  useEffect(() => {
    if (result && result.bboxes && canvasRef.current && imageRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = imageRef.current;

        if (!ctx) return;

        // Set canvas internal dimensions to match display dimensions
        canvas.width = img.clientWidth;
        canvas.height = img.clientHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Scaling factors
        const scaleX = canvas.width / img.naturalWidth;
        const scaleY = canvas.height / img.naturalHeight;

        result.bboxes.forEach((bbox) => {
            const x = bbox.x * scaleX;
            const y = bbox.y * scaleY;
            const w = bbox.w * scaleX;
            const h = bbox.h * scaleY;

            // Draw Box
            ctx.strokeStyle = "#22C55E";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, w, h);

            // Draw Background for label
            ctx.fillStyle = "rgba(34, 197, 94, 0.8)";
            const label = `${bbox.label} ${Math.round(bbox.confidence * 100)}%`;
            const textWidth = ctx.measureText(label).width;
            ctx.fillRect(x, y - 25, textWidth + 10, 25);

            // Draw Label text
            ctx.fillStyle = "white";
            ctx.font = "bold 12px Inter";
            ctx.fillText(label, x + 5, y - 8);
        });
    }
  }, [result]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("product_name", productName || "Crop");
    formData.append("product_type", productType || "Vegetable");

    try {
      const response: any = await api.post("/ai/quality-grade", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.success && response.data) {
        setResult(response.data);
        
        // Add to history
        const newHistoryItem = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            grade: response.data.grade,
            crop: productName || "Vegetable",
            confidence: response.data.confidence,
            image: preview
        };
        setHistory(prev => [newHistoryItem, ...prev].slice(0, 5));

        if (onQualityDetected) {
          onQualityDetected(response.data.grade);
        }
        toast.success(`Analysis Complete: Grade ${response.data.grade}`);
      }
    } catch (error) {
      console.error("Quality detection failed:", error);
      toast.error("AI Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getGradeConfig = (grade: string) => {
    switch (grade) {
      case "A":
        return { 
          color: "text-green-600", 
          bg: "bg-green-50", 
          border: "border-green-100",
          icon: <CheckCircle2 className="text-green-600" />,
          label: "Grade A (Premium)",
          badge: "brand" as const
        };
      case "B":
        return { 
          color: "text-amber-500", 
          bg: "bg-amber-50", 
          border: "border-amber-100",
          icon: <AlertTriangle className="text-amber-500" />,
          label: "Grade B (Standard)",
          badge: "amber" as const
        };
      case "C":
        return { 
          color: "text-red-500", 
          bg: "bg-red-50", 
          border: "border-red-100",
          icon: <XCircle className="text-red-500" />,
          label: "Grade C (Low)",
          badge: "ink" as const
        };
      default:
        return { 
          color: "text-slate-400", 
          bg: "bg-slate-50", 
          border: "border-slate-100",
          icon: <Info />,
          label: "Unknown",
          badge: "secondary" as const
        };
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                    <Search size={28} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-none">AI Crop Insight</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Multi-Model Quality Audit</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`rounded-xl transition-all ${showHistory ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <History size={20} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setPreview(null)} className="rounded-xl text-slate-400 hover:text-red-500">
                    <RefreshCw size={20} />
                </Button>
            </div>
        </div>

        <AnimatePresence mode="wait">
            {showHistory ? (
                <motion.div 
                    key="history"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                >
                    <h4 className="text-sm font-black text-slate-900 px-2 tracking-tight">RECENT SCANS</h4>
                    {history.length > 0 ? (
                        history.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                <img src={item.image} className="h-12 w-12 rounded-xl object-cover shadow-sm" />
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-800">{item.crop}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.date}</p>
                                </div>
                                <Badge tone={getGradeConfig(item.grade).badge as any} className="font-black">
                                    {item.grade}
                                </Badge>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-slate-400 font-bold text-sm">No scan history found yet.</p>
                        </div>
                    )}
                    <Button variant="outline" onClick={() => setShowHistory(false)} className="w-full rounded-xl font-black">Back to Scan</Button>
                </motion.div>
            ) : (
                <motion.div 
                    key="scanner"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                >
                    {!preview ? (
                        <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] p-16 flex flex-col items-center justify-center cursor-pointer hover:border-green-500/40 hover:bg-green-50/30 transition-all group relative overflow-hidden"
                        >
                        <div className="h-24 w-24 bg-white rounded-3xl flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-green-500 shadow-xl shadow-slate-200/50 transition-all mb-6">
                            <Upload size={40} />
                        </div>
                        <p className="font-black text-slate-900 text-xl">Drop Image to Analyze</p>
                        <p className="text-sm font-bold text-slate-400 mt-2">YOLOv8 + Swin Transformer Pipeline</p>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*"
                        />
                        </div>
                    ) : (
                        <div className="space-y-6">
                        <div className="relative aspect-square md:aspect-video rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-black group">
                            <img 
                                ref={imageRef}
                                src={preview} 
                                alt="Preview" 
                                className="w-full h-full object-contain" 
                            />
                            
                            {/* Canvas for Bounding Boxes */}
                            <canvas 
                                ref={canvasRef}
                                className="absolute inset-0 pointer-events-none"
                            />

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setPreview(null)}
                                    className="bg-white/20 border-white/40 text-white backdrop-blur-md hover:bg-white hover:text-slate-900 rounded-2xl font-black border-2"
                                >
                                    REPLACE IMAGE
                                </Button>
                            </div>
                            
                            {loading && (
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                                    <div className="relative h-24 w-24">
                                        <Loader2 className="h-full w-full animate-spin text-green-400 opacity-20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles className="animate-pulse text-green-400" size={32} />
                                        </div>
                                    </div>
                                    <p className="mt-6 font-black text-lg tracking-tight uppercase">Neural Processing...</p>
                                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-2 px-8 text-center">Identifying tissue anomalies with YOLOv8</p>
                                </div>
                            )}

                            {result && (
                                <motion.div 
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="absolute top-6 left-6"
                                >
                                    <div className="flex bg-white/90 backdrop-blur-md rounded-2xl p-1 shadow-xl border border-white">
                                        <div className={`px-4 py-2 rounded-xl font-black text-xs ${getGradeConfig(result.grade).color} ${getGradeConfig(result.grade).bg}`}>
                                            GRADE {result.grade}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {!result ? (
                            <Button 
                                onClick={handleUpload} 
                                disabled={loading}
                                className="w-full h-20 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-green-600 hover:to-emerald-700 text-white rounded-[1.5rem] font-black text-xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:grayscale"
                            >
                                {loading ? "PREDICTING..." : "START AI ANALYTICS"}
                            </Button>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="grid gap-6 md:grid-cols-2"
                            >
                                <div className={`p-8 rounded-[2rem] border-2 bg-white flex flex-col justify-center gap-4 shadow-sm ${getGradeConfig(result.grade).border}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                                            {getGradeConfig(result.grade).icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Market Grade</p>
                                            <h4 className={`text-2xl font-black ${getGradeConfig(result.grade).color}`}>{getGradeConfig(result.grade).label}</h4>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-black text-slate-400">Confidence</span>
                                            <span className="text-sm font-black text-slate-900">{Math.round(result.confidence)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${result.confidence}%` }}
                                                className={`h-full bg-slate-900`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2rem] border-2 border-slate-100 bg-white flex flex-col justify-center gap-4 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-red-500">
                                            <BadgeAlert size={28} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pathogen Scan</p>
                                            <h4 className="text-xl font-black text-slate-900 uppercase">
                                                {result.disease !== "None" ? result.disease : "NO DISEASE DETECTED"}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge tone="ink" className="rounded-lg text-[10px] px-3 font-black uppercase">
                                            {result.defects} DEFECTS
                                        </Badge>
                                        <Badge tone="ink" className="rounded-lg text-[10px] px-3 font-black uppercase">
                                            {result.processing_time_ms}MS LATENCY
                                        </Badge>
                                    </div>
                                </div>

                                <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-slate-950 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform group-hover:scale-110">
                                        <Info size={120} strokeWidth={1} />
                                    </div>
                                    <h5 className="text-lg font-black mb-4 flex items-center gap-2">
                                        <Sparkles className="text-green-400" size={20} />
                                        AI RECOMMENDATIONS
                                    </h5>
                                    <ul className="space-y-3 relative z-10">
                                        {result.recommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-400 text-sm font-bold bg-white/5 p-3 rounded-xl border border-white/10">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
      </Card>
      
      <div className="px-8 flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Neural Network Active
          </div>
          <div>ODOP Connect Pro V2.4</div>
      </div>
    </div>
  );
}
