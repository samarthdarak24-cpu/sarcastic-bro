"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Edit, Trash2, MoreVertical, 
  Star, Package, MapPin, IndianRupee, Layers, Zap,
  TrendingUp, Activity, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: any;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  index?: number;
}

export function ProductCard({ product, onEdit, onDelete, index = 0 }: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = product.images || [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1599308670411-cd7503bf9da1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800"
  ];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const stockPercentage = Math.min((product.quantity / (product.totalStock || 1000)) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group relative bg-white border border-neut-100 rounded-[3.5rem] overflow-hidden shadow-startup-soft hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-700 h-full flex flex-col"
    >
      {/* 🖼️ Visual Hero Area */}
      <div className="relative h-72 overflow-hidden bg-neut-50">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "anticipate" }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        </AnimatePresence>

        {/* Dynamic Glass Navigation */}
        <div className="absolute inset-x-0 bottom-6 flex justify-between px-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <button onClick={prevImage} className="h-12 w-12 bg-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/30 hover:bg-white hover:text-neut-900 transition-all shadow-xl">
            <ChevronLeft size={24} />
          </button>
          <div className="px-4 py-2 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl flex gap-1.5 items-center">
            {images.map((_: string, i: number) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentImage ? "bg-white w-6" : "bg-white/40 w-1.5"}`} />
            ))}
          </div>
          <button onClick={nextImage} className="h-12 w-12 bg-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/30 hover:bg-white hover:text-neut-900 transition-all shadow-xl">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Intelligence Overlays */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <Badge tone="brand" className="backdrop-blur-xl bg-brand-primary/90 text-white px-4 py-1.5 rounded-xl font-black text-[10px] tracking-widest uppercase border-none shadow-glow-primary">
            {product.category || "Crops"}
          </Badge>
          <Badge tone="ink" className="backdrop-blur-xl bg-white/20 text-white px-4 py-1.5 rounded-xl font-black text-[10px] tracking-widest uppercase border border-white/20 shadow-xl">
            GRADE {product.qualityGrade || "A"}
          </Badge>
        </div>

        {/* Market Momentum Tab */}
        <div className="absolute top-6 right-6 h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-2xl animate-pulse">
           <TrendingUp size={24} />
        </div>
      </div>

      {/* 📄 Quantitative Data Panel */}
      <div className="p-10 flex-1 flex flex-col justify-between space-y-8">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
                <h3 className="text-3xl font-black text-neut-900 tracking-tighter leading-tight group-hover:text-brand-primary transition-colors">
                {product.name}
                </h3>
                <div className="flex items-center gap-2 text-neut-300">
                    <MapPin size={14} className="text-brand-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{product.district || "Nasik"}, {product.state || "MH"}</span>
                </div>
            </div>
            <div className="h-14 w-14 bg-neut-50 rounded-2xl flex flex-col items-center justify-center border border-neut-100 shadow-inner group-hover:bg-brand-primary/5 transition-colors">
                <Star size={16} fill="#F59E0B" className="text-amber-500 mb-0.5" />
                <span className="text-[10px] font-black text-neut-900">{product.rating || "4.9"}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-neut-900 tracking-tighter">₹{product.price}</span>
            <span className="text-sm font-bold text-neut-400 uppercase tracking-widest">/ {product.unit || "KG"}</span>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-neut-100/50">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-neut-300 uppercase tracking-widest flex items-center gap-2">
                        <Layers size={10} className="text-brand-primary" />
                        Inventory Level
                    </p>
                    <p className="text-xl font-black text-neut-900 tracking-tight">{product.quantity} <span className="text-xs font-bold text-neut-400">{product.unit || "KG"}</span></p>
                </div>
                <Badge tone={stockPercentage < 20 ? 'amber' : 'brand'} className="h-7 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest border-none">
                    {stockPercentage < 20 ? 'Low Stock' : 'Stable'}
                </Badge>
            </div>
            <div className="h-2 w-full bg-neut-50 rounded-full overflow-hidden shadow-inner">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stockPercentage}%` }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                    className={`h-full rounded-full ${stockPercentage < 20 ? "bg-amber-500" : "bg-brand-primary"} shadow-glow-primary`}
                />
            </div>
        </div>

        {/* ⚡ Tactical Action Deck */}
        <div className="flex items-center gap-3 pt-4">
            <Button 
                onClick={() => {
                  if (onEdit) onEdit(product.id);
                  else toast.error("Edit functionality coming soon");
                }}
                variant="gradient" 
                className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/20 hover:scale-[1.02] transition-all"
            >
                UPDATE ASSET
            </Button>
            <Button 
                onClick={() => {
                  if (onDelete) {
                    if (confirm(`Delete ${product.name}? This action cannot be undone.`)) {
                      onDelete(product.id);
                    }
                  } else {
                    toast.error("Delete functionality coming soon");
                  }
                }}
                variant="outline" 
                size="icon" 
                className="h-14 w-14 rounded-2xl border-neut-100 bg-neut-50 flex items-center justify-center text-neut-400 hover:bg-error/10 hover:text-error hover:border-error/20 transition-all font-black"
            >
                <Trash2 size={22} />
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 rounded-2xl border-neut-100 bg-neut-50 text-neut-400 hover:text-neut-900 transition-all"
            >
                <MoreVertical size={22} />
            </Button>
        </div>
      </div>
    </motion.div>
  );
}
