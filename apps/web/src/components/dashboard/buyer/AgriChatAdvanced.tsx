'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  MessageCircle, Send, Paperclip, Mic, Globe, Zap,
  CheckCircle, Clock, Users, TrendingUp, Settings, BarChart3,
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
  { id: 'chat', name: 'Chat', icon: MessageCircle, description: 'AI chat assistant', color: 'blue' },
  { id: 'queries', name: 'Queries', icon: Send, description: 'Query resolution', color: 'emerald' },
  { id: 'documents', name: 'Documents', icon: Paperclip, description: 'Document upload', color: 'amber' },
  { id: 'realtime', name: 'Real-Time', icon: Zap, description: 'Real-time support', color: 'indigo' },
  { id: 'history', name: 'History', icon: Clock, description: 'Chat history', color: 'rose' },
  { id: 'sentiment', name: 'Sentiment', icon: TrendingUp, description: 'Sentiment analysis', color: 'purple' },
  { id: 'language', name: 'Language', icon: Globe, description: 'Multi-language support', color: 'cyan' },
  { id: 'voice', name: 'Voice', icon: Mic, description: 'Voice chat', color: 'violet' },
  { id: 'sharing', name: 'Sharing', icon: Paperclip, description: 'File sharing', color: 'orange' },
  { id: 'escalation', name: 'Escalation', icon: Users, description: 'Escalation management', color: 'teal' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, description: 'Chat analytics', color: 'pink' },
  { id: 'feedback', name: 'Feedback', icon: CheckCircle, description: 'Feedback system', color: 'red' },
];

const chatData = [
  { day: 'Mon', messages: 245, resolved: 98, avgTime: 2.3 },
  { day: 'Tue', messages: 312, resolved: 99, avgTime: 2.1 },
  { day: 'Wed', messages: 278, resolved: 97, avgTime: 2.4 },
  { day: 'Thu', messages: 345, resolved: 99, avgTime: 2.0 },
  { day: 'Fri', messages: 289, resolved: 98, avgTime: 2.2 },
  { day: 'Sat', messages: 156, resolved: 96, avgTime: 2.5 },
  { day: 'Sun', messages: 134, resolved: 95, avgTime: 2.6 },
];

function AIChat() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Messages" value="1,759" icon={MessageCircle} color="blue" trend="+12%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Resolved" value="98.2%" icon={CheckCircle} color="emerald" trend="+2%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Avg Time" value="2.3m" icon={Clock} color="amber" trend="-15%" />
        </PremiumCard>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Chat Interface</h3>
        <div className="bg-slate-50 rounded-xl p-4 h-80 flex flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto mb-4">
            {[
              { role: 'user', msg: 'What\'s the best time to buy rice?' },
              { role: 'ai', msg: 'Based on market analysis, prices are expected to rise 8% next week. I recommend buying now.' },
              { role: 'user', msg: 'What about quality grades?' },
              { role: 'ai', msg: 'Grade A rice is premium quality with 98% purity. Grade B is good for bulk orders.' },
            ].map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg ${chat.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-900'}`}>
                  <p className="text-sm">{chat.msg}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Ask me anything..." className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm" />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <Send size={18} />
            </button>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}

function QueryResolution() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Queries</h3>
        <div className="space-y-3">
          {[
            { query: 'Best suppliers for rice', resolved: 'Yes', time: '2 min' },
            { query: 'Price trends analysis', resolved: 'Yes', time: '5 min' },
            { query: 'Quality certification info', resolved: 'Yes', time: '3 min' },
            { query: 'Bulk order discounts', resolved: 'Yes', time: '4 min' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{item.query}</p>
                <p className="text-xs text-slate-600">Resolved in {item.time}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600">✓ {item.resolved}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function DocumentUpload() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Uploaded Documents</h3>
        <div className="space-y-3">
          {[
            { name: 'Invoice_2024.pdf', size: '2.4 MB', date: '2 days ago' },
            { name: 'Quality_Report.xlsx', size: '1.8 MB', date: '5 days ago' },
            { name: 'Supplier_List.docx', size: '0.9 MB', date: '1 week ago' },
          ].map((doc, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">{doc.name}</p>
                <p className="text-xs text-slate-600">{doc.size} • {doc.date}</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-bold">↓</button>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function RealTimeSupport() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">24/7</div>
            <p className="text-sm font-medium text-slate-600">Availability</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">2.3m</div>
            <p className="text-sm font-medium text-slate-600">Avg Response</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-amber-600 mb-2">98.2%</div>
            <p className="text-sm font-medium text-slate-600">Satisfaction</p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function ChatHistory() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Chat Statistics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chatData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="messages" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="resolved" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function SentimentAnalysis() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Sentiment Breakdown</h3>
        <div className="space-y-4">
          {[
            { sentiment: 'Very Positive', percentage: 65, color: 'emerald' },
            { sentiment: 'Positive', percentage: 25, color: 'blue' },
            { sentiment: 'Neutral', percentage: 8, color: 'slate' },
            { sentiment: 'Negative', percentage: 2, color: 'red' },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-slate-700">{item.sentiment}</span>
                <span className={`font-bold text-${item.color}-600`}>{item.percentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function MultiLanguageSupport() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Supported Languages</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { lang: 'English', users: '45%', status: 'Active' },
            { lang: 'Hindi', users: '35%', status: 'Active' },
            { lang: 'Marathi', users: '12%', status: 'Active' },
            { lang: 'Gujarati', users: '8%', status: 'Active' },
          ].map((lang, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-900">{lang.lang}</p>
              <p className="text-xs text-slate-600">{lang.users} users</p>
              <p className="text-xs text-emerald-600 font-bold">✓ {lang.status}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function VoiceChat() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Voice Features</h3>
        <div className="space-y-3">
          {[
            { feature: 'Voice Messages', status: 'Enabled' },
            { feature: 'Voice Calls', status: 'Enabled' },
            { feature: 'Speech Recognition', status: 'Enabled' },
            { feature: 'Text-to-Speech', status: 'Enabled' },
          ].map((feature, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <span className="font-medium text-slate-700">{feature.feature}</span>
              <span className="text-xs font-bold text-emerald-600">✓ {feature.status}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function FileSharing() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Shared Files</h3>
        <div className="space-y-3">
          {[
            { file: 'Price_Analysis.pdf', sharedWith: 'John Doe', date: '2 days ago' },
            { file: 'Quality_Report.xlsx', sharedWith: 'Jane Smith', date: '5 days ago' },
            { file: 'Market_Trends.pptx', sharedWith: 'Team', date: '1 week ago' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-900">{item.file}</p>
              <p className="text-xs text-slate-600">Shared with {item.sharedWith} • {item.date}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function EscalationManagement() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">3</div>
            <p className="text-sm font-medium text-slate-600">Pending</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">847</div>
            <p className="text-sm font-medium text-slate-600">Resolved</p>
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

function ChatAnalytics() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Metrics</h3>
        <div className="space-y-3">
          {[
            { metric: 'Total Conversations', value: '1,759', trend: '+12%' },
            { metric: 'Avg Resolution Time', value: '2.3 min', trend: '-15%' },
            { metric: 'Customer Satisfaction', value: '98.2%', trend: '+2%' },
            { metric: 'First Contact Resolution', value: '94.5%', trend: '+3%' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="font-medium text-slate-700">{item.metric}</span>
              <div className="text-right">
                <p className="font-bold text-slate-900">{item.value}</p>
                <p className="text-xs text-emerald-600">{item.trend}</p>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function FeedbackSystem() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">User Feedback</h3>
        <div className="space-y-3">
          {[
            { rating: 5, count: 847, percentage: 65 },
            { rating: 4, count: 325, percentage: 25 },
            { rating: 3, count: 104, percentage: 8 },
            { rating: 2, count: 26, percentage: 2 },
          ].map((feedback, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
              <div className="flex gap-2">
                {[...Array(feedback.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
              <div className="flex-1 mx-4 bg-slate-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${feedback.percentage}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
              <span className="font-bold text-slate-900">{feedback.count}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

export function AgriChatAdvanced() {
  const stats = [
    { label: 'Messages', value: '1,759', icon: MessageCircle, color: 'blue', trend: '+12%' },
    { label: 'Resolved', value: '98.2%', icon: CheckCircle, color: 'emerald', trend: '+2%' },
    { label: 'Avg Time', value: '2.3m', icon: Clock, color: 'amber', trend: '-15%' },
    { label: 'Satisfaction', value: '98.2%', icon: TrendingUp, color: 'indigo', trend: '+2%' },
  ];

  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'chat': return <AIChat />;
      case 'queries': return <QueryResolution />;
      case 'documents': return <DocumentUpload />;
      case 'realtime': return <RealTimeSupport />;
      case 'history': return <ChatHistory />;
      case 'sentiment': return <SentimentAnalysis />;
      case 'language': return <MultiLanguageSupport />;
      case 'voice': return <VoiceChat />;
      case 'sharing': return <FileSharing />;
      case 'escalation': return <EscalationManagement />;
      case 'analytics': return <ChatAnalytics />;
      case 'feedback': return <FeedbackSystem />;
      default: return <AIChat />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="AgriChat"
      description="AI-powered chat assistant for agricultural support"
      icon={MessageCircle}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}
