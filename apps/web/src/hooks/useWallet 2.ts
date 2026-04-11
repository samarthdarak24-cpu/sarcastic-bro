import { useState, useCallback } from 'react';
import buyerAPI, { Wallet, WalletTransaction } from '@/services/buyer';
import { toast } from 'react-hot-toast';

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await buyerAPI.getWallet();
      const data = response.data.data;
      setWallet(data);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch wallet';
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (page: number = 1, limit: number = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await buyerAPI.getTransactions({ page, limit });
      setTransactions(response.data.data.transactions || []);
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch transactions';
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addFunds = async (amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await buyerAPI.addFunds({ amount, method: 'MANUAL' });
      
      toast.success('Funds added successfully!');
      
      await Promise.all([fetchWallet(), fetchTransactions()]);
      
      return response.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to add funds';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };



  return {
    wallet,
    transactions,
    loading,
    error,
    fetchWallet,
    fetchTransactions,
    addFunds,
  };
};
