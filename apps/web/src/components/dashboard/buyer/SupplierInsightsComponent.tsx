'use client';

import React, { useState, useEffect } from 'react';

interface Supplier {
  id: string;
  name: string;
  reputationScore: number;
  totalOrders: number;
  products: number;
}

export const SupplierInsightsComponent: React.FC<{ supplierId: string }> = ({ supplierId }) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    loadSupplier();
  }, [supplierId]);

  const loadSupplier = async () => {
    try {
      const response = await fetch(`/api/suppliers/${supplierId}`);
      const data = await response.json();
      setSupplier(data);
    } catch (error) {
      console.error('Failed to load supplier:', error);
    }
  };

  if (!supplier) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{supplier.name}</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded text-center">
          <p className="text-gray-600 text-sm">Reputation</p>
          <p className="text-2xl font-bold text-blue-600">{supplier.reputationScore.toFixed(1)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded text-center">
          <p className="text-gray-600 text-sm">Orders</p>
          <p className="text-2xl font-bold text-green-600">{supplier.totalOrders}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded text-center">
          <p className="text-gray-600 text-sm">Products</p>
          <p className="text-2xl font-bold text-purple-600">{supplier.products}</p>
        </div>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        View All Products
      </button>
    </div>
  );
};
