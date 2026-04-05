'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Brain, Package, Calendar, Globe, Users, 
  Cloud, Droplets, Target, Zap, Plus, Edit2, Trash2,
  Play, Pause, BarChart3, AlertCircle, CheckCircle2,
  Settings, Download, Upload, RefreshCw
} from 'lucide-react';
import { autoSellService } from '@/services/autoSellService';

interface Rule {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'draft';
  conditions: any;
  actions: any;
  performance: {
    triggered: number;
    revenue: number;
    savings: number;
  };
  lastTriggered?: string;
  createdAt: string;
}

interface MarketData {
  currentPrice: number;
  trend: 'up' | 'down' | 'stable';
  sentiment: number;
  competitors: number;
  demand: number;
}

const AutoSellRulesAdvanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rules, setRules] = useState<Rule[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [stats, setStats] = useState({
    totalRules: 0,
    activeRules: 0,
    totalRevenue: 0,
    autoSales: 0
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rulesData, statsData, marketInfo] = await Promise.all([
        autoSellService.getRules(),
        autoSellService.getStats(),
        autoSellService.getMarketData()
      ]);
      setRules(rulesData);
      setStats(statsData);
      setMarketData(marketInfo);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarketData = async () => {
    try {
      const data = await autoSellService.getMarketData();
      setMarketData(data);
    } catch (error) {
      console.error('Failed to load market data:', error);
    }
  };

  const toggleRuleStatus = async (ruleId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await autoSellService.updateRuleStatus(ruleId, newStatus);
      setRules(rules.map(r => r.id === ruleId ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error('Failed to toggle rule:', error);
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      await autoSellService.deleteRule(ruleId);
      setRules(rules.filter(r => r.id !== ruleId));
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  const features = [
    {
      id: 'price-trigger',
      icon: TrendingUp,
      title: 'AI Price Trigger',
      description: 'ML-based dynamic pricing',
      color: 'from-blue-500 to-cyan-500',
      metrics: { accuracy: '94%', triggers: 156 }
    },
    {
      id: 'sentiment',
      icon: Brain,
      title: 'Market Sentiment',
      description: 'Real-time trend analysis',
      color: 'from-purple-500 to-pink-500',
      metrics: { sentiment: marketData?.sentiment || 0, trend: marketData?.trend || 'stable' }
    },
    {
      id: 'inventory',
      icon: Package,
      title: 'Inventory Optimizer',
      description: 'Storage cost automation',
      color: 'from-green-500 to-emerald-500',
      metrics: { savings: '₹45K', optimized: 23 }
    },
    {
      id: 'seasonal',
      icon: Calendar,
      title: 'Seasonal Strategy',
      description: 'Pattern-based rules',
      color: 'from-orange-500 to-red-500',
      metrics: { patterns: 12, accuracy: '89%' }
    },
    {
      id: 'multi-platform',
      icon: Globe,
      title: 'Multi-Platform Sync',
      description: 'Cross-marketplace listing',
      color: 'from-indigo-500 to-blue-500',
      metrics: { platforms: 5, listings: 234 }
    },
    {
      id: 'buyer-predict',
      icon: Users,
      title: 'Buyer Predictor',
      description: 'AI buyer matching',
      color: 'from-pink-500 to-rose-500',
      metrics: { matches: 89, conversion: '76%' }
    },
    {
      id: 'weather',
      icon: Cloud,
      title: 'Weather-Based',
      description: 'Climate triggers',
      color: 'from-cyan-500 to-blue-500',
      metrics: { alerts: 3, accuracy: '92%' }
    },
    {
      id: 'quality',
      icon: Droplets,
      title: 'Quality Monitor',
      description: 'Freshness tracking',
      color: 'from-teal-500 to-green-500',
      metrics: { monitored: 45, alerts: 2 }
    },
    {
      id: 'competitor',
      icon: Target,
      title: 'Price Tracker',
      description: 'Competitor analysis',
      color: 'from-yellow-500 to-orange-500',
      metrics: { tracked: marketData?.competitors || 0, updates: 'Live' }
    },
    {
      id: 'profit',
      icon: Zap,
      title: 'Profit Maximizer',
      description: 'ML optimization',
      color: 'from-violet-500 to-purple-500',
      metrics: { increase: '+34%', revenue: '₹2.3L' }
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="h-32 bg-white/50 rounded-2xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Auto-Sell Intelligence
            </h1>
            <p className="text-slate-600 mt-2">AI-powered automated selling rules & optimization</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Rule
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Rules', value: stats.totalRules, icon: Settings, color: 'blue' },
            { label: 'Active Rules', value: stats.activeRules, icon: Play, color: 'green' },
            { label: 'Auto Sales', value: stats.autoSales, icon: Zap, color: 'purple' },
            { label: 'Revenue', value: `₹${(stats.totalRevenue / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'orange' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-4 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Market Pulse */}
        {marketData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Live Market Pulse</h3>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-indigo-200 text-sm">Current Price</p>
                    <p className="text-2xl font-bold">₹{marketData.currentPrice}/kg</p>
                  </div>
                  <div>
                    <p className="text-indigo-200 text-sm">Trend</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-5 h-5 ${marketData.trend === 'up' ? 'text-green-300' : 'text-red-300'}`} />
                      <p className="text-xl font-bold capitalize">{marketData.trend}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-indigo-200 text-sm">Sentiment</p>
                    <p className="text-2xl font-bold">{marketData.sentiment}%</p>
                  </div>
                  <div>
                    <p className="text-indigo-200 text-sm">Demand</p>
                    <p className="text-2xl font-bold">{marketData.demand}%</p>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                onClick={loadMarketData}
                className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
              >
                <RefreshCw className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-600 mb-3">{feature.description}</p>
              <div className="flex items-center justify-between text-xs">
                {Object.entries(feature.metrics).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-slate-500 capitalize">{key}</p>
                    <p className="font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active Rules */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Active Rules</h2>
            <p className="text-slate-600 mt-1">Manage your automated selling strategies</p>
          </div>

          <div className="p-6 space-y-4">
            <AnimatePresence>
              {rules.map((rule, idx) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-3 h-3 rounded-full ${
                        rule.status === 'active' ? 'bg-green-500' : 
                        rule.status === 'paused' ? 'bg-yellow-500' : 'bg-slate-400'
                      } animate-pulse`} />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-slate-900">{rule.name}</h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {rule.type}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <p className="text-slate-500">Triggered</p>
                            <p className="font-bold text-slate-900">{rule.performance.triggered}x</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Revenue</p>
                            <p className="font-bold text-green-600">₹{(rule.performance.revenue / 1000).toFixed(1)}K</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Savings</p>
                            <p className="font-bold text-blue-600">₹{(rule.performance.savings / 1000).toFixed(1)}K</p>
                          </div>
                          {rule.lastTriggered && (
                            <div>
                              <p className="text-slate-500">Last Active</p>
                              <p className="font-bold text-slate-900">{new Date(rule.lastTriggered).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleRuleStatus(rule.id, rule.status)}
                        className={`p-2 rounded-lg transition-all ${
                          rule.status === 'active' 
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {rule.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedRule(rule)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteRule(rule.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {rules.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No rules created yet</p>
                <p className="text-slate-500 text-sm mt-2">Create your first auto-sell rule to get started</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Create Rule Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateRuleModal
              onClose={() => setShowCreateModal(false)}
              onSuccess={(newRule) => {
                setRules([...rules, newRule]);
                setShowCreateModal(false);
              }}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

const CreateRuleModal: React.FC<{ onClose: () => void; onSuccess: (rule: Rule) => void }> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'price-trigger',
    conditions: {},
    actions: {}
  });
  const [creating, setCreating] = useState(false);

  const ruleTypes = [
    { id: 'price-trigger', name: 'AI Price Trigger', icon: TrendingUp },
    { id: 'sentiment', name: 'Market Sentiment', icon: Brain },
    { id: 'inventory', name: 'Inventory Optimizer', icon: Package },
    { id: 'seasonal', name: 'Seasonal Strategy', icon: Calendar },
    { id: 'weather', name: 'Weather-Based', icon: Cloud },
    { id: 'quality', name: 'Quality Monitor', icon: Droplets }
  ];

  const handleCreate = async () => {
    try {
      setCreating(true);
      const newRule = await autoSellService.createRule(formData);
      onSuccess(newRule);
    } catch (error) {
      console.error('Failed to create rule:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Create Auto-Sell Rule</h2>
          <p className="text-slate-600 mt-1">Step {step} of 3</p>
        </div>

        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Rule Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., High Demand Auto-Sell"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Rule Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {ruleTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, type: type.id })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.type === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <type.icon className={`w-6 h-6 mb-2 ${formData.type === type.id ? 'text-blue-600' : 'text-slate-600'}`} />
                      <p className="font-semibold text-slate-900">{type.name}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 mb-4">Set Conditions</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Min Price (₹/kg)</label>
                  <input
                    type="number"
                    placeholder="50"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Max Price (₹/kg)</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Market Sentiment</label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option>Any</option>
                  <option>Positive (&gt;60%)</option>
                  <option>Neutral (40-60%)</option>
                  <option>Negative (&lt;40%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Inventory Level</label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option>Any</option>
                  <option>High (&gt;80%)</option>
                  <option>Medium (40-80%)</option>
                  <option>Low (&lt;40%)</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 mb-4">Define Actions</h3>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Auto-List Quantity</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pricing Strategy</label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option>Market Price</option>
                  <option>5% Below Market</option>
                  <option>10% Below Market</option>
                  <option>AI Optimized</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Target Platforms</label>
                <div className="space-y-2">
                  {['Main Marketplace', 'Regional Markets', 'Export Portal', 'Bulk Buyers'].map((platform) => (
                    <label key={platform} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                      <span className="text-slate-900">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            className="px-6 py-3 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold transition-all"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button
            onClick={step === 3 ? handleCreate : () => setStep(step + 1)}
            disabled={creating}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {creating ? 'Creating...' : step === 3 ? 'Create Rule' : 'Next'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AutoSellRulesAdvanced;
