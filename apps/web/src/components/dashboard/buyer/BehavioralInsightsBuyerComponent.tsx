'use client';

import React, { useState, useEffect } from 'react';

interface Recommendation {
  productName: string;
  reason: string;
  confidence: number;
}

export const BehavioralInsightsBuyerComponent: React.FC<{ buyerId: string }> = ({ buyerId }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    loadRecommendations();
  }, [buyerId]);

  const loadRecommendations = async () => {
    try {
      const response = await fetch(`/api/recommendations/${buyerId}`);
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Behavioral Insights</h2>
      
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold">{rec.productName}</p>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                {Math.round(rec.confidence * 100)}%
              </span>
            </div>
            <p className="text-sm text-gray-600">{rec.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
