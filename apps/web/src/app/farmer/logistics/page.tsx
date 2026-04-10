'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogisticsList } from '@/hooks/useLogistics';
import { logisticsService } from '@/services/logistics';
import { useTranslation } from 'react-i18next';
import { 
  Truck, 
  Package, 
  MapPin, 
  Plus,
  Box,
  LayoutDashboard,
  Phone,
  User,
  Clock,
  Navigation
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LogisticsCard } from '@/components/logistics/LogisticsCard';
import { StatusTimeline } from '@/components/logistics/StatusTimeline';
import { format } from 'date-fns';
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

export default function FarmerLogisticsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logisticsList, loading, error, refresh } = useLogisticsList('farmer');
  const [view, setView] = useState<'tracking' | 'request'>('tracking');
  const [selectedLogistics, setSelectedLogistics] = useState<any>(null);
  
  const [requestLoading, setRequestLoading] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    pickupLocation: '',
    pickupLat: undefined as number | undefined,
    pickupLng: undefined as number | undefined,
    dropLocation: '',
    dropLat: undefined as number | undefined,
    dropLng: undefined as number | undefined,
    notes: ''
  });

  useEffect(() => {
    // Auto-refresh every 30 seconds for live updates
    const interval = setInterval(() => {
      if (view === 'tracking') {
        refresh();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [view, refresh]);

  const handleRequestPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderId) {
      toast.error('Please select an order');
      return;
    }

    try {
      setRequestLoading(true);
      await logisticsService.requestPickup(formData);
      toast.success('Pickup request submitted successfully!');
      setFormData({
        orderId: '',
        pickupLocation: '',
        pickupLat: undefined,
        pickupLng: undefined,
        dropLocation: '',
        dropLat: undefined,
        dropLng: undefined,
        notes: ''
      });
      setView('tracking');
      refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to request pickup');
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-200">
               <Truck className="w-8 h-8" />
             </div>
             {t('logistics.hub_title', 'Agri-Logistics Hub')}
          </h1>
          <p className="text-slate-500 font-medium mt-1">{t('logistics.hub_desc', 'Track your harvests from farm-gate to buyer-door.')}</p>
        </div>

        <div className="flex gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
           <button 
             onClick={() => setView('tracking')}
             className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${view === 'tracking' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             <LayoutDashboard className="w-4 h-4" />
             Active Tracking
           </button>
           <button 
             onClick={() => setView('request')}
             className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${view === 'request' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             <Plus className="w-4 h-4" />
             Request Pickup
           </button>
        </div>
      </div>

      {view === 'tracking' ? (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
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
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 glass-card">
              <Box className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-600">No active shipments</h3>
              <p className="text-sm text-slate-500 mt-2">Schedule your first pickup to get started</p>
              <Button 
                className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setView('request')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Request Pickup
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {logisticsList.map((item: any) => (
                <LogisticsCard
                  key={item.id}
                  id={item.id}
                  orderId={item.orderId}
                  status={item.status}
                  driverName={item.driverName}
                  driverPhone={item.driverPhone}
                  vehicleNumber={item.vehicleNumber}
                  pickupLocation={item.pickupLocation}
                  dropLocation={item.dropLocation}
                  estimatedDelivery={item.estimatedDelivery}
                  cropName={item.order?.crop?.cropName}
                  buyerName={item.order?.buyer?.name}
                  quantity={item.order?.quantity}
                  onClick={() => {
                    setSelectedLogistics(item);
                    router.push(`/farmer/logistics/${item.orderId}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Card className="border-none shadow-2xl bg-white rounded-2xl overflow-hidden max-w-2xl mx-auto glass-card">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Plus className="w-6 h-6 text-emerald-600" />
              </div>
              Request Pickup
            </h2>
            
            <form onSubmit={handleRequestPickup} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Order ID *</label>
                <input 
                  required
                  placeholder="Enter the order ID for pickup"
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all"
                  value={formData.orderId}
                  onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                />
                <p className="text-xs text-slate-500">Only confirmed orders can request pickup</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Pickup Location *</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Complete farm address for vehicle access..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all resize-none"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Drop Location *</label>
                <input 
                  required
                  placeholder="Buyer address or FPO warehouse"
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all"
                  value={formData.dropLocation}
                  onChange={(e) => setFormData({...formData, dropLocation: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Additional Notes</label>
                <textarea 
                  rows={2}
                  placeholder="Any special instructions for the driver..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                disabled={requestLoading}
              >
                {requestLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    <span>Request Pickup</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
