'use client';

import React, { useState, useEffect } from 'react';

interface Reputation {
  reputationScore: number;
  totalRatings: number;
  ratingDistribution: Record<string, number>;
}

export const TrustIdentityComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const [reputation, setReputation] = useState<Reputation | null>(null);

  useEffect(() => {
    loadReputation();
  }, [userId]);

  const loadReputation = async () => {
    try {
      const response = await fetch(`/api/reputation/${userId}`);
      const data = await response.json();
      setReputation(data);
    } catch (error) {
      console.error('Failed to load reputation:', error);
    }
  };

  if (!reputation) return <div className="p-6 text-center">Loading...</div>;

  const stars = Math.round(reputation.reputationScore);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Trust Identity</h2>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-yellow-500 mb-2">
          {'⭐'.repeat(Math.min(stars, 5))}
        </div>
        <p className="text-2xl font-semibold">{reputation.reputationScore.toFixed(1)}/5.0</p>
        <p className="text-gray-600">{reputation.totalRatings} ratings</p>
      </div>

      <div className="space-y-2">
        {Object.entries(reputation.ratingDistribution).map(([stars, count]) => (
          <div key={stars} className="flex items-center gap-2">
            <span className="w-12">{stars}★</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${(count / reputation.totalRatings) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
