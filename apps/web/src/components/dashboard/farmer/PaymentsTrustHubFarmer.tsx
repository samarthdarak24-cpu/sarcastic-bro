'use client';

import { useState } from 'react';
import { CreditCard, Award, ShieldCheck, DollarSign, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FinancialHub from './FinancialHub';
import TrustIdentityPremium from './TrustIdentityPremium';

export default function PaymentsTrustHubFarmer() {
  const [activeTab, setActiveTab] = useState<'finance' | 'trust'>('finance');

  const tabs = [
    { id: 'finance', label: 'Financial Hub', icon: CreditCard },
    { id: 'trust', label: 'Trust & Reputation', icon: Award },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Container */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
           <Wallet size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
           <div className="h-20 w-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-amber-500/20">
              <DollarSign size={36} className="text-white" />
           </div>
           <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-slate-400">Financial & Trust Hub</h1>
              <p className="text-amber-400 font-bold text-sm md:text-base uppercase tracking-[0.2em]">Enterprise Finance & Digital Identity</p>
           </div>
        </div>
      </div>

      {/* Modern Tab System */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300
                ${isActive 
                  ? 'bg-amber-600 text-white shadow-2xl scale-105 -translate-y-1' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                }
              `}
            >
              <tab.icon size={18} className={isActive ? 'text-amber-200' : ''} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Component Canvas */}
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
             <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] border border-slate-200/50 shadow-xl overflow-hidden p-8 md:p-12">
                {activeTab === 'finance' && <FinancialHub />}
                {activeTab === 'trust' && (
                  <div className="space-y-10 group">
                     <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white border border-slate-800 shadow-3xl">
                        <div className="flex items-center gap-4 mb-10">
                           <div className="h-14 w-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                              <ShieldCheck size={28} />
                           </div>
                           <div>
                              <h3 className="text-xl font-black uppercase tracking-widest text-slate-100">Reputation Managed</h3>
                              <p className="text-slate-500 font-bold text-xs uppercase tracking-tighter">Blockchain Verified Identity</p>
                           </div>
                        </div>
                        <TrustIdentityPremium />
                     </div>
                  </div>
                )}
             </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
