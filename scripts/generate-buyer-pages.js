#!/usr/bin/env node

/**
 * Script to generate all buyer dashboard feature and subfeature pages
 * Run: node scripts/generate-buyer-pages.js
 */

const fs = require('fs');
const path = require('path');

const BUYER_FEATURES = {
  cockpit: {
    name: 'Cockpit Live',
    subfeatures: [
      'live-dashboard',
      'kpi-cards',
      'market-radar',
      'quick-actions',
      'alerts',
    ]
  },
  'ai-procurement': {
    name: 'AI Procurement',
    subfeatures: [
      'recommendations',
      'automated-sourcing',
      'predictive-analytics',
      'smart-alerts',
    ]
  },
  'smart-sourcing': {
    name: 'Smart Sourcing',
    subfeatures: [
      'search',
      'suppliers',
      'products',
      'actions',
    ]
  },
  reputation: {
    name: 'My Reputation',
    subfeatures: [
      'score',
      'metrics',
      'building',
      'transparency',
    ]
  },
  'supplier-insights': {
    name: 'Supplier Insights',
    subfeatures: [
      'analytics',
      'comparison',
      'profiles',
      'relationships',
      'risk',
    ]
  },
  reviews: {
    name: 'Trust & Reviews',
    subfeatures: [
      'management',
      'analytics',
      'verification',
      'insights',
    ]
  },
  'price-intelligence': {
    name: 'Price Intelligence',
    subfeatures: [
      'tracking',
      'trends',
      'alerts',
      'dashboard',
    ]
  },
  escrow: {
    name: 'Safe-Lock Hub',
    subfeatures: [
      'management',
      'security',
      'tracking',
      'disputes',
    ]
  },
  negotiation: {
    name: 'Negotiation Hub',
    subfeatures: [
      'bidding',
      'tools',
      'auctions',
      'ai',
      'deals',
    ]
  },
  intelligence: {
    name: 'AgriIntelligence',
    subfeatures: [
      'market',
      'analytics',
      'recommendations',
      'reports',
    ]
  },
  chat: {
    name: 'AgriChat',
    subfeatures: [
      'assistant',
      'suppliers',
      'automation',
      'history',
    ]
  },
  'order-tracking': {
    name: 'Order Tracker',
    subfeatures: [
      'tracking',
      'verification',
      'shipment',
      'notifications',
    ]
  },
  tracechain: {
    name: 'TraceChain',
    subfeatures: [
      'origin',
      'visibility',
      'certification',
      'records',
    ]
  },
  blockchain: {
    name: 'Blockchain Trace',
    subfeatures: [
      'security',
      'transparency',
      'contracts',
      'verification',
    ]
  },
  payments: {
    name: 'Escrow Payments',
    subfeatures: [
      'escrow',
      'security',
      'tracking',
      'disputes',
    ]
  },
  security: {
    name: 'Security Hub',
    subfeatures: [
      'account',
      'transactions',
      'data',
      'compliance',
    ]
  },
  'bulk-trade': {
    name: 'Bulk Trade Desk',
    subfeatures: [
      'terminal',
      'orders',
      'analysis',
      'risk',
    ]
  },
  cluster: {
    name: 'Cluster Intelligence',
    subfeatures: [
      'analytics',
      'optimization',
      'competitive',
      'planning',
    ]
  },
};

const SUBFEATURE_TITLES = {
  'live-dashboard': 'Live Dashboard',
  'kpi-cards': 'KPI Cards',
  'market-radar': 'Market Radar',
  'quick-actions': 'Quick Actions',
  'alerts': 'Alerts',
  'recommendations': 'Recommendations',
  'automated-sourcing': 'Automated Sourcing',
  'predictive-analytics': 'Predictive Analytics',
  'smart-alerts': 'Smart Alerts',
  'search': 'Search',
  'suppliers': 'Suppliers',
  'products': 'Products',
  'actions': 'Actions',
  'score': 'Reputation Score',
  'metrics': 'Performance Metrics',
  'building': 'Reputation Building',
  'transparency': 'Transparency',
  'analytics': 'Analytics',
  'comparison': 'Comparison',
  'profiles': 'Profiles',
  'relationships': 'Relationships',
  'risk': 'Risk Assessment',
  'management': 'Management',
  'security': 'Security',
  'tracking': 'Tracking',
  'disputes': 'Dispute Resolution',
  'verification': 'Verification',
  'insights': 'Insights',
  'tracking': 'Price Tracking',
  'trends': 'Market Trends',
  'dashboard': 'Analytics Dashboard',
  'bidding': 'Smart Bidding',
  'tools': 'Negotiation Tools',
  'auctions': 'Auctions',
  'ai': 'AI Negotiator',
  'deals': 'Deal Management',
  'market': 'Market Intelligence',
  'recommendations': 'AI Recommendations',
  'reports': 'Custom Reports',
  'assistant': 'AI Assistant',
  'automation': 'Automated Responses',
  'history': 'Chat History',
  'shipment': 'Shipment Details',
  'notifications': 'Notifications',
  'origin': 'Origin Tracking',
  'visibility': 'Supply Chain Visibility',
  'certification': 'Certification Verification',
  'records': 'Blockchain Records',
  'transparency': 'Transparency',
  'contracts': 'Smart Contracts',
  'account': 'Account Security',
  'transactions': 'Transaction Security',
  'data': 'Data Protection',
  'compliance': 'Compliance',
  'terminal': 'Trading Terminal',
  'orders': 'Advanced Orders',
  'analysis': 'Market Analysis',
  'optimization': 'Optimization',
  'competitive': 'Competitive Analysis',
  'planning': 'Strategic Planning',
};

function createPageContent(featureKey, subfeatureKey, featureName, subfeatureName) {
  const serviceMethod = `${featureKey}.${subfeatureKey.replace(/-/g, '')}`;
  
  return `'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SubfeaturePage from '@/components/buyer/SubfeaturePage';
import { buyerFeatureService } from '@/services/buyerFeatureService';

export default function ${subfeatureName.replace(/\s+/g, '')}Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual service method
      // const result = await buyerFeatureService.${featureKey}.${subfeatureKey.replace(/-/g, '')}();
      // setData(result);
      
      // Mock data for now
      setData({
        title: '${subfeatureName}',
        description: 'Loading data...',
        items: [],
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubfeaturePage
      title="${subfeatureName}"
      description="Feature subpage for ${featureName}"
      backLink="/buyer/${featureKey}"
      loading={loading}
      error={error}
      onRetry={loadData}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">${subfeatureName}</h2>
        
        {data?.items && data.items.length > 0 ? (
          <div className="space-y-4">
            {data.items.map((item: any, idx: number) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-white font-semibold">{item.title}</p>
                <p className="text-slate-400 text-sm mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">No data available yet</p>
            <p className="text-slate-500 text-sm mt-2">This feature is being populated with real data</p>
          </div>
        )}
      </motion.div>
    </SubfeaturePage>
  );
}
`;
}

function createFeaturePageContent(featureKey, featureName, subfeatures) {
  const subfeatureLinks = subfeatures.map(sub => {
    const title = SUBFEATURE_TITLES[sub] || sub.replace(/-/g, ' ').toUpperCase();
    return `      { name: '${title}', route: '/buyer/${featureKey}/${sub}' }`;
  }).join(',\n');

  return `'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ${featureName.replace(/\s+/g, '')}Page() {
  const subfeatures = [
${subfeatureLinks}
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link
          href="/buyer/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">${featureName}</h1>
          <p className="text-slate-400 text-lg">Explore all features and capabilities</p>
        </div>

        {/* Subfeatures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subfeatures.map((sub, idx) => (
            <Link key={idx} href={sub.route}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-all h-full"
              >
                <h3 className="text-white font-semibold mb-2">{sub.name}</h3>
                <p className="text-slate-400 text-sm">Click to explore →</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
`;
}

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generatePages() {
  console.log('🚀 Generating Buyer Dashboard Pages...\n');

  let featureCount = 0;
  let pageCount = 0;

  // Generate feature landing pages and subfeature pages
  Object.entries(BUYER_FEATURES).forEach(([featureKey, feature]) => {
    // Create feature landing page
    const featureDir = path.join(__dirname, `../apps/web/src/app/buyer/${featureKey}`);
    ensureDirectoryExists(featureDir);

    const featurePagePath = path.join(featureDir, 'page.tsx');
    const featurePageContent = createFeaturePageContent(featureKey, feature.name, feature.subfeatures);
    
    fs.writeFileSync(featurePagePath, featurePageContent);
    console.log(`✅ Created: /buyer/${featureKey}/page.tsx`);
    featureCount++;

    // Create subfeature pages
    feature.subfeatures.forEach(subfeature => {
      const subfeatureDir = path.join(featureDir, subfeature);
      ensureDirectoryExists(subfeatureDir);

      const subfeaturePagePath = path.join(subfeatureDir, 'page.tsx');
      const subfeatureName = SUBFEATURE_TITLES[subfeature] || subfeature.replace(/-/g, ' ').toUpperCase();
      const pageContent = createPageContent(featureKey, subfeature, feature.name, subfeatureName);
      
      fs.writeFileSync(subfeaturePagePath, pageContent);
      console.log(`✅ Created: /buyer/${featureKey}/${subfeature}/page.tsx`);
      pageCount++;
    });
  });

  console.log(`\n✨ Generation Complete!`);
  console.log(`📊 Stats:`);
  console.log(`   - Feature Pages: ${featureCount}`);
  console.log(`   - Subfeature Pages: ${pageCount}`);
  console.log(`   - Total Pages: ${featureCount + pageCount}`);
  console.log(`\n🎉 All pages are ready! Now connect them to backend APIs.`);
}

// Run the generator
generatePages();
