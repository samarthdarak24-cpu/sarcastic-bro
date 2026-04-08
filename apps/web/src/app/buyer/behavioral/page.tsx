'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function BehavioralAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const data = await buyerFeatureService.intelligence.getAnalytics();
        setAnalyticsData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load behavioral analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Behavioral Analytics"
      description="Analyze your purchasing patterns and insights"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {analyticsData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total Purchases</p>
                <p className="text-white font-semibold">{analyticsData.totalPurchases || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Avg Order Value</p>
                <p className="text-white font-semibold">₹{analyticsData.avgOrderValue || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Preferred Category</p>
                <p className="text-white font-semibold">{analyticsData.preferredCategory || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Loyalty Score</p>
                <p className="text-white font-semibold">{analyticsData.loyaltyScore || 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No analytics data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
