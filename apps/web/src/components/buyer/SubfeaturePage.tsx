'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface SubfeaturePageProps {
  title: string;
  description?: string;
  backLink: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export const SubfeaturePage: React.FC<SubfeaturePageProps> = ({
  title,
  description,
  backLink,
  children,
  loading = false,
  error = null,
  onRetry,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
    >
      {/* Header */}
      <div className="mb-8">
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>

        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          {description && (
            <p className="text-slate-400 text-lg">{description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-red-500 font-semibold mb-2">Error</h3>
                <p className="text-red-400 mb-4">{error}</p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
};

export default SubfeaturePage;
