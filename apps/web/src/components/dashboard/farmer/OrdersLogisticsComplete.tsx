'use client';

import { useState } from 'react';
import { ShoppingCart, Truck, Settings, Package, Gavel, Activity, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderControl from './OrderControl';
import { LogisticsManager } from './LogisticsManager';
import AutoSellRulesAdvanced from './AutoSellRulesAdvanced';
import BulkAggregationEngine from './BulkAggregationEngine';

export default function OrdersLogisticsComplete() {
  const [activeTab, setActiveTab] = useState<'orders' | 'logistics' | 'autosell' | 'bulk'>('orders');

  const tabs = [
    { id: 'orders', label: 'Order Control', icon: ShoppingCart, color: 'from-blue-500 to-cyan-600' },
    { id: 'logistics', label: 'Logistics Manager', icon: Truck, color: 'from-cyan-500 to-blue-600' },
    { id: 'autosell', label: 'Auto-Sell Rules', icon: Settings, color: 'from-sky-500 to-blue-600' },
    { id: 'bulk', label: 'Bulk Aggregation', icon: Package, color: 'from-indigo-500 to-blue-600' },
  ];

  // Stats for the header
  const stats = [
    { label: 'Active Orders', value: '24', icon: ShoppingCart, trend: '+12%' },
    { label: 'In Transit', value: '8', icon: Truck, trend: '+5%' },
    { label: 'Auto-Sell Active', value: '6', icon: Zap, trend: 'Live' },
    { label: 'Bulk Orders', value: '3', icon: Package, trend: '+2' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white" />
        </div>
        
        <motion.div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold mb-3">
                  OPERATIONS CENTER
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black mb-2 flex items-center gap-3"
              >
                <Activity size={40} className="text-cyan-300" />
                Orders & Logistics Hub
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-blue-100 text-lg font-medium"
              >
                Complete Order Management & Supply Chain Control
              </motion.p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl"
            >
              <TrendingUp size={32} className="text-cyan-300" />
            </motion.div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <stat.icon size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/20">
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-black mb-1">{stat.value}</p>
                <p className="text-xs text-blue-100 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 relative overflow-hidden
                ${isActive 
                  ? 'bg-gradient-to-r text-white shadow-lg' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }
              `}
              style={isActive ? { backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` } : {}}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 bg-gradient-to-r ${tab.color}`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <tab.icon size={18} className={`relative z-10 ${isActive ? 'text-white' : ''}`} />
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Content Area */}
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
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6">
              {activeTab === 'orders' && <OrderControl />}
              {activeTab === 'logistics' && <LogisticsManager />}
              {activeTab === 'autosell' && <AutoSellRulesAdvanced />}
              {activeTab === 'bulk' && <BulkAggregationEngine />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
