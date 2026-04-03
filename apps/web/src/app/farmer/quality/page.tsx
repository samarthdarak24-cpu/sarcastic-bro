"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CropQualityDetector } from "@/components/dashboard/farmer/CropQualityDetector";
import { farmerNav } from "@/lib/nav-config";

export default function FarmerQualityPage() {
  return (
    <DashboardLayout navItems={farmerNav} userRole="FARMER">
      <div className="max-w-[1800px] mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-neut-100 text-neut-900">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Farmer Portal</span>
            </div>
            <h1 className="startup-headline text-5xl font-black text-neut-900">AI Quality Grading</h1>
          </div>
        </header>

        <section className="animate-fade-in">
          <CropQualityDetector />
        </section>
      </div>
    </DashboardLayout>
  );
}
