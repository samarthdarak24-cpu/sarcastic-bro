'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { 
  Loader2, Wallet as WalletIcon, ArrowDownCircle, 
  ArrowUpCircle, IndianRupee, Calendar 
} from 'lucide-react';

export default function FarmerWalletPage() {
  const { wallet, transactions, loading, fetchWallet, withdrawFunds } = useWallet();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      return;
    }

    if (wallet && amount > wallet.balance) {
      alert('Insufficient balance');
      return;
    }

    setWithdrawing(true);
    try {
      await withdrawFunds(amount);
      setWithdrawAmount('');
      setShowWithdrawModal(false);
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setWithdrawing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'ADD_FUNDS' || type === 'ESCROW_RELEASE') {
      return <ArrowDownCircle className="w-5 h-5 text-green-600" />;
    }
    return <ArrowUpCircle className="w-5 h-5 text-red-600" />;
  };

  const getTransactionColor = (type: string) => {
    if (type === 'ADD_FUNDS' || type === 'ESCROW_RELEASE') {
      return 'text-green-600';
    }
    return 'text-red-600';
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
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 mb-2">Available Balance</p>
            <p className="text-4xl font-bold">
              ₹{wallet?.balance.toLocaleString() || 0}
            </p>
          </div>
          <WalletIcon className="w-16 h-16 text-green-200 opacity-50" />
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={!wallet || wallet.balance <= 0}
            className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Withdraw to Bank
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
                    {transaction.type === 'DEBIT' || transaction.type === 'ESCROW_HOLD' ? '-' : '+'}
                    ₹{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Balance: ₹{transaction.balanceAfter.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Withdraw Funds</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Available: ₹{wallet?.balance.toLocaleString() || 0}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleWithdraw}
                disabled={withdrawing || !withdrawAmount}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {withdrawing ? 'Processing...' : 'Withdraw'}
              </button>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
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
