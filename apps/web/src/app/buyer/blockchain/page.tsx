'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function BlockchainPage() {
  const [blockchainData, setBlockchainData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        setLoading(true);
        const data = await buyerFeatureService.blockchain.getSmartContracts();
        setBlockchainData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load blockchain data');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Blockchain Transactions"
      description="View and manage blockchain-based transactions"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {blockchainData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total Transactions</p>
                <p className="text-white font-semibold">{blockchainData.length || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Verified</p>
                <p className="text-white font-semibold">{blockchainData.verified || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-white font-semibold">{blockchainData.pending || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Value</p>
                <p className="text-white font-semibold">₹{blockchainData.totalValue || 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No blockchain data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
