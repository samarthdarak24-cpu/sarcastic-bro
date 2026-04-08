'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Package, DollarSign, ShoppingBag, Users, 
  BarChart3, Shield, Zap, Target, Award, ArrowRight,
  Activity, Clock, CheckCircle, AlertCircle, Star,
  MapPin, Truck, FileText, MessageSquare, Globe,
  Sprout, CloudRain, Bug, Droplets, Thermometer,
  Leaf, Wheat, Sun, Database, Eye, Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LiveStatCard } from '@/components/ui/LiveStatCard';

export default function FarmerCommandCenter() {
  console.log('🚀 FarmerCommandCenter component loaded!');
  const router = useRouter();
  const { t } = useTranslation();
  const [marketSync, setMarketSync] = useState(12.4);
  // Re-render decoupled to LiveFarmInsightsWidget

  const stats = [
    {
      label: t('dashboard.total_crops_value'),
      value: '₹0',
      icon: Database,
      color: 'emerald',
      trend: 'up',
      live: true
    },
    {
      label: t('dashboard.active_orders'),
      value: '0',
      icon: ShoppingBag,
      color: 'blue',
      trend: 'stable',
      live: true
    },
    {
      label: t('dashboard.pending_payments'),
      value: '₹0',
      icon: DollarSign,
      color: 'amber',
      trend: 'down',
      live: true
    },
    {
      label: t('dashboard.market_profit_gain'),
      value: '0%',
      icon: TrendingUp,
      color: 'purple',
      trend: 'up',
      live: true
    }
  ];



  const mandiPrices = [
    { crop: t('crops.wheat'), mandi: t('mandis.indore'), price: '₹2,450', change: '+45', trend: 'up' },
    { crop: t('crops.rice'), mandi: t('mandis.karnal'), price: '₹3,800', change: '-20', trend: 'down' },
    { crop: t('crops.tomato'), mandi: t('mandis.azadpur'), price: '₹1,200', change: '+150', trend: 'up' },
    { crop: t('crops.onion'), mandi: t('mandis.lasalgaon'), price: '₹2,100', change: '+10', trend: 'up' },
    { crop: t('crops.turmeric'), mandi: t('mandis.erode'), price: '₹9,200', change: '-100', trend: 'down' }
  ];

  const exportOpportunities = [
    {
      crop: t('crops.basmati_rice'),
      destination: t('destinations.uae'),
      demand: t('dashboard.high_demand'),
      market: t('destinations.dubai'),
      margin: '+22%',
      color: 'emerald'
    },
    {
      crop: t('crops.organic_spices'),
      destination: t('destinations.germany'),
      demand: t('dashboard.medium_demand'),
      market: t('destinations.hamburg'),
      margin: '+35%',
      color: 'blue'
    },
    {
      crop: t('crops.fresh_mangoes'),
      destination: t('destinations.uk'),
      demand: t('dashboard.critical_demand'),
      market: t('destinations.london'),
      margin: '+40%',
      color: 'purple'
    },
    {
      crop: t('crops.cashew_nuts'),
      destination: t('destinations.vietnam'),
      demand: t('dashboard.high_demand'),
      market: t('destinations.ho_chi_minh'),
      margin: '+18%',
      color: 'amber'
    }
  ];

  const subFeatures = [
    {
      id: 'ai-intelligence',
      title: t('features.ai_intelligence_hub'),
      description: t('features.ai_intelligence_desc'),
      icon: Sparkles,
      color: 'blue',
      metrics: { insights: 8, accuracy: '94%' },
      route: '/farmer/dashboard?section=AI Intelligence'
    },
    {
      id: 'production',
      title: t('features.production_supply'),
      description: t('features.production_desc'),
      icon: Package,
      color: 'green',
      metrics: { products: 12, active: '85%' },
      route: '/farmer/dashboard?section=Production'
    },
    {
      id: 'orders-logistics',
      title: t('features.orders_logistics'),
      description: t('features.orders_desc'),
      icon: Truck,
      color: 'orange',
      metrics: { orders: 23, delivered: '96%' },
      route: '/farmer/dashboard?section=Orders'
    },
    {
      id: 'payments-finance',
      title: t('features.payments_finance'),
      description: t('features.payments_desc'),
      icon: DollarSign,
      color: 'emerald',
      metrics: { balance: '₹45K', pending: '₹12K' },
      route: '/farmer/dashboard?section=Finance'
    },
    {
      id: 'tender-bidding',
      title: t('features.tender_bidding'),
      description: t('features.tender_desc'),
      icon: Target,
      color: 'purple',
      metrics: { active: 8, won: 12 },
      route: '/farmer/dashboard?section=Bidding'
    },
    {
      id: 'trust-reputation',
      title: t('features.trust_reputation'),
      description: t('features.trust_desc'),
      icon: Award,
      color: 'cyan',
      metrics: { score: '4.8★', verified: '✓' },
      route: '/farmer/dashboard?section=Trust'
    },
    {
      id: 'security-compliance',
      title: t('features.security_compliance'),
      description: t('features.security_desc'),
      icon: Shield,
      color: 'indigo',
      metrics: { traced: 89, compliant: '100%' },
      route: '/farmer/dashboard?section=Security'
    },
    {
      id: 'quality-detector',
      title: t('features.quality_detector'),
      description: t('features.quality_desc'),
      icon: Eye,
      color: 'red',
      metrics: { scans: 45, grade: 'A+' },
      route: '/quality-scanner'
    },
    {
      id: 'farm-insights',
      title: t('features.farm_insights'),
      description: t('features.farm_insights_desc'),
      icon: BarChart3,
      color: 'amber',
      metrics: { score: '85/100', alerts: 2 },
      route: '/farmer/dashboard?section=AI Intelligence'
    },
    {
      id: 'agrichat',
      title: t('features.agrichat_connect'),
      description: t('features.agrichat_desc'),
      icon: MessageSquare,
      color: 'violet',
      metrics: { chats: 23, active: '●' },
      route: '/farmer/agrichat'
    }
  ];

  const recentActivity = [
    {
      type: 'harvest',
      title: t('activity.harvest_ready'),
      description: t('activity.harvest_desc', { crop: t('crops.tomato'), field: 'Field A2' }),
      status: 'success',
      time: t('time.minutesAgo', { count: 2 }),
      icon: Sprout
    },
    {
      type: 'order',
      title: t('activity.new_order'),
      description: t('activity.order_desc', { crop: t('crops.basmati_rice'), quantity: '500kg', id: 'ORD-445' }),
      status: 'processing',
      time: t('time.minutesAgo', { count: 15 }),
      icon: ShoppingBag
    },
    {
      type: 'weather',
      title: t('activity.weather_alert'),
      description: t('activity.weather_desc'),
      status: 'info',
      time: t('time.hourAgo'),
      icon: CloudRain
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

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Section - Farmer Command Center */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
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
              <h1 className="text-4xl font-black mb-2">{t('dashboard.farmer_command_center')} 🌾</h1>
              <h2 className="text-2xl font-bold mb-2">{t('dashboard.welcome_farmer', { name: 'Rajesh Kumar' })}</h2>
              <p className="text-xl text-emerald-100">{t('dashboard.analyzing_intelligence', { size: '12.4TB' })}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-emerald-200">{t('dashboard.system_health')}</div>
                <div className="text-2xl font-black">{t('dashboard.optimized', { percent: '100' })}</div>
                <div className="flex items-center gap-2 text-emerald-200">
                  <div className="h-2 w-2 bg-emerald-300 rounded-full animate-pulse" />
                  <span className="text-sm font-bold">{t('common.live')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  {stat.live && (
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                      <div className="h-1.5 w-1.5 bg-emerald-300 rounded-full animate-pulse" />
                      {t('common.live')}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black mb-1">{stat.value}</h3>
                <p className="text-sm text-emerald-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Live Mandi Prices & Farm Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Mandi Prices */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">{t('dashboard.live_mandi_prices')}</h2>
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold">{t('dashboard.realtime_sync')}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-slate-600">{t('dashboard.regional_average')}</div>
              <div className="text-2xl font-black text-emerald-600">₹2,480.00 {t('units.per_qtl')}</div>
            </div>
          </div>

          <div className="space-y-3">
            {mandiPrices.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Wheat size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">{item.crop}</h3>
                    <p className="text-sm text-slate-600">{item.mandi}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-slate-900">{item.price}</div>
                  <div className={`text-sm font-bold ${getTrendColor(item.trend)}`}>
                    {item.change} ({t('dashboard.today')})
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Farm Yield Insights decoupled stream */}
        <LiveFarmInsightsWidget />
      </div>

      {/* Global Export Hub */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">{t('dashboard.global_export_hub')}</h2>
            <div className="flex items-center gap-2 text-blue-600">
              <Globe size={16} />
              <span className="text-sm font-bold">{t('dashboard.global_sourcing_live')}</span>
            </div>
          </div>
          <button className="text-sm font-bold text-blue-600 hover:underline">{t('dashboard.view_analysis')}</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {exportOpportunities.map((opportunity, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br from-${opportunity.color}-50 to-${opportunity.color}-100 rounded-xl p-4 border border-${opportunity.color}-200`}
            >
              <h3 className="font-black text-slate-900 mb-1">{opportunity.crop} → {opportunity.destination}</h3>
              <div className={`text-sm font-bold text-${opportunity.color}-600 mb-2`}>{opportunity.demand}</div>
              <div className="text-xs text-slate-600 mb-2">{opportunity.market}</div>
              <div className={`text-lg font-black text-${opportunity.color}-600`}>{opportunity.margin}</div>
              <div className="text-xs text-slate-500">{t('dashboard.net_margin')}</div>
            </motion.div>
          ))}
        </div>

        <div className="text-center text-sm text-slate-600">
          {t('dashboard.exporting_farmers', { count: 12 })}
        </div>
      </motion.div>

      {/* Sub-Features Grid - Tactical Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{t('dashboard.farm_management_hub')}</h2>
            <p className="text-slate-600">{t('dashboard.access_tools')}</p>
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
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 p-6 shadow-lg hover:shadow-xl transition-all text-left group"
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
                      <span className="text-xs text-slate-500 ml-1">{t(`metrics.${key}`)}</span>
                    </div>
                  ))}
                </div>
                <ArrowRight size={18} className="text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Intelligence Feed - AI Assistant */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
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
              <MessageSquare size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-black">{t('dashboard.ai_intelligence_assistant')}</h3>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">🤖 {t('common.live')}</span>
              </div>
              <p className="text-emerald-100 text-lg">
                {t('dashboard.ai_insights_desc')}
              </p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/farmer/dashboard?section=AI Intelligence')}
            className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all"
          >
            {t('dashboard.open_chat')}
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center py-6 text-slate-500 text-sm">
        {t('dashboard.copyright')}
      </div>
    </div>
  );
}

function LiveFarmInsightsWidget() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeCrops, setActiveCrops] = useState(12);
  const [weatherScore, setWeatherScore] = useState(85);
  const [soilHealth, setSoilHealth] = useState(92);
  const [pestRisk, setPestRisk] = useState(15);
  const [revenue, setRevenue] = useState(45000);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCrops(prev => Math.max(10, prev + Math.floor(Math.random() * 3 - 1)));
      setWeatherScore(prev => Math.max(70, Math.min(100, Math.floor(prev + (Math.random() * 4 - 2)))));
      setSoilHealth(prev => Math.max(70, Math.min(100, Math.floor(prev + (Math.random() * 2 - 1)))));
      setPestRisk(prev => Math.max(5, Math.min(50, Math.floor(prev + (Math.random() * 4 - 2)))));
      setRevenue(prev => prev + Math.floor(Math.random() * 100));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const farmInsights = {
    weatherScore: weatherScore,
    soilHealth: `${soilHealth}% ${t('units.ideal')}`,
    pestRisk: `${pestRisk}% ${t('units.index')}`,
    revenue: `₹${revenue.toLocaleString()}`,
    totalCrops: activeCrops,
    totalArea: 25
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-900">{t('dashboard.farm_yield_insights')}</h2>
        <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" /> AI Prediction Engine v4.2
        </span>
      </div>
      
      <button onClick={() => router.push('/farmer/overview')} className="w-full text-right mb-6 group flex justify-end items-center gap-1">
        <span className="text-sm font-bold text-blue-600 group-hover:underline">{t('dashboard.full_detail')}</span>
        <ArrowRight size={14} className="text-blue-600 transition-transform group-hover:translate-x-1" />
      </button>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
          <div className="flex items-center gap-3">
            <CloudRain size={20} className="text-blue-600" />
            <span className="font-bold text-slate-900">{t('dashboard.weather_score')}</span>
          </div>
          <span className="text-xl font-black text-blue-600">{farmInsights.weatherScore}/100</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl group transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-3">
            <Leaf size={20} className="text-green-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-slate-900">{t('dashboard.soil_health')}</span>
          </div>
          <span className={`text-lg font-black transition-colors ${soilHealth > 90 ? 'text-green-600' : 'text-slate-900'}`}>{farmInsights.soilHealth}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl group transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-3">
            <Bug size={20} className="text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-slate-900">{t('dashboard.pest_risk')}</span>
          </div>
          <span className={`text-lg font-black transition-colors ${pestRisk > 20 ? 'text-red-500' : 'text-amber-600'}`}>{farmInsights.pestRisk}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl group transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center gap-3">
            <DollarSign size={20} className="text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-slate-900">{t('dashboard.revenue')}</span>
          </div>
          <span className="text-xl font-black text-purple-600">{farmInsights.revenue}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-black text-emerald-600">{farmInsights.totalCrops}+2</div>
            <div className="text-xs text-slate-600">{t('dashboard.total_crops')}<br/>{t('dashboard.this_season')}</div>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-600">{farmInsights.totalArea} {t('units.acres')}</div>
            <div className="text-xs text-slate-600">{t('dashboard.total_area')}<br/>{t('dashboard.utilized', { percent: '85' })}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}