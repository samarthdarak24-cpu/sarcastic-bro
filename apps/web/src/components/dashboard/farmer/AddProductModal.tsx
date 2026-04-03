"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Navigation, Check, Loader2, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import dynamic from 'next/dynamic';
import { CropQualityDetector } from "./CropQualityDetector";

const MapPicker = dynamic(() => import('./MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-48 w-full bg-neut-50 flex items-center justify-center rounded-2xl animate-pulse text-xs font-bold text-neut-400">Loading Map...</div>
});

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    unit: "kg",
    qualityGrade: "B",
    harvestDate: "",
    district: "",
    state: "",
    lat: null as number | null,
    lng: null as number | null,
    address: "",
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocLoading(false);
        toast.success("Current GPS captured!");
      },
      (error) => {
        setLocLoading(false);
        toast.error("Failed to get coordinates. Please select on map.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng) {
      toast.error("Please select a farm location on the map.");
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Product listed successfully!");
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-neut-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-neut-900 tracking-tight">List New Product</h2>
            <button onClick={onClose} className="p-2 hover:bg-neut-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="mb-8">
              <CropQualityDetector 
                productName={formData.name} 
                productType={formData.category} 
                onQualityDetected={(grade) => setFormData(prev => ({ ...prev, qualityGrade: grade }))}
              />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Product Name" placeholder="e.g. Basmati Rice" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <Input label="Category" placeholder="e.g. Grains" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              <Input label="Unit Price (₹)" type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <Input label="Quantity" type="number" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-neut-400">Quality Grade</label>
                <div className="flex gap-2">
                  {["A", "B", "C"].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setFormData({ ...formData, qualityGrade: grade })}
                      className={`flex-1 h-12 rounded-xl border-2 font-black transition-all ${
                        formData.qualityGrade === grade ? "border-brand-primary bg-brand-primary/5 text-brand-primary" : "border-neut-100 text-neut-400"
                      }`}
                    >
                      Grade {grade}
                    </button>
                  ))}
                </div>
              </div>
              <Input 
                label="Harvest Date" 
                type="date" 
                required 
                value={formData.harvestDate} 
                onChange={e => setFormData({...formData, harvestDate: e.target.value})} 
              />
            </div>

            {/* Location Section */}
            <div className="space-y-4 pt-4 border-t border-neut-100 text-neut-900">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-widest text-neut-400">Farm Location (Geolocation)</h4>
                <Button 
                   type="button" 
                   variant="outline" 
                   size="sm"
                   className="h-9 px-4 rounded-xl font-bold border-brand-primary/20 text-brand-primary"
                   onClick={handleGetLocation}
                   disabled={locLoading}
                >
                  {locLoading ? <Loader2 className="animate-spin mr-2" size={14} /> : <Navigation size={14} className="mr-2" />}
                  Auto Detect
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="District" placeholder="Enter district" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
                <Input label="State" placeholder="Enter state" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neut-400">Click on Map to Adjust Farm Pin</label>
                <MapPicker 
                   position={formData.lat ? [formData.lat, formData.lng!] : null} 
                   setPosition={(pos) => setFormData({ ...formData, lat: pos[0], lng: pos[1] })} 
                />
              </div>

              {formData.lat && (
                <div className="text-[10px] font-bold text-success flex items-center gap-1.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                   Captured: {formData.lat.toFixed(6)}, {formData.lng?.toFixed(6)}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="gradient" className="flex-1 h-12 rounded-xl font-bold" disabled={loading}>
                {loading ? "Listing..." : "Submit Product"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
