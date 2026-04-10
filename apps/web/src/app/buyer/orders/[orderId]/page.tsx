'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { 
  Loader2, Package, MapPin, Clock, CheckCircle, 
  ArrowLeft, Image as ImageIcon, FileText 
} from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { orderDetails, loading, fetchOrderDetails, confirmDelivery } = useOrderTracking();
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId, fetchOrderDetails]);

  const handleConfirmDelivery = async () => {
    if (!window.confirm('Confirm that you have received the order? Payment will be released to the seller.')) {
      return;
    }

    setConfirmingDelivery(true);
    try {
      await confirmDelivery(orderId, {});
      await fetchOrderDetails(orderId);
    } catch (error) {
      console.error('Failed to confirm delivery:', error);
    } finally {
      setConfirmingDelivery(false);
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

  const cropName = orderDetails.crop?.cropName || orderDetails.lot?.cropName || 'Product';
  const cropImage = orderDetails.crop?.images?.[0];

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
            <h1 className="text-2xl font-bold mb-2">Order Tracking</h1>
            <p className="text-gray-600">Order ID: {orderDetails.id.slice(0, 8)}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
            {orderDetails.status}
          </div>
        </div>

        <div className="flex gap-4 mb-6 pb-6 border-b">
          {cropImage && (
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={cropImage} alt={cropName} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{cropName}</h2>
            {orderDetails.crop?.variety && (
              <p className="text-gray-600">{orderDetails.crop.variety}</p>
            )}
            <p className="text-gray-600 mt-2">Quantity: {orderDetails.quantity} kg</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              ₹{orderDetails.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-900">Delivery Address</p>
              <p className="text-gray-600">{orderDetails.deliveryAddress}</p>
            </div>
          </div>

          {orderDetails.trackingNumber && (
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Tracking Number</p>
                <p className="text-gray-600">{orderDetails.trackingNumber}</p>
              </div>
            </div>
          )}

          {orderDetails.estimatedDelivery && (
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Estimated Delivery</p>
                <p className="text-gray-600">
                  {new Date(orderDetails.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {orderDetails.status === 'DELIVERED' && !orderDetails.confirmedByBuyer && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-orange-800 font-medium mb-3">
              Please confirm that you have received your order
            </p>
            <button
              onClick={handleConfirmDelivery}
              disabled={confirmingDelivery}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {confirmingDelivery ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirm Delivery
                </>
              )}
            </button>
          </div>
        )}

        {orderDetails.confirmedByBuyer && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">Delivery Confirmed</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Confirmed on {new Date(orderDetails.confirmedAt!).toLocaleDateString()}
            </p>
          </div>
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

                  {event.photos.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {event.photos.map((photo, i) => (
                        <img
                          key={i}
                          src={photo}
                          alt={`Tracking photo ${i + 1}`}
                          className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80"
                          onClick={() => window.open(photo, '_blank')}
                        />
                      ))}
                    </div>
                  )}

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
