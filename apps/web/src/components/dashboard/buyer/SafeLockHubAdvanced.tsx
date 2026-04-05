'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Lock, Shield, AlertCircle, Key, Smartphone, Clock,
  CheckCircle, Eye, RotateCcw, Settings, FileText, Zap,
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
  { id: 'transactions', name: 'Transactions', icon: Lock, description: 'Secure transactions', color: 'blue' },
  { id: 'encryption', name: 'Encryption', icon: Key, description: 'Encryption status', color: 'emerald' },
  { id: 'certificates', name: 'Certificates', icon: FileText, description: 'Security certificates', color: 'amber' },
  { id: 'fraud', name: 'Fraud', icon: AlertCircle, description: 'Fraud prevention', color: 'indigo' },
  { id: 'account', name: 'Account', icon: Shield, description: 'Account protection', color: 'rose' },
  { id: 'devices', name: 'Devices', icon: Smartphone, description: 'Device management', color: 'purple' },
  { id: 'login', name: 'Login', icon: Eye, description: 'Login history', color: 'cyan' },
  { id: 'alerts', name: 'Alerts', icon: AlertCircle, description: 'Security alerts', color: 'violet' },
  { id: 'backup', name: 'Backup', icon: RotateCcw, description: 'Backup & recovery', color: 'orange' },
  { id: 'privacy', name: 'Privacy', icon: Eye, description: 'Privacy settings', color: 'teal' },
  { id: 'data', name: 'Data', icon: Lock, description: 'Data protection', color: 'pink' },
  { id: 'compliance', name: 'Compliance', icon: CheckCircle, description: 'Compliance verification', color: 'red' },
];

function SecureTransactions() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Transactions" value="1,247" icon={Lock} color="blue" trend="+12%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Success Rate" value="99.98%" icon={CheckCircle} color="emerald" trend="+0.1%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Fraud Rate" value="0.02%" icon={AlertCircle} color="red" trend="-0.01%" />
        </PremiumCard>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {[
            { id: '#TXN-001', amount: '₹50,000', status: 'Verified', time: '2 min ago' },
            { id: '#TXN-002', amount: '₹75,000', status: 'Verified', time: '15 min ago' },
            { id: '#TXN-003', amount: '₹30,000', status: 'Verified', time: '1 hour ago' },
          ].map((txn, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{txn.id}</p>
                <p className="text-xs text-slate-600">{txn.time}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{txn.amount}</p>
                <p className="text-xs text-emerald-600">✓ {txn.status}</p>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function EncryptionStatus() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Encryption Details</h3>
        <div className="space-y-4">
          {[
            { protocol: 'TLS 1.3', status: 'Active', strength: '256-bit' },
            { protocol: 'AES Encryption', status: 'Active', strength: '256-bit' },
            { protocol: 'RSA Keys', status: 'Active', strength: '2048-bit' },
            { protocol: 'HMAC-SHA256', status: 'Active', strength: 'Strong' },
          ].map((enc, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900">{enc.protocol}</p>
                <span className="text-xs font-bold text-emerald-600">✓ {enc.status}</span>
              </div>
              <p className="text-sm text-slate-600">{enc.strength}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function SecurityCertificates() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">SSL Certificates</h3>
        <div className="space-y-3">
          {[
            { cert: 'Primary SSL', issuer: 'Let\'s Encrypt', expiry: '2025-12-31', status: 'Valid' },
            { cert: 'Backup SSL', issuer: 'DigiCert', expiry: '2026-06-15', status: 'Valid' },
            { cert: 'Code Signing', issuer: 'Sectigo', expiry: '2025-03-20', status: 'Valid' },
          ].map((cert, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
              <p className="font-bold text-slate-900">{cert.cert}</p>
              <p className="text-xs text-slate-600">{cert.issuer}</p>
              <p className="text-xs text-emerald-600 font-medium">Expires: {cert.expiry}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function FraudPrevention() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">99.98%</div>
            <p className="text-sm font-medium text-slate-600">Detection Rate</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">847</div>
            <p className="text-sm font-medium text-slate-600">Threats Blocked</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-amber-600 mb-2">0</div>
            <p className="text-sm font-medium text-slate-600">Breaches</p>
          </div>
        </PremiumCard>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Protection Measures</h3>
        <div className="space-y-2">
          {[
            '✓ Real-time threat monitoring',
            '✓ AI-powered anomaly detection',
            '✓ Multi-factor authentication',
            '✓ Rate limiting & DDoS protection',
          ].map((measure, idx) => (
            <div key={idx} className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-900 font-medium">
              {measure}
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function AccountProtection() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Security Settings</h3>
        <div className="space-y-3">
          {[
            { setting: 'Two-Factor Auth', status: 'Enabled', icon: '✓' },
            { setting: 'Biometric Login', status: 'Enabled', icon: '✓' },
            { setting: 'Password Strength', status: 'Strong', icon: '✓' },
            { setting: 'Session Timeout', status: '30 minutes', icon: '⏱' },
          ].map((setting, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <span className="font-medium text-slate-700">{setting.setting}</span>
              <span className="text-sm font-bold text-emerald-600">{setting.status}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function DeviceManagement() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Trusted Devices</h3>
        <div className="space-y-3">
          {[
            { device: 'Chrome on Windows', lastUsed: '2 min ago', location: 'New Delhi', status: 'Active' },
            { device: 'Safari on iPhone', lastUsed: '1 hour ago', location: 'New Delhi', status: 'Active' },
            { device: 'Firefox on Linux', lastUsed: '3 days ago', location: 'Mumbai', status: 'Inactive' },
          ].map((device, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900">{device.device}</p>
                <span className={`text-xs font-bold ${device.status === 'Active' ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {device.status}
                </span>
              </div>
              <p className="text-xs text-slate-600">{device.location} • {device.lastUsed}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function LoginHistory() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Logins</h3>
        <div className="space-y-3">
          {[
            { time: '2 min ago', device: 'Chrome - Windows', location: 'New Delhi', status: 'Success' },
            { time: '1 hour ago', device: 'Safari - iPhone', location: 'New Delhi', status: 'Success' },
            { time: '3 days ago', device: 'Firefox - Linux', location: 'Mumbai', status: 'Success' },
            { time: '1 week ago', device: 'Unknown', location: 'Unknown', status: 'Blocked' },
          ].map((login, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{login.device}</p>
                <p className="text-xs text-slate-600">{login.location}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-600">{login.time}</p>
                <p className={`text-xs font-bold ${login.status === 'Success' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {login.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function SecurityAlerts() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Active Alerts</h3>
        <div className="space-y-3">
          {[
            { alert: 'New login from unknown device', severity: 'Medium', action: 'Review' },
            { alert: 'Password change recommended', severity: 'Low', action: 'Update' },
            { alert: 'Certificate expiring in 30 days', severity: 'Low', action: 'Renew' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{item.alert}</p>
                <p className={`text-xs font-bold ${item.severity === 'Medium' ? 'text-amber-600' : 'text-blue-600'}`}>
                  {item.severity}
                </p>
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

function BackupRecovery() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Backup Status</h3>
          <div className="space-y-3">
            {[
              { type: 'Daily Backup', lastRun: '2 hours ago', status: 'Success' },
              { type: 'Weekly Backup', lastRun: '2 days ago', status: 'Success' },
              { type: 'Monthly Backup', lastRun: '5 days ago', status: 'Success' },
            ].map((backup, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-900 text-sm">{backup.type}</p>
                <p className="text-xs text-slate-600">{backup.lastRun}</p>
              </div>
            ))}
          </div>
        </PremiumCard>
        <PremiumCard>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recovery Options</h3>
          <div className="space-y-2">
            {[
              'Restore from backup',
              'Download backup file',
              'Schedule backup',
              'View backup history',
            ].map((option, idx) => (
              <button key={idx} className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg font-medium text-blue-900 transition-colors text-sm">
                {option}
              </button>
            ))}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function PrivacySettings() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Privacy Controls</h3>
        <div className="space-y-3">
          {[
            { setting: 'Profile Visibility', value: 'Private' },
            { setting: 'Activity Tracking', value: 'Disabled' },
            { setting: 'Data Sharing', value: 'Disabled' },
            { setting: 'Marketing Emails', value: 'Disabled' },
          ].map((privacy, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <span className="font-medium text-slate-700">{privacy.setting}</span>
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm">
                {privacy.value}
              </button>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function DataProtection() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Data Protection</h3>
        <div className="space-y-3">
          {[
            { item: 'Personal Data', encrypted: 'Yes', location: 'Secure Server' },
            { item: 'Transaction Data', encrypted: 'Yes', location: 'Secure Server' },
            { item: 'Payment Info', encrypted: 'Yes', location: 'PCI-DSS Compliant' },
            { item: 'Documents', encrypted: 'Yes', location: 'Secure Vault' },
          ].map((data, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-900 mb-1">{data.item}</p>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-600 font-bold">✓ {data.encrypted}</span>
                <span className="text-slate-600">{data.location}</span>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function ComplianceVerification() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Compliance Status</h3>
        <div className="space-y-2">
          {[
            { standard: 'GDPR', status: 'Compliant' },
            { standard: 'PCI-DSS', status: 'Compliant' },
            { standard: 'ISO 27001', status: 'Compliant' },
            { standard: 'SOC 2 Type II', status: 'Compliant' },
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

export function SafeLockHubAdvanced() {
  const stats = [
    { label: 'Success Rate', value: '99.98%', icon: CheckCircle, color: 'emerald', trend: '+0.1%' },
    { label: 'Threats Blocked', value: '847', icon: AlertCircle, color: 'red', trend: '+12%' },
    { label: 'Encryption', value: '256-bit', icon: Lock, color: 'blue', trend: 'Active' },
    { label: 'Compliance', value: '100%', icon: Shield, color: 'indigo', trend: 'Verified' },
  ];

  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'transactions': return <SecureTransactions />;
      case 'encryption': return <EncryptionStatus />;
      case 'certificates': return <SecurityCertificates />;
      case 'fraud': return <FraudPrevention />;
      case 'account': return <AccountProtection />;
      case 'devices': return <DeviceManagement />;
      case 'login': return <LoginHistory />;
      case 'alerts': return <SecurityAlerts />;
      case 'backup': return <BackupRecovery />;
      case 'privacy': return <PrivacySettings />;
      case 'data': return <DataProtection />;
      case 'compliance': return <ComplianceVerification />;
      default: return <SecureTransactions />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Safe-Lock Hub"
      description="Enterprise-grade security and data protection"
      icon={Lock}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}
