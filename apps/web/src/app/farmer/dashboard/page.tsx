"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  FileText, 
  LayoutDashboard,
  CreditCard,
  Target,
  Zap,
  TrendingUp,
  ShieldCheck
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProductManagement } from "@/components/dashboard/farmer/ProductManagement";
import { TenderParticipation } from "@/components/dashboard/farmer/TenderParticipation";
import { AgriPayCenter } from "@/components/dashboard/farmer/AgriPayCenter";
import { OrderControlCenter } from "@/components/dashboard/farmer/OrderControlCenter";
import { AIPriceAdvisor } from "@/components/dashboard/farmer/AIPriceAdvisor";
import { PriceProtectionHub } from "@/components/dashboard/farmer/PriceProtectionHub";
import { AgriChat } from "@/components/dashboard/farmer/AgriChat";
import { LogisticsManager } from "@/components/dashboard/farmer/LogisticsManager";
import { FarmInsights } from "@/components/dashboard/farmer/FarmInsights";
import { EasyMode } from "@/components/dashboard/farmer/EasyMode";
import { CropAdvisor } from "@/components/dashboard/farmer/CropAdvisor";
import { ReputationHub } from "@/components/dashboard/farmer/ReputationHub";
import { CropQualityDetector } from "@/components/dashboard/farmer/CropQualityDetector";
import { AIInsightsChat } from "@/components/dashboard/shared/AIInsightsChat";
import { AutoSellSettings } from "@/components/dashboard/farmer/AutoSellSettings";
import { BehavioralInsights } from "@/components/dashboard/shared/BehavioralInsights";
import { BlockchainTraceability } from "@/components/dashboard/shared/BlockchainTraceability";
import { EscrowDashboard } from "@/components/dashboard/shared/EscrowDashboard";
import { UserProfileSettings } from "@/components/dashboard/shared/UserProfileSettings";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { farmerNav } from "@/lib/nav-config";

function Overview() {
  return (
    <div className="space-y-10 animate-fade-in text-neut-900 border-neut-200">
      <FarmInsights />
    </div>
  );
}

function FarmerDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSection = searchParams.get("section") || "Overview";

  const handleToggleEasyMode = () => {
    router.push(`?section=Ease`);
  };

  return (
    <DashboardLayout navItems={farmerNav} userRole="FARMER">
      <div className="max-w-[1800px] mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-neut-100 text-neut-900 px-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge tone="brand" className="border-white/10 text-[8px] h-4 font-black uppercase">Active</Badge>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Farmer Portal</span>
            </div>
            <h1 className="startup-headline text-5xl font-black text-neut-900">
              {activeSection === 'Overview' && 'Farm Insights'}
              {activeSection === 'Inventory' && 'Smart Product Hub'}
              {activeSection === 'Payments' && 'AgriPay Center'}
              {activeSection === 'Orders' && 'Order Control'}
              {activeSection === 'Logistics' && 'Logistics Manager'}
              {activeSection === 'Analytics' && 'Price Advisor'}
              {activeSection === 'Finance' && 'Price Protection'}
              {activeSection === 'Smart Trading' && 'Auto-Sell Hub'}
              {activeSection === 'Behavioral' && 'Behavioral Insights'}
              {activeSection === 'Blockchain' && 'Blockchain Traceability'}
              {activeSection === 'Escrow' && 'Escrow Payments'}
              {activeSection === 'AI Insights' && 'Agri-Intelligence'}
              {activeSection === 'Ease' && 'Easy Mode'}
              {activeSection === 'Profile' && 'Profile Settings'}
              {!['Overview', 'Inventory', 'Reputation', 'Payments', 'Orders', 'Tenders', 'Logistics', 'Advisor', 'Quality', 'AI Insights', 'Ease', 'Analytics', 'Finance', 'Smart Trading', 'Behavioral', 'Blockchain', 'Escrow', 'Profile'].includes(activeSection) && activeSection}
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-neut-200">Export PDF</Button>
            <Button 
                variant={activeSection === 'Ease' ? 'secondary' : 'gradient'} 
                className="h-12 px-8 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-brand-primary/10"
                onClick={handleToggleEasyMode}
            >
                <Zap size={18} className={activeSection === 'Ease' ? 'text-brand-primary' : ''} />
                {activeSection === 'Ease' ? 'Exit Easy Mode' : 'Switch to Easy Mode'}
            </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="px-4"
          >
            {activeSection === "Overview" && <Overview key="overview" />}
            {activeSection === "Inventory" && <ProductManagement key="inventory" />}
            {activeSection === "Tenders" && <TenderParticipation key="tenders" />}
            {activeSection === "Payments" && <AgriPayCenter key="payments" />}
            {activeSection === "Orders" && <OrderControlCenter key="orders" />}
            {activeSection === "AI Advisor" && <AIPriceAdvisor key="ai-advisor" />}
            {activeSection === "Chat" && <AgriChat key="chat" />}
            {activeSection === "Logistics" && <LogisticsManager key="logistics" />}
            {activeSection === "Advisor" && <CropAdvisor key="crop-advisor" />}
            {activeSection === "Reputation" && <ReputationHub key="reputation-hub" />}
            {activeSection === "Quality" && <CropQualityDetector key="quality" />}
            {activeSection === "Smart Trading" && <AutoSellSettings key="auto-sell" />}
            {activeSection === "Finance" && <PriceProtectionHub key="insurance" />}
            {activeSection === "Analytics" && <AIPriceAdvisor key="ai-advisor" />}
            {activeSection === "Behavioral" && <BehavioralInsights key="behavioral" />}
            {activeSection === "Blockchain" && <BlockchainTraceability key="blockchain" />}
            {activeSection === "Escrow" && <EscrowDashboard key="escrow" />}
            {activeSection === "AI Insights" && <AIInsightsChat key="ai-insights" userType="FARMER" />}
            {activeSection === "Ease" && <EasyMode key="easy-mode" />}
            {activeSection === "Profile" && <UserProfileSettings key="profile" />}
            
            {!farmerNav.some((i: any) => i.label === activeSection || i.section === activeSection) && activeSection !== "Overview" && activeSection !== "Ease" && activeSection !== "Profile" && (
              <div className="h-[600px] glass-card flex flex-col items-center justify-center text-center p-12">
                <div className="h-24 w-24 bg-brand-primary/5 rounded-[2.5rem] flex items-center justify-center text-brand-primary mb-8 shadow-startup-soft">
                  <LayoutDashboard size={48} />
                </div>
                <h3 className="text-3xl font-black text-neut-900 mb-4 tracking-tight">{activeSection} Module</h3>
                <p className="text-neut-500 font-medium max-w-md mx-auto text-lg leading-relaxed">
                  This module is currently being configured or access is restricted.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default function FarmerDashboardPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-neut-50"><div className="h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <FarmerDashboardContent />
    </Suspense>
  );
}
