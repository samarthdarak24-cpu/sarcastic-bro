'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';

export default function DashboardComparison() {
  const [view, setView] = useState<'before' | 'after'>('after');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-slate-900">
            Farmer Dashboard Redesign
          </h1>
          <p className="text-xl text-slate-600">
            See how we made the dashboard simpler and easier to use
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl p-2 shadow-lg inline-flex gap-2">
            <button
              onClick={() => setView('before')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${
                view === 'before'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Before ❌
            </button>
            <button
              onClick={() => setView('after')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${
                view === 'after'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              After ✅
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-2xl"
        >
          {view === 'before' ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b-2 border-red-200">
                <div className="h-16 w-16 bg-red-500 rounded-2xl flex items-center justify-center">
                  <X size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Before: Complex Navigation</h2>
                  <p className="text-slate-600">Too many menus, hard to find features</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Problems */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-red-600">Problems</h3>
                  <ul className="space-y-3">
                    {[
                      '10+ items in sidebar navigation',
                      'Features hidden in nested tabs',
                      '3-6 clicks to access a feature',
                      'No overview of all capabilities',
                      'Unclear feature organization',
                      'Poor mobile experience',
                      'High cognitive load',
                      'Difficult feature discovery'
                    ].map((problem, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <X size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{problem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Old Structure */}
                <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-900 mb-4">Old Navigation</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      'Overview',
                      'Live Cockpit',
                      'AI Quality Scan',
                      'AI Intelligence Hub',
                      'Production & Supply',
                      'Orders & Logistics',
                      'Payments & Finance',
                      'Tenders & Bidding',
                      'Trust & Reputation',
                      'Security & Compliance',
                      'AgriChat'
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg border border-red-200">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b-2 border-green-200">
                <div className="h-16 w-16 bg-green-500 rounded-2xl flex items-center justify-center">
                  <Check size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">After: Simple & Clear</h2>
                  <p className="text-slate-600">Everything organized and easy to find</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Solutions */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-green-600">Solutions</h3>
                  <ul className="space-y-3">
                    {[
                      'Only 3 items in sidebar',
                      'All features visible on dashboard',
                      '2-3 clicks to access any feature',
                      'Complete overview at a glance',
                      '7 clear color-coded categories',
                      'Excellent mobile experience',
                      'Low cognitive load',
                      'Easy feature discovery'
                    ].map((solution, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* New Structure */}
                <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4">New Navigation</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border-2 border-green-300 shadow-sm">
                      <div className="font-bold text-green-900">Dashboard</div>
                      <div className="text-xs text-green-700 mt-1">All features organized</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      AI Quality Scan
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      AgriChat
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t-2 border-green-200">
                    <h4 className="font-bold text-green-900 mb-3">Dashboard Categories</h4>
                    <div className="space-y-2 text-sm">
                      {[
                        { name: 'AI Intelligence', color: 'purple', count: 4 },
                        { name: 'Production & Supply', color: 'green', count: 4 },
                        { name: 'Orders & Logistics', color: 'blue', count: 3 },
                        { name: 'Payments & Finance', color: 'orange', count: 4 },
                        { name: 'Tenders & Bidding', color: 'pink', count: 3 },
                        { name: 'Trust & Reputation', color: 'yellow', count: 3 },
                        { name: 'Security & Compliance', color: 'red', count: 3 }
                      ].map((cat, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-2 rounded-lg border border-green-200">
                          <span className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full bg-${cat.color}-500`}></div>
                            {cat.name}
                          </span>
                          <span className="text-xs text-green-700">{cat.count} features</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'Navigation Items', before: '10+', after: '3', improvement: '70% simpler' },
            { label: 'Clicks to Feature', before: '3-6', after: '2-3', improvement: '50% faster' },
            { label: 'Features Visible', before: '1', after: '25+', improvement: '25x more' },
            { label: 'Mobile Usability', before: 'Poor', after: 'Excellent', improvement: 'Much better' }
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg text-center"
            >
              <div className="text-sm font-bold text-slate-500 mb-2">{metric.label}</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl font-black text-red-500">{metric.before}</span>
                <ArrowRight size={20} className="text-slate-400" />
                <span className="text-2xl font-black text-green-500">{metric.after}</span>
              </div>
              <div className="text-xs font-bold text-green-600">{metric.improvement}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-3xl font-black mb-4">Ready to Experience the New Dashboard?</h3>
          <p className="text-lg mb-6 text-white/90">
            The redesigned farmer dashboard is live and ready to use!
          </p>
          <button className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition-colors shadow-xl">
            Open Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
