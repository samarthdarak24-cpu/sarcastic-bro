'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, DollarSign, TrendingUp, CreditCard, Shield, Clock,
  FileText, AlertCircle, CheckCircle, RefreshCw, Download,
  Send, ArrowUpRight, ArrowDownRight, ArrowRight, Calendar, Filter,
  Search, MoreVertical, Eye, Lock, Unlock, Bell, Settings, X, PlusCircle, Building, Building2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

// Import existing payment components
import AgriPayCenter from './AgriPayCenter';
import { EscrowHub } from './EscrowHub';
import { PaymentSchedule } from './PaymentSchedule';
import { TransactionHistory } from './TransactionHistory';
import { RefundManager } from './RefundManager';
import { SmartContracts } from './SmartContracts';

export default function FinancialHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Modals States
  const [showSendModal, setShowSendModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Financial Overview', icon: Wallet },
    { id: 'wallet', label: 'Digital Payment Center', icon: CreditCard },
    { id: 'escrow', label: 'Escrow Systems', icon: Shield },
    { id: 'schedule', label: 'Payment Schedule', icon: Calendar },
    { id: 'transactions', label: 'Transaction History', icon: FileText },
    { id: 'contracts', label: 'Smart Contracts', icon: Lock },
    { id: 'refunds', label: 'Refunds & Disputes', icon: AlertCircle },
  ];

  const [financialSummary, setFinancialSummary] = useState({
    totalBalance: 245680,
    pendingPayments: 45200,
    escrowBalance: 89500,
    monthlyRevenue: 156780,
    revenueGrowth: 12.5,
    successfulTransactions: 154,
    pendingTransactions: 8,
    failedTransactions: 2,
  });

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API Call
    setTimeout(() => {
      setRefreshing(false);
      setFinancialSummary(prev => ({
        ...prev,
        totalBalance: prev.totalBalance + Math.floor(Math.random() * 5000),
        monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 2000),
        revenueGrowth: parseFloat((prev.revenueGrowth + (Math.random() * 0.5)).toFixed(1))
      }));
      toast.success('Financial systems synchronized with blockchain');
    }, 1500);
  };

  const recentTransactions = [
    { id: 'TXN001', type: 'credit', amount: 45000, description: 'Order Payment - Tomatoes', date: '2024-04-08', status: 'completed', buyer: 'ABC Traders' },
    { id: 'TXN002', type: 'debit', amount: 5000, description: 'Platform Fee', date: '2024-04-08', status: 'completed', buyer: 'ODOP Connect' },
    { id: 'TXN003', type: 'credit', amount: 32000, description: 'Order Payment - Wheat', date: '2024-04-07', status: 'completed', buyer: 'Fresh Mart' },
    { id: 'TXN004', type: 'pending', amount: 28000, description: 'Escrow Release Pending', date: '2024-04-07', status: 'pending', buyer: 'XYZ Exports' },
  ];

  const upcomingPayments = [
    { id: 'PAY001', amount: 45200, dueDate: '2024-04-10', buyer: 'ABC Traders', status: 'pending' },
    { id: 'PAY002', amount: 38500, dueDate: '2024-04-12', buyer: 'Fresh Mart', status: 'scheduled' },
    { id: 'PAY003', amount: 52000, dueDate: '2024-04-15', buyer: 'Green Valley', status: 'scheduled' },
  ];



  const handleActionClick = (id: string) => {
    switch (id) {
      case 'send':
        setShowSendModal(true);
        break;
      case 'withdraw':
        setShowWithdrawModal(true);
        break;
      case 'invoice':
        setShowInvoiceModal(true);
        break;
      case 'settings':
        setShowSettingsModal(true);
        break;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6 relative">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">Financial Hub.</h2>
              <Badge tone="brand" className="h-8 px-4 rounded-xl font-black gap-2 uppercase text-[9px]">
                <Wallet size={14} />
                ALL-IN-ONE
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              Complete payment & financial management
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-12 px-6 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-black border-2 border-slate-200"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin mr-2' : 'mr-2'} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="w-full bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Financial Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center shadow-inner">
                          <Wallet size={24} className="text-white" />
                        </div>
                        <TrendingUp size={20} className="text-green-600" />
                      </div>
                      <p className="text-3xl font-black text-slate-900 mb-1">₹{(financialSummary.totalBalance / 1000).toFixed(0)}K</p>
                      <p className="text-xs font-bold text-slate-600 uppercase">Total Balance</p>
                    </Card>

                    <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-inner">
                          <Clock size={24} className="text-white" />
                        </div>
                        <Clock size={20} className="text-blue-600" />
                      </div>
                      <p className="text-3xl font-black text-slate-900 mb-1">₹{(financialSummary.pendingPayments / 1000).toFixed(0)}K</p>
                      <p className="text-xs font-bold text-slate-600 uppercase">Pending Payments</p>
                    </Card>

                    <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-inner">
                          <Shield size={24} className="text-white" />
                        </div>
                        <Shield size={20} className="text-purple-600" />
                      </div>
                      <p className="text-3xl font-black text-slate-900 mb-1">₹{(financialSummary.escrowBalance / 1000).toFixed(0)}K</p>
                      <p className="text-xs font-bold text-slate-600 uppercase">Escrow Balance</p>
                    </Card>

                    <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-inner">
                          <TrendingUp size={24} className="text-white" />
                        </div>
                        <ArrowUpRight size={20} className="text-amber-600" />
                      </div>
                      <p className="text-3xl font-black text-slate-900 mb-1">₹{(financialSummary.monthlyRevenue / 1000).toFixed(0)}K</p>
                      <p className="text-xs font-bold text-slate-600 uppercase">Monthly Revenue</p>
                      <p className="text-xs font-bold text-green-600 mt-1">+{financialSummary.revenueGrowth}%</p>
                    </Card>
                  </div>

                  {/* Recent Transactions & Upcoming Payments */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900">Recent Transactions</h3>
                        <Button className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-sm">
                          View All
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {recentTransactions.map((txn) => (
                          <div key={txn.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                                txn.type === 'credit' ? 'bg-green-100' : txn.type === 'debit' ? 'bg-red-100' : 'bg-amber-100'
                              } group-hover:scale-110 transition-transform`}>
                                {txn.type === 'credit' ? (
                                  <ArrowDownRight size={22} className="text-green-600" />
                                ) : txn.type === 'debit' ? (
                                  <ArrowUpRight size={22} className="text-red-600" />
                                ) : (
                                  <Clock size={22} className="text-amber-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{txn.description}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{txn.buyer} • {txn.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-black text-lg ${
                                txn.type === 'credit' ? 'text-green-600' : txn.type === 'debit' ? 'text-red-500' : 'text-amber-500'
                              }`}>
                                {txn.type === 'debit' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                              </p>
                              <Badge tone={txn.status === 'completed' ? 'brand' : 'amber'} className="text-[10px] uppercase font-bold mt-1">
                                {txn.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Upcoming Payments */}
                    <Card className="p-6 border-none shadow-lg bg-white rounded-[2rem]">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900">Upcoming Payments</h3>
                        <Button className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-sm">
                          View All
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {upcomingPayments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Calendar size={22} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{payment.buyer}</p>
                                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5"><Clock size={12}/> Due: {payment.dueDate}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-lg text-slate-900">₹{payment.amount.toLocaleString()}</p>
                              <Badge tone={payment.status === 'pending' ? 'amber' : 'brand'} className="text-[10px] uppercase font-bold mt-1">
                                {payment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2rem]">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { id: 'send', icon: Send, label: 'Send Money', classes: { bg: 'bg-blue-100', text: 'text-blue-600', hoverBg: 'hover:bg-blue-50' } },
                        { id: 'withdraw', icon: Download, label: 'Withdraw', classes: { bg: 'bg-green-100', text: 'text-green-600', hoverBg: 'hover:bg-green-50' } },
                        { id: 'invoice', icon: FileText, label: 'Generate Invoice', classes: { bg: 'bg-purple-100', text: 'text-purple-600', hoverBg: 'hover:bg-purple-50' } },
                        { id: 'settings', icon: Settings, label: 'Settings', classes: { bg: 'bg-slate-200', text: 'text-slate-700', hoverBg: 'hover:bg-slate-100' } },
                      ].map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleActionClick(action.id)}
                          className={`flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl transition-all shadow-sm hover:shadow-lg ${action.classes.hoverBg} border border-slate-100 group active:scale-95`}
                        >
                          <div className={`h-16 w-16 ${action.classes.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                            <action.icon size={32} className={action.classes.text} />
                          </div>
                          <span className="font-black text-slate-800 text-sm group-hover:text-slate-900">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'wallet' && <AgriPayCenter />}
              {activeTab === 'escrow' && <EscrowHub />}
              {activeTab === 'schedule' && <PaymentSchedule />}
              {activeTab === 'transactions' && <TransactionHistory />}
              {activeTab === 'contracts' && <SmartContracts />}
              {activeTab === 'refunds' && <RefundManager />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {/* SEND MONEY MODAL */}
        {showSendModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSendModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-xl">
                    <Send size={20} />
                  </div>
                  <h3 className="font-black text-xl text-slate-900">Send Money</h3>
                </div>
                <button onClick={() => setShowSendModal(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6 bg-slate-50">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Recipient Account / UPI ID</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search by name, @upi or account no..." className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                    <input type="number" placeholder="0.00" className="w-full h-14 text-2xl pl-10 pr-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-black text-slate-900" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1 pt-1">
                    <span>Available Balance: ₹245,680</span>
                    <button className="text-blue-600 hover:text-blue-700">Use Max</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Add Note (Optional)</label>
                  <input type="text" placeholder="e.g. Payment for transport" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-white">
                <button 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    toast.success('Money sent successfully');
                    setShowSendModal(false);
                  }}
                >
                  Send Now <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* WITHDRAW MODAL */}
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 text-green-600 flex items-center justify-center rounded-xl">
                    <Download size={20} />
                  </div>
                  <h3 className="font-black text-xl text-slate-900">Withdraw Funds</h3>
                </div>
                <button onClick={() => setShowWithdrawModal(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6 bg-slate-50">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Withdraw to Bank</label>
                  <div className="w-full p-4 bg-white border-2 border-green-500 rounded-xl flex items-center justify-between cursor-pointer shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 bg-green-500 rounded-bl-lg">
                      <CheckCircle size={14} className="text-white" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Building size={20} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">State Bank of India</p>
                        <p className="font-medium text-slate-500 text-xs">•••• •••• 4589</p>
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-bold text-green-600 mt-2 px-1 hover:text-green-700 w-full justify-center">
                    <PlusCircle size={16} /> Link New Bank Account
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Amount to Withdraw (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                    <input type="number" placeholder="0.00" className="w-full h-14 text-2xl pl-10 pr-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-black text-slate-900" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 px-1 pt-1">Instantly settles in 5-10 mins. No fees applied.</p>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-white space-y-4">
                <button 
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black text-lg transition-colors"
                  onClick={() => {
                    toast.success('Funds withdrawal initiated');
                    setShowWithdrawModal(false);
                  }}
                >
                  Confirm Withdrawal
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* INVOICE MODAL */}
        {showInvoiceModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowInvoiceModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 text-purple-600 flex items-center justify-center rounded-xl">
                    <FileText size={20} />
                  </div>
                  <h3 className="font-black text-xl text-slate-900">Generate Invoice</h3>
                </div>
                <button onClick={() => setShowInvoiceModal(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-5 bg-slate-50 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Invoice Number</label>
                    <input type="text" value="INV-2024-089" disabled className="w-full h-12 px-4 bg-slate-200 text-slate-500 border border-slate-200 rounded-xl font-bold cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Issue Date</label>
                    <input type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Bill To (Buyer)</label>
                  <input type="text" placeholder="Search saved buyers or enter new..." className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-slate-900" />
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-900 text-sm uppercase">Item Details</h4>
                    <button className="text-purple-600 font-bold text-xs hover:text-purple-700 flex items-center gap-1">
                      <PlusCircle size={14} /> Add Line Item
                    </button>
                  </div>
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-6 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                      <input type="text" placeholder="e.g. Wheat Type A" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500 outline-none text-sm font-medium" />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Qty (Qtl)</label>
                      <input type="number" placeholder="0" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500 outline-none text-sm font-medium" />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Price</label>
                      <input type="number" placeholder="₹0" className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-purple-500 outline-none text-sm font-medium" />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl flex items-center justify-between border border-purple-100">
                  <span className="font-black text-slate-700">Total Amount Invoice</span>
                  <span className="font-black text-2xl text-purple-700">₹0.00</span>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowInvoiceModal(false)}
                  className="w-full h-12 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-lg transition-colors"
                >
                  Save Draft
                </button>
                <button 
                  onClick={() => {
                    toast.success('Invoice Generated and Sent!');
                    setShowInvoiceModal(false);
                  }}
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Generate & Send <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* SETTINGS MODAL */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-sm h-full max-h-screen overflow-hidden shadow-2xl flex flex-col my-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-200 text-slate-700 flex items-center justify-center rounded-xl">
                    <Settings size={20} />
                  </div>
                  <h3 className="font-black text-xl text-slate-900">Wallet Settings</h3>
                </div>
                <button onClick={() => setShowSettingsModal(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-200 rounded-full shadow-sm transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
                
                {/* Profile Setting Summary */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-md uppercase">
                    FD
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">Farmer Darak</h4>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded-md block mt-1 w-max">KYC VERIFIED</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Security</h4>
                  <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Lock size={18} className="text-slate-600" />
                      <span className="font-bold text-slate-900 text-sm">Change PIN / Password</span>
                    </div>
                    <ArrowRight size={16} className="text-slate-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-slate-600" />
                      <span className="font-bold text-slate-900 text-sm">Two-Factor Auth (2FA)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-green-600">Enabled</span>
                      <ArrowRight size={16} className="text-slate-400" />
                    </div>
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Preferences</h4>
                  <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Bell size={18} className="text-slate-600" />
                      <span className="font-bold text-slate-900 text-sm">Notification Settings</span>
                    </div>
                    <ArrowRight size={16} className="text-slate-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Building2 size={18} className="text-slate-600" />
                      <span className="font-bold text-slate-900 text-sm">Manage Linked Banks</span>
                    </div>
                    <ArrowRight size={16} className="text-slate-400" />
                  </button>
                </div>
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
