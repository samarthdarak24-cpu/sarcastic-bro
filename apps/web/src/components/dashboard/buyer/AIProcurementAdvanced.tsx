'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FeatureTabsDisplay } from './shared/FeatureTabsDisplay';
import { PremiumCard, MetricDisplay } from './shared/PremiumFeatureLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Brain, TrendingUp, Zap, Target, AlertCircle, BarChart3,
  Lightbulb, Clock, DollarSign, CheckCircle, TrendingDown, Settings,
  LucideIcon
} from 'lucide-react';

interface SubFeature {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

const subFeatures: SubFeature[] = [
  { id: 'recommendations', name: 'Recommendations', icon: Lightbulb, description: 'Smart recommendations', color: 'blue' },
  { id: 'forecasting', name: 'Forecasting', icon: TrendingUp, description: 'Demand forecasting', color: 'emerald' },
  { id: 'ordering', name: 'Auto Ordering', icon: Zap, description: 'Auto ordering', color: 'amber' },
  { id: 'optimization', name: 'Optimization', icon: Target, description: 'Price optimization', color: 'indigo' },
  { id: 'matching', name: 'Matching', icon: CheckCircle, description: 'Supplier matching', color: 'rose' },
  { id: 'quality', name: 'Quality', icon: BarChart3, description: 'Quality predictor', color: 'purple' },
  { id: 'risk', name: 'Risk', icon: AlertCircle, description: 'Risk analysis', color: 'cyan' },
  { id: 'budget', name: 'Budget', icon: DollarSign, description: 'Budget optimizer', color: 'violet' },
  { id: 'seasonal', name: 'Seasonal', icon: Clock, description: 'Seasonal insights', color: 'orange' },
  { id: 'performance', name: 'Performance', icon: TrendingDown, description: 'Performance tracker', color: 'teal' },
  { id: 'alerts', name: 'Alerts', icon: AlertCircle, description: 'Alert system', color: 'pink' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, description: 'Analytics hub', color: 'red' },
];

const forecastData = [
  { month: 'Jan', demand: 4000, forecast: 3800, actual: 4200 },
  { month: 'Feb', demand: 3000, forecast: 2900, actual: 3100 },
  { month: 'Mar', demand: 2000, forecast: 2100, actual: 1900 },
  { month: 'Apr', demand: 2780, forecast: 2800, actual: 2750 },
  { month: 'May', demand: 1890, forecast: 1950, actual: 1850 },
  { month: 'Jun', demand: 2390, forecast: 2400, actual: 2380 },
];

function SmartRecommendations() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Recommendations" value="47" icon={Lightbulb} color="blue" trend="+12%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Acceptance Rate" value="78%" icon={CheckCircle} color="emerald" trend="+5%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Savings Generated" value="₹8.5L" icon={TrendingDown} color="amber" trend="+18%" />
        </PremiumCard>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">AI Recommendations</h3>
        <div className="space-y-3">
          {[
            { product: 'Basmati Rice', reason: 'Price 12% below market', confidence: 95 },
            { product: 'Wheat Grain', reason: 'Supplier reliability high', confidence: 88 },
            { product: 'Cotton Bales', reason: 'Bulk discount available', confidence: 92 },
          ].map((rec, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900">{rec.product}</p>
                <span className="text-xs font-bold text-emerald-600">{rec.confidence}% confidence</span>
              </div>
              <p className="text-sm text-slate-600">{rec.reason}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function DemandForecasting() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Demand Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Legend />
            <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function AutoOrdering() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Auto Order Status</h3>
          <div className="space-y-3">
            {[
              { status: 'Enabled', count: 12, color: 'emerald' },
              { status: 'Pending Review', count: 3, color: 'amber' },
              { status: 'Disabled', count: 2, color: 'slate' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                <span className="font-medium text-slate-700">{item.status}</span>
                <span className={`font-bold text-${item.color}-600`}>{item.count}</span>
              </div>
            ))}
          </div>
        </PremiumCard>
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Auto Orders</h3>
          <div className="space-y-2">
            {[
              { product: 'Rice', qty: '500kg', time: '2h ago' },
              { product: 'Wheat', qty: '300kg', time: '4h ago' },
              { product: 'Cotton', qty: '25 bales', time: '1d ago' },
            ].map((order, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg text-sm">
                <p className="font-bold text-slate-900">{order.product}</p>
                <p className="text-xs text-slate-600">{order.qty} • {order.time}</p>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function PriceOptimization() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Price Optimization</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="demand" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="forecast" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function SupplierMatching() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Matched Suppliers</h3>
        <div className="space-y-3">
          {[
            { supplier: 'Ramesh Yadav', match: 98, reason: 'Price & Quality' },
            { supplier: 'Farmer Co-op', match: 92, reason: 'Reliability' },
            { supplier: 'Cotton Mills', match: 88, reason: 'Volume Capacity' },
          ].map((match, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900">{match.supplier}</p>
                <span className="text-xs font-bold text-emerald-600">{match.match}% match</span>
              </div>
              <p className="text-sm text-slate-600">{match.reason}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function QualityPredictor() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Quality Score" value="94.5%" icon={CheckCircle} color="emerald" trend="+2%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Predictions" value="847" icon={BarChart3} color="blue" trend="+12%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Accuracy" value="96.2%" icon={TrendingUp} color="amber" trend="+1%" />
        </PremiumCard>
      </div>
    </div>
  );
}

function RiskAnalysis() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Risk Assessment</h3>
        <div className="space-y-3">
          {[
            { risk: 'Price Volatility', level: 'Medium', score: 6.5 },
            { risk: 'Supply Disruption', level: 'Low', score: 3.2 },
            { risk: 'Quality Issues', level: 'Low', score: 2.8 },
            { risk: 'Supplier Default', level: 'Very Low', score: 1.5 },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{item.risk}</p>
                <p className="text-xs text-slate-600">{item.level}</p>
              </div>
              <span className="font-bold text-amber-600">{item.score}/10</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function BudgetOptimizer() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Budget Status</h3>
          <div className="space-y-4">
            {[
              { category: 'Rice', allocated: '₹50L', spent: '₹42L', remaining: '₹8L' },
              { category: 'Wheat', allocated: '₹30L', spent: '₹28L', remaining: '₹2L' },
              { category: 'Cotton', allocated: '₹40L', spent: '₹35L', remaining: '₹5L' },
            ].map((budget, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-900 mb-1">{budget.category}</p>
                <p className="text-xs text-slate-600">Spent: {budget.spent} / {budget.allocated}</p>
              </div>
            ))}
          </div>
        </PremiumCard>
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Optimization Tips</h3>
          <div className="space-y-2">
            {[
              'Consolidate orders for better bulk discounts',
              'Negotiate longer payment terms',
              'Diversify suppliers to reduce risk',
              'Use seasonal pricing strategies',
            ].map((tip, idx) => (
              <div key={idx} className="p-3 bg-blue-50 rounded-lg text-sm text-blue-900 font-medium">
                • {tip}
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function SeasonalInsights() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Seasonal Patterns</h3>
        <div className="space-y-3">
          {[
            { season: 'Monsoon', products: 'Rice, Cotton', price: 'High', supply: 'Low' },
            { season: 'Winter', products: 'Wheat, Vegetables', price: 'Medium', supply: 'High' },
            { season: 'Summer', products: 'Fruits, Vegetables', price: 'Low', supply: 'High' },
          ].map((season, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-900 mb-2">{season.season}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-slate-600">Products:</span> <span className="font-bold">{season.products}</span></div>
                <div><span className="text-slate-600">Price:</span> <span className="font-bold">{season.price}</span></div>
                <div><span className="text-slate-600">Supply:</span> <span className="font-bold">{season.supply}</span></div>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function PerformanceTracker() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Cost Savings" value="₹12.5L" icon={TrendingDown} color="emerald" trend="+18%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Orders Optimized" value="234" icon={CheckCircle} color="blue" trend="+25%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Efficiency Gain" value="34%" icon={Zap} color="amber" trend="+8%" />
        </PremiumCard>
      </div>
    </div>
  );
}

function AlertSystem() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Active Alerts</h3>
        <div className="space-y-3">
          {[
            { alert: 'Price spike detected', product: 'Rice', action: 'Review' },
            { alert: 'Supplier delay', product: 'Wheat', action: 'Escalate' },
            { alert: 'Quality issue', product: 'Cotton', action: 'Investigate' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{item.alert}</p>
                <p className="text-xs text-slate-600">{item.product}</p>
              </div>
              <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100">
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function AnalyticsHub() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Key Metrics</h3>
        <div className="space-y-3">
          {[
            { metric: 'Avg Order Value', value: '₹2.5L', trend: '+12%' },
            { metric: 'Supplier Diversity', value: '45 suppliers', trend: '+8%' },
            { metric: 'On-Time Delivery', value: '96.2%', trend: '+2%' },
            { metric: 'Quality Score', value: '94.5%', trend: '+1%' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="font-medium text-slate-700">{item.metric}</span>
              <div className="text-right">
                <p className="font-bold text-slate-900">{item.value}</p>
                <p className="text-xs text-emerald-600">{item.trend}</p>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

export function AIProcurementAdvanced() {
  const stats = [
    { label: 'Recommendations', value: '47', icon: Lightbulb, color: 'blue', trend: '+12%' },
    { label: 'Cost Savings', value: '₹12.5L', icon: TrendingDown, color: 'emerald', trend: '+18%' },
    { label: 'Accuracy', value: '96.2%', icon: CheckCircle, color: 'amber', trend: '+1%' },
    { label: 'Orders Optimized', value: '234', icon: Zap, color: 'indigo', trend: '+25%' },
  ];

  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'recommendations': return <SmartRecommendations />;
      case 'forecasting': return <DemandForecasting />;
      case 'ordering': return <AutoOrdering />;
      case 'optimization': return <PriceOptimization />;
      case 'matching': return <SupplierMatching />;
      case 'quality': return <QualityPredictor />;
      case 'risk': return <RiskAnalysis />;
      case 'budget': return <BudgetOptimizer />;
      case 'seasonal': return <SeasonalInsights />;
      case 'performance': return <PerformanceTracker />;
      case 'alerts': return <AlertSystem />;
      case 'analytics': return <AnalyticsHub />;
      default: return <SmartRecommendations />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="AI Procurement"
      description="Intelligent procurement with AI-powered insights"
      icon={Brain}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}
