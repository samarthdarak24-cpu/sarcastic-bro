'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Star, Clock, CheckCircle, AlertCircle,
  BarChart3, Eye, Zap, Shield, FileText, Activity,
  MapPin, Phone, Mail, Award, Smartphone, Settings
} from 'lucide-react';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const subFeatures = [
  { id: 'supplier-analytics', name: 'Supplier Analytics', icon: BarChart3, description: 'Performance metrics', color: 'blue' },
  { id: 'performance-metrics', name: 'Performance Metrics', icon: TrendingUp, description: 'KPI tracking', color: 'indigo', badge: 'NEW' },
  { id: 'reliability-scores', name: 'Reliability Scores', icon: Shield, description: 'Trust ratings', color: 'emerald' },
  { id: 'quality-trends', name: 'Quality Trends', icon: CheckCircle, description: 'Quality analysis', color: 'purple' },
  { id: 'pricing-history', name: 'Pricing History', icon: Activity, description: 'Price tracking', color: 'rose' },
  { id: 'delivery-performance', name: 'Delivery Performance', icon: Clock, description: 'On-time rates', color: 'amber' },
  { id: 'communication-quality', name: 'Communication Quality', icon: Phone, description: 'Response times', color: 'cyan' },
  { id: 'compliance-records', name: 'Compliance Records', icon: FileText, description: 'Certifications', color: 'teal' },
  { id: 'market-position', name: 'Market Position', icon: MapPin, description: 'Market ranking', color: 'violet' },
  { id: 'growth-trends', name: 'Growth Trends', icon: TrendingUp, description: 'Growth analysis', color: 'orange' },
  { id: 'risk-indicators', name: 'Risk Indicators', icon: AlertCircle, description: 'Risk assessment', color: 'pink' },
  { id: 'recommendation-engine', name: 'Recommendation Engine', icon: Zap, description: 'Smart suggestions', color: 'red' }
];

const stats = [
  { label: 'Active Suppliers', value: '156', icon: Users, color: 'blue', trend: '+12%' },
  { label: 'Avg Rating', value: '4.7/5', icon: Star, color: 'amber', trend: '+0.2' },
  { label: 'On-Time Rate', value: '94.2%', icon: Clock, color: 'emerald', trend: '+3%' },
  { label: 'Quality Score', value: '92.8%', icon: CheckCircle, color: 'indigo', trend: '+2%' }
];

export default function SupplierInsightsAdvanced() {
  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'supplier-analytics': return <SupplierAnalytics />;
      case 'performance-metrics': return <PerformanceMetrics />;
      case 'reliability-scores': return <ReliabilityScores />;
      case 'quality-trends': return <QualityTrends />;
      case 'pricing-history': return <PricingHistory />;
      case 'delivery-performance': return <DeliveryPerformance />;
      case 'communication-quality': return <CommunicationQuality />;
      case 'compliance-records': return <ComplianceRecords />;
      case 'market-position': return <MarketPosition />;
      case 'growth-trends': return <GrowthTrends />;
      case 'risk-indicators': return <RiskIndicators />;
      case 'recommendation-engine': return <RecommendationEngine />;
      default: return <SupplierAnalytics />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Supplier Insights"
      description="Comprehensive supplier performance analytics and intelligence"
      icon={Users}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}

function SupplierAnalytics() {
  const suppliers = [
    { id: 1, name: 'Green Valley Co-op', rating: 4.8, orders: 45, reliability: 96, status: 'excellent' },
    { id: 2, name: 'Organic Harvest', rating: 4.9, orders: 38, reliability: 98, status: 'excellent' },
    { id: 3, name: 'Sunrise Traders', rating: 4.5, orders: 32, reliability: 92, status: 'good' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Supplier Analytics</h2>
        <p className="text-slate-500 font-medium mt-1">Comprehensive supplier performance data</p>
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{supplier.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-amber-600 font-black">⭐ {supplier.rating}</span>
                  <span className="text-slate-600 font-medium">{supplier.orders} orders</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                supplier.status === 'excellent' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {supplier.status}
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${supplier.reliability}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
              />
            </div>
            <div className="text-xs text-slate-600 font-bold mt-2">Reliability: {supplier.reliability}%</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PerformanceMetrics() {
  const metrics = [
    { metric: 'Order Fulfillment', value: 98, unit: '%' },
    { metric: 'Quality Consistency', value: 95, unit: '%' },
    { metric: 'Delivery Timeliness', value: 94, unit: '%' },
    { metric: 'Communication Score', value: 96, unit: '%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Performance Metrics</h2>
        <p className="text-slate-500 font-medium mt-1">Key performance indicators</p>
      </div>

      <div className="space-y-4">
        {metrics.map((item, idx) => (
          <PremiumCard key={idx} className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-slate-900">{item.metric}</h3>
              <div className="text-2xl font-black text-blue-600">{item.value}{item.unit}</div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: `${item.value}%` }} />
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function ReliabilityScores() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Reliability Scores</h2>
        <p className="text-slate-500 font-medium mt-1">Trust and reliability ratings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard className="p-6">
          <MetricDisplay label="Overall Reliability" value="96%" icon={Shield} color="emerald" trend="+2%" />
        </PremiumCard>
        <PremiumCard className="p-6">
          <MetricDisplay label="Trust Score" value="4.8/5" icon={Star} color="amber" />
        </PremiumCard>
      </div>
    </div>
  );
}

function QualityTrends() {
  const trendData = [
    { month: 'Jan', quality: 92 },
    { month: 'Feb', quality: 94 },
    { month: 'Mar', quality: 93 },
    { month: 'Apr', quality: 95 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Quality Trends</h2>
        <p className="text-slate-500 font-medium mt-1">Quality score progression</p>
      </div>

      <PremiumCard className="p-8">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function PricingHistory() {
  const priceData = [
    { date: 'Jan', price: 85 },
    { date: 'Feb', price: 83 },
    { date: 'Mar', price: 82 },
    { date: 'Apr', price: 84 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Pricing History</h2>
        <p className="text-slate-500 font-medium mt-1">Historical pricing trends</p>
      </div>

      <PremiumCard className="p-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priceData}>
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="price" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function DeliveryPerformance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Delivery Performance</h2>
        <p className="text-slate-500 font-medium mt-1">On-time delivery metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="On-Time Rate" value="94.2%" icon={Clock} color="emerald" trend="+3%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Avg Delay" value="0.8 days" icon={AlertCircle} color="amber" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Perfect Orders" value="89%" icon={CheckCircle} color="blue" />
        </PremiumCard>
      </div>
    </div>
  );
}

function CommunicationQuality() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Communication Quality</h2>
        <p className="text-slate-500 font-medium mt-1">Response times and quality</p>
      </div>

      <div className="space-y-4">
        <PremiumCard className="p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-slate-700">Avg Response Time</span>
            <span className="font-black text-slate-900">2.3 hours</span>
          </div>
          <div className="text-sm text-slate-600 font-medium">Excellent responsiveness</div>
        </PremiumCard>

        <PremiumCard className="p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-slate-700">Communication Score</span>
            <span className="font-black text-emerald-600">96%</span>
          </div>
          <div className="text-sm text-slate-600 font-medium">Very professional</div>
        </PremiumCard>
      </div>
    </div>
  );
}

function ComplianceRecords() {
  const certs = [
    { name: 'ISO 9001', status: 'valid', expiry: '2025-06-15' },
    { name: 'AGMARK', status: 'valid', expiry: '2024-12-31' },
    { name: 'Organic Cert', status: 'valid', expiry: '2025-03-20' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Compliance Records</h2>
        <p className="text-slate-500 font-medium mt-1">Certifications and compliance</p>
      </div>

      <div className="space-y-3">
        {certs.map((cert, idx) => (
          <PremiumCard key={idx} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">{cert.name}</h3>
                <p className="text-xs text-slate-600 font-medium">Expires: {cert.expiry}</p>
              </div>
              <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-black uppercase">
                {cert.status}
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function MarketPosition() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Market Position</h2>
        <p className="text-slate-500 font-medium mt-1">Supplier ranking and position</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="font-black text-slate-900 mb-3">Market Rank</h3>
          <div className="text-4xl font-black text-blue-600 mb-2">#5</div>
          <p className="text-sm text-slate-600 font-medium">Out of 156 suppliers</p>
        </PremiumCard>

        <PremiumCard className="p-6 bg-gradient-to-br from-emerald-50 to-green-50">
          <h3 className="font-black text-slate-900 mb-3">Market Share</h3>
          <div className="text-4xl font-black text-emerald-600 mb-2">8.2%</div>
          <p className="text-sm text-slate-600 font-medium">Growing steadily</p>
        </PremiumCard>
      </div>
    </div>
  );
}

function GrowthTrends() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Growth Trends</h2>
        <p className="text-slate-500 font-medium mt-1">Supplier growth analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <MetricDisplay label="YoY Growth" value="+24%" icon={TrendingUp} color="emerald" trend="+8%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Order Growth" value="+18%" icon={Activity} color="blue" trend="+5%" />
        </PremiumCard>
      </div>
    </div>
  );
}

function RiskIndicators() {
  const risks = [
    { risk: 'Financial Stability', level: 'Low', color: 'emerald' },
    { risk: 'Supply Disruption', level: 'Low', color: 'emerald' },
    { risk: 'Quality Issues', level: 'Very Low', color: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Risk Indicators</h2>
        <p className="text-slate-500 font-medium mt-1">Risk assessment and alerts</p>
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

function RecommendationEngine() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Recommendation Engine</h2>
        <p className="text-slate-500 font-medium mt-1">Smart supplier recommendations</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <Zap size={48} className="mx-auto text-purple-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">Recommended Supplier</h3>
          <p className="text-lg font-black text-purple-600 mb-2">Organic Harvest</p>
          <p className="text-sm text-slate-600 font-medium">Best quality-price ratio for your needs</p>
        </div>
      </PremiumCard>
    </div>
  );
}
