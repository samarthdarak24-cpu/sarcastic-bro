'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Package, DollarSign, TrendingUp, Target, Brain, Star, Globe, Gift, 
  Activity, BarChart3, Sparkles, ArrowUpRight, ArrowDownRight, RefreshCw,
  Eye, AlertCircle, Zap, Search, Filter, Bell, ChevronRight, Play, Pause
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// import { useSocket } from '@/hooks/useSocket';
// import { productService } from '@/services/productService';
// import { aiService } from '@/services/aiService';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  qualityScore: number;
  views: number;
  sales: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
  optimizationScore: number;
}

interface PricingRecommendation {
  current: number;
  recommended: number;
  potential_increase: number;
  confidence: number;
  reason: string;
}

interface BundleSuggestion {
  products: string[];
  expectedRevenue: number;
  confidence: number;
}

const SmartProductHubRedesign: React.FC = () => {
  const [activeTab, setActiveTab] = useState('optimizer');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pricingData, setPricingData] = useState<Record<string, PricingRecommendation>>({});
  const [bundles, setBundles] = useState<BundleSuggestion[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  
  // const socket = useSocket();

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
      loadPricingRecommendations();
      loadBundleSuggestions();
    }, 1200);

    // Socket.IO integration (commented out - commented out service imports)
    /*
    if (socket) {
      socket.on('product:view', handleProductView);
      socket.on('product:sale', handleProductSale);
      socket.on('market:update', handleMarketUpdate);
    }
    
    return () => {
      clearTimeout(timer);
      if (socket) {
        socket.off('product:view', handleProductView);
        socket.off('product:sale', handleProductSale);
        socket.off('market:update', handleMarketUpdate);
      }
    };
    */

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const loadProducts = async () => {
    try {
      // const response = await productService.getMyProducts();
      // setProducts(response || [...]);
      setProducts([
        { id: '1', name: 'Organic Tomatoes', category: 'Vegetables', price: 45, quantity: 150, qualityScore: 92, views: 1250, sales: 89, revenue: 4005, trend: 'up', optimizationScore: 85 },
        { id: '2', name: 'Fresh Mangoes', category: 'Fruits', price: 120, quantity: 80, qualityScore: 88, views: 2100, sales: 156, revenue: 18720, trend: 'up', optimizationScore: 78 },
        { id: '3', name: 'Basmati Rice', category: 'Grains', price: 85, quantity: 200, qualityScore: 95, views: 980, sales: 67, revenue: 5695, trend: 'stable', optimizationScore: 92 },
        { id: '4', name: 'Organic Wheat', category: 'Grains', price: 55, quantity: 180, qualityScore: 90, views: 750, sales: 45, revenue: 2475, trend: 'down', optimizationScore: 72 },
      ]);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([
        { id: '1', name: 'Organic Tomatoes', category: 'Vegetables', price: 45, quantity: 150, qualityScore: 92, views: 1250, sales: 89, revenue: 4005, trend: 'up', optimizationScore: 85 },
        { id: '2', name: 'Fresh Mangoes', category: 'Fruits', price: 120, quantity: 80, qualityScore: 88, views: 2100, sales: 156, revenue: 18720, trend: 'up', optimizationScore: 78 },
        { id: '3', name: 'Basmati Rice', category: 'Grains', price: 85, quantity: 200, qualityScore: 95, views: 980, sales: 67, revenue: 5695, trend: 'stable', optimizationScore: 92 },
        { id: '4', name: 'Organic Wheat', category: 'Grains', price: 55, quantity: 180, qualityScore: 90, views: 750, sales: 45, revenue: 2475, trend: 'down', optimizationScore: 72 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadPricingRecommendations = async () => {
    try {
      // const response = await aiService.getPricingRecommendations();
      // Mock pricing data
      setPricingData({
        '1': { current: 45, recommended: 52, potential_increase: 7, confidence: 87, reason: 'Market demand high' },
        '2': { current: 120, recommended: 135, potential_increase: 15, confidence: 92, reason: 'Premium quality' },
        '3': { current: 85, recommended: 88, potential_increase: 3, confidence: 75, reason: 'Seasonal trend' },
        '4': { current: 55, recommended: 60, potential_increase: 5, confidence: 80, reason: 'Competitive advantage' },
      });
    } catch (error) {
      console.error('Failed to load pricing:', error);
    }
  };

  const loadBundleSuggestions = async () => {
    try {
      // const response = await aiService.getBundleSuggestions();
      // Mock bundle data
      setBundles([
        { products: ['Organic Tomatoes', 'Fresh Onions'], expectedRevenue: 2500, confidence: 92 },
        { products: ['Organic Rice', 'Organic Wheat'], expectedRevenue: 4200, confidence: 88 },
      ]);
    } catch (error) {
      console.error('Failed to load bundles:', error);
    }
  };

  const handleProductView = (data: any) => {
    setProducts(prev => prev.map(p => 
      p.id === data.productId ? { ...p, views: p.views + 1 } : p
    ));
  };

  const handleProductSale = (data: any) => {
    setProducts(prev => prev.map(p => 
      p.id === data.productId ? { 
        ...p, 
        sales: p.sales + 1,
        revenue: p.revenue + data.amount 
      } : p
    ));
  };

  const handleMarketUpdate = (data: any) => {
    setRealTimeMetrics(data);
  };

  const tabs = [
    { id: 'optimizer', label: 'AI Optimizer', icon: Brain },
    { id: 'pricing', label: 'Dynamic Pricing', icon: DollarSign },
    { id: 'quality', label: 'Quality Analytics', icon: Star },
    { id: 'forecast', label: 'Inventory Forecast', icon: TrendingUp },
    { id: 'multichannel', label: 'Multi-Channel', icon: Globe },
    { id: 'bundles', label: 'Smart Bundles', icon: Gift },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'competitor', label: 'Competitor Intel', icon: Target },
    { id: 'trends', label: 'Seasonal Trends', icon: BarChart3 },
    { id: 'autogen', label: 'Auto-Listing', icon: Sparkles },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', padding: '24px' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .live-dot {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .shimmer-loader {
          position: relative;
          overflow: hidden;
        }
        .shimmer-loader::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 1.2s infinite;
        }
        .count-up {
          animation: countUp 0.6s ease-out;
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header with Live Status */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              padding: '16px', 
              background: 'linear-gradient(135deg, #22c55e, #10b981)', 
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(34,197,94,0.3)'
            }}>
              <Package style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                Smart Product Hub
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <div className="live-dot" style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }} />
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Live • AI-Powered Analytics</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              position: 'relative',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Search style={{ width: '18px', height: '18px', color: '#94a3b8' }} />
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  outline: 'none', 
                  color: 'white',
                  width: '200px'
                }}
              />
            </div>
            <button style={{ 
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <Filter style={{ width: '18px', height: '18px' }} />
            </button>
            <button style={{ 
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#94a3b8',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <Bell style={{ width: '18px', height: '18px' }} />
              <div style={{ 
                position: 'absolute', 
                top: '8px', 
                right: '8px', 
                width: '8px', 
                height: '8px', 
                background: '#ef4444', 
                borderRadius: '50%' 
              }} />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        {!loading && <KPISection products={products} />}

        {/* Tab Navigation */}
        <div style={{ marginBottom: '24px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content', paddingBottom: '8px' }}>
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s',
                  background: activeTab === tab.id 
                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                    : 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(12px)',
                  border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  color: activeTab === tab.id ? 'white' : '#94a3b8',
                  transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: activeTab === tab.id ? '0 8px 32px rgba(99,102,241,0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <tab.icon style={{ width: '16px', height: '16px' }} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            {activeTab === 'optimizer' && <AIOptimizer products={products} />}
            {activeTab === 'pricing' && <DynamicPricing products={products} pricingData={pricingData} />}
            {activeTab === 'quality' && <QualityAnalytics products={products} />}
            {activeTab === 'forecast' && <InventoryForecast products={products} />}
            {activeTab === 'multichannel' && <MultiChannelSync products={products} />}
            {activeTab === 'bundles' && <SmartBundles bundles={bundles} products={products} />}
            {activeTab === 'performance' && <PerformanceDashboard products={products} realTimeMetrics={realTimeMetrics} />}
            {activeTab === 'competitor' && <CompetitorAnalysis products={products} />}
            {activeTab === 'trends' && <SeasonalTrends products={products} />}
            {activeTab === 'autogen' && <AutoListingGenerator products={products} />}
          </>
        )}
      </div>
    </div>
  );
};

// KPI SECTION WITH ANIMATED COUNTERS AND SPARKLINES
const KPISection: React.FC<{ products: Product[] }> = ({ products }) => {
  const [counts, setCounts] = useState({ revenue: 0, sales: 0, views: 0, conversion: 0 });
  
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
  const totalViews = products.reduce((sum, p) => sum + p.views, 0);
  const conversionRate = totalViews > 0 ? ((totalSales / totalViews) * 100) : 0;

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        revenue: Math.floor(totalRevenue * progress),
        sales: Math.floor(totalSales * progress),
        views: Math.floor(totalViews * progress),
        conversion: parseFloat((conversionRate * progress).toFixed(2))
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [totalRevenue, totalSales, totalViews, conversionRate]);

  const sparklineData = [
    { value: 45 }, { value: 52 }, { value: 48 }, { value: 65 }, { value: 58 }, { value: 72 }, { value: 68 }
  ];

  const kpis = [
    { label: 'Total Revenue', value: `₹${counts.revenue.toLocaleString()}`, icon: DollarSign, color: '#22c55e', trend: '+12.5%', data: sparklineData },
    { label: 'Total Sales', value: counts.sales, icon: Package, color: '#3b82f6', trend: '+8.3%', data: sparklineData },
    { label: 'Total Views', value: counts.views.toLocaleString(), icon: Eye, color: '#8b5cf6', trend: '+15.7%', data: sparklineData },
    { label: 'Conversion', value: `${counts.conversion}%`, icon: Target, color: '#f59e0b', trend: '+3.2%', data: sparklineData },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
      {kpis.map((kpi, index) => (
        <div
          key={kpi.label}
          className="count-up"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px',
            transition: 'all 0.3s',
            cursor: 'pointer',
            animationDelay: `${index * 100}ms`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 8px 32px ${kpi.color}33`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: `${kpi.color}20`, borderRadius: '12px' }}>
              <kpi.icon style={{ width: '24px', height: '24px', color: kpi.color }} />
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              padding: '4px 12px', 
              background: '#22c55e20', 
              borderRadius: '20px' 
            }}>
              <ArrowUpRight style={{ width: '14px', height: '14px', color: '#22c55e' }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#22c55e' }}>{kpi.trend}</span>
            </div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>{kpi.label}</div>
          </div>

          <div style={{ height: '40px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpi.data}>
                <defs>
                  <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={kpi.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={kpi.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={kpi.color} 
                  strokeWidth={2}
                  fill={`url(#gradient-${index})`} 
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

// SKELETON LOADER
const SkeletonLoader: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="shimmer-loader"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '24px',
          height: '300px'
        }}
      >
        <div style={{ width: '60%', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '16px' }} />
        <div style={{ width: '40%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '24px' }} />
        <div style={{ width: '100%', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '16px' }} />
        <div style={{ width: '80%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
      </div>
    ))}
  </div>
);

export default SmartProductHubRedesign;


// 1. AI OPTIMIZER - Advanced AI-powered product optimization with impact analysis
const AIOptimizer: React.FC<{ products: Product[] }> = ({ products }) => {
  const [optimizing, setOptimizing] = useState<string | null>(null);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    const generated = products.map(p => ({
      productId: p.id,
      productName: p.name,
      score: p.optimizationScore,
      suggestions: [
        { type: 'title', text: 'Add trending keywords: "organic", "fresh", "premium"', impact: 'high', potential: '+25% visibility' },
        { type: 'image', text: 'Upload 3 more high-resolution product images', impact: 'high', potential: '+18% conversion' },
        { type: 'description', text: 'Enhance description with nutritional benefits', impact: 'medium', potential: '+12% engagement' },
        { type: 'pricing', text: 'Adjust price by 8% based on market analysis', impact: 'high', potential: '+15% revenue' },
      ]
    }));
    setInsights(generated);
  }, [products]);

  const optimizeProduct = async (productId: string) => {
    setOptimizing(productId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOptimizing(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
      {insights.map((insight, index) => (
        <div
          key={insight.productId}
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
                {insight.productName}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${insight.score}%`,
                      background: insight.score >= 80 ? 'linear-gradient(90deg, #22c55e, #10b981)' :
                                 insight.score >= 60 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 
                                 'linear-gradient(90deg, #ef4444, #dc2626)',
                      transition: 'width 1s ease-out'
                    }} 
                  />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#22c55e' }}>{insight.score}%</span>
              </div>
            </div>
            <button
              onClick={() => optimizeProduct(insight.productId)}
              disabled={optimizing === insight.productId}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                cursor: optimizing === insight.productId ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: optimizing === insight.productId ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (optimizing !== insight.productId) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {optimizing === insight.productId ? (
                <>
                  <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap style={{ width: '16px', height: '16px' }} />
                  Optimize
                </>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {insight.suggestions.map((suggestion: any, idx: number) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  background: suggestion.impact === 'high' ? 'rgba(239,68,68,0.1)' :
                             suggestion.impact === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                  border: `1px solid ${suggestion.impact === 'high' ? 'rgba(239,68,68,0.2)' :
                                       suggestion.impact === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)'}`,
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '12px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ 
                  padding: '8px', 
                  background: suggestion.impact === 'high' ? 'rgba(239,68,68,0.2)' :
                             suggestion.impact === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)',
                  borderRadius: '8px',
                  height: 'fit-content'
                }}>
                  <Sparkles style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: suggestion.impact === 'high' ? '#ef4444' :
                           suggestion.impact === 'medium' ? '#f59e0b' : '#22c55e'
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', color: 'white', marginBottom: '4px' }}>{suggestion.text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      color: suggestion.impact === 'high' ? '#ef4444' :
                             suggestion.impact === 'medium' ? '#f59e0b' : '#22c55e',
                      textTransform: 'uppercase'
                    }}>
                      {suggestion.impact} IMPACT
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>• {suggestion.potential}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// 2. DYNAMIC PRICING ENGINE - Real-time market-based pricing recommendations
const DynamicPricing: React.FC<{ products: Product[]; pricingData: Record<string, PricingRecommendation> }> = ({ products, pricingData }) => {
  const [applying, setApplying] = useState<string | null>(null);

  const applyPricing = async (productId: string, newPrice: number) => {
    setApplying(productId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setApplying(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
      {products.map((product, index) => {
        const pricing = pricingData[product.id] || {
          current: product.price,
          recommended: product.price * 1.08,
          potential_increase: 8,
          confidence: 85,
          reason: 'Market demand is high for this category. Competitors are pricing 12% higher.'
        };

        return (
          <div
            key={product.id}
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(34,197,94,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{product.name}</h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                padding: '6px 12px', 
                background: 'rgba(34,197,94,0.2)', 
                borderRadius: '20px' 
              }}>
                <ArrowUpRight style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#22c55e' }}>
                  +{pricing.potential_increase}%
                </span>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '20px', 
              background: 'rgba(255,255,255,0.04)', 
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Current Price</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>₹{pricing.current}</p>
              </div>
              <ChevronRight style={{ width: '24px', height: '24px', color: '#94a3b8' }} />
              <div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Recommended</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>₹{pricing.recommended.toFixed(0)}</p>
              </div>
            </div>

            <div style={{ 
              padding: '16px', 
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', 
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Brain style={{ width: '18px', height: '18px', color: '#6366f1' }} />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#6366f1' }}>AI Insight</span>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>{pricing.reason}</p>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${pricing.confidence}%`,
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      transition: 'width 1s ease-out'
                    }} 
                  />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366f1' }}>{pricing.confidence}% confidence</span>
              </div>
            </div>

            <button
              onClick={() => applyPricing(product.id, pricing.recommended)}
              disabled={applying === product.id}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #22c55e, #10b981)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                fontSize: '15px',
                cursor: applying === product.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: applying === product.id ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (applying !== product.id) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(34,197,94,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {applying === product.id ? (
                <>
                  <RefreshCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                  Applying...
                </>
              ) : (
                'Apply Recommended Price'
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

// 3. QUALITY ANALYTICS - Multi-dimensional product quality assessment
const QualityAnalytics: React.FC<{ products: Product[] }> = ({ products }) => {
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const analyzeQuality = async (productId: string) => {
    setAnalyzing(productId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalyzing(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {products.map((product, index) => {
        const qualityMetrics = {
          freshness: 92,
          appearance: 88,
          packaging: 95,
          certification: 90
        };

        return (
          <div
            key={product.id}
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,158,11,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ 
                width: '100%', 
                height: '180px', 
                background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.1))', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package style={{ width: '64px', height: '64px', color: '#22c55e', opacity: 0.5 }} />
              </div>
              <div style={{ 
                position: 'absolute', 
                top: '12px', 
                right: '12px', 
                padding: '8px 16px', 
                background: 'rgba(255,255,255,0.95)', 
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Star style={{ width: '16px', height: '16px', color: '#f59e0b', fill: '#f59e0b' }} />
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f1117' }}>{product.qualityScore}/100</span>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>{product.name}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {Object.entries(qualityMetrics).map(([key, value], idx) => (
                <div key={key}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'capitalize' }}>{key}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>{value}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${value}%`,
                        background: idx === 0 ? 'linear-gradient(90deg, #22c55e, #10b981)' :
                                   idx === 1 ? 'linear-gradient(90deg, #3b82f6, #2563eb)' :
                                   idx === 2 ? 'linear-gradient(90deg, #8b5cf6, #7c3aed)' :
                                   'linear-gradient(90deg, #f59e0b, #d97706)',
                        transition: 'width 1s ease-out',
                        transitionDelay: `${idx * 100}ms`
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => analyzeQuality(product.id)}
              disabled={analyzing === product.id}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #22c55e, #10b981)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                cursor: analyzing === product.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: analyzing === product.id ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (analyzing !== product.id) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(34,197,94,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {analyzing === product.id ? (
                <>
                  <RefreshCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Eye style={{ width: '18px', height: '18px' }} />
                  Re-analyze Quality
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};


// 4. INVENTORY FORECAST SYSTEM - Predictive stock management with AI
const InventoryForecast: React.FC<{ products: Product[] }> = ({ products }) => {
  const forecastData = products.map(p => ({
    ...p,
    forecast: {
      nextWeek: Math.floor(p.quantity * 0.7),
      nextMonth: Math.floor(p.quantity * 0.3),
      reorderPoint: Math.floor(p.quantity * 0.2),
      optimalStock: Math.floor(p.quantity * 1.5),
      trend: p.trend
    }
  }));

  const summaryStats = [
    { label: 'Total Stock', value: products.reduce((sum, p) => sum + p.quantity, 0), icon: Package, color: '#3b82f6', change: '+5%' },
    { label: 'Low Stock Items', value: products.filter(p => p.quantity < 50).length, icon: AlertCircle, color: '#ef4444', change: '-2' },
    { label: 'Optimal Stock', value: products.filter(p => p.quantity >= 50 && p.quantity <= 200).length, icon: Activity, color: '#22c55e', change: '+3' },
    { label: 'Overstock', value: products.filter(p => p.quantity > 200).length, icon: TrendingUp, color: '#f59e0b', change: '0' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {summaryStats.map((stat, index) => (
          <div
            key={stat.label}
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 32px ${stat.color}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ padding: '12px', background: `${stat.color}20`, borderRadius: '12px', width: 'fit-content', marginBottom: '12px' }}>
              <stat.icon style={{ width: '24px', height: '24px', color: stat.color }} />
            </div>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{stat.value}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>{stat.label}</p>
              <span style={{ fontSize: '12px', fontWeight: '600', color: stat.color }}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        {forecastData.map((item, index) => (
          <div
            key={item.id}
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{item.name}</h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                padding: '6px 12px', 
                background: item.forecast.trend === 'up' ? 'rgba(34,197,94,0.2)' :
                           item.forecast.trend === 'down' ? 'rgba(239,68,68,0.2)' : 'rgba(148,163,184,0.2)',
                borderRadius: '20px' 
              }}>
                {item.forecast.trend === 'up' ? (
                  <ArrowUpRight style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                ) : item.forecast.trend === 'down' ? (
                  <ArrowDownRight style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                ) : (
                  <Activity style={{ width: '16px', height: '16px', color: '#94a3b8' }} />
                )}
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: item.forecast.trend === 'up' ? '#22c55e' :
                         item.forecast.trend === 'down' ? '#ef4444' : '#94a3b8',
                  textTransform: 'capitalize'
                }}>
                  {item.forecast.trend}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              {[
                { label: 'Current Stock', value: item.quantity, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
                { label: 'Next Week', value: item.forecast.nextWeek, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
                { label: 'Reorder Point', value: item.forecast.reorderPoint, gradient: 'linear-gradient(135deg, #22c55e, #10b981)' },
                { label: 'Optimal Stock', value: item.forecast.optimalStock, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
              ].map((metric, idx) => (
                <div
                  key={metric.label}
                  style={{
                    padding: '16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                >
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>{metric.label}</p>
                  <p style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    background: metric.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {item.quantity <= item.forecast.reorderPoint && (
              <div style={{ 
                padding: '12px 16px', 
                background: 'rgba(239,68,68,0.1)', 
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600' }}>
                  Low stock alert! Consider reordering soon to avoid stockouts.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. MULTI-CHANNEL SYNC - Cross-platform product synchronization
const MultiChannelSync: React.FC<{ products: Product[] }> = ({ products }) => {
  const [syncing, setSyncing] = useState<string | null>(null);
  
  const channels = [
    { id: 'amazon', name: 'Amazon', status: 'connected', synced: 45, color: '#ff9900', icon: Globe },
    { id: 'flipkart', name: 'Flipkart', status: 'connected', synced: 38, color: '#f59e0b', icon: Globe },
    { id: 'bigbasket', name: 'BigBasket', status: 'connected', synced: 42, color: '#22c55e', icon: Globe },
    { id: 'jiomart', name: 'JioMart', status: 'pending', synced: 0, color: '#3b82f6', icon: Globe },
  ];

  const syncChannel = async (channelId: string) => {
    setSyncing(channelId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSyncing(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {channels.map((channel, index) => (
          <div
            key={channel.id}
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 32px ${channel.color}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: `${channel.color}20`, borderRadius: '12px' }}>
                <channel.icon style={{ width: '24px', height: '24px', color: channel.color }} />
              </div>
              <div style={{ 
                padding: '4px 12px', 
                background: channel.status === 'connected' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)',
                borderRadius: '20px'
              }}>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: '700', 
                  color: channel.status === 'connected' ? '#22c55e' : '#f59e0b',
                  textTransform: 'uppercase'
                }}>
                  {channel.status}
                </span>
              </div>
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{channel.name}</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
              {channel.synced} products synced
            </p>
            
            <button
              onClick={() => syncChannel(channel.id)}
              disabled={syncing === channel.id}
              style={{
                width: '100%',
                padding: '12px',
                background: `linear-gradient(135deg, ${channel.color}, ${channel.color}dd)`,
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                cursor: syncing === channel.id ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: syncing === channel.id ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (syncing !== channel.id) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${channel.color}66`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {syncing === channel.id ? (
                <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <RefreshCw style={{ width: '16px', height: '16px' }} />
                  Sync Now
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
          Product Sync Status
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {products.slice(0, 5).map((product, index) => (
            <div
              key={product.id}
              style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.2))', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Package style={{ width: '24px', height: '24px', color: '#22c55e' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                    {product.name}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8' }}>{product.category}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {channels.filter(c => c.status === 'connected').map(channel => (
                  <div
                    key={channel.id}
                    title={channel.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      background: `${channel.color}20`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', background: channel.color, borderRadius: '50%' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. SMART BUNDLE GENERATOR - AI-powered product bundling recommendations
const SmartBundles: React.FC<{ bundles: BundleSuggestion[]; products: Product[] }> = ({ bundles, products }) => {
  const [creating, setCreating] = useState<string | null>(null);

  const suggestedBundles = [
    { 
      id: '1',
      name: 'Fresh Veggie Pack',
      products: ['Organic Tomatoes', 'Fresh Onions', 'Premium Potatoes'],
      discount: 15,
      expectedRevenue: 2500,
      confidence: 92,
      savings: 450
    },
    { 
      id: '2',
      name: 'Organic Combo',
      products: ['Organic Rice', 'Organic Wheat', 'Organic Pulses'],
      discount: 20,
      expectedRevenue: 4200,
      confidence: 88,
      savings: 840
    },
    { 
      id: '3',
      name: 'Seasonal Special',
      products: ['Fresh Mangoes', 'Watermelon', 'Sweet Grapes'],
      discount: 12,
      expectedRevenue: 3800,
      confidence: 85,
      savings: 456
    },
  ];

  const createBundle = async (bundleId: string) => {
    setCreating(bundleId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCreating(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
      {suggestedBundles.map((bundle, index) => (
        <div
          key={bundle.id}
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(139,92,246,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ 
              padding: '12px', 
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))', 
              borderRadius: '12px' 
            }}>
              <Gift style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />
            </div>
            <div style={{ 
              padding: '6px 16px', 
              background: 'rgba(34,197,94,0.2)', 
              borderRadius: '20px' 
            }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#22c55e' }}>
                {bundle.discount}% OFF
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            {bundle.name}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {bundle.products.map((product, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
              >
                <div style={{ width: '6px', height: '6px', background: '#8b5cf6', borderRadius: '50%' }} />
                <span style={{ fontSize: '14px', color: 'white' }}>{product}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ 
              padding: '16px', 
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(37,99,235,0.1))', 
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '12px' 
            }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Expected Revenue</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>₹{bundle.expectedRevenue}</p>
            </div>
            <div style={{ 
              padding: '16px', 
              background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.1))', 
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '12px' 
            }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>AI Confidence</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#22c55e' }}>{bundle.confidence}%</p>
            </div>
          </div>

          <div style={{ 
            padding: '12px 16px', 
            background: 'rgba(245,158,11,0.1)', 
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Customer Savings</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f59e0b' }}>₹{bundle.savings}</span>
          </div>

          <button
            onClick={() => createBundle(bundle.id)}
            disabled={creating === bundle.id}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              cursor: creating === bundle.id ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              opacity: creating === bundle.id ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (creating !== bundle.id) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {creating === bundle.id ? (
              <>
                <RefreshCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                Creating Bundle...
              </>
            ) : (
              <>
                <Gift style={{ width: '18px', height: '18px' }} />
                Create Bundle
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

// 8. PERFORMANCE DASHBOARD - Complete product performance analytics with top/bottom performers
const PerformanceDashboard: React.FC<{ products: Product[]; realTimeMetrics: any }> = ({ products, realTimeMetrics }) => {
  const calculateMetrics = () => {
    const totalRevenue = products.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    const conversionRate = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : 0;
    
    return { totalRevenue, totalSales, totalViews, conversionRate };
  };

  const metrics = calculateMetrics();
  const topPerformers = [...products].sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 5);
  const needsAttention = [...products].sort((a, b) => (a.views || 0) - (b.views || 0)).slice(0, 5);

  const kpiCards = [
    { label: 'Total Revenue', value: `₹${(metrics.totalRevenue / 1000).toFixed(1)}K`, trend: '+12.5%', icon: DollarSign },
    { label: 'Total Sales', value: metrics.totalSales, trend: '+8.2%', icon: TrendingUp },
    { label: 'Product Views', value: `${(metrics.totalViews / 1000).toFixed(1)}K`, trend: '+5.3%', icon: Eye },
    { label: 'Conversion Rate', value: `${metrics.conversionRate}%`, trend: '+2.1%', icon: Target },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '16px' 
      }}>
        {kpiCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '20px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>{card.label}</p>
                <IconComponent style={{ width: '20px', height: '20px', color: '#22c55e' }} />
              </div>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>{card.value}</p>
              <p style={{ fontSize: '12px', color: '#22c55e' }}>↑ {card.trend}</p>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Top Performers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topPerformers.map((product, index) => (
              <div
                key={product.id}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.2))',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#22c55e'
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>{product.name}</h4>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>₹{product.revenue} revenue</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>{product.sales} sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Needs Attention</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {needsAttention.map((product, index) => (
              <div
                key={product.id}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>{product.name}</h4>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>{product.views} views</p>
                </div>
                <button style={{
                  padding: '6px 12px',
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.2))',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: '#22c55e',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(16,185,129,0.3))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.2))';
                }}>
                  Boost
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 9. COMPETITOR ANALYSIS - Real-time competitor pricing and market positioning analysis
const CompetitorAnalysis: React.FC<{ products: Product[] }> = ({ products }) => {
  const selectedProduct = products[0] || { id: '1', name: 'Product', price: 100 };

  const calculateCompetitorData = () => {
    const basePrice = selectedProduct.price;
    const avgMarketPrice = basePrice + Math.random() * 20 - 10;
    const lowestPrice = avgMarketPrice - 15;
    const highestPrice = avgMarketPrice + 15;
    const marketRank = Math.floor(Math.random() * 10) + 1;
    const totalCompetitors = 45;

    return { avgMarketPrice, lowestPrice, highestPrice, marketRank, totalCompetitors, yourPrice: basePrice };
  };

  const competitorData = calculateCompetitorData();

  const pricePoints = [
    { label: 'Lowest', price: competitorData.lowestPrice, percentage: 0 },
    { label: 'Our Price', price: competitorData.yourPrice, percentage: ((competitorData.yourPrice - competitorData.lowestPrice) / (competitorData.highestPrice - competitorData.lowestPrice)) * 100 },
    { label: 'Avg Market', price: competitorData.avgMarketPrice, percentage: ((competitorData.avgMarketPrice - competitorData.lowestPrice) / (competitorData.highestPrice - competitorData.lowestPrice)) * 100 },
    { label: 'Highest', price: competitorData.highestPrice, percentage: 100 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Market Position for {selectedProduct.name}</h3>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>Ranked #{competitorData.marketRank} out of {competitorData.totalCompetitors} competitors</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {pricePoints.map((point, index) => (
            <div
              key={index}
              style={{
                background: point.label === 'Our Price' ? 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.2))' : 'rgba(255,255,255,0.04)',
                border: point.label === 'Our Price' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}
            >
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>{point.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: point.label === 'Our Price' ? '#22c55e' : 'white' }}>₹{point.price.toFixed(0)}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>Price Range Positioning</h4>
          <div style={{ position: 'relative', height: '40px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ 
              position: 'absolute', 
              left: `${pricePoints[1].percentage}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, #22c55e, #10b981)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}>
              <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />
            </div>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              height: '100%',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              {pricePoints.map((point, i) => (
                <div key={i} style={{ fontSize: '11px', color: '#94a3b8' }}>{point.label}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(37,99,235,0.1))',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          gap: '12px'
        }}>
          <Brain style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>AI Recommendation</h4>
            <p style={{ fontSize: '12px', color: 'white' }}>
              {competitorData.yourPrice > competitorData.avgMarketPrice 
                ? 'Your price is 12% above market average. Consider reducing to increase competitiveness.' 
                : 'Your price is competitive. Current strategy is optimal for market positioning.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 10. SEASONAL TRENDS - Demand and pricing trends across seasons
const SeasonalTrends: React.FC<{ products: Product[] }> = ({ products }) => {
  const seasons = ['Summer', 'Monsoon', 'Winter', 'Spring'];
  const selectedProduct = products[0] || { name: 'Product' };

  interface TrendData {
    month: string;
    demand: number;
    price: number;
  }

  const generateTrendData = (): TrendData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      demand: Math.floor(Math.random() * 100) + 20,
      price: Math.floor(Math.random() * 100) + 50
    }));
  };

  const trendData = generateTrendData();

  const seasonData = seasons.map((season, index) => {
    const startMonth = index * 3;
    const seasonMonths = trendData.slice(startMonth, startMonth + 3);
    const avgDemand = Math.round(seasonMonths.reduce((sum, d) => sum + d.demand, 0) / seasonMonths.length);
    const peakMonth = seasonMonths.reduce((max, d) => d.demand > max.demand ? d : max);
    
    return { season, avgDemand, peakMonth, demandBars: seasonMonths.map(d => d.demand) };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {seasonData.map((season, seasonIndex) => (
        <div
          key={season.season}
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{season.season} Season</h3>
            <div style={{
              padding: '6px 12px',
              background: 'rgba(59,130,246,0.2)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '20px'
            }}>
              <p style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600' }}>High Demand</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px', marginBottom: '20px' }}>
            {season.demandBars.map((demand, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: `${(demand / 100) * 100}%`,
                  background: 'linear-gradient(180deg, rgba(34,197,94,0.8), rgba(16,185,129,0.4))',
                  borderRadius: '8px 8px 0 0',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, rgba(34,197,94,1), rgba(16,185,129,0.6))';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(34,197,94,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, rgba(34,197,94,0.8), rgba(16,185,129,0.4))';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                title={`${demand}% demand`}
              />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Peak Month</p>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>{season.peakMonth.month}</p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Peak Price</p>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#22c55e' }}>₹{Math.floor(season.peakMonth.price * 1.2)}</p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Avg Demand</p>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6' }}>{season.avgDemand}%</p>
            </div>
          </div>
        </div>
      ))}

      <div style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(168,85,247,0.1))',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        gap: '12px'
      }}>
        <Sparkles style={{ width: '20px', height: '20px', color: '#a855f7', flexShrink: 0 }} />
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>Seasonal Forecast</h4>
          <p style={{ fontSize: '12px', color: 'white' }}>
            Next monsoon season shows 35% increase in demand. Prepare inventory now to maximize revenue potential.
          </p>
        </div>
      </div>
    </div>
  );
};

// 11. AUTO-LISTING GENERATOR - AI-powered product listing generation with SEO optimization
const AutoListingGenerator: React.FC<{ products: Product[] }> = ({ products }) => {
  const [generating, setGenerating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0]?.id || '1');
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const generateListing = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const product = products.find(p => p.id === selectedProduct) || products[0];
    setGeneratedContent({
      title: `Premium ${product.name} - Fresh From Farm - ⭐ Certified Organic`,
      description: `Experience the finest quality ${product.name} directly from our farm. Packed with nutrients and natural goodness. Fast delivery | Money-back guarantee | 100% Organic Certified`,
      tags: ['organic', 'fresh', 'farm-fresh', 'premium', 'natural', 'healthy', product.category.toLowerCase()]
    });
    setGenerating(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        height: 'fit-content'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Select Product</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {products.slice(0, 4).map(product => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product.id)}
              style={{
                padding: '12px 16px',
                background: selectedProduct === product.id ? 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.2))' : 'rgba(255,255,255,0.04)',
                border: selectedProduct === product.id ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
                color: selectedProduct === product.id ? '#22c55e' : 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (selectedProduct !== product.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedProduct !== product.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }
              }}
            >
              {product.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {!generatedContent ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', flexDirection: 'column', gap: '16px' }}>
            <Sparkles style={{ width: '40px', height: '40px', color: '#a855f7', opacity: 0.5 }} />
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>Click "Generate Listing" to create AI-powered content</p>
          </div>
        ) : (
          <>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Generated Title</h3>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>{generatedContent.title}</h2>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div style={{ padding: '4px 8px', background: 'rgba(59,130,246,0.2)', borderRadius: '6px' }}>
                  <p style={{ fontSize: '11px', color: '#3b82f6' }}>SEO: 92/100</p>
                </div>
                <div style={{ padding: '4px 8px', background: 'rgba(34,197,94,0.2)', borderRadius: '6px' }}>
                  <p style={{ fontSize: '11px', color: '#22c55e' }}>Readability: 88/100</p>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Description</h3>
              <p style={{ fontSize: '13px', color: 'white', lineHeight: '1.5' }}>{generatedContent.description}</p>
            </div>

            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>SEO Tags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {generatedContent.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#94a3b8'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                flex: 1,
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #22c55e, #10b981)',
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(34,197,94,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}>
                Apply to Product
              </button>
              <button onClick={generateListing} style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}>
                Regenerate
              </button>
            </div>
          </>
        )}

        <button onClick={generateListing} disabled={generating} style={{
          padding: '12px 16px',
          background: generating ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(139,92,246,0.3))',
          border: '1px solid rgba(168,85,247,0.3)',
          color: '#a855f7',
          borderRadius: '8px',
          cursor: generating ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.3s',
          opacity: generating ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!generating) {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(139,92,246,0.4))';
          }
        }}
        onMouseLeave={(e) => {
          if (!generating) {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(139,92,246,0.3))';
          }
        }}>
          {generating ? (
            <>
              <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles style={{ width: '16px', height: '16px' }} />
              Generate Listing
            </>
          )}
        </button>
      </div>
    </div>
  );
};