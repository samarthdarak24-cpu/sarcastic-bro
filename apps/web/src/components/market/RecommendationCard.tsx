import React from 'react';
import { motion } from 'framer-motion';
import { Recommendation } from '../../hooks/useMarketPrices';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const isSell = recommendation.status === 'SELL';
  const isWait = recommendation.status === 'WAIT';
  const isStable = recommendation.status === 'STABLE';

  const theme = {
    SELL: {
      bg: 'bg-rose-50/50',
      border: 'border-rose-100',
      text: 'text-rose-900',
      accent: 'text-rose-600',
      icon: 'bg-rose-100',
      button: 'bg-rose-600 hover:bg-rose-700',
      badge: 'SELL ADVISORY'
    },
    WAIT: {
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-100',
      text: 'text-emerald-900',
      accent: 'text-emerald-600',
      icon: 'bg-emerald-100',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      badge: 'HOLD ADVISORY'
    },
    STABLE: {
      bg: 'bg-blue-50/50',
      border: 'border-blue-100',
      text: 'text-blue-900',
      accent: 'text-blue-600',
      icon: 'bg-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700',
      badge: 'STABLE MARKET'
    },
    HOLD: {
      bg: 'bg-gray-50/50',
      border: 'border-gray-100',
      text: 'text-gray-900',
      accent: 'text-gray-600',
      icon: 'bg-gray-100',
      button: 'bg-gray-600 hover:bg-gray-700',
      badge: 'SCANNING...'
    }
  }[recommendation.status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden ${theme.bg} border ${theme.border} rounded-3xl p-8`}
    >
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className={`flex-shrink-0 w-20 h-20 rounded-2xl ${theme.icon} flex items-center justify-center`}>
          {isSell && (
            <svg className="w-10 h-10 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {isWait && (
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {(isStable || recommendation.status === 'HOLD') && (
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-white border ${theme.border} ${theme.accent}`}>
              {theme.badge}
            </span>
            {recommendation.change && (
              <span className={`text-sm font-bold ${recommendation.trend === 'UPWARD' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {recommendation.trend === 'UPWARD' ? '+' : '-'}{recommendation.change} trend
              </span>
            )}
          </div>
          <h3 className={`text-2xl font-black ${theme.text}`}>
            {isWait ? 'Wait for a better price' : isSell ? 'Sell your inventory now' : 'Market is balanced'}
          </h3>
          <p className="text-gray-600 leading-relaxed max-w-xl">
            {recommendation.message}
          </p>
        </div>

        <div className="flex-shrink-0">
          <button className={`px-8 py-4 rounded-2xl text-white font-bold shadow-lg shadow-gray-200 transition-all active:scale-95 ${theme.button}`}>
            {isSell ? 'List Crops Now' : isWait ? 'Set Price Alert' : 'View Market Info'}
          </button>
        </div>
      </div>

      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
        <svg fill="currentColor" viewBox="0 0 100 100">
          <path d="M0,100 C20,80 40,90 60,70 C80,50 100,60 100,40 V100 H0 Z" />
        </svg>
      </div>
    </motion.div>
  );
};
