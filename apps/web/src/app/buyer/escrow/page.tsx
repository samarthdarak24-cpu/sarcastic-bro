'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function EscrowHubPage() {
  const [escrowData, setEscrowData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEscrowData = async () => {
      try {
        setLoading(true);
        const data = await buyerFeatureService.escrow.getEscrows();
        setEscrowData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load escrow data');
      } finally {
        setLoading(false);
      }
    };

    fetchEscrowData();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Escrow Hub"
      description="Manage secure payment escrow transactions"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {escrowData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Active Escrows</p>
                <p className="text-white font-semibold">{escrowData.length || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Held</p>
                <p className="text-white font-semibold">₹{escrowData.totalHeld || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Completed</p>
                <p className="text-white font-semibold">{escrowData.completed || 0}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Disputes</p>
                <p className="text-white font-semibold">{escrowData.disputes || 0}</p>
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
