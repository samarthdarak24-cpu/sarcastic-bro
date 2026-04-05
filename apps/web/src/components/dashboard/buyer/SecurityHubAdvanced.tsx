'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Shield, AlertCircle, Lock, Users, FileText, Zap,
  CheckCircle, Eye, RotateCcw, Settings, TrendingUp, BarChart3,
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
  { id: 'dashboard', name: 'Dashboard', icon: Shield, description: 'Security dashboard', color: 'blue' },
  { id: 'threats', name: 'Threats', icon: AlertCircle, description: 'Threat detection', color: 'red' },
  { id: 'vulnerabilities', name: 'Vulnerabilities', icon: Lock, description: 'Vulnerability assessment', color: 'amber' },
  { id: 'access', name: 'Access', icon: Users, description: 'Access control', color: 'indigo' },
  { id: 'encryption', name: 'Encryption', icon: Lock, description: 'Encryption management', color: 'emerald' },
  { id: 'audit', name: 'Audit', icon: FileText, description: 'Audit logs', color: 'purple' },
  { id: 'incidents', name: 'Incidents', icon: Zap, description: 'Incident response', color: 'cyan' },
  { id: 'policies', name: 'Policies', icon: FileText, description: 'Security policies', color: 'violet' },
  { id: 'permissions', name: 'Permissions', icon: Users, description: 'User permissions', color: 'orange' },
  { id: 'backup', name: 'Backup', icon: RotateCcw, description: 'Data backup', color: 'teal' },
  { id: 'recovery', name: 'Recovery', icon: RotateCcw, description: 'Recovery plans', color: 'pink' },
  { id: 'compliance', name: 'Compliance', icon: CheckCircle, description: 'Compliance reports', color: 'rose' },
];

const securityData = [
  { day: 'Mon', threats: 12, blocked: 12, score: 98 },
  { day: 'Tue', threats: 8, blocked: 8, score: 99 },
  { day: 'Wed', threats: 15, blocked: 15, score: 97 },
  { day: 'Thu', threats: 6, blocked: 6, score: 99 },
  { day: 'Fri', threats: 10, blocked: 10, score: 98 },
  { day: 'Sat', threats: 4, blocked: 4, score: 99 },
  { day: 'Sun', threats: 3, blocked: 3, score: 99 },
];

function SecurityDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Security Score" value="98.5%" icon={Shield} color="emerald" trend="+1%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Threats Blocked" value="847" icon={AlertCircle} color="red" trend="+12%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Vulnerabilities" value="0" icon={Lock} color="blue" trend="None" />
        </PremiumCard>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Security Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={securityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="threats" fill="#ef4444" radius={[8, 8, 0, 0]} />
            <Bar dataKey="blocked" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function ThreatDetection() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Active Threats</h3>
        <div className="space-y-3">
          {[
            { threat: 'SQL Injection Attempt', severity: 'High', action: 'Blocked', time: '2 min ago' },
            { threat: 'Brute Force Attack', severity: 'Medium', action: 'Blocked', time: '15 min ago' },
            { threat: 'Suspicious Login', severity: 'Low', action: 'Flagged', time: '1 hour ago' },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 bg-${item.severity === 'High' ? 'red' : item.severity === 'Medium' ? 'amber' : 'blue'}-50 rounded-xl border border-${item.severity === 'High' ? 'red' : item.severity === 'Medium' ? 'amber' : 'blue'}-200`}>
              <p className={`font-bold text-${item.severity === 'High' ? 'red' : item.severity === 'Medium' ? 'amber' : 'blue'}-900`}>{item.threat}</p>
              <p className={`text-xs text-${item.severity === 'High' ? 'red' : item.severity === 'Medium' ? 'amber' : 'blue'}-700`}>{item.severity} • {item.action} • {item.time}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function VulnerabilityAssessment() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">0</div>
            <p className="text-sm font-medium text-slate-600">Critical</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-amber-600 mb-2">2</div>
            <p className="text-sm font-medium text-slate-600">Medium</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">5</div>
            <p className="text-sm font-medium text-slate-600">Low</p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function AccessControl() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Access Levels</h3>
        <div className="space-y-3">
          {[
            { role: 'Admin', users: 3, permissions: 'Full Access', status: 'Active' },
            { role: 'Manager', users: 8, permissions: 'Limited Access', status: 'Active' },
            { role: 'User', users: 45, permissions: 'Read Only', status: 'Active' },
            { role: 'Guest', users: 12, permissions: 'View Only', status: 'Active' },
          ].map((access, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900">{access.role}</p>
                <span className="text-xs font-bold text-emerald-600">{access.users} users</span>
              </div>
              <p className="text-sm text-slate-600">{access.permissions}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function EncryptionManagement() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Encryption Status</h3>
        <div className="space-y-3">
          {[
            { type: 'Data at Rest', algorithm: 'AES-256', status: 'Enabled' },
            { type: 'Data in Transit', algorithm: 'TLS 1.3', status: 'Enabled' },
            { type: 'Database', algorithm: 'AES-256', status: 'Enabled' },
            { type: 'Backups', algorithm: 'AES-256', status: 'Enabled' },
          ].map((enc, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{enc.type}</p>
                <p className="text-xs text-slate-600">{enc.algorithm}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600">✓ {enc.status}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function AuditLogs() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Audit Logs</h3>
        <div className="space-y-3">
          {[
            { action: 'User Login', user: 'admin@company.com', time: '2 min ago', status: 'Success' },
            { action: 'File Access', user: 'user@company.com', time: '15 min ago', status: 'Success' },
            { action: 'Permission Change', user: 'admin@company.com', time: '1 hour ago', status: 'Success' },
            { action: 'Data Export', user: 'manager@company.com', time: '2 hours ago', status: 'Success' },
          ].map((log, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{log.action}</p>
                <p className="text-xs text-slate-600">{log.user}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-600">{log.time}</p>
                <p className="text-xs text-emerald-600">✓ {log.status}</p>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function IncidentResponse() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">847</div>
            <p className="text-sm font-medium text-slate-600">Resolved</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">0</div>
            <p className="text-sm font-medium text-slate-600">Pending</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-amber-600 mb-2">99.6%</div>
            <p className="text-sm font-medium text-slate-600">Resolution Rate</p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function SecurityPolicies() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Active Policies</h3>
        <div className="space-y-2">
          {[
            { policy: 'Password Policy', status: 'Enforced' },
            { policy: 'Two-Factor Auth', status: 'Enforced' },
            { policy: 'Session Timeout', status: 'Enforced' },
            { policy: 'Data Retention', status: 'Enforced' },
          ].map((policy, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="font-medium text-slate-700">{policy.policy}</span>
              <span className="text-xs font-bold text-emerald-600">✓ {policy.status}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function UserPermissions() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">User Permissions</h3>
        <div className="space-y-3">
          {[
            { user: 'admin@company.com', role: 'Admin', permissions: 'All', status: 'Active' },
            { user: 'manager@company.com', role: 'Manager', permissions: 'Limited', status: 'Active' },
            { user: 'user@company.com', role: 'User', permissions: 'Read', status: 'Active' },
          ].map((perm, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-900">{user.user}</p>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-slate-600">{perm.role}</span>
                <span className="text-emerald-600 font-bold">{perm.permissions}</span>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function DataBackup() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Backup Status</h3>
        <div className="space-y-3">
          {[
            { type: 'Daily Backup', lastRun: '2 hours ago', status: 'Success', size: '2.4 GB' },
            { type: 'Weekly Backup', lastRun: '2 days ago', status: 'Success', size: '12.8 GB' },
            { type: 'Monthly Backup', lastRun: '5 days ago', status: 'Success', size: '45.2 GB' },
          ].map((backup, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-900">{backup.type}</p>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-slate-600">{backup.lastRun}</span>
                <span className="text-emerald-600 font-bold">{backup.size}</span>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function RecoveryPlans() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recovery Options</h3>
        <div className="space-y-3">
          {[
            { plan: 'Point-in-Time Recovery', rto: '1 hour', rpo: '15 minutes' },
            { plan: 'Full System Recovery', rto: '4 hours', rpo: '1 hour' },
            { plan: 'Disaster Recovery', rto: '24 hours', rpo: '4 hours' },
          ].map((recovery, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-900">{recovery.plan}</p>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-slate-600">RTO: {recovery.rto}</span>
                <span className="text-slate-600">RPO: {recovery.rpo}</span>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function ComplianceReports() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Compliance Status</h3>
        <div className="space-y-2">
          {[
            { standard: 'GDPR', status: 'Compliant' },
            { standard: 'ISO 27001', status: 'Compliant' },
            { standard: 'SOC 2 Type II', status: 'Compliant' },
            { standard: 'PCI-DSS', status: 'Compliant' },
          ].map((compliance, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="font-medium text-slate-700">{compliance.standard}</span>
              <span className="text-xs font-bold text-emerald-600">✓ {compliance.status}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

export function SecurityHubAdvanced() {
  const stats = [
    { label: 'Security Score', value: '98.5%', icon: Shield, color: 'emerald', trend: '+1%' },
    { label: 'Threats Blocked', value: '847', icon: AlertCircle, color: 'red', trend: '+12%' },
    { label: 'Vulnerabilities', value: '0', icon: Lock, color: 'blue', trend: 'None' },
    { label: 'Compliance', value: '100%', icon: CheckCircle, color: 'indigo', trend: 'Verified' },
  ];

  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'dashboard': return <SecurityDashboard />;
      case 'threats': return <ThreatDetection />;
      case 'vulnerabilities': return <VulnerabilityAssessment />;
      case 'access': return <AccessControl />;
      case 'encryption': return <EncryptionManagement />;
      case 'audit': return <AuditLogs />;
      case 'incidents': return <IncidentResponse />;
      case 'policies': return <SecurityPolicies />;
      case 'permissions': return <UserPermissions />;
      case 'backup': return <DataBackup />;
      case 'recovery': return <RecoveryPlans />;
      case 'compliance': return <ComplianceReports />;
      default: return <SecurityDashboard />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Security Hub"
      description="Comprehensive security management and monitoring"
      icon={Shield}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}
