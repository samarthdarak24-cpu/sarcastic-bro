'use client';

import { useState } from 'react';
import { Award, ShieldCheck, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { MyReputationPremium } from './MyReputationPremium';
import { TrustReviews } from './TrustReviews';
import { SupplierInsightsPremium } from './SupplierInsightsPremium';

export default function TrustReputationHub() {
  const [activeTab, setActiveTab] = useState<'reputation' | 'reviews' | 'suppliers'>('reputation');

  const tabs = [
    { id: 'reputation', label: 'My Reputation', icon: Award },
    { id: 'reviews', label: 'Trust & Reviews', icon: Star },
    { id: 'suppliers', label: 'Supplier Ratings', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Award size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black">Trust & Reputation</h1>
            <p className="text-amber-100">Build trust and track your marketplace reputation</p>
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
                ? 'bg-amber-600 text-white shadow-lg'
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
        {activeTab === 'reputation' && <MyReputationPremium />}
        {activeTab === 'reviews' && <TrustReviews />}
        {activeTab === 'suppliers' && <SupplierInsightsPremium />}
      </motion.div>
    </div>
  );
}
