"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, MoreVertical, Package, Edit, Trash2, Tag, Box, ArrowUpRight, CheckCircle2, AlertCircle, MapPin, Map as MapIcon, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AddProductModal } from "./AddProductModal";
import dynamic from 'next/dynamic';
const ProductMap = dynamic(() => import('./ProductMap').then(mod => mod.ProductMap), { ssr: false });
import { productService } from "@/services/productService";
import { ReputationBadge } from "@/components/ui/ReputationBadge";
import toast from "react-hot-toast";

export function ProductManagement() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map" | "table">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      // Handle the data structure - Assuming result is { products: [], total: ... }
      setProducts(data.products || data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    (activeTab === "All" || (p.status || "Active") === activeTab) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.delete(id);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in w-full text-neut-900 border-neut-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-1 bg-neut-100 rounded-2xl w-fit">
            {["All", "Active", "Low Stock", "Out of Stock"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab ? "bg-white text-neut-900 shadow-startup-soft" : "text-neut-500 hover:text-neut-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="h-10 w-px bg-neut-200 hidden lg:block mx-2" />

          <div className="flex items-center gap-2 p-1 bg-neut-100 rounded-2xl">
             <button 
               onClick={() => setViewMode("grid")}
               className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-white text-brand-primary shadow-sm" : "text-neut-400"}`}
             >
               <LayoutGrid size={20} />
             </button>
             <button 
               onClick={() => setViewMode("table")}
               className={`p-2 rounded-xl transition-all ${viewMode === "table" ? "bg-white text-brand-primary shadow-sm" : "text-neut-400"}`}
             >
               <List size={20} />
             </button>
             <button 
               onClick={() => setViewMode("map")}
               className={`p-2 rounded-xl transition-all ${viewMode === "map" ? "bg-white text-brand-primary shadow-sm" : "text-neut-400"}`}
             >
               <MapIcon size={20} />
             </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group flex-1 lg:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neut-400 group-focus-within:text-brand-primary" />
            <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 text-sm"
            />
          </div>
          <Button 
            variant="gradient" 
            className="h-12 px-6 rounded-xl font-bold"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} className="mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-3xl animate-pulse">
            <Package size={48} className="text-neut-200 animate-spin" />
          </div>
        ) : viewMode === "map" ? (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ProductMap products={filteredProducts} />
          </motion.div>
        ) : viewMode === "table" ? (
          <div className="bg-white rounded-3xl shadow-startup-soft overflow-hidden border border-neut-100 overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-neut-50/50 border-b border-neut-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neut-400">Product</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-neut-400">Category</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-neut-400">Grade</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-neut-400">Quantity</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-neut-400">Price</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-neut-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neut-50">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neut-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-brand-primary/5 rounded-xl flex items-center justify-center text-brand-primary">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-neut-900">{p.name}</p>
                          <div className="flex items-center gap-1 text-[10px] text-neut-400">
                             <MapPin size={8} /> <span>{p.address || p.district || 'Location not set'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><Badge tone="brand" className="rounded-lg">{p.category}</Badge></td>
                    <td className="px-6 py-5 font-black text-sm text-neut-700">Grade {p.qualityGrade || 'B'}</td>
                    <td className="px-6 py-5 font-black text-sm text-neut-700">{p.quantity} {p.unit || 'kg'}</td>
                    <td className="px-6 py-5 font-black text-sm text-neut-900">₹{p.price}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl"><Edit size={16} /></Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl hover:bg-error/10 hover:text-error"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-4"
          >
             {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="border-none shadow-startup-soft hover:shadow-startup-medium transition-all group overflow-hidden bg-white/80 backdrop-blur-xl">
                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-neut-50 rounded-2xl flex items-center justify-center text-neut-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all shadow-startup-soft">
                          <Package size={32} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase text-brand-primary">{product.category}</span>
                            <Badge tone="ink" className="text-[9px] font-black">Grade {product.qualityGrade || 'B'}</Badge>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              (product.status || 'Active') === 'Active' ? 'bg-success' : 
                              product.status === 'Low Stock' ? 'bg-warning' : 'bg-error'
                            }`} />
                          </div>
                          <h3 className="text-xl font-black text-neut-900 tracking-tight">{product.name}</h3>
                          <div className="flex items-center gap-1.5 text-neut-400 text-xs font-bold mt-1">
                            <MapPin size={12} />
                            <span>{product.address || product.district || 'Location not set'}</span>
                          </div>
                   
                          {product.farmer?.reputationScore !== undefined && (
                            <div className="mt-4">
                               <ReputationBadge score={product.farmer.reputationScore} />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-12">
                        <div className="text-right hidden lg:block">
                          <p className="text-xs font-bold text-neut-400 uppercase tracking-widest mb-1">In Stock</p>
                          <p className={`font-black text-sm ${(product.status || 'Active') === 'Out of Stock' ? 'text-error line-through' : 'text-neut-900'}`}>{product.quantity} {product.unit || 'kg'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-neut-400 uppercase tracking-widest mb-1">Unit Price</p>
                          <p className="text-lg font-black text-neut-900 tracking-tight">₹{product.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-10 rounded-xl font-bold border-neut-200">
                            <Edit size={16} className="mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl hover:bg-error/10 hover:text-error"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-neut-50/50 rounded-[3rem] border border-dashed border-neut-200">
                    <Package size={48} className="mx-auto text-neut-200 mb-4" />
                    <h3 className="text-xl font-bold text-neut-900">No products found in Hub</h3>
                    <p className="text-neut-500 font-medium">Add a new listing to start trading on the marketplace.</p>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchProducts();
        }} 
      />
    </div>
  );
}
