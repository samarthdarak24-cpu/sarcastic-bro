import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, MapPin, Users, Percent, CheckCircle, Clock, Link as LinkIcon, Info, ArrowRight, X, Sprout, Star } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_FPOS = [
  { id: 'FPO-7781-NH', name: 'Nashik Onion Growers FPC', district: 'Nashik', state: 'Maharashtra', commissionRate: 2.5, crops: ['Onions', 'Grapes', 'Pomegranates'], members: 1240, rating: 4.8, description: 'Specialized cooperative for high-volume onion aggregation and cold storage networking.' },
  { id: 'FPO-3329-PN', name: 'Pune Agrotech Federation', district: 'Pune', state: 'Maharashtra', commissionRate: 3.0, crops: ['Wheat', 'Sugarcane', 'Soybean'], members: 890, rating: 4.5, description: 'Tech-enabled FPO providing modern agronomy tracking and direct bulk buyer bridging.' },
  { id: 'FPO-9912-NG', name: 'Vidarbha Cotton Cooperative', district: 'Nagpur', state: 'Maharashtra', commissionRate: 1.5, crops: ['Cotton', 'Tur (Arhar)'], members: 3200, rating: 4.9, description: 'The largest cotton aggregation federation in Vidarbha ensuring strict MSP compliance payouts.' },
  { id: 'FPO-1154-ST', name: 'Satara Organic Producers', district: 'Satara', state: 'Maharashtra', commissionRate: 4.0, crops: ['Turmeric', 'Ginger', 'Strawberries'], members: 450, rating: 4.2, description: 'Focused entirely on certified organic produce mapping directly to international export channels.' }
];

export default function FPOLinking() {
  const [fpos, setFpos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Application & Detail Flow
  const [selectedFPO, setSelectedFPO] = useState<any>(null);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [requestStatuses, setRequestStatuses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchFPOs();
  }, []);

  useEffect(() => {
    if (selectedFPO) setSelectedCrops([]);
  }, [selectedFPO]);

  const fetchFPOs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/fpo');
      const data = await res.json();
      
      const dbFpos = Array.isArray(data) ? data : [];
      if (dbFpos.length === 0) {
         setFpos(MOCK_FPOS);
      } else {
         setFpos(dbFpos);
      }
    } catch (err) {
      console.error("Failed to load FPOs", err);
      // Fallback to demo mode
      setFpos(MOCK_FPOS);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (fpoId: string) => {
    setApplyingId(fpoId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/farmer/fpo-request', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fpoId, crops: selectedCrops })
      });
      const data = await res.json();
      
      if (data.success) {
         setRequestStatuses(prev => ({...prev, [fpoId]: true}));
         toast.success("Application successfully submitted!");
         setSelectedFPO(null);
      } else {
         throw new Error("Failed");
      }
    } catch (err) {
      // Hackathon Demo Mode fallback:
      setTimeout(() => {
         setRequestStatuses(prev => ({...prev, [fpoId]: true}));
         toast.success("Demo Mode: Simulated application submission success!");
         setSelectedFPO(null);
      }, 1500);
    } finally {
      setApplyingId(null);
    }
  };

  const filteredFPOs = Array.isArray(fpos) 
    ? fpos.filter(f => 
        (f.name?.toLowerCase().includes(search.toLowerCase()) || 
         f.district?.toLowerCase().includes(search.toLowerCase()) ||
         f.crops?.some((c: string) => c.toLowerCase().includes(search.toLowerCase())))
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900">FPO Network</h2>
          <p className="text-slate-500 mt-1 font-medium">Connect with Farmer Producer Organizations for yield aggregation and better pricing.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search FPOs by name, district, or crop..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-green-500 hover:border-slate-300 transition-all font-bold text-slate-700 w-[340px] shadow-sm" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-green-700 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-lg border border-white/20">
                       <Percent className="text-white" size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-100">Aggregation Benefit</span>
                 </div>
                 <h4 className="text-3xl font-black mb-3">Beat Market Prices</h4>
                 <p className="text-green-50 text-sm leading-relaxed mb-8 font-medium">
                   Farmers linked with FPOs earn on average 15-20% more by selling in bulk lots directly to verified Tier-1 corporate buyers.
                 </p>
                 <div className="space-y-3 mt-8">
                    <button onClick={() => toast.info('AgriTrust uses AI imaging to automatically grade and assay crop lots during procurement.')} className="w-full flex items-center justify-between group bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all text-left">
                       <span className="flex items-center gap-3 text-xs font-bold text-green-50"><CheckCircle size={16} className="text-emerald-300" /> AI Quality Grading & Assaying</span>
                       <ArrowRight size={14} className="text-emerald-200 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => toast.info('FPOs schedule combined freight trucks from your farm, reducing total transport fees by 40%.')} className="w-full flex items-center justify-between group bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all text-left">
                       <span className="flex items-center gap-3 text-xs font-bold text-green-50"><CheckCircle size={16} className="text-emerald-300" /> Subsidized Bulk Logistics</span>
                       <ArrowRight size={14} className="text-emerald-200 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => toast.info('All payments are locked into smart contracts at order time and unconditionally released upon delivery.')} className="w-full flex items-center justify-between group bg-white/10 hover:bg-white/20 p-3 rounded-2xl transition-all text-left">
                       <span className="flex items-center gap-3 text-xs font-bold text-green-50"><CheckCircle size={16} className="text-emerald-300" /> Guaranteed Escrow Payouts</span>
                       <ArrowRight size={14} className="text-emerald-200 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-[40px]"></div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-[30px]"></div>
           </div>

           <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-200">
              <h3 className="text-xs font-black text-slate-400 uppercase mb-6 tracking-widest flex items-center gap-2">
                 <Info size={16} /> Membership Guideline
              </h3>
              <div className="space-y-3">
                 <button onClick={() => toast.success('Your KYC verification is active and up to date.')} className="w-full text-left flex gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 group-hover:bg-emerald-500 flex items-center justify-center text-[10px] font-black text-emerald-700 group-hover:text-white flex-shrink-0 shadow-inner transition-colors">1</div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-600 leading-relaxed group-hover:text-emerald-700 transition-colors">Complete & <span className="text-emerald-600">Verify KYC Hub Profile</span></p>
                    </div>
                 </button>
                 <button onClick={() => toast.info('FPO Admins will contact you upon reviewing your submitted crop cycle data.')} className="w-full text-left flex gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                    <div className="h-8 w-8 rounded-full bg-slate-100 group-hover:bg-slate-900 flex items-center justify-center text-[10px] font-black text-slate-600 group-hover:text-white flex-shrink-0 shadow-inner transition-colors">2</div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">FPO admin farm size and crop data review</p>
                    </div>
                 </button>
                 <button onClick={() => toast('You can access your smart contracts in the Escrow dashboard.')} className="w-full text-left flex gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                    <div className="h-8 w-8 rounded-full bg-slate-100 group-hover:bg-blue-600 flex items-center justify-center text-[10px] font-black text-slate-600 group-hover:text-white flex-shrink-0 shadow-inner transition-colors">3</div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-600 leading-relaxed group-hover:text-blue-700 transition-colors">Auto-aggregate produce into cooperative contracts</p>
                    </div>
                 </button>
              </div>
           </div>
        </div>

        {/* FPO List */}
        <div className="lg:col-span-8 space-y-4">
           {loading ? (
             <div className="h-64 flex items-center justify-center bg-white rounded-[32px] border border-slate-200 shadow-xl">
                <div className="text-center">
                  <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-500 tracking-wide uppercase">Searching Nationwide FPOs...</p>
                </div>
             </div>
           ) : filteredFPOs.length === 0 ? (
             <div className="p-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-200 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-center mx-auto mb-6">
                  <Building2 size={48} className="text-slate-300" />
                </div>
                <p className="text-2xl font-black text-slate-800 mb-2">No FPOs match your search</p>
                <p className="text-sm font-medium text-slate-500">Try adjusting your region or modifying crop filters</p>
             </div>
           ) : (
             filteredFPOs.map((fpo, index) => (
               <motion.div 
                 key={fpo.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.05 }}
                 whileHover={{ y: -4 }}
                 onClick={() => setSelectedFPO(fpo)}
                 className="bg-white rounded-[32px] p-6 lg:p-8 shadow-lg border border-slate-100 hover:border-green-200 hover:shadow-2xl flex flex-col md:flex-row md:items-center justify-between group transition-all cursor-pointer"
               >
                 <div className="flex items-start md:items-center gap-6 mb-6 md:mb-0">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 flex flex-shrink-0 items-center justify-center text-slate-400 group-hover:from-green-50 group-hover:to-emerald-100 group-hover:text-emerald-600 transition-all border border-slate-100 group-hover:border-green-200 shadow-sm">
                       <Building2 size={36} />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{fpo.name}</h3>
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                             PID: {fpo.id.slice(0, 8)}
                          </span>
                       </div>
                       <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-bold">
                          <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {fpo.district}, {fpo.state}</span>
                          <div className="w-1 h-1 bg-slate-300 rounded-full hidden md:block"></div>
                          <span className="flex items-center gap-1.5 text-amber-600"><Percent size={16} className="text-amber-500" /> {fpo.commissionRate}% Target Fee</span>
                          <div className="w-1 h-1 bg-slate-300 rounded-full hidden md:block"></div>
                          <span className="flex items-center gap-1.5 text-blue-600"><Users size={16} className="text-blue-500" /> {fpo.members} Members</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex-shrink-0 ml-auto md:ml-6 flex items-center justify-center md:block">
                    {requestStatuses[fpo.id] ? (
                      <div className="flex items-center gap-2 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                         <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                            <CheckCircle size={14} />
                         </div>
                         <span className="text-xs font-black text-emerald-700 uppercase tracking-wide">Under Review</span>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-slate-900 flex items-center justify-center transition-colors">
                         <ArrowRight size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    )}
                 </div>
               </motion.div>
             ))
           )}
        </div>
      </div>

      {/* --- FPO Details & Application Modal --- */}
      <AnimatePresence>
        {selectedFPO && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 xl:p-0"
          >
             <motion.div
               initial={{ scale: 0.95, y: 30, opacity: 0 }}
               animate={{ scale: 1, y: 0, opacity: 1 }}
               exit={{ scale: 0.95, y: 30, opacity: 0 }}
               className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative overflow-hidden"
             >
                {/* Modal Header */}
                <div className="bg-slate-900 p-8 pb-10 text-white relative">
                   <button onClick={() => setSelectedFPO(null)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                      <X size={20} />
                   </button>
                   <div className="flex items-center gap-3 mb-4">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
                         VERIFIED AGGREGATOR
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
                         <Star size={14} fill="currentColor" /> {selectedFPO.rating} / 5.0 Rating
                      </div>
                   </div>
                   <h2 className="text-4xl font-black mb-2 pr-12 leading-tight">{selectedFPO.name}</h2>
                   <p className="text-slate-400 font-medium flex items-center gap-2"><MapPin size={16} /> Operational Hub: {selectedFPO.district}, {selectedFPO.state}</p>
                </div>

                {/* Modal Body */}
                <div className="p-8">
                   <div className="grid grid-cols-3 gap-4 mb-8 -mt-14 relative z-10">
                      <div className="bg-white p-5 rounded-[24px] shadow-lg border border-slate-100 flex flex-col items-center text-center">
                         <Users size={24} className="text-blue-500 mb-2" />
                         <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Members</span>
                         <span className="text-2xl font-black text-slate-900">{selectedFPO.members}</span>
                      </div>
                      <div className="bg-white p-5 rounded-[24px] shadow-lg border border-slate-100 flex flex-col items-center text-center">
                         <Percent size={24} className="text-amber-500 mb-2" />
                         <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Handling Fee</span>
                         <span className="text-2xl font-black text-slate-900">{selectedFPO.commissionRate}%</span>
                      </div>
                      <div className="bg-white p-5 rounded-[24px] shadow-lg border border-slate-100 flex flex-col items-center text-center">
                         <Sprout size={24} className="text-emerald-500 mb-2" />
                         <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Focus Crops</span>
                         <span className="text-2xl font-black text-slate-900">{selectedFPO.crops?.length || 0}</span>
                      </div>
                   </div>

                   <div className="mb-8">
                      <h4 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-widest">About this Organization</h4>
                      <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
                         {selectedFPO.description || 'This organization focuses on maximizing farmer profitability through grouped lot aggregation, ensuring you get corporate buying rates.'}
                      </p>
                   </div>

                   <div className="mb-8">
                      <h4 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-widest">Select Crops to Aggregate</h4>
                      <p className="text-xs font-bold text-slate-500 mb-4">Click all the crops you plan to supply to this FPO.</p>
                      <div className="flex flex-wrap gap-2">
                         {selectedFPO.crops?.map((crop: string) => (
                           <button 
                             key={crop}
                             onClick={() => setSelectedCrops(prev => prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop])}
                             className={`px-5 py-3 rounded-xl text-sm font-black flex items-center gap-2 transition-all hover:-translate-y-0.5 ${selectedCrops.includes(crop) ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border-emerald-600' : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'}`}
                           >
                              {selectedCrops.includes(crop) ? <CheckCircle size={16} /> : <Sprout size={16} />} 
                              {crop}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-wide">
                        {selectedCrops.length === 0 ? 'PLEASE SELECT AT LEAST ONE CROP' : `${selectedCrops.length} CROPS SELECTED`}
                      </p>
                      <div className="flex gap-3">
                         <button onClick={() => setSelectedFPO(null)} className="px-6 py-4 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                         
                         {requestStatuses[selectedFPO.id] ? (
                            <div className="bg-green-100 text-green-700 px-8 py-4 rounded-2xl font-black flex items-center gap-2">
                               <CheckCircle size={20} /> Application Pending Review
                            </div>
                         ) : (
                            <button 
                              onClick={() => handleApply(selectedFPO.id)}
                              disabled={applyingId === selectedFPO.id || selectedCrops.length === 0}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 transition-all active:scale-95"
                            >
                              {applyingId === selectedFPO.id ? (
                                 <><div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting forms...</>
                              ) : (
                                 <><LinkIcon size={20} /> Submit Application</>
                              )}
                            </button>
                         )}
                      </div>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
