'use client';

import { useState } from 'react';
import { Wallet, WalletTransaction } from '@/services/buyer';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  Loader2,
  Plus,
  RefreshCw,
  Wallet as WalletIcon,
} from 'lucide-react';

interface WalletSectionProps {
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  loading: boolean;
  onAddFunds: (amount: number) => Promise<void>;
  onRefresh: () => void;
}

const CREDIT_TYPES = new Set(['ADD_FUNDS', 'REFUND']);
const QUICK_AMOUNTS = [1000, 5000, 10000, 25000];

function formatCurrency(amount: number) {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}

export default function WalletSection({
  wallet,
  transactions,
  loading,
  onAddFunds,
  onRefresh,
}: WalletSectionProps) {
  const [addAmount, setAddAmount] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  const totalAdded = transactions
    .filter((transaction) => CREDIT_TYPES.has(transaction.type))
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalSpent = transactions
    .filter((transaction) => !CREDIT_TYPES.has(transaction.type))
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const escrowHold = wallet?.heldBalance || 0;

  const handleAddFunds = async () => {
    const amount = Number.parseFloat(addAmount);

    if (!amount || amount < 100) {
      window.alert('Minimum amount is Rs. 100');
      return;
    }

    setAdding(true);
    try {
      await onAddFunds(amount);
      setAddAmount('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Add funds failed:', error);
    } finally {
      setAdding(false);
    }
  };

  const getTransactionColor = (type: string) => {
    return CREDIT_TYPES.has(type) ? 'text-emerald-600' : 'text-rose-600';
  };

  const getTransactionIcon = (type: string) => {
    return CREDIT_TYPES.has(type) ? (
      <ArrowDownCircle className="h-5 w-5 text-emerald-600" />
    ) : (
      <ArrowUpCircle className="h-5 w-5 text-rose-600" />
    );
  };

  const getTransactionSign = (type: string) => {
    return CREDIT_TYPES.has(type) ? '+' : '-';
  };

  if (loading && !wallet) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-8 text-white shadow-xl">
        <div className="absolute -right-20 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">
              Live balance
            </p>
            <h3 className="mt-3 text-5xl font-black">
              {formatCurrency(wallet?.balance || 0)}
            </h3>
            <p className="mt-3 max-w-xl text-sm text-emerald-100">
              Add funds, monitor escrow holdbacks, and keep every transaction visible from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4" />
              Add funds
            </button>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: 'Total added',
            value: formatCurrency(totalAdded),
            color: 'from-emerald-500 to-green-600',
          },
          {
            label: 'Total spent',
            value: formatCurrency(totalSpent),
            color: 'from-rose-500 to-orange-500',
          },
          {
            label: 'In escrow',
            value: formatCurrency(escrowHold),
            color: 'from-amber-500 to-orange-500',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color}`}
            >
              <WalletIcon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">Transaction history</h3>
            <p className="text-sm text-slate-500">
              Credits, order holds, and releases update here in real time.
            </p>
          </div>

          <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {transactions.length} entries
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="px-8 py-14 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <WalletIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Your wallet is ready</h4>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Add funds to start placing protected orders and to unlock your live transaction ledger.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      CREDIT_TYPES.has(transaction.type) ? 'bg-emerald-50' : 'bg-rose-50'
                    }`}
                  >
                    {getTransactionIcon(transaction.type)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {transaction.description || transaction.type.replace(/_/g, ' ')}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(transaction.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <p className={`text-lg font-black ${getTransactionColor(transaction.type)}`}>
                    {getTransactionSign(transaction.type)}
                    {formatCurrency(transaction.amount)}
                  </p>
                  {typeof transaction.balanceAfter === 'number' && (
                    <p className="text-xs text-slate-500">
                      Balance after: {formatCurrency(transaction.balanceAfter)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Add funds</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Top up your wallet instantly to keep orders moving.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setAddAmount('');
                }}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {QUICK_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setAddAmount(String(amount))}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Quick add
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-900">{formatCurrency(amount)}</p>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Amount</label>
              <input
                type="number"
                value={addAmount}
                onChange={(event) => setAddAmount(event.target.value)}
                min="100"
                placeholder="Enter amount"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition-colors focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
              <p className="mt-2 text-xs text-slate-500">Minimum top-up amount: Rs. 100</p>
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-4">
              <p className="text-sm font-medium text-emerald-800">
                Funds are added immediately in demo mode so you can continue your buyer flow without leaving the dashboard.
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={handleAddFunds}
                disabled={adding || !addAmount || Number.parseFloat(addAmount) < 100}
                className="flex-1 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {adding ? 'Processing...' : 'Add funds'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setAddAmount('');
                }}
                className="flex-1 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
