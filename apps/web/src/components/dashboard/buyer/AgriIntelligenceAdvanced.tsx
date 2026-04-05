'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain, TrendingUp, Cloud, Leaf, Bug, Zap,
  BarChart3, MapPin, Calendar, AlertCircle, CheckCircle, Eye,
  Smartphone, Settings, Activity, Users, FileText, Award
} from 'lucide-react';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const subFeatures = [
  { id: 'market-intelligence', name: 'Market Intelligence', icon: Brain, description: 'Market insights', color: 'blue' },
  { id: 'crop-analytics', name: 'Crop Analytics', icon: Leaf, description: 'Crop data', color: 'indigo', badge: 'NEW' },
  { id: 'weather-insights', name: 'Weather Insights', icon: Cloud, description: 'Weather data', color: 'emerald' },
  { id: 'soil-data', name: 'Soil Data', icon: MapPin, description: 'Soil analysis', color: 'purple' },
  { id: 'pest-detection', name: 'Pest Detection', icon: Bug, description: 'Pest alerts', color: 'rose' },
  { id: 'yield-prediction', name: 'Yield Prediction', icon: TrendingUp, description: 'Yield forecast', color: 'amber' },
  { id: 'price-forecasting', name: 'Price Forecasting', icon: Zap, description: 'Price trends', color: 'cyan' },
  { id: 'trend-analysis', name: 'Trend Analysis', icon: BarChart3, description: 'Market trends', color: 'teal' },
  { id: 'regional-insights', name: 'Regional Insights', icon: MapPin, description: 'Regional data', color: 'violet' },
  { id: 'seasonal-planning', name: 'Seasonal Planning', icon: Calendar, description: 'Seasonal guide', color: 'orange' },
  { id: 'risk-assessment', name: 'Risk Assessment', icon: AlertCircle, description: 'Risk analysis', color: 'pink' },
  { id: 'recommendation-engine', name: 'Recommendation Engine', icon: Brain, description: 'Smart suggestions', color: 'red' }
];

const stats = [
  { label: 'Market Insights', value: '247', icon: Brain, color: 'blue', trend: '+18%' },
  { label: 'Crop Data Points', value: '1.2M', icon: Leaf, color: 'emerald', trend: '+24%' },
  { label: 'Accuracy Rate', value: '96.5%', icon: CheckCircle, color: 'purple', trend: '+3%' },
  { label: 'Predictions', value: '847', icon: TrendingUp, color: 'indigo', trend: '+12%' }
];

export default function AgriIntelligenceAdvanced() {
  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'market-intelligence': return <MarketIntelligence />;
      case 'crop-analytics': return <CropAnalytics />;
      case 'weather-insights': return <WeatherInsights />;
      case 'soil-data': return <SoilData />;
      case 'pest-detection': return <PestDetection />;
      case 'yield-prediction': return <YieldPrediction />;
      case 'price-forecasting': return <PriceForecasting />;
      case 'trend-analysis': return <TrendAnalysis />;
      case 'regional-insights': return <RegionalInsights />;
      case 'seasonal-planning': return <SeasonalPlanning />;
      case 'risk-assessment': return <RiskAssessment />;
      case 'recommendation-engine': return <RecommendationEngine />;
      default: return <MarketIntelligence />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Agri-Intelligence"
      description="Advanced agricultural intelligence and predictive analytics"
      icon={Brain}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}

function MarketIntelligence() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Market Intelligence</h2>
        <p className="text-slate-500 font-medium mt-1">Real-time market insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Market Cap" value="₹2.4B" icon={Brain} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Growth Rate" value="+8.5%" icon={TrendingUp} color="emerald" trend="+2%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Volatility" value="4.2%" icon={AlertCircle} color="amber" />
        </PremiumCard>
      </div>
    </div>
  );
}

function CropAnalytics() {
  const chartData = [
    { week: 'W1', yield: 450, quality: 92 },
    { week: 'W2', yield: 480, quality: 94 },
    { week: 'W3', yield: 520, quality: 95 },
    { week: 'W4', yield: 510, quality: 93 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Crop Analytics</h2>
        <p className="text-slate-500 font-medium mt-1">Detailed crop performance data</p>
      </div>

      <PremiumCard className="p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">Weekly Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} name="Yield" />
          </LineChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function WeatherInsights() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Weather Insights</h2>
        <p className="text-slate-500 font-medium mt-1">Weather forecasting and alerts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
          <h3 className="font-black text-slate-900 mb-2">Temperature</h3>
          <div className="text-3xl font-black text-blue-600">28°C</div>
          <p className="text-sm text-slate-600 font-medium mt-1">Optimal for growth</p>
        </PremiumCard>

        <PremiumCard className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
          <h3 className="font-black text-slate-900 mb-2">Humidity</h3>
          <div className="text-3xl font-black text-purple-600">65%</div>
          <p className="text-sm text-slate-600 font-medium mt-1">Good conditions</p>
        </PremiumCard>

        <PremiumCard className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
          <h3 className="font-black text-slate-900 mb-2">Rainfall</h3>
          <div className="text-3xl font-black text-amber-600">12mm</div>
          <p className="text-sm text-slate-600 font-medium mt-1">Expected today</p>
        </PremiumCard>
      </div>
    </div>
  );
}

function SoilData() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Soil Data</h2>
        <p className="text-slate-500 font-medium mt-1">Soil health and composition</p>
      </div>

      <div className="space-y-3">
        {['pH Level', 'Nitrogen', 'Phosphorus', 'Potassium'].map((item, idx) => (
          <PremiumCard key={idx} className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900">{item}</span>
              <span className="font-black text-emerald-600">Optimal</span>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function PestDetection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Pest Detection</h2>
        <p className="text-slate-500 font-medium mt-1">AI-powered pest alerts</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">No Pests Detected</h3>
          <p className="text-slate-600 font-medium">Crops are healthy</p>
        </div>
      </PremiumCard>
    </div>
  );
}

function YieldPrediction() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Yield Prediction</h2>
        <p className="text-slate-500 font-medium mt-1">Predicted harvest yield</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <TrendingUp size={48} className="mx-auto text-emerald-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">Expected Yield</h3>
          <div className="text-4xl font-black text-emerald-600 mb-2">520 kg/acre</div>
          <p className="text-sm text-slate-600 font-medium">Confidence: 94%</p>
        </div>
      </PremiumCard>
    </div>
  );
}

function PriceForecasting() {
  const priceData = [
    { month: 'Jan', price: 80 },
    { month: 'Feb', price: 82 },
    { month: 'Mar', price: 81 },
    { month: 'Apr', price: 85 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Price Forecasting</h2>
        <p className="text-slate-500 font-medium mt-1">Price trend predictions</p>
      </div>

      <PremiumCard className="p-8">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={priceData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function TrendAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Trend Analysis</h2>
        <p className="text-slate-500 font-medium mt-1">Market and crop trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <MetricDisplay label="Uptrend" value="+12%" icon={TrendingUp} color="emerald" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Momentum" value="Strong" icon={Zap} color="blue" />
        </PremiumCard>
      </div>
    </div>
  );
}

function RegionalInsights() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Regional Insights</h2>
        <p className="text-slate-500 font-medium mt-1">Regional agricultural data</p>
      </div>

      <div className="space-y-3">
        {['Punjab', 'Haryana', 'Uttar Pradesh'].map((region, idx) => (
          <PremiumCard key={idx} className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900">{region}</span>
              <span className="font-black text-blue-600">₹85/kg</span>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function SeasonalPlanning() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Seasonal Planning</h2>
        <p className="text-slate-500 font-medium mt-1">Seasonal recommendations</p>
      </div>

      <div className="space-y-3">
        {['Winter', 'Spring', 'Summer', 'Autumn'].map((season, idx) => (
          <PremiumCard key={season} className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900">{season}</span>
              <span className="font-black text-emerald-600">Optimal</span>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function RiskAssessment() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Risk Assessment</h2>
        <p className="text-slate-500 font-medium mt-1">Agricultural risk analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Weather Risk" value="Low" icon={Cloud} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Pest Risk" value="Very Low" icon={Bug} color="emerald" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Market Risk" value="Low" icon={TrendingUp} color="purple" />
        </PremiumCard>
      </div>
    </div>
  );
}

function RecommendationEngine() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Recommendation Engine</h2>
        <p className="text-slate-500 font-medium mt-1">AI-powered recommendations</p>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <Brain size={48} className="mx-auto text-purple-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">Top Recommendation</h3>
          <p className="text-slate-600 font-medium">Increase irrigation by 15% for optimal yield</p>
        </div>
      </PremiumCard>
    </div>
  );
}
