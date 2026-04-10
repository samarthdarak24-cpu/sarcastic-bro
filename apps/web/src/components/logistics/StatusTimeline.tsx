'use client';

import { CheckCircle, Truck, Package, User, Navigation, Send, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineStep {
  status: string;
  label: string;
  icon: any;
  description?: string;
  timestamp?: string;
}

interface StatusTimelineProps {
  currentStatus: string;
  events?: Array<{
    status: string;
    description?: string;
    timestamp: string;
  }>;
  className?: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { status: 'REQUESTED', label: 'Pickup Requested', icon: Package },
  { status: 'ASSIGNED', label: 'Driver Assigned', icon: User },
  { status: 'PICKED_UP', label: 'Picked Up', icon: Truck },
  { status: 'IN_TRANSIT', label: 'In Transit', icon: Navigation },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Send },
  { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

export function StatusTimeline({ currentStatus, events = [], className }: StatusTimelineProps) {
  const getStatusIndex = (status: string) => {
    return TIMELINE_STEPS.findIndex(step => step.status === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  const getEventForStatus = (status: string) => {
    return events.find(event => event.status === status);
  };

  return (
    <div className={cn('relative space-y-4', className)}>
      {TIMELINE_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const event = getEventForStatus(step.status);
        const Icon = step.icon;

        return (
          <div key={step.status} className="relative flex items-start gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isCompleted
                    ? 'bg-brand-primary border-brand-primary text-white shadow-lg'
                    : 'bg-white border-gray-300 text-gray-400'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-16 transition-all duration-300',
                    isCompleted ? 'bg-brand-primary' : 'bg-gray-200'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <h4
                  className={cn(
                    'font-semibold text-sm',
                    isCompleted ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {step.label}
                </h4>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary animate-pulse">
                    <Clock className="w-3 h-3" />
                    Current
                  </span>
                )}
              </div>

              {event?.description && (
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              )}

              {event?.timestamp && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(event.timestamp).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {currentStatus === 'CANCELLED' && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <XCircle className="w-6 h-6 text-red-600" />
          <div>
            <h4 className="font-semibold text-sm text-red-900">Logistics Cancelled</h4>
            <p className="text-xs text-red-700 mt-1">
              {events.find(e => e.status === 'CANCELLED')?.description || 'This logistics has been cancelled'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
