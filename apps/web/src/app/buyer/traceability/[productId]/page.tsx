'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';
import { useParams } from 'next/navigation';

export default function BlockchainTracePage() {
  const params = useParams();
  const productId = params.productId as string;
  const [traceData, setTraceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraceData = async () => {
      try {
        setLoading(true);
        const trace = await buyerFeatureService.blockchain.getTrace(productId);
        setTraceData(trace);
      } catch (err: any) {
        setError(err.message || 'Failed to load blockchain trace');
      } finally {
        setLoading(false);
      }
    };

    fetchTraceData();
  }, [productId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Blockchain Traceability"
      description="View complete supply chain trace on blockchain"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {traceData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Product ID</p>
                <p className="text-white font-semibold">{traceData.productId || productId}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Origin</p>
                <p className="text-white font-semibold">{traceData.origin || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Verified</p>
                <p className="text-white font-semibold">{traceData.verified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Hash</p>
                <p className="text-white font-semibold text-xs">{traceData.hash?.substring(0, 16) || 'N/A'}...</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No trace data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
