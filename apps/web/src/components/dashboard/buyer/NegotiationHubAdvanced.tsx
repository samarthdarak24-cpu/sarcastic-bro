'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Handshake, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle,
  DollarSign, Users, FileText, BarChart3, Zap, Eye,
  Send, Archive, Settings, Activity, Smartphone, Lock
} from 'lucide-react';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const subFeatures = [
  { id: 'negotiation-requests', name: 'Negotiation Requests', icon: Handshake, description: 'Create & manage requests', color: 'blue' },
  { id: 'offer-management', name: 'Offer Management', icon: DollarSign, description: 'Track all offers', color: 'indigo', badge: 'NEW' },
  { id: 'counter-offers', name: 'Counter Offers', icon: TrendingUp, description: 'Make counter proposals', color: 'emerald' },
  { id: 'negotiation-history', name: 'Negotiation History', icon: FileText, description: 'Complete history logs', color: 'purple' },
  { id: 'ai-suggestions', name: 'AI Suggestions', icon: Zap, description: 'Smart recommendations', color: 'amber' },
  { id: 'deal-tracking', name: 'Deal Tracking', icon: Activity, description: 'Monitor deal progress', color: 'rose' },
  { id: 'contract-terms', name: 'Contract Terms', icon: Lock, description: 'Manage terms', color: 'cyan' },
  { id: 'approval-workflow', name: 'Approval Workflow', icon: CheckCircle, description: 'Approval process', color: 'teal' },
  { id: 'communication-thread', name: 'Communication Thread', icon: MessageSquare, description: 'Chat & messaging', color: 'violet' },
  { id: 'deal-analytics', name: 'Deal Analytics', icon: BarChart3, description: 'Deal insights', color: 'orange' },
  { id: 'success-metrics', name: 'Success Metrics', icon: Eye, description: 'Performance tracking', color: 'pink' },
  { id: 'archive-management', name: 'Archive Management', icon: Archive, description: 'Archive deals', color: 'red' }
];

const stats = [
  { label: 'Active Negotiations', value: '23', icon: Handshake, color: 'blue', trend: '+8%' },
  { label: 'Avg Deal Value', value: '₹2.5L', icon: DollarSign, color: 'emerald', trend: '+15%' },
  { label: 'Success Rate', value: '87%', icon: CheckCircle, color: 'purple', trend: '+5%' },
  { label: 'Avg Time', value: '3.2 days', icon: Clock, color: 'indigo', trend: '-12%' }
];

export default function NegotiationHubAdvanced() {
  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'negotiation-requests': return <NegotiationRequests />;
      case 'offer-management': return <OfferManagement />;
      case 'counter-offers': return <CounterOffers />;
      case 'negotiation-history': return <NegotiationHistory />;
      case 'ai-suggestions': return <AISuggestions />;
      case 'deal-tracking': return <DealTracking />;
      case 'contract-terms': return <ContractTerms />;
      case 'approval-workflow': return <ApprovalWorkflow />;
      case 'communication-thread': return <CommunicationThread />;
      case 'deal-analytics': return <DealAnalytics />;
      case 'success-metrics': return <SuccessMetrics />;
      case 'archive-management': return <ArchiveManagement />;
      default: return <NegotiationRequests />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Negotiation Hub"
      description="Smart negotiation management with AI-powered insights"
      icon={Handshake}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}

function NegotiationRequests() {
  const requests = [
    { id: 1, supplier: 'Green Valley Co-op', product: 'Basmati Rice', quantity: '5000 kg', status: 'active', initiated: '2024-01-15' },
    { id: 2, supplier: 'Organic Harvest', product: 'Wheat', quantity: '3000 kg', status: 'active', initiated: '2024-01-16' },
    { id: 3, supplier: 'Sunrise Traders', product: 'Corn', quantity: '2000 kg', status: 'completed', initiated: '2024-01-10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Negotiation Requests</h2>
          <p className="text-slate-500 font-medium mt-1">Manage all negotiation requests</p>
        </div>
        <ActionButton variant="primary" icon={Handshake}>New Request</ActionButton>
      </div>

      <div className="space-y-3">
        {requests.map((req, idx) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{req.supplier}</h3>
                <p className="text-sm text-slate-600 font-medium">{req.product} • {req.quantity}</p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                req.status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {req.status}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Initiated: {req.initiated}</span>
              <button className="h-10 px-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OfferManagement() {
  const offers = [
    { id: 1, supplier: 'Green Valley', price: '₹85/kg', quantity: '5000 kg', status: 'pending', date: '2024-01-15' },
    { id: 2, supplier: 'Organic Harvest', price: '₹42/kg', quantity: '3000 kg', status: 'accepted', date: '2024-01-16' },
    { id: 3, supplier: 'Sunrise Traders', price: '₹28/kg', quantity: '2000 kg', status: 'rejected', date: '2024-01-14' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Offer Management</h2>
        <p className="text-slate-500 font-medium mt-1">Track and manage all offers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Total Offers" value="47" icon={DollarSign} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Accepted" value="32" icon={CheckCircle} color="emerald" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Pending" value="12" icon={Clock} color="amber" />
        </PremiumCard>
      </div>

      <div className="space-y-3">
        {offers.map((offer, idx) => (
          <PremiumCard key={offer.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">{offer.supplier}</h3>
                <p className="text-sm text-slate-600 font-medium">{offer.quantity}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-slate-900">{offer.price}</div>
                <div className={`text-xs font-black uppercase ${
                  offer.status === 'accepted' ? 'text-emerald-600' :
                  offer.status === 'pending' ? 'text-amber-600' :
                  'text-red-600'
                }`}>
                  {offer.status}
                </div>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function CounterOffers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Counter Offers</h2>
          <p className="text-slate-500 font-medium mt-1">Make counter proposals</p>
        </div>
        <ActionButton variant="success" icon={TrendingUp}>Create Counter Offer</ActionButton>
      </div>

      <PremiumCard className="p-8 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center py-12">
          <TrendingUp size={48} className="mx-auto text-emerald-500 mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">No Active Counter Offers</h3>
          <p className="text-slate-600 font-medium">Create one to start negotiating</p>
        </div>
      </PremiumCard>
    </div>
  );
}

function NegotiationHistory() {
  const history = [
    { id: 1, action: 'Offer Received', details: '₹85/kg from Green Valley', date: '2024-01-15 10:30' },
    { id: 2, action: 'Counter Offer Sent', details: '₹80/kg for 5000 kg', date: '2024-01-15 11:45' },
    { id: 3, action: 'Offer Accepted', details: 'Deal finalized at ₹82/kg', date: '2024-01-15 14:20' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Negotiation History</h2>
        <p className="text-slate-500 font-medium mt-1">Complete negotiation timeline</p>
      </div>

      <div className="space-y-3">
        {history.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-slate-200"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-900">{item.action}</h3>
                <p className="text-sm text-slate-600 font-medium">{item.details}</p>
              </div>
              <div className="text-xs text-slate-500 font-medium">{item.date}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AISuggestions() {
  const suggestions = [
    { id: 1, suggestion: 'Counter at ₹80/kg', confidence: 92, reason: 'Market rate analysis' },
    { id: 2, suggestion: 'Request bulk discount', confidence: 88, reason: 'Volume optimization' },
    { id: 3, suggestion: 'Negotiate payment terms', confidence: 85, reason: 'Cash flow improvement' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">AI Suggestions</h2>
        <p className="text-slate-500 font-medium mt-1">Smart negotiation recommendations</p>
      </div>

      <div className="space-y-4">
        {suggestions.map((sugg, idx) => (
          <PremiumCard key={sugg.id} className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-black text-slate-900">{sugg.suggestion}</h3>
              <div className="text-right">
                <div className="text-2xl font-black text-purple-600">{sugg.confidence}%</div>
                <div className="text-xs text-slate-500 font-bold">Confidence</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-3">{sugg.reason}</p>
            <button className="w-full h-10 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all">
              Apply Suggestion
            </button>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function DealTracking() {
  const deals = [
    { id: 1, deal: 'Green Valley - Basmati', stage: 'Negotiation', progress: 65, dueDate: '2024-01-20' },
    { id: 2, deal: 'Organic Harvest - Wheat', stage: 'Approved', progress: 100, dueDate: '2024-01-18' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Deal Tracking</h2>
        <p className="text-slate-500 font-medium mt-1">Monitor deal progress</p>
      </div>

      <div className="space-y-4">
        {deals.map((deal, idx) => (
          <PremiumCard key={deal.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{deal.deal}</h3>
                <p className="text-sm text-slate-600 font-medium">{deal.stage}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-blue-600">{deal.progress}%</div>
                <div className="text-xs text-slate-500 font-bold">Complete</div>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${deal.progress}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
              />
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function ContractTerms() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Contract Terms</h2>
        <p className="text-slate-500 font-medium mt-1">Manage contract terms and conditions</p>
      </div>

      <PremiumCard className="p-6 bg-slate-900 text-white">
        <code className="text-sm font-mono">
          Payment Terms: 50% on delivery, 50% on verification<br/>
          Delivery: Within 7 days<br/>
          Quality: AGMARK certified<br/>
          Penalty: 2% per day delay
        </code>
      </PremiumCard>
    </div>
  );
}

function ApprovalWorkflow() {
  const workflow = [
    { step: 1, name: 'Negotiation', status: 'completed' },
    { step: 2, name: 'Review', status: 'in-progress' },
    { step: 3, name: 'Approval', status: 'pending' },
    { step: 4, name: 'Execution', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Approval Workflow</h2>
        <p className="text-slate-500 font-medium mt-1">Track approval process</p>
      </div>

      <div className="space-y-4">
        {workflow.map((item, idx) => (
          <div key={item.step} className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-white ${
              item.status === 'completed' ? 'bg-emerald-500' :
              item.status === 'in-progress' ? 'bg-blue-500' :
              'bg-slate-300'
            }`}>
              {item.status === 'completed' ? <CheckCircle size={24} /> : item.step}
            </div>
            <div className="flex-1">
              <h3 className="font-black text-slate-900">{item.name}</h3>
              <p className="text-sm text-slate-600 font-medium capitalize">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunicationThread() {
  const messages = [
    { id: 1, sender: 'Supplier', message: 'Can you accept ₹85/kg?', time: '10:30 AM' },
    { id: 2, sender: 'You', message: 'Can you go down to ₹80/kg?', time: '10:45 AM' },
    { id: 3, sender: 'Supplier', message: 'How about ₹82/kg?', time: '11:00 AM' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Communication Thread</h2>
        <p className="text-slate-500 font-medium mt-1">Chat with suppliers</p>
      </div>

      <div className="space-y-3 bg-slate-50 rounded-2xl p-6 h-96 overflow-y-auto">
        {messages.map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs px-4 py-3 rounded-2xl ${
              msg.sender === 'You'
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-slate-200 text-slate-900'
            }`}>
              <p className="font-medium">{msg.message}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-blue-100' : 'text-slate-500'}`}>
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500"
        />
        <button className="h-12 px-6 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2">
          <Send size={18} />
          Send
        </button>
      </div>
    </div>
  );
}

function DealAnalytics() {
  const chartData = [
    { month: 'Jan', deals: 12, value: 250000 },
    { month: 'Feb', deals: 15, value: 320000 },
    { month: 'Mar', deals: 18, value: 380000 },
    { month: 'Apr', deals: 23, value: 450000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Deal Analytics</h2>
        <p className="text-slate-500 font-medium mt-1">Deal trends and insights</p>
      </div>

      <PremiumCard className="p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">Monthly Deal Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="deals" stroke="#3b82f6" strokeWidth={3} name="Deals" />
          </LineChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function SuccessMetrics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Success Metrics</h2>
        <p className="text-slate-500 font-medium mt-1">Performance tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <MetricDisplay label="Success Rate" value="87%" icon={CheckCircle} color="emerald" trend="+5%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Avg Savings" value="12.5%" icon={TrendingUp} color="blue" trend="+3%" />
        </PremiumCard>
      </div>
    </div>
  );
}

function ArchiveManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Archive Management</h2>
        <p className="text-slate-500 font-medium mt-1">Manage archived deals</p>
      </div>

      <PremiumCard className="p-8 text-center">
        <Archive size={48} className="mx-auto text-slate-400 mb-4" />
        <h3 className="text-xl font-black text-slate-900">No Archived Deals</h3>
        <p className="text-slate-600 font-medium mt-2">Completed deals will appear here</p>
      </PremiumCard>
    </div>
  );
}
