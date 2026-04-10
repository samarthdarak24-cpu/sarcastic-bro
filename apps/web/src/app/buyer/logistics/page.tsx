'use client';

import { useEffect, useState } from 'react';
import { useActiveLogistics } from '@/hooks/useLogistics';
import { useTranslation } from 'react-i18next';
import { 
  Truck, 
  Package, 
  MapPin, 
  ChevronRight,
  Search,
  Box,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  PICKED_UP: 'bg-sky-100 text-sky-700 border-sky-200',
  IN_TRANSIT: 'bg-blue-100 text-blue-700 border-blue-200',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function BuyerLogisticsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { activeLogistics, loading, fetchActiveLogistics } = useActiveLogistics();

  useEffect(() => {
    fetchActiveLogistics();
  }, [fetchActiveLogistics]);

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <Badge className="bg-blue-600 text-white hover:bg-blue-700 border-none px-3 py-1 uppercase tracking-tighter text-[10px] font-bold">
            Fulfillment Hub
          </Badge>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             {t('logistics.track_purchases', 'Track Purchases')}
          </h1>
          <p className="text-slate-500 font-medium">Real-time visibility into your procurement pipeline.</p>
        </div>
        
        <div className="flex items-center gap-4 p-2 bg-slate-100/50 backdrop-blur-sm rounded-2xl border border-slate-200">
          <div className="px-4 py-2 text-center border-r border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('common.in_transit', 'In Transit')}</p>
            <p className="text-xl font-black text-blue-600 outline-none">{activeLogistics.filter(l => l.status !== 'DELIVERED').length}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('common.delivered_recent', 'Delivered')}</p>
            <p className="text-xl font-black text-emerald-600">{activeLogistics.filter(l => l.status === 'DELIVERED').length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <SkeletonLoader key={i} className="h-64 w-full rounded-3xl" />)}
          </div>
        ) : activeLogistics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-sm border border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Box className="w-12 h-12 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{t('logistics.no_purchases', 'No Active Purchases')}</h3>
            <p className="text-slate-500 mt-2 max-w-sm text-center">
              Order some crops from our marketplace to see tracking details here.
            </p>
            <Button 
               className="mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 font-bold text-lg"
               onClick={() => router.push('/buyer/marketplace')}
            >
              Browse Marketplace
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeLogistics.map((item) => (
              <Card 
                key={item.id} 
                className="group border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white rounded-[2.5rem] overflow-hidden cursor-pointer"
                onClick={() => router.push(`/buyer/logistics/${item.orderId}`)}
              >
                <div className={`h-3 ${statusColors[item.status]} opacity-80`} />
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                      <Truck className="w-8 h-8 text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <Badge variant="outline" className={`${statusColors[item.status]} border-none font-black text-[10px] py-1.5 px-3 rounded-full`}>
                      {t(`logistics.status.${item.status.toLowerCase()}`)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">
                      {item.order?.lot?.cropName || item.order?.crop?.cropName || 'Farm Fresh Goods'}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <Clock className="w-4 h-4" />
                      {t('common.updated', 'Updated')} {format(new Date(item.updatedAt), 'PP')}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                           <MapPin className="w-4 h-4 text-slate-400" />
                         </div>
                         <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase">{t('logistics.last_seen')}</p>
                           <p className="text-sm font-bold text-slate-700">{item.currentLocation || t('logistics.at_origin')}</p>
                         </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-100/50 transition-colors">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{t('logistics.delivery_eta')}</span>
                         <span className="text-[10px] font-bold text-blue-600 uppercase">Live Tracking</span>
                       </div>
                       <p className="text-base font-black text-slate-900">
                         {item.estimatedDelivery ? format(new Date(item.estimatedDelivery), 'MMMM do') : 'Calculating...'}
                       </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
