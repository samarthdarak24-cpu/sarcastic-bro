"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Search, Filter, ArrowUpRight, Clock, MapPin, 
  Building2, CheckCircle2, AlertCircle, Calendar, Plus,
  Loader2, ChevronRight, Target, Activity, ShieldCheck,
  Globe, Briefcase, Gavel, ArrowRight, IndianRupee, Layers,
  TrendingUp, Award, Users, BarChart3, Zap, Bell, Settings,
  Download, Send, Eye, MoreVertical, RefreshCw, DollarSign,
  Package, Truck, Star, MessageSquare, History, PieChart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTenderNotifications } from "@/hooks/useSocket";
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import api from "@/services/api";
import toast from "react-hot-toast";

export function TenderParticipation() {
  const [activeTab, setActiveTab] = useState("overview");
  const [tenders, setTenders] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTender, setSelectedTender] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [bidForm, setBidForm] = useState({
      priceOffer: 0,
      message: ""
  });
  const [stats, setStats] = useState({
    totalTenders: 0,
    activeBids: 0,
    wonTenders: 0,
    totalValue: 0
  });

  // Enhanced mock data
  const mockTenders = [
    {
      id: '1',
      title: 'NAFED National Pulse Procurement 2024',
      description: 'Large-scale procurement of premium quality pulses',
      category: 'Pulses',
      quantity: 5000,
      unit: 'Tons',
      budget: 425000000,
      maxPrice: 85,
      deadline: '2024-04-15T23:59:59',
      status: 'OPEN',
      creator: { name: 'NAFED India' },
      district: 'Delhi',
      applications: 24,
      daysLeft: 10,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'
    },
    {
      id: '2',
      title: 'Global Spices Export - Varanasi Hub',
      description: 'Premium spices bulk export opportunity',
      category: 'Spices',
      quantity: 1200,
      unit: 'Tons',
      budget: 504000000,
      maxPrice: 420,
      deadline: '2024-04-20T23:59:59',
      status: 'OPEN',
      creator: { name: 'Spices Board' },
      district: 'Varanasi',
      applications: 18,
      daysLeft: 15,
      image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400'
    }
  ];

  const mockMyBids = [
    {
      id: 'b1',
      tenderId: '1',
      proposedPrice: 82,
      message: 'Premium quality assured',
      status: 'PENDING',
      createdAt: '2024-04-03T10:00:00',
      tender: mockTenders[0]
    },
    {
      id: 'b2',
      tenderId: '2',
      proposedPrice: 410,
      message: 'Export-grade spices',
      status: 'ACCEPTED',
      createdAt: '2024-04-02T14:30:00',
      tender: mockTenders[1]
    }
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    calculateStats();
  }, [tenders, myBids]);

  useTenderNotifications((data) => {
    if (data.type === 'new_tender') {
      setTenders(prev => [data.tender, ...prev]);
      toast.success('New tender available!');
    }
  });

  const calculateStats = () => {
    const wonBids = myBids.filter(b => b.status === 'ACCEPTED');
    const totalValue = wonBids.reduce((sum, bid) => sum + (bid.proposedPrice * bid.tender?.quantity || 0), 0);
    
    setStats({
      totalTenders: tenders.length || mockTenders.length,
      activeBids: myBids.filter(b => b.status === 'PENDING').length || 1,
      wonTenders: wonBids.length || 1,
      totalValue: totalValue || 492000000
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
        const { tenderService } = await import("@/services/tenderService");
        const [tendersData, bidsData] = await Promise.all([
          tenderService.getOpenTenders().catch(() => []),
          tenderService.getMyApplications().catch(() => [])
        ]);
        
        setTenders(tendersData.length > 0 ? tendersData : mockTenders);
        setMyBids(bidsData.length > 0 ? bidsData : mockMyBids);
    } catch (error) {
        setTenders(mockTenders);
        setMyBids(mockMyBids);
    } finally {
        setTimeout(() => setLoading(false), 600);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
      toast.success('Data refreshed');
    } catch (error) {
      toast.error('Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const handleBidSubmit = async () => {
    if (!selectedTender || bidForm.priceOffer <= 0) {
      return toast.error("Please enter a valid price");
    }
    
    try {
        const { tenderService } = await import("@/services/tenderService");
        await tenderService.applyToTender(selectedTender.id, {
            proposedPrice: bidForm.priceOffer,
            message: bidForm.message
        });
        toast.success("Bid submitted successfully!");
        setSelectedTender(null);
        fetchData();
        setBidForm({ priceOffer: 0, message: "" });
    } catch (error: any) {
        toast.error("Failed to submit bid");
    }
  };

  // Chart data for Analytics
  const bidTrendData = [
    { month: 'Jan', bids: 12, won: 8, value: 45000000, lost: 4 },
    { month: 'Feb', bids: 15, won: 10, value: 62000000, lost: 5 },
    { month: 'Mar', bids: 18, won: 12, value: 78000000, lost: 6 },
    { month: 'Apr', bids: 14, won: 9, value: 54000000, lost: 5 },
    { month: 'May', bids: 20, won: 14, value: 92000000, lost: 6 },
    { month: 'Jun', bids: 22, won: 16, value: 105000000, lost: 6 }
  ];

  const categoryDistribution = [
    { name: 'Grains', value: 35, color: '#10b981' },
    { name: 'Pulses', value: 25, color: '#3b82f6' },
    { name: 'Spices', value: 20, color: '#f59e0b' },
    { name: 'Vegetables', value: 15, color: '#8b5cf6' },
    { name: 'Others', value: 5, color: '#6b7280' }
  ];

  const performanceRadarData = [
    { metric: 'Win Rate', value: 72 },
    { metric: 'Response Time', value: 85 },
    { metric: 'Bid Quality', value: 92 },
    { metric: 'Compliance', value: 95 },
    { metric: 'Delivery', value: 88 }
  ];

  const upcomingDeadlines = [
    { 
      tender: 'NAFED Pulse Procurement', 
      deadline: '2024-04-15T23:59:59', 
      hoursLeft: 240, 
      priority: 'high',
      value: 425000000,
      category: 'Pulses'
    },
    { 
      tender: 'Karnataka Grain Reserve', 
      deadline: '2024-04-12T23:59:59', 
      hoursLeft: 168, 
      priority: 'urgent',
      value: 480000000,
      category: 'Grains'
    },
    { 
      tender: 'Maharashtra Organic Initiative', 
      deadline: '2024-04-18T23:59:59', 
      hoursLeft: 312, 
      priority: 'medium',
      value: 64000000,
      category: 'Vegetables'
    },
    { 
      tender: 'Tamil Nadu Rice Scheme', 
      deadline: '2024-04-25T23:59:59', 
      hoursLeft: 480, 
      priority: 'low',
      value: 320000000,
      category: 'Rice'
    }
  ];

  const documents = [
    { name: 'Business Registration Certificate', type: 'PDF', size: '2.4 MB', uploaded: '2024-03-15', status: 'verified' },
    { name: 'FSSAI License', type: 'PDF', size: '1.8 MB', uploaded: '2024-03-10', status: 'verified' },
    { name: 'Organic Certification', type: 'PDF', size: '3.2 MB', uploaded: '2024-03-05', status: 'verified' },
    { name: 'Tax Registration', type: 'PDF', size: '1.5 MB', uploaded: '2024-02-28', status: 'pending' },
    { name: 'Bank Details', type: 'PDF', size: '0.8 MB', uploaded: '2024-02-20', status: 'verified' }
  ];

  const communications = [
    {
      tender: 'NAFED Pulse Procurement',
      issuer: 'NAFED India',
      lastMessage: 'Please confirm delivery timeline',
      time: '2 hours ago',
      unread: true,
      avatar: 'N'
    },
    {
      tender: 'Spices Export',
      issuer: 'Spices Board',
      lastMessage: 'Your bid has been shortlisted',
      time: '5 hours ago',
      unread: true,
      avatar: 'S'
    },
    {
      tender: 'Karnataka Grain Reserve',
      issuer: 'FCI Karnataka',
      lastMessage: 'Quality certificate required',
      time: '1 day ago',
      unread: false,
      avatar: 'F'
    }
  ];

  const historyData = [
    { date: '2024-04-03', tender: 'NAFED Pulse Procurement', action: 'Bid Submitted', status: 'PENDING', value: 410000000 },
    { date: '2024-04-02', tender: 'Spices Export', action: 'Bid Accepted', status: 'ACCEPTED', value: 492000000 },
    { date: '2024-04-01', tender: 'Karnataka Grain', action: 'Bid Submitted', status: 'PENDING', value: 465000000 },
    { date: '2024-03-30', tender: 'Maharashtra Organic', action: 'Bid Rejected', status: 'REJECTED', value: 64000000 },
    { date: '2024-03-28', tender: 'Tamil Nadu Rice', action: 'Bid Submitted', status: 'PENDING', value: 320000000 },
    { date: '2024-03-25', tender: 'Gujarat Cotton', action: 'Tender Viewed', status: 'VIEWED', value: 450000000 }
  ];

  const tabs = [
    { id: 'overview', label: 'Tender Overview', icon: BarChart3 },
    { id: 'marketplace', label: 'Marketplace', icon: Globe },
    { id: 'mybids', label: 'My Bids', icon: FileText },
    { id: 'won', label: 'Won Tenders', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'deadlines', label: 'Deadlines', icon: Clock },
    { id: 'performance', label: 'Performance', icon: Target },
    { id: 'documents', label: 'Documents', icon: Layers },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'history', label: 'History', icon: History }
  ];

  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || tender.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto">
        {/* Ultra-Compact Navbar Header */}
        <div className="navbar-header">
          <h2 className="title">Tenders</h2>
          
          <div className="status-badges">
            <div className="badge open">
              <FileText size={14} />
              <span>{stats.totalTenders}</span>
            </div>
            
            <div className="badge active">
              <Activity size={14} />
              <span>{stats.activeBids}</span>
            </div>
            
            <div className="badge won">
              <Award size={14} />
              <span>{stats.wonTenders}</span>
            </div>
            
            <div className="badge value">
              <DollarSign size={14} />
              <span>{(stats.totalValue / 1000000).toFixed(1)}M</span>
            </div>
          </div>

          <button 
            className="refresh-icon" 
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh"
          >
            <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
          </button>
        </div>

        {/* Navigation */}
        <div className="w-full bg-white p-4 border-b border-slate-200">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-200 min-h-[600px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-20 w-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-2xl font-black text-slate-900">Loading Tenders...</p>
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Active Tenders', value: stats.totalTenders, icon: Globe, gradient: 'from-blue-500 to-cyan-500' },
                      { label: 'My Bids', value: stats.activeBids, icon: FileText, gradient: 'from-purple-500 to-pink-500' },
                      { label: 'Won Tenders', value: stats.wonTenders, icon: Award, gradient: 'from-green-500 to-emerald-500' },
                      { label: 'Total Value', value: `₹${(stats.totalValue / 10000000).toFixed(1)}Cr`, icon: DollarSign, gradient: 'from-amber-500 to-orange-500' }
                    ].map((kpi, i) => (
                      <Card key={i} className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                        <div className={`h-14 w-14 bg-gradient-to-br ${kpi.gradient} rounded-xl flex items-center justify-center text-white mb-4`}>
                          <kpi.icon size={28} />
                        </div>
                        <p className="text-4xl font-black text-slate-900 mb-2">{kpi.value}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">{kpi.label}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'marketplace' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <Input
                        placeholder="Search tenders..."
                        className="h-14 pl-12 rounded-2xl bg-white border-2 border-slate-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTenders.map((tender, i) => (
                      <Card key={tender.id} className="p-6 border-none shadow-lg bg-white rounded-[3rem] hover:shadow-2xl transition-all">
                        {tender.image && (
                          <div className="relative h-40 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-[3rem]">
                            <img src={tender.image} alt={tender.title} className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4">
                              <Badge tone="brand">{tender.category}</Badge>
                            </div>
                          </div>
                        )}
                        
                        <h3 className="text-lg font-black text-slate-900 mb-2 line-clamp-2">{tender.title}</h3>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{tender.description}</p>

                        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl mb-4">
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">Quantity</p>
                            <p className="text-lg font-black text-slate-900">{tender.quantity} {tender.unit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold mb-1">Budget</p>
                            <p className="text-lg font-black text-slate-900">₹{(tender.budget / 10000000).toFixed(1)}Cr</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold">
                            <Eye size={16} className="mr-2" />
                            View
                          </Button>
                          <Button 
                            onClick={() => setSelectedTender(tender)}
                            className="flex-1 h-12 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                          >
                            <Send size={16} className="mr-2" />
                            Bid
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'mybids' && (
                <div className="space-y-4">
                  {myBids.map((bid) => (
                    <Card key={bid.id} className="p-8 border-none shadow-lg bg-white rounded-[3rem]">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2">{bid.tender.title}</h3>
                          <p className="text-sm text-slate-600">Bid: ₹{bid.proposedPrice}/{bid.tender.unit}</p>
                        </div>
                        <Badge tone={bid.status === 'ACCEPTED' ? 'brand' : 'ink'}>{bid.status}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'won' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myBids.filter(b => b.status === 'ACCEPTED').map((bid) => (
                    <Card key={bid.id} className="p-8 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem]">
                      <Award size={48} className="text-green-600 mb-4" />
                      <h3 className="text-2xl font-black text-slate-900 mb-4">{bid.tender.title}</h3>
                      <p className="text-lg font-black text-green-600">₹{((bid.proposedPrice * bid.tender.quantity) / 10000000).toFixed(2)}Cr</p>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                      <h3 className="text-xl font-black text-slate-900 mb-6">Bid Performance Trends</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={bidTrendData}>
                          <defs>
                            <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                          <YAxis stroke="#94a3b8" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                          <Area type="monotone" dataKey="won" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#bidGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Card>

                    <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                      <h3 className="text-xl font-black text-slate-900 mb-6">Category Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPie>
                          <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                            {categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                      <h3 className="text-xl font-black text-slate-900 mb-6">Monthly Bid Value</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={bidTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip />
                          <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>

                    <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                      <h3 className="text-xl font-black text-slate-900 mb-6">Win vs Loss Ratio</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={bidTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip />
                          <Bar dataKey="won" fill="#10b981" radius={[10, 10, 0, 0]} />
                          <Bar dataKey="lost" fill="#ef4444" radius={[10, 10, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'deadlines' && (
                <div className="space-y-6">
                  {upcomingDeadlines.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className={`p-8 border-none shadow-lg rounded-[3rem] ${
                        item.priority === 'urgent' ? 'bg-gradient-to-r from-red-50 to-orange-50' :
                        item.priority === 'high' ? 'bg-gradient-to-r from-amber-50 to-yellow-50' :
                        item.priority === 'medium' ? 'bg-gradient-to-r from-blue-50 to-cyan-50' :
                        'bg-gradient-to-r from-slate-50 to-gray-50'
                      }`}>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-2xl font-black text-slate-900">{item.tender}</h3>
                              <Badge tone={item.priority === 'urgent' ? 'amber' : item.priority === 'high' ? 'amber' : 'brand'}>
                                {item.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                              <span className="flex items-center gap-2">
                                <Calendar size={16} />
                                {new Date(item.deadline).toLocaleDateString()}
                              </span>
                              <span className="h-1 w-1 bg-slate-300 rounded-full" />
                              <span className="flex items-center gap-2">
                                <Package size={16} />
                                {item.category}
                              </span>
                              <span className="h-1 w-1 bg-slate-300 rounded-full" />
                              <span>₹{(item.value / 10000000).toFixed(1)}Cr</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-5xl font-black text-slate-900 mb-2">{item.hoursLeft}h</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Remaining</p>
                            <div className="mt-4 h-2 w-48 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${item.priority === 'urgent' ? 'bg-red-500' : item.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.max(10, 100 - (item.hoursLeft / 10))}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Win Rate', value: '72%', change: '+8%', trend: 'up', icon: TrendingUp, color: 'green' },
                      { label: 'Avg Response Time', value: '2.4h', change: '-0.8h', trend: 'up', icon: Clock, color: 'blue' },
                      { label: 'Bid Quality Score', value: '92/100', change: '+5', trend: 'up', icon: Star, color: 'amber' },
                      { label: 'Compliance Rate', value: '95%', change: '+3%', trend: 'up', icon: ShieldCheck, color: 'purple' }
                    ].map((metric, i) => (
                      <Card key={i} className="p-6 border-none shadow-lg bg-white rounded-[2rem] hover:shadow-xl transition-all">
                        <div className={`h-12 w-12 bg-${metric.color}-100 rounded-xl flex items-center justify-center text-${metric.color}-600 mb-4`}>
                          <metric.icon size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{metric.label}</p>
                        <p className="text-4xl font-black text-slate-900 mb-3">{metric.value}</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} className="text-green-600" />
                          <span className="text-sm font-bold text-green-600">{metric.change}</span>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Card className="p-8 border-none shadow-lg bg-white rounded-[2.5rem]">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Performance Radar</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={performanceRadarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="metric" stroke="#64748b" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <PolarRadiusAxis stroke="#94a3b8" />
                        <Radar name="Performance" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-slate-900">Document Management</h3>
                    <Button className="h-12 px-6 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <Plus size={20} className="mr-2" />
                      Upload Document
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {documents.map((doc, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem] hover:shadow-xl transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                <FileText size={24} />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-black text-slate-900 mb-1">{doc.name}</h4>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                                  <span>{doc.type}</span>
                                  <span className="h-1 w-1 bg-slate-200 rounded-full" />
                                  <span>{doc.size}</span>
                                  <span className="h-1 w-1 bg-slate-200 rounded-full" />
                                  <span>Uploaded: {doc.uploaded}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge tone={doc.status === 'verified' ? 'brand' : 'amber'}>
                                {doc.status === 'verified' ? <CheckCircle2 size={14} className="mr-1" /> : <Clock size={14} className="mr-1" />}
                                {doc.status.toUpperCase()}
                              </Badge>
                              <Button variant="outline" className="h-10 w-10 p-0 rounded-xl">
                                <Download size={16} />
                              </Button>
                              <Button variant="outline" className="h-10 w-10 p-0 rounded-xl">
                                <Eye size={16} />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'communication' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-slate-900">Communication Hub</h3>
                    <Button className="h-12 px-6 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                      <MessageSquare size={20} className="mr-2" />
                      New Message
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {communications.map((comm, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className={`p-6 border-none shadow-lg rounded-[2rem] cursor-pointer transition-all ${
                          comm.unread 
                            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 hover:shadow-xl' 
                            : 'bg-white hover:shadow-md'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black text-xl shrink-0">
                                {comm.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-lg font-black text-slate-900">{comm.issuer}</h4>
                                  {comm.unread && (
                                    <Badge tone="brand" className="text-[9px]">NEW</Badge>
                                  )}
                                </div>
                                <p className="text-sm font-bold text-slate-600 mb-2">{comm.tender}</p>
                                <p className="text-slate-900 font-medium">{comm.lastMessage}</p>
                                <p className="text-xs text-slate-400 font-bold mt-2">{comm.time}</p>
                              </div>
                            </div>
                            <Button variant="outline" className="h-10 px-4 rounded-xl font-bold">
                              <ChevronRight size={16} />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-slate-900 mb-6">Complete Tender History</h3>
                  <div className="space-y-3">
                    {historyData.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem] hover:shadow-xl transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                                <Calendar size={20} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-lg font-black text-slate-900">{item.tender}</h4>
                                  <Badge tone={
                                    item.status === 'ACCEPTED' ? 'brand' : 
                                    item.status === 'REJECTED' ? 'amber' : 
                                    'ink'
                                  }>
                                    {item.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                                  <span>{item.date}</span>
                                  <span className="h-1 w-1 bg-slate-200 rounded-full" />
                                  <span>{item.action}</span>
                                  <span className="h-1 w-1 bg-slate-200 rounded-full" />
                                  <span>₹{(item.value / 10000000).toFixed(2)}Cr</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" className="h-10 px-4 rounded-xl font-bold">
                              <Eye size={16} className="mr-2" />
                              View
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Bid Modal */}
        <AnimatePresence>
          {selectedTender && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setSelectedTender(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl"
              >
                <h2 className="text-3xl font-black text-slate-900 mb-6">{selectedTender.title}</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Your Bid Price</label>
                    <Input
                      type="number"
                      placeholder="Enter bid amount..."
                      className="h-16 rounded-2xl font-black text-2xl"
                      value={bidForm.priceOffer || ''}
                      onChange={(e) => setBidForm({ ...bidForm, priceOffer: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Message</label>
                    <textarea
                      placeholder="Additional information..."
                      className="w-full h-32 p-5 rounded-2xl bg-slate-50 border-2 border-slate-200"
                      value={bidForm.message}
                      onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setSelectedTender(null)}
                      variant="outline"
                      className="flex-1 h-14 rounded-2xl font-black"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleBidSubmit}
                      className="flex-1 h-14 rounded-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    >
                      Submit Bid
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .navbar-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          height: 48px;
        }

        .title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          line-height: 1;
        }

        .status-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 4px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
        }

        .badge span {
          min-width: 16px;
          text-align: center;
        }

        .badge.open {
          background: #d1fae5;
          color: #065f46;
        }

        .badge.active {
          background: #dbeafe;
          color: #1e40af;
        }

        .badge.active :global(svg) {
          animation: pulse 2s ease-in-out infinite;
        }

        .badge.won {
          background: #fef3c7;
          color: #92400e;
        }

        .badge.value {
          background: #f3e8ff;
          color: #6b21a8;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .refresh-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-left: auto;
          padding: 0;
        }

        .refresh-icon:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .refresh-icon:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .refresh-icon :global(svg) {
          color: #6b7280;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default TenderParticipation;
