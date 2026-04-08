'use client';

import { useState } from 'react';
import { ShieldAlert, CheckCircle, Globe, Link2, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SecurityHubLive } from '@/components/shared/SecurityHubLive';
import { ComplianceTracking } from './ComplianceTracking';
import GlobalExportAudit from './GlobalExportAudit';
import { BlockchainTraceLive } from '@/components/shared/BlockchainTraceLive';

export default function SecurityComplianceHubFarmer() {
  const [activeTab, setActiveTab] = useState<'security' | 'compliance' | 'export' | 'blockchain'>('security');

  const tabs = [
    { id: 'security', label: 'Security Dashboard', icon: ShieldAlert },
    { id: 'compliance', label: 'Compliance Tracking', icon: CheckCircle },
    { id: 'export', label: 'Global Export Audit', icon: Globe },
    { id: 'blockchain', label: 'Blockchain Trace', icon: Link2 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Container */}
      <div className="relative overflow-hidden bg-red-950 rounded-[2.5rem] p-10 text-white shadow-2xl group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
           <Shield size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
           <div className="h-20 w-20 bg-gradient-to-br from-red-600 to-rose-700 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-red-500/20">
              <Lock size={36} className="text-white" />
           </div>
           <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white via-red-100 to-slate-400">Security & Compliance</h1>
              <p className="text-red-400 font-bold text-sm md:text-base uppercase tracking-[0.2em]">Risk Management & Global Standards</p>
           </div>
        </div>
      </div>

      {/* Modern Tab System */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300
                ${isActive 
                  ? 'bg-rose-900 text-white shadow-2xl scale-105 -translate-y-1' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                }
              `}
            >
              <tab.icon size={18} className={isActive ? 'text-rose-400' : ''} />
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
             <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] border border-slate-200/50 shadow-xl overflow-hidden p-8 md:p-12">
                {activeTab === 'security' && <SecurityHubLive userRole="FARMER" />}
                {activeTab === 'compliance' && <ComplianceTracking />}
                {activeTab === 'export' && <GlobalExportAudit />}
                {activeTab === 'blockchain' && <BlockchainTraceLive userRole="FARMER" />}
             </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
