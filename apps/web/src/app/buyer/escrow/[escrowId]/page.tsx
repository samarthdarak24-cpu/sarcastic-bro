'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';
import { useParams } from 'next/navigation';

export default function EscrowDetailPage() {
  const params = useParams();
  const escrowId = params.escrowId as string;
  const [escrowData, setEscrowData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEscrowData = async () => {
      try {
        setLoading(true);
        const escrow = await buyerFeatureService.escrow.getEscrowDetails(escrowId);
        setEscrowData(escrow);
      } catch (err: any) {
        setError(err.message || 'Failed to load escrow details');
      } finally {
        setLoading(false);
      }
    };

    fetchEscrowData();
  }, [escrowId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Escrow Details"
      description="View escrow transaction information"
      backLink="/buyer/escrow"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {escrowData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Escrow ID</p>
                <p className="text-white font-semibold">{escrowData.id || escrowId}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <p className="text-white font-semibold">{escrowData.status || 'Active'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Amount</p>
                <p className="text-white font-semibold">₹{escrowData.amount || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Release Date</p>
                <p className="text-white font-semibold">{escrowData.releaseDate || 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No escrow data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
