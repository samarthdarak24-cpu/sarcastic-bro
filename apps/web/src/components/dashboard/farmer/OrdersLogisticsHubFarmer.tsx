'use client';

import { useState } from 'react';
import { ShoppingBag, Gavel, Truck, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderControlCenter } from './OrderControlCenter';
import { TenderParticipation } from './TenderParticipation';
import { LogisticsManager } from './LogisticsManager';

export default function OrdersLogisticsHubFarmer() {
  const [activeTab, setActiveTab] = useState<'orders' | 'tenders' | 'logistics'>('orders');

  const tabs = [
    { id: 'orders', label: 'Order Control', icon: ShoppingBag },
    { id: 'tenders', label: 'Tender Bids', icon: Gavel },
    { id: 'logistics', label: 'Logistics Center', icon: Truck },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Container */}
      <div className="relative overflow-hidden bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
           <ShoppingBag size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
           <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Activity size={36} className="text-white" />
           </div>
           <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-400">Order & Logistics Hub</h1>
              <p className="text-indigo-400 font-bold text-sm md:text-base uppercase tracking-[0.2em]">Procurement Lifecycle Management</p>
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
                  ? 'bg-indigo-900 text-white shadow-2xl scale-105 -translate-y-1' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                }
              `}
            >
              <tab.icon size={18} className={isActive ? 'text-indigo-400' : ''} />
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
             <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] border border-slate-200/50 shadow-xl overflow-hidden p-8 md:p-12">
                {activeTab === 'orders' && <OrderControlCenter />}
                {activeTab === 'tenders' && (
                  <div className="space-y-6">
                     <div className="flex items-center gap-2 text-indigo-600 font-black mb-6 uppercase tracking-widest text-sm">
                        <Zap size={16} /> 
                        Global Tendering System Live
                     </div>
                     <TenderParticipation />
                  </div>
                )}
                {activeTab === 'logistics' && <LogisticsManager />}
             </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
