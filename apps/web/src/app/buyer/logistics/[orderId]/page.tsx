'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLogistics } from '@/hooks/useLogistics';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Truck, 
  MapPin, 
  History,
  AlertCircle,
  Package,
  Calendar,
  Phone,
  MessageCircle,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import LogisticsTracker from '@/components/logistics/LogisticsTracker';

export default function BuyerLogisticsDetailPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { logistics, loading, error, fetchLogisticsByOrderId } = useLogistics();

  useEffect(() => {
    if (orderId) {
      fetchLogisticsByOrderId(orderId as string);
    }
  }, [orderId, fetchLogisticsByOrderId]);

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
        <div className="p-4 bg-rose-50 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('common.error')}</h2>
        <p className="text-slate-500 mt-2 max-w-md">{error || t('logistics.not_found')}</p>
        <Button className="mt-8 px-8" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.go_back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-5">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.back()} 
            className="rounded-full w-12 h-12 border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('logistics.tracking_order', 'Real-time Tracking')}</h1>
            <p className="text-slate-500 font-medium">#{orderId?.toString().substring(0, 15)}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="rounded-full border-slate-200"
            onClick={() => router.push(`/buyer/chat/${logistics?.fpo?.adminUserId}`)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact FPO
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <LogisticsTracker logistics={logistics!} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-none shadow-md bg-white rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-black text-slate-900">Shipment Content</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Product</span>
                  <span className="text-slate-900 font-bold">{logistics?.order?.lot?.cropName || logistics?.order?.crop?.cropName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Quantity</span>
                  <span className="text-blue-600 font-black">{logistics?.order?.quantity} kg</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Order Date</span>
                  <span className="text-slate-900 font-bold">{logistics?.order?.createdAt ? new Date(logistics.order.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-md bg-white rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-black text-slate-900">Destination</h3>
              </div>
              <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed italic">
                {logistics?.order?.deliveryAddress}
              </p>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-400" />
                Fulfilling FPO
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-2">
                <p className="text-3xl font-black text-white">{logistics?.fpo?.name}</p>
                <p className="text-blue-400 font-bold text-xs uppercase tracking-widest">{logistics?.fpo?.district}, {logistics?.fpo?.state}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-700">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                    <History className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Carrier</p>
                    <p className="text-sm font-bold">{logistics?.carrier || 'Not yet assigned'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                    <Truck className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tracking Number</p>
                    <p className="text-sm font-bold font-mono">{logistics?.trackingNumber || '---'}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-black text-white shadow-lg shadow-blue-900/40">
                Raise Support Ticket
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none bg-blue-50/50 rounded-3xl p-6 border-l-4 border-blue-400">
             <div className="flex gap-4">
               <div className="p-2 bg-blue-100 rounded-xl h-fit">
                 <Calendar className="w-5 h-5 text-blue-600" />
               </div>
               <div>
                  <h4 className="font-black text-slate-900">Need scheduling help?</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    If the estimated delivery date doesn't work for you, please contact the FPO admin directly via the chat bridge.
                  </p>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
