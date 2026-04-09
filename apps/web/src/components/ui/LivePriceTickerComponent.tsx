'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface PriceUpdate {
  productName: string;
  price: number;
  change: number;
  changePercent: number;
}

export const LivePriceTickerComponent: React.FC = () => {
  const [prices, setPrices] = useState<PriceUpdate[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('price:updated', (update) => {
        setPrices(prev => {
          const filtered = prev.filter(p => p.productName !== update.productName);
          return [update, ...filtered].slice(0, 5);
        });
      });
    }
    return () => {
      socket?.off('price:updated');
    };
  }, [socket]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold mb-3">Live Price Ticker</h3>
      <div className="space-y-2">
        {prices.map((price, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="font-semibold text-sm">{price.productName}</span>
            <div className="text-right">
              <p className="font-bold">₹{price.price}</p>
              <p className={`text-xs ${price.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {price.change >= 0 ? '+' : ''}{price.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
