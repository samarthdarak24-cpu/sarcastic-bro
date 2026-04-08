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

// Use translation keys (nav.xxx) instead of hardcoded English labels
// The DashboardLayout will resolve these via t(key)
export const farmerNav = [
  // Overview & Command Center
  { label: "Overview", href: "/farmer/dashboard", icon: <LayoutDashboard />, section: "Overview" },
  
  // Live Cockpit Dashboard
  { label: "Live Cockpit", href: "/farmer/live", icon: <Zap />, section: "Live" },

  // REAL AI Quality Scan (Direct Feature)
  { label: "AI Quality Scan", href: "/farmer/quality-scan", icon: <Camera />, section: "Quality" },
  
  // AI & Intelligence Hub (Merged: AI Chat, Smart Product Hub, Farm Insights, Quality Detection)
  { label: "AI Intelligence Hub", href: "/farmer/dashboard", icon: <Sparkles />, section: "AI Intelligence" },
  
  // Production & Supply Chain (Merged: Smart Product Hub, Crop Management, Inventory Management)
  { label: "Production & Supply Chain", href: "/farmer/dashboard", icon: <Package />, section: "Production" },
  
  // Orders & Logistics (Merged: Order Control, Logistics Manager, Tender Participation)
  { label: "Orders & Logistics", href: "/farmer/dashboard", icon: <Truck />, section: "Orders" },
  
  // Payments & Finance (Merged: AgriPay Center, Auto-Sell Rules, Financial Management)
  { label: "Payments & Finance", href: "/farmer/dashboard", icon: <DollarSign />, section: "Finance" },
  
  // Tender & Bidding (Government tenders, contract farming, bulk sales)
  { label: "Tender & Bidding", href: "/farmer/dashboard", icon: <Gavel />, section: "Bidding" },
  
  // Trust & Reputation (Merged: Trust Identity, Reputation Management, Verification)
  { label: "Trust & Reputation", href: "/farmer/dashboard", icon: <Award />, section: "Trust" },
  
  // Security & Compliance (Merged: Blockchain Trace, Quality Compliance, Export Audit)
  { label: "Security & Compliance", href: "/farmer/dashboard", icon: <ShieldAlert />, section: "Security" },
  
  // Communication
  { label: "AgriChat Connect", href: "/farmer/agrichat", icon: <MessageSquare />, section: "Chat" },
];

export const buyerNav = [
  // Overview & Command Center
  { label: "nav.overview", href: "/buyer/dashboard", icon: <LayoutDashboard />, section: "Overview" },
  
  // Live Cockpit Dashboard
  { label: "Live Cockpit", href: "/buyer/live", icon: <Zap />, section: "Live" },
  
  // AI & Intelligence Hub (Merged: AI Chat, AI Procurement, Agri-Intelligence, Price Intelligence, Cluster Intelligence)
  { label: "AI Intelligence Hub", href: "/buyer/dashboard", icon: <Sparkles />, section: "AI Intelligence" },
  
  // Sourcing & Procurement (Merged: Smart Sourcing, Bulk Marketplace, Bulk Trade Desk, Supplier Insights)
  { label: "Sourcing & Procurement", href: "/buyer/dashboard", icon: <Search />, section: "Sourcing" },
  
  // Orders & Tracking (Merged: Order Tracker, TraceChain, Blockchain Trace)
  { label: "Orders & Tracking", href: "/buyer/dashboard", icon: <Package />, section: "Orders" },
  
  // Payments & Finance (Merged: Escrow Payments, Safe-Lock Hub, Pre-Booking)
  { label: "Payments & Finance", href: "/buyer/dashboard", icon: <DollarSign />, section: "Payments" },
  
  // Negotiation & Bidding
  { label: "Negotiation & Bidding", href: "/buyer/dashboard", icon: <Gavel />, section: "Bidding" },
  
  // Trust & Reputation (Merged: My Reputation, Trust & Reviews, Supplier Insights)
  { label: "Trust & Reputation", href: "/buyer/dashboard", icon: <Award />, section: "Trust" },
  
  // Security & Compliance (Merged: Security Hub, Blockchain verification)
  { label: "Security & Compliance", href: "/buyer/dashboard", icon: <ShieldAlert />, section: "Security" },
  
  // Communication
  { label: "AgriChat", href: "/buyer/chat", icon: <MessageSquare />, section: "Chat" },
];
