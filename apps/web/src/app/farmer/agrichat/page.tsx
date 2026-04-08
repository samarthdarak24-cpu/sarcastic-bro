'use client';

import React, { useEffect, useState } from 'react';
import { FarmerCommunicationsHub } from '@/components/dashboard/farmer/FarmerCommunicationsHub';
import { authService } from '@/services/auth';

export default function FarmerAgroChatPage() {
  const [isReady, setIsReady] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const user = authService.getUser();
      if (!user) {
        setError('Please log in to access AgriChat');
        setIsReady(false);
      } else {
        setIsReady(true);
      }
    } catch (err) {
      console.warn('Auth check failed, allowing access with demo data');
      setIsReady(true);
    }
  }, []);

  if (error) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-4xl mb-4">🌾</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">AgriChat</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <p className="text-sm text-slate-500">Use demo data to explore features</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {isReady && <FarmerCommunicationsHub />}
    </div>
  );
}
