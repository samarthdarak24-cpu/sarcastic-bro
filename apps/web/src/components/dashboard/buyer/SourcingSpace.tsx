"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  ChevronRight, 
  ShoppingCart, 
  Info,
  Layers,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Package,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { productService } from "@/services/productService";
import { ReputationBadge } from "@/components/ui/ReputationBadge";
import toast from "react-hot-toast";

export function SourcingSpace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "All", quality: "All", maxPrice: 500 });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data.products || data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    (filters.category === "All" || p.category === filters.category) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (p.price <= filters.maxPrice)
  );

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (val.length > 1) {
      const common = ["Basmati", "Turmeric", "Alphanso", "Guntur Chillies", "Organic Honey"];
      setSuggestions(common.filter(s => s.toLowerCase().includes(val.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-[1800px] mx-auto text-neut-900 border-neut-200">
      {/* Smart Search Bar */}
      <div className="relative z-20 flex flex-col items-center justify-center pt-8 pb-16 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl space-y-8"
          >
             <div className="text-center space-y-4">
                <Badge tone="brand" className="h-8 px-4 rounded-full font-black text-[10px] animate-pulse">DIRECT FROM FARM GATE</Badge>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-neut-900">Traceable Sourcing.</h1>
                <p className="text-xl font-medium text-neut-500 max-w-2xl mx-auto">Skip the middlemen. Connect with 15k+ verified farmers across India using advanced geolocation discovery.</p>
             </div>

             <div className="relative group">
                <div className="absolute inset-x-0 -bottom-2 h-14 bg-brand-secondary/20 blur-2xl rounded-full group-focus-within:opacity-100 opacity-0 transition-opacity" />
                <div className="relative bg-white h-20 rounded-[1.5rem] shadow-startup-medium border border-neut-100 flex items-center p-2 pr-4 hover:border-brand-secondary/30 transition-all transition-shadow">
                    <div className="pl-6 pr-4 border-r border-neut-100">
                        <Search size={24} className="text-neut-300 group-focus-within:text-brand-secondary" />
                    </div>
                    <Input 
                        placeholder="Search crops, regions (e.g. 'Basmati', 'Guntur')..." 
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="flex-1 bg-transparent border-none text-lg font-bold placeholder:text-neut-300 focus-visible:ring-0"
                    />
                    <Button variant="gradient" className="h-14 px-8 rounded-2xl font-black text-lg shadow-lg shadow-brand-secondary/20">
                        Search Now
                    </Button>
                </div>
                {suggestions.length > 0 && (
                   <div className="absolute top-24 inset-x-0 bg-white rounded-2xl shadow-xl border border-neut-100 p-2 z-50">
                      {suggestions.map(s => (
                         <div 
                            key={s} 
                            onClick={() => { setSearchTerm(s); setSuggestions([]); }}
                            className="p-4 hover:bg-neut-50 rounded-xl cursor-pointer font-bold text-neut-700"
                         >
                            {s}
                         </div>
                      ))}
                   </div>
                )}
             </div>

             <div className="flex flex-wrap items-center justify-center gap-4">
                {["All Croups", "Grains", "Spices", "Dry Fruits", "Vegetables"].map((cat) => (
                    <button 
                        key={cat} 
                        onClick={() => setFilters({...filters, category: cat})}
                        className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                            filters.category === cat ? "bg-neut-900 text-white shadow-lg" : "bg-white text-neut-400 hover:text-neut-900 shadow-sm border border-neut-100 hover:border-neut-900/10"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
             </div>
          </motion.div>
      </div>

      {/* Results Grid */}
      <div className="px-4 pb-20">
          <div className="flex items-end justify-between mb-12">
             <div className="space-y-1">
                <h3 className="text-3xl font-black tracking-tight">Marketplace Discoveries</h3>
                <p className="text-xs font-black text-neut-400 uppercase tracking-widest leading-loose">SHOWING {filteredProducts.length} VERIFIED LISTINGS</p>
             </div>
              <div className="flex items-center gap-6">
                 <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-neut-400 uppercase">Max Price: ₹{filters.maxPrice}</span>
                    <input 
                       type="range" 
                       min="10" 
                       max="1000" 
                       value={filters.maxPrice}
                       onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                       className="w-40 accent-brand-secondary"
                    />
                 </div>
                 <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-neut-200">
                    <Filter size={18} className="mr-2" />
                    Refine Search
                 </Button>
                <div className="h-10 w-px bg-neut-100" />
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl"><Layers size={24} /></Button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
             <AnimatePresence>
                {loading ? (
                    Array(8).fill(0).map((_, i) => (
                        <div key={i} className="h-[450px] bg-neut-50 rounded-[2.5rem] animate-pulse" />
                    ))
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="border-none shadow-startup-soft hover:shadow-startup-medium transition-all group overflow-hidden bg-white/80 backdrop-blur-xl h-full flex flex-col rounded-[2.5rem] border border-neut-50">
                                <div className="h-56 bg-neut-50 overflow-hidden relative border-b border-neut-50">
                                    <div className="absolute inset-0 flex items-center justify-center text-neut-100 animate-pulse">
                                        <Package size={80} />
                                    </div>
                                    <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-white/20">
                                        <div className="flex items-center gap-1.5 text-warning font-black text-xs">
                                            <Star size={14} fill="currentColor" />
                                            {4.8 + (i % 5) * 0.05}
                                        </div>
                                    </div>
                                    <Badge tone="ink" className="absolute top-4 right-4 h-9 px-4 rounded-xl font-black text-[10px] uppercase shadow-sm">
                                        {p.qualityGrade || 'A'} GRADE
                                    </Badge>
                                </div>

                                <CardContent className="p-8 flex-1 flex flex-col">
                                    <div className="space-y-4 mb-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-brand-secondary tracking-widest">{p.category}</p>
                                            <h4 className="text-2xl font-black text-neut-900 tracking-tight leading-tight group-hover:text-brand-secondary transition-colors line-clamp-1">{p.name}</h4>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                          <div className="flex items-center gap-2 text-neut-400 font-bold text-[10px] uppercase tracking-wider">
                                              <MapPin size={12} className="text-brand-secondary" />
                                              <span>{p.address || p.district || 'Location not set'}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                              <ReputationBadge score={p.farmer?.reputationScore || 100} compact />
                                              <span className="text-[9px] font-black text-neut-300 uppercase">Verified Supplier</span>
                                          </div>
                                        </div>
                                        <div className="p-4 bg-neut-50/50 rounded-2xl border border-neut-100/50">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-neut-400 uppercase tracking-widest">Available Volume</span>
                                                <span className="text-xs font-black text-neut-900">{p.quantity} {p.unit || 'kg'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-neut-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-neut-400 uppercase mb-0.5">Unit Price</span>
                                            <span className="text-2xl font-black text-neut-900 tracking-tight">₹{p.price} <small className="text-[10px] text-neut-400">/kg</small></span>
                                        </div>
                                        <Button variant="outline" className="h-12 w-12 rounded-xl p-0 border-neut-200 group-hover:bg-brand-secondary group-hover:text-white group-hover:border-brand-secondary transition-all transform active:scale-95 shadow-startup-soft">
                                            <ShoppingCart size={22} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-40 flex flex-col items-center text-center">
                        <div className="h-24 w-24 bg-neut-50 rounded-[2.5rem] flex items-center justify-center text-neut-200 mb-8 animate-bounce">
                           <Search size={48} />
                        </div>
                        <h4 className="text-3xl font-black text-neut-900 mb-4">No matching sources found</h4>
                        <p className="text-neut-500 font-medium max-w-sm mx-auto text-lg leading-relaxed">Try expanding your search parameters or check our regional cluster listings.</p>
                        <Button variant="ghost" onClick={fetchProducts} className="mt-8 font-black text-brand-secondary">Show all active listings <ArrowRight size={18} className="ml-2" /></Button>
                    </div>
                )}
             </AnimatePresence>
          </div>
      </div>
    </div>
  );
}
