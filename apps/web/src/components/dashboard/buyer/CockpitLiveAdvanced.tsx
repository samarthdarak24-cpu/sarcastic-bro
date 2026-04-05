'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Activity, TrendingUp, AlertCircle, Settings, Download, Bell, 
  Zap, Eye, Clock, Target, BarChart3, PieChart as PieChartIcon,
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
  { id: 'dashboard', name: 'Dashboard', icon: Activity, description: 'Real-time overview', color: 'blue' },
  { id: 'metrics', name: 'Metrics', icon: TrendingUp, description: 'KPI tracking', color: 'emerald' },
  { id: 'alerts', name: 'Alerts', icon: AlertCircle, description: 'Alert management', color: 'red' },
  { id: 'monitoring', name: 'Monitoring', icon: Eye, description: 'System monitoring', color: 'indigo' },
  { id: 'health', name: 'Health', icon: Zap, description: 'System health', color: 'amber' },
  { id: 'feed', name: 'Activity', icon: Clock, description: 'Activity feed', color: 'purple' },
  { id: 'actions', name: 'Actions', icon: Target, description: 'Quick actions', color: 'cyan' },
  { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Notification center', color: 'pink' },
  { id: 'widgets', name: 'Widgets', icon: BarChart3, description: 'Custom widgets', color: 'violet' },
  { id: 'reports', name: 'Reports', icon: PieChartIcon, description: 'Report generation', color: 'orange' },
  { id: 'export', name: 'Export', icon: Download, description: 'Data export', color: 'teal' },
  { id: 'settings', name: 'Settings', icon: Settings, description: 'System settings', color: 'rose' },
];

const dashboardData = [
  { name: 'Mon', value: 2400, target: 2210 },
  { name: 'Tue', value: 1398, target: 2290 },
  { name: 'Wed', value: 9800, target: 2000 },
  { name: 'Thu', value: 3908, target: 2181 },
  { name: 'Fri', value: 4800, target: 2500 },
  { name: 'Sat', value: 3800, target: 2100 },
  { name: 'Sun', value: 4300, target: 2100 },
];

const systemHealth = [
  { name: 'Operational', value: 85, fill: '#10b981' },
  { name: 'Warning', value: 10, fill: '#f59e0b' },
  { name: 'Critical', value: 5, fill: '#ef4444' },
];

function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </PremiumCard>

        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">System Health</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={systemHealth} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                {systemHealth.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </PremiumCard>
      </div>

      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Trend Analysis</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dashboardData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function MetricsTracking() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Active Users" value="2,847" icon={Activity} color="blue" trend="+12%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="System Uptime" value="99.98%" icon={Zap} color="emerald" trend="+0.2%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Avg Response" value="145ms" icon={Clock} color="indigo" trend="-8%" />
        </PremiumCard>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">KPI Dashboard</h3>
        <div className="space-y-4">
          {[
            { label: 'Transaction Success Rate', value: '98.5%', color: 'emerald' },
            { label: 'Average Load Time', value: '1.2s', color: 'blue' },
            { label: 'Error Rate', value: '0.15%', color: 'red' },
            { label: 'Cache Hit Ratio', value: '94.2%', color: 'indigo' },
          ].map((kpi, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">{kpi.label}</span>
              <span className={`font-bold text-${kpi.color}-600`}>{kpi.value}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function AlertManagement() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-red-600 mb-2">12</div>
            <p className="text-sm font-medium text-slate-600">Critical Alerts</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-amber-600 mb-2">28</div>
            <p className="text-sm font-medium text-slate-600">Warning Alerts</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">156</div>
            <p className="text-sm font-medium text-slate-600">Info Alerts</p>
          </div>
        </PremiumCard>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {[
            { type: 'Critical', msg: 'Database connection timeout', time: '2 min ago', color: 'red' },
            { type: 'Warning', msg: 'High memory usage detected', time: '5 min ago', color: 'amber' },
            { type: 'Info', msg: 'Backup completed successfully', time: '15 min ago', color: 'blue' },
          ].map((alert, idx) => (
            <div key={idx} className={`p-4 bg-${alert.color}-50 border border-${alert.color}-200 rounded-xl flex justify-between items-center`}>
              <div>
                <p className={`font-bold text-${alert.color}-900`}>{alert.type}</p>
                <p className="text-sm text-slate-600">{alert.msg}</p>
              </div>
              <span className="text-xs font-medium text-slate-500">{alert.time}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function SystemMonitoring() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Resource Usage</h3>
        <div className="space-y-4">
          {[
            { label: 'CPU Usage', value: 65, color: 'blue' },
            { label: 'Memory Usage', value: 78, color: 'indigo' },
            { label: 'Disk Usage', value: 42, color: 'emerald' },
            { label: 'Network Usage', value: 55, color: 'amber' },
          ].map((resource, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-slate-700">{resource.label}</span>
                <span className={`font-bold text-${resource.color}-600`}>{resource.value}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${resource.value}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full bg-gradient-to-r from-${resource.color}-500 to-${resource.color}-600 rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function SystemHealth() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Service Status</h3>
          <div className="space-y-3">
            {[
              { name: 'API Server', status: 'Operational', color: 'emerald' },
              { name: 'Database', status: 'Operational', color: 'emerald' },
              { name: 'Cache Server', status: 'Operational', color: 'emerald' },
              { name: 'Message Queue', status: 'Degraded', color: 'amber' },
            ].map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">{service.name}</span>
                <div className={`h-3 w-3 rounded-full bg-${service.color}-500`} />
              </div>
            ))}
          </div>
        </PremiumCard>
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Uptime History</h3>
          <div className="space-y-2">
            {['Today', 'This Week', 'This Month', 'This Year'].map((period, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">{period}</span>
                <span className="font-bold text-emerald-600">99.98%</span>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function ActivityFeed() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'User Login', user: 'John Doe', time: '2 min ago', icon: Activity },
            { action: 'Order Created', user: 'Jane Smith', time: '5 min ago', icon: TrendingUp },
            { action: 'Payment Processed', user: 'System', time: '10 min ago', icon: Zap },
            { action: 'Report Generated', user: 'Admin', time: '15 min ago', icon: Download },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <activity.icon size={18} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{activity.action}</p>
                <p className="text-xs text-slate-500">{activity.user}</p>
              </div>
              <span className="text-xs font-medium text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionButton variant="primary" icon={Download}>Export Data</ActionButton>
        <ActionButton variant="success" icon={Zap}>Run Diagnostics</ActionButton>
        <ActionButton variant="secondary" icon={Settings}>Configure Alerts</ActionButton>
        <ActionButton variant="danger" icon={AlertCircle}>View Incidents</ActionButton>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recommended Actions</h3>
        <div className="space-y-3">
          {[
            'Optimize database queries for better performance',
            'Update security certificates expiring in 7 days',
            'Scale up resources due to increased traffic',
            'Review and archive old logs',
          ].map((action, idx) => (
            <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900 font-medium">
              • {action}
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function NotificationCenter() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Notifications</h3>
        <div className="space-y-3">
          {[
            { title: 'System Update', desc: 'New version available', type: 'info' },
            { title: 'Security Alert', desc: 'Unusual login detected', type: 'warning' },
            { title: 'Maintenance', desc: 'Scheduled maintenance tonight', type: 'info' },
          ].map((notif, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900">{notif.title}</p>
              <p className="text-sm text-slate-600">{notif.desc}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function CustomWidgets() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Widget Library</h3>
          <div className="space-y-2">
            {['Performance Chart', 'Alert Summary', 'User Activity', 'System Status'].map((widget, idx) => (
              <button key={idx} className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg font-medium text-blue-900 transition-colors">
                + Add {widget}
              </button>
            ))}
          </div>
        </PremiumCard>
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Active Widgets</h3>
          <div className="space-y-2">
            {['Performance Chart', 'Alert Summary', 'System Status'].map((widget, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                <span className="font-medium text-slate-700">{widget}</span>
                <button className="text-red-600 hover:text-red-700 font-bold">×</button>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function ReportGeneration() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Generate Reports</h3>
        <div className="space-y-4">
          {[
            { name: 'Performance Report', desc: 'System performance metrics' },
            { name: 'Security Report', desc: 'Security audit and compliance' },
            { name: 'Usage Report', desc: 'Resource usage analysis' },
            { name: 'Incident Report', desc: 'Incident and alert summary' },
          ].map((report, idx) => (
            <button key={idx} className="w-full p-4 text-left bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors">
              <p className="font-bold text-slate-900">{report.name}</p>
              <p className="text-sm text-slate-600">{report.desc}</p>
            </button>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function DataExport() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Export Data</h3>
        <div className="space-y-4">
          {[
            { format: 'CSV', desc: 'Comma-separated values' },
            { format: 'JSON', desc: 'JSON format' },
            { format: 'Excel', desc: 'Microsoft Excel' },
            { format: 'PDF', desc: 'Portable Document Format' },
          ].map((format, idx) => (
            <button key={idx} className="w-full p-4 text-left bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{format.format}</p>
                <p className="text-sm text-slate-600">{format.desc}</p>
              </div>
              <Download size={20} className="text-blue-600" />
            </button>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">System Configuration</h3>
        <div className="space-y-4">
          {[
            { setting: 'Auto-refresh Interval', value: '30 seconds' },
            { setting: 'Alert Threshold', value: 'High' },
            { setting: 'Data Retention', value: '90 days' },
            { setting: 'Backup Frequency', value: 'Daily' },
          ].map((config, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">{config.setting}</span>
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                {config.value}
              </button>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

export function CockpitLiveAdvanced() {
  const stats = [
    { label: 'Active Users', value: '2,847', icon: Activity, color: 'blue', trend: '+12%' },
    { label: 'System Uptime', value: '99.98%', icon: Zap, color: 'emerald', trend: '+0.2%' },
    { label: 'Avg Response', value: '145ms', icon: Clock, color: 'indigo', trend: '-8%' },
    { label: 'Alerts Today', value: '40', icon: AlertCircle, color: 'amber', trend: '-5%' },
  ];

  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'dashboard': return <DashboardOverview />;
      case 'metrics': return <MetricsTracking />;
      case 'alerts': return <AlertManagement />;
      case 'monitoring': return <SystemMonitoring />;
      case 'health': return <SystemHealth />;
      case 'feed': return <ActivityFeed />;
      case 'actions': return <QuickActions />;
      case 'notifications': return <NotificationCenter />;
      case 'widgets': return <CustomWidgets />;
      case 'reports': return <ReportGeneration />;
      case 'export': return <DataExport />;
      case 'settings': return <SystemSettings />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Cockpit Live"
      description="Real-time dashboard and system monitoring"
      icon={Activity}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}
