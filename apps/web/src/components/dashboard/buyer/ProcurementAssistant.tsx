"use client";

import React, { useState } from "react";
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  AlertCircle,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

interface Supplier {
  productId: string;
  farmerId: string;
  farmerName: string;
  price: number;
  reputation: number;
  distance: number;
  totalPrice: number;
  deliveryEstimate: string;
  finalScore: number;
}

interface ProcurementResult {
  bestSuppliers: Supplier[];
  suggestedTiming: string;
}

export function ProcurementAssistant() {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcurementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!productName) return;
    setLoading(true);
    setError(null);
    try {
      // Mocking buyer coordinates for now
      const buyerLat = 28.6139; 
      const buyerLng = 77.2090;

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ai/procurement`, {
        productName,
        quantity,
        buyerLat,
        buyerLng
      });

      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (err: any) {
      setError("Unable to fetch recommendations. Please check supplier availability.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Search Header */}
      <Card className="glass-card border-white/20 shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 pointer-events-none" />
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <Badge tone="brand" className="bg-brand-primary/5 text-brand-primary border-none text-[10px] uppercase font-black tracking-widest">
              AI Powered
            </Badge>
          </div>
          <CardTitle className="text-3xl font-black text-neut-900 tracking-tight">AI Procurement Assistant</CardTitle>
          <CardDescription className="text-neut-500 font-medium">Choose the best supplier, price, and timing with data-driven insights.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neut-400" size={18} />
              <Input 
                placeholder="What are you sourcing today? (e.g., Organic Wheat)" 
                className="h-14 pl-12 rounded-2xl border-neut-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium text-lg"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="w-full md:w-32 relative">
              <Input 
                type="number"
                placeholder="Qty" 
                className="h-14 rounded-2xl border-neut-200 bg-white/50 backdrop-blur-sm transition-all font-bold text-lg text-center"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <Button 
              className="h-14 px-8 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-black text-lg shadow-xl shadow-brand-primary/20 flex gap-2"
              onClick={handleSearch}
              disabled={loading || !productName}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap size={20} />
                  Find Best Deal
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-4 text-red-600 font-bold"
          >
            <AlertCircle size={24} />
            {error}
          </motion.div>
        )}

        {result && result.bestSuppliers.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* AI Insight Bar */}
            <div className="p-6 rounded-3xl bg-neut-900 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-brand-primary/20 to-transparent pointer-events-none" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-brand-primary flex items-center justify-center shrink-0 shadow-lg shadow-brand-primary/40">
                  <TrendingUp size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-brand-primary font-black uppercase tracking-widest text-[10px]">Smart Timing Insight</h4>
                  <p className="text-xl font-bold leading-tight">{result.suggestedTiming}</p>
                </div>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.bestSuppliers.map((supplier, idx) => (
                <motion.div
                  key={supplier.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`h-full border-none shadow-xl transition-all duration-500 hover:-translate-y-2 relative ${idx === 0 ? 'ring-2 ring-brand-primary shadow-brand-primary/10 bg-white' : 'bg-white/80'}`}>
                    {idx === 0 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                        <Badge className="bg-brand-primary hover:bg-brand-primary text-white font-black px-4 py-1.5 rounded-full shadow-lg border-none flex gap-1.5 items-center">
                          <Zap size={14} className="fill-current" />
                          BEST MATCH
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-14 w-14 rounded-2xl bg-neut-50 flex items-center justify-center text-neut-400 border border-neut-100">
                          <Package size={28} />
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-neut-900">₹{supplier.price}</div>
                          <div className="text-[10px] text-neut-400 font-bold uppercase tracking-tight">per {productName.includes('Wheat') ? 'quintal' : 'kg'}</div>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-black text-neut-900 group-hover:text-brand-primary transition-colors">{supplier.farmerName}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-1.5 w-4 rounded-full ${i < Math.round(supplier.reputation / 20) ? 'bg-orange-400' : 'bg-neut-200'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-neut-500 uppercase tracking-widest">{supplier.reputation}% Trust</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-neut-400">
                            <MapPin size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Distance</span>
                          </div>
                          <div className="text-sm font-black text-neut-700">{supplier.distance} km away</div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-neut-400">
                            <Clock size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Est. Logistics</span>
                          </div>
                          <div className="text-sm font-black text-neut-700">{supplier.deliveryEstimate}</div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-dashed border-neut-100">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-bold text-neut-400 uppercase tracking-widest">Total Order Value</span>
                          <span className="text-lg font-black text-brand-secondary">₹{supplier.totalPrice.toLocaleString()}</span>
                        </div>
                        <Button className={`w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 group ${idx === 0 ? 'bg-brand-primary hover:bg-brand-primary/90 text-white' : 'bg-neut-100 hover:bg-neut-200 text-neut-900'}`}>
                          Proceed to Buy
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : result ? (
          <div className="h-[400px] rounded-3xl border-2 border-dashed border-neut-200 flex flex-col items-center justify-center text-center p-12 bg-neut-50/50">
            <div className="h-20 w-20 rounded-[2rem] bg-neut-100 flex items-center justify-center text-neut-400 mb-6">
              <Package size={40} />
            </div>
            <h3 className="text-2xl font-black text-neut-900 mb-2">No Matching Suppliers</h3>
            <p className="text-neut-500 font-medium max-w-sm">We couldn't find farmers with the requested quantity. Try reducing the amount or searching for a broader term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-40">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[400px] rounded-3xl bg-neut-100 animate-pulse" />
             ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
