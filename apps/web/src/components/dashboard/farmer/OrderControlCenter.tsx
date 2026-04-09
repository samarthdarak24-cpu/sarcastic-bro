'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { orderService } from '@/services/orderService';

interface Order {
  id: string;
  orderNumber: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export const OrderControlCenter: React.FC<{ farmerId: string }> = ({ farmerId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const { socket } = useSocket();

  useEffect(() => {
    loadOrders();
    if (socket) {
      socket.on('order:new', (order) => {
        setOrders(prev => [order, ...prev]);
      });
      socket.on('order:status:updated', (order) => {
        setOrders(prev => prev.map(o => o.id === order.id ? order : o));
      });
    }
    return () => {
      socket?.off('order:new');
      socket?.off('order:status:updated');
    };
  }, [socket]);

  const loadOrders = async () => {
    try {
      const data = await orderService.getByFarmerId(farmerId);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-blue-100 text-blue-800',
    IN_TRANSIT: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-200 text-green-900',
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Order Control Center</h2>
      
      <div className="mb-4 flex gap-2">
        {['all', 'PENDING', 'ACCEPTED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded ${statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredOrders.map(order => (
          <div key={order.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>
              <p className="text-sm text-gray-600">{order.quantity} units - ₹{order.totalPrice}</p>
            </div>
            <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
