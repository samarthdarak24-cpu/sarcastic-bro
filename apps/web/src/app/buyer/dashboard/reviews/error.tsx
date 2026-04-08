'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { AlertCircle } from 'lucide-react';

/**
 * Error Boundary for Reviews Page
 * 
 * Handles errors that occur during rendering of the reviews page.
 * Provides a user-friendly error message and retry functionality.
 */

export default function ReviewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Reviews page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Unable to Load Reviews
            </h2>
            <p className="text-slate-600">
              {error.message || 'Something went wrong while loading your reviews. Please try again.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/buyer/dashboard'}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {error.digest && (
            <p className="text-xs text-slate-400">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
