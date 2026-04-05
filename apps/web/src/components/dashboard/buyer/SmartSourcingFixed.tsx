'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FeatureTabsDisplay } from './shared/FeatureTabsDisplay';
import {
  Search, TrendingUp, Users, FileText, BarChart3, Star,
  AlertCircle, DollarSign, Leaf, CheckCircle, Handshake, Zap,
  ArrowUpRight, Package, MapPin, Clock
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const subFeatures = [
  { id: 'discovery', name: 'Supplier Discovery', icon: Search, description: 'Find verified suppliers' },
  { id: 'optimization', name: 'Source Optimization', icon: TrendingUp, description: 'Optimize sourcing strategy' },
  { id: 'comparison', name: 'Supplier Comparison', icon: Users, description: 'Compare supplier metrics' },
  { id: 'contracts', name: 'Contract Management', icon: FileText, description: 'Manage supplier contracts' },
  { id: 'analytics', name: 'Sourcing Analytics', icon: BarChart3, description: 'Track sourcing metrics' },
  { id: 'performance', name: 'Supplier Performance', icon: Star, description: 'Monitor performance' },
  { id: 'risk', name: 'Risk Assessment', icon: AlertCircle, description: 'Assess supply risks' },
  { id: 'cost', name: 'Cost Analysis', icon: DollarSign, description: 'Analyze sourcing costs' },
  { id: 'sustainability', name: 'Sustainability Metrics', icon: Leaf, description: 'Track sustainability' },
  { id: 'compliance', name: 'Compliance Verification', icon: CheckCircle, description: 'Verify compliance' },
  { id: 'relationship', name: 'Relationship Management', icon: Handshake, description: 'Manage relationships' },
  { id: 'negotiation', name: 'Negotiation Tools', icon: Zap, description: 'Negotiate terms' }
];

const stats = [
  { label: 'Active Suppliers', value: '2,847', icon: Users, color: 'blue', trend: '+12%' },
  { label: 'Avg Lead Time', value: '4.2d', icon: Clock, color: 'emerald', trend: '-8%' },
  { label: 'Cost Savings', value: '$124K', icon: DollarSign, color: 'amber', trend: '+24%' },
  { label: 'Compliance Rate', value: '98.5%', icon: CheckCircle, color: 'purple', trend: '+3%' }
];

function SupplierDiscovery() {
  const data = [
    { name: 'Verified', value: 2847, fill: '#3b82f6' },
    { name: 'Pending', value: 342, fill: '#f59e0b' },
    { name: 'Inactive', value: 156, fill: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-black text-slate-900 mb-4">Supplier Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Search className="text-blue-600" size={20} />
              <h4 className="font-black text-slate-900">Advanced Search</h4>
            </div>
            <p className="text-sm text-slate-600">Find suppliers by location, product, certification</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-emerald-600" size={20} />
              <h4 className="font-black text-slate-900">Verified Badge</h4>
            </div>
            <p className="text-sm text-slate-600">Only show certified and verified suppliers</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SourceOptimization() {
  const data = [
    { month: 'Jan', cost: 45000, efficiency: 78 },
    { month: 'Feb', cost: 42000, efficiency: 82 },
    { month: 'Mar', cost: 38000, efficiency: 85 },
    { month: 'Apr', cost: 35000, efficiency: 88 },
    { month: 'May', cost: 32000, efficiency: 91 },
    { month: 'Jun', cost: 28000, efficiency: 94 }
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="text-lg font-black text-slate-900 mb-4">Optimization Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Consolidation', value: '34%', icon: Package },
          { label: 'Lead Time', value: '-28%', icon: Clock },
          { label: 'Efficiency', value: '+94%', icon: TrendingUp }
        ].map((item, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <item.icon className="text-blue-600" size={20} />
              <span className="text-sm font-medium text-slate-600">{item.label}</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{item.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SupplierComparison() {
  const suppliers = [
    { name: 'FarmCo Ltd', price: 45, quality: 92, delivery: 88, rating: 4.8 },
    { name: 'AgriSupply', price: 52, quality: 95, delivery: 92, rating: 4.9 },
    { name: 'GreenSource', price: 48, quality: 88, delivery: 85, rating: 4.6 }
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-3 px-4 font-black text-slate-900">Supplier</th>
              <th className="text-center py-3 px-4 font-black text-slate-900">Price</th>
              <th className="text-center py-3 px-4 font-black text-slate-900">Quality</th>
              <th className="text-center py-3 px-4 font-black text-slate-900">Delivery</th>
              <th className="text-center py-3 px-4 font-black text-slate-900">Rating</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, idx) => (
              <motion.tr key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4 font-bold text-slate-900">{supplier.name}</td>
                <td className="text-center py-4 px-4"><span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-lg font-bold">${supplier.price}</span></td>
                <td className="text-center py-4 px-4"><span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-lg font-bold">{supplier.quality}%</span></td>
                <td className="text-center py-4 px-4"><span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-lg font-bold">{supplier.delivery}%</span></td>
                <td className="text-center py-4 px-4"><span className="bg-purple-100 text-purple-900 px-3 py-1 rounded-lg font-bold">⭐ {supplier.rating}</span></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

function ContractManagement() {
  const contracts = [
    { id: 1, supplier: 'FarmCo Ltd', status: 'Active', expires: '2025-12-31', value: '$450K' },
    { id: 2, supplier: 'AgriSupply', status: 'Pending', expires: '2025-06-30', value: '$320K' },
    { id: 3, supplier: 'GreenSource', status: 'Expiring', expires: '2025-02-28', value: '$280K' }
  ];

  return (
    <div className="space-y-6">
      {contracts.map((contract, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-black text-slate-900">{contract.supplier}</h4>
              <p className="text-sm text-slate-500">Expires: {contract.expires}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg font-bold text-sm ${
              contract.status === 'Active' ? 'bg-emerald-100 text-emerald-900' :
              contract.status === 'Pending' ? 'bg-amber-100 text-amber-900' :
              'bg-red-100 text-red-900'
            }`}>{contract.status}</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{contract.value}</div>
        </motion.div>
      ))}
    </div>
  );
}

function SourcingAnalytics() {
  const data = [
    { category: 'Vegetables', suppliers: 245, orders: 1240, value: '$450K' },
    { category: 'Grains', suppliers: 189, orders: 856, value: '$380K' },
    { category: 'Fruits', suppliers: 156, orders: 723, value: '$320K' },
    { category: 'Dairy', suppliers: 98, orders: 412, value: '$280K' }
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="text-lg font-black text-slate-900 mb-4">Category Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="suppliers" fill="#3b82f6" />
            <Bar dataKey="orders" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

function SupplierPerformance() {
  const metrics = [
    { name: 'On-Time Delivery', score: 94, target: 95 },
    { name: 'Quality Score', score: 92, target: 90 },
    { name: 'Price Competitiveness', score: 88, target: 85 },
    { name: 'Communication', score: 96, target: 90 }
  ];

  return (
    <div className="space-y-6">
      {metrics.map((metric, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">{metric.name}</span>
            <span className="text-sm font-black text-blue-600">{metric.score}/{metric.target}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(metric.score / metric.target) * 100}%` }} transition={{ delay: idx * 0.1 + 0.2, duration: 0.8 }} className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RiskAssessment() {
  const risks = [
    { level: 'High', count: 3, color: 'red' },
    { level: 'Medium', count: 12, color: 'amber' },
    { level: 'Low', count: 45, color: 'emerald' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {risks.map((risk, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`bg-${risk.color}-50 rounded-2xl p-6 border border-${risk.color}-200`}>
            <div className="text-3xl font-black text-slate-900 mb-2">{risk.count}</div>
            <div className={`text-sm font-bold text-${risk.color}-900`}>{risk.level} Risk Suppliers</div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 border border-slate-200">
        <h4 className="font-black text-slate-900 mb-4">Risk Mitigation Actions</h4>
        <ul className="space-y-3">
          {['Diversify high-risk suppliers', 'Increase safety stock', 'Establish backup suppliers'].map((action, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <CheckCircle className="text-emerald-600" size={20} />
              <span className="text-slate-700 font-medium">{action}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

function CostAnalysis() {
  const data = [
    { month: 'Jan', cost: 125000, budget: 130000 },
    { month: 'Feb', cost: 118000, budget: 130000 },
    { month: 'Mar', cost: 112000, budget: 130000 },
    { month: 'Apr', cost: 108000, budget: 130000 },
    { month: 'May', cost: 102000, budget: 130000 },
    { month: 'Jun', cost: 98000, budget: 130000 }
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="text-lg font-black text-slate-900 mb-4">Cost vs Budget</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} name="Actual Cost" />
            <Line type="monotone" dataKey="budget" stroke="#10b981" strokeWidth={2} name="Budget" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

function SustainabilityMetrics() {
  const metrics = [
    { label: 'Carbon Neutral Suppliers', value: '68%', icon: Leaf },
    { label: 'Organic Certified', value: '45%', icon: CheckCircle },
    { label: 'Fair Trade', value: '52%', icon: Handshake }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
          <metric.icon className="text-emerald-600 mb-4" size={32} />
          <div className="text-3xl font-black text-slate-900 mb-2">{metric.value}</div>
          <div className="text-sm font-bold text-slate-600">{metric.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

function ComplianceVerification() {
  const certifications = [
    { name: 'ISO 9001', verified: 234, pending: 12 },
    { name: 'ISO 14001', verified: 189, pending: 8 },
    { name: 'FSSC 22000', verified: 156, pending: 5 }
  ];

  return (
    <div className="space-y-6">
      {certifications.map((cert, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-slate-900">{cert.name}</h4>
            <CheckCircle className="text-emerald-600" size={24} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="text-2xl font-black text-emerald-900">{cert.verified}</div>
              <div className="text-sm text-emerald-700 font-medium">Verified</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="text-2xl font-black text-amber-900">{cert.pending}</div>
              <div className="text-sm text-amber-700 font-medium">Pending</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function RelationshipManagement() {
  const relationships = [
    { supplier: 'FarmCo Ltd', status: 'Strategic', since: '2020', interactions: 245 },
    { supplier: 'AgriSupply', status: 'Core', since: '2021', interactions: 189 },
    { supplier: 'GreenSource', status: 'Preferred', since: '2022', interactions: 156 }
  ];

  return (
    <div className="space-y-6">
      {relationships.map((rel, idx) => (
        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-black text-slate-900">{rel.supplier}</h4>
              <p className="text-sm text-slate-500">Partner since {rel.since}</p>
            </div>
            <span className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg font-bold text-sm">{rel.status}</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{rel.interactions} interactions</div>
        </motion.div>
      ))}
    </div>
  );
}

function NegotiationTools() {
  const templates = [
    { name: 'Volume Discount', savings: '15-20%' },
    { name: 'Long-term Contract', savings: '10-15%' },
    { name: 'Seasonal Pricing', savings: '8-12%' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 cursor-pointer hover:shadow-lg transition-all">
            <h4 className="font-black text-slate-900 mb-2">{template.name}</h4>
            <div className="text-2xl font-black text-blue-600">{template.savings}</div>
            <p className="text-sm text-slate-600 font-medium mt-2">Potential savings</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function SmartSourcingFixed() {
  const renderSubFeature = (id: string) => {
    switch (id) {
      case 'discovery': return <SupplierDiscovery />;
      case 'optimization': return <SourceOptimization />;
      case 'comparison': return <SupplierComparison />;
      case 'contracts': return <ContractManagement />;
      case 'analytics': return <SourcingAnalytics />;
      case 'performance': return <SupplierPerformance />;
      case 'risk': return <RiskAssessment />;
      case 'cost': return <CostAnalysis />;
      case 'sustainability': return <SustainabilityMetrics />;
      case 'compliance': return <ComplianceVerification />;
      case 'relationship': return <RelationshipManagement />;
      case 'negotiation': return <NegotiationTools />;
      default: return null;
    }
  };

  return (
    <FeatureTabsDisplay
      title="Smart Sourcing"
      description="Intelligent supplier discovery and management"
      icon={Search}
      stats={stats}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
    />
  );
}
