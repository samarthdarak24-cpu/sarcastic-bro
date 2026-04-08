import api from './api';

export const buyerEscrowService = {
  async getEscrowOrders(filters: { status?: string; page?: number; limit?: number }, token?: string) {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/trust/escrow/MY_ORDER`);
      const data = await response.json();
      return [
        {
          id: '1',
          orderId: data.order_id,
          amount: data.amount,
          status: data.status.includes('Locked') ? 'LOCKED' : 'RELEASED',
          blockchainTx: data.blockchain_tx
        }
      ];
    } catch (error) {
      console.error('Failed to get escrow orders:', error);
      return [];
    }
  },

  async createEscrow(data: {
    orderId: string;
    farmerId: string;
    amount: number;
  }, token?: string) {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/trust/escrow/${data.orderId}/pay?amount=${data.amount}`, {
        method: 'POST'
      });
      const res = await response.json();
      return res.data;
    } catch (error) {
      console.error('Failed to create escrow:', error);
      throw error;
    }
  },

  async confirmDelivery(id: string, token?: string) {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/trust/escrow/${id}/confirm`, {
        method: 'POST'
      });
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error('Failed to confirm delivery:', error);
      throw error;
    }
  },

  async raiseDispute(id: string, reason: string, token?: string) {
    try {
      const response = await api.put(`/buyer/escrow/${id}/dispute`, { reason });
      return response.data?.data || response.data || {};
    } catch (error) {
      console.error('Failed to raise dispute:', error);
      throw error;
    }
  }
};
