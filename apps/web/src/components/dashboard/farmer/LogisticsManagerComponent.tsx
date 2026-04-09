'use client';

import React, { useState, useEffect } from 'react';

interface Shipment {
  id: string;
  orderId: string;
  status: string;
  location: string;
  estimatedDelivery: string;
}

export const LogisticsManagerComponent: React.FC<{ farmerId: string }> = ({ farmerId }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    loadShipments();
  }, [farmerId]);

  const loadShipments = async () => {
    try {
      const response = await fetch(`/api/logistics?farmerId=${farmerId}`);
      const data = await response.json();
      setShipments(data);
    } catch (error) {
      console.error('Failed to load shipments:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Logistics Manager</h2>
      
      <div className="space-y-3">
        {shipments.map(shipment => (
          <div key={shipment.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold">Order: {shipment.orderId}</p>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{shipment.status}</span>
            </div>
            <p className="text-sm text-gray-600">📍 {shipment.location}</p>
            <p className="text-sm text-gray-600">🕐 Est. Delivery: {new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
