'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Search, Filter, RefreshCw, 
  MapPin, Phone, Mail, Award, MoreVertical,
  CheckCircle, ShieldAlert, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

const MOCK_FARMERS: Farmer[] = [
  { id: '1', name: 'Ramesh Patil', phone: '+91 98765 43210', aadhaar: '123456789012', district: 'Nashik', isActive: true, createdAt: new Date().toISOString(), crops: [1, 2] },
  { id: '2', name: 'Sanjay Deshmukh', phone: '+91 87654 32109', aadhaar: '234567890123', district: 'Pune', isActive: true, createdAt: new Date().toISOString(), crops: [1] },
  { id: '3', name: 'Alka Shinde', phone: '+91 76543 21098', aadhaar: '345678901234', district: 'Ahmednagar', isActive: true, createdAt: new Date().toISOString(), crops: [1, 2, 3] },
  { id: '4', name: 'Dinesh Kare', phone: '+91 65432 10987', aadhaar: '456789012345', district: 'Solapur', isActive: false, createdAt: new Date().toISOString(), crops: [] },
  { id: '5', name: 'Vilas Rao', phone: '+91 54321 09876', aadhaar: '567890123456', district: 'Nagpur', isActive: true, createdAt: new Date().toISOString(), crops: [1, 2] },
];

export default function FarmerManagement() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fpo/farmers');
      if (!res.ok) {
        console.warn('API endpoint not available, using mock data');
        setFarmers(MOCK_FARMERS);
        return;
      }
      const data = await res.json();
      setFarmers(data.length > 0 ? data : MOCK_FARMERS);
    } catch (error) {
      console.error(error);
      setFarmers(MOCK_FARMERS); // Fallback to mocks on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Users size={180} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">Farmer Management 🧑‍🌾</h2>
              <p className="text-white/80 font-medium">Manage {farmers.length} farmers in your organization.</p>
            </div>
            <button 
               onClick={() => router.push('/fpo/dashboard?section=onboarding')}
               className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-2xl font-black shadow-xl hover:bg-slate-50 transition-all hover:-translate-y-0.5 w-fit"
            >
              <UserPlus size={20} />
              Onboard Farmer
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
              <span className="text-xs font-black text-white/70 uppercase">Total Members</span>
              <p className="text-2xl font-black">{farmers.length}</p>
            </div>
            <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
              <span className="text-xs font-black text-white/70 uppercase">Active</span>
              <p className="text-2xl font-black">{farmers.filter(f => f.isActive).length}</p>
            </div>
          </div>

          {/* New Sub-Features Toolbar */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
            <QuickAction icon={<RefreshCw size={14}/>} label="Bulk CSV Import" />
            <QuickAction icon={<MapPin size={14}/>} label="Land Records (7/12)" />
            <QuickAction icon={<Award size={14}/>} label="Tier Assignment" />
            <QuickAction icon={<Mail size={14}/>} label="Broadcast SMS" />
            <QuickAction icon={<TrendingUp size={14}/>} label="Yield Analysis" />
            <QuickAction icon={<ShieldAlert size={14}/>} label="Credit Scoring" />
            <QuickAction icon={<Filter size={14}/>} label="Advanced Audit" />
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
             <input type="text" placeholder="Search by name, phone or Aadhaar..." className="w-full h-12 pl-10 pr-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all" />
           </div>
           <button onClick={fetchFarmers} className="p-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-all">
             <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
               <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Farmer Details</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Aadhaar / ID</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Location</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Crop History</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-right">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                     <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-1/2"></div></td>
                  </tr>
                ))
              ) : farmers.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-bold italic">No farmers onboarded yet.</td>
                </tr>
              ) : (
                farmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-black">
                             {farmer.name[0]}
                          </div>
                          <div>
                             <p className="font-bold text-slate-900">{farmer.name}</p>
                             <p className="text-xs text-slate-500 font-bold">{farmer.phone}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-2">
                          <Award size={14} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-600">XXXX XXXX {farmer.aadhaar.slice(-4)}</span>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-2 text-slate-500">
                          <MapPin size={14} />
                          <span className="text-sm font-bold">{farmer.district}</span>
                       </div>
                    </td>
                    <td className="px-6 py-6 font-black text-slate-900">
                       {farmer.crops?.length || 0} Crops
                    </td>
                    <td className="px-6 py-6 text-right">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${farmer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {farmer.isActive ? 'ACTIVE' : 'INACTIVE'}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label }: { icon: any, label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all">
      {icon}
      <span>{label}</span>
    </button>
  );
}
