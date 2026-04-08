'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function BulkTradePage() {
  const [bulkTradeData, setBulkTradeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBulkTradeData = async () => {
      try {
        setLoading(true);
        const data = await buyerFeatureService.bulkTrade.getTerminal();
        setBulkTradeData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load bulk trade data');
      } finally {
        setLoading(false);
      }
    };

    fetchBulkTradeData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Bulk Trade System"
      description="Manage large-scale trading operations"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {bulkTradeData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Active Trades</p>
                <p className="text-white font-semibold">{bulkTradeData.activeTrades || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Volume</p>
                <p className="text-white font-semibold">{bulkTradeData.totalVolume || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Pending Orders</p>
                <p className="text-white font-semibold">{bulkTradeData.pendingOrders || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Success Rate</p>
                <p className="text-white font-semibold">{bulkTradeData.successRate || 'N/A'}%</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No bulk trade data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
