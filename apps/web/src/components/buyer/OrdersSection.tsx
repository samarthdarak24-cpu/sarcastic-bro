'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Order } from '@/services/buyer';
import DeliveryConfirmationModal from '@/components/buyer/DeliveryConfirmationModal';
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';

interface OrdersSectionProps {
  orders: Order[];
  loading: boolean;
  onRefresh: () => void;
  onViewDetails: (orderId: string) => void;
  onTrackOrder: (orderId: string) => void;
}

const ORDER_FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'] as const;

function getOrderLabel(order: Order) {
  return order.crop?.cropName || order.lot?.cropName || 'Produce order';
}

function getOrderSubLabel(order: Order) {
  if (order.crop?.variety) {
    return order.crop.variety;
  }

  if (order.lot?.fpo?.name) {
    return order.lot.fpo.name;
  }

  return 'Supplier details available in order view';
}

function getStatusColor(status: string) {
  switch (status) {
    case 'DELIVERED':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'IN_TRANSIT':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'CONFIRMED':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'CANCELLED':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'DELIVERED':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'IN_TRANSIT':
      return <Truck className="h-4 w-4" />;
    case 'CANCELLED':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock3 className="h-4 w-4" />;
  }
}

export default function OrdersSection({
  orders,
  loading,
  onRefresh,
  onViewDetails,
  onTrackOrder,
}: OrdersSectionProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredOrders =
    filterStatus === 'ALL' ? orders : orders.filter((order) => order.status === filterStatus);

  const handleConfirmDelivery = (order: Order) => {
    setSelectedOrder(order);
    setShowConfirmModal(true);
  };

  const handleConfirmSuccess = () => {
    setShowConfirmModal(false);
    setSelectedOrder(null);
    onRefresh();
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-44 animate-pulse rounded-[28px] border border-slate-200 bg-white/80"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {ORDER_FILTERS.map((status) => {
          const count =
            status === 'ALL' ? orders.length : orders.filter((order) => order.status === status).length;

          return (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              <span>{status.replace(/_/g, ' ')}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  filterStatus === status ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-8 py-14 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-black text-slate-900">No matching orders yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Try a different filter or head back to the marketplace to place your next procurement order.
          </p>
          <div className="mt-6">
            <Link
              href="/buyer/marketplace"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Browse marketplace
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => {
            const canTrack = ['CONFIRMED', 'IN_TRANSIT'].includes(order.status);
            const canConfirm = order.status === 'DELIVERED' && !order.confirmedByBuyer;

            return (
              <div
                key={order.id}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                      <Package className="h-8 w-8 text-slate-400" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-black text-slate-900">{getOrderLabel(order)}</h3>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                        {order.confirmedByBuyer && (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Buyer confirmed
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-medium text-slate-500">{getOrderSubLabel(order)}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">{order.quantity} kg</span>
                        <span className="text-slate-300">/</span>
                        <span className="font-semibold text-slate-900">
                          Rs. {order.totalAmount.toLocaleString('en-IN')}
                        </span>
                        {order.trackingNumber && (
                          <>
                            <span className="text-slate-300">/</span>
                            <span>Tracking {order.trackingNumber}</span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="line-clamp-1">{order.deliveryAddress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 xl:items-end">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{order.status.replace(/_/g, ' ')}</span>
                    </div>

                    {order.escrowTransaction && (
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.escrowTransaction.status === 'HELD'
                            ? 'bg-amber-100 text-amber-700'
                            : order.escrowTransaction.status === 'RELEASED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Escrow {order.escrowTransaction.status.toLowerCase()}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 xl:justify-end">
                      {canTrack && (
                        <button
                          type="button"
                          onClick={() => onTrackOrder(order.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                          <Truck className="h-3.5 w-3.5" />
                          Track order
                        </button>
                      )}

                      {canConfirm && (
                        <button
                          type="button"
                          onClick={() => handleConfirmDelivery(order)}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Confirm delivery
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onViewDetails(order.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
                      >
                        View details
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showConfirmModal && selectedOrder && (
        <DeliveryConfirmationModal
          orderId={selectedOrder.id}
          orderDetails={{
            productName: getOrderLabel(selectedOrder),
            quantity: selectedOrder.quantity,
            totalAmount: selectedOrder.totalAmount,
          }}
          onClose={() => {
            setShowConfirmModal(false);
            setSelectedOrder(null);
          }}
          onSuccess={handleConfirmSuccess}
        />
      )}
    </div>
  );
}
