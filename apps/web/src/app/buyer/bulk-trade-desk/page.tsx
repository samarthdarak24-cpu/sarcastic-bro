'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function BulkTradeDeskPage() {
  const [deskData, setDeskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeskData = async () => {
      try {
        setLoading(true);
        const data = await buyerFeatureService.bulkTrade.getAnalysis();
        setDeskData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load bulk trade desk data');
      } finally {
        setLoading(false);
      }
    };

    fetchDeskData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Professional Trade Desk"
      description="Advanced bulk trading and analysis tools"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {deskData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Active Trades</p>
                <p className="text-white font-semibold">{deskData.activeTrades || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Daily Volume</p>
                <p className="text-white font-semibold">{deskData.dailyVolume || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Profit/Loss</p>
                <p className="text-white font-semibold">₹{deskData.profitLoss || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Win Rate</p>
                <p className="text-white font-semibold">{deskData.winRate || 'N/A'}%</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No desk data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
