'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, BarChart3, Users, Package, DollarSign, Zap,
  CheckCircle, AlertCircle, FileText, Handshake, Globe, Lock,
  Activity, Target, Layers, Eye
} from 'lucide-react';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const subFeatures = [
  { id: 'trade-opportunities', name: 'Trade Opportunities', icon: Target, description: 'Discover bulk deals', color: 'blue' },
  { id: 'bulk-deals', name: 'Bulk Deals', icon: Package, description: 'Active bulk transactions', color: 'indigo', badge: 'HOT' },
  { id: 'trade-analytics', name: 'Trade Analytics', icon: BarChart3, description: 'Performance metrics', color: 'emerald' },
  { id: 'market-rates', name: 'Market Rates', icon: TrendingUp, description: 'Real-time pricing', color: 'purple' },
  { id: 'negotiation-tools', name: 'Negotiation Tools', icon: Handshake, description: 'Deal negotiation', color: 'amber' },
  { id: 'contract-management', name: 'Contract Management', icon: FileText, description: 'Digital contracts', color: 'rose' },
  { id: 'payment-terms', name: 'Payment Terms', icon: DollarSign, description: 'Flexible payments', color: 'cyan' },
  { id: 'logistics-coordination', name: 'Logistics Coordination', icon: Globe, description: 'Shipping management', color: 'red' },
  { id: 'quality-standards', name: 'Quality Standards', icon: CheckCircle, description: 'Quality assurance', color: 'teal' },
  { id: 'compliance-verification', name: 'Compliance Verification', icon: Lock, description: 'Regulatory checks', color: 'violet' },
  { id: 'performance-tracking', name: 'Performance Tracking', icon: Activity, description: 'Deal metrics', color: 'orange' },
  { id: 'deal-history', name: 'Deal History', icon: Eye, description: 'Transaction records', color: 'pink' }
];

const stats = [
  { label: 'Active Deals', value: '247', icon: Handshake, color: 'blue', trend: '+18%' },
  { label: 'Total Volume', value: '₹2.4Cr', icon: DollarSign, color: 'emerald', trend: '+24%' },
  { label: 'Avg Deal Size', value: '₹9.7L', icon: Package, color: 'purple', trend: '+12%' },
  { label: 'Success Rate', value: '96.8%', icon: CheckCircle, color: 'indigo', trend: '+5%' }
];

export default function BulkTradeAdvanced() {
  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'trade-opportunities':
        return <TradeOpportunities />;
      case 'bulk-deals':
        return <BulkDeals />;
      case 'trade-analytics':
        return <TradeAnalytics />;
      case 'market-rates':
        return <MarketRates />;
      case 'negotiation-tools':
        return <NegotiationTools />;
      case 'contract-management':
        return <ContractManagement />;
      case 'payment-terms':
        return <PaymentTerms />;
      case 'logistics-coordination':
        return <LogisticsCoordination />;
      case 'quality-standards':
        return <QualityStandards />;
      case 'compliance-verification':
        return <ComplianceVerification />;
      case 'performance-tracking':
        return <PerformanceTracking />;
      case 'deal-history':
        return <DealHistory />;
      default:
        return <TradeOpportunities />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Bulk Trade Desk"
      description="Comprehensive bulk trading platform with deal management and analytics"
      icon={TrendingUp}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}

function TradeOpportunities() {
  const opportunities = [
    { id: 1, product: 'Wheat', quantity: '500 MT', price: '₹2,400/qt', location: 'Punjab', rating: 4.8, farmers: 12 },
    { id: 2, product: 'Rice', quantity: '300 MT', price: '₹3,100/qt', location: 'Haryana', rating: 4.6, farmers: 8 },
    { id: 3, product: 'Cotton', quantity: '200 MT', price: '₹5,800/kg', location: 'Gujarat', rating: 4.9, farmers: 15 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Trade Opportunities</h2>
        <p className="text-slate-500 font-medium mt-1">Discover available bulk trading opportunities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map((opp, idx) => (
          <motion.div
            key={opp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">{opp.product}</h3>
                <p className="text-sm text-slate-600 font-medium mt-1">{opp.location}</p>
              </div>
              <div className="text-right">
                <div className="text-amber-600 font-black">⭐ {opp.rating}</div>
                <div className="text-xs text-slate-500 font-bold">{opp.farmers} farmers</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 font-bold">Quantity:</span>
                <span className="text-slate-900 font-black">{opp.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 font-bold">Price:</span>
                <span className="text-emerald-600 font-black">{opp.price}</span>
              </div>
            </div>
            <ActionButton variant="primary" icon={Handshake}>View Deal</ActionButton>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BulkDeals() {
  const deals = [
    { id: 'DEAL001', product: 'Wheat', quantity: '500 MT', value: '₹1.2Cr', status: 'active', progress: 75 },
    { id: 'DEAL002', product: 'Rice', quantity: '300 MT', value: '₹93L', status: 'active', progress: 45 },
    { id: 'DEAL003', product: 'Cotton', quantity: '200 MT', value: '₹1.16Cr', status: 'completed', progress: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Active Bulk Deals</h2>
        <p className="text-slate-500 font-medium mt-1">Current trading transactions</p>
      </div>

      <div className="space-y-4">
        {deals.map((deal, idx) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{deal.product} - {deal.quantity}</h3>
                <p className="text-sm text-slate-600 font-medium">{deal.id}</p>
              </div>
              <div className={`px-4 py-2 rounded-lg font-black text-sm uppercase ${
                deal.status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {deal.status}
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">Deal Value</span>
                <span className="text-sm font-black text-slate-900">{deal.value}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${deal.progress}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                />
              </div>
            </div>
            <div className="text-xs text-slate-500 font-bold">{deal.progress}% Complete</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TradeAnalytics() {
  const analyticsData = [
    { month: 'Jan', deals: 45, volume: 2400, value: 1200 },
    { month: 'Feb', deals: 52, volume: 2210, value: 1221 },
    { month: 'Mar', deals: 48, volume: 2290, value: 1229 },
    { month: 'Apr', deals: 61, volume: 2000, value: 1200 },
    { month: 'May', deals: 55, volume: 2181, value: 1250 },
    { month: 'Jun', deals: 67, volume: 2500, value: 1300 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Trade Analytics</h2>
        <p className="text-slate-500 font-medium mt-1">Performance metrics and trends</p>
      </div>

      <PremiumCard className="p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">Deal Volume Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="deals" fill="#3b82f6" name="Deals" />
            <Bar dataKey="volume" fill="#8b5cf6" name="Volume" />
          </BarChart>
        </ResponsiveContainer>
      </PremiumCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Avg Deal Value" value="₹9.7L" icon={DollarSign} color="emerald" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Monthly Deals" value="67" icon={Package} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Success Rate" value="96.8%" icon={CheckCircle} color="purple" />
        </PremiumCard>
      </div>
    </div>
  );
}

function MarketRates() {
  const rates = [
    { product: 'Wheat', rate: '₹2,400/qt', change: '+2.5%', trend: 'up' },
    { product: 'Rice', rate: '₹3,100/qt', change: '-1.2%', trend: 'down' },
    { product: 'Cotton', rate: '₹5,800/kg', change: '+3.8%', trend: 'up' },
    { product: 'Maize', rate: '₹1,950/qt', change: '+0.5%', trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Market Rates</h2>
        <p className="text-slate-500 font-medium mt-1">Real-time commodity pricing</p>
      </div>

      <div className="space-y-3">
        {rates.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gradient-to-r from-slate-50 to-amber-50 rounded-2xl p-4 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">{item.product}</h3>
                <p className="text-sm text-slate-600 font-medium">{item.rate}</p>
              </div>
              <div className={`text-right px-3 py-2 rounded-lg font-black ${
                item.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}>
                {item.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function NegotiationTools() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Negotiation Tools</h2>
        <p className="text-slate-500 font-medium mt-1">Advanced deal negotiation features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center">
            <Handshake size={40} className="mx-auto text-blue-600 mb-4" />
            <h3 className="text-lg font-black text-slate-900 mb-2">Counter Offers</h3>
            <p className="text-sm text-slate-600 font-medium">Make and receive counter proposals</p>
          </div>
        </PremiumCard>

        <PremiumCard className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center">
            <Target size={40} className="mx-auto text-purple-600 mb-4" />
            <h3 className="text-lg font-black text-slate-900 mb-2">Price Negotiation</h3>
            <p className="text-sm text-slate-600 font-medium">Dynamic pricing discussions</p>
          </div>
        </PremiumCard>
      </div>

      <ActionButton variant="primary" icon={Handshake}>Start Negotiation</ActionButton>
    </div>
  );
}

function ContractManagement() {
  const contracts = [
    { id: 'CNT001', type: 'Supply Agreement', status: 'signed', date: '2024-01-15' },
    { id: 'CNT002', type: 'Quality Agreement', status: 'pending', date: '2024-01-18' },
    { id: 'CNT003', type: 'Payment Terms', status: 'signed', date: '2024-01-10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Contract Management</h2>
        <p className="text-slate-500 font-medium mt-1">Digital contract handling</p>
      </div>

      <div className="space-y-3">
        {contracts.map((contract, idx) => (
          <PremiumCard key={idx} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" size={24} />
                <div>
                  <h3 className="font-black text-slate-900">{contract.type}</h3>
                  <p className="text-xs text-slate-500 font-mono">{contract.id}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                contract.status === 'signed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {contract.status}
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function PaymentTerms() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Payment Terms</h2>
        <p className="text-slate-500 font-medium mt-1">Flexible payment options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard className="p-6 bg-gradient-to-br from-emerald-50 to-green-50">
          <h3 className="font-black text-slate-900 mb-4">Advance Payment</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 font-bold">Discount:</span>
              <span className="text-emerald-600 font-black">2-3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-bold">Timeline:</span>
              <span className="text-slate-900 font-black">Immediate</span>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="font-black text-slate-900 mb-4">Installment Plan</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 font-bold">Installments:</span>
              <span className="text-blue-600 font-black">3-6 months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-bold">Interest:</span>
              <span className="text-slate-900 font-black">0-2%</span>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function LogisticsCoordination() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Logistics Coordination</h2>
        <p className="text-slate-500 font-medium mt-1">Shipping and delivery management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Active Shipments" value="12" icon={Package} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Avg Delivery" value="4.2 days" icon={Globe} color="emerald" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="On-Time Rate" value="98.5%" icon={CheckCircle} color="purple" />
        </PremiumCard>
      </div>
    </div>
  );
}

function QualityStandards() {
  const standards = [
    { name: 'Moisture Content', target: '< 12%', current: '11.2%', status: 'pass' },
    { name: 'Purity', target: '> 98%', current: '98.5%', status: 'pass' },
    { name: 'Foreign Matter', target: '< 0.5%', current: '0.3%', status: 'pass' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Quality Standards</h2>
        <p className="text-slate-500 font-medium mt-1">Quality assurance metrics</p>
      </div>

      <div className="space-y-4">
        {standards.map((std, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-slate-900">{std.name}</h3>
              <div className="text-emerald-600 font-black">✓ {std.status}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-600 font-bold">Target</p>
                <p className="text-slate-900 font-black">{std.target}</p>
              </div>
              <div>
                <p className="text-slate-600 font-bold">Current</p>
                <p className="text-emerald-600 font-black">{std.current}</p>
              </div>
              <div>
                <p className="text-slate-600 font-bold">Status</p>
                <p className="text-emerald-600 font-black uppercase text-xs">Pass</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ComplianceVerification() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Compliance Verification</h2>
        <p className="text-slate-500 font-medium mt-1">Regulatory compliance checks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard className="p-6 bg-gradient-to-br from-emerald-50 to-green-50">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="text-emerald-600" size={32} />
            <div>
              <h3 className="font-black text-slate-900">All Compliant</h3>
              <p className="text-sm text-slate-600 font-medium">100% verified</p>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="p-6">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold">Export License</span>
              <CheckCircle className="text-emerald-600" size={20} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold">Quality Cert</span>
              <CheckCircle className="text-emerald-600" size={20} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold">Tax Compliance</span>
              <CheckCircle className="text-emerald-600" size={20} />
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function PerformanceTracking() {
  const performanceData = [
    { metric: 'Deal Closure Rate', value: 96.8, target: 95 },
    { metric: 'Customer Satisfaction', value: 4.7, target: 4.5 },
    { metric: 'On-Time Delivery', value: 98.5, target: 97 },
    { metric: 'Quality Score', value: 9.2, target: 9.0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Performance Tracking</h2>
        <p className="text-slate-500 font-medium mt-1">Key performance indicators</p>
      </div>

      <div className="space-y-4">
        {performanceData.map((perf, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-4 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-slate-900">{perf.metric}</span>
              <span className="text-blue-600 font-black">{perf.value}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(perf.value / 10) * 100}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DealHistory() {
  const history = [
    { id: 'DEAL001', product: 'Wheat', quantity: '500 MT', value: '₹1.2Cr', date: '2024-01-15', status: 'completed' },
    { id: 'DEAL002', product: 'Rice', quantity: '300 MT', value: '₹93L', date: '2024-01-10', status: 'completed' },
    { id: 'DEAL003', product: 'Cotton', quantity: '200 MT', value: '₹1.16Cr', date: '2024-01-05', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Deal History</h2>
        <p className="text-slate-500 font-medium mt-1">Past transactions and records</p>
      </div>

      <div className="space-y-3">
        {history.map((deal, idx) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-2xl p-4 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-black text-slate-900">{deal.product} - {deal.quantity}</h3>
                <p className="text-xs text-slate-500 font-mono">{deal.id}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">{deal.value}</div>
                <div className="text-xs text-slate-500 font-medium">{deal.date}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
