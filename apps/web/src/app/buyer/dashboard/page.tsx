"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Search, 
  TrendingUp, 
  LayoutDashboard,
  ShoppingCart,
  Zap,
  Target,
  Layers,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SourcingSpace } from "@/components/dashboard/buyer/SourcingSpace";
import { SupplierInsights } from "@/components/dashboard/buyer/SupplierInsights";
import { PriceIntelligence } from "@/components/dashboard/buyer/PriceIntelligence";
import { NegotiationHub } from "@/components/dashboard/buyer/NegotiationHub";
import { OrderTracker } from "@/components/dashboard/buyer/OrderTracker";
import { TrustReviews } from "@/components/dashboard/buyer/TrustReviews";
import { TraceChain } from "@/components/dashboard/buyer/TraceChain";
import { BulkOrders } from "@/components/dashboard/buyer/BulkOrders";
import { AgriChat } from "@/components/dashboard/farmer/AgriChat";
import { AIInsightsChat } from "@/components/dashboard/shared/AIInsightsChat";
import { PreBookingHub } from "@/components/dashboard/buyer/PreBookingHub";
import { BehavioralInsights } from "@/components/dashboard/shared/BehavioralInsights";
import { ProcurementAssistant } from "@/components/dashboard/buyer/ProcurementAssistant";
import { BlockchainTraceability } from "@/components/dashboard/shared/BlockchainTraceability";
import { EscrowDashboard } from "@/components/dashboard/shared/EscrowDashboard";
import { FraudSecurityCenter } from "@/components/dashboard/shared/FraudSecurityCenter";
import { UserProfileSettings } from "@/components/dashboard/shared/UserProfileSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReputationHub } from "@/components/dashboard/farmer/ReputationHub"; // Reuse same core hub component
import { Badge } from "@/components/ui/badge";
import { buyerNav } from "@/lib/nav-config";

function Overview({ router }: { router: any }) {
  return (
    <div className="space-y-12 animate-fade-in text-neut-900 border-neut-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <KPICard title="Total Sourcing" value="₹12.4L" change="+12.5%" icon={<ShoppingCart />} isPositive />
                  <KPICard title="Active Bids" value="18" change="-2" icon={<Target />} />
                  <KPICard title="Suppliers" value="45" change="+5" icon={<Building2 />} isPositive />
                  <KPICard title="Savings" value="₹1.8L" change="+24.2%" icon={<Zap />} isPositive />
                </div>
            </div>
            <div className="space-y-8">
                <BehavioralInsights key="behavioral-insights" />
            </div>
          </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 border-none shadow-startup-soft bg-white/80 backdrop-blur-xl p-12 rounded-[3rem] min-h-[450px] relative overflow-hidden flex flex-col justify-center">
             <div className="absolute inset-0 opacity-10 bg-brand-secondary/5 pointer-events-none" />
             <div className="relative z-10 max-w-lg space-y-6">
                <Badge tone="brand" className="h-8 px-4 rounded-xl font-black text-[10px] shadow-sm">AI COMMAND ACTIVE</Badge>
                <h2 className="text-4xl md:text-6xl font-black text-neut-900 tracking-tight leading-tight">Identify Your Next Major Sourcing Loop.</h2>
                <p className="text-lg font-medium text-neut-500 leading-relaxed">Direct-from-farm gate procurement currently saves <span className="text-brand-secondary font-black">15% on Grains</span> and <span className="text-brand-secondary font-black">22% on Spices</span>. Direct trace is now verified.</p>
                 <div className="flex gap-4">
                    <Button variant="gradient" className="h-16 px-10 rounded-2xl font-black text-lg shadow-lg shadow-brand-secondary/20 hover:scale-105 transition-transform" onClick={() => router.push('?section=Sourcing Space')}>
                        Discover New Clusters
                        <ArrowRight size={20} className="ml-3" />
                    </Button>
                    <Button variant="outline" className="h-16 px-10 rounded-2xl font-black text-lg border-brand-secondary text-brand-secondary hover:bg-brand-secondary/5 transition-all flex gap-3 shadow-xl shadow-brand-secondary/5" onClick={() => router.push('?section=Procurement')}>
                        <Sparkles size={20} />
                        Smart Buy Recommendation
                    </Button>
                 </div>
             </div>
          </Card>

          <Card className="border-none shadow-startup-soft bg-neut-900 text-white p-12 rounded-[3.5rem] flex flex-col justify-between group overflow-hidden cursor-pointer">
             <div className="absolute top-0 right-0 p-8 h-24 w-24 bg-white/5 rounded-bl-[4rem] group-hover:bg-brand-secondary/20 transition-all" />
             <div className="space-y-4">
                <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-startup-soft"><Layers size={28} /></div>
                <h3 className="text-2xl font-black tracking-tight leading-tight">Regional Sourcing Indices</h3>
             </div>
             <p className="text-neut-400 font-medium my-8">Live Mandi indices across Guntur, Kurnool, and Varanasi are now synchronized.</p>
             <div className="flex items-center gap-2 text-brand-secondary font-bold text-sm">
                View Intelligence <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
             </div>
          </Card>
       </div>
    </div>
  );
}

function KPICard({ title, value, change, icon, isPositive }: any) {
  return (
    <Card className="border-none shadow-startup-soft bg-white/80 backdrop-blur-xl group hover:shadow-startup-medium transition-all transform hover:-translate-y-1 rounded-[2.5rem]">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="h-14 w-14 bg-neut-50 rounded-2xl flex items-center justify-center text-neut-300 group-hover:bg-brand-secondary group-hover:text-white transition-all shadow-startup-soft">
            {icon}
          </div>
          <Badge tone={isPositive ? 'brand' : 'ink'} className="font-black text-[10px] rounded-lg h-6">
             {change}
          </Badge>
        </div>
        <p className="text-neut-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-4xl font-black text-neut-900 tracking-tight">{value}</h3>
      </CardContent>
    </Card>
  );
}

function BuyerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") || "Overview";

  return (
    <DashboardLayout navItems={buyerNav} userRole="BUYER">
      <div className="max-w-[1800px] mx-auto space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-neut-100 text-neut-900 px-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge tone="brand" className="border-white/10 text-[8px] h-4 font-black uppercase shadow-sm">Active</Badge>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">Buyer Command</span>
            </div>
            <h1 className="startup-headline text-5xl font-black text-neut-900">
              {activeSection === 'Overview' && 'Cockpit'}
              {activeSection === 'Suppliers' && 'Supplier Insights'}
              {activeSection === 'Reviews' && 'Trust & Reviews'}
              {activeSection === 'Intelligence' && 'Market Intelligence'}
              {activeSection === 'Bidding' && 'Negotiation Hub'}
              {activeSection === 'Tracking' && 'Live Order Tracker'}
              {activeSection === 'Reputation' && 'My Reputation Profile'}
              {activeSection === 'AI Insights' && 'Agri-Intelligence'}
              {activeSection === 'Procurement' && 'AI Procurement Assistant'}
              {activeSection === 'Pre-Booking' && 'Safe-Lock Hub'}
              {activeSection === 'Blockchain' && 'Blockchain Traceability'}
              {activeSection === 'Escrow' && 'Escrow Payments'}
              {activeSection === 'Security' && 'Trade Security Hub'}
              {activeSection === 'Profile' && 'Profile Settings'}
              {!['Overview', 'Sourcing Space', 'Suppliers', 'Reviews', 'Intelligence', 'Bidding', 'Tracking', 'Reputation', 'Procurement', 'AI Insights', 'Pre-Booking', 'Blockchain', 'Escrow', 'Security', 'Profile'].includes(activeSection) && activeSection}
            </h1>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-neut-200">Export ESG Report</Button>
             <Button variant="outline" className="h-12 w-12 rounded-xl p-0 border-neut-200"><TrendingUp size={20} /></Button>
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
            {activeSection === "Overview" && <Overview key="overview" router={router} />}
            {activeSection === "Sourcing Space" && <SourcingSpace key="sourcing" />}
            {activeSection === "Suppliers" && <SupplierInsights key="suppliers" />}
            {activeSection === "Reviews" && <TrustReviews key="reviews" />}
            {activeSection === "Intelligence" && <PriceIntelligence key="intelligence" />}
            {activeSection === "Bidding" && <NegotiationHub key="negotiation" />}
            {activeSection === "Tracking" && <OrderTracker key="tracking" />}
            {activeSection === "Traceability" && <TraceChain key="trace" />}
            {activeSection === "Reputation" && <ReputationHub key="reputation" />}
            {activeSection === "Bulk Trade" && <BulkOrders key="bulk" />}
            {activeSection === "Chat" && <AgriChat key="chat" />}
            {activeSection === "Procurement" && <ProcurementAssistant key="procurement" />}
            {activeSection === "Pre-Booking" && <PreBookingHub key="pre-booking" />}
            {activeSection === "Blockchain" && <BlockchainTraceability key="blockchain" />}
            {activeSection === "Escrow" && <EscrowDashboard key="escrow" />}
            {activeSection === "Security" && <FraudSecurityCenter key="security" />}
            {activeSection === "AI Insights" && <AIInsightsChat key="ai-insights" userType="BUYER" />}
            {activeSection === "Profile" && <UserProfileSettings key="profile" />}

            {!buyerNav.some((i: any) => i.label === activeSection || i.section === activeSection) && activeSection !== "Overview" && activeSection !== "Profile" && (
              <div className="h-[600px] glass-card flex flex-col items-center justify-center text-center p-12">
                <div className="h-24 w-24 bg-brand-secondary/5 rounded-[2.5rem] flex items-center justify-center text-brand-secondary mb-8 shadow-startup-soft">
                  <LayoutDashboard size={48} />
                </div>
                <h3 className="text-3xl font-black text-neut-900 mb-4 tracking-tight">{activeSection} Module</h3>
                <p className="text-neut-500 font-medium max-w-md mx-auto text-lg leading-relaxed">
                  This command module is currently being configured for your access level.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-neut-50"><div className="h-12 w-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin" /></div>}>
      <BuyerDashboardContent />
    </Suspense>
  );
}
