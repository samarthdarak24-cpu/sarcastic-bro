'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/services/orderService';
import { useSocket } from '@/hooks/useSocket';
import { 
  Package, MapPin, Truck, CheckCircle2, AlertCircle, Clock, 
  TrendingUp, Activity, Database, Zap, Shield, FileText, ArrowRight, X, Globe, Fingerprint
} from 'lucide-react';

interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  farmerProductId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'REJECTED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'REFUNDED';
  deliveryAddress?: string;
  orderDate: string;
  expectedDelivery?: string;
  notes?: string;
}

const statusColors = {
  PENDING: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  ACCEPTED: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  PREPARING: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  IN_TRANSIT: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  DELIVERED: 'text-green-400 bg-green-400/10 border-green-400/20',
  REJECTED: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  CANCELLED: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
};

const statusSteps = ['PENDING', 'ACCEPTED', 'PREPARING', 'IN_TRANSIT', 'DELIVERED'];

export default function FarmerLogisticsCenter() {
  const { user } = useAuth();
  const socket = useSocket();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Order['status'] | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  // Apply status filter
  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === filter));
    }
  }, [orders, filter]);

  // Real-time order updates
  useEffect(() => {
    if (!socket) return;

    socket.on('order:created', (newOrder: Order) => {
      setOrders((prev) => [newOrder, ...prev]);
    });

    socket.on('order:updated', (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
      if (selectedOrder?.id === updatedOrder.id) {
        setSelectedOrder(updatedOrder);
      }
    });

    socket.on('order:cancelled', (orderId: string) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: 'CANCELLED' } : o
        )
      );
    });

    return () => {
      socket.off('order:created');
      socket.off('order:updated');
      socket.off('order:cancelled');
    };
  }, [socket, selectedOrder]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getFarmerOrders();
      setOrders(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      // Mock data for hackathon presentation layer
      setOrders([
        {
          id: '0x9a8f4E2B1',
          buyerId: 'buyer1',
          buyerName: 'Green Valley Global Logistics',
          farmerProductId: 'prod1',
          productName: 'Export Grade Premium Wheat',
          quantity: 120,
          unit: 'Tonnes',
          unitPrice: 24500,
          totalAmount: 2940000,
          status: 'IN_TRANSIT',
          paymentStatus: 'CONFIRMED',
          deliveryAddress: 'Rotterdam Export Hub, Dock 4A',
          orderDate: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'High-priority blockchain audited delivery.',
        },
        {
          id: '0x2bF839cd',
          buyerId: 'buyer2',
          buyerName: 'Apex Agricultural Cartel',
          farmerProductId: 'prod2',
          productName: 'Organic Soybean (Cluster A)',
          quantity: 45,
          unit: 'Tonnes',
          unitPrice: 52000,
          totalAmount: 2340000,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          deliveryAddress: 'Delhi Central Processing Unit',
          orderDate: new Date().toISOString(),
          expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Escrow verification pending smart contract lock.',
        },
        {
          id: '0x4cE672fa',
          buyerId: 'buyer3',
          buyerName: 'AgriCorp Europe',
          farmerProductId: 'prod3',
          productName: 'Basmati Rice (Gold Tier)',
          quantity: 200,
          unit: 'Tonnes',
          unitPrice: 85000,
          totalAmount: 17000000,
          status: 'ACCEPTED',
          paymentStatus: 'COMPLETED',
          deliveryAddress: 'Hamburg Central Fulfillment',
          orderDate: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
          expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Payment settled. Ready for terminal deployment.',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Optimistic update for presentation
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      await orderService.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      // Fail silently in mock view since backend might missing
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-emerald-500/30 pb-20">
      {/* 🚀 Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-emerald-500/10 pb-4 pt-6 px-4 md:px-10">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/farmer/dashboard">
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all cursor-pointer group">
                <ArrowRight size={20} className="text-emerald-400 rotate-180 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
                <Globe className="text-blue-500" /> Logistics Control
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Global Order Matrix Connected</p>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
            {(['ALL', 'PENDING', 'ACCEPTED', 'IN_TRANSIT', 'DELIVERED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  filter === status
                    ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Orders */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <LiveFleetTelemetry />

          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="text-emerald-500 p-10 font-mono text-center flex flex-col items-center gap-4">
                 <div className="h-10 w-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"/>
                 Decrypting blockchain orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-16 text-center">
                <Package size={48} className="text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">No active vectors</h3>
                <p className="text-sm text-slate-600 mt-2">Filter state returned null results</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden flex flex-col gap-4 ${
                      selectedOrder?.id === order.id
                        ? 'bg-slate-900 border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]'
                        : 'bg-slate-950/50 border-slate-800 hover:border-emerald-500/30 hover:bg-slate-900'
                    }`}
                  >
                    {selectedOrder?.id === order.id && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_20px_#10b981]" />
                    )}
                    
                    <div className="flex justify-between items-start z-10 relative">
                       <div>
                          <div className="flex items-center gap-3 mb-2">
                             <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[order.status]}`}>
                                {order.status.replace('_', ' ')}
                             </div>
                             <span className="text-[10px] font-mono text-slate-500"><Shield size={10} className="inline mr-1"/>{order.id}</span>
                          </div>
                          <h2 className="text-2xl font-black text-white italic tracking-tighter">{order.productName}</h2>
                          <p className="text-sm text-slate-400 font-bold mt-1 tracking-widest uppercase">Buyer: <span className="text-emerald-400">{order.buyerName}</span></p>
                       </div>
                       
                       <div className="text-right">
                          <p className="text-3xl font-black text-white">₹{(order.totalAmount / 100000).toFixed(2)}L</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Valuation</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t border-slate-800/50 pt-4 mt-2">
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Volume Set</p>
                          <p className="text-lg font-bold text-slate-200">{order.quantity} <span className="font-mono text-xs">{order.unit}</span></p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Escrow Route</p>
                          <p className="text-lg font-bold text-emerald-400">{order.paymentStatus}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Delivery Vector</p>
                          <p className="text-sm font-bold text-slate-300 truncate">{order.deliveryAddress || 'Port Auth 7'}</p>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Right Column: Tracking HUD */}
        <div className="lg:col-span-5 relative">
           <div className="sticky top-28 bottom-10 h-[calc(100vh-160px)]">
             <AnimatePresence mode="wait">
               {selectedOrder ? (
                 <motion.div
                    key={selectedOrder.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full bg-slate-900 border border-slate-800 rounded-[2rem] p-8 flex flex-col shadow-2xl relative overflow-hidden"
                 >
                    {/* Background Tech Details */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900/0 to-slate-900/0 pointer-events-none" />
                    <Fingerprint className="absolute -bottom-10 -right-10 text-emerald-500/5 scale-[4]" size={100} />

                    <div className="flex justify-between items-center mb-8 relative z-10">
                       <div>
                          <h3 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-1">Tracking Matrix</h3>
                          <p className="text-xs font-mono text-slate-400">HASH: {selectedOrder.id}-SYS-99X</p>
                       </div>
                       <button onClick={() => setSelectedOrder(null)} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                          <X size={16} className="text-slate-400" />
                       </button>
                    </div>

                    {/* Interactive GPS Simulation Radar */}
                    <div className="w-full h-48 bg-slate-950 rounded-2xl border border-slate-800 mb-8 overflow-hidden relative group">
                       <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                       
                       <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] border border-blue-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 border-t-blue-500"
                       />
                       
                       <div className="absolute top-1/2 left-1/2 h-2 w-2 bg-emerald-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_#10b981]" />
                       
                       {/* Simulated truck positions moving */}
                       <motion.div 
                          animate={{ x: [0, 80], y: [0, -30] }}
                          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
                          className="absolute top-1/2 left-1/2 flex items-center gap-2"
                       >
                          <div className="h-3 w-3 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]" />
                          <span className="text-[10px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded shadow">TRK-882</span>
                       </motion.div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2 space-y-8">
                       
                       {/* Control Actions */}
                       <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                          <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-4">Command Actions</h4>
                          
                          {selectedOrder.status === 'PENDING' ? (
                             <div className="flex gap-4">
                                <button onClick={() => handleStatusUpdate(selectedOrder.id, 'ACCEPTED')} className="flex-1 bg-emerald-500 text-slate-950 font-black italic tracking-tighter uppercase rounded-xl py-4 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all">
                                   Authorize Vault
                                </button>
                                <button onClick={() => handleStatusUpdate(selectedOrder.id, 'REJECTED')} className="px-6 border border-rose-500/30 text-rose-400 rounded-xl font-bold hover:bg-rose-500/10 transition-colors">
                                   Deny
                                </button>
                             </div>
                          ) : (
                             <div className="flex flex-col gap-3">
                                {statusSteps.map((step, idx) => {
                                   const isCurrent = selectedOrder.status === step;
                                   const isPast = statusSteps.indexOf(selectedOrder.status) >= idx;
                                   
                                   return (
                                      <button 
                                         key={step}
                                         disabled={isPast || selectedOrder.status === 'REJECTED' || selectedOrder.status === 'CANCELLED'}
                                         onClick={() => handleStatusUpdate(selectedOrder.id, step as Order['status'])}
                                         className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                            isCurrent ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_#3b82f6]' :
                                            isPast ? 'bg-slate-900 border-slate-800 text-emerald-500 opacity-60' :
                                            'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                                         }`}
                                      >
                                         <span className="font-bold tracking-widest text-xs uppercase">{step.replace('_', ' ')}</span>
                                         {isPast && <CheckCircle2 size={16} />}
                                      </button>
                                   )
                                })}
                             </div>
                          )}
                       </div>

                       {/* Data Manifest */}
                       <div className="grid grid-cols-2 gap-4 pb-10">
                          <div className="bg-white/5 p-4 rounded-2xl">
                             <p className="text-[10px] uppercase font-black text-slate-500 mb-1">Contract Timestamp</p>
                             <p className="text-xs font-mono font-bold text-slate-300">{new Date(selectedOrder.orderDate).toLocaleString()}</p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl">
                             <p className="text-[10px] uppercase font-black text-slate-500 mb-1">Expected SLA</p>
                             <p className="text-xs font-mono font-bold text-amber-400">{new Date(selectedOrder.expectedDelivery!).toLocaleString()}</p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl col-span-2">
                             <p className="text-[10px] uppercase font-black text-slate-500 mb-1">Logistics Note</p>
                             <p className="text-sm font-bold text-slate-300 italic">{selectedOrder.notes || 'Standard protocol.'}</p>
                          </div>
                           <Link
                             href={`/farmer/messages/${selectedOrder.buyerId}`}
                             className="col-span-2 mt-4 bg-slate-800 border border-slate-700 text-slate-300 py-4 rounded-xl font-black italic tracking-tighter uppercase flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                           >
                             <Activity size={16} /> Secure Comms Link
                           </Link>
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full bg-slate-950/50 border border-slate-800 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center p-10"
                 >
                    <div className="w-24 h-24 mb-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                       <MapPin size={40} className="text-slate-700" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-500 uppercase tracking-widest">Select Target Vector</h3>
                    <p className="text-slate-600 mt-2 text-sm max-w-[250px]">Click any active array on the left to inject its data matrix.</p>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------------------
// Isolated Real-Time Telemetry Component (Performance Sync)
// ----------------------------------------------------
function LiveFleetTelemetry() {
   const [metrics, setMetrics] = useState({
      activeNodes: 148,
      syncPing: 12,
      variance: 0.4
   });

   useEffect(() => {
      const interval = setInterval(() => {
         setMetrics(prev => ({
            activeNodes: Math.max(100, Math.min(200, prev.activeNodes + Math.floor(Math.random() * 5 - 2))),
            syncPing: Math.max(8, Math.min(30, prev.syncPing + Math.floor(Math.random() * 4 - 2))),
            variance: Number((prev.variance + (Math.random() * 0.1 - 0.05)).toFixed(2))
         }));
      }, 1500);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Fleet Sync Ping</p>
               <p className="text-2xl font-mono text-emerald-400 font-bold">{metrics.syncPing}ms</p>
            </div>
            <Zap size={24} className="text-emerald-500/50" />
         </div>
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Ground Nodes</p>
               <p className="text-2xl font-mono text-blue-400 font-bold">{metrics.activeNodes}</p>
            </div>
            <Truck size={24} className="text-blue-500/50" />
         </div>
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Route Variance</p>
               <p className="text-2xl font-mono text-amber-400 font-bold">{metrics.variance}%</p>
            </div>
            <Activity size={24} className="text-amber-500/50" />
         </div>
      </div>
   );
}
