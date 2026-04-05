'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, TrendingUp, Users, Shield, BarChart3, CheckCircle,
  AlertCircle, DollarSign, Zap, FileText, MapPin, Eye,
  Phone, Mail, Award, Smartphone, Settings, Activity
} from 'lucide-react';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const subFeatures = [
  { id: 'supplier-discovery', name: 'Supplier Discovery', icon: Search, description: 'Find suppliers', color: 'blue' },
  { id: 'source-optimization', name: 'Source Optimization', icon: TrendingUp, description: 'Optimize sourcing', color: 'indigo', badge: 'NEW' },
  { id: 'supplier-comparison', name: 'Supplier Comparison', icon: Users, description: 'Compare suppliers', color: 'emerald' },
  { id: 'contract-management', name: 'Contract Management', icon: FileText, description: 'Manage contracts', color: 'purple' },
  { id: 'sourcing-analytics', name: 'Sourcing Analytics', icon: BarChart3, description: 'Analytics insights', color: 'rose' },
  { id: 'supplier-performance', name: 'Supplier Performance', icon: Activity, description: 'Performance tracking', color: 'amber' },
  { id: 'risk-assessment', name: 'Risk Assessment', icon: AlertCircle, description: 'Risk analysis', color: 'cyan' },
  { id: 'cost-analysis', name: 'Cost Analysis', icon: DollarSign, description: 'Cost breakdown', color: 'teal' },
  { id: 'sustainability-metrics', name: 'Sustainability Metrics', icon: Zap, description: 'Eco metrics', color: 'violet' },
  { id: 'compliance-verification', name: 'Compliance Verification', icon: Shield, description: 'Verify compliance', color: 'orange' },
  { id: 'relationship-management', name: 'Relationship Management', icon: Phone, description: 'Manage relations', color: 'pink' },
  { id: 'negotiation-tools', name: 'Negotiation Tools', icon: Eye, description: 'Negotiation support', color: 'red' }
];

const stats = [
  { label: 'Active Suppliers', value: '234', icon: Users, color: 'blue', trend: '+18%' },
  { label: 'Cost Savings', value: '₹8.5L', icon: DollarSign, color: 'emerald', trend: '+22%' },
  { label: 'Avg Lead Time', value: '3.2 days', icon: Activity, color: 'purple', trend: '-15%' },
  { label: 'Quality Score', value: '94.5%', icon: CheckCircle, color: 'indigo', trend: '+5%' }
];

export default function SmartSourcingAdvanced() {
  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'supplier-discovery': return <SupplierDiscovery />;
      case 'source-optimization': return <SourceOptimization />;
      case 'supplier-comparison': return <SupplierComparison />;
      case 'contract-management': return <ContractManagement />;
      case 'sourcing-analytics': return <SourcingAnalytics />;
      case 'supplier-performance': return <SupplierPerformance />;
      case 'risk-assessment': return <RiskAssessment />;
      case 'cost-analysis': return <CostAnalysis />;
      case 'sustainability-metrics': return <SustainabilityMetrics />;
      case 'compliance-verification': return <ComplianceVerification />;
      case 'relationship-management': return <RelationshipManagement />;
      case 'negotiation-tools': return <NegotiationTools />;
      default: return <SupplierDiscovery />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Smart Sourcing"
      description="Intelligent supplier discovery and sourcing optimization"
      icon={Search}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}

function SupplierDiscovery() {
  const suppliers = [
    { id: 1, name: 'Green Valley Co-op', location: 'Punjab', rating: 4.8, products: 12 },
    { id: 2, name: 'Organic Harvest', location: 'Haryana', rating: 4.9, products: 8 },
    { id: 3, name: 'Sunrise Traders', location: 'UP', rating: 4.5, products: 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Supplier Discovery</h2>
          <p className="text-slate-500 font-medium mt-1">Find verified suppliers</p>
        </div>
        <ActionButton variant="primary" icon={Search}>Search Suppliers</ActionButton>
      </div>

      <div className="space-y-3">
        {suppliers.map((supplier, idx) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">{supplier.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-slate-600 font-medium">📍 {supplier.location}</span>
                  <span className="text-amber-600 font-black">⭐ {supplier.rating}</span>
                  <span className="text-slate-600 font-medium">{supplier.products} products</span>
                </div>
              </div>
              <button className="h-10 px-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
                View
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SourceOptimization() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Source Optimization</h2>
        <p className="text-slate-500 font-medium mt-1">Optimize your sourcing strategy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Cost Reduction" value="22%" icon={DollarSign} color="emerald" trend="+5%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Lead Time" value="-15%" icon={Activity} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Quality Gain" value="+8%" icon={CheckCircle} color="purple" />
        </PremiumCard>
      </div>
    </div>
  );
}

function SupplierComparison() {
  const comparison = [
    { metric: 'Price', supplier1: '₹85/kg', supplier2: '₹82/kg', supplier3: '₹88/kg' },
    { metric: 'Quality', supplier1: '95%', supplier2: '98%', supplier3: '92%' },
    { metric: 'Delivery', supplier1: '2 days', supplier2: '3 days', supplier3: '2.5 days' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Supplier Comparison</h2>
        <p className="text-slate-500 font-medium mt-1">Compare suppliers side by side</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-4 py-3 text-left font-black text-slate-900">Metric</th>
              <th className="px-4 py-3 text-left font-black text-slate-900">Green Valley</th>
              <th className="px-4 py-3 text-left font-black text-slate-900">Organic Harvest</th>
              <th className="px-4 py-3 text-left font-black text-slate-900">Sunrise</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-200">
                <td className="px-4 py-3 font-bold text-slate-900">{row.metric}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{row.supplier1}</td>
                <td className="px-4 py-3 text-emerald-600 font-black">{row.supplier2}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{row.supplier3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContractManagement() {
  const contracts = [
    { id: 1, supplier: 'Green Valley', status: 'active', expiry: '2024-12-31' },
    { id: 2, supplier: 'Organic Harvest', status: 'active', expiry: '2025-06-30' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Contract Management</h2>
        <p className="text-slate-500 font-medium mt-1">Manage supplier contracts</p>
      </div>

      <div className="space-y-3">
        {contracts.map((contract, idx) => (
          <PremiumCard key={contract.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">{contract.supplier}</h3>
                <p className="text-sm text-slate-600 font-medium">Expires: {contract.expiry}</p>
              </div>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-black uppercase">
                {contract.status}
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function SourcingAnalytics() {
  const chartData = [
    { month: 'Jan', suppliers: 45, cost: 125000 },
    { month: 'Feb', suppliers: 52, cost: 145000 },
    { month: 'Mar', suppliers: 48, cost: 135000 },
    { month: 'Apr', suppliers: 61, cost: 165000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Sourcing Analytics</h2>
        <p className="text-slate-500 font-medium mt-1">Sourcing trends and insights</p>
      </div>

      <PremiumCard className="p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">Monthly Sourcing Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="suppliers" fill="#3b82f6" name="Suppliers" />
          </BarChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function SupplierPerformance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Supplier Performance</h2>
        <p className="text-slate-500 font-medium mt-1">Track supplier metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <MetricDisplay label="On-Time Rate" value="96.2%" icon={CheckCircle} color="emerald" trend="+2%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Quality Score" value="94.5%" icon={Shield} color="blue" trend="+3%" />
        </PremiumCard>
      </div>
    </div>
  );
}

function RiskAssessment() {
  const risks = [
    { risk: 'Financial Risk', level: 'Low', color: 'emerald' },
    { risk: 'Supply Risk', level: 'Low', color: 'emerald' },
    { risk: 'Quality Risk', level: 'Very Low', color: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Risk Assessment</h2>
        <p className="text-slate-500 font-medium mt-1">Supplier risk analysis</p>
      </div>

      <div className="space-y-3">
        {risks.map((item, idx) => (
          <PremiumCard key={idx} className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900">{item.risk}</span>
              <div className={`px-3 py-1 bg-${item.color}-100 text-${item.color}-600 rounded-lg text-xs font-black uppercase`}>
                {item.level}
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function CostAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Cost Analysis</h2>
        <p className="text-slate-500 font-medium mt-1">Detailed cost breakdown</p>
      </div>

      <div className="space-y-3">
        <PremiumCard className="p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-slate-700">Product Cost</span>
            <span className="font-black text-slate-900">₹85/kg</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
          </div>
        </PremiumCard>

        <PremiumCard className="p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-slate-700">Logistics</span>
            <span className="font-black text-slate-900">₹8/kg</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }} />
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function SustainabilityMetrics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Sustainability Metrics</h2>
        <p className="text-slate-500 font-medium mt-1">Eco-friendly sourcing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard className="p-6 bg-gradient-to-br from-emerald-50 to-green-50">
          <h3 className="font-black text-slate-900 mb-3">Carbon Footprint</h3>
          <div className="text-3xl font-black text-emerald-600 mb-2">2.3 tons</div>
          <p className="text-sm text-slate-600 font-medium">Per 1000 kg</p>
        </PremiumCard>

        <PremiumCard className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
          <h3 className="font-black text-slate-900 mb-3">Organic Certified</h3>
          <div className="text-3xl font-black text-blue-600 mb-2">85%</div>
          <p className="text-sm text-slate-600 font-medium">Of suppliers</p>
        </PremiumCard>
      </div>
    </div>
  );
}

function ComplianceVerification() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Compliance Verification</h2>
        <p className="text-slate-500 font-medium mt-1">Verify supplier compliance</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">All Compliant</h3>
          <p className="text-slate-600 font-medium">100% of suppliers verified</p>
        </div>
      </PremiumCard>
    </div>
  );
}

function RelationshipManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Relationship Management</h2>
        <p className="text-slate-500 font-medium mt-1">Manage supplier relationships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <MetricDisplay label="Active Relationships" value="45" icon={Users} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Satisfaction Score" value="4.7/5" icon={Award} color="amber" />
        </PremiumCard>
      </div>
    </div>
  );
}

function NegotiationTools() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Negotiation Tools</h2>
        <p className="text-slate-500 font-medium mt-1">Negotiation support and analytics</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <Eye size={48} className="mx-auto text-purple-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">Negotiation Insights</h3>
          <p className="text-slate-600 font-medium">AI-powered negotiation recommendations</p>
        </div>
      </PremiumCard>
    </div>
  );
}
