'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Star, TrendingUp, Award, Shield, BarChart3, Users,
  CheckCircle, AlertCircle, Zap, Target, Trophy, Settings,
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
  { id: 'score', name: 'Score', icon: Star, description: 'Reputation score', color: 'blue' },
  { id: 'reviews', name: 'Reviews', icon: BarChart3, description: 'Review management', color: 'emerald' },
  { id: 'history', name: 'History', icon: TrendingUp, description: 'Rating history', color: 'amber' },
  { id: 'feedback', name: 'Feedback', icon: Users, description: 'Feedback analysis', color: 'indigo' },
  { id: 'disputes', name: 'Disputes', icon: AlertCircle, description: 'Dispute records', color: 'rose' },
  { id: 'compliance', name: 'Compliance', icon: CheckCircle, description: 'Compliance status', color: 'purple' },
  { id: 'certifications', name: 'Certifications', icon: Award, description: 'Certification display', color: 'cyan' },
  { id: 'metrics', name: 'Metrics', icon: BarChart3, description: 'Performance metrics', color: 'violet' },
  { id: 'suggestions', name: 'Suggestions', icon: Zap, description: 'Improvement suggestions', color: 'orange' },
  { id: 'comparison', name: 'Comparison', icon: Target, description: 'Peer comparison', color: 'teal' },
  { id: 'badges', name: 'Badges', icon: Trophy, description: 'Achievement badges', color: 'pink' },
  { id: 'profile', name: 'Profile', icon: Shield, description: 'Public profile', color: 'red' },
];

const reputationData = [
  { name: 'Excellent', value: 65, fill: '#10b981' },
  { name: 'Good', value: 25, fill: '#3b82f6' },
  { name: 'Average', value: 8, fill: '#f59e0b' },
  { name: 'Poor', value: 2, fill: '#ef4444' },
];

function ReputationScore() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <div className="text-center">
            <div className="text-5xl font-black text-blue-600 mb-2">4.8</div>
            <p className="text-sm font-medium text-slate-600">Overall Score</p>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Transactions" value="847" icon={CheckCircle} color="emerald" trend="+12%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Trust Score" value="94.5%" icon={Shield} color="indigo" trend="+2%" />
        </PremiumCard>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Score Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={reputationData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
              {reputationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function ReviewManagement() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">1,247</div>
            <p className="text-sm font-medium text-slate-600">Total Reviews</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">98.5%</div>
            <p className="text-sm font-medium text-slate-600">Verified %</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-amber-600 mb-2">92%</div>
            <p className="text-sm font-medium text-slate-600">Helpful Rate</p>
          </div>
        </PremiumCard>
      </div>
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Reviews</h3>
        <div className="space-y-3">
          {[
            { reviewer: 'John Doe', rating: 5, comment: 'Excellent service and quality', date: '2 days ago' },
            { reviewer: 'Jane Smith', rating: 4, comment: 'Good products, fast delivery', date: '5 days ago' },
            { reviewer: 'Mike Johnson', rating: 5, comment: 'Highly recommended', date: '1 week ago' },
          ].map((review, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900">{review.reviewer}</p>
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1">{review.comment}</p>
              <p className="text-xs text-slate-500">{review.date}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function RatingHistory() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Rating Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { month: 'Jan', rating: 4.5, reviews: 120 },
            { month: 'Feb', rating: 4.6, reviews: 145 },
            { month: 'Mar', rating: 4.7, reviews: 168 },
            { month: 'Apr', rating: 4.8, reviews: 192 },
            { month: 'May', rating: 4.8, reviews: 215 },
            { month: 'Jun', rating: 4.8, reviews: 247 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="reviews" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function FeedbackAnalysis() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Feedback Summary</h3>
        <div className="space-y-3">
          {[
            { category: 'Quality', positive: 92, negative: 8 },
            { category: 'Delivery', positive: 88, negative: 12 },
            { category: 'Communication', positive: 95, negative: 5 },
            { category: 'Pricing', positive: 85, negative: 15 },
          ].map((feedback, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-900 mb-2">{feedback.category}</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-emerald-100 rounded-lg h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${feedback.positive}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-emerald-500 rounded-lg"
                  />
                </div>
                <span className="text-xs font-bold text-emerald-600">{feedback.positive}%</span>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function DisputeRecords() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-emerald-600 mb-2">12</div>
            <p className="text-sm font-medium text-slate-600">Total Disputes</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">11</div>
            <p className="text-sm font-medium text-slate-600">Resolved</p>
          </div>
        </PremiumCard>
        <PremiumCard>
          <div className="text-center">
            <div className="text-4xl font-black text-amber-600 mb-2">91.7%</div>
            <p className="text-sm font-medium text-slate-600">Resolution Rate</p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function ComplianceStatus() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Compliance Checklist</h3>
        <div className="space-y-2">
          {[
            { item: 'KYC Verification', status: 'Verified' },
            { item: 'Tax Registration', status: 'Verified' },
            { item: 'Business License', status: 'Verified' },
            { item: 'Insurance', status: 'Active' },
          ].map((compliance, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="font-medium text-slate-700">{compliance.item}</span>
              <span className="text-xs font-bold text-emerald-600">✓ {compliance.status}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function CertificationDisplay() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Certifications</h3>
        <div className="space-y-3">
          {[
            { cert: 'ISO 9001:2015', issuer: 'International Standards', expiry: '2025-12-31' },
            { cert: 'Organic Certified', issuer: 'APEDA', expiry: '2024-06-30' },
            { cert: 'Fair Trade', issuer: 'Fair Trade International', expiry: '2025-03-15' },
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

function PerformanceMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard>
          <MetricDisplay label="On-Time Rate" value="96.2%" icon={CheckCircle} color="emerald" trend="+2%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Quality Score" value="94.5%" icon={Star} color="amber" trend="+1%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Response Time" value="2.3h" icon={Zap} color="blue" trend="-15%" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Satisfaction" value="98.5%" icon={Users} color="indigo" trend="+3%" />
        </PremiumCard>
      </div>
    </div>
  );
}

function ImprovementSuggestions() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recommendations</h3>
        <div className="space-y-3">
          {[
            { suggestion: 'Improve response time to customer inquiries', impact: 'High' },
            { suggestion: 'Increase product variety in catalog', impact: 'Medium' },
            { suggestion: 'Enhance packaging quality', impact: 'High' },
            { suggestion: 'Offer more payment options', impact: 'Medium' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="font-medium text-blue-900 mb-1">{item.suggestion}</p>
              <p className={`text-xs font-bold ${item.impact === 'High' ? 'text-red-600' : 'text-amber-600'}`}>
                Impact: {item.impact}
              </p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function PeerComparison() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Peer Benchmarking</h3>
        <div className="space-y-3">
          {[
            { metric: 'Rating', you: 4.8, average: 4.2, percentile: '92nd' },
            { metric: 'On-Time Rate', you: 96.2, average: 88.5, percentile: '88th' },
            { metric: 'Quality Score', you: 94.5, average: 87.3, percentile: '85th' },
          ].map((comparison, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-slate-900 mb-2">{comparison.metric}</p>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600 font-bold">You: {comparison.you}</span>
                <span className="text-slate-600">Avg: {comparison.average}</span>
                <span className="text-blue-600 font-bold">{comparison.percentile}</span>
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function AchievementBadges() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Badges Earned</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { badge: '⭐', name: 'Top Rated', desc: '4.8+ rating' },
            { badge: '🚀', name: 'Fast Shipper', desc: '96%+ on-time' },
            { badge: '✓', name: 'Verified', desc: 'All checks passed' },
            { badge: '🏆', name: 'Elite', desc: '1000+ transactions' },
            { badge: '💎', name: 'Premium', desc: 'Certified seller' },
            { badge: '🌟', name: 'Trusted', desc: '5+ years active' },
          ].map((item, idx) => (
            <div key={idx} className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-3xl mb-2">{item.badge}</div>
              <p className="text-xs font-bold text-slate-900">{item.name}</p>
              <p className="text-[10px] text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}

function PublicProfile() {
  return (
    <div className="space-y-6">
      <PremiumCard>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Profile Preview</h3>
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600" />
            <div>
              <p className="font-bold text-slate-900">Your Business Name</p>
              <p className="text-sm text-slate-600">Verified Seller • 4.8★</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Member Since</span>
              <span className="font-bold text-slate-900">2020</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Sales</span>
              <span className="font-bold text-slate-900">₹50L+</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Response Rate</span>
              <span className="font-bold text-slate-900">98.5%</span>
            </div>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}

export function MyReputationAdvanced() {
  const stats = [
    { label: 'Overall Score', value: '4.8', icon: Star, color: 'blue', trend: '+0.2' },
    { label: 'Total Reviews', value: '1,247', icon: BarChart3, color: 'emerald', trend: '+18%' },
    { label: 'Trust Score', value: '94.5%', icon: Shield, color: 'amber', trend: '+2%' },
    { label: 'Verified %', value: '98.5%', icon: CheckCircle, color: 'indigo', trend: '+1%' },
  ];

  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'score': return <ReputationScore />;
      case 'reviews': return <ReviewManagement />;
      case 'history': return <RatingHistory />;
      case 'feedback': return <FeedbackAnalysis />;
      case 'disputes': return <DisputeRecords />;
      case 'compliance': return <ComplianceStatus />;
      case 'certifications': return <CertificationDisplay />;
      case 'metrics': return <PerformanceMetrics />;
      case 'suggestions': return <ImprovementSuggestions />;
      case 'comparison': return <PeerComparison />;
      case 'badges': return <AchievementBadges />;
      case 'profile': return <PublicProfile />;
      default: return <ReputationScore />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="My Reputation"
      description="Manage and track your reputation and performance"
      icon={Star}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}
