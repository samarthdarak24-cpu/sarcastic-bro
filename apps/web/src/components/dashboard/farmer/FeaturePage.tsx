'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Info } from 'lucide-react';
import { ReactNode } from 'react';

interface FeaturePageProps {
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;
  onBack: () => void;
  children: ReactNode;
  actions?: ReactNode;
}

export default function FeaturePage({
  title,
  description,
  icon,
  gradient,
  onBack,
  children,
  actions
}: FeaturePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      {/* Feature Header */}
      <div className={`bg-gradient-to-r ${gradient} rounded-3xl p-8 md:p-10 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 opacity-10 p-8">
          {icon}
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2">{title}</h1>
              <p className="text-white/90 text-lg">{description}</p>
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Feature Content */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 md:p-10">
        {children}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 flex items-start gap-4">
        <div className="h-10 w-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Info size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-blue-900 mb-1">Need Help?</h3>
          <p className="text-blue-700 text-sm">
            If you have questions about this feature, contact our support team or check the documentation.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
