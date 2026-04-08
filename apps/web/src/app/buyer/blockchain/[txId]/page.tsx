'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';
import { useParams } from 'next/navigation';

export default function TransactionDetailPage() {
  const params = useParams();
  const txId = params.txId as string;
  const [txData, setTxData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTxData = async () => {
      try {
        setLoading(true);
        const tx = await buyerFeatureService.blockchain.verifyTransaction(txId);
        setTxData(tx);
      } catch (err: any) {
        setError(err.message || 'Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    };

    fetchTxData();
  }, [txId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Transaction Details"
      description="View blockchain transaction information"
      backLink="/buyer/blockchain"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {txData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Transaction ID</p>
                <p className="text-white font-semibold text-xs">{txData.id || txId}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <p className="text-white font-semibold">{txData.status || 'Verified'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Amount</p>
                <p className="text-white font-semibold">₹{txData.amount || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Timestamp</p>
                <p className="text-white font-semibold">{txData.timestamp || 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No transaction data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
