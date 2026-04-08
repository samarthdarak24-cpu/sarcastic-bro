'use client';

import { Suspense } from 'react';
import ChatWidget from '@/components/ui/ChatWidget/ChatWidget';
import { LiveNotificationBell } from '@/components/ui/LiveNotificationBell';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
          <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        {children}
      </Suspense>
      
      {/* Global Components - Available on all buyer dashboard pages */}
      <ChatWidget />
      <LiveNotificationBell />
      <div className="fixed top-4 right-4 z-40">
        <LanguageSwitcher />
      </div>
    </>
  );
}
