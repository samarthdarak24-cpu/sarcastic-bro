'use client';

import { useEffect, useState } from 'react';
import farmerService from '@/services/farmer';
import { Wallet, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const data = await farmerService.getWallet();
      setWallet(data);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!wallet) {
    return <div className="p-6">Failed to load wallet</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Escrow Wallet</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Available Balance</span>
            <Wallet className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            ₹{wallet.availableBalance.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Ready to withdraw</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Held in Escrow</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            ₹{wallet.heldAmount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Pending delivery</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Released</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            ₹{wallet.releasedAmount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </div>
        <div className="divide-y">
          {wallet.wallet.transactions && wallet.wallet.transactions.length > 0 ? (
            wallet.wallet.transactions.map((txn: any) => (
              <div key={txn.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    txn.type === 'ADD_FUNDS' || txn.type === 'ESCROW_RELEASE' 
                      ? 'bg-green-100' 
                      : 'bg-red-100'
                  }`}>
                    {txn.type === 'ADD_FUNDS' || txn.type === 'ESCROW_RELEASE' ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {txn.type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(txn.createdAt).toLocaleString()}
                    </p>
                    {txn.description && (
                      <p className="text-sm text-gray-600 mt-1">{txn.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    txn.type === 'ADD_FUNDS' || txn.type === 'ESCROW_RELEASE'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {txn.type === 'ADD_FUNDS' || txn.type === 'ESCROW_RELEASE' ? '+' : '-'}
                    ₹{txn.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Balance: ₹{txn.balanceAfter.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How Escrow Works</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Payment is held in escrow when buyer places order</li>
          <li>• Funds are released after successful delivery</li>
          <li>• Available balance can be withdrawn to your bank account</li>
          <li>• All transactions are secure and tracked</li>
        </ul>
      </div>
    </div>
  );
}
