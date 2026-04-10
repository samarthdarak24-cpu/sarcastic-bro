'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { 
  Loader2, Package, MapPin, ArrowLeft, Plus 
} from 'lucide-react';

const TRACKING_STATUSES = [
  { value: 'PLACED', label: 'Order Placed' },
  { value: 'CONFIRMED', label: 'Order Confirmed' },
  { value: 'PACKED', label: 'Packed' },
  { value: 'PICKED_UP', label: 'Picked Up' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
];

export default function FPOOrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { orderDetails, loading, fetchOrderDetails, addTrackingEvent } = useOrderTracking();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    location: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId, fetchOrderDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.status) return;

    setSubmitting(true);
    try {
      await addTrackingEvent(orderId, formData);
      setFormData({ status: '', location: '', description: '' });
      setShowAddForm(false);
      await fetchOrderDetails(orderId);
    } catch (error) {
      console.error('Failed to add tracking event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PLACED: 'bg-gray-100 text-gray-800',
      CONFIRMED: 'bg-yellow-100 text-yellow-800',
      PACKED: 'bg-blue-100 text-blue-800',
      PICKED_UP: 'bg-blue-100 text-blue-800',
      IN_TRANSIT: 'bg-blue-100 text-blue-800',
      OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Order not found</p>
      </div>
    );
  }

  const cropName = orderDetails.lot?.cropName || 'Product';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Orders
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order Management</h1>
            <p className="text-gray-600">Order ID: {orderDetails.id.slice(0, 8)}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
            {orderDetails.status}
          </div>
        </div>

        <div className="space-y-4 mb-6 pb-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{cropName}</h2>
            <p className="text-gray-600 mt-2">Quantity: {orderDetails.quantity} kg</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              ₹{orderDetails.totalAmount.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="font-medium text-gray-900">Buyer</p>
            <p className="text-gray-600">{orderDetails.buyer.name}</p>
            <p className="text-gray-600">{orderDetails.buyer.phone}</p>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Delivery Address</p>
              <p className="text-gray-600">{orderDetails.deliveryAddress}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Tracking Update
        </button>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select status</option>
                  {TRACKING_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Nanded Distribution Center"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Tracking History</h2>

        {orderDetails.trackingEvents.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No tracking updates yet</p>
        ) : (
          <div className="space-y-4">
            {orderDetails.trackingEvents.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-600' : 'bg-gray-300'}`} />
                  {index < orderDetails.trackingEvents.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-300 my-1" />
                  )}
                </div>

                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={`font-medium ${getStatusColor(event.status)} inline-block px-3 py-1 rounded-full text-sm`}>
                        {event.status.replace(/_/g, ' ')}
                      </p>
                      {event.location && (
                        <p className="text-gray-600 text-sm mt-2 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-gray-700 mt-2">{event.description}</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Updated by {event.updatedByRole}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
