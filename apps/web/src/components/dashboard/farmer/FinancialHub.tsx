'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, DollarSign, TrendingUp, CreditCard, Shield, Clock,
  FileText, AlertCircle, CheckCircle, RefreshCw, Download,
  Send, ArrowUpRight, ArrowDownRight, Calendar, Filter,
  Search, MoreVertical, Eye, Lock, Unlock, Bell, Settings
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

  const tabs = [
    { id: 'overview', label: 'Financial Overview', icon: Wallet },
    { id: 'wallet', label: 'Digital Payment Center', icon: CreditCard },
    { id: 'escrow', label: 'Escrow Systems', icon: Shield },
    { id: 'schedule', label: 'Payment Schedule', icon: Calendar },
    { id: 'transactions', label: 'Transaction History', icon: FileText },
    { id: 'contracts', label: 'Smart Contracts', icon: Lock },
    { id: 'refunds', label: 'Refunds & Disputes', icon: AlertCircle },
  ];

  // Mock financial data
  const financialSummary = {
    totalBalance: 245680,
    pendingPayments: 45200,
    escrowBalance: 89500,
    monthlyRevenue: 156780,
    revenueGrowth: 12.5,
    successfulTransactions: 154,
    pendingTransactions: 8,
    failedTransactions: 2,
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

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Financial data refreshed');
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
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
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Financial Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <Wallet size={24} className="text-white" />
                      </div>
                      <TrendingUp size={20} className="text-green-600" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 mb-1">₹{(financialSummary.totalBalance / 1000).toFixed(0)}K</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">Total Balance</p>
                  </Card>

                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Clock size={24} className="text-white" />
                      </div>
                      <Clock size={20} className="text-blue-600" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 mb-1">₹{(financialSummary.pendingPayments / 1000).toFixed(0)}K</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">Pending Payments</p>
                  </Card>

                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <Shield size={24} className="text-white" />
                      </div>
                      <Shield size={20} className="text-purple-600" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 mb-1">₹{(financialSummary.escrowBalance / 1000).toFixed(0)}K</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">Escrow Balance</p>
                  </Card>

                  <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 bg-amber-500 rounded-xl flex items-center justify-center">
                        <TrendingUp size={24} className="text-white" />
                      </div>
                      <ArrowUpRight size={20} className="text-green-600" />
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
                        <div key={txn.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                              txn.type === 'credit' ? 'bg-green-100' : txn.type === 'debit' ? 'bg-red-100' : 'bg-amber-100'
                            }`}>
                              {txn.type === 'credit' ? (
                                <ArrowDownRight size={20} className="text-green-600" />
                              ) : txn.type === 'debit' ? (
                                <ArrowUpRight size={20} className="text-red-600" />
                              ) : (
                                <Clock size={20} className="text-amber-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{txn.description}</p>
                              <p className="text-xs text-slate-500">{txn.buyer} • {txn.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-black text-lg ${
                              txn.type === 'credit' ? 'text-green-600' : txn.type === 'debit' ? 'text-red-600' : 'text-amber-600'
                            }`}>
                              {txn.type === 'debit' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                            </p>
                            <Badge tone={txn.status === 'completed' ? 'brand' : 'amber'} className="text-xs">
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
                        <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{payment.buyer}</p>
                              <p className="text-xs text-slate-500">Due: {payment.dueDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-lg text-blue-600">₹{payment.amount.toLocaleString()}</p>
                            <Badge tone={payment.status === 'pending' ? 'amber' : 'brand'} className="text-xs">
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
                      { icon: Send, label: 'Send Money', color: 'blue' },
                      { icon: Download, label: 'Withdraw', color: 'green' },
                      { icon: FileText, label: 'Generate Invoice', color: 'purple' },
                      { icon: Settings, label: 'Settings', color: 'slate' },
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        className="flex flex-col items-center gap-3 p-6 bg-white hover:bg-slate-50 rounded-2xl transition-all hover:shadow-lg"
                      >
                        <div className={`h-14 w-14 bg-${action.color}-100 rounded-xl flex items-center justify-center`}>
                          <action.icon size={28} className={`text-${action.color}-600`} />
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{action.label}</span>
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
        </div>
      </div>
    </div>
  );
}
