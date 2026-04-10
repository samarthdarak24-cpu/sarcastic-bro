'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLogistics } from '@/hooks/useLogistics';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Truck, 
  Package, 
  MapPin, 
  History,
  AlertCircle,
  Clock,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import LogisticsTracker from '@/components/logistics/LogisticsTracker';

export default function FarmerLogisticsDetailPage() {
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
        <div className="p-4 bg-emerald-50 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t('common.error')}</h2>
        <p className="text-slate-500 mt-2 max-w-md">{error || t('logistics.not_found', 'Wait for FPO to start tracking.')}</p>
        <Button className="mt-8 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold" onClick={() => router.back()}>
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
            className="rounded-full w-12 h-12 border-slate-200 hover:bg-emerald-50 shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('logistics.harvest_tracking', 'Harvest Tracking')}</h1>
            <p className="text-slate-500 font-medium">Monitoring transit to buyer destination.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <LogisticsTracker logistics={logistics!} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-none shadow-md bg-white rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-black text-slate-900">Batch Details</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Crop</span>
                  <span className="text-slate-900 font-bold">{logistics?.order?.lot?.cropName || logistics?.order?.crop?.cropName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Weight</span>
                  <span className="text-emerald-600 font-black">{logistics?.order?.quantity} kg</span>
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-md bg-white rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-black text-slate-900">Handling FPO</h3>
              </div>
              <p className="text-sm font-bold text-slate-700">{logistics?.fpo?.name}</p>
              <p className="text-xs text-slate-500 mt-1">{logistics?.fpo?.district}, {logistics?.fpo?.state}</p>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-300" />
                Payment Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">1</div>
                   <div>
                     <p className="font-black text-white text-sm">Pickup Confirmed</p>
                     <p className="text-[10px] text-emerald-100 font-medium">FPO has taken possession.</p>
                     <div className="mt-2 text-[10px] bg-white/10 px-2 py-1 rounded inline-block">COMPLETE</div>
                   </div>
                </div>

                <div className="flex gap-4">
                   <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${logistics?.status === 'DELIVERED' ? 'bg-white/20' : 'bg-white/10 opacity-50'}`}>2</div>
                   <div>
                     <p className={`font-black text-sm ${logistics?.status === 'DELIVERED' ? 'text-white' : 'text-emerald-100 opacity-50'}`}>Delivery & Acceptance</p>
                     <p className="text-[10px] text-emerald-100 font-medium opacity-50">Buyer confirms quality at doorstep.</p>
                     {logistics?.status === 'DELIVERED' && <div className="mt-2 text-[10px] bg-white/10 px-2 py-1 rounded inline-block">COMPLETE</div>}
                   </div>
                </div>

                <div className="flex gap-4">
                   <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 opacity-50 flex items-center justify-center font-black text-xs">3</div>
                   <div>
                     <p className="font-black text-sm text-emerald-100 opacity-50">Escrow Payout</p>
                     <p className="text-[10px] text-emerald-100 font-medium opacity-50">Funds released to your wallet.</p>
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                 <p className="text-[10px] font-black text-emerald-100/60 uppercase tracking-widest text-center">
                   Tracking protects your earnings.
                 </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
             <div className="flex gap-4">
               <div className="p-2 bg-slate-200 rounded-xl h-fit">
                 <History className="w-5 h-5 text-slate-600" />
               </div>
               <div>
                  <h4 className="font-black text-slate-900">Activity Log</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    View every stop your harvest makes on its journey to the marketplace.
                  </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
