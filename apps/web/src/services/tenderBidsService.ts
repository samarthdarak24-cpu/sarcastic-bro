const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Tender {
  id: string;
  title: string;
  buyer: string;
  product: string;
  quantity: number;
  unit: string;
  budget: number;
  deadline: string;
  status: 'open' | 'closing_soon' | 'closed';
  bidsCount: number;
  matchScore: number;
  aiRecommendation: string;
}

export interface Bid {
  id: string;
  tenderId: string;
  tenderTitle: string;
  amount: number;
  quantity: number;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: string;
  winProbability: number;
  rank: number;
  totalBids: number;
}

export interface BidAnalytics {
  totalBids: number;
  activeBids: number;
  wonBids: number;
  winRate: number;
  totalValue: number;
  avgBidAmount: number;
  competitorAvg: number;
  optimalRange: { min: number; max: number };
}

export interface AISuggestion {
  suggestedAmount: number;
  confidence: number;
  reasoning: string;
}

export interface BidPrediction {
  winProbability: number;
  expectedRank: number;
  totalBids: number;
  competitiveAdvantage: number;
  recommendation: string;
}

class TenderBidsService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getMarketplace(): Promise<Tender[]> {
    try {
      const response = await fetch(`${API_URL}/tenders/marketplace`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch marketplace');

      const data = await response.json();
      return data.tenders;
    } catch (error) {
      console.error('Get marketplace error:', error);
      return this.getMockMarketplace();
    }
  }

  async getMyBids(): Promise<Bid[]> {
    try {
      const response = await fetch(`${API_URL}/tenders/my-bids`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch bids');

      const data = await response.json();
      return data.bids;
    } catch (error) {
      console.error('Get my bids error:', error);
      return this.getMockBids();
    }
  }

  async getAnalytics(): Promise<BidAnalytics> {
    try {
      const response = await fetch(`${API_URL}/tenders/analytics`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      return data.analytics;
    } catch (error) {
      console.error('Get analytics error:', error);
      return this.getMockAnalytics();
    }
  }

  async getAISuggestion(tenderId: string): Promise<AISuggestion> {
    try {
      const response = await fetch(`${API_URL}/tenders/ai-suggest`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ tenderId })
      });

      if (!response.ok) throw new Error('Failed to get AI suggestion');

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI suggestion error:', error);
      return {
        suggestedAmount: 85000,
        confidence: 82,
        reasoning: 'Based on market analysis and competitor behavior'
      };
    }
  }

  async submitBid(tenderId: string, amount: number, quantity: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/tenders/submit-bid`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ tenderId, amount, quantity })
      });

      return response.ok;
    } catch (error) {
      console.error('Submit bid error:', error);
      return false;
    }
  }

  async predictOutcome(tenderId: string, bidAmount: number): Promise<BidPrediction> {
    try {
      const response = await fetch(`${API_URL}/tenders/predict-outcome`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ tenderId, bidAmount })
      });

      if (!response.ok) throw new Error('Failed to predict outcome');

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Predict outcome error:', error);
      return {
        winProbability: 65,
        expectedRank: 3,
        totalBids: 12,
        competitiveAdvantage: 8,
        recommendation: 'Good position. Consider submitting this bid.'
      };
    }
  }

  async withdrawBid(bidId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/tenders/withdraw-bid`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ bidId })
      });

      return response.ok;
    } catch (error) {
      console.error('Withdraw bid error:', error);
      return false;
    }
  }

  async createTender(tenderData: any): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/tenders/create`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(tenderData)
      });

      return response.ok;
    } catch (error) {
      console.error('Create tender error:', error);
      return false;
    }
  }

  // Mock data for development
  private getMockMarketplace(): Tender[] {
    return [
      {
        id: '1',
        title: 'Premium Basmati Rice - Bulk Order',
        buyer: 'AgriCorp International',
        product: 'Basmati Rice',
        quantity: 5000,
        unit: 'kg',
        budget: 450000,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        bidsCount: 8,
        matchScore: 92,
        aiRecommendation: 'Highly recommended! This tender matches your profile perfectly.'
      },
      {
        id: '2',
        title: 'Organic Wheat Supply Contract',
        buyer: 'FreshMart Retail Chain',
        product: 'Organic Wheat',
        quantity: 10000,
        unit: 'kg',
        budget: 280000,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'closing_soon',
        bidsCount: 15,
        matchScore: 78,
        aiRecommendation: 'Good opportunity. Consider bidding competitively.'
      },
      {
        id: '3',
        title: 'Fresh Tomatoes - Weekly Supply',
        buyer: 'Metro Foods Ltd',
        product: 'Tomatoes',
        quantity: 2000,
        unit: 'kg',
        budget: 60000,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        bidsCount: 5,
        matchScore: 85,
        aiRecommendation: 'Excellent match! High demand product in your area.'
      },
      {
        id: '4',
        title: 'Premium Mangoes - Export Quality',
        buyer: 'Global Fruits Export',
        product: 'Alphonso Mangoes',
        quantity: 1500,
        unit: 'kg',
        budget: 225000,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        bidsCount: 12,
        matchScore: 88,
        aiRecommendation: 'Premium opportunity with high margins.'
      }
    ];
  }

  private getMockBids(): Bid[] {
    return [
      {
        id: '1',
        tenderId: '1',
        tenderTitle: 'Premium Basmati Rice - Bulk Order',
        amount: 425000,
        quantity: 5000,
        status: 'pending',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        winProbability: 78,
        rank: 2,
        totalBids: 8
      },
      {
        id: '2',
        tenderId: '3',
        tenderTitle: 'Fresh Tomatoes - Weekly Supply',
        amount: 55000,
        quantity: 2000,
        status: 'accepted',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        winProbability: 95,
        rank: 1,
        totalBids: 5
      },
      {
        id: '3',
        tenderId: '2',
        tenderTitle: 'Organic Wheat Supply Contract',
        amount: 265000,
        quantity: 10000,
        status: 'rejected',
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        winProbability: 42,
        rank: 8,
        totalBids: 15
      }
    ];
  }

  private getMockAnalytics(): BidAnalytics {
    return {
      totalBids: 24,
      activeBids: 6,
      wonBids: 15,
      winRate: 62,
      totalValue: 5850000,
      avgBidAmount: 243750,
      competitorAvg: 265000,
      optimalRange: {
        min: 225250,
        max: 251750
      }
    };
  }
}

export const tenderBidsService = new TenderBidsService();
