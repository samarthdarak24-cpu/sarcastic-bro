'use client';

import { Truck, MapPin, Clock, Phone, User, Package, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LogisticsCardProps {
  id: string;
  orderId: string;
  status: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  pickupLocation?: string;
  dropLocation?: string;
  estimatedDelivery?: string;
  cropName?: string;
  buyerName?: string;
  quantity?: number;
  className?: string;
  onClick?: () => void;
}

const statusColors: Record<string, string> = {
  REQUESTED: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  ASSIGNED: 'bg-blue-100 text-blue-800 border-blue-300',
  PICKED_UP: 'bg-purple-100 text-purple-800 border-purple-300',
  IN_TRANSIT: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800 border-orange-300',
  DELIVERED: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
};

export function LogisticsCard({
  id,
  orderId,
  status,
  driverName,
  driverPhone,
  vehicleNumber,
  pickupLocation,
  dropLocation,
  estimatedDelivery,
  cropName,
  buyerName,
  quantity,
  className,
  onClick,
}: LogisticsCardProps) {
  return (
    <div
      className={cn(
        'glass-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group',
        'hover:-translate-y-1 hover:border-brand-primary/30',
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
            <Truck className="w-6 h-6 text-brand-primary" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Order #{orderId.slice(-6)}</h3>
            {cropName && (
              <p className="text-sm text-gray-600">{cropName}{quantity ? ` • ${quantity} kg` : ''}</p>
            )}
          </div>
        </div>
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold border',
            statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
          )}
        >
          {status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Route */}
      {(pickupLocation || dropLocation) && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-4 h-4 text-green-600" />
          <div className="flex-1">
            <p className="text-xs text-gray-600">From</p>
            <p className="text-sm font-medium text-gray-900 truncate">{pickupLocation || 'Farm'}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <div className="flex-1">
            <p className="text-xs text-gray-600">To</p>
            <p className="text-sm font-medium text-gray-900 truncate">{dropLocation || 'Buyer'}</p>
          </div>
        </div>
      )}

      {/* Driver Info */}
      {driverName && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
          <User className="w-4 h-4 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{driverName}</p>
            {vehicleNumber && (
              <p className="text-xs text-gray-600">Vehicle: {vehicleNumber}</p>
            )}
          </div>
          {driverPhone && (
            <a
              href={`tel:${driverPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-white rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Phone className="w-4 h-4 text-blue-600" />
            </a>
          )}
        </div>
      )}

      {/* ETA */}
      {estimatedDelivery && status !== 'DELIVERED' && status !== 'CANCELLED' && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>ETA: {new Date(estimatedDelivery).toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short' 
          })}</span>
        </div>
      )}

      {/* Buyer */}
      {buyerName && (
        <p className="text-xs text-gray-500 mb-3">Buyer: {buyerName}</p>
      )}

      {/* Action */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">Logistics ID: {id.slice(-8)}</p>
        <Button
          variant="ghost"
          size="sm"
          className="text-brand-primary hover:text-brand-primary/80 group-hover:translate-x-1 transition-transform"
        >
          Track Details
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
