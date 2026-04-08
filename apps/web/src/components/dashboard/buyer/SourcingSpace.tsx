"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Star, MapPin, TrendingUp, Package, CheckCircle, Clock, Zap, Target, Award, Shield, ShoppingCart } from "lucide-react";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import { usePriceUpdates, useProductCreated } from "@/hooks/useSocket";
import { useRealtimeStore } from "@/store/realtimeStore";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  description?: string;
  imageUrls?: string[];
  qualityGrade?: string;
  qualityScore?: number;
  isActive: boolean;
  district?: string;
  state?: string;
  farmerId: string;
  farmer?: {
    name: string;
    email: string;
  };
}

export function SourcingSpace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const { livePrices } = useRealtimeStore();

  // Load products from farmers
  useEffect(() => {
    loadProducts();
  }, []);

  // Listen for real-time price updates
  usePriceUpdates((data) => {
    setProducts(prev => prev.map(p => 
      p.id === data.productId ? { ...p, price: data.newPrice } : p
    ));
  });

  useProductCreated((data) => {
    toast.success(`New product available: ${data.name}!`, {
      icon: '📦',
    });
    loadProducts(); // Refresh list to show the new product
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data.filter(p => p.isActive));
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = (product: Product) => {
    setSelectedProduct(product);
    setOrderQuantity(1);
    setShowOrderModal(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) return;

    try {
      await orderService.createOrder({
        productId: selectedProduct.id,
        quantity: orderQuantity,
        shippingAddress: "Default Address", // You can add address selection
      });


      toast.success(`Order placed for ${selectedProduct.name}!`);
      setShowOrderModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Smart Sourcing</h1>
          <p className="text-slate-500 font-medium">Discover verified suppliers across India</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            <Zap size={18} />
            AI Match
          </button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search suppliers, products, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button className="h-14 px-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => {
            const livePrice = livePrices[product.id];
            const currentPrice = livePrice?.price || product.price;
            const priceChange = livePrice?.changePercent || 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
                  {product.imageUrls && product.imageUrls[0] ? (
                    <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={64} className="text-slate-300" />
                    </div>
                  )}
                  {product.qualityGrade && (
                    <div className="absolute top-4 right-4 h-10 w-10 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">{product.qualityGrade}</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full font-bold text-sm text-slate-900">
                    {product.category}
                  </div>
                  {priceChange !== 0 && (
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full font-bold text-xs ${
                      priceChange > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {priceChange > 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(1)}%
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <MapPin size={14} />
                    <span className="font-medium">{product.district || product.state || 'India'}</span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-600">{product.quantity} {product.unit}</span>
                    </div>
                    {product.qualityScore && (
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-900">{product.qualityScore}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-1">Price per {product.unit}</p>
                      <p className="text-2xl font-black text-blue-600">₹{currentPrice}</p>
                    </div>
                    <button 
                      onClick={() => handleOrderNow(product)}
                      className="h-12 px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Order
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Order Modal */}
      <AnimatePresence>
        {showOrderModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOrderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-6">Place Order</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Product</label>
                  <p className="text-lg font-bold text-slate-900">{selectedProduct.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Price per {selectedProduct.unit}</label>
                  <p className="text-2xl font-black text-blue-600">₹{selectedProduct.price}</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Quantity ({selectedProduct.unit})</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.quantity}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-700">Total Amount</span>
                    <span className="text-3xl font-black text-blue-600">₹{(selectedProduct.price * orderQuantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 h-12 px-6 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 h-12 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  Place Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Active Products", value: products.length.toString(), icon: Package },
            { label: "Categories", value: categories.length.toString(), icon: Target },
            { label: "Avg Price", value: `₹${products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0}`, icon: TrendingUp },
            { label: "Available Now", value: filteredProducts.length.toString(), icon: CheckCircle },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <stat.icon size={32} className="mx-auto mb-3 opacity-80" />
              <p className="text-3xl font-black mb-1">{stat.value}</p>
              <p className="text-blue-100 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
