'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Download,
  RefreshCw,
  CreditCard,
  Building2,
  Smartphone,
  DollarSign,
  Calendar,
  FileText,
  Receipt,
  Shield,
  BarChart3,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { paymentService, Transaction as PaymentTransaction } from '@/services/paymentService';

interface Transaction {
  id: string;
  type: 'received' | 'sent' | 'pending' | 'refund';
  amount: number;
  from: string;
  to: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  method: 'UPI' | 'Bank Transfer' | 'NEFT' | 'RTGS' | 'Card' | 'Wallet';
  category: string;
  reference: string;
  description: string;
  userId?: string;
}

export default function AgriPayCenter() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Try to fetch from backend
      const data = await paymentService.getTransactions();
      setTransactions(data as Transaction[]);
    } catch (error) {
      console.error('Failed to fetch from backend, using mock data:', error);
      // Fallback to mock data
      setTimeout(() => {
        setTransactions([
        {
          id: 'TXN001',
          type: 'received',
          amount: 25000,
          from: 'Buyer Corp',
          to: 'You',
          date: '2024-01-15T10:30:00',
          status: 'completed',
          method: 'UPI',
          category: 'Product Sale',
          reference: 'UPI/2024/01/15/001',
          description: 'Payment for wheat delivery'
        },
        {
          id: 'TXN002',
          type: 'sent',
          amount: 5000,
          from: 'You',
          to: 'Supplier Ltd',
          date: '2024-01-14T14:20:00',
          status: 'completed',
          method: 'Bank Transfer',
          category: 'Purchase',
          reference: 'NEFT/2024/01/14/002',
          description: 'Fertilizer purchase'
        },
        {
          id: 'TXN003',
          type: 'pending',
          amount: 15000,
          from: 'ABC Traders',
          to: 'You',
          date: '2024-01-13T09:15:00',
          status: 'pending',
          method: 'UPI',
          category: 'Product Sale',
          reference: 'UPI/2024/01/13/003',
          description: 'Payment for rice order'
        },
        {
          id: 'TXN004',
          type: 'received',
          amount: 30000,
          from: 'XYZ Buyers',
          to: 'You',
          date: '2024-01-12T16:45:00',
          status: 'completed',
          method: 'NEFT',
          category: 'Product Sale',
          reference: 'NEFT/2024/01/12/004',
          description: 'Bulk order payment'
        },
        {
          id: 'TXN005',
          type: 'received',
          amount: 18000,
          from: 'Fresh Mart',
          to: 'You',
          date: '2024-01-11T11:30:00',
          status: 'completed',
          method: 'UPI',
          category: 'Product Sale',
          reference: 'UPI/2024/01/11/005',
          description: 'Vegetable supply payment'
        },
        {
          id: 'TXN006',
          type: 'sent',
          amount: 3500,
          from: 'You',
          to: 'Transport Co',
          date: '2024-01-10T13:00:00',
          status: 'completed',
          method: 'UPI',
          category: 'Logistics',
          reference: 'UPI/2024/01/10/006',
          description: 'Transportation charges'
        },
        {
          id: 'TXN007',
          type: 'received',
          amount: 22000,
          from: 'Organic Foods',
          to: 'You',
          date: '2024-01-09T15:20:00',
          status: 'completed',
          method: 'RTGS',
          category: 'Product Sale',
          reference: 'RTGS/2024/01/09/007',
          description: 'Organic produce payment'
        },
        {
          id: 'TXN008',
          type: 'pending',
          amount: 12000,
          from: 'Market Hub',
          to: 'You',
          date: '2024-01-08T10:00:00',
          status: 'processing',
          method: 'Bank Transfer',
          category: 'Product Sale',
          reference: 'NEFT/2024/01/08/008',
          description: 'Weekly supply payment'
        },
        {
          id: 'TXN009',
          type: 'sent',
          amount: 8000,
          from: 'You',
          to: 'Equipment Rental',
          date: '2024-01-07T12:30:00',
          status: 'completed',
          method: 'UPI',
          category: 'Equipment',
          reference: 'UPI/2024/01/07/009',
          description: 'Tractor rental payment'
        },
        {
          id: 'TXN010',
          type: 'received',
          amount: 35000,
          from: 'Export Corp',
          to: 'You',
          date: '2024-01-06T14:45:00',
          status: 'completed',
          method: 'RTGS',
          category: 'Export',
          reference: 'RTGS/2024/01/06/010',
          description: 'International order payment'
        },
      ]);
      setLoading(false);
    }, 800);
    }
  };

  // Computed statistics
  const stats = useMemo(() => {
    const completed = transactions.filter(t => t.status === 'completed');
    const totalReceived = completed.filter(t => t.type === 'received').reduce((sum, t) => sum + t.amount, 0);
    const totalSent = completed.filter(t => t.type === 'sent').reduce((sum, t) => sum + t.amount, 0);
    const totalPending = transactions.filter(t => t.status === 'pending' || t.status === 'processing').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalReceived - totalSent;
    const thisMonth = completed.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => t.type === 'received' ? sum + t.amount : sum, 0);
    const transactionCount = transactions.length;
    const avgTransaction = completed.length > 0 ? Math.round(completed.reduce((sum, t) => sum + t.amount, 0) / completed.length) : 0;
    const successRate = transactions.length > 0 ? Math.round((completed.length / transactions.length) * 100) : 0;

    return {
      totalReceived,
      totalSent,
      totalPending,
      netBalance,
      thisMonth,
      transactionCount,
      avgTransaction,
      successRate
    };
  }, [transactions]);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(txn => {
      const matchesSearch = txn.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           txn.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           txn.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           txn.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesFilter = true;
      if (filter === 'received') matchesFilter = txn.type === 'received';
      if (filter === 'sent') matchesFilter = txn.type === 'sent';
      if (filter === 'pending') matchesFilter = txn.status === 'pending' || txn.status === 'processing';
      if (filter === 'completed') matchesFilter = txn.status === 'completed';

      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'amount') return b.amount - a.amount;
      return 0;
    });

    return filtered;
  }, [transactions, searchQuery, filter, sortBy]);

  const getStatusColor = (status: string) => {
    const colors = {
      completed: { bg: 'from-green-500 to-emerald-600', badge: 'bg-green-100 text-green-700', icon: CheckCircle },
      pending: { bg: 'from-yellow-500 to-orange-600', badge: 'bg-yellow-100 text-yellow-700', icon: Clock },
      processing: { bg: 'from-blue-500 to-indigo-600', badge: 'bg-blue-100 text-blue-700', icon: RefreshCw },
      failed: { bg: 'from-red-500 to-pink-600', badge: 'bg-red-100 text-red-700', icon: XCircle }
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getTypeIcon = (type: string) => {
    if (type === 'received') return ArrowDownRight;
    if (type === 'sent') return ArrowUpRight;
    return Clock;
  };

  const getMethodIcon = (method: string) => {
    if (method === 'UPI') return Smartphone;
    if (method === 'Card') return CreditCard;
    return Building2;
  };

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRefresh = () => {
    loadTransactions();
    showToastMessage('Transactions refreshed successfully', 'success');
  };

  const handleNewPayment = () => {
    setShowPaymentModal(true);
    showToastMessage('Opening payment form...', 'info');
  };

  const handleCopyReference = (reference: string) => {
    navigator.clipboard.writeText(reference);
    showToastMessage('Reference copied to clipboard', 'success');
  };

  const handleViewDetails = (txn: Transaction) => {
    setSelectedTransaction(txn);
    showToastMessage('Transaction details loaded', 'info');
  };

  const handleExport = async () => {
    try {
      const filterType = filter !== 'all' ? filter as 'received' | 'sent' | 'pending' | 'completed' : undefined;
      const blob = await paymentService.exportTransactions('csv', {
        type: filterType,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToastMessage('Transactions exported successfully', 'success');
    } catch (error) {
      showToastMessage('Export failed. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 p-6">
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
              toastType === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
              toastType === 'error' ? 'bg-red-500/90 border-red-400 text-white' :
              'bg-blue-500/90 border-blue-400 text-white'
            }`}>
              <CheckCircle size={20} />
              <span className="font-semibold">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-4 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl shadow-xl"
            >
              <Wallet className="text-white" size={32} />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                AgriPay Center
              </h1>
              <p className="text-slate-600 text-sm mt-1">Manage payments, track transactions, and monitor cash flow</p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl hover:border-green-400 hover:shadow-lg transition-all"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-green-600" : "text-slate-700"} />
              <span className="text-sm font-semibold text-slate-700">Refresh</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewPayment}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all"
            >
              <Plus size={18} />
              <span className="text-sm font-semibold">New Payment</span>
            </motion.button>
          </div>
        </div>

        {/* Status Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 w-fit px-5 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-full shadow-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2.5 h-2.5 bg-green-500 rounded-full"
          />
          <span className="text-sm font-bold text-green-700">SECURE PAYMENTS</span>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          {
            label: 'Total Received',
            value: `₹${(stats.totalReceived / 1000).toFixed(1)}K`,
            change: '+12%',
            icon: ArrowDownRight,
            gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
            bgGradient: 'from-emerald-50 to-teal-50'
          },
          {
            label: 'Total Sent',
            value: `₹${(stats.totalSent / 1000).toFixed(1)}K`,
            change: stats.totalSent.toString(),
            icon: ArrowUpRight,
            gradient: 'from-red-500 via-pink-500 to-rose-600',
            bgGradient: 'from-red-50 to-pink-50'
          },
          {
            label: 'Pending',
            value: `₹${(stats.totalPending / 1000).toFixed(1)}K`,
            change: `${transactions.filter(t => t.status === 'pending').length} txns`,
            icon: Clock,
            gradient: 'from-yellow-500 via-orange-500 to-amber-600',
            bgGradient: 'from-yellow-50 to-orange-50'
          },
          {
            label: 'Net Balance',
            value: `₹${(stats.netBalance / 1000).toFixed(1)}K`,
            change: stats.netBalance > 0 ? '+' + ((stats.netBalance / stats.totalReceived) * 100).toFixed(0) + '%' : '0%',
            icon: DollarSign,
            gradient: 'from-blue-500 via-indigo-500 to-purple-600',
            bgGradient: 'from-blue-50 to-indigo-50'
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={staggerItem}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative p-6 bg-gradient-to-br ${stat.bgGradient} rounded-2xl border-2 border-white shadow-lg hover:shadow-2xl transition-all overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}
                >
                  <stat.icon className="text-white" size={24} />
                </motion.div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 text-slate-700"
                >
                  {stat.change}
                </motion.span>
              </div>
              <p className="text-slate-600 text-sm mb-2 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>

            <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 blur-2xl`} />
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {[
          { label: 'This Month', value: `₹${(stats.thisMonth / 1000).toFixed(1)}K`, icon: Calendar, color: 'from-purple-500 to-fuchsia-600' },
          { label: 'Transactions', value: stats.transactionCount.toString(), icon: Receipt, color: 'from-cyan-500 to-blue-600' },
          { label: 'Avg Transaction', value: `₹${(stats.avgTransaction / 1000).toFixed(1)}K`, icon: BarChart3, color: 'from-orange-500 to-red-600' },
          { label: 'Success Rate', value: `${stats.successRate}%`, icon: Shield, color: 'from-emerald-500 to-teal-600' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-5 bg-white/60 backdrop-blur-xl rounded-2xl border-2 border-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-semibold mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-md`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 border-white">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by party, reference, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 outline-none bg-white/80 backdrop-blur-sm"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 outline-none bg-white/80 backdrop-blur-sm font-medium"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-3 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition-colors"
            >
              <Download size={18} />
              <span className="text-sm">Export</span>
            </motion.button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: 'All Transactions', icon: Receipt },
              { id: 'received', label: 'Received', icon: ArrowDownRight },
              { id: 'sent', label: 'Sent', icon: ArrowUpRight },
              { id: 'pending', label: 'Pending', icon: Clock },
              { id: 'completed', label: 'Completed', icon: CheckCircle },
            ].map((tab, idx) => (
              <motion.button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white shadow-xl shadow-green-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
                }`}
              >
                <tab.icon size={18} />
                <span className="text-sm">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Transactions Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loading ? (
          // Skeleton Loaders
          Array.from({ length: 6 }).map((_, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              className="p-6 bg-white/60 backdrop-blur-xl rounded-2xl border-2 border-white shadow-lg animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="w-20 h-6 bg-slate-200 rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="w-32 h-8 bg-slate-200 rounded-lg" />
                <div className="w-full h-4 bg-slate-200 rounded" />
                <div className="w-3/4 h-4 bg-slate-200 rounded" />
              </div>
            </motion.div>
          ))
        ) : filteredTransactions.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-20 px-6"
          >
            <div className="p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-6">
              <Receipt size={48} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Transactions Found</h3>
            <p className="text-slate-500 text-center max-w-md">
              {searchQuery ? 'Try adjusting your search or filters' : 'Start by making your first payment'}
            </p>
          </motion.div>
        ) : (
          // Transaction Cards
          filteredTransactions.map((txn, idx) => {
            const statusInfo = getStatusColor(txn.status);
            const TypeIcon = getTypeIcon(txn.type);
            const MethodIcon = getMethodIcon(txn.method);
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={txn.id}
                variants={staggerItem}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => handleViewDetails(txn)}
                className="relative p-6 bg-white/60 backdrop-blur-xl rounded-2xl border-2 border-white shadow-lg hover:shadow-2xl transition-all overflow-hidden group cursor-pointer"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${statusInfo.bg} opacity-0 group-hover:opacity-5 transition-opacity`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`p-3 bg-gradient-to-br ${statusInfo.bg} rounded-xl shadow-lg`}
                    >
                      <TypeIcon className="text-white" size={24} />
                    </motion.div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.badge}`}>
                        {txn.status.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MethodIcon size={14} />
                        <span>{txn.method}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-4">
                    <p className={`text-3xl font-bold ${
                      txn.type === 'received' ? 'text-emerald-600' : 
                      txn.type === 'sent' ? 'text-red-600' : 
                      'text-orange-600'
                    }`}>
                      {txn.type === 'sent' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-600 font-medium mt-1">{txn.category}</p>
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowDownRight size={16} className="text-green-600" />
                      <span className="text-slate-600">From:</span>
                      <span className="font-semibold text-slate-900">{txn.from}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowUpRight size={16} className="text-red-600" />
                      <span className="text-slate-600">To:</span>
                      <span className="font-semibold text-slate-900">{txn.to}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{txn.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar size={14} />
                      <span>{new Date(txn.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyReference(txn.reference);
                      }}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-green-600 transition-colors"
                    >
                      <Copy size={14} />
                      <span className="font-mono">{txn.reference.split("/").pop()}</span>
                    </motion.button>
                  </div>

                  {/* Status Indicator */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="absolute top-4 left-4"
                  >
                    <StatusIcon size={16} className={`${
                      txn.status === 'completed' ? 'text-green-500' :
                      txn.status === 'pending' ? 'text-yellow-500' :
                      txn.status === 'processing' ? 'text-blue-500' :
                      'text-red-500'
                    }`} />
                  </motion.div>
                </div>

                {/* Hover Effect Glow */}
                <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br ${statusInfo.bg} rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity`} />
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
