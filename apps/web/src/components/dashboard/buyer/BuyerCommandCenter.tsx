'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Package, ShoppingCart, DollarSign, Users, 
  BarChart3, Shield, Zap, Target, Award, ArrowRight,
  Activity, Clock, CheckCircle, AlertCircle, Star,
  MapPin, Truck, FileText, MessageSquare, Globe
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BuyerCommandCenter() {
  const router = useRouter();
  const [marketSync, setMarketSync] = useState(15.2);
  const [activeOrders, setActiveOrders] = useState(18);

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketSync(prev => prev + (Math.random() - 0.5) * 2);
      setActiveOrders(prev => Math.max(15, prev + Math.floor(Math.random() * 3 - 1)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: 'Market Synchronization',
      value: `+${marketSync.toFixed(1)}%`,
      icon: Activity,
      color: 'emerald',
      trend: 'up'
    },
    {
      label: 'Total Sourcing',
      value: '₹12.4L',
      icon: ShoppingCart,
      color: 'blue',
      trend: 'up'
    },
    {
      label: 'Active Bids',
      value: `${activeOrders}`,
      badge: '+5 new',
      icon: Target,
      color: 'purple',
      trend: 'up'
    },
    {
      label: 'Verified Suppliers',
      value: '45',
      icon: Shield,
      color: 'cyan',
      trend: 'stable'
    },
    {
      label: 'Value Saved',
      value: '₹1.8L',
      icon: DollarSign,
      color: 'amber',
      trend: 'up'
    }
  ];

  const neuralRadar = {
    confidence: 92,
    alphaClusters: 14,
    priceDelta: -8.2,
    vibeScore: 'Optimal'
  };

  const subFeatures = [
    {
      id: 'ai-intelligence',
      title: 'AI Intelligence Hub',
      description: 'AI-powered procurement insights and recommendations',
      icon: Zap,
      color: 'blue',
      metrics: { active: 12, pending: 3 },
      route: '/buyer/dashboard?section=AI Intelligence Hub'
    },
    {
      id: 'sourcing',
      title: 'Smart Sourcing',
      description: 'Find and connect with verified suppliers',
      icon: Users,
      color: 'green',
      metrics: { suppliers: 45, new: 8 },
      route: '/buyer/dashboard?section=Sourcing & Procurement'
    },
    {
      id: 'bulk-orders',
      title: 'Bulk Marketplace',
      description: 'Large-scale procurement and bulk ordering',
      icon: Package,
      color: 'purple',
      metrics: { orders: 23, volume: '2.4T' },
      route: '/buyer/dashboard?section=Sourcing & Procurement'
    },
    {
      id: 'order-tracking',
      title: 'Order Tracker',
      description: 'Real-time order and shipment tracking',
      icon: Truck,
      color: 'orange',
      metrics: { inTransit: 12, delivered: 156 },
      route: '/buyer/dashboard?section=Orders & Tracking'
    },
    {
      id: 'blockchain',
      title: 'Blockchain Trace',
      description: 'Supply chain transparency and verification',
      icon: Shield,
      color: 'indigo',
      metrics: { traced: 89, verified: 100 },
      route: '/buyer/dashboard?section=Orders & Tracking'
    },
    {
      id: 'escrow',
      title: 'Escrow Payments',
      description: 'Secure payment processing and escrow',
      icon: DollarSign,
      color: 'emerald',
      metrics: { active: 8, completed: 234 },
      route: '/buyer/dashboard?section=Payments & Finance'
    },
    {
      id: 'negotiation',
      title: 'Negotiation Hub',
      description: 'Price negotiation and deal management',
      icon: TrendingUp,
      color: 'pink',
      metrics: { active: 6, saved: '₹1.2L' },
      route: '/buyer/dashboard?section=Negotiation & Bidding'
    },
    {
      id: 'supplier-insights',
      title: 'Supplier Analytics',
      description: 'Detailed supplier performance metrics',
      icon: BarChart3,
      color: 'cyan',
      metrics: { rated: 45, topTier: 12 },
      route: '/buyer/dashboard?section=Trust & Reputation'
    },
    {
      id: 'regional-clusters',
      title: 'Regional Clusters',
      description: 'Geographic sourcing intelligence',
      icon: MapPin,
      color: 'red',
      metrics: { clusters: 14, active: 8 },
      route: '/buyer/dashboard?section=AI Intelligence Hub'
    },
    {
      id: 'agrichat',
      title: 'AgriChat Pro',
      description: 'Direct communication with farmers',
      icon: MessageSquare,
      color: 'violet',
      metrics: { conversations: 23, unread: 5 },
      route: '/chat'
    }
  ];

  const recentActivity = [
    {
      type: 'order',
      title: 'New Order',
      description: 'Basmati Rice 1000kg - #ORD-99',
      status: 'processing',
      time: '2 min ago',
      icon: Package
    },
    {
      type: 'supplier',
      title: 'Supplier Vetted',
      description: 'Ramesh Yadav Group - Verified',
      status: 'success',
      time: '15 min ago',
      icon: Shield
    },
    {
      type: 'shipment',
      title: 'In Transit',
      description: 'Order #ORD-998 dispatched',
      status: 'info',
      time: '1 hour ago',
      icon: Truck
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'info': return 'text-cyan-600 bg-cyan-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black mb-2">Welcome back, User! 👋</h1>
              <p className="text-xl text-blue-100">Your global procurement command center.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center">
                <Globe size={24} />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <stat.icon size={20} />
                  </div>
                  {stat.badge && (
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                      {stat.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black mb-1">{stat.value}</h3>
                <p className="text-sm text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Neural Market Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Neural Market Radar</h2>
              <p className="text-slate-600">Subcontinental Liquidity Scan · Active</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-blue-600">{neuralRadar.confidence}%</div>
              <div className="text-sm text-slate-600">CONFIDENCE</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
              <div className="text-sm text-slate-600 mb-1">Alpha Clusters</div>
              <div className="text-2xl font-black text-blue-600">{neuralRadar.alphaClusters}</div>
              <div className="text-xs text-slate-500">Nodes</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <div className="text-sm text-slate-600 mb-1">Price Delta</div>
              <div className="text-2xl font-black text-green-600">{neuralRadar.priceDelta}%</div>
              <div className="text-xs text-slate-500">Favorable</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="text-sm text-slate-600 mb-1">Vibe Score</div>
              <div className="text-2xl font-black text-purple-600">{neuralRadar.vibeScore}</div>
              <div className="text-xs text-slate-500">Market</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
              <div className="text-sm text-slate-600 mb-1">High Activity</div>
              <div className="text-2xl font-black text-amber-600">92%</div>
              <div className="text-xs text-slate-500">Uptime</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <Users size={18} />
              Source Suppliers
            </button>
            <button className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <Package size={18} />
              Bulk Procurement
            </button>
            <button className="flex-1 h-12 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <Zap size={18} />
              AI Negotiator
            </button>
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg"
        >
          <h2 className="text-xl font-black text-slate-900 mb-4">Feed</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}>
                  <activity.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm">{activity.title}</h3>
                  <p className="text-xs text-slate-600 truncate">{activity.description}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sub-Features Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Tactical Actions</h2>
            <p className="text-slate-600">Access all procurement tools and features</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {subFeatures.map((feature, idx) => (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(feature.route)}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 p-6 shadow-lg hover:shadow-xl transition-all text-left group"
            >
              <div className={`h-14 w-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} className={`text-${feature.color}-600`} />
              </div>
              
              <h3 className="font-black text-slate-900 mb-2 text-lg">{feature.title}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{feature.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {Object.entries(feature.metrics).map(([key, value]) => (
                    <div key={key} className="bg-slate-100 px-2 py-1 rounded-lg">
                      <span className="text-xs font-bold text-slate-900">{value}</span>
                      <span className="text-xs text-slate-500 ml-1">{key}</span>
                    </div>
                  ))}
                </div>
                <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Alpha Procure Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Award size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-black">Alpha Procure Active</h3>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">LIVE</span>
              </div>
              <p className="text-purple-100 text-lg">
                Your sourcing patterns are 22% more efficient than the regional average. 
                We've identified 4 new clusters that match your profile.
              </p>
            </div>
          </div>
          <button className="h-12 px-8 bg-white text-purple-600 rounded-xl font-black hover:bg-purple-50 transition-all flex items-center gap-2 whitespace-nowrap">
            ANALYZE CLUSTERS
            <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
