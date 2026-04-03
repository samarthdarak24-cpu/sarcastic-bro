"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight, 
  MoreVertical,
  Calendar,
  MapPin,
  ArrowRight,
  Filter,
  Search,
  Box,
  LayoutGrid,
  Zap,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReputationBadge } from "@/components/ui/ReputationBadge";
import { Input } from "@/components/ui/input";
import { orderService, Order } from "@/services/orderService";
import { getSocket } from "@/lib/socket";
import toast from "react-hot-toast";

const STATUS_TABS = ["All", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrderControlCenter() {
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [liveAwareness, setLiveAwareness] = useState(false);

  useEffect(() => {
    fetchOrders();
    const socket = getSocket();
    
    socket.emit("order:radar:view"); // Announce presence on fulfillment radar

    socket.on("order:status:updated", (data: any) => {
        toast(`Order #${data.orderNumber} status changed to ${data.status}`, { 
          icon: "📦",
          style: { borderRadius: '1rem', background: '#0a84ff', color: '#fff' }
        });
        setLiveAwareness(true);
        setTimeout(() => setLiveAwareness(false), 3000);
        fetchOrders();
    });

    return () => {
        socket.off("order:status:updated");
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order pipeline");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: any) => {
    // 1. Optimistic UI Update
    const previousOrders = [...orders];
    const updatedOrders = orders.map(o => 
      o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
    );
    setOrders(updatedOrders as any);

    try {
      await orderService.updateStatus(id, status);
      toast.success(`Order moving to ${status}`, {
        style: { borderRadius: '1rem', background: '#0a84ff', color: '#fff', fontWeight: 'bold' }
      });
    } catch (err) {
      // Rollback on failure
      setOrders(previousOrders);
      toast.error("Failed to update execution state");
    }
  };

  const filteredOrders = orders.filter(o => 
    (activeTab === "All" || o.status === activeTab) &&
    (o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.product?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-fade-in text-neut-900 border-neut-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-2 border-b border-neut-100">
         <div>
            <div className="flex items-center gap-3 mb-1">
               <h2 className="text-3xl font-black tracking-tight">Execution Radar</h2>
               {liveAwareness && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-success/10 rounded-full"
                  >
                     <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                     <span className="text-[10px] font-black text-success uppercase tracking-wider">Live Sync</span>
                  </motion.div>
               )}
            </div>
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest leading-loose">REAL-TIME CONTRACT FULFILLMENT & LOGISTICS</p>
         </div>
         <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl justify-end">
            <div className="relative group flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neut-400 group-focus-within:text-brand-primary" />
                <Input 
                  placeholder="Scan Order ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-12 text-sm border-none shadow-startup-soft bg-white/80 rounded-2xl"
                />
            </div>
            <div className="flex items-center gap-2 p-1 bg-neut-100 rounded-2xl overflow-x-auto no-scrollbar">
                {["All", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 h-10 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap tracking-widest ${
                            activeTab === tab ? "bg-white text-neut-900 shadow-startup-soft" : "text-neut-400 hover:text-neut-700"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="h-64 glass-card flex flex-col items-center justify-center gap-4">
                <Zap size={40} className="text-brand-primary animate-pulse" />
                <p className="text-xs font-black text-neut-300 uppercase tracking-widest">Warping to Fulfillment Data...</p>
            </div>
          ) : filteredOrders.map((order, i) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-none shadow-startup-soft hover:shadow-startup-medium transition-all group overflow-hidden bg-white/60 backdrop-blur-xl relative rounded-[3rem]">
                <CardContent className="p-10 flex flex-col xl:flex-row xl:items-center gap-12">
                   {/* Client Profile & Order ID */}
                   <div className="flex items-center gap-8 min-w-[300px]">
                      <div className="relative">
                        <div className="h-20 w-20 bg-brand-primary/5 rounded-[2rem] flex items-center justify-center text-brand-primary shadow-startup-soft">
                            <LayoutGrid size={32} />
                        </div>
                        {/* Real-time Status Pulse */}
                        {new Date().getTime() - new Date(order.updatedAt).getTime() < 300000 && (
                            <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-white"
                            />
                        )}
                      </div>
                      <div>
                         <div className="flex items-center gap-2 mb-2">
                            <Badge tone="brand" className="text-[9px] font-black h-5 uppercase">{order.status}</Badge>
                            <span className="text-[10px] font-black text-neut-300 uppercase tracking-widest">#{order.orderNumber}</span>
                         </div>
                         <h3 className="text-2xl font-black text-neut-900 tracking-tight mb-1">{order.product?.name}</h3>
                         <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-1.5 text-neut-400 text-xs font-bold font-mono">
                                <ArrowRight size={12} /> <span>Buyer: {order.buyer?.name}</span>
                             </div>
                             <ReputationBadge score={order.buyer?.reputationScore || 100} compact />
                         </div>
                      </div>
                   </div>

                   {/* Fulfillment Progress Timeline */}
                   <div className="flex-1">
                      <div className="flex justify-between items-center mb-8">
                         {["CONFIRMED", "SHIPPED", "DELIVERED"].map((step, si) => {
                            const isDone = [ "CONFIRMED", "SHIPPED", "DELIVERED"].indexOf(order.status) >= si;
                            const ts = step === "CONFIRMED" ? order.confirmedAt : step === "SHIPPED" ? order.shippedAt : order.deliveredAt;
                            return (
                               <div key={step} className="flex flex-col items-center gap-3 relative z-10">
                                  <motion.div 
                                     animate={{ 
                                       backgroundColor: isDone ? "#0a84ff" : "#f2f2f7",
                                       scale: isDone ? 1.1 : 1
                                     }}
                                     className="h-10 w-10 rounded-2xl flex items-center justify-center shadow-startup-soft"
                                  >
                                     {isDone ? <CheckCircle2 size={20} className="text-white" /> : <Clock size={18} className="text-neut-300" />}
                                  </motion.div>
                                  <div className="text-center">
                                     <p className={`text-[9px] font-black uppercase tracking-widest ${isDone ? "text-neut-900" : "text-neut-300"}`}>{step}</p>
                                     {ts && <p className="text-[8px] font-bold text-success mt-1">{new Date(ts).toLocaleDateString()}</p>}
                                  </div>
                               </div>
                            );
                         })}
                         {/* Progress bar background */}
                         <div className="absolute top-14 left-1/4 right-1/4 h-1 bg-neut-50 -z-10 rounded-full overflow-hidden">
                             <motion.div 
                                className="h-full bg-brand-primary"
                                initial={{ width: 0 }}
                                animate={{ 
                                    width: order.status === "DELIVERED" ? "100%" : 
                                           order.status === "SHIPPED" ? "66%" : 
                                           order.status === "CONFIRMED" ? "33%" : "0%"
                                }}
                             />
                         </div>
                      </div>
                   </div>

                   {/* Action Control Panel */}
                   <div className="flex items-center gap-8 justify-between xl:justify-end">
                      <div className="text-right">
                         <p className="text-[10px] font-black text-neut-300 uppercase tracking-widest mb-1">Total Contract Value</p>
                         <p className="text-2xl font-black text-neut-900">₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <select 
                            className="h-14 px-6 rounded-2xl bg-neut-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-neut-800 transition-all shadow-glow-primary outline-none"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                         >
                            {STATUS_TABS.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                         <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-neut-200">
                             <MoreVertical size={20} />
                         </Button>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {!loading && filteredOrders.length === 0 && (
             <div className="text-center py-32 bg-neut-50/50 rounded-[4rem] border-2 border-dashed border-neut-100 flex flex-col items-center">
                 <div className="h-24 w-24 bg-white rounded-[2.5rem] shadow-startup-soft flex items-center justify-center mb-8"><Box size={40} className="text-neut-200" /></div>
                 <h3 className="text-2xl font-black tracking-tight text-neut-900 mb-2">Pipeline Clear</h3>
                 <p className="text-neut-500 font-medium max-w-md mx-auto">All contract streams are currently up to date. Ready for the next major sourcing loop.</p>
             </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
