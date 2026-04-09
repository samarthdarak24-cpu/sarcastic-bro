'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function ClusterIntelligencePage() {
  const [clusterData, setClusterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClusterData = async () => {
      try {
        setLoading(true);
        const data = await buyerFeatureService.cluster.getCompetitiveAnalysis();
        setClusterData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load cluster intelligence');
      } finally {
        setLoading(false);
      }
    };

    fetchClusterData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Cluster Intelligence"
      description="Advanced regional cluster analysis and insights"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error || undefined}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {clusterData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Clusters Analyzed</p>
                <p className="text-white font-semibold">{clusterData.clustersAnalyzed || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Market Share</p>
                <p className="text-white font-semibold">{clusterData.marketShare || 'N/A'}%</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Competitive Index</p>
                <p className="text-white font-semibold">{clusterData.competitiveIndex || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Growth Rate</p>
                <p className="text-white font-semibold">{clusterData.growthRate || 'N/A'}%</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No cluster intelligence data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
