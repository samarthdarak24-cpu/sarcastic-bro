import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Search, MapPin, Users, Percent, CheckCircle, Clock, Link as LinkIcon, Info, ArrowRight } from 'lucide-react';

export default function FPOLinking() {
  const [fpos, setFpos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchFPOs();
  }, []);

  const fetchFPOs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/fpo');
      const data = await res.json();
      setFpos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load FPOs", err);
      setFpos([]);
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
        body: JSON.stringify({ fpoId })
      });
      const data = await res.json();
      if (data.success) {
        setRequestStatus(fpoId);
        setTimeout(() => setRequestStatus(null), 5000);
      }
    } catch (err) {
      alert("Registration failed. Please check backend connection.");
    } finally {
      setApplyingId(null);
    }
  };

  const filteredFPOs = Array.isArray(fpos) 
    ? fpos.filter(f => 
        (f.name?.toLowerCase().includes(search.toLowerCase()) || 
         f.district?.toLowerCase().includes(search.toLowerCase()))
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search FPOs by name or district..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm font-medium w-80" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-green-700 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-lg">
                       <Percent className="text-white" size={20} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Aggregation Benefit</span>
                 </div>
                 <h4 className="text-2xl font-black mb-2">Beat Market Prices</h4>
                 <p className="text-green-50 text-sm leading-relaxed mb-6">
                   Farmers linked with FPOs earn on average 15-20% more by selling in bulk lots to Tier-1 Buyers.
                 </p>
                 <ul className="space-y-3 text-xs font-bold text-green-100">
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-300" /> Professional Quality Grading</li>
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-300" /> Lower Logistics Costs</li>
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-300" /> Guaranteed Escrow Payouts</li>
                 </ul>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl"></div>
           </div>

           <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-sm font-black text-slate-500 uppercase mb-4 tracking-widest">Membership Guideline</h3>
              <div className="space-y-4">
                 <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-black text-green-700 flex-shrink-0">1</div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">Ensure your KYC is verified before applying to an FPO.</p>
                 </div>
                 <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-black text-green-700 flex-shrink-0">2</div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">The FPO admin will review your farm size and crop history.</p>
                 </div>
                 <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-black text-green-700 flex-shrink-0">3</div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">Once approved, you can aggregate your produce with other members.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* FPO List */}
        <div className="lg:col-span-8 space-y-4">
           {loading ? (
             <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-lg">
                <div className="text-center">
                  <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-500">Loading FPOs...</p>
                </div>
             </div>
           ) : filteredFPOs.length === 0 ? (
             <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 size={40} className="text-slate-300" />
                </div>
                <p className="text-lg font-bold text-slate-600 mb-1">No FPOs found in your region</p>
                <p className="text-sm text-slate-400">Try adjusting your search filters</p>
             </div>
           ) : (
             filteredFPOs.map((fpo, index) => (
               <motion.div 
                 key={fpo.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.05 }}
                 whileHover={{ y: -4 }}
                 className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:border-green-200 hover:shadow-xl flex items-center justify-between group transition-all"
               >
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-400 group-hover:from-green-50 group-hover:to-green-100 group-hover:text-green-600 transition-all border border-slate-100 group-hover:border-green-200 shadow-sm">
                       <Building2 size={32} />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-green-600 transition-colors">{fpo.name}</h3>
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-200 uppercase">
                             ID: #{fpo.id.slice(0, 6)}
                          </span>
                       </div>
                       <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {fpo.district}, {fpo.state}</span>
                          <span className="flex items-center gap-1 text-amber-600 font-bold"><Percent size={14} className="text-amber-500" /> {fpo.commissionRate}% Commission</span>
                       </div>
                    </div>
                 </div>

                 <div>
                    {requestStatus === fpo.id ? (
                      <div className="flex flex-col items-center">
                         <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-1 shadow-sm">
                            <CheckCircle size={24} />
                         </div>
                         <span className="text-[10px] font-black text-green-600 uppercase">Requested!</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleApply(fpo.id)}
                        disabled={applyingId === fpo.id}
                        className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-3 rounded-2xl font-black text-sm hover:shadow-xl transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-50"
                      >
                         {applyingId === fpo.id ? (
                           <>
                             <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                             <span>Requesting...</span>
                           </>
                         ) : (
                           <><LinkIcon size={18} /> Request to Join</>
                         )}
                      </button>
                    )}
                 </div>
               </motion.div>
             ))
           )}
        </div>
      </div>
    </div>
  );
}
