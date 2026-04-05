'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, AlertCircle, Settings, BarChart3, 
  Clock, CheckCircle, Zap, Users, Target, Eye, Download,
  LineChart as LineChartIcon, PieChart as PieChartIcon
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

const subFeatures = [
  { id: 'dashboard-overview', name: 'Dashboard Overview', icon: LayoutDashboard, description: 'Real-time dashboard' },
  { id: 'real-time-metrics', name: 'Real-Time Metrics', icon: TrendingUp, description: 'Live metrics' },
  { id: 'performance-kpis', name: 'Performance KPIs', icon: BarChart3, description: 'Key metrics' },
  { id: 'alert-management', name: 'Alert Management', icon: AlertCircle, description: 'Alerts' },
  { id: 'quick-actions', name: 'Quick Actions', icon: Zap, description: 'Fast actions' },
  { id: 'customizable-widgets', name: 'Customizable Widgets', icon: Settings, description: 'Widgets' },
  { id: 'data-export', name: 'Data Export', icon: Download, description: 'Export data' },
  { id: 'report-generation', name: 'Report Generation', icon: LineChartIcon, description: 'Reports' },
  { id: 'trend-analysis', name: 'Trend Analysis', icon: LineChartIcon, description: 'Trends' },
  { id: 'comparative-analytics', name: 'Comparative Analytics', icon: PieChartIcon, description: 'Compare' },
  { id: 'predictive-insights', name: 'Predictive Insights', icon: Eye, description: 'Predictions' },
  { id: 'system-health', name: 'System Health', icon: CheckCircle, description: 'Health' },
];

const stats = [
  { label: 'Active Orders', value: '1,247', icon: Target, color: 'blue', trend: '+24%' },
  { label: 'Revenue Today', value: '₹45.2L', icon: TrendingUp, color: 'emerald', trend: '+18%' },
  { label: 'Pending Tasks', value: '23', icon: Clock, color: 'amber', trend: '-5%' },
  { label: 'System Status', value: '99.8%', icon: CheckCircle, color: 'indigo', trend: 'Optimal' },
];

const dashboardData = [
  { time: '00:00', orders: 45, revenue: 2400, users: 240 },
  { time: '04:00', orders: 52, revenue: 2210, users: 221 },
  { time: '08:00', orders: 48, revenue: 2290, users: 229 },
  { time: '12:00', orders: 61, revenue: 2000, users: 200 },
  { time: '16:00', orders: 55, revenue: 2181, users: 218 },
  { time: '20:00', orders: 67, revenue: 2500, users: 250 },
];

const performanceData = [
  { name: 'Orders', value: 35 },
  { name: 'Revenue', value: 25 },
  { name: 'Users', value: 20 },
  { name: 'Engagement', value: 20 },
];

export default function CockpitLiveComplete() {
  const [activeSubFeature, setActiveSubFeature] = useState('dashboard-overview');
  const [loading, setLoading] = useState(false);

  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'dashboard-overview':
        return <DashboardOverview />;
      case 'real-time-metrics':
        return <RealTimeMetrics />;
      case 'performance-kpis':
        return <PerformanceKPIs />;
      case 'alert-management':
        return <AlertManagement />;
      case 'quick-actions':
        return <QuickActions />;
      case 'customizable-widgets':
        return <CustomizableWidgets />;
      case 'data-export':
        return <DataExport />;
      case 'report-generation':
        return <ReportGeneration />;
      case 'trend-analysis':
        return <TrendAnalysis />;
      case 'comparative-analytics':
        return <ComparativeAnalytics />;
      case 'predictive-insights':
        return <PredictiveInsights />;
      case 'system-health':
        return <SystemHealth />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900">Cockpit Live</h1>
            <p className="text-slate-600 font-medium mt-1">Real-time business intelligence dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-sm font-black text-${stat.color}-600`}>{stat.trend}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Sub-Features Navigation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900">Features</h2>
        
        {/* Sub-Feature Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {subFeatures.map((subFeature, idx) => (
            <motion.button
              key={subFeature.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                setLoading(true);
                setActiveSubFeature(subFeature.id);
                setTimeout(() => setLoading(false), 300);
              }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                activeSubFeature === subFeature.id
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-400'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-2">
                <subFeature.icon size={20} className={activeSubFeature === subFeature.id ? 'text-blue-600' : 'text-slate-400'} />
                <div className="flex-1">
                  <div className={`text-sm font-black ${activeSubFeature === subFeature.id ? 'text-blue-900' : 'text-slate-900'}`}>
                    {subFeature.name}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Sub-Feature Content */}
        <motion.div
          key={activeSubFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 min-h-96"
        >
          {renderSubFeature(activeSubFeature)}
        </motion.div>
      </div>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Dashboard Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dashboardData}>
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} />
          <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function RealTimeMetrics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Real-Time Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-sm text-slate-600 font-bold mb-2">Orders/Hour</div>
          <div className="text-4xl font-black text-blue-600">247</div>
          <div className="text-xs text-slate-500 font-medium mt-2">↑ 12% from last hour</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-sm text-slate-600 font-bold mb-2">Revenue/Hour</div>
          <div className="text-4xl font-black text-emerald-600">₹18.5L</div>
          <div className="text-xs text-slate-500 font-medium mt-2">↑ 8% from last hour</div>
        </div>
      </div>
    </div>
  );
}

function PerformanceKPIs() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Performance KPIs</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={performanceData} cx="50%" cy="50%" labelLine={false} label outerRadius={80} fill="#8884d8" dataKey="value">
            {performanceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function AlertManagement() {
  const alerts = [
    { id: 1, title: 'High Order Volume', severity: 'warning', time: '5 min ago' },
    { id: 2, title: 'System Performance', severity: 'info', time: '12 min ago' },
    { id: 3, title: 'Payment Processing', severity: 'success', time: '1 hour ago' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Alert Management</h2>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-black text-slate-900">{alert.title}</div>
              <div className="text-xs text-slate-500 font-medium">{alert.time}</div>
            </div>
            <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
              alert.severity === 'warning' ? 'bg-amber-100 text-amber-600' :
              alert.severity === 'info' ? 'bg-blue-100 text-blue-600' :
              'bg-emerald-100 text-emerald-600'
            }`}>
              {alert.severity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { title: 'Generate Report', icon: '📊' },
    { title: 'Export Data', icon: '📥' },
    { title: 'View Analytics', icon: '📈' },
    { title: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <button key={idx} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-400 transition-all text-center">
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="text-sm font-black text-slate-900">{action.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CustomizableWidgets() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Customizable Widgets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-sm text-slate-600 font-bold mb-4">Widget 1: Orders</div>
          <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600">1,247</div>
              <div className="text-xs text-slate-600 font-medium">Total Orders</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-sm text-slate-600 font-bold mb-4">Widget 2: Revenue</div>
          <div className="h-32 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-600">₹2.4Cr</div>
              <div className="text-xs text-slate-600 font-medium">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataExport() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Data Export</h2>
      <div className="space-y-3">
        <button className="w-full bg-blue-600 text-white rounded-xl p-4 font-black hover:bg-blue-700 transition-all">
          📊 Export to Excel
        </button>
        <button className="w-full bg-red-600 text-white rounded-xl p-4 font-black hover:bg-red-700 transition-all">
          📄 Export to PDF
        </button>
        <button className="w-full bg-purple-600 text-white rounded-xl p-4 font-black hover:bg-purple-700 transition-all">
          📋 Export to CSV
        </button>
      </div>
    </div>
  );
}

function ReportGeneration() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Report Generation</h2>
      <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-4">
        <div>
          <label className="text-sm font-black text-slate-900 block mb-2">Report Type</label>
          <select className="w-full border border-slate-300 rounded-lg p-3 font-medium">
            <option>Daily Summary</option>
            <option>Weekly Report</option>
            <option>Monthly Analysis</option>
          </select>
        </div>
        <button className="w-full bg-blue-600 text-white rounded-xl p-3 font-black hover:bg-blue-700 transition-all">
          Generate Report
        </button>
      </div>
    </div>
  );
}

function TrendAnalysis() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Trend Analysis</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dashboardData}>
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey="orders" fill="#3b82f6" />
          <Bar dataKey="revenue" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ComparativeAnalytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Comparative Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-sm text-slate-600 font-bold mb-4">This Month vs Last Month</div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Orders</span>
              <span className="text-emerald-600 font-black">+18%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Revenue</span>
              <span className="text-emerald-600 font-black">+24%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-sm text-slate-600 font-bold mb-4">Performance vs Target</div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Achievement</span>
              <span className="text-blue-600 font-black">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Remaining</span>
              <span className="text-amber-600 font-black">8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictiveInsights() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Predictive Insights</h2>
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="text-sm text-slate-600 font-bold mb-2">Next 7 Days Forecast</div>
          <div className="text-2xl font-black text-blue-600">↑ 15% Growth Expected</div>
          <div className="text-xs text-slate-600 font-medium mt-2">Based on current trends and historical data</div>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
          <div className="text-sm text-slate-600 font-bold mb-2">Revenue Projection</div>
          <div className="text-2xl font-black text-emerald-600">₹3.2Cr Expected</div>
          <div className="text-xs text-slate-600 font-medium mt-2">Confidence level: 94%</div>
        </div>
      </div>
    </div>
  );
}

function SystemHealth() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">System Health</h2>
      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
          <span className="font-bold text-slate-900">API Response Time</span>
          <span className="text-emerald-600 font-black">45ms</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
          <span className="font-bold text-slate-900">Database Status</span>
          <span className="text-emerald-600 font-black">✓ Healthy</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
          <span className="font-bold text-slate-900">Server Uptime</span>
          <span className="text-emerald-600 font-black">99.8%</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between">
          <span className="font-bold text-slate-900">Cache Hit Rate</span>
          <span className="text-emerald-600 font-black">87%</span>
        </div>
      </div>
    </div>
  );
}
