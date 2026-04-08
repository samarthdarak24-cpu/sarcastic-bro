'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Clock, CheckCircle, XCircle, TrendingUp,
  Search, Filter, Download, RefreshCw, Plus, Send,
  DollarSign, Users, Calendar, Award, AlertCircle,
  Target, Briefcase, MapPin, Phone, Mail, Building, Package
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Tender {
  id: string;
  tenderNumber: string;
  title: string;
  buyer: string;
  buyerCompany: string;
  buyerEmail: string;
  buyerPhone: string;
  product: string;
  quantity: number;
  unit: string;
  budget: number;
  minBudget: number;
  maxBudget: number;
  deadline: string;
  status: 'open' | 'closing_soon' | 'closed' | 'awarded';
  bidsCount: number;
  matchScore: number;
  location: string;
  description: string;
  requirements: string[];
  postedDate: string;
  category: string;
}

interface Bid {
  id: string;
  bidNumber: string;
  tenderId: string;
  tenderTitle: string;
  amount: number;
  proposedQuantity: number;
  deliveryTime: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: string;
  winProbability: number;
  notes: string;
  validUntil: string;
}

export default function TenderBidsHub() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'mybids' | 'won'>('marketplace');
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [filteredBids, setFilteredBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'budget' | 'match'>('deadline');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [tenders, myBids, searchQuery, statusFilter, sortBy, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockTenders: Tender[] = [
        {
          id: '1',
          tenderNumber: 'TND-2024-001',
          title: 'Bulk Wheat Purchase for Export',
          buyer: 'Rajesh Kumar',
          buyerCompany: 'ABC Traders Ltd',
          buyerEmail: 'rajesh@abctraders.com',
          buyerPhone: '+91 98765 43210',
          product: 'Organic Wheat',
          quantity: 5000,
          unit: 'kg',
          budget: 250000,
          minBudget: 240000,
          maxBudget: 260000,
          deadline: '2024-04-15',
          status: 'open',
          bidsCount: 12,
          matchScore: 95,
          location: 'Mumbai, Maharashtra',
          description: 'Looking for high-quality organic wheat for international export. Must meet export standards.',
          requirements: ['Organic certification', 'Moisture content < 12%', 'No pesticide residue', 'Export quality packaging'],
          postedDate: '2024-04-01',
          category: 'Grains'
        },
        {
          id: '2',
          tenderNumber: 'TND-2024-002',
          title: 'Premium Basmati Rice Supply',
          buyer: 'Priya Sharma',
          buyerCompany: 'XYZ Corporation',
          buyerEmail: 'priya@xyzcorp.com',
          buyerPhone: '+91 98765 43211',
          product: 'Basmati Rice',
          quantity: 3000,
          unit: 'kg',
          budget: 180000,
          minBudget: 170000,
          maxBudget: 190000,
          deadline: '2024-04-12',
          status: 'closing_soon',
          bidsCount: 8,
          matchScore: 88,
          location: 'Delhi, NCR',
          description: 'Premium quality basmati rice needed for retail distribution across North India.',
          requirements: ['Aged rice (min 1 year)', 'Long grain', 'Aromatic', 'Certified quality'],
          postedDate: '2024-03-28',
          category: 'Rice'
        },
        {
          id: '3',
          tenderNumber: 'TND-2024-003',
          title: 'Yellow Corn Supply Contract',
          buyer: 'Amit Patel',
          buyerCompany: 'PQR Exports',
          buyerEmail: 'amit@pqrexports.com',
          buyerPhone: '+91 98765 43212',
          product: 'Yellow Corn',
          quantity: 4000,
          unit: 'kg',
          budget: 120000,
          minBudget: 115000,
          maxBudget: 125000,
          deadline: '2024-04-10',
          status: 'open',
          bidsCount: 15,
          matchScore: 72,
          location: 'Pune, Maharashtra',
          description: 'Quality yellow corn needed for animal feed production.',
          requirements: ['Moisture < 14%', 'Clean grain', 'No fungal infection', 'Bulk packaging'],
          postedDate: '2024-03-25',
          category: 'Grains'
        },
        {
          id: '4',
          tenderNumber: 'TND-2024-004',
          title: 'Organic Soybean Purchase',
          buyer: 'Sunita Reddy',
          buyerCompany: 'LMN Organic Foods',
          buyerEmail: 'sunita@lmnorganic.com',
          buyerPhone: '+91 98765 43213',
          product: 'Soybeans',
          quantity: 2500,
          unit: 'kg',
          budget: 150000,
          minBudget: 145000,
          maxBudget: 155000,
          deadline: '2024-04-18',
          status: 'open',
          bidsCount: 6,
          matchScore: 85,
          location: 'Bangalore, Karnataka',
          description: 'Certified organic soybeans for oil extraction and food products.',
          requirements: ['Organic certification', 'Non-GMO', 'High protein content', 'Clean sorting'],
          postedDate: '2024-04-02',
          category: 'Pulses'
        },
        {
          id: '5',
          tenderNumber: 'TND-2024-005',
          title: 'Chickpeas Bulk Order',
          buyer: 'Vikram Singh',
          buyerCompany: 'RST Traders',
          buyerEmail: 'vikram@rsttraders.com',
          buyerPhone: '+91 98765 43214',
          product: 'Chickpeas',
          quantity: 3500,
          unit: 'kg',
          budget: 210000,
          minBudget: 200000,
          maxBudget: 220000,
          deadline: '2024-04-08',
          status: 'closing_soon',
          bidsCount: 10,
          matchScore: 90,
          location: 'Jaipur, Rajasthan',
          description: 'Premium chickpeas for export to Middle East markets.',
          requirements: ['Large size', 'Uniform color', 'No splits', 'Export packaging'],
          postedDate: '2024-03-26',
          category: 'Pulses'
        },
        {
          id: '6',
          tenderNumber: 'TND-2024-006',
          title: 'Red Lentils Supply',
          buyer: 'Meera Joshi',
          buyerCompany: 'UVW Imports',
          buyerEmail: 'meera@uvwimports.com',
          buyerPhone: '+91 98765 43215',
          product: 'Red Lentils',
          quantity: 2000,
          unit: 'kg',
          budget: 120000,
          minBudget: 115000,
          maxBudget: 125000,
          deadline: '2024-04-05',
          status: 'closed',
          bidsCount: 18,
          matchScore: 78,
          location: 'Hyderabad, Telangana',
          description: 'Quality red lentils for retail distribution.',
          requirements: ['Clean sorting', 'No stones', 'Uniform size', 'Retail packaging'],
          postedDate: '2024-03-20',
          category: 'Pulses'
        }
      ];

      const mockBids: Bid[] = [
        {
          id: '1',
          bidNumber: 'BID-2024-001',
          tenderId: '1',
          tenderTitle: 'Bulk Wheat Purchase for Export',
          amount: 245000,
          proposedQuantity: 5000,
          deliveryTime: '15 days',
          status: 'pending',
          submittedAt: '2024-04-02',
          winProbability: 78,
          notes: 'Can provide organic certification and export quality packaging',
          validUntil: '2024-04-14'
        },
        {
          id: '2',
          bidNumber: 'BID-2024-002',
          tenderId: '2',
          tenderTitle: 'Premium Basmati Rice Supply',
          amount: 175000,
          proposedQuantity: 3000,
          deliveryTime: '10 days',
          status: 'accepted',
          submittedAt: '2024-03-29',
          winProbability: 92,
          notes: 'Premium aged basmati rice with all certifications',
          validUntil: '2024-04-11'
        },
        {
          id: '3',
          bidNumber: 'BID-2024-003',
          tenderId: '6',
          tenderTitle: 'Red Lentils Supply',
          amount: 118000,
          proposedQuantity: 2000,
          deliveryTime: '7 days',
          status: 'rejected',
          submittedAt: '2024-03-22',
          winProbability: 45,
          notes: 'Clean sorted lentils with retail packaging',
          validUntil: '2024-04-04'
        },
        {
          id: '4',
          bidNumber: 'BID-2024-004',
          tenderId: '5',
          tenderTitle: 'Chickpeas Bulk Order',
          amount: 205000,
          proposedQuantity: 3500,
          deliveryTime: '12 days',
          status: 'pending',
          submittedAt: '2024-03-27',
          winProbability: 85,
          notes: 'Large size premium chickpeas ready for export',
          validUntil: '2024-04-07'
        }
      ];

      setTenders(mockTenders);
      setMyBids(mockBids);
      setLoading(false);
    }, 800);
  };

  const filterAndSort = () => {
    if (activeTab === 'marketplace') {
      let filtered = [...tenders];

      if (statusFilter !== 'all') {
        filtered = filtered.filter(t => t.status === statusFilter);
      }

      if (searchQuery) {
        filtered = filtered.filter(t =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.buyer.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      filtered.sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        } else if (sortBy === 'budget') {
          return b.budget - a.budget;
        } else {
          return b.matchScore - a.matchScore;
        }
      });

      setFilteredTenders(filtered);
    } else {
      let filtered = [...myBids];

      if (statusFilter !== 'all') {
        filtered = filtered.filter(b => b.status === statusFilter);
      }

      if (searchQuery) {
        filtered = filtered.filter(b =>
          b.tenderTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.bidNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      setFilteredBids(filtered);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      open: { color: 'bg-green-500', icon: FileText, label: 'Open' },
      closing_soon: { color: 'bg-orange-500', icon: Clock, label: 'Closing Soon' },
      closed: { color: 'bg-gray-500', icon: XCircle, label: 'Closed' },
      awarded: { color: 'bg-purple-500', icon: Award, label: 'Awarded' },
      pending: { color: 'bg-yellow-500', icon: Clock, label: 'Pending' },
      accepted: { color: 'bg-green-500', icon: CheckCircle, label: 'Accepted' },
      rejected: { color: 'bg-red-500', icon: XCircle, label: 'Rejected' },
      withdrawn: { color: 'bg-gray-500', icon: XCircle, label: 'Withdrawn' }
    };
    return configs[status as keyof typeof configs] || configs.open;
  };

  const stats = {
    totalTenders: tenders.length,
    openTenders: tenders.filter(t => t.status === 'open').length,
    closingSoon: tenders.filter(t => t.status === 'closing_soon').length,
    totalBids: myBids.length,
    pendingBids: myBids.filter(b => b.status === 'pending').length,
    acceptedBids: myBids.filter(b => b.status === 'accepted').length,
    avgWinRate: myBids.length > 0 ? Math.round(myBids.reduce((sum, b) => sum + b.winProbability, 0) / myBids.length) : 0,
    totalBidValue: myBids.reduce((sum, b) => sum + b.amount, 0)
  };

  const handlePlaceBid = (tender: Tender) => {
    toast.success(`Bid form opened for ${tender.title}`);
    setSelectedTender(tender);
  };

  const handleWithdrawBid = (bidId: string) => {
    setMyBids(myBids.map(bid =>
      bid.id === bidId ? { ...bid, status: 'withdrawn' } : bid
    ));
    toast.success('Bid withdrawn successfully');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Tenders & Bids Hub
            </h1>
            <p className="text-gray-600 mt-1">Discover opportunities and manage your bids</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white transition-all flex items-center gap-2"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white transition-all flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6"
      >
        {[
          { label: 'Total Tenders', value: stats.totalTenders, icon: FileText, color: 'from-purple-500 to-indigo-500' },
          { label: 'Open', value: stats.openTenders, icon: FileText, color: 'from-green-500 to-emerald-500' },
          { label: 'Closing Soon', value: stats.closingSoon, icon: Clock, color: 'from-orange-500 to-red-500' },
          { label: 'My Bids', value: stats.totalBids, icon: Send, color: 'from-blue-500 to-cyan-500' },
          { label: 'Pending', value: stats.pendingBids, icon: Clock, color: 'from-yellow-500 to-orange-500' },
          { label: 'Accepted', value: stats.acceptedBids, icon: CheckCircle, color: 'from-green-500 to-teal-500' },
          { label: 'Win Rate', value: `${stats.avgWinRate}%`, icon: TrendingUp, color: 'from-pink-500 to-rose-500' },
          { label: 'Bid Value', value: `₹${(stats.totalBidValue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'from-emerald-500 to-green-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 mb-6"
      >
        <div className="flex gap-2 mb-4">
          {[
            { key: 'marketplace', label: 'Marketplace', icon: Briefcase },
            { key: 'mybids', label: 'My Bids', icon: Send },
            { key: 'won', label: 'Won Tenders', icon: Award }
          ].map(tab => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={activeTab === 'marketplace' ? 'Search tenders...' : 'Search bids...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {activeTab === 'marketplace' ? (
                <>
                  <option value="open">Open</option>
                  <option value="closing_soon">Closing Soon</option>
                  <option value="closed">Closed</option>
                </>
              ) : (
                <>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </>
              )}
            </select>
            {activeTab === 'marketplace' && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="budget">Sort by Budget</option>
                <option value="match">Sort by Match</option>
              </select>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </motion.div>
        ) : activeTab === 'marketplace' ? (
          <motion.div
            key="marketplace"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredTenders.length === 0 ? (
              <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-xl p-12 border border-gray-200 text-center">
                <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No tenders found</p>
              </div>
            ) : (
              filteredTenders.map((tender) => {
                const statusConfig = getStatusConfig(tender.status);
                const StatusIcon = statusConfig.icon;
                const daysLeft = Math.ceil((new Date(tender.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <motion.div
                    key={tender.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{tender.title}</h3>
                        <p className="text-xs text-gray-500">{tender.tenderNumber}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusConfig.color} flex items-center gap-1 whitespace-nowrap ml-2`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Building size={14} className="text-gray-400" />
                        <span className="text-gray-700 font-medium">{tender.buyerCompany}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Package size={14} className="text-gray-400" />
                        <span className="text-gray-700">{tender.product} - {tender.quantity} {tender.unit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-gray-700">{tender.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign size={14} className="text-gray-400" />
                        <span className="text-gray-700 font-bold text-green-600">₹{tender.budget.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600">{tender.bidsCount} bids</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Match Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-24">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${tender.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-purple-600">{tender.matchScore}%</span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePlaceBid(tender)}
                      disabled={tender.status === 'closed'}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        tender.status === 'closed'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                      }`}
                    >
                      <Send size={16} />
                      {tender.status === 'closed' ? 'Closed' : 'Place Bid'}
                    </motion.button>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        ) : (
          <motion.div
            key="mybids"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredBids.length === 0 ? (
              <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-xl p-12 border border-gray-200 text-center">
                <Send size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No bids found</p>
              </div>
            ) : (
              filteredBids.map((bid) => {
                const statusConfig = getStatusConfig(bid.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={bid.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{bid.tenderTitle}</h3>
                        <p className="text-xs text-gray-500 mt-1">{bid.bidNumber}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusConfig.color} flex items-center gap-1`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Bid Amount</p>
                        <p className="text-lg font-bold text-green-600">₹{bid.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Quantity</p>
                        <p className="text-lg font-semibold text-gray-800">{bid.proposedQuantity} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Delivery Time</p>
                        <p className="text-sm text-gray-700">{bid.deliveryTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Submitted</p>
                        <p className="text-sm text-gray-700">{new Date(bid.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Win Probability</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              bid.winProbability >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                              bid.winProbability >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              'bg-gradient-to-r from-red-500 to-pink-500'
                            }`}
                            style={{ width: `${bid.winProbability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-800">{bid.winProbability}%</span>
                      </div>
                    </div>

                    {bid.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                        <p className="text-sm text-gray-700">{bid.notes}</p>
                      </div>
                    )}

                    {bid.status === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleWithdrawBid(bid.id)}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Withdraw Bid
                      </motion.button>
                    )}
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
