'use client';

import { useState } from 'react';
import { Sparkles, BarChart3, Brain, TrendingUp, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FarmInsights from './FarmInsights';
import AgriIntelligence from './AgriIntelligence';
import MarketIntelligenceHub from './MarketIntelligenceHub';
import { BehavioralInsights } from './BehavioralInsights';

export default function AIIntelligenceHubFarmer() {
  const [activeTab, setActiveTab] = useState<'insights' | 'intelligence' | 'market' | 'behavioral'>('insights');

  const tabs = [
    { id: 'insights', label: 'Farm Insights', icon: BarChart3 },
    { id: 'intelligence', label: 'Agri-Intelligence', icon: Brain },
    { id: 'market', label: 'Market Intelligence', icon: TrendingUp },
    { id: 'behavioral', label: 'Behavioral Insights', icon: Target },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Container */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
           <Sparkles size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
           <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Sparkles size={36} className="text-white" />
           </div>
           <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-400">AI Intelligence Hub</h1>
              <p className="text-slate-400 font-bold text-sm md:text-base uppercase tracking-[0.2em]">Next-Generation Agricultural Insights Engine</p>
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
                flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-2xl scale-105 -translate-y-1' 
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
             <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] border border-slate-200/50 shadow-xl overflow-hidden p-8 md:p-12">
                {activeTab === 'insights' && <FarmInsights />}
                {activeTab === 'intelligence' && <AgriIntelligence />}
                {activeTab === 'market' && <MarketIntelligenceHub />}
                {activeTab === 'behavioral' && <BehavioralInsights />}
             </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
