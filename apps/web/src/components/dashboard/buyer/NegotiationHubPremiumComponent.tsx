'use client';

import React, { useState } from 'react';

interface Negotiation {
  id: string;
  productName: string;
  proposedPrice: number;
  status: string;
}

export const NegotiationHubPremiumComponent: React.FC<{ buyerId: string }> = ({ buyerId }) => {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [proposedPrice, setProposedPrice] = useState('');

  const submitProposal = async (productId: string) => {
    if (!proposedPrice) return;
    try {
      const response = await fetch('/api/negotiations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, proposedPrice: parseFloat(proposedPrice) }),
      });
      const negotiation = await response.json();
      setNegotiations(prev => [...prev, negotiation]);
      setProposedPrice('');
    } catch (error) {
      console.error('Failed to submit proposal:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Negotiation Hub</h2>
      
      <div className="space-y-3">
        {negotiations.map(neg => (
          <div key={neg.id} className="border rounded-lg p-4">
            <p className="font-semibold">{neg.productName}</p>
            <p className="text-gray-600">Proposed: ₹{neg.proposedPrice}</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded text-sm ${
              neg.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
              neg.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {neg.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
