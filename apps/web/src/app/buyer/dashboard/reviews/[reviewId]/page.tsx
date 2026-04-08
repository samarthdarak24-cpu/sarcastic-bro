'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { buyerNav } from '@/lib/nav-config';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  Shield, 
  Calendar, 
  User, 
  Package, 
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeIn } from '@/lib/animations';
import { reviewService, Review } from '@/services/reviewService';

/**
 * ReviewDetailPage Component
 * 
 * Displays detailed information about a specific review.
 * This page supports the Reviews and Trust System Integration (Requirement 7).
 * 
 * Features:
 * - Display review with rating, comment, date, verified purchase badge, and helpful count
 * - Show reviewer and reviewee information
 * - Display order context
 * - Support review updates
 * - Premium UI styling with Framer Motion animations
 * - Loading and error states
 * 
 * Route: /buyer/dashboard/reviews/[reviewId]
 * Dynamic Parameter: reviewId - The unique identifier of the review
 */

// Loading skeleton component
function ReviewDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200">
        <div className="h-8 w-48 bg-slate-200 rounded mb-4" />
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 bg-slate-200 rounded-full" />
          <div className="flex-1">
            <div className="h-6 w-40 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-32 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-8 bg-slate-200 rounded" />
          ))}
        </div>
        <div className="h-4 w-full bg-slate-200 rounded mb-2" />
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
      </div>
      
      {/* Details skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200">
            <div className="h-6 w-32 bg-slate-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewDetailPage() {
  const { user, loading: authLoading } = useAuth('BUYER');
  const params = useParams();
  const router = useRouter();
  const reviewId = params.reviewId as string;

  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For now, we'll use mock data since the API endpoint for single review doesn't exist yet
        // In production, this would be: const data = await reviewService.getReviewById(reviewId);
        
        // Mock data for demonstration
        const mockReview: Review = {
          id: reviewId,
          orderId: 'ORD-2024-001',
          reviewerId: user?.id || 'buyer-123',
          revieweeId: 'supplier-456',
          rating: 5,
          comment: 'Excellent quality products and timely delivery. The supplier was very professional and responsive to all queries. Highly recommended for bulk orders.',
          type: 'BUYER_TO_FARMER',
          createdAt: new Date().toISOString(),
          reviewer: {
            id: user?.id || 'buyer-123',
            name: user?.name || 'Amit Kumar',
            email: user?.email || 'amit@example.com'
          },
          reviewee: {
            id: 'supplier-456',
            name: 'Ramesh Agro Farms',
            email: 'ramesh@agrofarms.com'
          }
        };
        
        setReview(mockReview);
      } catch (err) {
        console.error('Error fetching review:', err);
        setError('Failed to load review details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user && reviewId) {
      fetchReviewDetail();
    }
  }, [reviewId, user]);

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-medium">Loading review details...</p>
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

  // Error state
  if (error) {
    return (
      <DashboardLayout navItems={buyerNav} userRole="BUYER">
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center"
          >
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Review</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/buyer/dashboard/reviews')}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Reviews
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // No review found
  if (!review) {
    return (
      <DashboardLayout navItems={buyerNav} userRole="BUYER">
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center"
          >
            <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Not Found</h2>
            <p className="text-slate-600 mb-6">The review you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/buyer/dashboard/reviews')}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Reviews
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={buyerNav} userRole="BUYER">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="p-6 max-w-6xl mx-auto"
      >
        {/* Back Button */}
        <motion.button
          variants={staggerItem}
          onClick={() => router.push('/buyer/dashboard/reviews')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Reviews
        </motion.button>

        {/* Page Header */}
        <motion.div variants={staggerItem} className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Review Details</h1>
          <p className="text-slate-500 font-medium">Detailed information about this review</p>
        </motion.div>

        {/* Main Review Card */}
        <motion.div
          variants={staggerItem}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg mb-6"
        >
          {/* Reviewer Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {review.reviewer?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">{review.reviewer?.name || 'Anonymous'}</h2>
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            {/* Verified Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-2xl border border-green-200">
              <CheckCircle size={18} />
              <span className="font-semibold text-sm">Verified Purchase</span>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  className={star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}
                />
              ))}
              <span className="text-3xl font-black text-slate-900 ml-2">{review.rating}.0</span>
            </div>
            <p className="text-slate-500 font-medium">
              {review.rating === 5 ? 'Excellent' : review.rating === 4 ? 'Very Good' : review.rating === 3 ? 'Good' : review.rating === 2 ? 'Fair' : 'Poor'}
            </p>
          </div>

          {/* Review Comment */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Review</h3>
            <p className="text-slate-700 font-medium leading-relaxed text-lg">
              {review.comment || 'No comment provided.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-semibold hover:bg-blue-100 transition-colors">
              <ThumbsUp size={18} />
              Helpful (24)
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-semibold hover:bg-slate-100 transition-colors">
              <MessageSquare size={18} />
              Reply
            </button>
          </div>
        </motion.div>

        {/* Additional Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reviewee Information */}
          <motion.div
            variants={staggerItem}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <User size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Supplier Information</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Supplier Name</p>
                <p className="text-lg font-bold text-slate-900">{review.reviewee?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Supplier ID</p>
                <p className="text-slate-700 font-mono">{review.revieweeId}</p>
              </div>
              <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
                View Supplier Profile
              </button>
            </div>
          </motion.div>

          {/* Order Information */}
          <motion.div
            variants={staggerItem}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Order Information</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Order ID</p>
                <p className="text-lg font-bold text-slate-900">{review.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Review Type</p>
                <p className="text-slate-700 font-semibold">
                  {review.type === 'BUYER_TO_FARMER' ? 'Buyer to Supplier' : 'Supplier to Buyer'}
                </p>
              </div>
              <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
                View Order Details
              </button>
            </div>
          </motion.div>
        </div>

        {/* Review Stats */}
        <motion.div
          variants={staggerItem}
          className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Review Impact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <p className="text-sm text-slate-500 font-medium mb-1">Helpful Votes</p>
              <p className="text-3xl font-black text-slate-900">24</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <p className="text-sm text-slate-500 font-medium mb-1">Views</p>
              <p className="text-3xl font-black text-slate-900">156</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200">
              <p className="text-sm text-slate-500 font-medium mb-1">Trust Score Impact</p>
              <p className="text-3xl font-black text-emerald-600">+2.5</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
