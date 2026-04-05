'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface SubFeatureTab {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface FeatureTabsDisplayProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  stats: Array<{
    label: string;
    value: string;
    icon: React.ComponentType<any>;
    color: string;
    trend: string;
  }>;
  subFeatures: SubFeatureTab[];
  renderSubFeature: (id: string) => React.ReactNode;
}

export function FeatureTabsDisplay({
  title,
  description,
  icon: Icon,
  stats,
  subFeatures,
  renderSubFeature,
}: FeatureTabsDisplayProps) {
  const [activeTab, setActiveTab] = useState(subFeatures[0]?.id || '');
  const [loading, setLoading] = useState(false);

  const handleTabClick = (id: string) => {
    setLoading(true);
    setActiveTab(id);
    setTimeout(() => setLoading(false), 200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <Icon size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900">{title}</h1>
            <p className="text-slate-600 font-medium mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-sm font-black text-${stat.color}-600`}>{stat.trend}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Sub-Features Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900">Features ({subFeatures.length})</h2>

        {/* Tabs Grid - ALL 12 VISIBLE */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {subFeatures.map((subFeature, idx) => (
            <motion.button
              key={subFeature.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleTabClick(subFeature.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left h-full ${
                activeTab === subFeature.id
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-400 shadow-lg'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-2 h-full flex-col">
                <subFeature.icon
                  size={20}
                  className={activeTab === subFeature.id ? 'text-blue-600' : 'text-slate-400'}
                />
                <div className="flex-1">
                  <div
                    className={`text-sm font-black leading-tight ${
                      activeTab === subFeature.id ? 'text-blue-900' : 'text-slate-900'
                    }`}
                  >
                    {subFeature.name}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1">{subFeature.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 min-h-96"
        >
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            renderSubFeature(activeTab)
          )}
        </motion.div>
      </div>
    </div>
  );
}
