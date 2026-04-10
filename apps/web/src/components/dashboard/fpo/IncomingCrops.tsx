'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Search, Filter, RefreshCw, 
  MapPin, Phone, Calendar, Info, AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';

interface IncomingCrop {
  id: string;
  cropName: string;
  variety: string;
  quantity: number;
  grade: string;
  pricePerKg: number;
  createdAt: string;
  farmer?: { name: string; phone: string };
  fpoFarmer?: { name: string; phone: string; district: string };
}

const MOCK_CROPS: IncomingCrop[] = [
  { id: 'c1', cropName: 'Onion', variety: 'Red Nasik', quantity: 1200, grade: 'A', pricePerKg: 18, createdAt: new Date().toISOString(), fpoFarmer: { name: 'Ramesh Patil', phone: '+91 98765 43210', district: 'Nashik' } },
  { id: 'c2', cropName: 'Pomegranate', variety: 'Bhagwa', quantity: 800, grade: 'A', pricePerKg: 45, createdAt: new Date().toISOString(), fpoFarmer: { name: 'Sanjay Deshmukh', phone: '+91 87654 32109', district: 'Pune' } },
  { id: 'c3', cropName: 'Grapes', variety: 'Thompson Seedless', quantity: 1500, grade: 'B', pricePerKg: 30, createdAt: new Date().toISOString(), fpoFarmer: { name: 'Alka Shinde', phone: '+91 76543 21098', district: 'Ahmednagar' } },
];

export default function IncomingCrops() {
  const [crops, setCrops] = useState<IncomingCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fpo/incoming-crops');
      if (!res.ok) {
        console.warn('API endpoint not available, using mock data');
        setCrops(MOCK_CROPS);
        return;
      }
      const data = await res.json();
      setCrops(data.length > 0 ? data : MOCK_CROPS);
    } catch (error) {
      console.warn('Failed to fetch incoming crops, using mock data:', error);
      setCrops(MOCK_CROPS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/fpo/crops/${id}/${action}`, { method: 'POST' });
      if (!res.ok) throw new Error(`Failed to ${action} crop`);
      
      toast.success(`Crop ${action}ed successfully`);
      setCrops(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error(error);
      toast.error(`Error ${action}ing crop`);
    }
  };

  const filteredCrops = crops.filter(c => 
    c.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.fpoFarmer?.name || c.farmer?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <AlertTriangle size={180} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-2">Incoming Crops 🚜</h2>
          <p className="text-white/80 font-medium">Verify and accept crops from farmers for aggregation.</p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
              <span className="text-xs font-black text-white/70 uppercase">Pending</span>
              <p className="text-2xl font-black">{filteredCrops.length}</p>
            </div>
            <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
              <span className="text-xs font-black text-white/70 uppercase">Total Qty</span>
              <p className="text-2xl font-black">{filteredCrops.reduce((s, c) => s + c.quantity, 0).toLocaleString()} kg</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by crop name or farmer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-medium" 
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:text-purple-600 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Farmer Details</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Crop & Variety</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Quality Grade</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8">
                        <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-50 rounded-full w-1/2"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredCrops.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-4xl">🌾</div>
                        <div className="max-w-xs">
                          <p className="text-xl font-bold text-slate-900">No incoming crops</p>
                          <p className="text-slate-500 text-sm mt-1">When farmers send crops to the FPO, they will appear here for verification.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCrops.map((crop) => (
                    <motion.tr 
                      key={crop.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-lg font-bold text-purple-600">
                            {(crop.fpoFarmer?.name || crop.farmer?.name || '?')[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{crop.fpoFarmer?.name || crop.farmer?.name || 'Unknown'}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                                <Phone size={12} /> {crop.fpoFarmer?.phone || crop.farmer?.phone}
                              </span>
                              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                                <MapPin size={12} /> {crop.fpoFarmer?.district || 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="p-2 bg-purple-50 rounded-lg inline-block mb-1">
                          <p className="text-sm font-black text-purple-700">{crop.cropName}</p>
                        </div>
                        <p className="text-xs font-bold text-slate-500">{crop.variety}</p>
                      </td>
                      <td className="px-6 py-6 font-black text-slate-900">
                        {crop.quantity.toLocaleString()} kg
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black">
                          Grade {crop.grade}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleAction(crop.id, 'reject')}
                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Reject Crop"
                          >
                            <X size={20} />
                          </button>
                          <button 
                            onClick={() => handleAction(crop.id, 'accept')}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all hover:-translate-y-0.5"
                          >
                            <Check size={20} />
                            Accept Crop
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
