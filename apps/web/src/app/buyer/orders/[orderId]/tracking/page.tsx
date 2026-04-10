'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Package, MapPin, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TrackingEvent {
  id: string;
  status: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  photos: string[];
  updatedBy: string;
  updatedByRole: string;
  timestamp: string;
}

interface Order {
  id: string;
  quantity: number;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  confirmedByBuyer: boolean;
  trackingEvents: TrackingEvent[];
}

export default function OrderTrackingPage() {
  const params = useParams();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);

  useEffect(() => {
    loadOrderTracking();
  }, [params.orderId]);

  const loadOrderTracking = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(response.data.order);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tracking');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async () => {
    try {
      setConfirmingDelivery(true);
      const token = localStorage.getItem('token');
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.orderId}/confirm-delivery`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await loadOrderTracking();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to confirm delivery');
    } finally {
      setConfirmingDelivery(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'PICKED_UP':
        return <Package className="w-6 h-6 text-yellow-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error || 'Order not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('orderTracking')}</h1>
        {order.trackingNumber && (
          <span className="text-sm text-gray-600">
            Tracking: <span className="font-mono font-semibold">{order.trackingNumber}</span>
          </span>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t('orderDetails')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">{t('quantity')}</p>
            <p className="font-semibold">{order.quantity} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('totalAmount')}</p>
            <p className="font-semibold">₹{order.totalAmount.toLocaleString()}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">{t('deliveryAddress')}</p>
            <p className="font-semibold">{order.deliveryAddress}</p>
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">{t('trackingTimeline')}</h2>
        
        {order.trackingEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p>{t('noTrackingUpdates')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {order.trackingEvents.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getStatusIcon(event.status)}
                  </div>
                  {index < order.trackingEvents.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-300 my-2"></div>
                  )}
                </div>
                
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {event.status.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      {event.location && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.photos && event.photos.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {event.photos.map((photo, i) => (
                            <img
                              key={i}
                              src={photo}
                              alt="Tracking photo"
                              className="w-20 h-20 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{new Date(event.timestamp).toLocaleDateString()}</p>
                      <p>{new Date(event.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delivery Button */}
      {order.status === 'IN_TRANSIT' && !order.confirmedByBuyer && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">{t('confirmDelivery')}</h3>
          <p className="text-sm text-yellow-800 mb-4">
            {t('confirmDeliveryDescription')}
          </p>
          <button
            onClick={confirmDelivery}
            disabled={confirmingDelivery}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {confirmingDelivery ? t('confirming') : t('confirmDeliveryButton')}
          </button>
        </div>
      )}

      {order.confirmedByBuyer && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800">{t('deliveryConfirmed')}</p>
        </div>
      )}
    </div>
  );
}
