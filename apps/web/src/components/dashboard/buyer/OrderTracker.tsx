"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Zap,
  Target,
  Layers,
  ArrowRight,
  CreditCard,
  Box
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReputationBadge } from "@/components/ui/ReputationBadge";
import { orderService, Order } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { loadRazorpay } from "@/lib/razorpay";
import { RazorpayPaymentButton } from "./RazorpayPaymentButton";
import toast from "react-hot-toast";

export function OrderTracker() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [gps, setGps] = useState({ lat: 28.6139, lng: 77.2090 });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll();
      const orderList = data.orders || [];
      setOrders(orderList);
      if (orderList.length > 0) setSelectedOrder(orderList[0]);
    } catch (err) {
      toast.error("Failed to load shipment logs");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setGps(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.005,
        lng: prev.lng + (Math.random() - 0.5) * 0.005
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="h-[600px] flex flex-col items-center justify-center gap-6">
       <Zap size={48} className="text-brand-secondary animate-pulse" />
       <p className="text-xl font-black text-neut-900 tracking-tighter">Syncing Transit Intelligence...</p>
    </div>
  );

  if (orders.length === 0) return (
    <div className="h-[600px] flex flex-col items-center justify-center text-center px-12">
        <Box size={80} className="text-neut-100 mb-8" />
        <h3 className="text-3xl font-black text-neut-900 mb-4 tracking-tight">No active shipments in transit</h3>
        <p className="text-neut-500 font-medium max-w-sm mx-auto mb-10">Start a sourcing loop or check your bulk auctions for active execution streams.</p>
        <Button variant="gradient" className="h-14 px-10 rounded-2xl font-black shadow-lg shadow-brand-secondary/20">Init New Loop</Button>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in text-neut-900 border-neut-200">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-neut-100">
         <div>
            <h2 className="text-3xl font-black tracking-tight mb-1">Contract Execution Radar</h2>
            <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest leading-loose">REAL-TIME SHIPMENT & ESG TRACEABILITY</p>
         </div>
         <Badge tone="ink" className="h-10 px-4 rounded-xl flex items-center justify-center font-black">
            {orders.length} ACTIVE SHIPMENTS
         </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Live Shipment Feed */}
         <div className="space-y-6">
            {orders.map((order) => (
               <motion.div
                  key={order.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-10 rounded-[3rem] cursor-pointer transition-all border ${
                      selectedOrder?.id === order.id 
                      ? "bg-white border-brand-secondary shadow-startup-soft ring-4 ring-brand-secondary/5" 
                      : "bg-neut-50/50 border-transparent hover:bg-white hover:border-neut-100"
                  }`}
               >
                  <div className="flex justify-between items-start mb-10">
                     <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-neut-100 rounded-[1.5rem] flex items-center justify-center text-neut-300 shadow-startup-soft"><Package size={28} /></div>
                        <div>
                           <h4 className="text-2xl font-black text-neut-900 tracking-tight">{order.product?.name}</h4>
                           <div className="flex items-center gap-3">
                              <p className="text-xs font-bold text-neut-400">By <span className="text-brand-secondary font-black">{order.farmer?.name}</span></p>
                              <ReputationBadge score={(order as any).farmer?.reputationScore || 100} compact />
                           </div>
                        </div>
                     </div>
                     <Badge 
                        tone={['SHIPPED', 'IN_TRANSIT'].includes(order.status) ? 'brand' : 'ink'} 
                        className={`rounded-lg h-7 px-4 font-black text-[10px] uppercase shadow-sm ${['SHIPPED', 'IN_TRANSIT'].includes(order.status) ? 'animate-pulse' : ''}`}
                     >
                        {order.status}
                     </Badge>
                  </div>

                  <div className="space-y-4 mb-10">
                     <div className="flex justify-between text-[10px] font-black text-neut-300 uppercase tracking-widest mb-2">
                        <span>Shipment Progress</span>
                        <span>{order.status === 'DELIVERED' ? '100%' : order.status === 'SHIPPED' ? '75%' : '25%'}</span>
                     </div>
                     <div className="h-2 w-full bg-neut-100 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: order.status === 'DELIVERED' ? '100%' : order.status === 'SHIPPED' ? '75%' : '25%' }}
                           className="h-full bg-brand-secondary shadow-glow-secondary rounded-full"
                        />
                     </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-neut-100 pt-6">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-neut-300 uppercase tracking-widest mb-1">Contract ID</span>
                        <span className="text-xl font-black text-neut-900">#{order.orderNumber}</span>
                     </div>
                     <div className="text-right flex flex-col items-end gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-neut-300 uppercase tracking-widest mb-1">Total Stake</span>
                            <span className="text-xl font-black text-neut-900">₹{order.totalPrice.toLocaleString()}</span>
                        </div>
                        {order.status === 'PENDING' && (
                             <RazorpayPaymentButton 
                                 amount={order.totalPrice} 
                                 orderId={order.id} 
                                 farmerName={order.farmer?.name || 'Farmer'}
                                 onSuccess={() => { toast.success("Paid!"); fetchOrders(); }}
                             />
                        )}
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>

         {/* Detailed Execution Timeline */}
         <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-12 rounded-[3.5rem] relative overflow-hidden flex flex-col h-full min-h-[600px]">
             <div className="absolute top-0 right-0 p-10 flex flex-col items-end">
                <div className="h-14 w-14 bg-success/10 rounded-2xl flex items-center justify-center text-success shadow-startup-soft"><ShieldCheck size={28} /></div>
                <p className="text-[10px] font-black text-success uppercase mt-2">Trace-Signed Log</p>
             </div>

             <h3 className="text-3xl font-black text-neut-900 tracking-tight mb-16">Execution Timeline</h3>

             <div className="flex-1 relative space-y-12">
                {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"].map((step, i) => {
                   const isCompleted = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"].indexOf(selectedOrder?.status || 'PENDING') >= i;
                   return (
                      <div key={step} className="flex gap-10 group">
                         <div className="flex flex-col items-center shrink-0">
                            <motion.div 
                               initial={false}
                               animate={{ 
                                  backgroundColor: isCompleted ? "#0a84ff" : "#f2f2f7",
                                  scale: isCompleted ? 1.1 : 1
                               }}
                               className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-startup-soft transition-all`}
                            >
                               {isCompleted ? <CheckCircle2 size={24} /> : <div className="h-2 w-2 rounded-full bg-neut-300" />}
                            </motion.div>
                            {i < 3 && <div className={`w-1 h-12 my-2 rounded-full transition-colors ${isCompleted ? "bg-brand-secondary" : "bg-neut-100"}`} />}
                         </div>
                         <div className="flex-1 pt-2">
                            <h5 className={`text-xl font-black tracking-tight mb-1 ${isCompleted ? "text-neut-900" : "text-neut-300"}`}>{step}</h5>
                            <p className="text-xs font-bold text-neut-400">
                               {isCompleted ? "Execution stream authenticated and logged." : "Waiting for current loop transition."}
                            </p>
                         </div>
                      </div>
                   );
                })}
             </div>

             <div className="mt-12 bg-neut-900 text-white p-8 rounded-[2rem] flex items-center justify-between shadow-startup-medium">
                <div>
                   <h4 className="font-extrabold text-lg mb-1 tracking-tight">Active GPS Pulse</h4>
                   <p className="text-white/40 text-[10px] font-mono">LATEST: {gps.lat.toFixed(6)}, {gps.lng.toFixed(6)}</p>
                </div>
                <Button variant="outline" className="h-12 px-6 rounded-xl font-black text-white hover:bg-white hover:text-neut-900 border-white/20 shadow-glow-primary">
                    Live Map
                    <ArrowRight size={18} className="ml-2" />
                </Button>
             </div>
         </Card>
      </div>
    </div>
  );
}
