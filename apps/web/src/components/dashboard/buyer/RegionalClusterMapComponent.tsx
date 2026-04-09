'use client';

import React, { useState, useEffect } from 'react';

interface Region {
  name: string;
  suppliers: number;
  products: number;
  avgPrice: number;
}

export const RegionalClusterMapComponent: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      const response = await fetch('/api/regional-clusters');
      const data = await response.json();
      setRegions(data);
    } catch (error) {
      console.error('Failed to load regions:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Regional Cluster Map</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regions.map(region => (
          <div key={region.name} className="border rounded-lg p-4 hover:shadow-lg transition">
            <h3 className="font-semibold text-lg">{region.name}</h3>
            <div className="mt-3 space-y-2">
              <p className="text-sm text-gray-600">👥 {region.suppliers} suppliers</p>
              <p className="text-sm text-gray-600">📦 {region.products} products</p>
              <p className="text-sm text-gray-600">💰 Avg: ₹{region.avgPrice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
