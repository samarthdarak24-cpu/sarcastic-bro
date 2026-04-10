import api from './api';

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description?: string;
  referenceId?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  transactions: WalletTransaction[];
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

class WalletService {
  async getWallet(): Promise<Wallet> {
    const response = await api.get('/api/wallet');
    return response.data.wallet;
  }

  async getTransactions(limit: number = 50, offset: number = 0): Promise<{ transactions: WalletTransaction[]; total: number }> {
    const response = await api.get(`/api/wallet/transactions?limit=${limit}&offset=${offset}`);
    return response.data;
  }

  async createAddFundsOrder(amount: number): Promise<{ order: RazorpayOrder; key: string }> {
    const response = await api.post('/api/wallet/add-funds/create-order', { amount });
    return response.data;
  }

  async verifyAndAddFunds(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
  }): Promise<{ newBalance: number }> {
    const response = await api.post('/api/wallet/add-funds/verify', paymentData);
    return response.data;
  }

  async withdrawFunds(amount: number): Promise<{ newBalance: number }> {
    const response = await api.post('/api/wallet/withdraw', { amount });
    return response.data;
  }
}

export const walletService = new WalletService();
