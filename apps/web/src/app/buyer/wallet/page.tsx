'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { 
  Loader2, Wallet as WalletIcon, ArrowDownCircle, 
  ArrowUpCircle, Plus, Calendar 
} from 'lucide-react';

export default function BuyerWalletPage() {
  const { wallet, transactions, loading, fetchWallet, fetchTransactions, addFunds } = useWallet();
  const [addAmount, setAddAmount] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, [fetchWallet, fetchTransactions]);

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0 || amount < 100) {
      alert('Minimum amount is ₹100');
      return;
    }

    setAdding(true);
    try {
      await addFunds(amount);
      setAddAmount('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Add funds failed:', error);
    } finally {
      setAdding(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'ADD_FUNDS' || type === 'REFUND') {
      return <ArrowDownCircle className="w-5 h-5 text-green-600" />;
    }
    return <ArrowUpCircle className="w-5 h-5 text-red-600" />;
  };

  const getTransactionColor = (type: string) => {
    if (type === 'ADD_FUNDS' || type === 'REFUND') {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const getTransactionSign = (type: string) => {
    if (type === 'ADD_FUNDS' || type === 'REFUND') {
      return '+';
    }
    return '-';
  };

  if (loading && !wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2">Available Balance</p>
            <p className="text-4xl font-bold">
              ₹{wallet?.balance.toLocaleString() || 0}
            </p>
          </div>
          <WalletIcon className="w-16 h-16 text-blue-200 opacity-50" />
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Funds
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description || transaction.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                    {getTransactionSign(transaction.type)}
                    ₹{transaction.amount.toLocaleString()}
                  </p>
                  {transaction.balanceAfter !== undefined && (
                    <p className="text-xs text-gray-500">
                      Balance: ₹{transaction.balanceAfter.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Funds Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Funds to Wallet</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum: ₹100
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                You will be redirected to Razorpay for secure payment
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddFunds}
                disabled={adding || !addAmount || parseFloat(addAmount) < 100}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? 'Processing...' : 'Proceed to Payment'}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddAmount('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
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
