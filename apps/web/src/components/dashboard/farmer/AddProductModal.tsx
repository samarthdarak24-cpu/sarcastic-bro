"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, MapPin, Navigation, Check, Loader2, Calendar, 
  Award, ArrowRight, ArrowLeft, Package, ShieldCheck, 
  IndianRupee, Layers, Zap, Sparkles, Activity, Target,
  Globe, Cpu, ScanLine, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import dynamic from 'next/dynamic';
import { CropQualityDetector } from "./CropQualityDetector";

const MapPicker = dynamic(() => import('./MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-48 w-full bg-neut-50 flex items-center justify-center rounded-[2rem] animate-pulse text-[10px] font-black text-neut-300 uppercase tracking-widest">Initializing Geo-Service...</div>
});

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    unit: "kg",
    qualityGrade: "B",
    qualityScore: 85,
    harvestDate: "",
    district: "",
    state: "",
    lat: null as number | null,
    lng: null as number | null,
    address: "",
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        setLocLoading(false);
        toast.success("GPS Coordinates Locked");
      },
      () => {
        setLocLoading(false);
        toast.error("GPS Signal Failed");
      }
    );
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.quantity) {
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      const { productService } = await import("@/services/productService");
      await productService.create({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        qualityGrade: formData.qualityGrade,
        qualityScore: formData.qualityScore,
        harvestDate: formData.harvestDate || new Date().toISOString(),
        district: formData.district,
        state: formData.state,
        location: formData.lat && formData.lng ? {
          type: "Point",
          coordinates: [formData.lng, formData.lat]
        } : undefined,
        address: formData.address
      });
      toast.success("Product Secured & Listed on Marketplace");
      onClose();
      setStep(1);
      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        unit: "kg",
        qualityGrade: "B",
        qualityScore: 85,
        harvestDate: "",
        district: "",
        state: "",
        lat: null,
        lng: null,
        address: "",
      });
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const steps = [
    { id: 1, title: "Identity", icon: Package, subtitle: "Entity Definition" },
    { id: 2, title: "Quality", icon: ScanLine, subtitle: "AI Verification" },
    { id: 3, title: "Capital", icon: IndianRupee, subtitle: "Market Indexing" },
    { id: 4, title: "Geospatial", icon: Globe, subtitle: "Origin Lock" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-neut-900/60 backdrop-blur-2xl"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 40, rotateX: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col xl:flex-row min-h-[700px]"
      >
        {/* 📋 Multi-Step Sidebar Navigator */}
        <aside className="xl:w-[350px] bg-neut-900 text-white p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none">
                <Sparkles size={300} />
            </div>

            <div className="space-y-12 relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-12 w-12 bg-brand-primary rounded-2xl flex items-center justify-center font-black text-2xl shadow-glow-primary">F</div>
                    <h2 className="text-2xl font-black tracking-tighter">FarmGuard<span className="text-brand-primary">.AI</span></h2>
                </div>

                <div className="space-y-8">
                    {steps.map((s) => (
                        <div key={s.id} className="flex items-center gap-6 group">
                            <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${
                                step === s.id ? "bg-brand-primary text-white shadow-glow-primary scale-110" : 
                                step > s.id ? "bg-success/20 text-success" : "bg-white/5 text-white/20"
                            }`}>
                                {step > s.id ? <Check size={20} strokeWidth={3} /> : <s.icon size={20} />}
                            </div>
                            <div className="space-y-0.5">
                                <p className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${step === s.id ? "text-brand-primary" : "text-white/20"}`}>{s.subtitle}</p>
                                <p className={`font-black text-sm tracking-tight transition-colors ${step >= s.id ? "text-white" : "text-white/20"}`}>{s.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <Activity size={16} className="text-brand-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Protocol Status</span>
                </div>
                <p className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-wide italic">"Standardized trade node listing enabled for verified agricultural clusters."</p>
            </div>
        </aside>

        {/* ⚡ Dynamic Form Stage */}
        <main className="flex-1 p-12 lg:p-20 relative flex flex-col justify-between overflow-y-auto custom-scrollbar">
            <button 
                onClick={onClose}
                className="absolute top-10 right-10 h-12 w-12 rounded-2xl border border-neut-100 flex items-center justify-center text-neut-300 hover:text-neut-900 hover:bg-neut-50 transition-all z-10"
            >
                <X size={24} />
            </button>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-12"
                >
                    {step === 1 && (
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <Badge tone="brand" className="h-7 px-4 rounded-xl flex items-center justify-center font-black gap-2 shadow-sm uppercase text-[8px] tracking-[0.2em] border-none">IDENTITY PHASE</Badge>
                                <h3 className="text-5xl font-black text-neut-900 tracking-tighter">Define the Batch Asset.</h3>
                                <p className="text-lg font-medium text-neut-400">Initialize the digital twin for your agricultural output.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-neut-300 uppercase tracking-[0.4em]">Asset Name</label>
                                    <Input 
                                        placeholder="e.g. Premium Basmati Kernels" 
                                        className="h-16 px-6 rounded-2xl bg-neut-50 border-none font-bold text-neut-900"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-neut-300 uppercase tracking-[0.4em]">Node Collection</label>
                                    <select 
                                        className="w-full h-16 px-6 rounded-2xl bg-neut-50 border-none font-bold text-neut-900 appearance-none outline-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    >
                                        <option value="">Select Cluster Type...</option>
                                        <option value="GRAIN">Grains & Pulses</option>
                                        <option value="SPICE">World Spices</option>
                                        <option value="FRUIT">Organic Fruits</option>
                                        <option value="HANDICRAFT">Handicrafts</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <Badge tone="brand" className="h-7 px-4 rounded-xl flex items-center justify-center font-black gap-2 shadow-sm uppercase text-[8px] tracking-[0.2em] border-none">QUALITY SCAN</Badge>
                                <h3 className="text-5xl font-black text-neut-900 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neut-900 to-brand-primary">Neural Verification.</h3>
                                <p className="text-lg font-medium text-neut-400">Apply AI vision to detect grade and defect metrics.</p>
                            </div>
                            
                            <div className="p-8 border-2 border-dashed border-neut-100 rounded-[3rem] bg-neut-50/50 flex flex-col items-center justify-center gap-6 group transition-all hover:bg-white hover:border-brand-primary/20 hover:shadow-2xl">
                                <div className="h-24 w-24 bg-white rounded-[2.5rem] flex items-center justify-center text-neut-200 group-hover:text-brand-primary transition-all shadow-xl group-hover:scale-110">
                                    <Camera size={48} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-neut-900 uppercase tracking-widest mb-1">SCAN BATCH MEDIA</p>
                                    <p className="text-xs font-bold text-neut-400">High-res samples required for Grade A verification.</p>
                                </div>
                                <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-[0.2em] h-10 border-neut-200">START ANALYSIS</Button>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex-1 h-20 px-8 bg-white border border-neut-100 rounded-2xl flex items-center justify-between">
                                    <span className="text-xs font-black text-neut-400 uppercase tracking-widest">Digital Grade</span>
                                    <span className="text-4xl font-black text-brand-primary tracking-tighter">A+</span>
                                </div>
                                <div className="h-20 px-8 bg-neut-900 text-white rounded-2xl flex items-center justify-between flex-1">
                                    <span className="text-xs font-black text-white/30 uppercase tracking-widest">CONFIDENCE</span>
                                    <span className="text-2xl font-black text-white tracking-tighter">98.2%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-10 text-center lg:text-left">
                            <div className="space-y-4">
                                <Badge tone="brand" className="h-7 px-4 rounded-xl flex items-center justify-center font-black gap-2 shadow-sm uppercase text-[8px] tracking-[0.2em] border-none mx-auto lg:mx-0">CAPITAL VALUE</Badge>
                                <h3 className="text-5xl font-black text-neut-900 tracking-tighter">Market Indexing.</h3>
                                <p className="text-lg font-medium text-neut-400">Define price floors and fulfillment volume levels.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="p-10 bg-neut-50 rounded-[3rem] space-y-6">
                                    <label className="text-[10px] font-black text-neut-300 uppercase tracking-[0.4em]">Target Price</label>
                                    <div className="relative">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black text-neut-300 pointer-events-none">₹</span>
                                        <Input 
                                            placeholder="0.00" 
                                            className="h-20 pl-8 bg-transparent border-none text-5xl font-black text-neut-900 tracking-tighter placeholder:text-neut-100 focus-visible:ring-0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        {['KG', 'TON', 'BAG'].map(u => (
                                            <button key={u} onClick={() => setFormData({...formData, unit: u})} className={`h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all ${formData.unit === u ? 'bg-neut-900 text-white shadow-xl' : 'bg-white text-neut-300 hover:text-neut-500'}`}>
                                                {u}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-10 bg-brand-primary/5 rounded-[3rem] space-y-6 border border-brand-primary/10">
                                    <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">Listing Volume</label>
                                    <div className="relative">
                                        <Input 
                                            placeholder="Set Quantity" 
                                            className="h-20 bg-transparent border-none text-5xl font-black text-neut-900 tracking-tighter placeholder:text-brand-primary/10 focus-visible:ring-0"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                        />
                                        <Package className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-primary/20" size={40} />
                                    </div>
                                    <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Optimal listing: 250+ KG Recommended</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <Badge tone="brand" className="h-7 px-4 rounded-xl flex items-center justify-center font-black gap-2 shadow-sm uppercase text-[8px] tracking-[0.2em] border-none">ORIGIN LOCK</Badge>
                                <h3 className="text-5xl font-black text-neut-900 tracking-tighter">Geospatial Sync.</h3>
                                <p className="text-lg font-medium text-neut-400">Lock the farm-gate origin for immutable logistics.</p>
                            </div>

                            <div className="h-[350px] w-full rounded-[3rem] overflow-hidden bg-neut-50 border border-neut-100 flex items-center justify-center text-neut-300 relative group">
                                <MapPicker />
                                <div className="absolute inset-0 bg-neut-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                                    <div className="flex flex-col items-center gap-4 scale-90 group-hover:scale-100 transition-all duration-700">
                                         <div className="h-20 w-20 bg-brand-primary rounded-[1.75rem] flex items-center justify-center text-white shadow-glow-primary">
                                             <Navigation size={36} className="animate-pulse" />
                                         </div>
                                         <p className="text-white font-black text-sm uppercase tracking-widest">DRAG PIN TO ORIGIN</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <Button 
                                    variant="outline" 
                                    onClick={handleGetLocation} 
                                    className="h-16 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest border-neut-200 hover:border-brand-primary transition-all"
                                    disabled={locLoading}
                                >
                                    {locLoading ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
                                    REFRESH GPS NODE
                                </Button>
                                <div className="h-16 px-6 bg-neut-50 rounded-2xl flex items-center gap-4 border border-neut-100">
                                    <Globe size={20} className="text-brand-secondary" />
                                    <span className="text-[10px] font-black text-neut-900 uppercase tracking-widest truncate">{formData.address || "Searching Sourcing Hub..."}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* 🛠️ Global Navigation Controls */}
            <div className="pt-16 mt-auto flex items-center justify-between border-t border-neut-100 relative z-10">
                {step > 1 ? (
                    <Button 
                        variant="ghost" 
                        onClick={prevStep}
                        className="h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest text-neut-400 hover:bg-neut-50 flex items-center gap-3"
                    >
                        <ArrowLeft size={18} />
                        PREVIOUS STAGE
                    </Button>
                ) : (
                    <div />
                )}

                {step < 4 ? (
                    <Button 
                        variant="gradient" 
                        onClick={nextStep}
                        className="h-16 px-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-glow-primary hover:scale-[1.02] transition-transform flex items-center gap-3"
                    >
                        PROCEED TO {steps[step].title}
                        <ArrowRight size={20} strokeWidth={3} />
                    </Button>
                ) : (
                    <Button 
                        variant="gradient" 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="h-16 px-16 rounded-2xl font-black text-xl uppercase tracking-widest shadow-glow-primary hover:scale-105 transition-all flex items-center gap-3 btn-glow"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : (
                            <>
                                SECURE LISTING
                                <Zap size={24} fill="white" />
                            </>
                        )}
                    </Button>
                )}
            </div>
        </main>
      </motion.div>
    </div>
  );
}
