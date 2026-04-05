'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, BarChart3, LineChart, AlertCircle, CheckCircle, Clock,
  DollarSign, Eye, Zap, Users, FileText, Settings,
  Bell, Activity, Smartphone, Lock, Target, Layers
} from 'lucide-react';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { LineChart as ReLineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const subFeatures = [
  { id: 'price-tracking', name: 'Price Tracking', icon: TrendingUp, description: 'Real-time price monitoring', color: 'blue' },
  { id: 'market-analysis', name: 'Market Analysis', icon: BarChart3, description: 'Market trends', color: 'indigo', badge: 'NEW' },
  { id: 'price-trends', name: 'Price Trends', icon: LineChart, description: 'Historical trends', color: 'emerald' },
  { id: 'competitor-pricing', name: 'Competitor Pricing', icon: Users, description: 'Competitor rates', color: 'purple' },
  { id: 'price-alerts', name: 'Price Alerts', icon: Bell, description: 'Smart notifications', color: 'rose' },
  { id: 'historical-data', name: 'Historical Data', icon: FileText, description: 'Price history', color: 'amber' },
  { id: 'forecast-models', name: 'Forecast Models', icon: Zap, description: 'Price predictions', color: 'cyan' },
  { id: 'seasonal-patterns', name: 'Seasonal Patterns', icon: Activity, description: 'Seasonal analysis', color: 'teal' },
  { id: 'regional-pricing', name: 'Regional Pricing', icon: Target, description: 'Regional rates', color: 'violet' },
  { id: 'bulk-discounts', name: 'Bulk Discounts', icon: DollarSign, description: 'Volume pricing', color: 'orange' },
  { id: 'price-optimization', name: 'Price Optimization', icon: Eye, description: 'Best price finder', color: 'pink' },
  { id: 'negotiation-insights', name: 'Negotiation Insights', icon: Layers, description: 'Negotiation data', color: 'red' }
];

const stats = [
  { label: 'Avg Price Saved', value: '₹12.5/kg', icon: DollarSign, color: 'emerald', trend: '+8%' },
  { label: 'Market Volatility', value: '4.2%', icon: TrendingUp, color: 'blue', trend: '-2%' },
  { label: 'Tracked Products', value: '156', icon: Eye, color: 'purple', trend: '+12%' },
  { label: 'Alerts Triggered', value: '47', icon: Bell, color: 'indigo', trend: '+15%' }
];

export default function PriceIntelligenceAdvanced() {
  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'price-tracking': return <PriceTracking />;
      case 'market-analysis': return <MarketAnalysis />;
      case 'price-trends': return <PriceTrends />;
      case 'competitor-pricing': return <CompetitorPricing />;
      case 'price-alerts': return <PriceAlerts />;
      case 'historical-data': return <HistoricalData />;
      case 'forecast-models': return <ForecastModels />;
      case 'seasonal-patterns': return <SeasonalPatterns />;
      case 'regional-pricing': return <RegionalPricing />;
      case 'bulk-discounts': return <BulkDiscounts />;
      case 'price-optimization': return <PriceOptimization />;
      case 'negotiation-insights': return <NegotiationInsights />;
      default: return <PriceTracking />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Price Intelligence"
      description="Advanced market pricing analytics and forecasting"
      icon={TrendingUp}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}

function PriceTracking() {
  const trackedPrices = [
    { product: 'Basmati Rice', current: '₹85/kg', change: '+2.5%', status: 'up', lastUpdate: '2 mins ago' },
    { product: 'Wheat', current: '₹42/kg', change: '-1.2%', status: 'down', lastUpdate: '5 mins ago' },
    { product: 'Corn', current: '₹28/kg', change: '+0.8%', status: 'up', lastUpdate: '1 min ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Price Tracking</h2>
          <p className="text-slate-500 font-medium mt-1">Real-time price monitoring</p>
        </div>
        <ActionButton variant="primary" icon={Eye}>Add Product</ActionButton>
      </div>

      <div className="space-y-3">
        {trackedPrices.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">{item.product}</h3>
                <p className="text-sm text-slate-600 font-medium">Updated {item.lastUpdate}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900">{item.current}</div>
                <div className={`text-sm font-black flex items-center justify-end gap-1 ${
                  item.status === 'up' ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {item.status === 'up' ? '↑' : '↓'} {item.change}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MarketAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Market Analysis</h2>
        <p className="text-slate-500 font-medium mt-1">Comprehensive market insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard className="p-6">
          <MetricDisplay label="Market Cap" value="₹2.4B" icon={BarChart3} color="blue" />
        </PremiumCard>
        <PremiumCard className="p-6">
          <MetricDisplay label="Growth Rate" value="+8.5%" icon={TrendingUp} color="emerald" trend="+2%" />
        </PremiumCard>
      </div>

      <PremiumCard className="p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">Market Sentiment</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-slate-700">Bullish</span>
              <span className="font-black text-slate-900">65%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-slate-700">Neutral</span>
              <span className="font-black text-slate-900">25%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-slate-700">Bearish</span>
              <span className="font-black text-slate-900">10%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}

function PriceTrends() {
  const trendData = [
    { date: 'Jan 1', price: 80 },
    { date: 'Jan 8', price: 82 },
    { date: 'Jan 15', price: 81 },
    { date: 'Jan 22', price: 85 },
    { date: 'Jan 29', price: 83 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Price Trends</h2>
        <p className="text-slate-500 font-medium mt-1">Historical price movements</p>
      </div>

      <PremiumCard className="p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">30-Day Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function CompetitorPricing() {
  const competitors = [
    { name: 'Green Valley', price: '₹85/kg', rating: 4.8, volume: 'High' },
    { name: 'Organic Harvest', price: '₹82/kg', rating: 4.9, volume: 'Medium' },
    { name: 'Sunrise Traders', price: '₹88/kg', rating: 4.5, volume: 'High' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Competitor Pricing</h2>
        <p className="text-slate-500 font-medium mt-1">Compare competitor rates</p>
      </div>

      <div className="space-y-3">
        {competitors.map((comp, idx) => (
          <PremiumCard key={idx} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">{comp.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-slate-600 font-medium">⭐ {comp.rating}</span>
                  <span className="text-slate-600 font-medium">Volume: {comp.volume}</span>
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{comp.price}</div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function PriceAlerts() {
  const alerts = [
    { id: 1, product: 'Basmati Rice', condition: 'Price > ₹85/kg', status: 'active', triggered: 'Today' },
    { id: 2, product: 'Wheat', condition: 'Price < ₹40/kg', status: 'active', triggered: 'Never' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Price Alerts</h2>
          <p className="text-slate-500 font-medium mt-1">Smart price notifications</p>
        </div>
        <ActionButton variant="primary" icon={Bell}>Create Alert</ActionButton>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <PremiumCard key={alert.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">{alert.product}</h3>
                <p className="text-sm text-slate-600 font-medium">{alert.condition}</p>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-black uppercase mb-2">
                  {alert.status}
                </div>
                <div className="text-xs text-slate-500 font-medium">Triggered: {alert.triggered}</div>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function HistoricalData() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Historical Data</h2>
        <p className="text-slate-500 font-medium mt-1">Complete price history</p>
      </div>

      <PremiumCard className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-700">Highest Price</span>
            <span className="font-black text-slate-900">₹92/kg (Jan 20)</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-700">Lowest Price</span>
            <span className="font-black text-slate-900">₹78/kg (Jan 5)</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-700">Average Price</span>
            <span className="font-black text-slate-900">₹83.5/kg</span>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}

function ForecastModels() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Forecast Models</h2>
        <p className="text-slate-500 font-medium mt-1">AI-powered price predictions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="font-black text-slate-900 mb-3">Next Week Forecast</h3>
          <div className="text-3xl font-black text-blue-600 mb-2">₹84/kg</div>
          <p className="text-sm text-slate-600 font-medium">Confidence: 92%</p>
        </PremiumCard>

        <PremiumCard className="p-6 bg-gradient-to-br from-emerald-50 to-green-50">
          <h3 className="font-black text-slate-900 mb-3">Next Month Forecast</h3>
          <div className="text-3xl font-black text-emerald-600 mb-2">₹86/kg</div>
          <p className="text-sm text-slate-600 font-medium">Confidence: 85%</p>
        </PremiumCard>
      </div>
    </div>
  );
}

function SeasonalPatterns() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Seasonal Patterns</h2>
        <p className="text-slate-500 font-medium mt-1">Seasonal price analysis</p>
      </div>

      <div className="space-y-3">
        {['Winter', 'Spring', 'Summer', 'Autumn'].map((season, idx) => (
          <PremiumCard key={season} className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900">{season}</span>
              <span className="font-black text-blue-600">₹{80 + idx * 2}/kg</span>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function RegionalPricing() {
  const regions = [
    { region: 'Punjab', price: '₹85/kg', volume: 'High' },
    { region: 'Haryana', price: '₹83/kg', volume: 'Medium' },
    { region: 'Uttar Pradesh', price: '₹82/kg', volume: 'High' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Regional Pricing</h2>
        <p className="text-slate-500 font-medium mt-1">Prices by region</p>
      </div>

      <div className="space-y-3">
        {regions.map((item, idx) => (
          <PremiumCard key={idx} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">{item.region}</h3>
                <p className="text-xs text-slate-600 font-medium">Volume: {item.volume}</p>
              </div>
              <span className="font-black text-slate-900">{item.price}</span>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function BulkDiscounts() {
  const discounts = [
    { quantity: '1000-5000 kg', discount: '2%', price: '₹83.30/kg' },
    { quantity: '5000-10000 kg', discount: '5%', price: '₹80.75/kg' },
    { quantity: '10000+ kg', discount: '8%', price: '₹78.20/kg' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Bulk Discounts</h2>
        <p className="text-slate-500 font-medium mt-1">Volume-based pricing</p>
      </div>

      <div className="space-y-3">
        {discounts.map((item, idx) => (
          <PremiumCard key={idx} className="p-6 bg-gradient-to-r from-emerald-50 to-green-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">{item.quantity}</h3>
                <p className="text-sm text-slate-600 font-medium">Discount: {item.discount}</p>
              </div>
              <div className="text-2xl font-black text-emerald-600">{item.price}</div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function PriceOptimization() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Price Optimization</h2>
        <p className="text-slate-500 font-medium mt-1">Find the best prices</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Eye size={48} className="mx-auto text-blue-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">Best Price Found</h3>
          <div className="text-4xl font-black text-blue-600 mb-2">₹80/kg</div>
          <p className="text-slate-600 font-medium">Save ₹5/kg vs market average</p>
        </div>
      </PremiumCard>
    </div>
  );
}

function NegotiationInsights() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Negotiation Insights</h2>
        <p className="text-slate-500 font-medium mt-1">Data-driven negotiation tips</p>
      </div>

      <div className="space-y-4">
        <PremiumCard className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
          <h3 className="font-black text-slate-900 mb-2">Recommended Offer</h3>
          <p className="text-2xl font-black text-purple-600 mb-2">₹80/kg</p>
          <p className="text-sm text-slate-600 font-medium">Based on market analysis and competitor pricing</p>
        </PremiumCard>

        <PremiumCard className="p-6 bg-gradient-to-r from-amber-50 to-orange-50">
          <h3 className="font-black text-slate-900 mb-2">Negotiation Strength</h3>
          <p className="text-sm text-slate-600 font-medium">You have strong negotiating power - market is oversupplied</p>
        </PremiumCard>
      </div>
    </div>
  );
}
