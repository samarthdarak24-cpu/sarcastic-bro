'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';
import { useParams } from 'next/navigation';

export default function TradeDetailPage() {
  const params = useParams();
  const tradeId = params.tradeId as string;
  const [tradeData, setTradeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTradeData = async () => {
      try {
        setLoading(true);
        const orders = await buyerFeatureService.bulkTrade.getOrders();
        const trade = orders?.find((o: any) => o.id === tradeId);
        setTradeData(trade || null);
        setError(trade ? null : 'Trade not found');
      } catch (err: any) {
        setError(err.message || 'Failed to load trade details');
      } finally {
        setLoading(false);
      }
    };

    fetchTradeData();
  }, [tradeId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Trade Details"
      description="View bulk trade order information"
      backLink="/buyer/bulk-trade"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {tradeData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Trade ID</p>
                <p className="text-white font-semibold">{tradeData.id}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <p className="text-white font-semibold">{tradeData.status || 'Active'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Volume</p>
                <p className="text-white font-semibold">{tradeData.volume || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Value</p>
                <p className="text-white font-semibold">₹{tradeData.value || 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No trade data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
