'use client';

import { useState } from 'react';
import { Package, Truck, Link2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { OrderTracker } from './OrderTracker';
import { BlockchainTraceLive } from '@/components/shared/BlockchainTraceLive';

export default function OrdersTrackingHub() {
  const [activeTab, setActiveTab] = useState<'orders' | 'tracking' | 'blockchain'>('orders');

  const tabs = [
    { id: 'orders', label: 'Order Management', icon: Package },
    { id: 'tracking', label: 'Live Tracking', icon: Truck },
    { id: 'blockchain', label: 'Blockchain Trace', icon: Link2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Package size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black">Orders & Tracking</h1>
            <p className="text-blue-100">Monitor and trace your orders in real-time</p>
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
        {activeTab === 'orders' && <OrderTracker />}
        {activeTab === 'tracking' && <BlockchainTraceLive userRole="BUYER" />}
        {activeTab === 'blockchain' && <BlockchainTraceLive userRole="BUYER" />}
      </motion.div>
    </div>
  );
}
