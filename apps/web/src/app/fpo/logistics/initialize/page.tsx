'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogistics } from '@/hooks/useLogistics';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';
import { 
  ArrowLeft, 
  Truck, 
  Package, 
  Calendar,
  ClipboardText,
  Save,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';

export default function InitializeLogisticsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { createLogistics, loading } = useLogistics();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const [formData, setFormData] = useState({
    orderId: '',
    carrier: '',
    trackingNumber: '',
    estimatedDelivery: '',
    notes: ''
  });

  useEffect(() => {
    const fetchEligibleOrders = async () => {
      try {
        setFetchingOrders(true);
        // Fetch orders that need fulfillment
        const response = await api.get('/fpo/orders?status=PAID');
        setOrders(response.data.orders || []);
      } catch (err) {
        toast.error('Failed to load eligible orders');
      } finally {
        setFetchingOrders(false);
      }
    };
    fetchEligibleOrders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderId) {
      toast.error('Please select an order');
      return;
    }
    try {
      await createLogistics(formData);
      router.push(`/fpo/logistics/${formData.orderId}`);
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.back()} 
          className="rounded-full w-10 h-10 border-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('logistics.init_shipment', 'Initialize Shipment')}</h1>
          <p className="text-slate-500 font-medium">{t('logistics.init_desc', 'Set up tracking for a newly paid order.')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
             <CardHeader className="bg-slate-50 border-b border-slate-100">
               <CardTitle className="text-lg flex items-center gap-2">
                 <Package className="w-5 h-5 text-emerald-600" />
                 Order Selection
               </CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('common.select_order')}</label>
                  <Select 
                    value={formData.orderId} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, orderId: val }))}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 h-14 rounded-2xl">
                      <SelectValue placeholder={fetchingOrders ? "Loading orders..." : "Select Order ID"} />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map(order => (
                        <SelectItem key={order.id} value={order.id}>
                          Order #{order.id.substring(0, 8)} - {order.lot?.cropName} ({order.quantity}kg)
                        </SelectItem>
                      ))}
                      {orders.length === 0 && !fetchingOrders && (
                        <div className="p-4 text-center text-sm text-slate-400 italic">No paid orders awaiting shipment.</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {formData.orderId && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in zoom-in-95 duration-300">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div className="text-xs text-emerald-800 space-y-1">
                        <p className="font-bold">Shipping Destination:</p>
                        <p>{orders.find(o => o.id === formData.orderId)?.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                )}
             </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
             <CardHeader className="bg-slate-50 border-b border-slate-100">
               <CardTitle className="text-lg flex items-center gap-2">
                 <Truck className="w-5 h-5 text-blue-600" />
                 Carrier Details
               </CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('logistics.carrier_name')}</label>
                  <Input 
                    placeholder="e.g. BlueDart, Delhivery, Local Truck" 
                    className="bg-slate-50 border-slate-200 h-14 rounded-2xl focus:ring-blue-500"
                    value={formData.carrier}
                    onChange={(e) => setFormData(prev => ({ ...prev, carrier: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('logistics.tracking_number')}</label>
                  <Input 
                    placeholder="e.g. TRK-44558833" 
                    className="bg-slate-50 border-slate-200 h-14 rounded-2xl focus:ring-blue-500"
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                  />
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
             <CardHeader className="bg-slate-50 border-b border-slate-100">
               <CardTitle className="text-lg flex items-center gap-2">
                 <Calendar className="w-5 h-5 text-purple-600" />
                 Timeline & Notes
               </CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('logistics.estimated_delivery')}</label>
                  <Input 
                    type="date"
                    className="bg-slate-50 border-slate-200 h-14 rounded-2xl focus:ring-purple-500"
                    value={formData.estimatedDelivery}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('logistics.initial_notes')}</label>
                  <Textarea 
                    placeholder="Any special handling instructions for the buyer..." 
                    className="bg-slate-50 border-slate-200 min-h-[140px] rounded-2xl focus:ring-purple-500"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
             </CardContent>
          </Card>

          <div className="pt-4">
             <Button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-black text-white h-16 rounded-[2rem] font-black text-xl shadow-2xl shadow-slate-300 transition-all active:scale-95 flex items-center justify-center gap-3"
                disabled={loading}
             >
                {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <Save className="w-6 h-6" />}
                {t('logistics.create_shipment', 'Create Tracking Bridge')}
             </Button>
             <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-6">
               Buyers will receive a real-time notification once tracking starts.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}
