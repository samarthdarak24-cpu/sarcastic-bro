'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import buyerAPI, { Order } from '@/services/buyer';
import DeliveryConfirmationModal from '@/components/buyer/DeliveryConfirmationModal';
import { Loader2, Package, MapPin, Clock, CheckCircle, XCircle, TruckIcon, AlertCircle } from 'lucide-react';

export default function BuyerOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await buyerAPI.getOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = (order: Order) => {
    setSelectedOrder(order);
    setShowConfirmModal(true);
  };

  const handleConfirmSuccess = () => {
    setShowConfirmModal(false);
    setSelectedOrder(null);
    fetchOrders(); // Refresh orders list
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
          <p className="text-gray-500 mt-2">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {(order.crop?.images?.[0] || order.lot) && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {order.crop?.images?.[0] ? (
                        <img
                          src={order.crop.images[0]}
                          alt={order.crop.cropName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {order.crop?.cropName || order.lot?.cropName || 'Product'}
                    </h3>
                    {order.crop?.variety && (
                      <p className="text-sm text-gray-600">{order.crop.variety}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
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
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.replace('_', ' ')}
                  </div>

                  {order.escrowTransaction && (
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      order.escrowTransaction.status === 'HELD' ? 'bg-yellow-100 text-yellow-800' :
                      order.escrowTransaction.status === 'RELEASED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Escrow: {order.escrowTransaction.status}
                    </div>
                  )}

                  {order.status === 'DELIVERED' && !order.confirmedByBuyer && (
                    <span className="text-xs text-orange-600 font-medium">
                      Awaiting confirmation
                    </span>
                  )}

                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3 flex-wrap">
                {(order.status === 'IN_TRANSIT' || order.status === 'CONFIRMED') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/buyer/tracking?orderId=${order.id}`);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <TruckIcon className="w-4 h-4" />
                    Track Order
                  </button>
                )}
                
                {order.status === 'DELIVERED' && !order.confirmedByBuyer && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmDelivery(order);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Confirm Delivery
                  </button>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/buyer/orders/${order.id}`);
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

      {/* Delivery Confirmation Modal */}
      {showConfirmModal && selectedOrder && (
        <DeliveryConfirmationModal
          orderId={selectedOrder.id}
          orderDetails={{
            productName: selectedOrder.crop?.cropName || selectedOrder.lot?.cropName || 'Product',
            quantity: selectedOrder.quantity,
            totalAmount: selectedOrder.totalAmount,
          }}
          onClose={() => {
            setShowConfirmModal(false);
            setSelectedOrder(null);
          }}
          onSuccess={handleConfirmSuccess}
        />
      )}
    </div>
  );
}
