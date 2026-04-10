import React from 'react';
import { motion } from 'framer-motion';

interface PriceCardProps {
  label: string;
  price: number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  color: 'green' | 'blue' | 'amber';
  icon: React.ReactNode;
}

export const PriceCard: React.FC<PriceCardProps> = ({ label, price, unit = 'kg', color, icon, trend }) => {
  const colorClasses = {
    green: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700',
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700',
    amber: 'from-amber-50 to-amber-100 border-amber-200 text-amber-700',
  };

  const iconClasses = {
    green: 'bg-emerald-200/50 text-emerald-600',
    blue: 'bg-blue-200/50 text-blue-600',
    amber: 'bg-amber-200/50 text-amber-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} border rounded-3xl p-6 transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tracking-tight">₹{price}</span>
            <span className="text-sm font-semibold opacity-60">/{unit}</span>
          </div>
        </div>
        <div className={`p-3 rounded-2xl ${iconClasses[color]}`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          {trend === 'up' && (
            <span className="flex items-center text-xs font-bold text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
              </svg>
              Above avg
            </span>
          )}
          {trend === 'down' && (
            <span className="flex items-center text-xs font-bold text-rose-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
              Below avg
            </span>
          )}
        </div>
      )}

      {/* Decorative blurred circle */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
    </motion.div>
  );
};
