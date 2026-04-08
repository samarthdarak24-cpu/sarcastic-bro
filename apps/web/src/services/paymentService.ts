import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Transaction {
  id: string;
  type: 'received' | 'sent' | 'pending' | 'refund';
  amount: number;
  from: string;
  to: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  method: 'UPI' | 'Bank Transfer' | 'NEFT' | 'RTGS' | 'Card' | 'Wallet';
  category: string;
  reference: string;
  description: string;
  userId: string;
}

export interface PaymentStats {
  totalReceived: number;
  totalSent: number;
  totalPending: number;
  netBalance: number;
  thisMonth: number;
  transactionCount: number;
  avgTransaction: number;
  successRate: number;
}

export interface CreatePaymentRequest {
  amount: number;
  to: string;
  method: 'UPI' | 'Bank Transfer' | 'NEFT' | 'RTGS' | 'Card' | 'Wallet';
  category: string;
  description: string;
}

export interface PaymentFilter {
  type?: 'received' | 'sent' | 'pending' | 'completed';
  status?: 'completed' | 'pending' | 'failed' | 'processing';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

class PaymentService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async getTransactions(filter?: PaymentFilter): Promise<Transaction[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.type) params.append('type', filter.type);
      if (filter?.status) params.append('status', filter.status);
      if (filter?.startDate) params.append('startDate', filter.startDate);
      if (filter?.endDate) params.append('endDate', filter.endDate);
      if (filter?.minAmount) params.append('minAmount', filter.minAmount.toString());
      if (filter?.maxAmount) params.append('maxAmount', filter.maxAmount.toString());

      const response = await axios.get(
        `${API_BASE_URL}/payments/transactions?${params.toString()}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/payments/transactions/${id}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  async getPaymentStats(): Promise<PaymentStats> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/payments/stats`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  }

  async createPayment(payment: CreatePaymentRequest): Promise<Transaction> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/create`,
        payment,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async initiatePayment(transactionId: string): Promise<{ paymentUrl: string; orderId: string }> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/initiate/${transactionId}`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<Transaction> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/verify`,
        { orderId, paymentId, signature },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  async cancelTransaction(id: string): Promise<Transaction> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/cancel/${id}`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error canceling transaction:', error);
      throw error;
    }
  }

  async exportTransactions(format: 'csv' | 'pdf' | 'excel', filter?: PaymentFilter): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      if (filter?.type) params.append('type', filter.type);
      if (filter?.status) params.append('status', filter.status);
      if (filter?.startDate) params.append('startDate', filter.startDate);
      if (filter?.endDate) params.append('endDate', filter.endDate);

      const response = await axios.get(
        `${API_BASE_URL}/payments/export?${params.toString()}`,
        {
          ...this.getAuthHeaders(),
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting transactions:', error);
      throw error;
    }
  }

  async requestRefund(transactionId: string, reason: string): Promise<Transaction> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/refund/${transactionId}`,
        { reason },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error requesting refund:', error);
      throw error;
    }
  }

  async getPaymentMethods(): Promise<Array<{ id: string; name: string; type: string; isDefault: boolean }>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/payments/methods`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  async addPaymentMethod(method: { type: string; details: any }): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/methods`,
        method,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
