"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, MapPin, Eye } from "lucide-react";
import { orderService } from "@/services/orderService";
import { useOrderUpdates } from "@/hooks/useSocket";
import { useRealtimeStore } from "@/store/realtimeStore";
import toast from "react-hot-toast";

interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  createdAt: string;
  product?: {
    name: string;
    unit: string;
  };
}

export function OrderTracker() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { liveOrders } = useRealtimeStore();

  // Load orders
  useEffect(() => {
    loadOrders();
  }, []);

  // Listen for real-time order updates
  useOrderUpdates((data) => {
    setOrders(prev => prev.map(order => 
      order.id === data.orderId ? { ...order, status: data.status } : order
    ));
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED": return "emerald";
      case "SHIPPED": 
      case "IN_TRANSIT": return "blue";
      case "PROCESSING": return "amber";
      case "PENDING": return "yellow";
      case "CANCELLED": return "red";
      default: return "slate";
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING": return 10;
      case "PROCESSING": return 30;
      case "SHIPPED":
      case "IN_TRANSIT": return 60;
      case "DELIVERED": return 100;
      case "CANCELLED": return 0;
      default: return 0;
    }
  };

  const statusCounts = {
    total: orders.length,
    inTransit: orders.filter(o => o.status === 'SHIPPED' || o.status === 'IN_TRANSIT').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    pending: orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length,
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Order Tracker</h1>
        <p className="text-slate-500 font-medium">Real-time shipment monitoring</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Orders", value: statusCounts.total.toString(), icon: Package, color: "blue" },
          { label: "In Transit", value: statusCounts.inTransit.toString(), icon: Truck, color: "indigo" },
          { label: "Delivered", value: statusCounts.delivered.toString(), icon: CheckCircle, color: "emerald" },
          { label: "Pending", value: statusCounts.pending.toString(), icon: Clock, color: "amber" },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg">
            <div className={`h-12 w-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
            <p className="text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Package size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-500">Start ordering from farmers to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const color = getStatusColor(order.status);
            const progress = getStatusProgress(order.status);
            const liveOrder = liveOrders[order.id];
            const currentStatus = liveOrder?.status || order.status;

            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">{order.orderNumber}</h3>
                    <p className="text-slate-500 font-medium">
                      {order.product?.name || 'Product'} - {order.quantity} {order.product?.unit || 'units'}
                    </p>
                  </div>
                  <div className={`px-4 py-2 bg-${color}-50 text-${color}-600 rounded-full font-bold text-sm`}>
                    {currentStatus.replace('_', ' ')}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-slate-600">Progress</span>
                    <span className="text-slate-900 font-bold">{progress}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: idx * 0.2 }}
                      className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} />
                    <span className="text-sm font-medium">{order.deliveryAddress}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">₹{order.totalAmount}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
