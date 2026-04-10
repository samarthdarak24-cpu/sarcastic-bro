'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Truck, CheckCircle2, Clock, 
  MapPin, Phone, CreditCard, DollarSign,
  ChevronDown, ExternalLink, RefreshCw, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

function QuickAction({ icon, label }: { icon: any, label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
      {icon}
      <span>{label}</span>
    </button>
  );
}

interface Order {
  id: string;
  quantity: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  escrowStatus: string;
  createdAt: string;
  buyer: { name: string; phone: string; gst: string };
  lot?: { cropName: string; pricePerKg: number };
  crop?: { cropName: string; pricePerKg: number };
}

const MOCK_ORDERS: Order[] = [
  { 
    id: 'ord_12345', quantity: 3500, totalAmount: 68250, status: 'CONFIRMED', paymentStatus: 'COMPLETED', escrowStatus: 'HELD', createdAt: new Date().toISOString(), 
    buyer: { name: 'BigBasket Fresh Logistics', phone: '1800123123', gst: '27AABCU1234F1Z1' }, lot: { cropName: 'Onion (Red Nasik Bulk)', pricePerKg: 19.5 }
  },
  { 
    id: 'ord_67890', quantity: 1200, totalAmount: 57600, status: 'IN_TRANSIT', paymentStatus: 'COMPLETED', escrowStatus: 'HELD', createdAt: new Date().toISOString(), 
    buyer: { name: 'Reliance Retail Ltd', phone: '1800456456', gst: '27BBCDE5678K2Z2' }, lot: { cropName: 'Premium Pomegranate', pricePerKg: 48 }
  },
  { 
    id: 'ord_11223', quantity: 2500, totalAmount: 87500, status: 'DELIVERED', paymentStatus: 'COMPLETED', escrowStatus: 'HELD', createdAt: new Date().toISOString(), 
    buyer: { name: 'Local Export Hub', phone: '9988776655', gst: '27CCDFG9012Q3Z3' }, lot: { cropName: 'Thompson Grapes Bulk', pricePerKg: 35 }
  }
];

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fpo/orders');
      if (!res.ok) {
        console.warn('API endpoint not available, using mock data');
        setOrders(MOCK_ORDERS);
        return;
      }
      const data = await res.json();
      setOrders(data.length > 0 ? data : MOCK_ORDERS);
    } catch (error) {
      console.error(error);
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      let endpoint: string;
      let method: string;

      if (status === 'IN_TRANSIT') {
        endpoint = `/api/fpo/order/${orderId}/dispatch`;
        method = 'POST';
      } else {
        endpoint = `/api/fpo/orders/${orderId}/status`;
        method = 'PUT';
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const handlePayout = async (orderId: string) => {
    try {
      const res = await fetch('/api/fpo/distribute-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.error || 'Payout distribution failed');
      }

      toast.success('Payments distributed to farmers successfully!');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredOrders = orders.filter(o => 
    activeTab === 'ACTIVE' 
      ? ['PENDING', 'CONFIRMED', 'IN_TRANSIT'].includes(o.status)
      : ['DELIVERED', 'CANCELLED'].includes(o.status)
  );

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Package size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">Order Management 📦</h2>
            <p className="text-white/80 font-medium">Track bulk purchases and manage fulfillment.</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">Total Orders</span>
                <p className="text-2xl font-black">{orders.length}</p>
              </div>
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">Active</span>
                <p className="text-2xl font-black">{orders.filter(o => ['PENDING', 'CONFIRMED', 'IN_TRANSIT'].includes(o.status)).length}</p>
              </div>
            </div>
          </div>
          <div className="flex p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <button 
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${
                activeTab === 'ACTIVE' ? 'bg-white text-purple-600 shadow-xl' : 'text-white/70 hover:text-white'
              }`}
            >
              ACTIVE
            </button>
            <button 
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${
                activeTab === 'COMPLETED' ? 'bg-white text-purple-600 shadow-xl' : 'text-white/70 hover:text-white'
              }`}
            >
              COMPLETED
            </button>
          </div>
        </div>

        {/* Order Sub-Features */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
          <QuickAction icon={<CreditCard size={14}/>} label="GST Calculator" />
          <QuickAction icon={<Package size={14}/>} label="Bulk Invoicing" />
          <QuickAction icon={<ExternalLink size={14}/>} label="Export Manifest" />
          <QuickAction icon={<RefreshCw size={14}/>} label="Return Hub" />
          <QuickAction icon={<Shield size={14}/>} label="Credit Review" />
          <QuickAction icon={<Clock size={14}/>} label="SLA Tracker" />
          <QuickAction icon={<AlertCircle size={14}/>} label="Fraud Audit" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-slate-50 rounded-3xl animate-pulse" />
          ))
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-4xl mb-4">📦</div>
             <p className="text-xl font-bold text-slate-900">No {activeTab.toLowerCase()} orders</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div 
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border-2 border-slate-100 shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded uppercase tracking-widest">
                         ORDER #{order.id.slice(0, 8)}
                       </span>
                       <StatusBadge status={order.status} />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">
                        {order.lot?.cropName || order.crop?.cropName} • {order.quantity}kg
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-slate-500 font-bold text-sm">
                          <CreditCard size={16} />
                          ₹{order.totalAmount.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 font-bold text-sm">
                          <Clock size={16} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-4">
                       <div className="p-4 bg-slate-50 rounded-2xl flex-1 min-w-[200px] border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Buyer Information</p>
                          <p className="font-bold text-slate-900">{order.buyer.name}</p>
                          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1">
                             <Phone size={12} /> {order.buyer.phone}
                          </p>
                          {order.buyer.gst && (
                             <p className="text-[10px] font-black text-purple-600 mt-2 bg-purple-50 inline-block px-2 py-0.5 rounded uppercase">
                               GST: {order.buyer.gst}
                             </p>
                          )}
                       </div>
                       
                       <div className="p-4 bg-slate-50 rounded-2xl flex-1 min-w-[200px] border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Payment Status</p>
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                             <p className="font-bold text-slate-900 text-sm">Payment {order.paymentStatus}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                             <div className={`w-2 h-2 rounded-full ${order.escrowStatus === 'RELEASED' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`} />
                             <p className="font-bold text-slate-900 text-sm">Escrow {order.escrowStatus}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="md:w-64 flex flex-col justify-between items-stretch gap-3">
                    {order.status === 'CONFIRMED' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'IN_TRANSIT')}
                        className="flex-1 py-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <Truck size={20} />
                        Dispatch Order
                      </button>
                    )}

                    {order.status === 'DELIVERED' && order.escrowStatus === 'HELD' && (
                       <button 
                        onClick={() => handlePayout(order.id)}
                        className="flex-1 py-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-green-200 hover:shadow-green-300 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={20} />
                        Release Payouts
                      </button>
                    )}

                    {order.status === 'IN_TRANSIT' && (
                       <button 
                        onClick={() => updateStatus(order.id, 'DELIVERED')}
                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2 underline decoration-purple-500 underline-offset-4"
                      >
                        Complete Delivery
                      </button>
                    )}

                    <div className="flex gap-2">
                       <button className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-1">
                          View Invoice
                          <ExternalLink size={14} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    CONFIRMED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    IN_TRANSIT: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    DELIVERED: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  const config = configs[status] || configs.PENDING;

  return (
    <div className={`px-4 py-1.5 rounded-full border-2 ${config.bg} ${config.text} ${config.border} text-xs font-black tracking-widest`}>
      {status}
    </div>
  );
}
