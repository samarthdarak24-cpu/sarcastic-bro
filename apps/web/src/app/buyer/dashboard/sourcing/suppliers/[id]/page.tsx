"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Star, MapPin, Package, TrendingUp, Clock, 
  CheckCircle, Award, Shield, Phone, Mail, Calendar,
  BarChart3, Users, Truck, AlertCircle
} from "lucide-react";
import { productService } from "@/services/productService";
import toast from "react-hot-toast";

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  rating: number;
  totalOrders: number;
  onTimeDelivery: number;
  qualityScore: number;
  verified: boolean;
  joinedDate: string;
  products: any[];
}

export default function SupplierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supplierId = params.id as string;
  
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "reviews">("overview");

  useEffect(() => {
    loadSupplierData();
  }, [supplierId]);

  const loadSupplierData = async () => {
    try {
      setLoading(true);
      // Load all products and filter by farmer (supplier)
      const products = await productService.getAll();
      const supplierProducts = products.filter(p => p.farmerId === supplierId);
      
      if (supplierProducts.length === 0) {
        toast.error("Supplier not found");
        router.push("/buyer/dashboard/sourcing");
        return;
      }

      // Get supplier info from first product
      const firstProduct = supplierProducts[0];
      const supplierData: Supplier = {
        id: supplierId,
        name: firstProduct.farmer?.name || "Unknown Supplier",
        email: firstProduct.farmer?.email || "",
        phone: "+91 98765 43210",
        location: firstProduct.district || firstProduct.state || "India",
        rating: 4.7,
        totalOrders: Math.floor(Math.random() * 500) + 100,
        onTimeDelivery: 95 + Math.floor(Math.random() * 5),
        qualityScore: 90 + Math.floor(Math.random() * 10),
        verified: true,
        joinedDate: "2023-01-15",
        products: supplierProducts,
      };

      setSupplier(supplierData);
    } catch (error) {
      console.error("Failed to load supplier:", error);
      toast.error("Failed to load supplier details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Supplier not found</h3>
          <button
            onClick={() => router.push("/buyer/dashboard/sourcing")}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
          >
            Back to Sourcing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Suppliers
        </button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black">
              {supplier.name.charAt(0)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-black text-slate-900">{supplier.name}</h1>
                    {supplier.verified && (
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 mb-3">
                    <MapPin size={16} />
                    <span className="font-medium">{supplier.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={18} className="text-amber-500 fill-amber-500" />
                    <span className="text-xl font-bold text-slate-900">{supplier.rating}</span>
                    <span className="text-slate-500 ml-2">({supplier.totalOrders} orders)</span>
                  </div>
                </div>
                
                <button
                  onClick={() => router.push(`/buyer/dashboard/sourcing/suppliers/${supplierId}/analytics`)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <BarChart3 size={18} />
                  View Analytics
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Mail size={20} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email</p>
                    <p className="text-sm font-bold text-slate-900">{supplier.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Phone size={20} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Phone</p>
                    <p className="text-sm font-bold text-slate-900">{supplier.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Calendar size={20} className="text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Member Since</p>
                    <p className="text-sm font-bold text-slate-900">
                      {new Date(supplier.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Quality Score", value: `${supplier.qualityScore}%`, icon: Award, color: "emerald" },
            { label: "On-Time Delivery", value: `${supplier.onTimeDelivery}%`, icon: Truck, color: "blue" },
            { label: "Total Products", value: supplier.products.length.toString(), icon: Package, color: "indigo" },
            { label: "Active Orders", value: supplier.totalOrders.toString(), icon: TrendingUp, color: "amber" },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg"
            >
              <div className={`h-12 w-12 bg-${metric.color}-50 rounded-2xl flex items-center justify-center text-${metric.color}-600 mb-4`}>
                <metric.icon size={24} />
              </div>
              <p className="text-3xl font-black text-slate-900 mb-1">{metric.value}</p>
              <p className="text-slate-500 font-medium text-sm">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="flex border-b border-slate-200">
            {[
              { id: "overview", label: "Overview" },
              { id: "products", label: "Products" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">About Supplier</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {supplier.name} is a verified supplier with an excellent track record of delivering 
                    high-quality agricultural products. With {supplier.totalOrders} successful orders and 
                    a {supplier.rating} star rating, they are a trusted partner in the agricultural marketplace.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">Performance Highlights</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-600">Quality Score</span>
                        <span className="text-slate-900 font-bold">{supplier.qualityScore}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${supplier.qualityScore}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-600">On-Time Delivery</span>
                        <span className="text-slate-900 font-bold">{supplier.onTimeDelivery}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${supplier.onTimeDelivery}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "products" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supplier.products.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-green-50 to-blue-50">
                      {product.imageUrls && product.imageUrls[0] ? (
                        <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={48} className="text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">{product.quantity} {product.unit}</span>
                        <span className="text-xl font-black text-blue-600">₹{product.price}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-12">
                <Users size={64} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Reviews Coming Soon</h3>
                <p className="text-slate-500">Customer reviews will be displayed here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
