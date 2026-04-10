'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, CheckCircle, XCircle, Clock, 
  Download, Filter, Calendar, Loader2 
} from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  paymentGateway: string;
  transactionId: string;
  createdAt: string;
  order?: {
    id: string;
    crop?: { cropName?: string };
    lot?: { cropName?: string };
  };
  seller?: {
    name: string;
  };
}

interface PaymentsSectionProps {
  payments: Payment[];
  loading: boolean;
  onRefresh: () => void;
}

export default function PaymentsSection({
  payments,
  loading,
  onRefresh
}: PaymentsSectionProps) {
  const [filter, setFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  const filteredPayments = payments.filter(payment => {
    if (filter !== 'all' && payment.status !== filter) return false;
    
    if (dateRange !== 'all') {
      const paymentDate = new Date(payment.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateRange === '7d' && daysDiff > 7) return false;
      if (dateRange === '30d' && daysDiff > 30) return false;
      if (dateRange === '90d' && daysDiff > 90) return false;
    }
    
    return true;
  });

  const completedPayments = payments.filter(p => p.status === 'COMPLETED');
  const pendingPayments = payments.filter(p => p.status === 'PENDING');
  const failedPayments = payments.filter(p => p.status === 'FAILED');
  
  const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const exportPayments = () => {
    const csv = [
      ['Date', 'Transaction ID', 'Amount', 'Status', 'Method', 'Seller'].join(','),
      ...filteredPayments.map(p => [
        new Date(p.createdAt).toLocaleDateString('en-IN'),
        p.transactionId,
        p.amount,
        p.status,
        p.paymentMethod,
        p.seller?.name || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Completed</span>
          </div>
          <p className="text-3xl font-bold">₹{totalPaid.toLocaleString('en-IN')}</p>
          <p className="text-sm opacity-90 mt-1">{completedPayments.length} payments</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Pending</span>
          </div>
          <p className="text-3xl font-bold">₹{totalPending.toLocaleString('en-IN')}</p>
          <p className="text-sm opacity-90 mt-1">{pendingPayments.length} payments</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Failed</span>
          </div>
          <p className="text-3xl font-bold">{failedPayments.length}</p>
          <p className="text-sm opacity-90 mt-1">Failed transactions</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-90">Total</span>
          </div>
          <p className="text-3xl font-bold">{payments.length}</p>
          <p className="text-sm opacity-90 mt-1">All transactions</p>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Status:</span>
            </div>
            {['all', 'COMPLETED', 'PENDING', 'FAILED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>

            <button
              onClick={exportPayments}
              className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-16">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Your payment history will appear here'
                : `No ${filter} payments found`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {payment.order?.crop?.cropName ||
                          payment.order?.lot?.cropName ||
                          'Payment'}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Method:</span> {payment.paymentMethod}
                      </div>
                      <div>
                        <span className="font-medium">Gateway:</span> {payment.paymentGateway}
                      </div>
                      <div>
                        <span className="font-medium">Transaction ID:</span> {payment.transactionId.substring(0, 12)}...
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>

                    {payment.seller && (
                      <p className="text-sm text-gray-600">
                        Paid to: <span className="font-medium">{payment.seller.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
