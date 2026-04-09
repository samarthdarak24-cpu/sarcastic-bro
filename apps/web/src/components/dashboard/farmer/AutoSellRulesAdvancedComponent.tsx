'use client';

import React, { useState } from 'react';

interface AutoSellRule {
  id: string;
  minPrice: number;
  maxQuantity: number;
  enabled: boolean;
}

export const AutoSellRulesAdvancedComponent: React.FC<{ farmerId: string }> = ({ farmerId }) => {
  const [rules, setRules] = useState<AutoSellRule[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxQty, setMaxQty] = useState('');

  const addRule = async () => {
    if (!minPrice || !maxQty) return;
    try {
      const response = await fetch('/api/auto-sell/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minPrice: parseFloat(minPrice), maxQuantity: parseFloat(maxQty) }),
      });
      const rule = await response.json();
      setRules(prev => [...prev, rule]);
      setMinPrice('');
      setMaxQty('');
    } catch (error) {
      console.error('Failed to add rule:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Auto-Sell Rules</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price (₹)"
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            value={maxQty}
            onChange={(e) => setMaxQty(e.target.value)}
            placeholder="Max Quantity (kg)"
            className="border rounded px-3 py-2"
          />
        </div>
        <button
          onClick={addRule}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Rule
        </button>
      </div>

      <div className="space-y-2">
        {rules.map(rule => (
          <div key={rule.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">Min: ₹{rule.minPrice} | Max: {rule.maxQuantity}kg</p>
            </div>
            <span className={`px-3 py-1 rounded text-sm ${rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
              {rule.enabled ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
