'use client';

import React, { useState } from 'react';

interface BulkOrder {
  id: string;
  items: number;
  totalValue: number;
  status: string;
  createdAt: string;
}

export const BulkOrdersComponent: React.FC<{ buyerId: string }> = ({ buyerId }) => {
  const [orders, setOrders] = useState<BulkOrder[]>([]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Bulk Orders</h2>
      
      <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Create Bulk Order
      </button>

      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{order.items} items</p>
                <p className="text-gray-600">₹{order.totalValue}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
