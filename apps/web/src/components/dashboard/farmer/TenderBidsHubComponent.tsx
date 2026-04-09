'use client';

import React, { useState, useEffect } from 'react';

interface Tender {
  id: string;
  title: string;
  quantity: number;
  deadline: string;
  bids: number;
}

export const TenderBidsHubComponent: React.FC<{ farmerId: string }> = ({ farmerId }) => {
  const [tenders, setTenders] = useState<Tender[]>([]);

  useEffect(() => {
    loadTenders();
  }, [farmerId]);

  const loadTenders = async () => {
    try {
      const response = await fetch(`/api/tenders?farmerId=${farmerId}`);
      const data = await response.json();
      setTenders(data);
    } catch (error) {
      console.error('Failed to load tenders:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Tender Bids Hub</h2>
      
      <div className="space-y-3">
        {tenders.map(tender => (
          <div key={tender.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{tender.title}</h3>
            <p className="text-sm text-gray-600">{tender.quantity} units</p>
            <div className="flex justify-between mt-2">
              <span className="text-sm">Deadline: {new Date(tender.deadline).toLocaleDateString()}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{tender.bids} bids</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
