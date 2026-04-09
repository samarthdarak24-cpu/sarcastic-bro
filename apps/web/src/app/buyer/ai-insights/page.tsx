'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function AIInsightsPage() {
  const [insightsData, setInsightsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsightsData = async () => {
      try {
        setLoading(true);
        const data = await buyerFeatureService.intelligence.getRecommendations();
        setInsightsData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load AI insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsightsData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="AI Insights Dashboard"
      description="AI-powered recommendations and market intelligence"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error || undefined}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {insightsData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Recommendations</p>
                <p className="text-white font-semibold">{insightsData.length || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Confidence Score</p>
                <p className="text-white font-semibold">{insightsData.confidence || 'N/A'}%</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Potential Savings</p>
                <p className="text-white font-semibold">₹{insightsData.potentialSavings || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Market Trend</p>
                <p className="text-white font-semibold">{insightsData.trend || 'Stable'}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No insights data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
