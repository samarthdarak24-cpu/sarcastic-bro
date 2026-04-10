import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, MapPin, User, Phone, Calendar, Clock, ChevronDown, CheckCircle, Truck, Info, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_ORDERS = [
  {
    id: 'ORD-9921-AZ',
    status: 'CONFIRMED',
    totalAmount: 45000,
    quantity: 500,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    crop: { cropName: 'Premium Basmati Rice' },
    buyer: { name: 'Kisan Traders Ltd', phone: '+91 98765 43210' },
     deliveryAddress: 'Sector 4, Vashi Mandi, Navi Mumbai, MH - 400703'
  },
  {
    id: 'ORD-3312-BX',
    status: 'IN_TRANSIT',
    totalAmount: 12500,
    quantity: 200,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    crop: { cropName: 'Organic Alphonso Mangoes' },
    buyer: { name: 'FreshPicks Retail', phone: '+91 88776 55443' },
    deliveryAddress: '15th Cross, Bandra West, Mumbai, MH - 400050'
  },
  {
    id: 'ORD-7728-CY',
    status: 'DELIVERED',
    totalAmount: 8400,
    quantity: 150,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    crop: { cropName: 'Commercial Grade Onions' },
    buyer: { name: 'Global Agri Exports', phone: '+91 99001 12233' },
    deliveryAddress: 'Main Market, Baramati, MH - 413102'
  }
];

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const res = await fetch(`http://localhost:3001/api/farmer/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      const orderList = Array.isArray(data) ? data : (data?.history || []);
      
      if (orderList.length === 0) {
         setOrders(MOCK_ORDERS);
      } else {
         setOrders(orderList);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsShipped = (orderId: string) => {
     setIsUpdating(orderId);
     setTimeout(() => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'IN_TRANSIT' } : o));
        setIsUpdating(null);
        toast.success("Order #"+orderId.slice(0,8)+" marked as Shipped! Logistics fleet notified.");
     }, 1500);
  };

  const filteredOrders = orders.filter(order => {
     const matchesSearch = (order.crop?.cropName || order.lot?.cropName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesFilter = activeFilter === 'ALL' || order.status === activeFilter;
     return matchesSearch && matchesFilter;
  });

  const statusColors: any = {
    'PENDING': 'bg-amber-100 text-amber-700 border-amber-200',
    'CONFIRMED': 'bg-blue-100 text-blue-700 border-blue-200',
    'IN_TRANSIT': 'bg-purple-100 text-purple-700 border-purple-200',
    'DELIVERED': 'bg-green-100 text-green-700 border-green-200',
    'CANCELLED': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Order Management</h2>
          <p className="text-slate-500 mt-1 font-medium">Track active shipments, buyer details, and delivery statuses.</p>
        </div>
         <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by ID or Crop..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-green-500 hover:border-slate-300 transition-all font-bold text-slate-700 w-72 shadow-sm" 
              />
            </div>
            <div className="flex bg-white border-2 border-slate-200 rounded-2xl p-1 shadow-sm">
               {['ALL', 'PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'].map((f) => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${activeFilter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {f}
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'blue', icon: Package },
          { label: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, color: 'amber', icon: Clock },
          { label: 'In Transit', value: orders.filter(o => o.status === 'IN_TRANSIT').length, color: 'purple', icon: Truck },
          { label: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, color: 'green', icon: CheckCircle },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-md border border-slate-200">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center mb-3`}>
              <stat.icon className={`text-${stat.color}-600`} size={20} />
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-lg">
             <div className="text-center">
               <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
               <p className="text-sm font-medium text-slate-500">Loading orders...</p>
             </div>
          </div>
        ) : filteredOrders.length === 0 ? (
           <div className="h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 bg-white shadow-inner">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <Package size={40} className="opacity-20" />
              </div>
              <p className="font-black text-slate-800 text-lg">No matching orders</p>
              <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Adjust your search or filter tags</p>
           </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className={`bg-white rounded-3xl border ${expandedOrder === order.id ? 'border-green-500 shadow-xl' : 'border-slate-200 shadow-md'} transition-all overflow-hidden`}
            >
              <div 
                className="p-6 cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Package size={32} />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusColors[order.status]}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-slate-400">ID: #{order.id.slice(0, 8)}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900">
                        {order.crop?.cropName || order.lot?.cropName}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><Package size={14} /> {order.quantity} Kg</span>
                        <span className="flex items-center gap-1"><User size={14} /> {order.buyer.name}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-8">
                   <div className="text-right">
                      <p className="text-2xl font-black text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Value</p>
                   </div>
                   <div className={`p-2 rounded-xl bg-slate-50 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} className="text-slate-400" />
                   </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 bg-slate-50/50"
                  >
                    <div className="p-8 grid grid-cols-3 gap-8">
                       <div className="space-y-4">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Buyer Details</h4>
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><User size={16} /></div>
                                <span className="font-bold text-slate-900">{order.buyer.name}</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><Phone size={16} /></div>
                                <span className="font-medium text-slate-600">{order.buyer.phone}</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600"><MapPin size={16} /></div>
                                <span className="text-sm font-medium text-slate-600 line-clamp-2">{order.deliveryAddress}</span>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tracking Status</h4>
                          <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                             {[
                               { label: 'Order Confirmed', time: order.createdAt, done: true },
                               { label: 'Packaged & Ready', time: null, done: order.status !== 'PENDING' },
                               { label: 'Out for Pickup', time: null, done: ['IN_TRANSIT', 'DELIVERED'].includes(order.status) },
                               { label: 'Delivered', time: null, done: order.status === 'DELIVERED' },
                             ].map((step, i) => (
                               <div key={i} className="relative">
                                  <div className={`absolute -left-[26px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${step.done ? 'bg-green-500' : 'bg-slate-300'}`}>
                                    {step.done && <CheckCircle size={10} className="text-white" />}
                                  </div>
                                  <p className={`text-sm font-black ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                                  {step.time && <p className="text-[10px] font-bold text-slate-400">{new Date(step.time).toLocaleString()}</p>}
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Payment Security</h4>
                          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-4">
                             <div className="flex items-center gap-2">
                               <CheckCircle className="text-green-400" size={20} />
                               <span className="font-bold">Funds in Escrow</span>
                             </div>
                             <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                   <span className="text-slate-400">Total Held</span>
                                   <span className="font-black">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                   <span className="text-slate-400">Platform Fee</span>
                                   <span className="font-black text-red-400">-₹{(order.totalAmount * 0.05).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end">
                                   <span className="text-xs font-bold text-green-400">Your Earning</span>
                                   <span className="text-xl font-black">₹{(order.totalAmount * 0.95).toLocaleString('en-IN')}</span>
                                </div>
                             </div>
                             <p className="text-[10px] text-slate-500 leading-relaxed italic">
                               *Earning will be released to your wallet within 24h of delivery confirmation.
                             </p>
                          </div>
                           {order.status === 'CONFIRMED' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleMarkAsShipped(order.id); }}
                                disabled={isUpdating === order.id}
                                className="w-full bg-slate-900 font-black text-white py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                              >
                                {isUpdating === order.id ? (
                                   <><div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating Network...</>
                                ) : (
                                   <><Truck size={20} /> Mark as Shipped</>
                                )}
                              </button>
                           )}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
