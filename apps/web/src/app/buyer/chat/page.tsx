'use client';

import React, { useState, useEffect } from 'react';
import { BuyerCommunicationsHub } from '@/components/dashboard/buyer/BuyerCommunicationsHub';

export default function ChatPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <BuyerCommunicationsHub />
    </div>
  );
}
