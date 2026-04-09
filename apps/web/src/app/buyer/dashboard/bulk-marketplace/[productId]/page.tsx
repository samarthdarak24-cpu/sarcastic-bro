"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Package, MapPin, Star, TrendingUp, Users,
  Shield, CheckCircle, Calendar, Truck, DollarSign,
  BarChart3, Award, Clock, AlertCircle, ShoppingCart
} from "lucide-react";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import toast from "react-hot-toast";

interface BulkProduct {
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
  district?: string;
  state?: string;
  farmerId: string;
  farmer?: {
    name: string;
    email: string;
  };
  minimumOrder?: number;
  harvestDate?: string;
  certifications?: string[];
}

export default function BulkProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [product, setProduct] = useState<BulkProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(productId);
      setProduct(data as BulkProduct);
      setOrderQuantity(data.minimumOrder || 1);
    } catch (error) {
      console.error("Failed to load product:", error);
      toast.error("Failed to load product details");
      router.push("/buyer/dashboard/bulk-marketplace");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!product) return;

    try {
      await orderService.createOrder({
        productId: product.id,
        quantity: orderQuantity,
        shippingAddress: "Default Address",
      });

      toast.success(`Bulk order placed for ${product.name}!`);
      setShowOrderModal(false);
      router.push("/buyer/dashboard/orders");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Product not found</h3>
          <button
            onClick={() => router.push("/buyer/dashboard/bulk-marketplace")}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * orderQuantity;
  const estimatedSavings = totalPrice * 0.15; // 15% bulk discount

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Marketplace
        </button>

        {/* Product Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl overflow-hidden">
                {product.imageUrls && product.imageUrls[0] ? (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={96} className="text-slate-300" />
                  </div>
                )}
                {product.qualityGrade && (
                  <div className="absolute top-4 right-4 h-16 w-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">{product.qualityGrade}</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.imageUrls.slice(0, 4).map((url, idx) => (
                    <div key={idx} className="h-20 bg-slate-100 rounded-xl overflow-hidden">
                      <img src={url} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    {product.category}
                  </span>
                  {product.qualityScore && (
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-900">{product.qualityScore}%</span>
                    </div>
                  )}
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-3">{product.name}</h1>
                <div className="flex items-center gap-2 text-slate-500 mb-4">
                  <MapPin size={18} />
                  <span className="font-medium">{product.district || product.state || "India"}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {product.description || "Premium quality bulk agricultural product available for immediate delivery."}
                </p>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-black text-blue-600">₹{product.price}</span>
                  <span className="text-xl text-slate-600 font-medium">per {product.unit}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <TrendingUp size={18} />
                  <span>Save up to 15% on bulk orders</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Package size={16} />
                    <span className="text-sm font-medium">Available</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{product.quantity} {product.unit}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <ShoppingCart size={16} />
                    <span className="text-sm font-medium">Min Order</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{product.minimumOrder || 1} {product.unit}</p>
                </div>
              </div>

              {/* Order Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Order Quantity ({product.unit})
                  </label>
                  <input
                    type="number"
                    min={product.minimumOrder || 1}
                    max={product.quantity}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                    className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-bold text-slate-900">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Bulk Discount (15%)</span>
                    <span className="font-bold text-emerald-600">-₹{estimatedSavings.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-blue-600">₹{(totalPrice - estimatedSavings).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full h-14 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart size={20} />
                  Place Bulk Order
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Shield size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Quality Assured</h3>
            </div>
            <p className="text-slate-600 text-sm">
              All products are quality checked and verified before delivery.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Truck size={24} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Fast Delivery</h3>
            </div>
            <p className="text-slate-600 text-sm">
              Bulk orders delivered within 3-5 business days.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Award size={24} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Best Prices</h3>
            </div>
            <p className="text-slate-600 text-sm">
              Competitive bulk pricing with additional discounts.
            </p>
          </motion.div>
        </div>

        {/* Supplier Info */}
        {product.farmer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
          >
            <h3 className="text-2xl font-black text-slate-900 mb-6">Supplier Information</h3>
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                {product.farmer.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-1">{product.farmer.name}</h4>
                <p className="text-slate-500">{product.farmer.email}</p>
              </div>
              <button
                onClick={() => router.push(`/buyer/dashboard/sourcing/suppliers/${product.farmerId}`)}
                className="ml-auto px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
              >
                View Profile
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
