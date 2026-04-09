'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';

export const BackendStatusBannerComponent: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));
    }
    return () => {
      socket?.off('connect');
      socket?.off('disconnect');
    };
  }, [socket]);

  if (isConnected) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p className="font-bold">⚠️ Connection Lost</p>
      <p className="text-sm">Attempting to reconnect to backend...</p>
    </div>
  );
};
