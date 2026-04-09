'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle, Clock, Truck, Package } from 'lucide-react';

interface TraceEvent {
  event: string;
  timestamp: Date;
  location: { lat: number; lng: number };
  txHash: string;
  verified: boolean;
}

export const BlockchainTraceViewer: React.FC<{ productId: string }> = ({
  productId,
}) => {
  const [trace, setTrace] = useState<TraceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<any>(null);

  useEffect(() => {
    fetchSupplyChainTrace();
  }, [productId]);

  const fetchSupplyChainTrace = async () => {
    try {
      const response = await fetch(
        `/api/blockchain/trace/${productId}`
      );
      const data = await response.json();
      setTrace(data.events || []);
      setVerification(data.verification);
    } catch (error) {
      console.error('Error fetching trace:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'HARVEST':
        return <Package className="w-5 h-5" />;
      case 'STORAGE':
        return <Clock className="w-5 h-5" />;
      case 'TRANSPORT':
        return <Truck className="w-5 h-5" />;
      case 'DELIVERY':
        return <MapPin className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return <div className="p-4">Loading supply chain trace...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Supply Chain Trace</h2>

      {verification && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">
              Product Verified
            </span>
          </div>
          <p className="text-sm text-green-700">
            Authenticity Score: {verification.verificationScore}%
          </p>
        </div>
      )}

      <div className="space-y-4">
        {trace.map((event, index) => (
          <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                {getEventIcon(event.event)}
              </div>
              {index < trace.length - 1 && (
                <div className="w-0.5 h-12 bg-blue-200 my-2" />
              )}
            </div>

            <div className="flex-1 pt-1">
              <h3 className="font-semibold text-gray-900">{event.event}</h3>
              <p className="text-sm text-gray-600">
                {new Date(event.timestamp).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Location: {event.location.lat.toFixed(4)},
                {event.location.lng.toFixed(4)}
              </p>
              <p className="text-xs text-blue-600 font-mono mt-1">
                TX: {event.txHash.slice(0, 10)}...
              </p>
            </div>

            {event.verified && (
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
