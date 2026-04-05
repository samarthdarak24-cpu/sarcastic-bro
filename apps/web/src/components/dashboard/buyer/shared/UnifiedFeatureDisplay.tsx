'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Loader } from 'lucide-react';

interface SubFeature {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  badge?: string;
}

interface FeatureData {
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
  subFeatures: SubFeature[];
}

interface UnifiedFeatureDisplayProps {
  featureData: FeatureData;
  renderSubFeature: (subFeatureId: string) => React.ReactNode;
}

export function UnifiedFeatureDisplay({ featureData, renderSubFeature }: UnifiedFeatureDisplayProps) {
  const [activeSubFeature, setActiveSubFeature] = useState<string>(featureData.subFeatures[0]?.id || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (featureData.subFeatures.length > 0) {
      setActiveSubFeature(featureData.subFeatures[0].id);
    }
  }, [featureData]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <featureData.icon size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900">{featureData.title}</h1>
            <p className="text-slate-600 font-medium mt-1">{featureData.description}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featureData.stats.map((stat, idx) => (
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

      {/* Sub-Features Navigation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900">Features</h2>
        
        {/* Sub-Feature Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {featureData.subFeatures.map((subFeature, idx) => (
            <motion.button
              key={subFeature.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                setLoading(true);
                setActiveSubFeature(subFeature.id);
                setTimeout(() => setLoading(false), 300);
              }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                activeSubFeature === subFeature.id
                  ? `bg-gradient-to-br from-${subFeature.color}-50 to-${subFeature.color}-100 border-${subFeature.color}-400`
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-2">
                <subFeature.icon size={20} className={activeSubFeature === subFeature.id ? `text-${subFeature.color}-600` : 'text-slate-400'} />
                <div className="flex-1">
                  <div className={`text-sm font-black ${activeSubFeature === subFeature.id ? `text-${subFeature.color}-900` : 'text-slate-900'}`}>
                    {subFeature.name}
                  </div>
                  {subFeature.badge && (
                    <div className="text-xs font-bold text-amber-600 mt-1">{subFeature.badge}</div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Sub-Feature Content */}
        <motion.div
          key={activeSubFeature}
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
            renderSubFeature(activeSubFeature)
          )}
        </motion.div>
      </div>
    </div>
  );
}
