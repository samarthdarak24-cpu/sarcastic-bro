import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  maxPrice: number;
  minPrice?: number;
  status: 'OPEN' | 'CLOSED' | 'AWARDED' | 'CANCELLED';
  deadline: string;
  location?: string;
  requirements?: string;
  documents?: string[];
  creatorId: string;
  creatorName?: string;
  createdAt: string;
  updatedAt: string;
  bidsCount?: number;
  viewsCount?: number;
}

export interface Bid {
  id: string;
  tenderId: string;
  tenderTitle?: string;
  applicantId: string;
  applicantName?: string;
  priceOffer: number;
  quantity: number;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  documents?: string[];
  deliveryTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenderStats {
  activeTenders: number;
  myBids: number;
  wonTenders: number;
  totalValue: number;
  successRate: number;
  avgBidValue: number;
  pendingBids: number;
  rejectedBids: number;
}

export interface CreateTenderRequest {
  title: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  maxPrice: number;
  minPrice?: number;
  deadline: string;
  location?: string;
  requirements?: string;
}

export interface CreateBidRequest {
  tenderId: string;
  priceOffer: number;
  quantity: number;
  message?: string;
  deliveryTime?: number;
}

class TenderBidsService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  // Tender Methods
  async getAllTenders(filter?: { status?: string; category?: string }): Promise<Tender[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.status) params.append('status', filter.status);
      if (filter?.category) params.append('category', filter.category);

      const response = await axios.get(
        `${API_BASE_URL}/tenders?${params.toString()}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tenders:', error);
      throw error;
    }
  }

  async getTenderById(id: string): Promise<Tender> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/tenders/${id}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tender:', error);
      throw error;
    }
  }

  async createTender(tender: CreateTenderRequest): Promise<Tender> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tenders`,
        tender,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating tender:', error);
      throw error;
    }
  }

  async updateTender(id: string, updates: Partial<CreateTenderRequest>): Promise<Tender> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/tenders/${id}`,
        updates,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating tender:', error);
      throw error;
    }
  }

  async closeTender(id: string): Promise<Tender> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tenders/${id}/close`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error closing tender:', error);
      throw error;
    }
  }

  async cancelTender(id: string): Promise<Tender> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tenders/${id}/cancel`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error canceling tender:', error);
      throw error;
    }
  }

  // Bid Methods
  async getMyBids(): Promise<Bid[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/tenders/bids/my-bids`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching my bids:', error);
      throw error;
    }
  }

  async getTenderBids(tenderId: string): Promise<Bid[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/tenders/${tenderId}/bids`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tender bids:', error);
      throw error;
    }
  }

  async createBid(bid: CreateBidRequest): Promise<Bid> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tenders/bids`,
        bid,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating bid:', error);
      throw error;
    }
  }

  async updateBid(id: string, updates: Partial<CreateBidRequest>): Promise<Bid> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/tenders/bids/${id}`,
        updates,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating bid:', error);
      throw error;
    }
  }

  async withdrawBid(id: string): Promise<Bid> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tenders/bids/${id}/withdraw`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error withdrawing bid:', error);
      throw error;
    }
  }

  async acceptBid(id: string): Promise<Bid> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tenders/bids/${id}/accept`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error accepting bid:', error);
      throw error;
    }
  }

  async rejectBid(id: string, reason?: string): Promise<Bid> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tenders/bids/${id}/reject`,
        { reason },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error rejecting bid:', error);
      throw error;
    }
  }

  // Statistics
  async getTenderStats(): Promise<TenderStats> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/tenders/stats`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tender stats:', error);
      throw error;
    }
  }

  // Won Tenders
  async getWonTenders(): Promise<Tender[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/tenders/won`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching won tenders:', error);
      throw error;
    }
  }
}

export const tenderBidsService = new TenderBidsService();
