'use client';

import { Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TrustReviews } from '@/components/dashboard/buyer/TrustReviews';
import { buyerNav } from '@/lib/nav-config';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';

/**
 * ReviewsPage Component
 * 
 * Displays the buyer's reviews list page with trust and rating information.
 * This page shows reviews written by or about the buyer, supporting the
 * Reviews and Trust System Integration (Requirement 7).
 * 
 * Features:
 * - List of reviews with ratings, comments, and dates
 * - Verified purchase badges
 * - Review creation, listing, and pagination support
 * - Premium UI styling with Framer Motion animations
 * - Loading and error states
 * 
 * Route: /buyer/dashboard/reviews
 */

// Loading skeleton component
function ReviewsLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200">
            <div className="h-12 w-12 bg-slate-200 rounded-2xl mb-4" />
            <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-32 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      
      {/* Reviews skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 w-40 bg-slate-200 rounded mb-2" />
                <div className="h-4 w-48 bg-slate-200 rounded" />
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="h-4 w-4 bg-slate-200 rounded" />
                ))}
              </div>
            </div>
            <div className="h-4 w-full bg-slate-200 rounded mb-2" />
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const { user, loading } = useAuth('BUYER');

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-medium">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!user || user.role !== 'BUYER') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
          <p className="text-slate-600">You must be logged in as a buyer to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout navItems={buyerNav} userRole="BUYER">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="p-6"
      >
        <Suspense fallback={<ReviewsLoadingSkeleton />}>
          <TrustReviews />
        </Suspense>
      </motion.div>
    </DashboardLayout>
  );
}
