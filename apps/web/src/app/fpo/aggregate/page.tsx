'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import fpoService from '@/services/fpo';
import { Package, ArrowRight } from 'lucide-react';

export default function AggregatePage() {
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aggregating, setAggregating] = useState(false);

  useEffect(() => {
    loadAggregatableCrops();
  }, []);

  const loadAggregatableCrops = async () => {
    try {
      const data = await fpoService.getAggregatableCrops();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAggregate = async (group: any) => {
    if (!confirm(`Aggregate ${group.crops.length} crops of ${group.cropName}?`)) return;

    try {
      setAggregating(true);
      const cropIds = group.crops.map((c: any) => c.id);
      await fpoService.aggregateCrops({
        cropName: group.cropName,
        variety: group.crops[0].variety,
        grade: group.grade,
        cropIds
      });
      alert('Crops aggregated successfully!');
      loadAggregatableCrops();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to aggregate crops');
    } finally {
      setAggregating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Crop Aggregation</h1>
        <p className="text-gray-600 mt-1">Combine similar crops for bulk listing</p>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Aggregatable Crops</h3>
          <p className="text-gray-600">
            You need at least 2 crops of the same type, grade, and location to aggregate.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group, index) => {
            const totalQuantity = group.crops.reduce((sum: number, c: any) => sum + c.quantity, 0);
            const avgPrice = group.crops.reduce((sum: number, c: any) => sum + (c.pricePerKg * c.quantity), 0) / totalQuantity;

            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{group.cropName}</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Grade {group.grade}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {group.district}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Crops</p>
                        <p className="text-lg font-semibold">{group.crops.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Quantity</p>
                        <p className="text-lg font-semibold">{totalQuantity.toFixed(2)} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg Price</p>
                        <p className="text-lg font-semibold">₹{avgPrice.toFixed(2)}/kg</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Individual Crops:</p>
                      <div className="space-y-2">
                        {group.crops.map((crop: any) => (
                          <div key={crop.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                            <span className="text-gray-700">{crop.fpoFarmer?.name}</span>
                            <span className="text-gray-600">{crop.quantity} kg @ ₹{crop.pricePerKg}/kg</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAggregate(group)}
                    disabled={aggregating}
                    className="ml-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    Aggregate
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
