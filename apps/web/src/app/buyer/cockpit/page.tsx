'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function CockpitPage() {
  const [cockpitData, setCockpitData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCockpitData = async () => {
      try {
        setLoading(true);
        const data = await buyerFeatureService.cockpit.getLiveDashboard();
        setCockpitData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load cockpit data');
      } finally {
        setLoading(false);
      }
    };

    fetchCockpitData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Live Cockpit Dashboard"
      description="Real-time operational control center"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {cockpitData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">System Status</p>
                <p className="text-white font-semibold">{cockpitData.status || 'Operational'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Operations</p>
                <p className="text-white font-semibold">{cockpitData.activeOps || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Performance</p>
                <p className="text-white font-semibold">{cockpitData.performance || 'N/A'}%</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Alerts</p>
                <p className="text-white font-semibold">{cockpitData.alerts || 0}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No cockpit data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
