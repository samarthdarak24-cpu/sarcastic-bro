'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  location?: string;
  estimatedDelivery?: string;
}

export const OrderTrackerComponent: React.FC<{ buyerId: string }> = ({ buyerId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    loadOrders();
    if (socket) {
      socket.on('order:status:updated', (order) => {
        setOrders(prev => prev.map(o => o.id === order.id ? order : o));
      });
      socket.on('order:location:updated', (update) => {
        setOrders(prev => prev.map(o => o.id === update.orderId ? { ...o, location: update.location } : o));
      });
    }
    return () => {
      socket?.off('order:status:updated');
      socket?.off('order:location:updated');
    };
  }, [socket]);

  const loadOrders = async () => {
    try {
      const response = await fetch(`/api/orders?buyerId=${buyerId}`);
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const statusSteps = ['PENDING', 'ACCEPTED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Order Tracker</h2>
      
      <div className="space-y-4">
        {orders.map(order => {
          const currentStep = statusSteps.indexOf(order.status);
          return (
            <div key={order.id} className="border rounded-lg p-4">
              <p className="font-semibold mb-3">{order.orderNumber}</p>
              
              <div className="flex justify-between mb-3">
                {statusSteps.map((step, idx) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      idx <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}>
                      {idx + 1}
                    </div>
                    <p className="text-xs mt-1">{step}</p>
                  </div>
                ))}
              </div>

              {order.location && <p className="text-sm text-gray-600">📍 {order.location}</p>}
              {order.estimatedDelivery && <p className="text-sm text-gray-600">🕐 {new Date(order.estimatedDelivery).toLocaleDateString()}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
