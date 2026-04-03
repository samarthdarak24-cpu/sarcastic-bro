"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SupplierRecommendations } from "@/components/dashboard/buyer/SupplierRecommendations";
import { buyerNav } from "@/lib/nav-config";

export default function BuyerSuppliersPage() {
  return (
    <DashboardLayout navItems={buyerNav} userRole="BUYER">
      <div className="max-w-[1800px] mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-neut-100 text-neut-900">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">Buyer Command</span>
            </div>
            <h1 className="startup-headline text-5xl font-black text-neut-900">Verified Suppliers</h1>
          </div>
        </header>

        <section className="animate-fade-in">
          <SupplierRecommendations />
        </section>
      </div>
    </DashboardLayout>
  );
}
