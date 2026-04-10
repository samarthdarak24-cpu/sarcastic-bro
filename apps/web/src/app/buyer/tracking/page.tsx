'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogisticsList } from '@/hooks/useLogistics';
import { logisticsService } from '@/services/logistics';
import { Truck, MapPin, Phone, Package, CheckCircle, Clock, Navigation, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogisticsCard } from '@/components/logistics/LogisticsCard';
import { StatusTimeline } from '@/components/logistics/StatusTimeline';
import { TrackingMap } from '@/components/logistics/TrackingMap';
import { toast } from 'react-hot-toast';

export default function BuyerTrackingPage() {
  const router = useRouter();
  const { logisticsList, loading, error, refresh } = useLogisticsList('buyer');
  const [selectedLogistics, setSelectedLogistics] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Auto-refresh every 15 seconds for live tracking
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedLogistics && showDetail) {
        refresh();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [selectedLogistics, showDetail, refresh]);

  const handleViewDetails = (logistics: any) => {
    setSelectedLogistics(logistics);
    setShowDetail(true);
  };

  const handleConfirmDelivery = async () => {
    if (!selectedLogistics) return;

    try {
      setConfirming(true);
      await logisticsService.markDelivered(selectedLogistics.id, {
        deliveryNotes: 'Delivery confirmed by buyer',
      });
      toast.success('Delivery confirmed! Escrow has been released.');
      refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to confirm delivery');
    } finally {
      setConfirming(false);
    }
  };

  if (showDetail && selectedLogistics) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => {
            setShowDetail(false);
            setSelectedLogistics(null);
          }}
          className="mb-6"
        >
          ← Back to All Shipments
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Navigation className="w-6 h-6 text-blue-600" />
                  Live Tracking
                </h2>
                <TrackingMap
                  lat={selectedLogistics.currentLat || selectedLogistics.pickupLat || 20.5937}
                  lng={selectedLogistics.currentLng || selectedLogistics.pickupLng || 78.9629}
                  driverName={selectedLogistics.driverName}
                  vehicleNumber={selectedLogistics.vehicleNumber}
                  status={selectedLogistics.status}
                  pickupLocation={selectedLogistics.pickupLocation}
                  dropLocation={selectedLogistics.dropLocation}
                  pickupLat={selectedLogistics.pickupLat}
                  pickupLng={selectedLogistics.pickupLng}
                  dropLat={selectedLogistics.dropLat}
                  dropLng={selectedLogistics.dropLng}
                />
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Delivery Progress</h3>
                <StatusTimeline
                  currentStatus={selectedLogistics.status}
                  events={selectedLogistics.events || []}
                />
              </CardContent>
            </Card>
          </div>

          {/* Details Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-mono font-bold text-gray-900">
                      #{selectedLogistics.orderId.slice(-8)}
                    </p>
                  </div>
                  {selectedLogistics.order?.crop?.cropName && (
                    <div>
                      <p className="text-sm text-gray-600">Product</p>
                      <p className="font-semibold text-gray-900">
                        {selectedLogistics.order.crop.cropName}
                      </p>
                    </div>
                  )}
                  {selectedLogistics.order?.quantity && (
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold text-gray-900">
                        {selectedLogistics.order.quantity} kg
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className="mt-1">
                      {selectedLogistics.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Info */}
            {selectedLogistics.driverName && (
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Driver Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-gray-900">{selectedLogistics.driverName}</p>
                    </div>
                    {selectedLogistics.vehicleNumber && (
                      <div>
                        <p className="text-sm text-gray-600">Vehicle</p>
                        <p className="font-semibold text-gray-900">
                          {selectedLogistics.vehicleNumber}
                        </p>
                      </div>
                    )}
                    {selectedLogistics.driverPhone && (
                      <a
                        href={`tel:${selectedLogistics.driverPhone}`}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
                      >
                        <Phone className="w-4 h-4" />
                        Call Driver
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Route Info */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Route Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Pickup Location</p>
                      <p className="font-medium text-gray-900">
                        {selectedLogistics.pickupLocation || 'Farm'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Delivery Location</p>
                      <p className="font-medium text-gray-900">
                        {selectedLogistics.dropLocation || 'Your Location'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ETA */}
            {selectedLogistics.estimatedDelivery && selectedLogistics.status !== 'DELIVERED' && (
              <Card className="glass-card bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Estimated Delivery</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {new Date(selectedLogistics.estimatedDelivery).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Confirm Delivery Button */}
            {['IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(selectedLogistics.status) && (
              <Card className="glass-card bg-green-50 border-green-200">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-green-700 font-medium">Received your order?</p>
                      <p className="text-lg font-bold text-green-900">Confirm Delivery</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleConfirmDelivery}
                    disabled={confirming}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {confirming ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Confirming...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Confirm Delivery & Release Payment</span>
                      </div>
                    )}
                  </Button>
                  <p className="text-xs text-green-700 text-center">
                    This will release the escrow payment to the seller
                  </p>
                </CardContent>
              </Card>
            )}

            {selectedLogistics.status === 'DELIVERED' && (
              <Card className="glass-card bg-green-100 border-green-300">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-green-900">Delivery Completed</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Payment has been released to seller
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <Truck className="w-6 h-6" />
          </div>
          Track Your Orders
        </h1>
        <p className="text-gray-600 mt-1">Monitor real-time delivery status of your purchases</p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <Button onClick={() => refresh()} className="mt-4" variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : logisticsList.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No active deliveries</h3>
            <p className="text-sm text-gray-500 mt-2">
              Your ordered items with tracking will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {logisticsList.map((logistics: any) => (
            <LogisticsCard
              key={logistics.id}
              id={logistics.id}
              orderId={logistics.orderId}
              status={logistics.status}
              driverName={logistics.driverName}
              driverPhone={logistics.driverPhone}
              vehicleNumber={logistics.vehicleNumber}
              pickupLocation={logistics.pickupLocation}
              dropLocation={logistics.dropLocation}
              estimatedDelivery={logistics.estimatedDelivery}
              cropName={logistics.order?.crop?.cropName}
              quantity={logistics.order?.quantity}
              onClick={() => handleViewDetails(logistics)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
