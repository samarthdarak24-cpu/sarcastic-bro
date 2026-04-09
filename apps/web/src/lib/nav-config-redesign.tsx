import {
  LayoutDashboard,
  Sparkles,
  Package,
  Truck,
  DollarSign,
  Gavel,
  Award,
  ShieldAlert,
  MessageSquare,
  Camera
} from "lucide-react";

// Simplified navigation for redesigned farmer dashboard
export const farmerNavRedesign = [
  // Main Dashboard - Shows all features organized by category
  { 
    label: "Dashboard", 
    href: "/farmer/dashboard", 
    icon: <LayoutDashboard />, 
    section: "Dashboard" 
  },
  
  // Direct access to most used features
  { 
    label: "AI Quality Scan", 
    href: "/quality-scanner", 
    icon: <Camera />, 
    section: "Quality" 
  },
  
  { 
    label: "AgriChat", 
    href: "/farmer/agrichat", 
    icon: <MessageSquare />, 
    section: "Chat" 
  },
];

// Keep buyer nav as is
export const buyerNav = [
  { label: "Overview", href: "/buyer/dashboard", icon: <LayoutDashboard />, section: "Overview" },
  { label: "Sourcing & Procurement", href: "/buyer/dashboard", icon: <Package />, section: "Sourcing" },
  { label: "Orders & Tracking", href: "/buyer/dashboard", icon: <Truck />, section: "Orders" },
  { label: "Payments & Finance", href: "/buyer/dashboard", icon: <DollarSign />, section: "Payments" },
  { label: "Negotiation & Bidding", href: "/buyer/dashboard", icon: <Gavel />, section: "Bidding" },
  { label: "Trust & Reputation", href: "/buyer/dashboard", icon: <Award />, section: "Trust" },
  { label: "Security & Compliance", href: "/buyer/dashboard", icon: <ShieldAlert />, section: "Security" },
  { label: "AgriChat", href: "/buyer/chat", icon: <MessageSquare />, section: "Chat" },
];
