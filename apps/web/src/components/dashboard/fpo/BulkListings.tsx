'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Tag, Box, ArrowUpRight, 
  Trash2, Edit3, ShieldCheck, MapPin,
  RefreshCw, Layers
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

interface Lot {
  id: string;
  cropName: string;
  totalQuantity: number;
  pricePerKg: number;
  status: string;
  createdAt: string;
  qualityCertUrl?: string;
  crops: any[];
}

const MOCK_LOTS: Lot[] = [
  { id: 'lot_1', cropName: 'Onion (Red Nasik Bulk)', totalQuantity: 3500, pricePerKg: 19.5, status: 'LISTED', createdAt: new Date().toISOString(), qualityCertUrl: 'verified', crops: [1, 2, 3] },
  { id: 'lot_2', cropName: 'Premium Pomegranate', totalQuantity: 1200, pricePerKg: 48, status: 'LISTED', createdAt: new Date().toISOString(), qualityCertUrl: 'verified', crops: [4] },
  { id: 'lot_3', cropName: 'Thompson Grapes Bulk', totalQuantity: 2500, pricePerKg: 35, status: 'DRAFT', createdAt: new Date().toISOString(), crops: [5, 6] },
];

export default function BulkListings() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLots = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fpo/lots');
      if (!res.ok) {
        console.warn('API endpoint not available, using mock data');
        setLots(MOCK_LOTS);
        return;
      }
      const data = await res.json();
      setLots(data.length > 0 ? data : MOCK_LOTS);
    } catch (error) {
      console.error(error);
      setLots(MOCK_LOTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Store size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">Marketplace Listings 🏪</h2>
            <p className="text-white/80 font-medium">Manage your active bulk offerings on the platform.</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">Active Listings</span>
                <p className="text-2xl font-black">{lots.length}</p>
              </div>
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">Total Qty</span>
                <p className="text-2xl font-black">{lots.reduce((s, l) => s + l.totalQuantity, 0).toLocaleString()} kg</p>
              </div>
            </div>

            {/* Marketplace Sub-Features */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
              <QuickAction icon={<ArrowUpRight size={14}/>} label="Promote Lot" />
              <QuickAction icon={<Tag size={14}/>} label="Set Bulk Discount" />
              <QuickAction icon={<Store size={14}/>} label="Sync to AGMARK" />
              <QuickAction icon={<ShieldCheck size={14}/>} label="Enable Bidding" />
              <QuickAction icon={<Edit3 size={14}/>} label="Price Simulator" />
              <QuickAction icon={<Layers size={14}/>} label="Active Inquiries" />
              <QuickAction icon={<ArrowUpRight size={14}/>} label="Auto-Relist" />
            </div>
          </div>
          <button 
             onClick={fetchLots}
             className="p-4 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl hover:bg-white/30 transition-all text-white shadow-xl"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-slate-50 rounded-3xl animate-pulse" />
          ))
        ) : lots.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-20 text-center border-2 border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-4xl mb-4">🏪</div>
             <p className="text-xl font-bold text-slate-900">No active listings</p>
             <p className="text-slate-500 mt-1">Aggregate some crops to create bulk listings.</p>
          </div>
        ) : (
          lots.map((lot) => (
            <motion.div
              key={lot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border-2 border-slate-100 shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                     <Layers size={24} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                    lot.status === 'LISTED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {lot.status}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-1">{lot.cropName}</h3>
                <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                   <Tag size={12} /> Bulk Batch • ID #{lot.id.slice(0, 6)}
                </p>

                <div className="grid grid-cols-2 gap-4 my-6">
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Quantity</p>
                      <p className="text-lg font-black text-slate-900">{lot.totalQuantity.toLocaleString()}kg</p>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Price/kg</p>
                      <p className="text-lg font-black text-slate-900">₹{lot.pricePerKg}</p>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {lot.qualityCertUrl ? (
                      <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded">
                         <ShieldCheck size={12} /> VERIFIED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-black text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                         PENDING CERT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                       <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                       <Edit3 size={18} />
                    </button>
                    <button className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all ml-1">
                       <ArrowUpRight size={20} />
                    </button>
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
