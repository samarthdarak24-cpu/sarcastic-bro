'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, Lock, CheckCircle, Clock, AlertCircle, TrendingUp,
  DollarSign, Shield, Users, BarChart3, Zap, Eye,
  FileText, Smartphone, Settings, Activity, Wallet
} from 'lucide-react';
import { PremiumFeatureLayout, PremiumCard, MetricDisplay, ActionButton } from './shared/PremiumFeatureLayout';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const subFeatures = [
  { id: 'payment-gateway', name: 'Payment Gateway', icon: CreditCard, description: 'Secure payment processing', color: 'blue' },
  { id: 'escrow-management', name: 'Escrow Management', icon: Lock, description: 'Funds in escrow', color: 'indigo', badge: 'NEW' },
  { id: 'release-conditions', name: 'Release Conditions', icon: CheckCircle, description: 'Smart release rules', color: 'emerald' },
  { id: 'payment-schedule', name: 'Payment Schedule', icon: Clock, description: 'Scheduled payments', color: 'purple' },
  { id: 'dispute-claims', name: 'Dispute Claims', icon: AlertCircle, description: 'Handle disputes', color: 'rose' },
  { id: 'refund-policy', name: 'Refund Policy', icon: DollarSign, description: 'Refund management', color: 'amber' },
  { id: 'payment-analytics', name: 'Payment Analytics', icon: BarChart3, description: 'Payment insights', color: 'cyan' },
  { id: 'multi-currency', name: 'Multi-Currency', icon: Wallet, description: 'Multiple currencies', color: 'teal' },
  { id: 'invoice-management', name: 'Invoice Management', icon: FileText, description: 'Digital invoices', color: 'violet' },
  { id: 'payment-history', name: 'Payment History', icon: Activity, description: 'Transaction logs', color: 'orange' },
  { id: 'security-verification', name: 'Security Verification', icon: Shield, description: '2FA & verification', color: 'pink' },
  { id: 'mobile-payments', name: 'Mobile Payments', icon: Smartphone, description: 'Mobile payment app', color: 'red' }
];

const stats = [
  { label: 'Total Escrow', value: '₹45.2L', icon: Wallet, color: 'blue', trend: '+12%' },
  { label: 'Transactions', value: '1,247', icon: CreditCard, color: 'emerald', trend: '+18%' },
  { label: 'Avg Release Time', value: '2.3 hrs', icon: Clock, color: 'purple', trend: '-8%' },
  { label: 'Success Rate', value: '99.8%', icon: CheckCircle, color: 'indigo', trend: '+0.2%' }
];

export default function EscrowPaymentsAdvanced() {
  const renderSubFeature = (subFeatureId: string) => {
    switch (subFeatureId) {
      case 'payment-gateway':
        return <PaymentGateway />;
      case 'escrow-management':
        return <EscrowManagement />;
      case 'release-conditions':
        return <ReleaseConditions />;
      case 'payment-schedule':
        return <PaymentSchedule />;
      case 'dispute-claims':
        return <DisputeClaims />;
      case 'refund-policy':
        return <RefundPolicy />;
      case 'payment-analytics':
        return <PaymentAnalytics />;
      case 'multi-currency':
        return <MultiCurrency />;
      case 'invoice-management':
        return <InvoiceManagement />;
      case 'payment-history':
        return <PaymentHistory />;
      case 'security-verification':
        return <SecurityVerification />;
      case 'mobile-payments':
        return <MobilePayments />;
      default:
        return <PaymentGateway />;
    }
  };

  return (
    <PremiumFeatureLayout
      title="Escrow Payments"
      description="Secure payment processing with smart escrow management"
      icon={CreditCard}
      subFeatures={subFeatures}
      renderSubFeature={renderSubFeature}
      stats={stats}
    />
  );
}

function PaymentGateway() {
  const paymentMethods = [
    { id: 1, method: 'Credit Card', last4: '4242', expiry: '12/25', default: true },
    { id: 2, method: 'Bank Transfer', account: 'HDFC...1234', default: false },
    { id: 3, method: 'UPI', upiId: 'buyer@upi', default: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Payment Gateway</h2>
          <p className="text-slate-500 font-medium mt-1">Secure payment methods</p>
        </div>
        <ActionButton variant="primary" icon={CreditCard}>Add Payment Method</ActionButton>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method, idx) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">{method.method}</h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {method.last4 && `•••• ${method.last4}`}
                    {method.account && method.account}
                    {method.upiId && method.upiId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {method.default && (
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-black uppercase">
                    Default
                  </div>
                )}
                <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50">
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EscrowManagement() {
  const escrowAccounts = [
    { id: 1, order: 'ORD-001', amount: '₹50,000', status: 'held', releaseDate: '2024-01-20', condition: 'Delivery confirmed' },
    { id: 2, order: 'ORD-002', amount: '₹75,000', status: 'held', releaseDate: '2024-01-22', condition: 'Quality verified' },
    { id: 3, order: 'ORD-003', amount: '₹30,000', status: 'released', releaseDate: '2024-01-18', condition: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Escrow Management</h2>
        <p className="text-slate-500 font-medium mt-1">Monitor funds held in escrow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard>
          <MetricDisplay label="Total Held" value="₹1.55L" icon={Lock} color="blue" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Pending Release" value="2" icon={Clock} color="purple" />
        </PremiumCard>
        <PremiumCard>
          <MetricDisplay label="Released" value="₹30K" icon={CheckCircle} color="emerald" />
        </PremiumCard>
      </div>

      <div className="space-y-3">
        {escrowAccounts.map((account, idx) => (
          <PremiumCard key={account.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">{account.order}</h3>
                <p className="text-sm text-slate-600 font-medium">{account.condition}</p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                account.status === 'held' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {account.status}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black text-slate-900">{account.amount}</div>
              <div className="text-sm text-slate-500 font-medium">Release: {account.releaseDate}</div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function ReleaseConditions() {
  const conditions = [
    { id: 1, condition: 'Delivery Confirmed', status: 'pending', weight: 'Critical' },
    { id: 2, condition: 'Quality Verified', status: 'pending', weight: 'High' },
    { id: 3, condition: 'Invoice Received', status: 'completed', weight: 'Medium' },
    { id: 4, condition: 'Payment Authorized', status: 'completed', weight: 'High' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Release Conditions</h2>
        <p className="text-slate-500 font-medium mt-1">Smart conditions for fund release</p>
      </div>

      <div className="space-y-3">
        {conditions.map((cond, idx) => (
          <motion.div
            key={cond.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-black text-white ${
                  cond.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-300'
                }`}>
                  {cond.status === 'completed' ? <CheckCircle size={20} /> : idx + 1}
                </div>
                <div>
                  <h3 className="font-black text-slate-900">{cond.condition}</h3>
                  <p className="text-xs text-slate-500 font-medium">Weight: {cond.weight}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                cond.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {cond.status}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PaymentSchedule() {
  const schedule = [
    { date: '2024-01-20', amount: '₹25,000', status: 'pending', description: '50% on delivery' },
    { date: '2024-01-25', amount: '₹25,000', status: 'pending', description: '50% on verification' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Payment Schedule</h2>
        <p className="text-slate-500 font-medium mt-1">Scheduled payment milestones</p>
      </div>

      <div className="space-y-4">
        {schedule.map((item, idx) => (
          <PremiumCard key={idx} className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">{item.description}</h3>
                <p className="text-sm text-slate-600 font-medium mt-1">{item.date}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-purple-600">{item.amount}</div>
                <div className={`text-xs font-black uppercase mt-1 ${
                  item.status === 'pending' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {item.status}
                </div>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function DisputeClaims() {
  return (
    <div className="text-center py-20">
      <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
      <h2 className="text-2xl font-black text-slate-900">Dispute Claims</h2>
      <p className="text-slate-500 font-medium mt-2">No active disputes</p>
      <ActionButton variant="primary" icon={AlertCircle} className="mt-6 mx-auto">File a Dispute</ActionButton>
    </div>
  );
}

function RefundPolicy() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Refund Policy</h2>
        <p className="text-slate-500 font-medium mt-1">Refund terms and conditions</p>
      </div>

      <div className="space-y-4">
        <PremiumCard className="p-6 bg-gradient-to-br from-emerald-50 to-green-50">
          <h3 className="font-black text-slate-900 mb-3">Full Refund Eligible</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              <span className="text-slate-700 font-medium">Within 7 days of delivery</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              <span className="text-slate-700 font-medium">Product in original condition</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              <span className="text-slate-700 font-medium">Quality issues verified</span>
            </li>
          </ul>
        </PremiumCard>
      </div>
    </div>
  );
}

function PaymentAnalytics() {
  const chartData = [
    { month: 'Jan', payments: 45, amount: 125000 },
    { month: 'Feb', payments: 52, amount: 145000 },
    { month: 'Mar', payments: 48, amount: 135000 },
    { month: 'Apr', payments: 61, amount: 165000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Payment Analytics</h2>
        <p className="text-slate-500 font-medium mt-1">Payment trends and insights</p>
      </div>

      <PremiumCard className="p-8">
        <h3 className="text-lg font-black text-slate-900 mb-6">Monthly Payment Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="payments" fill="#3b82f6" name="Transactions" />
          </BarChart>
        </ResponsiveContainer>
      </PremiumCard>
    </div>
  );
}

function MultiCurrency() {
  const currencies = [
    { code: 'INR', symbol: '₹', rate: 1, balance: '₹45,200' },
    { code: 'USD', symbol: '$', rate: 83.5, balance: '$542' },
    { code: 'EUR', symbol: '€', rate: 91.2, balance: '€320' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Multi-Currency Support</h2>
        <p className="text-slate-500 font-medium mt-1">Manage multiple currencies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currencies.map((curr, idx) => (
          <PremiumCard key={curr.code} className="p-6">
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900 mb-2">{curr.symbol}</div>
              <h3 className="font-black text-slate-900 mb-1">{curr.code}</h3>
              <p className="text-sm text-slate-600 font-medium">{curr.balance}</p>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function InvoiceManagement() {
  const invoices = [
    { id: 'INV-001', date: '2024-01-15', amount: '₹50,000', status: 'paid' },
    { id: 'INV-002', date: '2024-01-16', amount: '₹75,000', status: 'pending' },
    { id: 'INV-003', date: '2024-01-17', amount: '₹30,000', status: 'paid' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Invoice Management</h2>
          <p className="text-slate-500 font-medium mt-1">Digital invoices and receipts</p>
        </div>
        <ActionButton variant="primary" icon={FileText}>Download All</ActionButton>
      </div>

      <div className="space-y-3">
        {invoices.map((inv, idx) => (
          <PremiumCard key={inv.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">{inv.id}</h3>
                <p className="text-sm text-slate-600 font-medium">{inv.date}</p>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-900">{inv.amount}</div>
                <div className={`text-xs font-black uppercase ${
                  inv.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {inv.status}
                </div>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function PaymentHistory() {
  const history = [
    { id: 1, type: 'Payment Sent', amount: '₹50,000', date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'Refund Received', amount: '₹5,000', date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'Payment Held', amount: '₹75,000', date: '2024-01-13', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Payment History</h2>
        <p className="text-slate-500 font-medium mt-1">Complete transaction logs</p>
      </div>

      <div className="space-y-3">
        {history.map((item, idx) => (
          <PremiumCard key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">{item.type}</h3>
                  <p className="text-xs text-slate-500 font-medium">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-900">{item.amount}</div>
                <div className={`text-xs font-black uppercase ${
                  item.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {item.status}
                </div>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}

function SecurityVerification() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Security Verification</h2>
        <p className="text-slate-500 font-medium mt-1">Two-factor authentication and verification</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard className="p-6 bg-gradient-to-br from-emerald-50 to-green-50">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-emerald-600" size={28} />
            <h3 className="text-lg font-black text-slate-900">2FA Enabled</h3>
          </div>
          <p className="text-sm text-slate-600 font-medium">Your account is protected with two-factor authentication</p>
        </PremiumCard>

        <PremiumCard className="p-6">
          <ActionButton variant="primary" icon={Shield}>Configure 2FA</ActionButton>
        </PremiumCard>
      </div>
    </div>
  );
}

function MobilePayments() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Mobile Payments</h2>
        <p className="text-slate-500 font-medium mt-1">Pay on the go with our mobile app</p>
      </div>

      <div className="flex justify-center">
        <div className="h-80 w-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center text-white">
          <Smartphone size={80} />
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <ActionButton variant="primary">Download iOS</ActionButton>
        <ActionButton variant="secondary">Download Android</ActionButton>
      </div>
    </div>
  );
}
