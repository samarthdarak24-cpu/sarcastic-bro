'use client';

import React, { useState } from 'react';
import { Play, Code, User } from 'lucide-react';
import RajJourneyDemo from '@/components/demo/RajJourneyDemo';
import SmartContractSimulator from '@/components/dashboard/SmartContractSimulator';

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState<'journey' | 'contract'>('journey');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">FarmLink Demo Center</h1>
              <p className="text-sm text-slate-500 font-medium">Interactive demonstrations for pitch presentation</p>
            </div>
            <a
              href="/"
              className="h-10 px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* Demo Selector */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveDemo('journey')}
            className={`flex-1 h-20 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              activeDemo === 'journey'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-emerald-300'
            }`}
          >
            <User size={24} />
            Raj's Journey Demo
          </button>
          <button
            onClick={() => setActiveDemo('contract')}
            className={`flex-1 h-20 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              activeDemo === 'contract'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300'
            }`}
          >
            <Code size={24} />
            Smart Contract Simulator
          </button>
        </div>

        {/* Demo Content */}
        <div className="bg-slate-50 rounded-3xl p-8">
          {activeDemo === 'journey' && <RajJourneyDemo />}
          {activeDemo === 'contract' && <SmartContractSimulator />}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 text-white">
          <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
            <Play size={28} />
            Demo Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-2">Raj's Journey</h3>
              <p className="text-amber-50 text-sm font-medium">
                9-step interactive demo showing complete flow from ₹2,100 to ₹2,400. Use auto-play for presentations.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-2">Smart Contract</h3>
              <p className="text-amber-50 text-sm font-medium">
                Visualize multi-stage payment automation. Run simulation to show condition checking and auto-release.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold mb-2">Live Platform</h3>
              <p className="text-amber-50 text-sm font-medium">
                Login to farmer/buyer dashboards to show actual Bulk Aggregation and Marketplace features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
