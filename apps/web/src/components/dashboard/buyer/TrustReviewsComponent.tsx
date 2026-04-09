'use client';

import React, { useState, useEffect } from 'react';

interface Review {
  id: string;
  supplierName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const TrustReviewsComponent: React.FC<{ buyerId: string }> = ({ buyerId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadReviews();
  }, [buyerId]);

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?buyerId=${buyerId}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Trust Reviews</h2>
      
      <div className="space-y-3">
        {reviews.map(review => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold">{review.supplierName}</p>
              <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
