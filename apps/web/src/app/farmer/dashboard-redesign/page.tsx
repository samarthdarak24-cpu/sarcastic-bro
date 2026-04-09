'use client';

import { Suspense, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { farmerNav } from '@/lib/nav-config';
import { AnimatePresence } from 'framer-motion';
import FarmerDashboardRedesign from '@/components/dashboard/farmer/FarmerDashboardRedesign';
import FeaturePage from '@/components/dashboard/farmer/FeaturePage';

// Import feature components
import FarmInsights from '@/components/dashboard/farmer/FarmInsights';
import AgriIntelligence from '@/components/dashboard/farmer/AgriIntelligence';
import MarketIntelligenceHub from '@/components/dashboard/farmer/MarketIntelligenceHub';
import { BehavioralInsights } from '@/components/dashboard/farmer/BehavioralInsights';
import { SmartProductHub } from '@/components/dashboard/farmer/SmartProductHub';
import SmartInventoryHub from '@/components/dashboard/farmer/SmartInventoryHub';
import CropQualityDetector from '@/components/dashboard/farmer/CropQualityDetector';
import CropManagementHub from '@/components/dashboard/farmer/CropManagementHub';
import OrderControl from '@/components/dashboard/farmer/OrderControl';
import LogisticsManager from '@/components/dashboard/farmer/LogisticsManager';
import AutoSellRulesAdvanced from '@/components/dashboard/farmer/AutoSellRulesAdvanced';
import AgriPayCenter from '@/components/dashboard/farmer/AgriPayCenter';
import EscrowHub from '@/components/dashboard/farmer/EscrowHub';
import FinancialHub from '@/components/dashboard/farmer/FinancialHub';
import PriceProtectionHub from '@/components/dashboard/farmer/PriceProtectionHub';
import TenderBidsHub from '@/components/dashboard/farmer/TenderBidsHub';
import TenderParticipation from '@/components/dashboard/farmer/TenderParticipation';
import BulkAggregationEngine from '@/components/dashboard/farmer/BulkAggregationEngine';
import TrustIdentity from '@/components/dashboard/farmer/TrustIdentity';
import ReputationHub from '@/components/dashboard/farmer/ReputationHub';
import BlockchainTrace from '@/components/dashboard/farmer/BlockchainTrace';
import SecurityDashboard from '@/components/dashboard/farmer/SecurityDashboard';
import ComplianceTracking from '@/components/dashboard/farmer/ComplianceTracking';
import GlobalExportAudit from '@/components/dashboard/farmer/GlobalExportAudit';

import {
  Sparkles, Package, Truck, DollarSign, Gavel, Award,
  ShieldAlert, BarChart3, Brain, TrendingUp, Target,
  Camera, Leaf, Globe, Lock, Zap
} from 'lucide-react';

// Feature configuration with metadata
const featureConfig: Record<string, {
  component: React.ComponentType<any>;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}> = {
  'farm-insights': {
    component: FarmInsights,
    title: 'Farm Insights',
    description: 'Weather, soil health, and pest detection insights',
    icon: <BarChart3 size={48} />,
    gradient: 'from-blue-500 to-cyan-600'
  },
  'agri-intelligence': {
    component: AgriIntelligence,
    title: 'Agri Intelligence',
    description: 'AI-powered farming recommendations',
    icon: <Brain size={48} />,
    gradient: 'from-purple-500 to-indigo-600'
  },
  'market-intelligence': {
    component: MarketIntelligenceHub,
    title: 'Market Intelligence',
    description: 'Price trends and market forecasts',
    icon: <TrendingUp size={48} />,
    gradient: 'from-green-500 to-emerald-600'
  },
  'behavioral-insights': {
    component: BehavioralInsights,
    title: 'Behavioral Insights',
    description: 'Buyer behavior and demand analysis',
    icon: <Target size={48} />,
    gradient: 'from-orange-500 to-red-600'
  },
  'product-hub': {
    component: SmartProductHub,
    title: 'Product Hub',
    description: 'Manage all your agricultural products',
    icon: <Package size={48} />,
    gradient: 'from-green-500 to-emerald-600'
  },
  'inventory': {
    component: SmartInventoryHub,
    title: 'Smart Inventory',
    description: 'Track and manage your inventory',
    icon: <Leaf size={48} />,
    gradient: 'from-lime-500 to-green-600'
  },
  'quality-scan': {
    component: CropQualityDetector,
    title: 'AI Quality Scan',
    description: 'Scan and analyze crop quality instantly',
    icon: <Camera size={48} />,
    gradient: 'from-violet-500 to-purple-600'
  },
  'crop-management': {
    component: CropManagementHub,
    title: 'Crop Management',
    description: 'Plan and track your crop cycles',
    icon: <Leaf size={48} />,
    gradient: 'from-emerald-500 to-teal-600'
  },
  'order-control': {
    component: OrderControl,
    title: 'Order Control',
    description: 'Manage all your orders in one place',
    icon: <Truck size={48} />,
    gradient: 'from-blue-500 to-cyan-600'
  },
  'logistics': {
    component: LogisticsManager,
    title: 'Logistics Manager',
    description: 'Track deliveries and manage logistics',
    icon: <Globe size={48} />,
    gradient: 'from-sky-500 to-blue-600'
  },
  'auto-sell': {
    component: AutoSellRulesAdvanced,
    title: 'Auto-Sell Rules',
    description: 'Automate your selling with smart rules',
    icon: <Zap size={48} />,
    gradient: 'from-yellow-500 to-orange-600'
  },
  'agripay': {
    component: AgriPayCenter,
    title: 'AgriPay Center',
    description: 'Process payments and manage finances',
    icon: <DollarSign size={48} />,
    gradient: 'from-amber-500 to-orange-600'
  },
  'escrow': {
    component: EscrowHub,
    title: 'Escrow Hub',
    description: 'Secure transactions with escrow protection',
    icon: <Lock size={48} />,
    gradient: 'from-indigo-500 to-purple-600'
  },
  'financial-hub': {
    component: FinancialHub,
    title: 'Financial Hub',
    description: 'Revenue analytics and financial insights',
    icon: <BarChart3 size={48} />,
    gradient: 'from-green-500 to-teal-600'
  },
  'price-protection': {
    component: PriceProtectionHub,
    title: 'Price Protection',
    description: 'Lock in prices and protect your revenue',
    icon: <ShieldAlert size={48} />,
    gradient: 'from-red-500 to-rose-600'
  },
  'tender-bids': {
    component: TenderBidsHub,
    title: 'Tender Bids Hub',
    description: 'Browse and participate in tenders',
    icon: <Gavel size={48} />,
    gradient: 'from-rose-500 to-pink-600'
  },
  'tender-participation': {
    component: TenderParticipation,
    title: 'My Tenders',
    description: 'Track your active tender participations',
    icon: <Target size={48} />,
    gradient: 'from-pink-500 to-rose-600'
  },
  'bulk-aggregation': {
    component: BulkAggregationEngine,
    title: 'Bulk Aggregation',
    description: 'Group selling for better prices',
    icon: <Package size={48} />,
    gradient: 'from-purple-500 to-pink-600'
  },
  'trust-identity': {
    component: TrustIdentity,
    title: 'Trust Identity',
    description: 'Your reputation score and trust profile',
    icon: <Award size={48} />,
    gradient: 'from-yellow-500 to-amber-600'
  },
  'reputation-hub': {
    component: ReputationHub,
    title: 'Reputation Hub',
    description: 'Manage reviews and ratings',
    icon: <Target size={48} />,
    gradient: 'from-amber-500 to-yellow-600'
  },
  'blockchain-trace': {
    component: BlockchainTrace,
    title: 'Blockchain Trace',
    description: 'Verify product authenticity on blockchain',
    icon: <Lock size={48} />,
    gradient: 'from-blue-500 to-indigo-600'
  },
  'security-dashboard': {
    component: SecurityDashboard,
    title: 'Security Dashboard',
    description: 'Monitor security and threats',
    icon: <ShieldAlert size={48} />,
    gradient: 'from-red-500 to-rose-600'
  },
  'compliance': {
    component: ComplianceTracking,
    title: 'Compliance Tracking',
    description: 'Stay compliant with regulations',
    icon: <Lock size={48} />,
    gradient: 'from-slate-500 to-gray-600'
  },
  'export-audit': {
    component: GlobalExportAudit,
    title: 'Export Audit',
    description: 'Export compliance and documentation',
    icon: <Globe size={48} />,
    gradient: 'from-teal-500 to-cyan-600'
  },
};

function FarmerDashboardRedesignContent() {
  const { user, loading: authLoading } = useAuth('FARMER');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const handleFeatureSelect = (categoryId: string, featureId: string) => {
    setSelectedFeature(featureId);
  };

  const handleBack = () => {
    setSelectedFeature(null);
  };

  const renderContent = () => {
    if (!selectedFeature) {
      return <FarmerDashboardRedesign onFeatureSelect={handleFeatureSelect} />;
    }

    const config = featureConfig[selectedFeature];
    if (!config) {
      return <div>Feature not found</div>;
    }

    const FeatureComponent = config.component;

    return (
      <FeaturePage
        title={config.title}
        description={config.description}
        icon={config.icon}
        gradient={config.gradient}
        onBack={handleBack}
      >
        <FeatureComponent />
      </FeaturePage>
    );
  };

  return (
    <DashboardLayout navItems={farmerNav} userRole="FARMER">
      <div className="min-h-full">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default function FarmerDashboardRedesignPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="h-16 w-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <FarmerDashboardRedesignContent />
    </Suspense>
  );
}
