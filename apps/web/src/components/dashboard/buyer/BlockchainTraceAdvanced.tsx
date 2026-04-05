'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Link2, MapPin, Shield, Clock, CheckCircle, AlertCircle,
  Zap, BarChart3, Users, Package, TrendingUp, Lock,
  Eye, Layers, Activity, Smartphone, FileText
} from 'lucide-react';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const subFeatures = [
  { id: 'supply-chain-map', name: 'Supply Chain Map', icon: MapPin, description: 'Visual supply chain tracking', color: 'blue' },
  { id: 'transaction-history', name: 'Transaction History', icon: FileText, description: 'Complete transaction logs', color: 'indigo', badge: 'NEW' },
  { id: 'authenticity-verify', name: 'Authenticity Verify', icon: Shield, description: 'Verify product authenticity', color: 'emerald' },
  { id: 'real-time-tracking', name: 'Real-Time Tracking', icon: Activity, description: 'Live location tracking', color: 'purple' },
  { id: 'quality-records', name: 'Quality Records', icon: CheckCircle, description: 'Quality checkpoints', color: 'amber' },
  { id: 'farmer-profiles', name: 'Farmer Profiles', icon: Users, description: 'Farmer information', color: 'rose' },
  { id: 'certification-docs', name: 'Certification Docs', icon: Lock, description: 'Digital certificates', color: 'cyan' },
  { id: 'dispute-resolution', name: 'Dispute Resolution', icon: AlertCircle, description: 'Handle disputes', color: 'red' },
  { id: 'export-reports', name: 'Export Reports', icon: BarChart3, description: 'Generate reports', color: 'teal' },
  { id: 'api-integration', name: 'API Integration', icon: Layers, description: 'Third-party integration', color: 'violet' },
  { id: 'mobile-scan', name: 'Mobile QR Scan', icon: Smartphone, description: 'QR code scanning', color: 'orange' },
  { id: 'compliance-audit', name: 'Compliance Audit', icon: Eye, description: 'Audit trail', color: 'pink' }
];

const stats = [
  { label: 'Transactions Tracked', value: '1,247', icon: Link2, color: 'blue', trend: '+24%' },
  { label: 'Verified Products', value: '98.5%', icon: Shield, color: 'emerald', trend: '+3%' },
  { label: 'Avg Trace Time', value: '2.3s', icon: Clock, color: 'purple', trend: '-15%' },
  { label: 'Disputes Resolved', value: '99.2%', icon: CheckCircle, color: 'indigo', trend: '+8%' }
];

export default function BlockchainTraceAdvanced() {
  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'supply-chain-map':
        return <SupplyChainMap />;
      case 'transaction-history':
        return <TransactionHistory />;
      case 'authenticity-verify':
        return <AuthenticityVerify />;
      case 'real-time-tracking':
        return <RealTimeTracking />;
      case 'quality-records':
        return <QualityRecords />;
      case 'farmer-profiles':
        return <FarmerProfiles />;
      case 'certification-docs':
        return <CertificationDocs />;
      case 'dispute-resolution':
        return <DisputeResolution />;
      case 'export-reports':
        return <ExportReports />;
      case 'api-integration':
        return <APIIntegration />;
      case 'mobile-scan':
        return <MobileQRScan />;
      case 'compliance-audit':
        return <ComplianceAudit />;
      default:
        return <SupplyChainMap />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Blockchain Trace"
      description="Immutable supply chain tracking with blockchain verification"
      icon={Link2}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}

function SupplyChainMap() {
  const chainSteps = [
    { step: 1, name: 'Farm Origin', location: 'Punjab, India', date: '2024-01-15', status: 'completed', actor: 'Farmer: Rajesh Kumar' },
    { step: 2, name: 'Quality Check', location: 'Regional Hub', date: '2024-01-16', status: 'completed', actor: 'Inspector: Priya Singh' },
    { step: 3, name: 'Aggregation', location: 'Warehouse', date: '2024-01-17', status: 'completed', actor: 'Aggregator: Green Valley' },
    { step: 4, name: 'Transportation', location: 'In Transit', date: '2024-01-18', status: 'in-progress', actor: 'Logistics: FastTrack' },
    { step: 5, name: 'Delivery', location: 'Your Location', date: '2024-01-19', status: 'pending', actor: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Supply Chain Journey</h2>
        <p className="text-slate-500 font-medium mt-1">Complete traceability from farm to your doorstep</p>
      </div>

      <div className="relative">
        {chainSteps.map((step, idx) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="mb-6"
          >
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-white ${
                    step.status === 'completed' ? 'bg-emerald-500' :
                    step.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-slate-300'
                  }`}
                >
                  {step.status === 'completed' ? <CheckCircle size={24} /> : step.step}
                </motion.div>
                {idx < chainSteps.length - 1 && (
                  <div className={`w-1 h-16 ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                )}
              </div>
              <div className="flex-1 pt-2">
                <PremiumCard className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{step.name}</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">{step.actor}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                      step.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                      step.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {step.status}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={16} className="text-blue-500" />
                      {step.location}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={16} className="text-purple-500" />
                      {step.date}
                    </div>
                  </div>
                </PremiumCard>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TransactionHistory() {
  const transactions = [
    { id: 'TXN001', type: 'Farm Origin', hash: '0x7f3a...9c2e', timestamp: '2024-01-15 08:30', status: 'verified', value: '5000 kg' },
    { id: 'TXN002', type: 'Quality Check', hash: '0x8f4b...1d3f', timestamp: '2024-01-16 10:15', status: 'verified', value: '4950 kg' },
    { id: 'TXN003', type: 'Aggregation', hash: '0x9g5c...2e4g', timestamp: '2024-01-17 14:45', status: 'verified', value: '4900 kg' },
    { id: 'TXN004', type: 'Transport', hash: '0x0h6d...3f5h', timestamp: '2024-01-18 09:20', status: 'pending', value: '4900 kg' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Transaction History</h2>
        <p className="text-slate-500 font-medium mt-1">Immutable blockchain records</p>
      </div>

      <div className="space-y-3">
        {transactions.map((txn, idx) => (
          <motion.div
            key={txn.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-4 border border-slate-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">{txn.type}</h3>
                    <p className="text-xs text-slate-500 font-mono">{txn.hash}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">{txn.value}</div>
                <div className="text-xs text-slate-500 font-medium">{txn.timestamp}</div>
              </div>
              <div className={`ml-4 px-3 py-1 rounded-lg text-xs font-black uppercase ${
                txn.status === 'verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {txn.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AuthenticityVerify() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Authenticity Verification</h2>
        <p className="text-slate-500 font-medium mt-1">Verify product authenticity with blockchain</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard className="p-8 bg-gradient-to-br from-emerald-50 to-green-50">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center text-white mx-auto mb-4"
            >
              <CheckCircle size={40} />
            </motion.div>
            <h3 className="text-2xl font-black text-emerald-600 mb-2">100% Authentic</h3>
            <p className="text-slate-600 font-medium">Product verified on blockchain</p>
          </div>
        </PremiumCard>

        <PremiumCard className="p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-700">Blockchain Hash</span>
              <span className="font-mono text-xs text-blue-600">0x7f3a...9c2e</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-700">Verification Date</span>
              <span className="font-bold text-slate-900">2024-01-15</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-700">Certifications</span>
              <span className="font-bold text-emerald-600">5 Valid</span>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function RealTimeTracking() {
  const trackingData = [
    { time: '08:00', location: 'Farm', temp: 22, humidity: 65 },
    { time: '10:00', location: 'Hub', temp: 20, humidity: 60 },
    { time: '12:00', location: 'Warehouse', temp: 18, humidity: 55 },
    { time: '14:00', location: 'Transit', temp: 19, humidity: 58 },
    { time: '16:00', location: 'Transit', temp: 21, humidity: 62 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Real-Time Tracking</h2>
        <p className="text-slate-500 font-medium mt-1">Live location and environmental monitoring</p>
      </div>

      <PremiumCard className="p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">Temperature & Humidity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trackingData}>
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} name="Temperature" />
            <Line type="monotone" dataKey="humidity" stroke="#8b5cf6" strokeWidth={3} name="Humidity" />
          </LineChart>
        </ResponsiveContainer>
      </PremiumCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Current Location" value="In Transit" icon={MapPin} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Temperature" value="21°C" icon={Zap} color="orange" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Humidity" value="62%" icon={Activity} color="purple" />
        </PremiumCard>
      </div>
    </div>
  );
}

function QualityRecords() {
  const qualityChecks = [
    { checkpoint: 'Farm Origin', score: 95, date: '2024-01-15', inspector: 'Rajesh Kumar', status: 'passed' },
    { checkpoint: 'Regional Hub', score: 92, date: '2024-01-16', inspector: 'Priya Singh', status: 'passed' },
    { checkpoint: 'Warehouse', score: 90, date: '2024-01-17', inspector: 'Amit Patel', status: 'passed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Quality Records</h2>
        <p className="text-slate-500 font-medium mt-1">Quality checkpoints throughout supply chain</p>
      </div>

      <div className="space-y-4">
        {qualityChecks.map((check, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-emerald-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{check.checkpoint}</h3>
                <p className="text-sm text-slate-600 font-medium">Inspector: {check.inspector}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-emerald-600">{check.score}</div>
                <div className="text-xs text-slate-500 font-bold">Quality Score</div>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${check.score}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FarmerProfiles() {
  const farmers = [
    { name: 'Rajesh Kumar', farm: 'Green Valley Farm', area: '50 acres', experience: '15 years', rating: 4.8 },
    { name: 'Priya Singh', farm: 'Organic Harvest', area: '30 acres', experience: '10 years', rating: 4.9 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Farmer Profiles</h2>
        <p className="text-slate-500 font-medium mt-1">Meet the farmers behind your products</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {farmers.map((farmer, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl">
                {farmer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{farmer.name}</h3>
                <p className="text-sm text-slate-600 font-medium">{farmer.farm}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Farm Area:</span>
                <span className="text-slate-900 font-black">{farmer.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Experience:</span>
                <span className="text-slate-900 font-black">{farmer.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Rating:</span>
                <span className="text-amber-600 font-black">⭐ {farmer.rating}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CertificationDocs() {
  const certs = [
    { name: 'Organic Certification', issuer: 'APEDA', date: '2024-01-15', valid: true },
    { name: 'Quality Certificate', issuer: 'AGMARK', date: '2024-01-16', valid: true },
    { name: 'Export License', issuer: 'Government', date: '2024-01-17', valid: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Certification Documents</h2>
        <p className="text-slate-500 font-medium mt-1">Digital certificates and licenses</p>
      </div>

      <div className="space-y-3">
        {certs.map((cert, idx) => (
          <PremiumCard key={idx} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="text-emerald-600" size={24} />
                <div>
                  <h3 className="font-black text-slate-900">{cert.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{cert.issuer}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-500">{cert.date}</div>
                <div className={`text-xs font-black uppercase ${cert.valid ? 'text-emerald-600' : 'text-red-600'}`}>
                  {cert.valid ? 'Valid' : 'Expired'}
                </div>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function DisputeResolution() {
  return (
    <div className="text-center py-20">
      <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
      <h2 className="text-2xl font-black text-slate-900">Dispute Resolution</h2>
      <p className="text-slate-500 font-medium mt-2">No active disputes</p>
    </div>
  );
}

function ExportReports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Export Reports</h2>
        <p className="text-slate-500 font-medium mt-1">Generate and download supply chain reports</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionButton variant="primary" icon={FileText}>Download PDF Report</ActionButton>
        <ActionButton variant="secondary" icon={BarChart3}>Export to Excel</ActionButton>
      </div>
    </div>
  );
}

function APIIntegration() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">API Integration</h2>
        <p className="text-slate-500 font-medium mt-1">Connect third-party systems</p>
      </div>
      <PremiumCard className="p-6 bg-slate-900 text-white">
        <code className="text-sm font-mono">
          GET /api/trace/product/SKU123<br/>
          Authorization: Bearer token<br/>
          Response: Complete supply chain data
        </code>
      </PremiumCard>
    </div>
  );
}

function MobileQRScan() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Mobile QR Scan</h2>
        <p className="text-slate-500 font-medium mt-1">Scan QR codes for instant verification</p>
      </div>
      <div className="flex justify-center">
        <div className="h-64 w-64 bg-slate-100 rounded-2xl border-4 border-dashed border-slate-300 flex items-center justify-center">
          <Smartphone size={64} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
}

function ComplianceAudit() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Compliance Audit</h2>
        <p className="text-slate-500 font-medium mt-1">Complete audit trail and compliance records</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Compliance Score" value="99.2%" icon={CheckCircle} color="emerald" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Audit Events" value="247" icon={Activity} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Last Audit" value="Today" icon={Clock} color="purple" />
        </PremiumCard>
      </div>
    </div>
  );
}
