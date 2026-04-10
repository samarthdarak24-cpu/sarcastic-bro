'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import farmerService from '@/services/farmer';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Crop {
  id: string;
  cropName: string;
  category: string;
  variety: string;
  quantity: number;
  pricePerKg: number;
  grade: string;
  status: string;
  qualityCertUrl?: string;
  createdAt: string;
}

export default function FarmerCrops() {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadCrops();
  }, [filter]);

  const loadCrops = async () => {
    try {
      setLoading(true);
      const data = await farmerService.getCrops({ status: filter || undefined });
      setCrops(data.crops);
    } catch (error) {
      console.error('Failed to fetch crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cropId: string) => {
    if (!confirm('Are you sure you want to delete this crop?')) return;
    
    try {
      await farmerService.deleteCrop(cropId);
      alert('Crop deleted successfully!');
      loadCrops();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete crop');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LISTED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SOLD': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeBadge = (grade: string) => {
    const colors: any = {
      'A': 'bg-green-500',
      'B': 'bg-yellow-500',
      'C': 'bg-orange-500'
    };
    return colors[grade] || 'bg-gray-500';
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Crops</h1>
        <button
          onClick={() => router.push('/farmer/crops/add')}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Add New Crop
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-lg ${
              filter === '' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {['LISTED', 'SOLD', 'PENDING'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg ${
                filter === status ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Crops Grid */}
      {crops.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No crops listed yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first crop listing</p>
          <button
            onClick={() => router.push('/farmer/crops/add')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Your First Crop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <div key={crop.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{crop.cropName}</h3>
                  <p className="text-sm text-gray-600">{crop.variety}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(crop.status)}`}>
                  {crop.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{crop.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Grade</span>
                  <span className="font-medium">Grade {crop.grade}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{crop.quantity} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium text-green-600">₹{crop.pricePerKg}/kg</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                {crop.qualityCertUrl && (
                  <a
                    href={crop.qualityCertUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4" />
                    Certificate
                  </a>
                )}
                {crop.status === 'LISTED' && (
                  <button
                    onClick={() => handleDelete(crop.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
