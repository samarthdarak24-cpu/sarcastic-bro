'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';

interface SubFeature {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
  color: string;
}

interface PremiumFeatureLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  subFeatures: SubFeature[];
  renderSubFeature: (subFeatureId: string) => React.ReactNode;
  stats?: Array<{
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    trend?: string;
  }>;
}

export function PremiumFeatureLayout({
  title,
  description,
  icon: Icon,
  subFeatures,
  renderSubFeature,
  stats
}: PremiumFeatureLayoutProps) {
  const [activeSubFeature, setActiveSubFeature] = useState(subFeatures[0]?.id || '');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <motion.div
            className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Icon size={32} strokeWidth={2.5} />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
            <p className="text-slate-500 font-medium mt-1">{description}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Sparkles size={18} />
          AI Insights
        </motion.button>
      </div>

      {/* Stats Grid */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`h-12 w-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <TrendingUp size={14} />
                    {stat.trend}
                  </div>
                )}
              </div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
            </motion.div>
          ))}
        </div>
      )}

      {/* Sub-Features Navigation */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {subFeatures.map((feature) => {
            const FeatureIcon = feature.icon;
            const isActive = activeSubFeature === feature.id;
            
            return (
              <motion.button
                key={feature.id}
                onClick={() => setActiveSubFeature(feature.id)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 text-white shadow-lg`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {feature.badge && (
                  <div className="absolute -top-2 -right-2 h-6 px-2 bg-red-500 text-white text-[10px] font-black rounded-lg flex items-center justify-center">
                    {feature.badge}
                  </div>
                )}
                <div className="flex flex-col items-center gap-2 text-center">
                  <FeatureIcon size={24} strokeWidth={2.5} />
                  <span className="text-xs font-bold leading-tight">{feature.name}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Sub-Feature Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl min-h-[600px]"
        >
          {renderSubFeature(activeSubFeature)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Reusable Premium Card Component
export function PremiumCard({ 
  children, 
  className = '',
  hover = true 
}: { 
  children: React.ReactNode; 
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
      className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-lg transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Reusable Metric Display
export function MetricDisplay({
  label,
  value,
  icon: Icon,
  color = 'blue',
  trend,
  size = 'md'
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trend?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl bg-${color}-50 flex items-center justify-center text-${color}-600`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
          <h3 className={`${sizeClasses[size]} font-black text-slate-900 tracking-tight`}>{value}</h3>
        </div>
      </div>
      {trend && (
        <div className="text-sm font-bold text-emerald-600 flex items-center gap-1">
          <TrendingUp size={16} />
          {trend}
        </div>
      )}
    </div>
  );
}

// Reusable Action Button
export function ActionButton({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  className = ''
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  icon?: LucideIcon;
  className?: string;
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/30',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-emerald-500/30',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-red-500/30'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`h-12 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
      <ChevronRight size={18} />
    </motion.button>
  );
}
