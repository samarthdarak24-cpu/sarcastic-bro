"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Filter, MoreVertical, Package, Edit, Trash2, Tag, 
  Box, ArrowUpRight, CheckCircle2, AlertCircle, MapPin, 
  Map as MapIcon, LayoutGrid, List, Check, X, FilterIcon,
  ChevronDown, Layers, Target, Activity, Settings2, SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "./ProductCard";
import { productService } from "@/services/productService";
import { ReputationBadge } from "@/components/ui/ReputationBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { AddProductModal } from "./AddProductModal";
import dynamic from 'next/dynamic';

const ProductMap = dynamic(() => import('./ProductMap').then(mod => mod.ProductMap), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-neut-50 flex flex-col items-center justify-center rounded-[3rem] animate-pulse font-black text-neut-300 gap-4">
      <MapIcon size={48} className="animate-spin-slow" />
      <span>Initializing Geospatial Engine...</span>
  </div>
});

export function ProductManagement() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map" | "table">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedGrades, setSelectedGrades] = useState(["A", "B", "C"]);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getMyProducts();
      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      toast.error(err.message || "Failed to load products");
      // Use fallback data for demo
      setProducts([]);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast.error(err.message || "Failed to delete product");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await productService.toggleProductStatus(id);
      toast.success("Product status updated");
      fetchProducts();
    } catch (err: any) {
      console.error('Error toggling status:', err);
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-12 animate-fade-in text-neut-900 pb-20">
      {/* 🚀 Tactical Control Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-6 border-b border-neut-100 max-w-[1700px] mx-auto px-6">
          <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                 <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">Smart Inventory Hub.</h2>
                 <Badge tone="brand" className="h-8 px-4 rounded-xl flex items-center justify-center font-black gap-2 shadow-sm uppercase text-[9px] tracking-[0.2em] border-none">
                    <Activity size={12} className="animate-pulse" />
                    LIVE OPS ACTIVE
                 </Badge>
              </div>
              <p className="text-sm font-bold text-neut-400 uppercase tracking-widest leading-loose max-w-xl">Centralized node for listed commodities, price indexing, and fulfillment status across all farm gates.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
             <div className="flex bg-neut-50 p-2 rounded-2xl border border-neut-100 items-center shadow-inner">
                {['grid', 'table', 'map'].map((v: any) => (
                    <button 
                       key={v}
                       onClick={() => setViewMode(v)}
                       className={`h-11 px-6 rounded-xl flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest ${viewMode === v ? "bg-white text-neut-900 shadow-startup-soft" : "text-neut-300 hover:text-neut-500"}`}
                    >
                       {v === 'grid' && <LayoutGrid size={16} />}
                       {v === 'table' && <List size={16} />}
                       {v === 'map' && <MapIcon size={16} />}
                       {v}
                    </button>
                ))}
             </div>
             <Button 
                onClick={() => setIsModalOpen(true)}
                variant="gradient" 
                className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest shadow-glow-primary hover:scale-[1.02] transition-transform flex items-center gap-3"
             >
                <Plus size={20} strokeWidth={3} />
                LIST NEW ASSET
             </Button>
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 max-w-[1700px] mx-auto px-6">
          {/* 🔍 Premium Filters Sidebar */}
          <aside className="xl:col-span-1 space-y-10">
              <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-3xl p-10 rounded-[3rem] sticky top-32 overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><SlidersHorizontal size={140} className="text-neut-100" /></div>
                  <div className="space-y-12 relative z-10">
                      <div className="flex items-center justify-between pb-6 border-b border-neut-100/50">
                         <h3 className="text-xl font-black text-neut-900 tracking-tighter uppercase tracking-[0.2em]">Filter Stack</h3>
                         <Settings2 size={18} className="text-neut-300" />
                      </div>

                      <div className="space-y-6">
                         <label className="text-[10px] font-black text-neut-300 uppercase tracking-[0.4em]">Product Taxonomy</label>
                         <div className="grid grid-cols-1 gap-2">
                             {['All Assets', 'Grains', 'Fruits', 'Spices', 'Organic'].map(cat => (
                                 <button key={cat} onClick={() => setActiveTab(cat)} className={`flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === cat ? 'bg-brand-primary text-white shadow-glow-primary' : 'bg-neut-50 text-neut-400 hover:bg-neut-100 hover:text-neut-700'}`}>
                                    {cat}
                                    {activeTab === cat && <Check size={14} />}
                                 </button>
                             ))}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <label className="text-[10px] font-black text-neut-300 uppercase tracking-[0.4em]">Global Search</label>
                         <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neut-300" size={18} />
                            <Input 
                                placeholder="Scan database..." 
                                className="h-14 pl-14 rounded-2xl bg-neut-50 border-none font-bold text-neut-900 placeholder:text-neut-300" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                         </div>
                      </div>

                      <div className="space-y-4 pt-10">
                         <Button variant="outline" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-neut-100 hover:bg-neut-50 transition-all opacity-40 hover:opacity-100">
                             RESET PROTOCOL
                         </Button>
                      </div>
                  </div>
              </Card>
          </aside>

          {/* 📦 High-Fidelity Asset Grid */}
          <main className="xl:col-span-3 min-h-[800px]">
             {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {[1,2,3,4].map(i => (
                      <Card key={i} className="h-96 rounded-[3.5rem] bg-white border border-neut-50 animate-pulse flex flex-col p-10 justify-between">
                         <div className="h-40 w-full bg-neut-50 rounded-[2rem]" />
                         <div className="space-y-4">
                            <div className="h-6 w-3/4 bg-neut-50 rounded-lg" />
                            <div className="h-10 w-1/4 bg-neut-100 rounded-lg" />
                         </div>
                      </Card>
                   ))}
                </div>
             ) : viewMode === "map" ? (
                <div className="h-[700px] w-full rounded-[4rem] overflow-hidden shadow-2xl border-2 border-white relative group">
                   <ProductMap products={products} />
                   <div className="absolute top-8 left-8 p-6 bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/20 shadow-2xl z-20 pointer-events-none transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700">
                       <h5 className="text-xl font-black tracking-tighter text-neut-900 mb-2">Live Node Sync</h5>
                       <p className="text-[10px] font-black text-neut-500 uppercase tracking-widest">Geospatial tracking active across 12 clusters.</p>
                   </div>
                </div>
             ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {products.map((p, i) => (
                     <ProductCard 
                       key={p.id} 
                       product={p} 
                       index={i} 
                       onDelete={handleDelete}
                       onToggleStatus={handleToggleStatus}
                       onRefresh={fetchProducts}
                     />
                   ))}
                </div>
             ) : (
                <div className="h-[600px] flex items-center justify-center">
                    <EmptyState 
                       title="No Assets Detected" 
                       description="The centralized node contains zero active inventory. Initialize your first listing." 
                       action={<Button variant="gradient" className="h-14 px-8 rounded-2xl font-black text-xs uppercase" onClick={() => setIsModalOpen(true)}>Initialize Listing</Button>}
                    />
                </div>
             )}
          </main>
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={fetchProducts} />
    </div>
  );
}
