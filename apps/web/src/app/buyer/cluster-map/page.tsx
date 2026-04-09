'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function ClusterMapPage() {
  const [mapData, setMapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const data = await buyerFeatureService.cluster.getAnalytics();
        setMapData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load cluster map data');
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Geographic Cluster Map"
      description="View regional supplier clusters and opportunities"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error || undefined}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {mapData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total Clusters</p>
                <p className="text-white font-semibold">{mapData.totalClusters || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Suppliers</p>
                <p className="text-white font-semibold">{mapData.activeSuppliers || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Top Region</p>
                <p className="text-white font-semibold">{mapData.topRegion || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Coverage</p>
                <p className="text-white font-semibold">{mapData.coverage || 'N/A'}%</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No cluster map data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
