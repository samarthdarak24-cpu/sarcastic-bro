'use client';

import React, { useState, useEffect } from 'react';

interface EscrowTransaction {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: string;
}

export const EscrowHubComponent: React.FC<{ farmerId: string }> = ({ farmerId }) => {
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, [farmerId]);

  const loadTransactions = async () => {
    try {
      const response = await fetch(`/api/escrow/transactions?farmerId=${farmerId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load escrow transactions:', error);
    }
  };

  const statusColors: Record<string, string> = {
    HELD: 'bg-yellow-100 text-yellow-800',
    RELEASED: 'bg-green-100 text-green-800',
    DISPUTED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Escrow Hub</h2>
      
      <div className="space-y-3">
        {transactions.map(tx => (
          <div key={tx.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">Order: {tx.orderId}</p>
              <p className="text-gray-600">₹{tx.amount}</p>
            </div>
            <span className={`px-3 py-1 rounded text-sm font-medium ${statusColors[tx.status] || 'bg-gray-100'}`}>
              {tx.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
