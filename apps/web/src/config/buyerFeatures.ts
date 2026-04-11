// Buyer Dashboard Features Configuration
// Maps all 18 main features with their subfeatures and routes

export const BUYER_FEATURES = {
  cockpit: {
    name: 'Cockpit Live',
    icon: 'Gauge',
    color: 'from-blue-500 to-cyan-500',
    description: 'Real-time command center',
    route: '/buyer/cockpit',
    subfeatures: [
      { name: 'Live Dashboard', route: '/buyer/cockpit/live-dashboard', icon: 'BarChart3' },
      { name: 'KPI Cards', route: '/buyer/cockpit/kpi-cards', icon: 'TrendingUp' },
      { name: 'Market Radar', route: '/buyer/cockpit/market-radar', icon: 'Radar' },
      { name: 'Quick Actions', route: '/buyer/cockpit/quick-actions', icon: 'Zap' },
      { name: 'Alerts', route: '/buyer/cockpit/alerts', icon: 'Bell' },
    ]
  },
  
  aiProcurement: {
    name: 'AI Procurement',
    icon: 'Brain',
    color: 'from-purple-500 to-pink-500',
    description: 'Smart procurement assistant',
    route: '/buyer/ai-procurement',
    subfeatures: [
      { name: 'Recommendations', route: '/buyer/ai-procurement/recommendations', icon: 'Lightbulb' },
      { name: 'Automated Sourcing', route: '/buyer/ai-procurement/automated-sourcing', icon: 'Zap' },
      { name: 'Predictive Analytics', route: '/buyer/ai-procurement/predictive-analytics', icon: 'TrendingUp' },
      { name: 'Smart Alerts', route: '/buyer/ai-procurement/smart-alerts', icon: 'AlertCircle' },
    ]
  },

  smartSourcing: {
    name: 'Smart Sourcing',
    icon: 'Search',
    color: 'from-green-500 to-emerald-500',
    description: 'Supplier discovery',
    route: '/buyer/smart-sourcing',
    subfeatures: [
      { name: 'Search', route: '/buyer/smart-sourcing/search', icon: 'Search' },
      { name: 'Supplier Discovery', route: '/buyer/smart-sourcing/suppliers', icon: 'Users' },
      { name: 'Product Listings', route: '/buyer/smart-sourcing/products', icon: 'Package' },
      { name: 'Quick Actions', route: '/buyer/smart-sourcing/actions', icon: 'Zap' },
    ]
  },

  reputation: {
    name: 'My Reputation',
    icon: 'Star',
    color: 'from-yellow-500 to-orange-500',
    description: 'Buyer reputation management',
    route: '/buyer/reputation',
    subfeatures: [
      { name: 'Reputation Score', route: '/buyer/reputation/score', icon: 'Award' },
      { name: 'Performance Metrics', route: '/buyer/reputation/metrics', icon: 'BarChart3' },
      { name: 'Reputation Building', route: '/buyer/reputation/building', icon: 'TrendingUp' },
      { name: 'Transparency', route: '/buyer/reputation/transparency', icon: 'Eye' },
    ]
  },

  supplierInsights: {
    name: 'Supplier Insights',
    icon: 'Users',
    color: 'from-indigo-500 to-blue-500',
    description: 'Supplier analytics',
    route: '/buyer/supplier-insights',
    subfeatures: [
      { name: 'Analytics', route: '/buyer/supplier-insights/analytics', icon: 'BarChart3' },
      { name: 'Comparison', route: '/buyer/supplier-insights/comparison', icon: 'GitCompare' },
      { name: 'Profiles', route: '/buyer/supplier-insights/profiles', icon: 'User' },
      { name: 'Relationships', route: '/buyer/supplier-insights/relationships', icon: 'Link' },
      { name: 'Risk Assessment', route: '/buyer/supplier-insights/risk', icon: 'AlertTriangle' },
    ]
  },

  reviews: {
    name: 'Trust & Reviews',
    icon: 'MessageSquare',
    color: 'from-red-500 to-rose-500',
    description: 'Review system',
    route: '/buyer/reviews',
    subfeatures: [
      { name: 'Review Management', route: '/buyer/reviews/management', icon: 'Edit' },
      { name: 'Analytics', route: '/buyer/reviews/analytics', icon: 'BarChart3' },
      { name: 'Trust Verification', route: '/buyer/reviews/verification', icon: 'CheckCircle' },
      { name: 'Insights', route: '/buyer/reviews/insights', icon: 'Lightbulb' },
    ]
  },

  priceIntelligence: {
    name: 'Price Intelligence',
    icon: 'TrendingUp',
    color: 'from-teal-500 to-cyan-500',
    description: 'Market price analytics',
    route: '/buyer/price-intelligence',
    subfeatures: [
      { name: 'Price Tracking', route: '/buyer/price-intelligence/tracking', icon: 'LineChart' },
      { name: 'Market Trends', route: '/buyer/price-intelligence/trends', icon: 'TrendingUp' },
      { name: 'Price Alerts', route: '/buyer/price-intelligence/alerts', icon: 'Bell' },
      { name: 'Analytics Dashboard', route: '/buyer/price-intelligence/dashboard', icon: 'BarChart3' },
    ]
  },

  escrow: {
    name: 'Safe-Lock Hub',
    icon: 'Lock',
    color: 'from-slate-500 to-gray-500',
    description: 'Secure payments',
    route: '/buyer/escrow',
    subfeatures: [
      { name: 'Escrow Management', route: '/buyer/escrow/management', icon: 'Lock' },
      { name: 'Payment Security', route: '/buyer/escrow/security', icon: 'Shield' },
      { name: 'Tracking', route: '/buyer/escrow/tracking', icon: 'Eye' },
      { name: 'Dispute Resolution', route: '/buyer/escrow/disputes', icon: 'AlertCircle' },
    ]
  },

  negotiation: {
    name: 'Negotiation Hub',
    icon: 'Handshake',
    color: 'from-amber-500 to-yellow-500',
    description: 'AI-powered bidding',
    route: '/buyer/negotiation',
    subfeatures: [
      { name: 'Smart Bidding', route: '/buyer/negotiation/bidding', icon: 'Target' },
      { name: 'Negotiation Tools', route: '/buyer/negotiation/tools', icon: 'Zap' },
      { name: 'Auctions', route: '/buyer/negotiation/auctions', icon: 'Gavel' },
      { name: 'AI Negotiator', route: '/buyer/negotiation/ai', icon: 'Brain' },
      { name: 'Deal Management', route: '/buyer/negotiation/deals', icon: 'Briefcase' },
    ]
  },

  intelligence: {
    name: 'AgriIntelligence',
    icon: 'Zap',
    color: 'from-violet-500 to-purple-500',
    description: 'Business intelligence',
    route: '/buyer/intelligence',
    subfeatures: [
      { name: 'Market Intelligence', route: '/buyer/intelligence/market', icon: 'Globe' },
      { name: 'Business Analytics', route: '/buyer/intelligence/analytics', icon: 'BarChart3' },
      { name: 'AI Recommendations', route: '/buyer/intelligence/recommendations', icon: 'Lightbulb' },
      { name: 'Custom Reports', route: '/buyer/intelligence/reports', icon: 'FileText' },
    ]
  },

  chat: {
    name: 'AgriChat',
    icon: 'MessageCircle',
    color: 'from-lime-500 to-green-500',
    description: 'AI chat assistant',
    route: '/buyer/chat',
    subfeatures: [
      { name: 'AI Assistant', route: '/buyer/chat/assistant', icon: 'MessageCircle' },
      { name: 'Supplier Communication', route: '/buyer/chat/suppliers', icon: 'Users' },
      { name: 'Automated Responses', route: '/buyer/chat/automation', icon: 'Zap' },
      { name: 'Chat History', route: '/buyer/chat/history', icon: 'History' },
    ]
  },

  orderTracking: {
    name: 'Order Tracker',
    icon: 'Package',
    color: 'from-orange-500 to-red-500',
    description: 'Real-time tracking',
    route: '/buyer/order-tracking',
    subfeatures: [
      { name: 'Order Tracking', route: '/buyer/order-tracking/tracking', icon: 'MapPin' },
      { name: 'Blockchain Verification', route: '/buyer/order-tracking/verification', icon: 'CheckCircle' },
      { name: 'Shipment Details', route: '/buyer/order-tracking/shipment', icon: 'Truck' },
      { name: 'Notifications', route: '/buyer/order-tracking/notifications', icon: 'Bell' },
    ]
  },

  tracechain: {
    name: 'TraceChain',
    icon: 'Link',
    color: 'from-cyan-500 to-blue-500',
    description: 'Supply chain traceability',
    route: '/buyer/tracechain',
    subfeatures: [
      { name: 'Origin Tracking', route: '/buyer/tracechain/origin', icon: 'MapPin' },
      { name: 'Supply Chain Visibility', route: '/buyer/tracechain/visibility', icon: 'Eye' },
      { name: 'Certification Verification', route: '/buyer/tracechain/certification', icon: 'CheckCircle' },
      { name: 'Blockchain Records', route: '/buyer/tracechain/records', icon: 'Database' },
    ]
  },

  blockchain: {
    name: 'Blockchain Trace',
    icon: 'Blocks',
    color: 'from-fuchsia-500 to-purple-500',
    description: 'Blockchain security',
    route: '/buyer/blockchain',
    subfeatures: [
      { name: 'Transaction Security', route: '/buyer/blockchain/security', icon: 'Shield' },
      { name: 'Transparency', route: '/buyer/blockchain/transparency', icon: 'Eye' },
      { name: 'Smart Contracts', route: '/buyer/blockchain/contracts', icon: 'FileCode' },
      { name: 'Verification', route: '/buyer/blockchain/verification', icon: 'CheckCircle' },
    ]
  },

  payments: {
    name: 'Escrow Payments',
    icon: 'CreditCard',
    color: 'from-green-500 to-teal-500',
    description: 'Secure payments',
    route: '/buyer/payments',
    subfeatures: [
      { name: 'Escrow Management', route: '/buyer/payments/escrow', icon: 'Lock' },
      { name: 'Payment Security', route: '/buyer/payments/security', icon: 'Shield' },
      { name: 'Tracking', route: '/buyer/payments/tracking', icon: 'Eye' },
      { name: 'Dispute Resolution', route: '/buyer/payments/disputes', icon: 'AlertCircle' },
    ]
  },

  security: {
    name: 'Security Hub',
    icon: 'Shield',
    color: 'from-red-500 to-pink-500',
    description: 'Security management',
    route: '/buyer/security',
    subfeatures: [
      { name: 'Account Security', route: '/buyer/security/account', icon: 'Lock' },
      { name: 'Transaction Security', route: '/buyer/security/transactions', icon: 'Shield' },
      { name: 'Data Protection', route: '/buyer/security/data', icon: 'Database' },
      { name: 'Compliance', route: '/buyer/security/compliance', icon: 'CheckCircle' },
    ]
  },

  bulkTrade: {
    name: 'Bulk Trade Desk',
    icon: 'BarChart3',
    color: 'from-sky-500 to-blue-500',
    description: 'Trading terminal',
    route: '/buyer/bulk-trade',
    subfeatures: [
      { name: 'Trading Terminal', route: '/buyer/bulk-trade/terminal', icon: 'BarChart3' },
      { name: 'Advanced Orders', route: '/buyer/bulk-trade/orders', icon: 'ShoppingCart' },
      { name: 'Market Analysis', route: '/buyer/bulk-trade/analysis', icon: 'LineChart' },
      { name: 'Risk Management', route: '/buyer/bulk-trade/risk', icon: 'AlertTriangle' },
    ]
  },

  cluster: {
    name: 'Cluster Intelligence',
    icon: 'Map',
    color: 'from-rose-500 to-pink-500',
    description: 'Regional analysis',
    route: '/buyer/cluster',
    subfeatures: [
      { name: 'Cluster Analytics', route: '/buyer/cluster/analytics', icon: 'BarChart3' },
      { name: 'Optimization', route: '/buyer/cluster/optimization', icon: 'Zap' },
      { name: 'Competitive Analysis', route: '/buyer/cluster/competitive', icon: 'GitCompare' },
      { name: 'Strategic Planning', route: '/buyer/cluster/planning', icon: 'Target' },
    ]
  },
};

export const getAllFeatures = () => Object.values(BUYER_FEATURES);
export const getFeatureByKey = (key: string) => BUYER_FEATURES[key as keyof typeof BUYER_FEATURES];
export const getAllSubfeatures = () => {
  const subfeatures: any[] = [];
  Object.values(BUYER_FEATURES).forEach(feature => {
    subfeatures.push(...feature.subfeatures);
  });
  return subfeatures;
};
