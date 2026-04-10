'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Loader2, Package, MapPin, Clock, CheckCircle, XCircle, IndianRupee } from 'lucide-react';

interface Order {
  id: string;
  quantity: number;
  totalAmount: number;
  status: string;
  escrowStatus: string;
  deliveryAddress: string;
  trackingNumber?: string;
  createdAt: string;
  buyer: {
    name: string;
    phone: string;
  };
}

export default function FarmerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/farmer/orders');
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
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'IN_TRANSIT':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
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
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No orders yet</p>
          <p className="text-gray-500 mt-2">Your orders will appear here once buyers place orders</p>
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
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">Buyer:</span>
                      <span>{order.buyer.name} ({order.buyer.phone})</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">Quantity:</span>
                      <span>{order.quantity} kg</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <IndianRupee className="w-4 h-4" />
                      <span className="font-semibold text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {order.escrowStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{order.deliveryAddress}</span>
                    </div>

                    {order.trackingNumber && (
                      <p className="text-xs text-gray-500">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>

                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
