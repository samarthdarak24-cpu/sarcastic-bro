'use client';

import React, { useState, useEffect } from 'react';
import { SubfeaturePage } from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';
import { useParams } from 'next/navigation';

export default function BidDetailPage() {
  const params = useParams();
  const bidId = params.bidId as string;
  const [bidData, setBidData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBidData = async () => {
      try {
        setLoading(true);
        const bids = await buyerFeatureService.negotiation.getBids();
        const bid = bids?.find((b: any) => b.id === bidId);
        setBidData(bid || null);
        setError(bid ? null : 'Bid not found');
      } catch (err: any) {
        setError(err.message || 'Failed to load bid details');
      } finally {
        setLoading(false);
      }
    };

    fetchBidData();
  }, [bidId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
  };

  return (
    <SubfeaturePage
      title="Bid Details"
      description="View and manage your bid information"
      backLink="/buyer/dashboard"
      loading={loading}
      error={error || undefined}
      onRetry={handleRetry}
    >
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        {bidData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Bid ID</p>
                <p className="text-white font-semibold">{bidData.id}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <p className="text-white font-semibold">{bidData.status || 'Active'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Amount</p>
                <p className="text-white font-semibold">₹{bidData.amount || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Created</p>
                <p className="text-white font-semibold">{bidData.createdAt || 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No bid data available</p>
        )}
      </div>
    </SubfeaturePage>
  );
}
