'use client';

import { Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import ComplianceSection from '@/components/buyer/ComplianceSection';
import {
  BarChart3,
  Building2,
  DollarSign,
  FileCheck,
  MapPin,
  MessageCircle,
  Package,
  ShoppingBag,
  Shield,
  Store,
  Truck,
  Wallet,
} from 'lucide-react';

export default function CompliancePage() {
  const navItems = [
    { label: 'Dashboard', href: '/buyer/dashboard', section: 'dashboard', icon: <BarChart3 /> },
    { label: 'Marketplace', href: '/buyer/marketplace', icon: <Store /> },
    { label: 'My Orders', href: '/buyer/orders', icon: <ShoppingBag /> },
    { label: 'Wallet', href: '/buyer/wallet', icon: <Wallet /> },
    { label: 'Bulk Orders', href: '/buyer/dashboard?section=bulk-orders', icon: <Package /> },
    { label: 'Escrow Payments', href: '/buyer/dashboard?section=escrow', icon: <DollarSign /> },
    { label: 'Delivery Approval', href: '/buyer/dashboard?section=delivery', icon: <Truck /> },
    { label: 'Quality Certificates', href: '/buyer/dashboard?section=certificates', icon: <FileCheck /> },
    { label: 'Real-Time Chat', href: '/buyer/dashboard?section=chat', icon: <MessageCircle /> },
    { label: 'Order Tracking', href: '/buyer/logistics', icon: <MapPin /> },
    { label: 'Analytics', href: '/buyer/analytics', icon: <BarChart3 /> },
    { label: 'Business KYC', href: '/buyer/dashboard?section=kyc', icon: <Building2 /> },
    { label: 'Gov Compliance', href: '/buyer/compliance', icon: <Shield />, active: true },
  ];

  return (
    <DashboardLayout navItems={navItems} userRole="buyer">
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <ComplianceSection />
      </Suspense>
    </DashboardLayout>
  );
}
