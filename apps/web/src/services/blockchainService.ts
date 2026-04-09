import api from './api';

export interface BlockchainRecord {
  id: string;
  transactionHash: string;
  blockNumber: number;
  type: 'PRODUCT' | 'ORDER' | 'PAYMENT' | 'QUALITY';
  data: any;
  timestamp: string;
}

export interface EscrowContract {
  id: string;
  orderId: string;
  amount: number;
  status: 'CREATED' | 'FUNDED' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';
  buyerAddress: string;
  sellerAddress: string;
  contractAddress: string;
  createdAt: string;
}

export const blockchainService = {
  // Get blockchain records
  async getRecords(entityId: string, entityType: string): Promise<BlockchainRecord[]> {
    try {
      const response = await api.get(`/blockchain/records/${entityType}/${entityId}`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('getRecords error:', error);
      return [];
    }
  },

  // Get reputation record
  async getReputationRecord(userId: string): Promise<any> {
    try {
      const response = await api.get(`/blockchain/reputation/${userId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('getReputationRecord error:', error);
      return null;
    }
  },

  // Create blockchain record
  async createRecord(data: {
    type: string;
    entityId: string;
    data: any;
  }): Promise<BlockchainRecord> {
    const response = await api.post('/blockchain/records', data);
    return response.data;
  },

  // Verify record
  async verifyRecord(transactionHash: string): Promise<boolean> {
    const response = await api.get(`/blockchain/verify/${transactionHash}`);
    return response.data.verified;
  },

  // Get escrow contracts
  async getEscrowContracts(): Promise<EscrowContract[]> {
    const response = await api.get("/blockchain/escrow");
    return response.data;
  },

  // Create escrow contract
  async createEscrow(orderId: string): Promise<EscrowContract> {
    const response = await api.post('/blockchain/escrow', { orderId });
    return response.data;
  },

  // Release escrow
  async releaseEscrow(escrowId: string): Promise<EscrowContract> {
    const response = await api.post(`/blockchain/escrow/${escrowId}/release`);
    return response.data;
  },

  // Dispute escrow
  async disputeEscrow(escrowId: string, reason: string): Promise<EscrowContract> {
    const response = await api.post(`/blockchain/escrow/${escrowId}/dispute`, { reason });
    return response.data;
  },

  // Get fraud score
  async getFraudScore(userId: string): Promise<any> {
    try {
      const response = await api.get(`/blockchain/fraud-score/${userId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('getFraudScore error:', error);
      return null;
    }
  },

  // Get trust rating
  async getTrustRating(userId: string): Promise<any> {
    try {
      const response = await api.get(`/blockchain/trust-rating/${userId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('getTrustRating error:', error);
      return null;
    }
  }
};

