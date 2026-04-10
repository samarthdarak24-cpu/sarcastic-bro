'use client';

import { useState } from 'react';
import { useLogisticsList } from '@/hooks/useLogistics';
import { logisticsService, AssignDriverData } from '@/services/logistics';
import { Truck, User, Phone, MapPin, Calendar, CheckCircle, Clock, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogisticsCard } from '@/components/logistics/LogisticsCard';
import { toast } from 'react-hot-toast';

const statusColors: Record<string, string> = {
  REQUESTED: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  ASSIGNED: 'bg-blue-100 text-blue-800 border-blue-300',
  PICKED_UP: 'bg-purple-100 text-purple-800 border-purple-300',
  IN_TRANSIT: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800 border-orange-300',
  DELIVERED: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
};

export default function FPOLogisticsPage() {
  const { logisticsList, loading, error, refresh } = useLogisticsList('fpo');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLogistics, setSelectedLogistics] = useState<any>(null);
  const [assignForm, setAssignForm] = useState<AssignDriverData>({
    logisticsId: '',
    driverName: '',
    driverPhone: '',
    vehicleNumber: '',
    estimatedDelivery: '',
    notes: '',
  });
  const [assignLoading, setAssignLoading] = useState(false);

  const handleAssignDriver = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setAssignLoading(true);
      await logisticsService.assignDriver(assignForm);
      toast.success('Driver assigned successfully!');
      setShowAssignModal(false);
      setAssignForm({
        logisticsId: '',
        driverName: '',
        driverPhone: '',
        vehicleNumber: '',
        estimatedDelivery: '',
        notes: '',
      });
      refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign driver');
    } finally {
      setAssignLoading(false);
    }
  };

  const openAssignModal = (logistics: any) => {
    setSelectedLogistics(logistics);
    setAssignForm({
      ...assignForm,
      logisticsId: logistics.id,
    });
    setShowAssignModal(true);
  };

  const filteredLogistics = filterStatus
    ? logisticsList.filter((l: any) => l.status === filterStatus)
    : logisticsList;

  const stats = {
    total: logisticsList.length,
    requested: logisticsList.filter((l: any) => l.status === 'REQUESTED').length,
    assigned: logisticsList.filter((l: any) => l.status === 'ASSIGNED').length,
    inTransit: logisticsList.filter((l: any) => 
      ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes((l as any).status)
    ).length,
    delivered: logisticsList.filter((l: any) => l.status === 'DELIVERED').length,
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Truck className="w-6 h-6" />
            </div>
            Logistics Management
          </h1>
          <p className="text-gray-600 mt-1">Manage drivers, vehicles, and deliveries</p>
        </div>

        <Button
          onClick={() => refresh()}
          variant="outline"
          className="gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Requested</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.requested}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.inTransit}</p>
              </div>
              <MapPin className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Filter by status:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant={filterStatus === '' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('')}
                className="text-xs"
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'REQUESTED' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('REQUESTED')}
                className="text-xs"
              >
                Requested ({stats.requested})
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'ASSIGNED' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('ASSIGNED')}
                className="text-xs"
              >
                Assigned ({stats.assigned})
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'DELIVERED' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('DELIVERED')}
                className="text-xs"
              >
                Delivered ({stats.delivered})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logistics List */}
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
      ) : filteredLogistics.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No logistics found</h3>
            <p className="text-sm text-gray-500 mt-2">
              {filterStatus ? 'Try changing the filter' : 'Logistics requests will appear here'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLogistics.map((logistics: any) => (
            <div key={logistics.id} className="glass-card p-6 hover:shadow-xl transition-all">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Order #{logistics.orderId.slice(-6)}
                      </h3>
                      {logistics.order?.crop?.cropName && (
                        <p className="text-sm text-gray-600">
                          {logistics.order.crop.cropName} • {logistics.order.quantity} kg
                        </p>
                      )}
                    </div>
                    <Badge className={statusColors[logistics.status]}>
                      {logistics.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="font-medium text-gray-900">{logistics.pickupLocation || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">To</p>
                        <p className="font-medium text-gray-900">{logistics.dropLocation || 'N/A'}</p>
                      </div>
                    </div>
                    {logistics.driverName && (
                      <>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Driver</p>
                            <p className="font-medium text-gray-900">{logistics.driverName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{logistics.driverPhone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Vehicle</p>
                            <p className="font-medium text-gray-900">{logistics.vehicleNumber}</p>
                          </div>
                        </div>
                      </>
                    )}
                    {logistics.estimatedDelivery && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">ETA</p>
                          <p className="font-medium text-gray-900">
                            {new Date(logistics.estimatedDelivery).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  {logistics.status === 'REQUESTED' && (
                    <Button
                      onClick={() => openAssignModal(logistics)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Assign Driver
                    </Button>
                  )}
                  {logistics.driverName && (
                    <a
                      href={`tel:${logistics.driverPhone}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      Call Driver
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Driver Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Assign Driver</h2>

            <form onSubmit={handleAssignDriver} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver Name *
                </label>
                <input
                  type="text"
                  required
                  value={assignForm.driverName}
                  onChange={(e) => setAssignForm({ ...assignForm, driverName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Ramesh Patil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={assignForm.driverPhone}
                  onChange={(e) => setAssignForm({ ...assignForm, driverPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  required
                  value={assignForm.vehicleNumber}
                  onChange={(e) => setAssignForm({ ...assignForm, vehicleNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., MH12AB1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Delivery *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={assignForm.estimatedDelivery}
                  onChange={(e) => setAssignForm({ ...assignForm, estimatedDelivery: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={assignForm.notes}
                  onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Special instructions..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={assignLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {assignLoading ? 'Assigning...' : 'Assign Driver'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
