'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Loader2, Package, MapPin, Clock, TruckIcon, Edit } from 'lucide-react';

interface Order {
  id: string;
  quantity: number;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  trackingNumber?: string;
  createdAt: string;
  buyer: {
    name: string;
    phone: string;
  };
  lot?: {
    cropName: string;
  };
}

export default function FPOOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/fpo/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">FPO Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {order.lot?.cropName || 'Product'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Buyer: {order.buyer.name} ({order.buyer.phone})
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {order.quantity} kg
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    ₹{order.totalAmount.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{order.deliveryAddress}</span>
                  </div>

                  {order.trackingNumber && (
                    <p className="text-xs text-gray-500 mt-2">
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/fpo/orders/${order.id}/update-tracking`);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Update Tracking
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/fpo/orders/${order.id}`);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
