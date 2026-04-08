'use client';

import { useState, useEffect } from 'react';
import { Globe, ArrowRight, DollarSign, Target, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_OPPS = [
  { id: 1, country: 'United Arab Emirates', commodity: 'Basmati Rice', demand: 'High', profitMargin: 22.4, market: 'Dubai' },
  { id: 2, country: 'Germany', commodity: 'Organic Spices', demand: 'Medium', profitMargin: 35.1, market: 'Hamburg' },
  { id: 3, country: 'United Kingdom', commodity: 'Fresh Mangoes', demand: 'Critical', profitMargin: 40.8, market: 'London' },
  { id: 4, country: 'Vietnam', commodity: 'Cashew Nuts', demand: 'High', profitMargin: 18.2, market: 'Ho Chi Minh' },
];

export default function ExportOpportunities() {
  const [opps, setOpps] = useState(INITIAL_OPPS);

  useEffect(() => {
    const aiInterval = setInterval(() => {
      setOpps(current => current.map(opp => {
        const volatility = (Math.random() * 2) - 1; // Fluctuating margins
        return {
          ...opp,
          profitMargin: Number((opp.profitMargin + volatility * 0.5).toFixed(2))
        };
      }));
    }, 3200);
    return () => clearInterval(aiInterval);
  }, []);
  return (
    <div className="bg-slate-900 rounded-[2rem] p-6 text-white h-full flex flex-col shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
         <Globe size={180} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8">
         <div className="w-full">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                     <Globe2 size={24} className="text-white" />
                  </div>
                  <div>
                     <h3 className="font-black text-white uppercase tracking-tighter text-xl">Global Export Hub</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Sourcing Live AI</p>
                  </div>
               </div>
               <button className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
                  View Analysis <ArrowRight size={14} />
               </button>
            </div>

            <div className="space-y-4">
               <AnimatePresence>
                 {opps.map((opp) => (
                   <motion.div 
                     key={opp.id}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     whileHover={{ x: 5 }}
                     className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/10 cursor-pointer"
                   >
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                               <Target size={18} />
                            </div>
                            <div>
                               <p className="font-black text-sm text-white group-hover:text-brand-primary transition-colors">{opp.commodity} → {opp.country}</p>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                     opp.demand === 'Critical' ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                                  }`}>
                                     {opp.demand} Demand
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">{opp.market} Market</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="text-right">
                            <motion.p 
                              key={opp.profitMargin}
                              initial={{ color: "#fff" }}
                              animate={{ color: opp.profitMargin > INITIAL_OPPS.find(o => o.id === opp.id)!.profitMargin ? "#34d399" : "#fb7185" }}
                              transition={{ duration: 1 }}
                              className="font-bold text-sm"
                            >
                               +{opp.profitMargin}%
                            </motion.p>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">AI Proj. Margin</p>
                         </div>
                      </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
            </div>
         </div>
         
         <div className="mt-auto w-full pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex -space-x-2">
               {[1,2,3,4].map(i => (
                 <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 overflow-hidden shadow-xl shadow-slate-900/50">
                    <img alt="User" src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover" />
                 </div>
               ))}
               <div className="h-10 w-10 rounded-full border-2 border-slate-900 bg-white/10 flex items-center justify-center text-[10px] font-black text-white shadow-xl backdrop-blur-md">
                  +12
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right leading-tight max-w-[120px]">
               Exporting Farmers active in your area
            </p>
         </div>
      </div>
    </div>
  );
}
