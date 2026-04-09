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
  { label: "Overview", href: "/farmer/dashboard", icon: <LayoutDashboard />, section: "Overview" },
  
  // Live Cockpit Dashboard
  { label: "Live Cockpit", href: "/farmer/live", icon: <Zap />, section: "Live" },

  // REAL AI Quality Scan (Direct Feature)
  { label: "AI Quality Scan", href: "/farmer/quality-scan", icon: <Camera />, section: "Quality" },
  
  // AI & Intelligence Hub
  { label: "AI Intelligence Hub", href: "/farmer/dashboard", icon: <Sparkles />, section: "AI Intelligence" },
  
  // Production & Supply Chain
  { label: "Production & Supply", href: "/farmer/dashboard", icon: <Package />, section: "Production" },
  
  // Orders & Logistics
  { label: "Orders & Logistics", href: "/farmer/dashboard", icon: <Truck />, section: "Orders" },
  
  // Payments & Finance
  { label: "Payments & Finance", href: "/farmer/dashboard", icon: <DollarSign />, section: "Finance" },
  
  // Tender & Bidding
  { label: "Tenders & Bidding", href: "/farmer/dashboard", icon: <Gavel />, section: "Bidding" },
  
  // Trust & Reputation
  { label: "Trust & Reputation", href: "/farmer/dashboard", icon: <Award />, section: "Trust" },
  
  // Security & Compliance
  { label: "Security & Compliance", href: "/farmer/dashboard", icon: <ShieldAlert />, section: "Security" },
  
  // Communication
  { label: "AgriChat_connect", href: "/farmer/agrichat", icon: <MessageSquare />, section: "Chat" },
];

export const buyerNav = [
  // Overview & Command Center
  { label: "Overview", href: "/buyer/dashboard", icon: <LayoutDashboard />, section: "Overview" },
  
  // Live Cockpit Dashboard
  { label: "Live Cockpit", href: "/buyer/live", icon: <Zap />, section: "Live" },
  
  // AI & Intelligence Hub
  { label: "AI Intelligence Hub", href: "/buyer/dashboard", icon: <Sparkles />, section: "AI Intelligence" },
  
  // Sourcing & Procurement
  { label: "Sourcing & Procurement", href: "/buyer/dashboard", icon: <Search />, section: "Sourcing" },
  
  // Orders & Tracking
  { label: "Orders & Tracking", href: "/buyer/dashboard", icon: <Package />, section: "Orders" },
  
  // Payments & Finance
  { label: "Payments & Finance", href: "/buyer/dashboard", icon: <DollarSign />, section: "Payments" },
  
  // Negotiation & Bidding
  { label: "Negotiation & Bidding", href: "/buyer/dashboard", icon: <Gavel />, section: "Bidding" },
  
  // Trust & Reputation
  { label: "Trust & Reputation", href: "/buyer/dashboard", icon: <Award />, section: "Trust" },
  
  // Security & Compliance
  { label: "Security & Compliance", href: "/buyer/dashboard", icon: <ShieldAlert />, section: "Security" },
  
  // Communication
  { label: "AgriChat", href: "/buyer/chat", icon: <MessageSquare />, section: "Chat" },
];
