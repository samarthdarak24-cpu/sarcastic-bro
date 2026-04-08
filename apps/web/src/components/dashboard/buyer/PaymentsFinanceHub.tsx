'use client';

import { useState } from 'react';
import { DollarSign, Lock, CreditCard, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { EscrowHubBuyer } from './EscrowHubBuyer';
import { PreBookingHub } from './PreBookingHub';

export default function PaymentsFinanceHub() {
  const [activeTab, setActiveTab] = useState<'escrow' | 'prebooking' | 'wallet'>('escrow');

  const tabs = [
    { id: 'escrow', label: 'Escrow Payments', icon: Shield },
    { id: 'prebooking', label: 'Pre-Booking', icon: Lock },
    { id: 'wallet', label: 'Wallet & Transactions', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <DollarSign size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black">Payments & Finance</h1>
            <p className="text-green-100">Secure payments, escrow, and financial management</p>
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
                ? 'bg-green-600 text-white shadow-lg'
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
        {activeTab === 'escrow' && <EscrowHubBuyer />}
        {activeTab === 'prebooking' && <PreBookingHub />}
        {activeTab === 'wallet' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <p className="text-slate-600">Wallet & Transactions coming soon...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
