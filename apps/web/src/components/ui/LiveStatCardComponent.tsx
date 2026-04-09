'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface Stat {
  label: string;
  value: number;
  change: number;
}

export const LiveStatCardComponent: React.FC<{ stat: Stat }> = ({ stat }) => {
  const [currentStat, setCurrentStat] = useState(stat);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('stat:updated', (update) => {
        if (update.label === stat.label) {
          setCurrentStat(update);
        }
      });
    }
    return () => {
      socket?.off('stat:updated');
    };
  }, [socket, stat.label]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-gray-600 text-sm">{currentStat.label}</p>
      <p className="text-3xl font-bold mt-2">{currentStat.value}</p>
      <p className={`text-sm mt-1 ${currentStat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {currentStat.change >= 0 ? '↑' : '↓'} {Math.abs(currentStat.change)}%
      </p>
    </div>
  );
};
