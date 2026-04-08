'use client';

import { useState } from 'react';
import { Sparkles, Brain, TrendingUp, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import AIProcurementAdvancedFixed from './AIProcurementAdvancedFixed';
import { AgriIntelligenceBuyer } from './AgriIntelligenceBuyer';
import { PriceIntelligence } from './PriceIntelligence';
import ClusterIntelligenceAdvanced from './ClusterIntelligenceAdvanced';

export default function AIIntelligenceHub() {
  const [activeTab, setActiveTab] = useState<'procurement' | 'insights' | 'pricing' | 'clusters'>('procurement');

  const tabs = [
    { id: 'procurement', label: 'AI Procurement', icon: Brain },
    { id: 'insights', label: 'Market Insights', icon: TrendingUp },
    { id: 'pricing', label: 'Price Intelligence', icon: Target },
    { id: 'clusters', label: 'Cluster Analysis', icon: Zap },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Sparkles size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black">AI Intelligence Hub</h1>
            <p className="text-blue-100">Powered by advanced AI & machine learning</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'procurement' && <AIProcurementAdvancedFixed />}
        {activeTab === 'insights' && <AgriIntelligenceBuyer />}
        {activeTab === 'pricing' && <PriceIntelligence />}
        {activeTab === 'clusters' && <ClusterIntelligenceAdvanced />}
      </motion.div>
    </div>
  );
}
