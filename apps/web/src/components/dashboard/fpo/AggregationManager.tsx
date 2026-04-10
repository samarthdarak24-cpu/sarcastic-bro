'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Warehouse, Plus, Search, Filter, RefreshCw, 
  ChevronRight, CheckCircle2, AlertCircle, Trash2,
  TrendingUp, Scale, Inbox, Zap, Droplets, XCircle, ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';

function QuickAction({ icon, label }: { icon: any, label: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleExecute = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setIsOpen(false);
      const t = typeof toast.success === 'function' ? toast.success : toast;
      t(label + ' completed successfully.');
    }, 1500);
  };

  const renderCustomContent = () => {
    switch (label) {
      case 'AI Optimize':
        return (
           <div className="space-y-3 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center">
              <Zap className="mx-auto text-indigo-500 mb-3" size={36} />
              <p className="text-base font-black text-slate-800">Predictive Aggregation Engine</p>
              <p className="text-xs font-semibold text-slate-500 mt-2 leading-relaxed">AI evaluates incoming batches to suggest the most profitable lot combinations based on historical spot prices.</p>
              <div className="mt-5 p-3 bg-indigo-100 rounded-xl text-indigo-700 text-xs font-black tracking-widest flex items-center justify-center gap-2">
                 <RefreshCw size={16} className="animate-spin" /> SCANNING BATCHES...
              </div>
           </div>
        );
      case 'Moisture Analyser':
        return (
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Droplets size={12}/> Average Moisture Content (%)</label>
            <input type="number" placeholder="e.g. 12.5" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 font-bold text-slate-700 transition-all text-lg" />
            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4 flex overflow-hidden">
               <div className="bg-blue-400 h-full w-[25%] transition-all"></div>
               <div className="bg-emerald-500 h-full w-[45%] transition-all"></div>
               <div className="bg-red-500 h-full w-[30%] transition-all"></div>
            </div>
            <div className="flex justify-between text-[10px] uppercase font-black text-slate-400 mt-1">
               <span>Dry</span><span className="text-emerald-600">Optimal</span><span>Wet</span>
            </div>
          </div>
        );
      case 'Set Storage Bin':
        return (
           <div className="space-y-3">
             <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Warehouse size={12}/> Assign to Warehouse</label>
             <select className="w-full border-2 border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-indigo-500 font-bold text-slate-700 cursor-pointer transition-all appearance-none bg-slate-50">
               <option>🧊 WH-A (Cold Storage) - 40% Full</option>
               <option>📦 WH-B (Ambient) - 85% Full</option>
               <option>🏭 WH-C (Bulk Silo) - 12% Full</option>
             </select>
           </div>
        );
      case 'Split Batch':
        return (
           <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Plus size={12}/> Split Ratio (Percentage)</label>
              <div className="flex items-center gap-4">
                 <input type="number" defaultValue="50" className="w-full border-2 border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-indigo-500 font-black text-slate-700 text-center text-xl bg-slate-50" />
                 <span className="font-black text-slate-300 text-2xl">:</span>
                 <input type="number" defaultValue="50" className="w-full border-2 border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-indigo-500 font-black text-slate-700 text-center text-xl bg-slate-50" />
              </div>
              <p className="text-[11px] text-slate-500 font-bold text-center mt-2 border border-slate-100 p-2 rounded-lg bg-slate-50">Batch will be split into two separate entities.</p>
           </div>
        );
      case 'Generate QC':
        return (
          <div className="space-y-3 text-center">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <CheckCircle2 size={36} className="text-green-500" />
             </div>
             <p className="text-lg font-black text-slate-800">Digital Quality Certificate</p>
             <p className="text-xs text-slate-500 font-semibold leading-relaxed">Creates a unified grading certificate combining metric data from all aggregated sub-batches.</p>
             <div className="p-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black tracking-widest uppercase border border-slate-200 mt-6 flex items-center justify-center gap-2">
               <ShieldAlert size={14} className="text-slate-400" /> Web3 Hash Generated on execution.
             </div>
          </div>
        );
      case 'Lot History':
        return (
          <div className="space-y-4">
             <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pb-2 mt-4">
                <div className="relative pl-6">
                   <div className="absolute w-3.5 h-3.5 bg-indigo-500 border-2 border-white shadow-sm rounded-full -left-[9px] top-1"></div>
                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Today, 09:41 AM</p>
                   <p className="text-sm font-bold text-slate-700 mt-0.5">Batches autonomously aggregated into Lot-9021</p>
                </div>
                <div className="relative pl-6">
                   <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1"></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yesterday</p>
                   <p className="text-sm font-bold text-slate-600 mt-0.5">Individual batches logged & weighed at hub.</p>
                </div>
             </div>
          </div>
        );
      case 'Market Match':
        return (
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4"><Search size={12}/> Live Buyer Demands</label>
             <div className="p-4 bg-white rounded-xl border-2 border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-50 transition-all group shadow-sm">
                <div><p className="text-sm font-black text-slate-700 group-hover:text-emerald-700 transition-colors">Reliance Fresh</p><p className="text-xs font-bold text-slate-500">Needs 5,000kg • Nashik</p></div>
                <div className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">92% Match</div>
             </div>
             <div className="p-4 bg-white rounded-xl border-2 border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-50 transition-all group shadow-sm">
                <div><p className="text-sm font-black text-slate-700 group-hover:text-emerald-700 transition-colors">ITC Agri Sector</p><p className="text-xs font-bold text-slate-500">Needs 12,000kg • Pune</p></div>
                <div className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">88% Match</div>
             </div>
          </div>
        );
      default:
        return (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
            <p className="text-sm font-semibold text-slate-600">System is ready to process <strong>{label}</strong>.</p>
          </div>
        );
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
      >
        {icon}
        <span>{label}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-slate-100 flex flex-col relative text-left" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-all">
               <XCircle size={20} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shadow-sm">
                {icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{label}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Feature Operation Module</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
               {renderCustomContent()}
            </div>

            <button 
              onClick={handleExecute}
              disabled={processing}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-xl hover:-translate-y-0.5"
            >
              {processing ? (
                 <>
                   <RefreshCw size={18} className="animate-spin" /> Processing {label}...
                 </>
              ) : (
                 <>Confirm & Execute</>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface Crop {
  id: string;
  cropName: string;
  variety: string;
  quantity: number;
  grade: string;
  pricePerKg: number;
  fpoFarmer?: { name: string; phone: string };
  farmer?: { name: string; phone: string };
}

const MOCK_CROPS: Crop[] = [
  { id: 'c1', cropName: 'Onion', variety: 'Red Nasik', quantity: 1200, grade: 'A', pricePerKg: 18, fpoFarmer: { name: 'Ramesh Patil', phone: '+91 98765 43210' } },
  { id: 'c2', cropName: 'Onion', variety: 'Red Nasik', quantity: 800, grade: 'A', pricePerKg: 17.5, fpoFarmer: { name: 'Sanjay Deshmukh', phone: '+91 87654 32109' } },
  { id: 'c3', cropName: 'Onion', variety: 'Red Nasik', quantity: 1500, grade: 'A', pricePerKg: 18.5, fpoFarmer: { name: 'Alka Shinde', phone: '+91 76543 21098' } },
  { id: 'c4', cropName: 'Pomegranate', variety: 'Bhagwa', quantity: 600, grade: 'A', pricePerKg: 45, fpoFarmer: { name: 'Vilas Rao', phone: '+91 54321 09876' } },
];

export default function AggregationManager() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const fetchAcceptedCrops = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fpo/crops');
      if (!res.ok) {
        console.warn('API endpoint not available, using mock data');
        const filtered = MOCK_CROPS.filter((c: any) => c.status === 'ACCEPTED' && !c.isAggregated);
        setCrops(filtered.length > 0 ? filtered : MOCK_CROPS);
        return;
      }
      const data = await res.json();
      const filtered = data.filter((c: any) => c.status === 'ACCEPTED' && !c.isAggregated);
      setCrops(filtered.length > 0 ? filtered : MOCK_CROPS);
    } catch (error) {
      console.error(error);
      setCrops(MOCK_CROPS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedCrops();
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAggregate = async () => {
    if (selectedIds.length < 2) {
      toast.error('Apply selection to at least 2 crops for aggregation');
      return;
    }

    try {
      setProcessing(true);
      const res = await fetch('/api/fpo/aggregate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropIds: selectedIds }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to aggregate crops');
      }

      toast.success('Batch aggregation successful!');
      setSelectedIds([]);
      fetchAcceptedCrops();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const selectedCropsData = crops.filter(c => selectedIds.includes(c.id));
  const totalQuantity = selectedCropsData.reduce((sum, c) => sum + c.quantity, 0);
  const avgPrice = selectedCropsData.length > 0 
    ? selectedCropsData.reduce((sum, c) => sum + (c.pricePerKg * c.quantity), 0) / totalQuantity 
    : 0;

  return (
    <div className="space-y-6">
      {/* Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Warehouse size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">Crop Aggregator 📦</h2>
            <p className="text-white/80 font-medium">Select verified crops to combine into bulk marketplace listings.</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl">
                <span className="text-xs font-black text-white/70 uppercase">Verified Batches</span>
                <p className="text-2xl font-black">{crops.length}</p>
              </div>
            </div>

            {/* Aggregation Sub-Features */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
              <QuickAction icon={<TrendingUp size={14}/>} label="AI Optimize" />
              <QuickAction icon={<Inbox size={14}/>} label="Moisture Analyser" />
              <QuickAction icon={<Warehouse size={14}/>} label="Set Storage Bin" />
              <QuickAction icon={<Plus size={14}/>} label="Split Batch" />
              <QuickAction icon={<CheckCircle2 size={14}/>} label="Generate QC" />
              <QuickAction icon={<Search size={14}/>} label="Lot History" />
              <QuickAction icon={<Filter size={14}/>} label="Market Match" />
            </div>
          </div>
          <button 
            onClick={fetchAcceptedCrops}
            className="p-4 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl hover:bg-white/30 transition-all text-white shadow-xl"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-8">
        {/* Selection Column */}
        <div className="col-span-8 space-y-6">

        <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Filter size={18} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Available Verified Stock</span>
             </div>
             <div className="text-xs font-black text-purple-600 px-3 py-1 bg-purple-50 rounded-full">
                {crops.length} Batches Available
             </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto p-4 space-y-3">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
              ))
            ) : crops.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-4xl">📭</div>
                <p className="text-lg font-bold text-slate-900">No verified crops found</p>
                <p className="text-slate-500 text-sm">Crops must be ACCEPTED in the Incoming section first.</p>
              </div>
            ) : (
              crops.map((crop) => (
                <motion.div
                  key={crop.id}
                  onClick={() => toggleSelection(crop.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedIds.includes(crop.id)
                      ? 'bg-purple-50 border-purple-500 shadow-lg shadow-purple-100'
                      : 'bg-white border-slate-100 hover:border-purple-200 hover:bg-slate-50/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      selectedIds.includes(crop.id) ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {selectedIds.includes(crop.id) ? <CheckCircle2 size={24} /> : <Inbox size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{crop.cropName}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-black text-slate-500 rounded uppercase">Grade {crop.grade}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">
                        Farmer: {crop.fpoFarmer?.name || crop.farmer?.name} • {crop.variety}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900">{crop.quantity.toLocaleString()} kg</p>
                    <p className="text-xs font-bold text-slate-500">Expected: ₹{crop.pricePerKg}/kg</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        </div>

      {/* Summary Column */}
      <div className="col-span-4 sticky top-6">
        <div className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10">
            <Warehouse size={200} />
          </div>
          
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <Scale className="text-yellow-400" />
            Batch Preview
          </h3>

          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-2">Total Selected Weight</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{totalQuantity.toLocaleString()}</span>
                <span className="text-xl font-bold text-indigo-300">kg</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-indigo-200 text-[10px] font-black uppercase mb-1">Items</p>
                <p className="text-2xl font-black">{selectedIds.length}</p>
              </div>
              <div>
                <p className="text-indigo-200 text-[10px] font-black uppercase mb-1">Avg Price/kg</p>
                <p className="text-2xl font-black">₹{avgPrice.toFixed(0)}</p>
              </div>
            </div>

            <div className="pt-8">
              <button
                disabled={selectedIds.length < 2 || processing}
                onClick={handleAggregate}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                  selectedIds.length < 2 || processing
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300 shadow-xl shadow-yellow-400/20 active:scale-95'
                }`}
              >
                {processing ? (
                  <>
                    <RefreshCw size={24} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Create Bulk Lot
                    <ChevronRight size={24} />
                  </>
                )}
              </button>
              {selectedIds.length < 2 && (
                <p className="text-center text-[10px] text-white/50 mt-4 font-bold flex items-center justify-center gap-2">
                  <AlertCircle size={12} />
                  SELECT AT LEAST 2 BATCHES TO AGGREGATE
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Selected List mini view */}
        <AnimatePresence>
          {selectedCropsData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 bg-white rounded-2xl p-4 border-2 border-slate-100 shadow-lg"
            >
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Batch Composition</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {selectedCropsData.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl group">
                    <div className="flex items-baseline gap-2">
                       <span className="text-xs font-black text-slate-800">{c.quantity} kg</span>
                       <span className="text-[10px] font-bold text-slate-500">{c.fpoFarmer?.name || c.farmer?.name}</span>
                    </div>
                    <button onClick={() => toggleSelection(c.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}
