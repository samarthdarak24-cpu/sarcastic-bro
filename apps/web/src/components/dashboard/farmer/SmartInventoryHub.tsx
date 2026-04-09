"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  TrendingUp,
  AlertCircle,
  Plus,
  RefreshCw,
  BarChart3,
  Settings,
  Zap,
  Clock,
  CheckCircle,
  Truck,
  Box,
  Edit,
  Trash2,
  Eye,
  MapPin,
  DollarSign,
  FileText,
  Download,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  X,
  Save,
  BarChart2,
  PieChart,
  TrendingDown,
  Warehouse,
  ThermometerSun,
  Droplets,
  Wind,
  Sparkles,
  Target,
  ShoppingBag,
  Star,
} from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";

interface InventoryTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface FulfillmentStatus {
  status: string;
  count: number;
  percentage: number;
  color: string;
  bgColor: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  value: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  warehouse: string;
  lastUpdated: string;
  minStock?: number;
  maxStock?: number;
}

interface PriceIndexItem {
  crop: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  trend: "up" | "down" | "stable";
  market: string;
}

interface WarehouseData {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupied: number;
  items: number;
  status: "Active" | "Maintenance" | "Full";
  temperature?: number;
  humidity?: number;
}

interface ActivityLog {
  id: string;
  action: string;
  item: string;
  quantity: number;
  user: string;
  timestamp: string;
  type: "add" | "remove" | "update" | "transfer";
}

interface QualityAlert {
  id: string;
  item: string;
  issue: string;
  severity: "low" | "medium" | "high";
  warehouse: string;
  time: string;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  savings: string;
  action?: string;
}

export function SmartInventoryHub() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "quantity" | "price" | "value">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  // Enhanced Dummy Data
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { id: "INV001", name: "Wheat", category: "Grains", quantity: 500, unit: "kg", price: 25, value: 12500, status: "In Stock", warehouse: "WH-A", lastUpdated: "2 hours ago", minStock: 100, maxStock: 1000 },
    { id: "INV002", name: "Rice", category: "Grains", quantity: 300, unit: "kg", price: 40, value: 12000, status: "In Stock", warehouse: "WH-A", lastUpdated: "5 hours ago", minStock: 150, maxStock: 800 },
    { id: "INV003", name: "Tomatoes", category: "Vegetables", quantity: 50, unit: "kg", price: 30, value: 1500, status: "Low Stock", warehouse: "WH-B", lastUpdated: "1 hour ago", minStock: 80, maxStock: 500 },
    { id: "INV004", name: "Onions", category: "Vegetables", quantity: 200, unit: "kg", price: 20, value: 4000, status: "In Stock", warehouse: "WH-B", lastUpdated: "3 hours ago", minStock: 100, maxStock: 600 },
    { id: "INV005", name: "Potatoes", category: "Vegetables", quantity: 0, unit: "kg", price: 15, value: 0, status: "Out of Stock", warehouse: "WH-C", lastUpdated: "1 day ago", minStock: 100, maxStock: 700 },
    { id: "INV006", name: "Turmeric", category: "Spices", quantity: 80, unit: "kg", price: 120, value: 9600, status: "In Stock", warehouse: "WH-A", lastUpdated: "4 hours ago", minStock: 30, maxStock: 200 },
    { id: "INV007", name: "Chilli", category: "Spices", quantity: 45, unit: "kg", price: 140, value: 6300, status: "Low Stock", warehouse: "WH-C", lastUpdated: "6 hours ago", minStock: 50, maxStock: 300 },
    { id: "INV008", name: "Ginger", category: "Spices", quantity: 120, unit: "kg", price: 95, value: 11400, status: "In Stock", warehouse: "WH-B", lastUpdated: "2 hours ago", minStock: 40, maxStock: 250 },
    { id: "INV009", name: "Corn", category: "Grains", quantity: 450, unit: "kg", price: 22, value: 9900, status: "In Stock", warehouse: "WH-A", lastUpdated: "7 hours ago", minStock: 100, maxStock: 900 },
    { id: "INV010", name: "Carrots", category: "Vegetables", quantity: 180, unit: "kg", price: 28, value: 5040, status: "In Stock", warehouse: "WH-B", lastUpdated: "4 hours ago", minStock: 80, maxStock: 400 },
  ]);

  const priceIndex: PriceIndexItem[] = [
    { crop: "Wheat", currentPrice: 25, previousPrice: 23, change: 8.7, trend: "up", market: "Delhi Mandi" },
    { crop: "Rice", currentPrice: 40, previousPrice: 42, change: -4.8, trend: "down", market: "Mumbai APMC" },
    { crop: "Tomatoes", currentPrice: 30, previousPrice: 30, change: 0, trend: "stable", market: "Pune Market" },
    { crop: "Onions", currentPrice: 20, previousPrice: 18, change: 11.1, trend: "up", market: "Nashik Mandi" },
    { crop: "Potatoes", currentPrice: 15, previousPrice: 16, change: -6.3, trend: "down", market: "Agra Market" },
    { crop: "Turmeric", currentPrice: 120, previousPrice: 115, change: 4.3, trend: "up", market: "Sangli APMC" },
    { crop: "Chilli", currentPrice: 140, previousPrice: 135, change: 3.7, trend: "up", market: "Guntur Market" },
    { crop: "Ginger", currentPrice: 95, previousPrice: 98, change: -3.1, trend: "down", market: "Kochi APMC" },
  ];

  const warehouses: WarehouseData[] = [
    { id: "WH-A", name: "Main Warehouse", location: "Pune, Maharashtra", capacity: 1000, occupied: 880, items: 5, status: "Active", temperature: 22, humidity: 45 },
    { id: "WH-B", name: "Cold Storage", location: "Nashik, Maharashtra", capacity: 500, occupied: 370, items: 4, status: "Active", temperature: 4, humidity: 85 },
    { id: "WH-C", name: "Dry Storage", location: "Sangli, Maharashtra", capacity: 800, occupied: 125, items: 2, status: "Maintenance", temperature: 25, humidity: 40 },
  ];

  const activityLogs: ActivityLog[] = [
    { id: "ACT001", action: "Added", item: "Wheat", quantity: 100, user: "Ramesh Kumar", timestamp: "2 hours ago", type: "add" },
    { id: "ACT002", action: "Removed", item: "Tomatoes", quantity: 50, user: "Suresh Patil", timestamp: "3 hours ago", type: "remove" },
    { id: "ACT003", action: "Updated", item: "Rice", quantity: 300, user: "Amit Shah", timestamp: "5 hours ago", type: "update" },
    { id: "ACT004", action: "Transferred", item: "Ginger", quantity: 20, user: "Vijay Singh", timestamp: "6 hours ago", type: "transfer" },
    { id: "ACT005", action: "Added", item: "Turmeric", quantity: 30, user: "Ramesh Kumar", timestamp: "8 hours ago", type: "add" },
    { id: "ACT006", action: "Removed", item: "Onions", quantity: 75, user: "Priya Sharma", timestamp: "10 hours ago", type: "remove" },
    { id: "ACT007", action: "Updated", item: "Corn", quantity: 450, user: "Rajesh Verma", timestamp: "12 hours ago", type: "update" },
  ];

  const qualityAlerts: QualityAlert[] = [
    { id: "QA001", item: "Tomatoes", issue: "Ripeness check required", severity: "medium", warehouse: "WH-B", time: "1 hour ago" },
    { id: "QA002", item: "Rice", issue: "Moisture level high", severity: "high", warehouse: "WH-A", time: "3 hours ago" },
    { id: "QA003", item: "Onions", issue: "Storage temperature alert", severity: "low", warehouse: "WH-B", time: "5 hours ago" },
    { id: "QA004", item: "Potatoes", issue: "Stock depleted - reorder needed", severity: "high", warehouse: "WH-C", time: "1 day ago" },
  ];

  const aiRecommendations: AIRecommendation[] = [
    { id: "AI001", title: "Restock Potatoes", description: "Stock level critical. Recommend ordering 200kg", priority: "high", savings: "₹3,000", action: "Order Now" },
    { id: "AI002", title: "Price Optimization", description: "Wheat prices trending up. Consider selling 100kg", priority: "medium", savings: "₹2,500", action: "View Details" },
    { id: "AI003", title: "Warehouse Transfer", description: "Move Chilli from WH-C to WH-A for better access", priority: "low", savings: "₹500", action: "Transfer" },
    { id: "AI004", title: "Bulk Discount Opportunity", description: "Rice demand high. Bundle with wheat for 15% premium", priority: "medium", savings: "₹4,200", action: "Create Bundle" },
  ];

  const tabs: InventoryTab[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
    { id: "inventory", label: "Inventory List", icon: <Package size={18} /> },
    { id: "price", label: "Price Index", icon: <TrendingUp size={18} /> },
    { id: "fulfillment", label: "Fulfillment", icon: <Truck size={18} /> },
    { id: "warehouse", label: "Warehouse", icon: <Box size={18} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
    { id: "quality", label: "Quality Control", icon: <CheckCircle size={18} /> },
    { id: "alerts", label: "Smart Alerts", icon: <AlertCircle size={18} /> },
    { id: "activity", label: "Activity Log", icon: <Clock size={18} /> },
    { id: "ai", label: "AI Optimize", icon: <Zap size={18} /> },
  ];

  const fulfillmentStatuses: FulfillmentStatus[] = [
    { status: "Pending", count: 12, percentage: 15, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { status: "Processing", count: 18, percentage: 22, color: "text-blue-600", bgColor: "bg-blue-50" },
    { status: "Shipped", count: 28, percentage: 35, color: "text-purple-600", bgColor: "bg-purple-50" },
    { status: "Delivered", count: 23, percentage: 28, color: "text-green-600", bgColor: "bg-green-50" },
  ];

  // Computed values
  const totalInventoryValue = useMemo(() => {
    return inventoryItems.reduce((sum, item) => sum + item.value, 0);
  }, [inventoryItems]);

  const lowStockCount = useMemo(() => {
    return inventoryItems.filter(item => item.status === "Low Stock" || item.status === "Out of Stock").length;
  }, [inventoryItems]);

  const activeListings = inventoryItems.filter(item => item.status !== "Out of Stock").length;

  // Filtered and sorted inventory
  const filteredInventory = useMemo(() => {
    let filtered = inventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === "all" || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "name") return multiplier * a.name.localeCompare(b.name);
      if (sortBy === "quantity") return multiplier * (a.quantity - b.quantity);
      if (sortBy === "price") return multiplier * (a.price - b.price);
      if (sortBy === "value") return multiplier * (a.value - b.value);
      return 0;
    });

    return filtered;
  }, [inventoryItems, searchQuery, filterStatus, sortBy, sortOrder]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToastMessage("Data refreshed successfully", "success");
    }, 1500);
  };

  const showToastMessage = (message: string, type: "success" | "error" | "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteItem = (id: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== id));
    showToastMessage("Item deleted successfully", "success");
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 right-6 z-50"
          >
            <div className={`px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl border-2 flex items-center gap-3 ${
              toastType === "success" ? "bg-emerald-500/90 border-emerald-400 text-white" :
              toastType === "error" ? "bg-red-500/90 border-red-400 text-white" :
              "bg-blue-500/90 border-blue-400 text-white"
            }`}>
              <CheckCircle size={20} />
              <span className="font-semibold">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          { 
            label: "Total Inventory Value", 
            value: `₹${(totalInventoryValue / 1000).toFixed(1)}K`, 
            change: "+12%", 
            icon: Package, 
            gradient: "from-blue-500 via-blue-600 to-indigo-600",
            bgGradient: "from-blue-50 to-indigo-50"
          },
          { 
            label: "Active Listings", 
            value: activeListings.toString(), 
            change: "+3", 
            icon: ShoppingBag, 
            gradient: "from-emerald-500 via-teal-500 to-cyan-600",
            bgGradient: "from-emerald-50 to-teal-50"
          },
          { 
            label: "Low Stock Alerts", 
            value: lowStockCount.toString(), 
            change: "+2", 
            icon: AlertCircle, 
            gradient: "from-orange-500 via-red-500 to-pink-600",
            bgGradient: "from-orange-50 to-red-50"
          },
          { 
            label: "Fulfillment Rate", 
            value: "94%", 
            change: "↑ 2%", 
            icon: CheckCircle, 
            gradient: "from-purple-500 via-violet-500 to-fuchsia-600",
            bgGradient: "from-purple-50 to-fuchsia-50"
          },
        ].map((kpi, idx) => (
          <motion.div
            key={idx}
            variants={staggerItem}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative p-6 bg-gradient-to-br ${kpi.bgGradient} rounded-2xl border-2 border-white shadow-lg hover:shadow-2xl transition-all overflow-hidden group`}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`p-3 bg-gradient-to-br ${kpi.gradient} rounded-xl shadow-lg`}
                >
                  <kpi.icon className="text-white" size={24} />
                </motion.div>
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    kpi.change.includes("+") || kpi.change.includes("↑") 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {kpi.change}
                </motion.span>
              </div>
              <p className="text-slate-600 text-sm mb-2 font-medium">{kpi.label}</p>
              <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
            </div>

            {/* Decorative element */}
            <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br ${kpi.gradient} rounded-full opacity-10 blur-2xl`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex gap-3 overflow-x-auto pb-4 bg-white/60 backdrop-blur-xl rounded-2xl p-4 shadow-lg border-2 border-white scrollbar-hide">
          {tabs.map((tab, idx) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-xl shadow-emerald-500/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md"
              }`}
            >
              {tab.icon}
              <span className="text-sm">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/60 backdrop-blur-xl rounded-2xl border-2 border-white shadow-xl p-8"
        >
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
              {/* Fulfillment Status */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <Truck size={24} className="text-white" />
                  </div>
                  Fulfillment Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {fulfillmentStatuses.map((status, idx) => (
                    <motion.div
                      key={idx}
                      variants={staggerItem}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className={`p-6 rounded-2xl border-2 ${status.bgColor} border-white shadow-lg cursor-pointer backdrop-blur-sm`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-lg ${status.color}`}>{status.status}</h3>
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.1 + 0.3, type: "spring" }}
                          className="text-3xl font-bold text-slate-900"
                        >
                          {status.count}
                        </motion.span>
                      </div>
                      <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${status.percentage}%` }}
                          transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${
                            status.status === "Pending"
                              ? "from-yellow-400 to-yellow-600"
                              : status.status === "Processing"
                              ? "from-blue-400 to-blue-600"
                              : status.status === "Shipped"
                              ? "from-purple-400 to-purple-600"
                              : "from-green-400 to-green-600"
                          } shadow-lg`}
                        />
                      </div>
                      <p className="text-sm text-slate-600 mt-3 font-medium">{status.percentage}% of total orders</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Inventory Turnover", value: "3.2x", subtitle: "Monthly average", icon: TrendingUp, color: "from-blue-500 to-indigo-600" },
                  { title: "Avg. Stock Age", value: "12 days", subtitle: "Optimal range", icon: Clock, color: "from-emerald-500 to-teal-600" },
                  { title: "Waste Rate", value: "0.8%", subtitle: "Below industry avg", icon: CheckCircle, color: "from-purple-500 to-fuchsia-600" },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                    className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-100 shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg shadow-md`}>
                        <stat.icon size={20} className="text-white" />
                      </div>
                      <p className="text-slate-600 text-sm font-semibold">{stat.title}</p>
                    </div>
                    <p className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</p>
                    <p className="text-xs text-slate-500 font-medium">{stat.subtitle}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity Preview */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-emerald-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {activityLogs.slice(0, 5).map((log, idx) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          log.type === "add" ? "bg-green-100 text-green-600" :
                          log.type === "remove" ? "bg-red-100 text-red-600" :
                          log.type === "update" ? "bg-blue-100 text-blue-600" :
                          "bg-purple-100 text-purple-600"
                        }`}>
                          {log.type === "add" ? <Plus size={16} /> :
                           log.type === "remove" ? <Minus size={16} /> :
                           log.type === "update" ? <Edit size={16} /> :
                           <Truck size={16} />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{log.action} {log.item}</p>
                          <p className="text-xs text-slate-500">{log.user} • {log.timestamp}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700">{log.quantity} kg</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* INVENTORY LIST TAB */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <Package size={28} className="text-white" />
                  </div>
                  Inventory Items
                </h2>
                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none bg-white/80 backdrop-blur-sm w-64"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none bg-white/80 backdrop-blur-sm font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none bg-white/80 backdrop-blur-sm font-medium"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="quantity">Sort by Quantity</option>
                    <option value="price">Sort by Price</option>
                    <option value="value">Sort by Value</option>
                  </select>
                </div>
              </div>

              {/* Inventory Grid */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
              >
                {filteredInventory.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200"
                  >
                    <Package size={64} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-xl font-semibold text-slate-600">No items found</p>
                    <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
                  </motion.div>
                ) : (
                  filteredInventory.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      variants={staggerItem}
                      whileHover={{ scale: 1.01, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                      className={`p-6 bg-gradient-to-r from-white to-slate-50/50 rounded-2xl border-2 hover:border-emerald-300 transition-all backdrop-blur-sm ${
                        item.status === "Low Stock" ? "border-yellow-300 bg-yellow-50/30" :
                        item.status === "Out of Stock" ? "border-red-300 bg-red-50/30" :
                        "border-slate-200"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className={`p-4 rounded-2xl shadow-lg ${
                              item.status === "Out of Stock" ? "bg-gradient-to-br from-red-500 to-pink-600" :
                              item.status === "Low Stock" ? "bg-gradient-to-br from-yellow-500 to-orange-600" :
                              "bg-gradient-to-br from-emerald-500 to-teal-600"
                            }`}
                          >
                            <Package size={28} className="text-white" />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                            <p className="text-sm text-slate-600 font-medium">{item.category} • {item.id}</p>
                            {item.minStock && (
                              <div className="mt-2 w-48">
                                <div className="flex justify-between text-xs text-slate-600 mb-1">
                                  <span>Stock Level</span>
                                  <span>{item.quantity}/{item.maxStock}</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(item.quantity / (item.maxStock || 100)) * 100}%` }}
                                    transition={{ duration: 1, delay: idx * 0.05 }}
                                    className={`h-full ${
                                      item.quantity === 0 ? "bg-red-500" :
                                      item.quantity < (item.minStock || 0) ? "bg-yellow-500" :
                                      "bg-emerald-500"
                                    }`}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="text-center">
                            <p className="text-xs text-slate-600 font-semibold mb-1">Quantity</p>
                            <p className="text-2xl font-bold text-slate-900">{item.quantity} <span className="text-sm text-slate-600">{item.unit}</span></p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 font-semibold mb-1">Price/Unit</p>
                            <p className="text-2xl font-bold text-emerald-600">₹{item.price}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-600 font-semibold mb-1">Total Value</p>
                            <p className="text-2xl font-bold text-blue-600">₹{item.value.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-md ${
                              item.status === "In Stock" ? "bg-green-100 text-green-700 border-2 border-green-200" :
                              item.status === "Low Stock" ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-200" :
                              "bg-red-100 text-red-700 border-2 border-red-200"
                            }`}>
                              {item.status}
                            </span>
                            <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1 justify-center">
                              <MapPin size={12} />
                              {item.warehouse}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <motion.button 
                              whileHover={{ scale: 1.1, rotate: 5 }} 
                              whileTap={{ scale: 0.9 }} 
                              className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors shadow-md"
                            >
                              <Eye size={18} />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1, rotate: -5 }} 
                              whileTap={{ scale: 0.9 }} 
                              className="p-3 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 transition-colors shadow-md"
                            >
                              <Edit size={18} />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1, rotate: 5 }} 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors shadow-md"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock size={14} />
                          <span className="font-medium">Last updated: {item.lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin size={14} />
                          <span className="font-medium">{item.warehouse}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </div>
          )}

          {/* PRICE INDEX TAB */}
          {activeTab === "price" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <TrendingUp size={28} className="text-white" />
                </div>
                Market Price Index
              </h2>
              
              <div className="grid gap-4">
                {priceIndex.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="p-6 bg-gradient-to-r from-white to-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-300 transition-all shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${
                          item.trend === "up" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
                          item.trend === "down" ? "bg-gradient-to-br from-red-500 to-pink-600" :
                          "bg-gradient-to-br from-slate-500 to-gray-600"
                        } shadow-lg`}>
                          {item.trend === "up" ? <ArrowUpRight size={28} className="text-white" /> :
                           item.trend === "down" ? <ArrowDownRight size={28} className="text-white" /> :
                           <Minus size={28} className="text-white" />}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">{item.crop}</h3>
                          <p className="text-sm text-slate-600 font-medium flex items-center gap-1">
                            <MapPin size={14} />
                            {item.market}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm text-slate-600 font-semibold mb-1">Current Price</p>
                          <p className="text-3xl font-bold text-slate-900">₹{item.currentPrice}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600 font-semibold mb-1">Previous</p>
                          <p className="text-xl font-semibold text-slate-600">₹{item.previousPrice}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-slate-600 font-semibold mb-1">Change</p>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1, type: "spring" }}
                            className={`px-4 py-2 rounded-xl font-bold text-lg ${
                              item.change > 0 ? "bg-green-100 text-green-700" :
                              item.change < 0 ? "bg-red-100 text-red-700" :
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {item.change > 0 ? "+" : ""}{item.change.toFixed(1)}%
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* FULFILLMENT TAB */}
          {activeTab === "fulfillment" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-lg">
                  <Truck size={28} className="text-white" />
                </div>
                Order Fulfillment Center
              </h2>

              {/* Fulfillment Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {fulfillmentStatuses.map((status, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className={`p-6 rounded-2xl border-2 ${status.bgColor} border-white shadow-lg backdrop-blur-sm`}
                  >
                    <h3 className={`font-bold text-lg ${status.color} mb-2`}>{status.status}</h3>
                    <p className="text-4xl font-bold text-slate-900 mb-3">{status.count}</p>
                    <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${status.percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full ${
                          status.status === "Pending" ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                          status.status === "Processing" ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                          status.status === "Shipped" ? "bg-gradient-to-r from-purple-400 to-purple-600" :
                          "bg-gradient-to-r from-green-400 to-green-600"
                        }`}
                      />
                    </div>
                    <p className="text-sm text-slate-600 mt-2 font-medium">{status.percentage}% of total</p>
                  </motion.div>
                ))}
              </div>

              {/* Fulfillment Timeline */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Fulfillment Pipeline</h3>
                <div className="space-y-4">
                  {[
                    { stage: "Order Received", count: 12, time: "< 1 hour", color: "from-blue-500 to-indigo-600" },
                    { stage: "Quality Check", count: 8, time: "1-2 hours", color: "from-purple-500 to-fuchsia-600" },
                    { stage: "Packaging", count: 10, time: "2-3 hours", color: "from-orange-500 to-red-600" },
                    { stage: "Ready to Ship", count: 18, time: "< 4 hours", color: "from-emerald-500 to-teal-600" },
                  ].map((stage, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {stage.count}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{stage.stage}</p>
                          <p className="text-sm text-slate-600">Avg. time: {stage.time}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 transition-colors"
                      >
                        View Details
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* WAREHOUSE TAB */}
          {activeTab === "warehouse" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Warehouse size={28} className="text-white" />
                </div>
                Warehouse Management
              </h2>

              <div className="grid gap-6">
                {warehouses.map((warehouse, idx) => (
                  <motion.div
                    key={warehouse.id}
                    variants={staggerItem}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="p-6 bg-gradient-to-r from-white to-slate-50 rounded-2xl border-2 border-slate-200 hover:border-blue-300 transition-all shadow-lg"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`p-4 rounded-2xl shadow-lg ${
                            warehouse.status === "Active" ? "bg-gradient-to-br from-emerald-500 to-teal-600" :
                            warehouse.status === "Maintenance" ? "bg-gradient-to-br from-yellow-500 to-orange-600" :
                            "bg-gradient-to-br from-red-500 to-pink-600"
                          }`}
                        >
                          <Box size={32} className="text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">{warehouse.name}</h3>
                          <p className="text-sm text-slate-600 font-medium flex items-center gap-1 mt-1">
                            <MapPin size={14} />
                            {warehouse.location}
                          </p>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                            warehouse.status === "Active" ? "bg-green-100 text-green-700" :
                            warehouse.status === "Maintenance" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {warehouse.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full lg:w-auto">
                        <div className="text-center">
                          <p className="text-xs text-slate-600 font-semibold mb-1">Capacity</p>
                          <p className="text-2xl font-bold text-slate-900">{warehouse.capacity} kg</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-600 font-semibold mb-1">Occupied</p>
                          <p className="text-2xl font-bold text-blue-600">{warehouse.occupied} kg</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-600 font-semibold mb-1">Items</p>
                          <p className="text-2xl font-bold text-emerald-600">{warehouse.items}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-600 font-semibold mb-1">Available</p>
                          <p className="text-2xl font-bold text-purple-600">{warehouse.capacity - warehouse.occupied} kg</p>
                        </div>
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span className="font-semibold">Storage Utilization</span>
                        <span className="font-bold">{((warehouse.occupied / warehouse.capacity) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(warehouse.occupied / warehouse.capacity) * 100}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`h-full ${
                            (warehouse.occupied / warehouse.capacity) > 0.9 ? "bg-gradient-to-r from-red-500 to-pink-600" :
                            (warehouse.occupied / warehouse.capacity) > 0.7 ? "bg-gradient-to-r from-yellow-500 to-orange-600" :
                            "bg-gradient-to-r from-emerald-500 to-teal-600"
                          } shadow-lg`}
                        />
                      </div>
                    </div>

                    {/* Environmental Conditions */}
                    {warehouse.temperature !== undefined && (
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <ThermometerSun size={24} className="text-blue-600" />
                          <div>
                            <p className="text-xs text-slate-600 font-semibold">Temperature</p>
                            <p className="text-xl font-bold text-slate-900">{warehouse.temperature}°C</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                          <Droplets size={24} className="text-cyan-600" />
                          <div>
                            <p className="text-xs text-slate-600 font-semibold">Humidity</p>
                            <p className="text-xl font-bold text-slate-900">{warehouse.humidity}%</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-lg">
                  <BarChart2 size={28} className="text-white" />
                </div>
                Inventory Analytics
              </h2>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total SKUs", value: inventoryItems.length, change: "+3", icon: Package, color: "from-blue-500 to-indigo-600" },
                  { label: "Avg. Stock Value", value: `₹${(totalInventoryValue / inventoryItems.length).toFixed(0)}`, change: "+8%", icon: DollarSign, color: "from-emerald-500 to-teal-600" },
                  { label: "Turnover Rate", value: "3.2x", change: "+0.4", icon: TrendingUp, color: "from-purple-500 to-fuchsia-600" },
                ].map((metric, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-br ${metric.color} rounded-xl shadow-md`}>
                        <metric.icon size={24} className="text-white" />
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        {metric.change}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-semibold mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Category Breakdown */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <PieChart size={20} className="text-emerald-600" />
                  Category Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Grains", "Vegetables", "Spices"].map((category, idx) => {
                    const categoryItems = inventoryItems.filter(item => item.category === category);
                    const categoryValue = categoryItems.reduce((sum, item) => sum + item.value, 0);
                    const percentage = (categoryValue / totalInventoryValue) * 100;
                    
                    return (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-emerald-300 transition-all"
                      >
                        <h4 className="font-bold text-slate-900 mb-3">{category}</h4>
                        <p className="text-3xl font-bold text-emerald-600 mb-2">₹{(categoryValue / 1000).toFixed(1)}K</p>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
                          />
                        </div>
                        <p className="text-sm text-slate-600 font-medium">{percentage.toFixed(1)}% of total • {categoryItems.length} items</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Star size={20} className="text-yellow-500" />
                  Top Value Items
                </h3>
                <div className="space-y-3">
                  {inventoryItems
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5)
                    .map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-600">{item.quantity} {item.unit} • {item.category}</p>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">₹{item.value.toLocaleString()}</p>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* QUALITY CONTROL TAB */}
          {activeTab === "quality" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <CheckCircle size={28} className="text-white" />
                </div>
                Quality Control Center
              </h2>

              {/* Quality Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Quality Score", value: "96%", icon: Star, color: "from-yellow-500 to-orange-600" },
                  { label: "Inspections Today", value: "24", icon: Eye, color: "from-blue-500 to-indigo-600" },
                  { label: "Passed", value: "22", icon: CheckCircle, color: "from-emerald-500 to-teal-600" },
                  { label: "Flagged", value: "2", icon: AlertCircle, color: "from-red-500 to-pink-600" },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 shadow-lg"
                  >
                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-md w-fit mb-4`}>
                      <stat.icon size={24} className="text-white" />
                    </div>
                    <p className="text-sm text-slate-600 font-semibold mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quality Alerts */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Active Quality Alerts</h3>
                <div className="space-y-4">
                  {qualityAlerts.map((alert, idx) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-5 rounded-xl border-2 ${
                        alert.severity === "high" ? "bg-red-50 border-red-200" :
                        alert.severity === "medium" ? "bg-yellow-50 border-yellow-200" :
                        "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${
                            alert.severity === "high" ? "bg-red-500" :
                            alert.severity === "medium" ? "bg-yellow-500" :
                            "bg-blue-500"
                          }`}>
                            <AlertCircle size={24} className="text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-slate-900 text-lg">{alert.item}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                alert.severity === "high" ? "bg-red-200 text-red-800" :
                                alert.severity === "medium" ? "bg-yellow-200 text-yellow-800" :
                                "bg-blue-200 text-blue-800"
                              }`}>
                                {alert.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-slate-700 font-medium mb-2">{alert.issue}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {alert.warehouse}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {alert.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-white border-2 border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                        >
                          Resolve
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quality Checklist */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Quality Standards Checklist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { check: "Visual Inspection", status: "Passed", items: 24 },
                    { check: "Weight Verification", status: "Passed", items: 24 },
                    { check: "Moisture Content", status: "Warning", items: 22 },
                    { check: "Pest Detection", status: "Passed", items: 24 },
                    { check: "Grade Classification", status: "Passed", items: 23 },
                    { check: "Packaging Quality", status: "Passed", items: 24 },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.status === "Passed" ? "bg-green-100" : "bg-yellow-100"
                        }`}>
                          {item.status === "Passed" ? 
                            <CheckCircle size={20} className="text-green-600" /> :
                            <AlertCircle size={20} className="text-yellow-600" />
                          }
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.check}</p>
                          <p className="text-xs text-slate-600">{item.items} items checked</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === "Passed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {item.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SMART ALERTS TAB */}
          {activeTab === "alerts" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                  <AlertCircle size={28} className="text-white" />
                </div>
                Smart Alert System
              </h2>

              {/* Alert Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Critical Alerts", value: "3", color: "from-red-500 to-pink-600", bgColor: "from-red-50 to-pink-50" },
                  { label: "Warnings", value: "7", color: "from-yellow-500 to-orange-600", bgColor: "from-yellow-50 to-orange-50" },
                  { label: "Info", value: "12", color: "from-blue-500 to-indigo-600", bgColor: "from-blue-50 to-indigo-50" },
                ].map((alert, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`p-6 bg-gradient-to-br ${alert.bgColor} rounded-2xl border-2 border-white shadow-lg`}
                  >
                    <div className={`p-3 bg-gradient-to-br ${alert.color} rounded-xl shadow-md w-fit mb-4`}>
                      <AlertCircle size={24} className="text-white" />
                    </div>
                    <p className="text-sm text-slate-600 font-semibold mb-1">{alert.label}</p>
                    <p className="text-4xl font-bold text-slate-900">{alert.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Package size={20} className="text-orange-600" />
                  Low Stock Alerts
                </h3>
                <div className="space-y-3">
                  {inventoryItems
                    .filter(item => item.status === "Low Stock" || item.status === "Out of Stock")
                    .map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-5 rounded-xl border-2 ${
                          item.status === "Out of Stock" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${
                              item.status === "Out of Stock" ? "bg-red-500" : "bg-yellow-500"
                            }`}>
                              <Package size={24} className="text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">{item.name}</h4>
                              <p className="text-slate-700 font-medium">
                                Current: {item.quantity} {item.unit} • Min Required: {item.minStock} {item.unit}
                              </p>
                              <p className="text-sm text-slate-600 mt-1">
                                Recommended restock: {(item.minStock || 0) * 2} {item.unit}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                          >
                            Reorder
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>

              {/* Price Alerts */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-emerald-600" />
                  Price Movement Alerts
                </h3>
                <div className="space-y-3">
                  {priceIndex
                    .filter(item => Math.abs(item.change) > 5)
                    .map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-5 rounded-xl border-2 ${
                          item.change > 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${
                              item.change > 0 ? "bg-green-500" : "bg-red-500"
                            }`}>
                              {item.change > 0 ? 
                                <ArrowUpRight size={24} className="text-white" /> :
                                <ArrowDownRight size={24} className="text-white" />
                              }
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">{item.crop}</h4>
                              <p className="text-slate-700 font-medium">
                                {item.change > 0 ? "Price increased" : "Price decreased"} by {Math.abs(item.change).toFixed(1)}%
                              </p>
                              <p className="text-sm text-slate-600 mt-1">
                                Current: ₹{item.currentPrice} • Previous: ₹{item.previousPrice}
                              </p>
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-xl text-lg font-bold ${
                            item.change > 0 ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                          }`}>
                            {item.change > 0 ? "+" : ""}{item.change.toFixed(1)}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ACTIVITY LOG TAB */}
          {activeTab === "activity" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Clock size={28} className="text-white" />
                </div>
                Activity Log
              </h2>

              <div className="space-y-3">
                {activityLogs.map((log, idx) => (
                  <motion.div
                    key={log.id}
                    variants={staggerItem}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="p-5 bg-gradient-to-r from-white to-slate-50 rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl shadow-md ${
                          log.type === "add" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
                          log.type === "remove" ? "bg-gradient-to-br from-red-500 to-pink-600" :
                          log.type === "update" ? "bg-gradient-to-br from-blue-500 to-indigo-600" :
                          "bg-gradient-to-br from-purple-500 to-fuchsia-600"
                        }`}>
                          {log.type === "add" ? <Plus size={20} className="text-white" /> :
                           log.type === "remove" ? <Minus size={20} className="text-white" /> :
                           log.type === "update" ? <Edit size={20} className="text-white" /> :
                           <Truck size={20} className="text-white" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{log.action} {log.item}</p>
                          <p className="text-sm text-slate-600 font-medium mt-1">
                            Quantity: {log.quantity} kg • By: {log.user}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                          log.type === "add" ? "bg-green-100 text-green-700" :
                          log.type === "remove" ? "bg-red-100 text-red-700" :
                          log.type === "update" ? "bg-blue-100 text-blue-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>
                          {log.type.toUpperCase()}
                        </span>
                        <p className="text-sm text-slate-600 mt-2 flex items-center gap-1 justify-end">
                          <Clock size={14} />
                          {log.timestamp}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI OPTIMIZE TAB */}
          {activeTab === "ai" && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-600 rounded-lg">
                  <Sparkles size={28} className="text-white" />
                </div>
                AI-Powered Optimization
              </h2>

              {/* AI Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Potential Savings", value: "₹10.2K", icon: DollarSign, color: "from-emerald-500 to-teal-600" },
                  { label: "Recommendations", value: aiRecommendations.length.toString(), icon: Target, color: "from-blue-500 to-indigo-600" },
                  { label: "Efficiency Score", value: "87%", icon: Zap, color: "from-purple-500 to-fuchsia-600" },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 shadow-lg"
                  >
                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-md w-fit mb-4`}>
                      <stat.icon size={24} className="text-white" />
                    </div>
                    <p className="text-sm text-slate-600 font-semibold mb-1">{stat.label}</p>
                    <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* AI Recommendations */}
              <div className="space-y-4">
                {aiRecommendations.map((rec, idx) => (
                  <motion.div
                    key={rec.id}
                    variants={staggerItem}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className={`p-6 rounded-2xl border-2 shadow-lg ${
                      rec.priority === "high" ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-200" :
                      rec.priority === "medium" ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" :
                      "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-4 rounded-2xl shadow-lg ${
                          rec.priority === "high" ? "bg-gradient-to-br from-red-500 to-pink-600" :
                          rec.priority === "medium" ? "bg-gradient-to-br from-yellow-500 to-orange-600" :
                          "bg-gradient-to-br from-blue-500 to-indigo-600"
                        }`}>
                          <Sparkles size={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900">{rec.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              rec.priority === "high" ? "bg-red-200 text-red-800" :
                              rec.priority === "medium" ? "bg-yellow-200 text-yellow-800" :
                              "bg-blue-200 text-blue-800"
                            }`}>
                              {rec.priority.toUpperCase()} PRIORITY
                            </span>
                          </div>
                          <p className="text-slate-700 font-medium mb-3">{rec.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
                              <DollarSign size={16} className="text-emerald-600" />
                              <span className="font-bold text-emerald-600">{rec.savings}</span>
                              <span className="text-sm text-slate-600">potential savings</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                      >
                        {rec.action || "Apply"}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-purple-600" />
                  AI Insights
                </h3>
                <div className="space-y-3">
                  {[
                    "Your inventory turnover is 15% faster than industry average",
                    "Wheat and Rice show strong correlation in demand patterns",
                    "Consider bundling Turmeric with Ginger for 20% higher margins",
                    "Warehouse WH-B is operating at optimal capacity (74%)",
                  ].map((insight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-purple-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                      <p className="text-slate-700 font-medium">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SmartInventoryHub;