import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, Truck, Package, MapPin, Calendar, Info } from 'lucide-react';
import { Logistics, LogisticsEvent } from '../../services/logisticsService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

interface LogisticsTrackerProps {
  logistics: Logistics;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  PICKED_UP: 'bg-blue-500',
  IN_TRANSIT: 'bg-indigo-500',
  OUT_FOR_DELIVERY: 'bg-purple-500',
  DELIVERED: 'bg-green-500',
};

const LogisticsTracker: React.FC<LogisticsTrackerProps> = ({ logistics }) => {
  const { t } = useTranslation();

  const getStatusIcon = (status: string, currentStatus: string) => {
    const statuses = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statuses.indexOf(currentStatus);
    const targetIndex = statuses.indexOf(status);

    if (targetIndex <= currentIndex) {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }
    return <Circle className="w-6 h-6 text-slate-300" />;
  };

  const isCompleted = (status: string, currentStatus: string) => {
    const statuses = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    return statuses.indexOf(status) <= statuses.indexOf(currentStatus);
  };

  return (
    <Card className="overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-md">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Truck className="w-6 h-6" />
              {t('logistics.tracking_details')}
            </CardTitle>
            <p className="text-emerald-100 text-sm mt-1">
              {logistics.carrier || t('logistics.carrier_not_assigned')} • {logistics.trackingNumber || '#---'}
            </p>
          </div>
          <Badge className={`${statusColors[logistics.status]} text-white border-none px-3 py-1`}>
            {t(`logistics.status.${logistics.status.toLowerCase()}`)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Estimated Delivery Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('logistics.estimated_delivery')}</p>
              <p className="font-semibold text-slate-900">
                {logistics.estimatedDelivery 
                  ? format(new Date(logistics.estimatedDelivery), 'PPP') 
                  : t('logistics.tbd')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('logistics.current_location')}</p>
              <p className="font-semibold text-slate-900">{logistics.currentLocation || t('logistics.at_origin')}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-0 w-[2px] bg-slate-100" />
          
          <div className="space-y-8">
            {logistics.events?.map((event, index) => (
              <div key={event.id} className="relative pl-10">
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center bg-white z-10 
                  ${isCompleted(event.status, logistics.status) ? 'shadow-[0_0_10px_rgba(34,197,94,0.3)]' : ''}`}>
                  {getStatusIcon(event.status, logistics.status)}
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className={`font-bold ${isCompleted(event.status, logistics.status) ? 'text-slate-900' : 'text-slate-400'}`}>
                      {t(`logistics.status.${event.status.toLowerCase()}`)}
                    </h4>
                    <span className="text-xs font-medium text-slate-400">
                      {format(new Date(event.timestamp), 'MMM d, h:mm aa')}
                    </span>
                  </div>
                  {event.location && (
                    <p className="text-sm text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {/* If no events yet */}
            {(!logistics.events || logistics.events.length === 0) && (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Info className="w-10 h-10 mb-2 opacity-20" />
                <p>{t('logistics.no_events_yet')}</p>
              </div>
            )}
          </div>
        </div>

        {logistics.notes && (
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              {t('logistics.fpo_notes')}
            </h5>
            <p className="text-sm text-amber-700 italic">
              "{logistics.notes}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogisticsTracker;
