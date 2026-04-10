'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import fpoService, { AggregatedLot } from '@/services/fpo';
import { Package } from 'lucide-react';

export default function ListingsPage() {
  const router = useRouter();
  const [lots, setLots] = useState<AggregatedLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('LISTED');

  useEffect(() => {
    loadLots();
  }, [filter]);

  const loadLots = async () => {
    try {
      setLoading(true);
      const data = await fpoService.getAggregatedLots({ status: filter });
      setLots(data.lots);
    } catch (error) {
      console.error('Failed to load lots:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LISTED': return 'bg-green-100 text-green-800';
      case 'SOLD': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Bulk Listings</h1>
        <button
          onClick={() => router.push('/fpo/aggregate')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Create New Lot
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2">
          {['LISTED', 'SOLD', 'PENDING'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : lots.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Listings Found</h3>
          <p className="text-gray-600">Create aggregated lots to start bulk listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lots.map((lot) => (
            <div key={lot.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{lot.cropName}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lot.status)}`}>
                  {lot.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Quantity</span>
                  <span className="text-sm font-medium">{lot.totalQuantity} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price per kg</span>
                  <span className="text-sm font-medium">₹{lot.pricePerKg}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Value</span>
                  <span className="text-sm font-medium text-green-600">
                    ₹{(lot.totalQuantity * lot.pricePerKg).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Farmers</span>
                  <span className="text-sm font-medium">{lot.crops?.length || 0}</span>
                </div>
              </div>

              {lot.qualityCertUrl && (
                <a
                  href={lot.qualityCertUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Quality Certificate
                </a>
              )}

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Created {new Date(lot.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
