'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Map, BarChart3, TrendingUp, Users, Target, Zap,
  CheckCircle, AlertCircle, Globe, Layers, Eye, Activity,
  Award, Compass, Network, Lightbulb
} from 'lucide-react';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { ScatterChart, Scatter, LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const subFeatures = [
  { id: 'cluster-analysis', name: 'Cluster Analysis', icon: Network, description: 'Regional clustering', color: 'blue' },
  { id: 'regional-mapping', name: 'Regional Mapping', icon: Map, description: 'Geographic insights', color: 'indigo', badge: 'LIVE' },
  { id: 'supplier-clustering', name: 'Supplier Clustering', icon: Users, description: 'Supplier grouping', color: 'emerald' },
  { id: 'market-segmentation', name: 'Market Segmentation', icon: Target, description: 'Market segments', color: 'purple' },
  { id: 'trend-analysis', name: 'Trend Analysis', icon: TrendingUp, description: 'Market trends', color: 'amber' },
  { id: 'opportunity-identification', name: 'Opportunity Identification', icon: Lightbulb, description: 'Growth opportunities', color: 'rose' },
  { id: 'competitive-landscape', name: 'Competitive Landscape', icon: Compass, description: 'Competition analysis', color: 'cyan' },
  { id: 'growth-potential', name: 'Growth Potential', icon: Award, description: 'Expansion areas', color: 'red' },
  { id: 'risk-mapping', name: 'Risk Mapping', icon: AlertCircle, description: 'Risk assessment', color: 'teal' },
  { id: 'resource-allocation', name: 'Resource Allocation', icon: Layers, description: 'Resource planning', color: 'violet' },
  { id: 'performance-benchmarking', name: 'Performance Benchmarking', icon: BarChart3, description: 'Benchmark metrics', color: 'orange' },
  { id: 'strategic-insights', name: 'Strategic Insights', icon: Eye, description: 'Strategic recommendations', color: 'pink' }
];

const stats = [
  { label: 'Active Clusters', value: '24', icon: Network, color: 'blue', trend: '+8%' },
  { label: 'Suppliers Mapped', value: '1,247', icon: Users, color: 'emerald', trend: '+15%' },
  { label: 'Market Segments', value: '18', icon: Target, color: 'purple', trend: '+3%' },
  { label: 'Opportunities', value: '156', icon: Lightbulb, color: 'indigo', trend: '+22%' }
];

export default function ClusterIntelligenceAdvanced() {
  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'cluster-analysis':
        return <ClusterAnalysis />;
      case 'regional-mapping':
        return <RegionalMapping />;
      case 'supplier-clustering':
        return <SupplierClustering />;
      case 'market-segmentation':
        return <MarketSegmentation />;
      case 'trend-analysis':
        return <TrendAnalysis />;
      case 'opportunity-identification':
        return <OpportunityIdentification />;
      case 'competitive-landscape':
        return <CompetitiveLandscape />;
      case 'growth-potential':
        return <GrowthPotential />;
      case 'risk-mapping':
        return <RiskMapping />;
      case 'resource-allocation':
        return <ResourceAllocation />;
      case 'performance-benchmarking':
        return <PerformanceBenchmarking />;
      case 'strategic-insights':
        return <StrategicInsights />;
      default:
        return <ClusterAnalysis />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Cluster Intelligence"
      description="Advanced regional clustering and market intelligence platform"
      icon={Network}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}

function ClusterAnalysis() {
  const clusters = [
    { id: 1, name: 'Punjab Cluster', suppliers: 247, volume: '₹45.2Cr', growth: '+18%', health: 'excellent' },
    { id: 2, name: 'Haryana Cluster', suppliers: 189, volume: '₹38.5Cr', growth: '+12%', health: 'good' },
    { id: 3, name: 'Gujarat Cluster', suppliers: 156, volume: '₹32.1Cr', growth: '+15%', health: 'excellent' },
    { id: 4, name: 'Maharashtra Cluster', suppliers: 134, volume: '₹28.7Cr', growth: '+8%', health: 'good' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Cluster Analysis</h2>
        <p className="text-slate-500 font-medium mt-1">Regional supplier clusters and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clusters.map((cluster, idx) => (
          <motion.div
            key={cluster.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{cluster.name}</h3>
                <p className="text-sm text-slate-600 font-medium mt-1">{cluster.suppliers} suppliers</p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                cluster.health === 'excellent' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {cluster.health}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Volume:</span>
                <span className="text-slate-900 font-black">{cluster.volume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Growth:</span>
                <span className="text-emerald-600 font-black">{cluster.growth}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RegionalMapping() {
  const regions = [
    { region: 'North', clusters: 8, suppliers: 436, coverage: 85 },
    { region: 'South', clusters: 6, suppliers: 312, coverage: 72 },
    { region: 'East', clusters: 5, suppliers: 248, coverage: 68 },
    { region: 'West', clusters: 5, suppliers: 251, coverage: 70 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Regional Mapping</h2>
        <p className="text-slate-500 font-medium mt-1">Geographic distribution and coverage</p>
      </div>

      <div className="space-y-4">
        {regions.map((region, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{region.region} Region</h3>
                <p className="text-sm text-slate-600 font-medium">{region.clusters} clusters • {region.suppliers} suppliers</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-blue-600">{region.coverage}%</div>
                <div className="text-xs text-slate-500 font-bold">Coverage</div>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${region.coverage}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SupplierClustering() {
  const clusterTypes = [
    { type: 'Premium Suppliers', count: 156, rating: 4.8, volume: '₹52.3Cr' },
    { type: 'Growth Suppliers', count: 234, rating: 4.2, volume: '₹38.5Cr' },
    { type: 'Emerging Suppliers', count: 189, rating: 3.8, volume: '₹22.1Cr' },
    { type: 'Specialized Suppliers', count: 98, rating: 4.6, volume: '₹18.9Cr' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Supplier Clustering</h2>
        <p className="text-slate-500 font-medium mt-1">Supplier segmentation by performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clusterTypes.map((cluster, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200"
          >
            <h3 className="text-lg font-black text-slate-900 mb-4">{cluster.type}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Count:</span>
                <span className="text-slate-900 font-black">{cluster.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Avg Rating:</span>
                <span className="text-amber-600 font-black">⭐ {cluster.rating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Volume:</span>
                <span className="text-emerald-600 font-black">{cluster.volume}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MarketSegmentation() {
  const segments = [
    { segment: 'Bulk Commodities', size: '₹125.4Cr', growth: '+22%', margin: '8-12%' },
    { segment: 'Specialty Crops', size: '₹87.2Cr', growth: '+18%', margin: '12-18%' },
    { segment: 'Organic Products', size: '₹45.8Cr', growth: '+35%', margin: '18-25%' },
    { segment: 'Premium Quality', size: '₹32.1Cr', growth: '+28%', margin: '15-22%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Market Segmentation</h2>
        <p className="text-slate-500 font-medium mt-1">Market segments and opportunities</p>
      </div>

      <div className="space-y-3">
        {segments.map((seg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl p-4 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-slate-900">{seg.segment}</h3>
              <span className="text-emerald-600 font-black">{seg.growth}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-slate-600 font-bold">Market Size</p>
                <p className="text-slate-900 font-black">{seg.size}</p>
              </div>
              <div>
                <p className="text-slate-600 font-bold">Margin</p>
                <p className="text-slate-900 font-black">{seg.margin}</p>
              </div>
              <div>
                <p className="text-slate-600 font-bold">Status</p>
                <p className="text-emerald-600 font-black">Active</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TrendAnalysis() {
  const trendData = [
    { month: 'Jan', demand: 65, supply: 72, price: 2400 },
    { month: 'Feb', demand: 72, supply: 68, price: 2450 },
    { month: 'Mar', demand: 78, supply: 75, price: 2380 },
    { month: 'Apr', demand: 85, supply: 82, price: 2520 },
    { month: 'May', demand: 92, supply: 88, price: 2650 },
    { month: 'Jun', demand: 98, supply: 95, price: 2780 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Trend Analysis</h2>
        <p className="text-slate-500 font-medium mt-1">Market trends and patterns</p>
      </div>

      <PremiumCard className="p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">Demand vs Supply Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={3} name="Demand" />
            <Line type="monotone" dataKey="supply" stroke="#8b5cf6" strokeWidth={3} name="Supply" />
          </LineChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function OpportunityIdentification() {
  const opportunities = [
    { title: 'Organic Expansion', potential: '₹25.4Cr', timeline: '6 months', risk: 'low' },
    { title: 'Export Markets', potential: '₹18.2Cr', timeline: '9 months', risk: 'medium' },
    { title: 'Premium Segment', potential: '₹15.8Cr', timeline: '3 months', risk: 'low' },
    { title: 'Regional Growth', potential: '₹22.1Cr', timeline: '12 months', risk: 'medium' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Opportunity Identification</h2>
        <p className="text-slate-500 font-medium mt-1">Growth opportunities and expansion areas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map((opp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200"
          >
            <h3 className="text-lg font-black text-slate-900 mb-4">{opp.title}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Potential:</span>
                <span className="text-amber-600 font-black">{opp.potential}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Timeline:</span>
                <span className="text-slate-900 font-black">{opp.timeline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Risk:</span>
                <span className={`font-black uppercase text-xs ${opp.risk === 'low' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {opp.risk}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CompetitiveLandscape() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Competitive Landscape</h2>
        <p className="text-slate-500 font-medium mt-1">Market competition analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center">
            <BarChart3 size={40} className="mx-auto text-blue-600 mb-4" />
            <h3 className="text-lg font-black text-slate-900 mb-2">Market Share</h3>
            <p className="text-3xl font-black text-blue-600 mb-2">24.5%</p>
            <p className="text-sm text-slate-600 font-medium">Your market position</p>
          </div>
        </PremiumCard>

        <PremiumCard className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center">
            <Users size={40} className="mx-auto text-purple-600 mb-4" />
            <h3 className="text-lg font-black text-slate-900 mb-2">Competitors</h3>
            <p className="text-3xl font-black text-purple-600 mb-2">12</p>
            <p className="text-sm text-slate-600 font-medium">Active competitors</p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function GrowthPotential() {
  const growthAreas = [
    { area: 'North Region', current: '₹45.2Cr', potential: '₹68.5Cr', growth: '+51%' },
    { area: 'South Region', current: '₹32.1Cr', potential: '₹52.3Cr', growth: '+63%' },
    { area: 'East Region', current: '₹28.7Cr', potential: '₹45.8Cr', growth: '+60%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Growth Potential</h2>
        <p className="text-slate-500 font-medium mt-1">Expansion opportunities by region</p>
      </div>

      <div className="space-y-4">
        {growthAreas.map((area, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">{area.area}</h3>
              <div className="text-emerald-600 font-black text-lg">{area.growth}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-slate-600 font-bold">Current</p>
                <p className="text-slate-900 font-black">{area.current}</p>
              </div>
              <div>
                <p className="text-slate-600 font-bold">Potential</p>
                <p className="text-emerald-600 font-black">{area.potential}</p>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RiskMapping() {
  const risks = [
    { risk: 'Supply Chain Disruption', level: 'medium', impact: 'high', mitigation: 'Diversify suppliers' },
    { risk: 'Price Volatility', level: 'high', impact: 'medium', mitigation: 'Hedging strategy' },
    { risk: 'Quality Issues', level: 'low', impact: 'high', mitigation: 'QA protocols' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Risk Mapping</h2>
        <p className="text-slate-500 font-medium mt-1">Identified risks and mitigation strategies</p>
      </div>

      <div className="space-y-3">
        {risks.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-slate-900">{item.risk}</h3>
              <span className={`px-2 py-1 rounded text-xs font-black uppercase ${
                item.level === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {item.level}
              </span>
            </div>
            <p className="text-sm text-slate-600 font-medium">Mitigation: {item.mitigation}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ResourceAllocation() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Resource Allocation</h2>
        <p className="text-slate-500 font-medium mt-1">Optimal resource distribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Capital Allocation" value="₹2.4Cr" icon={DollarSign} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Team Resources" value="24" icon={Users} color="emerald" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Efficiency" value="94.2%" icon={Zap} color="purple" />
        </PremiumCard>
      </div>
    </div>
  );
}

function PerformanceBenchmarking() {
  const benchmarks = [
    { metric: 'Delivery Time', yours: '3.2 days', industry: '4.1 days', status: 'above' },
    { metric: 'Quality Score', yours: '9.2/10', industry: '8.5/10', status: 'above' },
    { metric: 'Cost Efficiency', yours: '92%', industry: '85%', status: 'above' },
    { metric: 'Customer Satisfaction', yours: '4.7/5', industry: '4.2/5', status: 'above' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Performance Benchmarking</h2>
        <p className="text-slate-500 font-medium mt-1">Compare with industry standards</p>
      </div>

      <div className="space-y-3">
        {benchmarks.map((bench, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gradient-to-r from-slate-50 to-emerald-50 rounded-2xl p-4 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-slate-900">{bench.metric}</h3>
              <CheckCircle className="text-emerald-600" size={20} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600 font-bold">Your Performance</p>
                <p className="text-slate-900 font-black">{bench.yours}</p>
              </div>
              <div>
                <p className="text-slate-600 font-bold">Industry Avg</p>
                <p className="text-slate-900 font-black">{bench.industry}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StrategicInsights() {
  const insights = [
    { title: 'Expand to South Region', priority: 'high', impact: 'High ROI potential' },
    { title: 'Develop Organic Line', priority: 'high', impact: 'Growing market demand' },
    { title: 'Strengthen North Cluster', priority: 'medium', impact: 'Consolidate position' },
    { title: 'Explore Export Markets', priority: 'medium', impact: 'New revenue stream' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Strategic Insights</h2>
        <p className="text-slate-500 font-medium mt-1">AI-powered strategic recommendations</p>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-black text-slate-900">{insight.title}</h3>
                <p className="text-sm text-slate-600 font-medium mt-1">{insight.impact}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase whitespace-nowrap ml-2 ${
                insight.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {insight.priority}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
