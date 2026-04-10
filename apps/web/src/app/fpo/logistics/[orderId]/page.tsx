'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLogistics } from '@/hooks/useLogistics';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Truck, 
  MapPin, 
  History,
  AlertCircle,
  PlusCircle,
  Edit,
  Save,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import LogisticsTracker from '@/components/logistics/LogisticsTracker';
import { toast } from 'react-hot-toast';

export default function LogisticsDetailPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { logistics, loading, error, fetchLogisticsByOrderId, updateLogisticsStatus } = useLogistics();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    currentLocation: '',
    description: '',
    notes: ''
  });

  useEffect(() => {
    if (orderId) {
      fetchLogisticsByOrderId(orderId as string).then(data => {
        if (data) {
          setUpdateData({
            status: data.status,
            currentLocation: data.currentLocation || '',
            description: '',
            notes: data.notes || ''
          });
        }
      });
    }
  }, [orderId, fetchLogisticsByOrderId]);

  const handleUpdate = async () => {
    if (!logistics) return;
    try {
      setIsUpdating(true);
      await updateLogisticsStatus(logistics.id, updateData);
      setUpdateData(prev => ({ ...prev, description: '' })); // Clear activity description
    } catch (err) {
      // Error handled by hook
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading && !logistics) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
        <SkeletonLoader className="h-10 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2"><SkeletonLoader className="h-[600px] w-full rounded-2xl" /></div>
          <div><SkeletonLoader className="h-[400px] w-full rounded-2xl" /></div>
        </div>
      </div>
    );
  }

  if (error || (!loading && !logistics)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="p-4 bg-red-50 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('common.error')}</h2>
        <p className="text-slate-500 mt-2 max-w-md">{error || t('logistics.not_found', 'No logistics information found for this order.')}</p>
        <Button className="mt-8 px-8" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.go_back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm border border-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('logistics.track_order')}</h1>
          <p className="text-sm text-slate-500">Order ID: #{orderId?.toString().substring(0, 12)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tracker View */}
        <div className="lg:col-span-2 space-y-8">
          <LogisticsTracker logistics={logistics!} />
          
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-50">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                <CardTitle>{t('logistics.order_info', 'Standard Information')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('common.buyer')}</label>
                    <p className="text-slate-900 font-semibold text-lg">{logistics?.order?.buyer?.name}</p>
                    <p className="text-slate-500 text-sm">{logistics?.order?.buyer?.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('logistics.delivery_address')}</label>
                    <p className="text-slate-600 text-sm italic">{logistics?.order?.deliveryAddress}</p>
                  </div>
                </div>
                <div className="space-y-4">
                   <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('common.product')}</label>
                    <p className="text-slate-900 font-semibold">{logistics?.order?.lot?.cropName || logistics?.order?.crop?.cropName}</p>
                    <p className="text-emerald-600 font-bold text-lg">{logistics?.order?.quantity} kg</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('common.status')}</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-slate-900 font-bold">{t(`logistics.status.${logistics?.status.toLowerCase()}`)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Update Panel (FPO ONLY) */}
        <div className="space-y-8">
          <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-400" />
                {t('logistics.update_status', 'Post Movement')}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t('logistics.update_desc', 'Log a new location or status update for this shipment.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('common.status')}</label>
                <Select 
                  value={updateData.status} 
                  onValueChange={(val) => setUpdateData(prev => ({ ...prev, status: val }))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-12">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="PENDING">Pending Pickup</SelectItem>
                    <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                    <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                    <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('logistics.current_location')}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input 
                    placeholder="e.g. Pune Highway, Indica Hub" 
                    className="bg-slate-800 border-slate-700 text-white pl-10 h-12 focus:border-emerald-500"
                    value={updateData.currentLocation}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, currentLocation: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('logistics.activity_description', 'Activity Description')}</label>
                <Textarea 
                  placeholder="e.g. Vehicle reached bypass, cooling check ok..." 
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px] focus:border-emerald-500"
                  value={updateData.description}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Button 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold h-12 shadow-lg shadow-emerald-500/20"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900"></div> : <Save className="w-5 h-5 mr-2" />}
                {t('common.save_update', 'Post Update')}
              </Button>
            </CardContent>
          </Card>
          
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-900">{t('logistics.pro_tip', 'Pro Tip')}</p>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  Keeping tracking information updated build trust with buyers and ensures faster escrow releases on delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
