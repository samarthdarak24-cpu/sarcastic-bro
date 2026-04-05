import api from './api';

export interface Review {
  id: string;
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  type: 'BUYER_TO_FARMER' | 'FARMER_TO_BUYER';
  createdAt: string;
  reviewer?: any;
  reviewee?: any;
}

export interface ReputationScore {
  userId: string;
  overallRating: number;
  totalReviews: number;
  qualityRating: number;
  deliveryRating: number;
  communicationRating: number;
  trustScore: number;
}

export const reviewService = {
  // Get reviews for a user
  async getUserReviews(userId: string): Promise<Review[]> {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  // Get user reputation
  async getUserReputation(userId: string): Promise<any> {
    const response = await api.get(`/reviews/reputation/${userId}`);
    return response.data.data || response.data;
  },

  // Get my reviews (received)
  async getMyReviews(): Promise<Review[]> {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },

  // Get reviews I gave
  async getReviewsGiven(): Promise<Review[]> {
    const response = await api.get('/reviews/given');
    return response.data;
  },

  // Create review
  async createReview(data: {
    orderId: string;
    revieweeId: string;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // Get reputation score
  async getReputationScore(userId?: string): Promise<ReputationScore> {
    const url = userId ? `/reviews/reputation/${userId}` : '/reviews/reputation';
    const response = await api.get(url);
    return response.data;
  },

  // Get review statistics
  async getReviewStats(): Promise<any> {
    const response = await api.get('/reviews/stats');
    return response.data;
  }
};
