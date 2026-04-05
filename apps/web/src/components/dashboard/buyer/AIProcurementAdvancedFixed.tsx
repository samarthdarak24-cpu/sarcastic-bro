'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FeatureTabsDisplay } from './shared/FeatureTabsDisplay';
import { PremiumCard, MetricDisplay } from './shared/PremiumFeatureLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Brain, TrendingUp, Zap, Target, AlertCircle, BarChart3,
  Lightbulb, Clock, DollarSign, CheckCircle, TrendingDown, Settings
} from 'lucide-react';

const stats = [
  { label: 'Active Recommendations', value: '47', icon: Lightbulb, color: 'blue', trend: '+12%' },
  { label: 'Acceptance Rate', value: '78%', icon: CheckCircle, color: 'emerald', trend: '+5%' },
  { label: 'Savings Generated', value: '₹8.5L', icon: TrendingDown, color: 'amber', trend: '+18%' },
  { label: 'Accuracy', value: '96.2%', icon: TrendingUp, color: 'indigo', trend: '+1%' },
];

const subFeatures = [
  { id: 'recommendations', name: 'Smart Recommendations', icon: Lightbulb, description: 'AI-powered recommendations' },
  { id: 'forecasting', name: 'Demand Forecasting', icon: TrendingUp, description: 'Predict demand patterns' },
  { id: 'ordering', name: 'Auto Ordering', icon: Zap, description: 'Automated order placement' },
  { id: 'optimization', name: 'Price Optimization', icon: Target, description: 'Optimize pricing' },
  { id: 'matching', name: 'Supplier Matching', icon: CheckCircle, description: 'Find best suppliers' },
  { id: 'quality', name: 'Quality Predictor', icon: BarChart3, description: 'Predict quality scores' },
  { id: 'risk', name: 'Risk Analysis', icon: AlertCircle, description: 'Assess supply risks' },
  { id: 'budget', name: 'Budget Optimizer', icon: DollarSign, description: 'Optimize budgets' },
  { id: 'seasonal', name: 'Seasonal Insights', icon: Clock, description: 'Seasonal patterns' },
  { id: 'performance', name: 'Performance Tracking', icon: TrendingDown, description: 'Track metrics' },
  { id: 'alerts', name: 'Alert System', icon: AlertCircle, description: 'Smart alerts' },
  { id: 'analytics', name: 'Analytics Hub', icon: BarChart3, description: 'Advanced analytics' },
];

const forecastData = [
  { month: 'Jan', demand: 4000, forecast: 3800, actual: 4200 },
  { month: 'Feb', demand: 3000, forecast: 2900, actual: 3100 },
  { month: 'Mar', demand: 2000, forecast: 2100, actual: 1900 },
  { month: 'Apr', demand: 2780, forecast: 2800, actual: 2750 },
  { month: 'May', demand: 1890, forecast: 1950, actual: 1850 },
  { month: 'Jun', demand: 2390, forecast: 2400, actual: 2380 },
];

export default function AIProcurementAdvancedFixed() {
  const renderSubFeature = (id: string) => {
    switch (id) {
      case 'recommendations':
        return <SmartRecommendations />;
      case 'forecasting':
        return <DemandForecasting />;
      case 'ordering':
        return <AutoOrdering />;
      case 'optimization':
        return <PriceOptimization />;
      case 'matching':
        return <SupplierMatching />;
      case 'quality':
        return <QualityPredictor />;
      case 'risk':
        return <RiskAnalysis />;
      case 'budget':
        return <BudgetOptimizer />;
      case 'seasonal':
        return <SeasonalInsights />;
      case 'performance':
        return <PerformanceTracking />;
      case 'alerts':
        return <AlertSystem />;
      case 'analytics':
        return <AnalyticsHub />;
      default:
        return <SmartRecommendations />;
    }
  };

  return (
    <FeatureTabsDisplay
      title="AI Procurement"
      description="Intelligent procurement with AI-powered recommendations and automation"
      icon={Brain}
      stats={stats}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
    />
  );
}

function SmartRecommendations() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Smart Recommendations</h2>
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
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-slate-50 rounded-xl"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900">{rec.product}</p>
                <span className="text-xs font-bold text-emerald-600">{rec.confidence}% confidence</span>
              </div>
              <p className="text-sm text-slate-600">{rec.reason}</p>
            </motion.div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function DemandForecasting() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Demand Forecasting</h2>
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
      <h2 className="text-2xl font-black text-slate-900">Auto Ordering</h2>
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
      <h2 className="text-2xl font-black text-slate-900">Price Optimization</h2>
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
      <h2 className="text-2xl font-black text-slate-900">Supplier Matching</h2>
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
      <h2 className="text-2xl font-black text-slate-900">Quality Predictor</h2>
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
      <h2 className="text-2xl font-black text-slate-900">Risk Analysis</h2>
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
      <h2 className="text-2xl font-black text-slate-900">Budget Optimizer</h2>
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
    </div>
  );
}

function SeasonalInsights() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Seasonal Insights</h2>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Seasonal Patterns</h3>
        <div className="space-y-3">
          {[
            { season: 'Summer', demand: 'High', price: 'Premium', recommendation: 'Increase stock' },
            { season: 'Monsoon', demand: 'Medium', price: 'Standard', recommendation: 'Maintain stock' },
            { season: 'Winter', demand: 'Low', price: 'Discount', recommendation: 'Reduce orders' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-900 mb-2">{item.season}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-slate-600">Demand:</span> <span className="font-bold">{item.demand}</span></div>
                <div><span className="text-slate-600">Price:</span> <span className="font-bold">{item.price}</span></div>
                <div><span className="text-slate-600">Action:</span> <span className="font-bold">{item.recommendation}</span></div>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function PerformanceTracking() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Performance Tracking</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <MetricDisplay label="Orders Placed" value="1,247" icon={CheckCircle} color="blue" trend="+24%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Avg Savings" value="₹12.5L" icon={TrendingDown} color="emerald" trend="+18%" />
        </PremiumCard>
      </div>
    </div>
  );
}

function AlertSystem() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Alert System</h2>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Active Alerts</h3>
        <div className="space-y-3">
          {[
            { alert: 'Price spike detected', severity: 'warning', action: 'Review pricing' },
            { alert: 'Supplier delay', severity: 'info', action: 'Contact supplier' },
            { alert: 'Budget threshold', severity: 'success', action: 'On track' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-start">
              <div>
                <p className="font-bold text-slate-900">{item.alert}</p>
                <p className="text-xs text-slate-600 mt-1">{item.action}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                item.severity === 'warning' ? 'bg-amber-100 text-amber-600' :
                item.severity === 'info' ? 'bg-blue-100 text-blue-600' :
                'bg-emerald-100 text-emerald-600'
              }`}>
                {item.severity}
              </span>
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
      <h2 className="text-2xl font-black text-slate-900">Analytics Hub</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Key Metrics</h3>
          <div className="space-y-3">
            {[
              { metric: 'ROI', value: '245%' },
              { metric: 'Cost Reduction', value: '32%' },
              { metric: 'Efficiency', value: '89%' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg flex justify-between">
                <span className="font-medium text-slate-700">{item.metric}</span>
                <span className="font-bold text-blue-600">{item.value}</span>
              </div>
            ))}
          </div>
        </PremiumCard>
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Trends</h3>
          <div className="space-y-3">
            {[
              { trend: 'Orders ↑', change: '+24%' },
              { trend: 'Savings ↑', change: '+18%' },
              { trend: 'Costs ↓', change: '-12%' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg flex justify-between">
                <span className="font-medium text-slate-700">{item.trend}</span>
                <span className="font-bold text-emerald-600">{item.change}</span>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
