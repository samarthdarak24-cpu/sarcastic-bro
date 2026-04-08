import {
  LayoutDashboard,
  Package,
  Gavel,
  Truck,
  Search,
  CreditCard,
  Target,
  MessageSquare,
  TrendingUp,
  Navigation,
  ShoppingBag,
  ShieldCheck,
  Zap,
  Lock,
  BarChart3,
  Users,
  Award,
  Sparkles,
  Link2,
  Table,
  Shield,
  DollarSign,
  ShieldAlert,
  Globe,
  Layers,
  AlertCircle,
  FileText,
  Calendar,
  History,
  RotateCcw,
  CheckCircle,
  Camera
} from "lucide-react";

// Use translation keys (sidebar.xxx) that DashboardLayout resolves via t(key)
export const farmerNav = [
  // Overview & Command Center
  { label: "sidebar.overview", href: "/farmer/dashboard", icon: <LayoutDashboard />, section: "Overview" },
  
  // Live Cockpit Dashboard
  { label: "sidebar.live_cockpit", href: "/farmer/live", icon: <Zap />, section: "Live" },

  // REAL AI Quality Scan (Direct Feature)
  { label: "sidebar.ai_quality_scan", href: "/farmer/quality-scan", icon: <Camera />, section: "Quality" },
  
  // AI & Intelligence Hub
  { label: "sidebar.ai_intelligence_hub", href: "/farmer/dashboard", icon: <Sparkles />, section: "AI Intelligence" },
  
  // Production & Supply Chain
  { label: "sidebar.production_supply", href: "/farmer/dashboard", icon: <Package />, section: "Production" },
  
  // Orders & Logistics
  { label: "sidebar.orders_logistics", href: "/farmer/dashboard", icon: <Truck />, section: "Orders" },
  
  // Payments & Finance
  { label: "sidebar.payments_finance", href: "/farmer/dashboard", icon: <DollarSign />, section: "Finance" },
  
  // Tender & Bidding
  { label: "sidebar.tender_bidding", href: "/farmer/dashboard", icon: <Gavel />, section: "Bidding" },
  
  // Trust & Reputation
  { label: "sidebar.trust_reputation", href: "/farmer/dashboard", icon: <Award />, section: "Trust" },
  
  // Security & Compliance
  { label: "sidebar.security_compliance", href: "/farmer/dashboard", icon: <ShieldAlert />, section: "Security" },
  
  // Communication
  { label: "sidebar.agrichat_connect", href: "/farmer/agrichat", icon: <MessageSquare />, section: "Chat" },
];

export const buyerNav = [
  // Overview & Command Center
  { label: "sidebar.overview", href: "/buyer/dashboard", icon: <LayoutDashboard />, section: "Overview" },
  
  // Live Cockpit Dashboard
  { label: "sidebar.live_cockpit", href: "/buyer/live", icon: <Zap />, section: "Live" },
  
  // AI & Intelligence Hub
  { label: "sidebar.ai_intelligence_hub", href: "/buyer/dashboard", icon: <Sparkles />, section: "AI Intelligence" },
  
  // Sourcing & Procurement
  { label: "sidebar.sourcing_procurement", href: "/buyer/dashboard", icon: <Search />, section: "Sourcing" },
  
  // Orders & Tracking
  { label: "sidebar.orders_tracking", href: "/buyer/dashboard", icon: <Package />, section: "Orders" },
  
  // Payments & Finance
  { label: "sidebar.payments_finance", href: "/buyer/dashboard", icon: <DollarSign />, section: "Payments" },
  
  // Negotiation & Bidding
  { label: "sidebar.negotiation_bidding", href: "/buyer/dashboard", icon: <Gavel />, section: "Bidding" },
  
  // Trust & Reputation
  { label: "sidebar.trust_reputation", href: "/buyer/dashboard", icon: <Award />, section: "Trust" },
  
  // Security & Compliance
  { label: "sidebar.security_compliance", href: "/buyer/dashboard", icon: <ShieldAlert />, section: "Security" },
  
  // Communication
  { label: "sidebar.agrichat", href: "/buyer/chat", icon: <MessageSquare />, section: "Chat" },
];
