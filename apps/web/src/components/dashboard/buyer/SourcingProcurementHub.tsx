'use client';

import { useState } from 'react';
import { Search, Layers, Table, Users, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { SourcingSpace } from './SourcingSpace';
import BulkDiscoveryDashboard from './BulkDiscoveryDashboard';
import BulkTradeAdvanced from './BulkTradeAdvanced';
import { SupplierInsightsPremium } from './SupplierInsightsPremium';

export default function SourcingProcurementHub() {
  const [activeTab, setActiveTab] = useState<'sourcing' | 'bulk' | 'trade' | 'suppliers'>('sourcing');

  const tabs = [
    { id: 'sourcing', label: 'Smart Sourcing', icon: Search },
    { id: 'bulk', label: 'Bulk Marketplace', icon: Layers },
    { id: 'trade', label: 'Trade Desk', icon: Table },
    { id: 'suppliers', label: 'Supplier Network', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <ShoppingBag size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black">Sourcing & Procurement</h1>
            <p className="text-emerald-100">Find, evaluate, and procure from verified suppliers</p>
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
                ? 'bg-emerald-600 text-white shadow-lg'
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
        {activeTab === 'sourcing' && <SourcingSpace />}
        {activeTab === 'bulk' && <BulkDiscoveryDashboard />}
        {activeTab === 'trade' && <BulkTradeAdvanced />}
        {activeTab === 'suppliers' && <SupplierInsightsPremium />}
      </motion.div>
    </div>
  );
}
