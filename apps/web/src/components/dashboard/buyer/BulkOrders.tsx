"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, 
  Table, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Zap, 
  Layers, 
  ArrowRight,
  Download,
  ShieldCheck,
  Search,
  Filter,
  Package,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const BULK_PRICING = [
  { crop: "Basmati Rice", quality: "A+", vol: "10-50t", price: "₹82/kg", trend: "-2%" },
  { crop: "Guntur Chillies", quality: "Premium", vol: "5-20t", price: "₹132/kg", trend: "+4%" },
  { crop: "Organic Turmeric", quality: "High Curcumin", vol: "2-10t", price: "₹118/kg", trend: "0%" },
];

export function BulkOrders() {
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowConfirmation(true);
      toast.success("CSV Parsed: 14 Supply Clusters Identified");
    }, 2000);
  };

  return (
    <div className="space-y-12 animate-fade-in text-neut-900 border-neut-200">
      {/* Bulk Sourcing Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <Card className="lg:col-span-2 border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-12 rounded-[3.5rem] relative overflow-hidden flex flex-col justify-center min-h-[400px]">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transition-transform hover:rotate-12 duration-1000"><Table size={200} className="text-brand-secondary" /></div>
             <div className="relative z-10 space-y-8">
                <Badge tone="brand" className="h-8 px-4 rounded-xl font-black text-[10px] shadow-sm uppercase tracking-widest">Enterprise Protocol</Badge>
                <h2 className="text-5xl font-black text-neut-900 tracking-tight leading-none mb-4">Bulk Procurement & Trade Desk.</h2>
                <p className="text-lg font-medium text-neut-500 leading-relaxed max-w-xl">Automate high-volume sourcing by uploading your requirement matrices. Get verified supplier matches in seconds.</p>
                <div className="flex gap-4 pt-4">
                   <div className="relative cursor-pointer group">
                      <input 
                         type="file" 
                         className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                         accept=".csv"
                         onChange={handleFileUpload}
                         disabled={isUploading}
                      />
                      <Button variant="gradient" className="h-16 px-10 rounded-2xl font-black text-lg shadow-lg shadow-brand-secondary/20 group-hover:scale-105 transition-transform">
                         {isUploading ? "Analysing Matrix..." : "Upload Requirement CSV"}
                         <FileUp size={20} className="ml-3" />
                      </Button>
                   </div>
                   <Button variant="outline" className="h-16 px-10 rounded-2xl font-black text-lg border-neut-100 bg-white">
                      Download Template
                      <Download size={20} className="ml-3" />
                   </Button>
                </div>
             </div>
         </Card>

         <Card className="border-none shadow-startup-soft bg-neut-900 text-white p-12 rounded-[3.5rem] flex flex-col justify-between group overflow-hidden">
             <div className="space-y-4">
                <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-startup-soft"><TrendingUp size={28} /></div>
                <h3 className="text-2xl font-black tracking-tight leading-tight">Supply Elasticity Intelligence</h3>
             </div>
             <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
                 <div className="flex justify-between items-center text-sm font-bold text-white/50 uppercase tracking-widest">
                    <span>Mkt Liquidiy</span>
                    <span className="text-success shadow-glow-success">High</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-secondary shadow-glow-secondary w-3/4" />
                 </div>
                 <p className="text-xs font-bold text-white/40 italic">"Guntur Chilli clusters are currently at peak harvest liquidity. High-volume discounts up to 14.5% available."</p>
             </div>
         </Card>
      </div>

      {/* Pricing Table Area */}
      <div className="space-y-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-neut-100">
            <div>
               <h3 className="text-3xl font-black tracking-tight">Enterprise Pricing Matrix</h3>
               <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest leading-loose">VOLUME-BASED CONTRACT RATES</p>
            </div>
            <div className="flex gap-4">
               <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-neut-200">
                  <Filter size={18} className="mr-2" />
                  Filter Markets
               </Button>
               <Button variant="gradient" className="h-12 px-8 rounded-xl font-black shadow-lg shadow-brand-secondary/20">
                  <Plus size={18} className="mr-2" />
                  Manual RFQ
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6">
            {BULK_PRICING.map((p, i) => (
               <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2.5rem] bg-white border border-neut-100 shadow-startup-soft hover:shadow-startup-medium flex flex-wrap lg:flex-nowrap items-center gap-12 group transition-all"
               >
                  <div className="flex items-center gap-6 min-w-[300px]">
                     <div className="h-16 w-16 bg-brand-secondary/5 rounded-2xl flex items-center justify-center text-brand-secondary shadow-startup-soft transition-transform group-hover:rotate-3"><Package size={28} /></div>
                     <div>
                        <h4 className="text-2xl font-black text-neut-900 tracking-tight">{p.crop}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <Badge tone="brand" className="h-5 px-3 rounded-lg text-[8px] font-black tracking-widest">{p.quality}</Badge>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-12">
                     <div>
                        <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1">Vol Range</p>
                        <p className="text-xl font-extrabold text-neut-700 tracking-tight">{p.vol}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1">Contract Rate</p>
                        <p className="text-2xl font-black text-neut-900 tracking-tight">{p.price}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-neut-400 uppercase tracking-widest mb-1">Market Trend</p>
                        <div className={`flex items-center gap-2 font-black ${p.trend.includes('-') ? "text-success" : p.trend === "0%" ? "text-neut-300" : "text-error"}`}>
                           {p.trend}
                           <TrendingUp size={16} className={p.trend.includes('-') ? "rotate-180" : ""} />
                        </div>
                     </div>
                  </div>

                  <Button variant="outline" className="h-14 px-10 rounded-2xl font-black text-lg border-neut-100 hover:bg-brand-secondary hover:text-white transition-all shadow-startup-soft">
                     Open Bid
                     <ArrowRight size={20} className="ml-3" />
                  </Button>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}
