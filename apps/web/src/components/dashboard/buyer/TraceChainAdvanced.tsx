'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Link2, Eye, FileText, CheckCircle, Users, Leaf,
  Droplets, AlertCircle, Download, Settings, MapPin, Clock,
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
  { id: 'visualization', name: 'Visualization', icon: Link2, description: 'Chain visualization', color: 'blue' },
  { id: 'nodes', name: 'Nodes', icon: Eye, description: 'Node information', color: 'emerald' },
  { id: 'transactions', name: 'Transactions', icon: FileText, description: 'Transaction details', color: 'amber' },
  { id: 'verification', name: 'Verification', icon: CheckCircle, description: 'Verification status', color: 'indigo' },
  { id: 'audit', name: 'Audit', icon: Clock, description: 'Audit trail', color: 'rose' },
  { id: 'stakeholders', name: 'Stakeholders', icon: Users, description: 'Stakeholder info', color: 'purple' },
  { id: 'checkpoints', name: 'Checkpoints', icon: MapPin, description: 'Quality checkpoints', color: 'cyan' },
  { id: 'certifications', name: 'Certifications', icon: FileText, description: 'Certification records', color: 'violet' },
  { id: 'environmental', name: 'Environmental', icon: Leaf, description: 'Environmental data', color: 'orange' },
  { id: 'compliance', name: 'Compliance', icon: CheckCircle, description: 'Compliance status', color: 'teal' },
  { id: 'export', name: 'Export', icon: Download, description: 'Export capabilities', color: 'pink' },
  { id: 'api', name: 'API', icon: Settings, description: 'API access', color: 'red' },
];

const traceData = [
  { stage: 'Farm', verified: 98, time: '0-2 days' },
  { stage: 'Processing', verified: 97, time: '2-5 days' },
  { stage: 'Warehouse', verified: 99, time: '5-10 days' },
  { stage: 'Transport', verified: 96, time: '10-15 days' },
  { stage: 'Delivery', verified: 99, time: '15-20 days' },
];

function ChainVisualization() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Chain Length" value="5 Nodes" icon={Link2} color="blue" trend="Complete" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Verification" value="98.5%" icon={CheckCircle} color="emerald" trend="+2%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Trace Time" value="2.3s" icon={Clock} color="amber" trend="-15%" />
        </PremiumCard>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Supply Chain Flow</h3>
        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-xl">
          {['Farm', 'Processing', 'Warehouse', 'Transport', 'Delivery'].map((stage, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mb-2">
                {idx + 1}
              </div>
              <p className="text-xs font-bold text-slate-700">{stage}</p>
              {idx < 4 && <div className="w-12 h-1 bg-emerald-500 mt-2" />}
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function NodeInformation() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Chain Nodes</h3>
        <div className="space-y-3">
          {[
            { node: 'Farm Node', id: 'FRM-001', status: 'Verified', data: 'Origin verified' },
            { node: 'Processing Node', id: 'PRC-001', status: 'Verified', data: 'Quality checked' },
            { node: 'Warehouse Node', id: 'WRH-001', status: 'Verified', data: 'Storage confirmed' },
            { node: 'Transport Node', id: 'TRN-001', status: 'Verified', data: 'In transit' },
            { node: 'Delivery Node', id: 'DLV-001', status: 'Verified', data: 'Delivered' },
          ].map((node, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900">{node.node}</p>
                <span className="text-xs font-bold text-emerald-600">✓ {node.status}</span>
              </div>
              <p className="text-xs text-slate-600">{node.id} • {node.data}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function TransactionDetails() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Transaction Log</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={traceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="stage" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="verified" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function VerificationStatus() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">98.5%</div>
            <p className="text-sm font-medium text-slate-600">Verified</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">1,247</div>
            <p className="text-sm font-medium text-slate-600">Transactions</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-amber-600 mb-2">0</div>
            <p className="text-sm font-medium text-slate-600">Anomalies</p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function AuditTrail() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Audit History</h3>
        <div className="space-y-3">
          {[
            { action: 'Product Verified', user: 'System', time: '2 min ago', status: 'Success' },
            { action: 'Quality Checked', user: 'Inspector', time: '15 min ago', status: 'Success' },
            { action: 'Origin Confirmed', user: 'Farmer', time: '1 hour ago', status: 'Success' },
            { action: 'Chain Initiated', user: 'System', time: '2 hours ago', status: 'Success' },
          ].map((audit, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{audit.action}</p>
                <p className="text-xs text-slate-600">{audit.user} • {audit.time}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600">✓ {audit.status}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function StakeholderInfo() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Stakeholders</h3>
        <div className="space-y-3">
          {[
            { role: 'Farmer', name: 'Ramesh Yadav', contact: 'ramesh@farm.com', verified: true },
            { role: 'Processor', name: 'Quality Mills Ltd', contact: 'info@mills.com', verified: true },
            { role: 'Distributor', name: 'Express Logistics', contact: 'logistics@express.com', verified: true },
            { role: 'Buyer', name: 'Your Company', contact: 'buyer@company.com', verified: true },
          ].map((stakeholder, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900">{stakeholder.role}</p>
                {stakeholder.verified && <span className="text-xs font-bold text-emerald-600">✓ Verified</span>}
              </div>
              <p className="text-sm text-slate-600">{stakeholder.name}</p>
              <p className="text-xs text-slate-500">{stakeholder.contact}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function QualityCheckpoints() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quality Checkpoints</h3>
        <div className="space-y-3">
          {[
            { checkpoint: 'Origin Verification', status: 'Passed', score: '98%' },
            { checkpoint: 'Quality Inspection', status: 'Passed', score: '96%' },
            { checkpoint: 'Packaging Check', status: 'Passed', score: '99%' },
            { checkpoint: 'Final Verification', status: 'Passed', score: '97%' },
          ].map((checkpoint, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{checkpoint.checkpoint}</p>
                <p className="text-xs text-emerald-600">✓ {checkpoint.status}</p>
              </div>
              <span className="font-bold text-slate-900">{checkpoint.score}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function CertificationRecords() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Certifications</h3>
        <div className="space-y-3">
          {[
            { cert: 'Organic Certified', issuer: 'APEDA', expiry: '2025-12-31' },
            { cert: 'Fair Trade', issuer: 'Fair Trade International', expiry: '2025-06-30' },
            { cert: 'Quality Assured', issuer: 'ISO 9001', expiry: '2026-03-15' },
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

function EnvironmentalData() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Environmental Impact</h3>
        <div className="space-y-3">
          {[
            { metric: 'Carbon Footprint', value: '2.3 kg CO2', status: 'Low' },
            { metric: 'Water Usage', value: '450 liters', status: 'Optimal' },
            { metric: 'Pesticide Use', value: 'Organic', status: 'Zero' },
            { metric: 'Soil Health', value: 'Excellent', status: 'Good' },
          ].map((env, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{env.metric}</p>
                <p className="text-xs text-emerald-600">{env.status}</p>
              </div>
              <span className="font-bold text-slate-900">{env.value}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function ComplianceStatus() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Compliance Verification</h3>
        <div className="space-y-2">
          {[
            { standard: 'GDPR', status: 'Compliant' },
            { standard: 'Food Safety', status: 'Compliant' },
            { standard: 'Environmental', status: 'Compliant' },
            { standard: 'Labor Standards', status: 'Compliant' },
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

function ExportCapabilities() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Export Options</h3>
        <div className="space-y-3">
          {[
            { format: 'PDF Report', desc: 'Complete trace report' },
            { format: 'CSV Data', desc: 'Transaction data' },
            { format: 'JSON API', desc: 'API integration' },
            { format: 'QR Code', desc: 'Mobile verification' },
          ].map((export_opt, idx) => (
            <button key={idx} className="w-full p-4 text-left bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{export_opt.format}</p>
                <p className="text-sm text-slate-600">{export_opt.desc}</p>
              </div>
              <Download size={20} className="text-blue-600" />
            </button>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function APIAccess() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">API Integration</h3>
        <div className="space-y-3">
          {[
            { endpoint: '/api/trace/verify', method: 'POST', status: 'Active' },
            { endpoint: '/api/trace/history', method: 'GET', status: 'Active' },
            { endpoint: '/api/trace/export', method: 'GET', status: 'Active' },
            { endpoint: '/api/trace/stakeholders', method: 'GET', status: 'Active' },
          ].map((api, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-900 font-mono text-sm">{api.endpoint}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">{api.method}</span>
                <span className="text-xs font-bold text-emerald-600">✓ {api.status}</span>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

export function TraceChainAdvanced() {
  const stats = [
    { label: 'Verification', value: '98.5%', icon: CheckCircle, color: 'emerald', trend: '+2%' },
    { label: 'Transactions', value: '1,247', icon: Link2, color: 'blue', trend: '+12%' },
    { label: 'Trace Time', value: '2.3s', icon: Clock, color: 'amber', trend: '-15%' },
    { label: 'Anomalies', value: '0', icon: AlertCircle, color: 'red', trend: 'None' },
  ];

  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'visualization': return <ChainVisualization />;
      case 'nodes': return <NodeInformation />;
      case 'transactions': return <TransactionDetails />;
      case 'verification': return <VerificationStatus />;
      case 'audit': return <AuditTrail />;
      case 'stakeholders': return <StakeholderInfo />;
      case 'checkpoints': return <QualityCheckpoints />;
      case 'certifications': return <CertificationRecords />;
      case 'environmental': return <EnvironmentalData />;
      case 'compliance': return <ComplianceStatus />;
      case 'export': return <ExportCapabilities />;
      case 'api': return <APIAccess />;
      default: return <ChainVisualization />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="TraceChain"
      description="Blockchain-based supply chain traceability"
      icon={Link2}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}
