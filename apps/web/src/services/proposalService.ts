import api from './api';

export interface Proposal {
  id: string;
  senderId: string;
  receiverId: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTER' | 'EXPIRED';
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
  product?: any;
  sender?: any;
  receiver?: any;
}

export interface CreateProposalData {
  receiverId: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  message?: string;
  validUntil?: string;
}

export const proposalService = {
  // Get all proposals for current user
  async getMyProposals(): Promise<{ proposals: Proposal[] }> {
    try {
      const response = await api.get('/proposals/my-proposals');
      return { proposals: response.data.data || response.data || [] };
    } catch (error) {
      console.error('getMyProposals error:', error);
      return { proposals: [] };
    }
  },

  // Get sent proposals
  async getSentProposals(): Promise<{ proposals: Proposal[] }> {
    try {
      const response = await api.get('/proposals/sent');
      return { proposals: response.data.data || response.data || [] };
    } catch (error) {
      console.error('getSentProposals error:', error);
      return { proposals: [] };
    }
  },

  // Get received proposals
  async getReceivedProposals(): Promise<{ proposals: Proposal[] }> {
    try {
      const response = await api.get('/proposals/received');
      return { proposals: response.data.data || response.data || [] };
    } catch (error) {
      console.error('getReceivedProposals error:', error);
      return { proposals: [] };
    }
  },

  // Get single proposal
  async getProposal(id: string): Promise<Proposal> {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
  },

  // Create proposal
  async createProposal(data: CreateProposalData): Promise<Proposal> {
    const totalPrice = data.quantity * data.pricePerUnit;
    const response = await api.post('/proposals', {
      ...data,
      totalPrice
    });
    return response.data;
  },

  // Update proposal status
  async updateStatus(id: string, status: Proposal['status'], message?: string): Promise<Proposal> {
    const response = await api.patch(`/proposals/${id}/status`, { status, message });
    return response.data;
  },

  // Accept proposal
  async acceptProposal(id: string): Promise<Proposal> {
    return this.updateStatus(id, 'ACCEPTED');
  },

  // Reject proposal
  async rejectProposal(id: string, reason?: string): Promise<Proposal> {
    return this.updateStatus(id, 'REJECTED', reason);
  },

  // Counter proposal
  async counterProposal(id: string, newPrice: number, message?: string): Promise<Proposal> {
    const response = await api.post(`/proposals/${id}/counter`, {
      pricePerUnit: newPrice,
      message
    });
    return response.data;
  },

  // Delete proposal
  async deleteProposal(id: string): Promise<void> {
    await api.delete(`/proposals/${id}`);
  },

  // Get proposal statistics
  async getProposalStats(): Promise<any> {
    try {
      const response = await api.get('/proposals/stats');
      return response.data.data || response.data;
    } catch (error) {
      console.error('getProposalStats error:', error);
      return null;
    }
  }
};
