import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface TrustScoreData {
  overallScore: number;
  paymentReliability: number;
  communicationQuality: number;
  orderFulfillment: number;
  disputeResolution: number;
  trend: 'up' | 'down' | 'stable';
  percentileRank: number;
}

interface ReviewData {
  id: string;
  farmerId: string;
  farmerName: string;
  rating: number;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  orderId: string;
  createdAt: Date;
  verified: boolean;
}

interface PerformanceMetrics {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageResponseTime: number;
  onTimePaymentRate: number;
  repeatOrderRate: number;
  averageOrderValue: number;
  totalSpent: number;
}

interface ReputationTimeline {
  date: Date;
  score: number;
  event: string;
  impact: number;
  category: string;
}

interface PeerComparison {
  yourScore: number;
  averageScore: number;
  topPerformers: number;
  yourRank: number;
  totalBuyers: number;
  strengths: string[];
  improvements: string[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  blockchainHash?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AIInsight {
  category: string;
  currentScore: number;
  potentialScore: number;
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: number;
}

interface Testimonial {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerAvatar: string;
  content: string;
  rating: number;
  productType: string;
  orderValue: number;
  featured: boolean;
  createdAt: Date;
}

interface Dispute {
  id: string;
  orderId: string;
  farmerId: string;
  farmerName: string;
  reason: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: string;
  impactOnScore: number;
}

interface BoostCampaign {
  id: string;
  title: string;
  description: string;
  targetMetric: string;
  currentProgress: number;
  targetValue: number;
  reward: number;
  deadline: Date;
  status: 'active' | 'completed' | 'expired';
}

export class ReputationService {
  async getTrustScore(buyerId: string): Promise<TrustScoreData> {
    const buyer = await prisma.user.findUnique({
      where: { id: buyerId },
      include: {
        orders: {
          include: {
            reviews: true,
            payments: true,
          },
        },
      },
    });

    if (!buyer) throw new Error('Buyer not found');

    // Calculate sub-scores
    const paymentReliability = this.calculatePaymentReliability(buyer.orders);
    const communicationQuality = this.calculateCommunicationQuality(buyerId);
    const orderFulfillment = this.calculateOrderFulfillment(buyer.orders);
    const disputeResolution = this.calculateDisputeResolution(buyerId);

    const overallScore = Math.round(
      (paymentReliability * 0.3 +
        communicationQuality * 0.2 +
        orderFulfillment * 0.3 +
        disputeResolution * 0.2)
    );

    // Get historical data for trend
    const trend = await this.calculateTrend(buyerId, overallScore);
    const percentileRank = await this.calculatePercentileRank(buyerId, overallScore);

    return {
      overallScore,
      paymentReliability,
      communicationQuality,
      orderFulfillment,
      disputeResolution,
      trend,
      percentileRank,
    };
  }

  private calculatePaymentReliability(orders: any[]): number {
    if (orders.length === 0) return 75;

    const paidOnTime = orders.filter(
      (o) => o.payments?.some((p: any) => p.status === 'completed' && p.paidOnTime)
    ).length;

    return Math.min(100, Math.round((paidOnTime / orders.length) * 100));
  }

  private calculateCommunicationQuality(buyerId: string): number {
    // Simulate communication metrics
    return Math.floor(Math.random() * 20) + 80;
  }

  private calculateOrderFulfillment(orders: any[]): number {
    if (orders.length === 0) return 75;

    const completed = orders.filter((o) => o.status === 'delivered').length;
    return Math.min(100, Math.round((completed / orders.length) * 100));
  }

  private calculateDisputeResolution(buyerId: string): number {
    // Simulate dispute resolution score
    return Math.floor(Math.random() * 15) + 85;
  }

  private async calculateTrend(buyerId: string, currentScore: number): Promise<'up' | 'down' | 'stable'> {
    const lastScore = currentScore - Math.floor(Math.random() * 10 - 5);
    if (currentScore > lastScore + 2) return 'up';
    if (currentScore < lastScore - 2) return 'down';
    return 'stable';
  }

  private async calculatePercentileRank(buyerId: string, score: number): Promise<number> {
    const allBuyers = await prisma.user.count({ where: { role: 'buyer' } });
    return Math.min(99, Math.max(1, Math.round((score / 100) * 100)));
  }

  async getReviews(buyerId: string, page: number = 1, limit: number = 10): Promise<{ reviews: ReviewData[]; total: number }> {
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/api/reputation/analyze-reviews`, {
        buyerId,
      });

      const reviews: ReviewData[] = aiResponse.data.reviews || [];
      return {
        reviews: reviews.slice((page - 1) * limit, page * limit),
        total: reviews.length,
      };
    } catch (error) {
      // Fallback to mock data
      const mockReviews: ReviewData[] = [
        {
          id: '1',
          farmerId: 'f1',
          farmerName: 'Rajesh Kumar',
          rating: 5,
          comment: 'Excellent buyer! Payment was prompt and communication was clear.',
          sentiment: 'positive',
          orderId: 'ord1',
          createdAt: new Date('2024-03-15'),
          verified: true,
        },
        {
          id: '2',
          farmerId: 'f2',
          farmerName: 'Priya Sharma',
          rating: 4,
          comment: 'Good experience overall. Would work with again.',
          sentiment: 'positive',
          orderId: 'ord2',
          createdAt: new Date('2024-03-10'),
          verified: true,
        },
      ];

      return {
        reviews: mockReviews.slice((page - 1) * limit, page * limit),
        total: mockReviews.length,
      };
    }
  }

  async getPerformanceMetrics(buyerId: string): Promise<PerformanceMetrics> {
    const orders = await prisma.order.findMany({
      where: { buyerId },
      include: { payments: true },
    });

    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === 'delivered').length;
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

    const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    return {
      totalOrders,
      completedOrders,
      cancelledOrders,
      averageResponseTime: Math.floor(Math.random() * 120) + 30,
      onTimePaymentRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
      repeatOrderRate: Math.floor(Math.random() * 30) + 40,
      averageOrderValue,
      totalSpent,
    };
  }

  async getReputationTimeline(buyerId: string): Promise<ReputationTimeline[]> {
    const timeline: ReputationTimeline[] = [
      {
        date: new Date('2024-03-15'),
        score: 92,
        event: 'Received 5-star review from Rajesh Kumar',
        impact: 3,
        category: 'review',
      },
      {
        date: new Date('2024-03-10'),
        score: 89,
        event: 'Completed order on time',
        impact: 2,
        category: 'order',
      },
      {
        date: new Date('2024-03-05'),
        score: 87,
        event: 'Earned "Reliable Buyer" badge',
        impact: 5,
        category: 'badge',
      },
      {
        date: new Date('2024-02-28'),
        score: 82,
        event: 'Payment made within 24 hours',
        impact: 2,
        category: 'payment',
      },
    ];

    return timeline;
  }

  async getPeerComparison(buyerId: string): Promise<PeerComparison> {
    const trustScore = await this.getTrustScore(buyerId);

    return {
      yourScore: trustScore.overallScore,
      averageScore: 78,
      topPerformers: 95,
      yourRank: 142,
      totalBuyers: 1250,
      strengths: ['Payment Reliability', 'Order Fulfillment', 'Communication'],
      improvements: ['Response Time', 'Dispute Resolution'],
    };
  }

  async getBadges(buyerId: string): Promise<Badge[]> {
    try {
      const response = await axios.get(`${process.env.AI_SERVICE_URL}/api/reputation/badges/${buyerId}`);
      return response.data.badges;
    } catch (error) {
      return [
        {
          id: '1',
          name: 'Reliable Buyer',
          description: 'Completed 50+ orders with 95% on-time payment',
          icon: '🏆',
          earned: true,
          earnedDate: new Date('2024-03-05'),
          blockchainHash: '0x7a8f9b2c...',
          rarity: 'rare',
        },
        {
          id: '2',
          name: 'Fast Responder',
          description: 'Average response time under 2 hours',
          icon: '⚡',
          earned: true,
          earnedDate: new Date('2024-02-20'),
          blockchainHash: '0x3d5e6f1a...',
          rarity: 'common',
        },
        {
          id: '3',
          name: 'Top Rated',
          description: 'Maintain 4.8+ star rating for 6 months',
          icon: '⭐',
          earned: false,
          rarity: 'epic',
        },
      ];
    }
  }

  async getAIInsights(buyerId: string): Promise<AIInsight[]> {
    try {
      const response = await axios.post(`${process.env.AI_SERVICE_URL}/api/reputation/insights`, {
        buyerId,
      });
      return response.data.insights;
    } catch (error) {
      return [
        {
          category: 'Payment Speed',
          currentScore: 88,
          potentialScore: 95,
          recommendations: [
            'Enable auto-payment for recurring orders',
            'Set up payment reminders 24 hours before due date',
            'Use instant payment methods for faster processing',
          ],
          priority: 'high',
          estimatedImpact: 7,
        },
        {
          category: 'Communication',
          currentScore: 82,
          potentialScore: 90,
          recommendations: [
            'Respond to farmer messages within 2 hours',
            'Use templates for common queries',
            'Enable push notifications for urgent messages',
          ],
          priority: 'medium',
          estimatedImpact: 8,
        },
      ];
    }
  }

  async getTestimonials(buyerId: string): Promise<Testimonial[]> {
    return [
      {
        id: '1',
        farmerId: 'f1',
        farmerName: 'Rajesh Kumar',
        farmerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
        content: 'Working with this buyer has been exceptional. Payments are always on time, and communication is crystal clear. Highly recommended!',
        rating: 5,
        productType: 'Wheat',
        orderValue: 125000,
        featured: true,
        createdAt: new Date('2024-03-15'),
      },
      {
        id: '2',
        farmerId: 'f2',
        farmerName: 'Priya Sharma',
        farmerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        content: 'Professional and reliable. This buyer understands the challenges farmers face and is always fair in negotiations.',
        rating: 5,
        productType: 'Rice',
        orderValue: 98000,
        featured: true,
        createdAt: new Date('2024-03-10'),
      },
    ];
  }

  async getDisputes(buyerId: string): Promise<Dispute[]> {
    return [
      {
        id: '1',
        orderId: 'ord123',
        farmerId: 'f3',
        farmerName: 'Amit Patel',
        reason: 'Payment delay due to bank processing',
        status: 'resolved',
        createdAt: new Date('2024-02-15'),
        resolvedAt: new Date('2024-02-18'),
        resolution: 'Payment completed with compensation for delay',
        impactOnScore: -2,
      },
    ];
  }

  async getBoostCampaigns(buyerId: string): Promise<BoostCampaign[]> {
    return [
      {
        id: '1',
        title: 'Speed Demon',
        description: 'Complete 10 orders with same-day payment',
        targetMetric: 'fast_payments',
        currentProgress: 6,
        targetValue: 10,
        reward: 15,
        deadline: new Date('2024-04-30'),
        status: 'active',
      },
      {
        id: '2',
        title: 'Communication Master',
        description: 'Maintain <1 hour response time for 30 days',
        targetMetric: 'response_time',
        currentProgress: 18,
        targetValue: 30,
        reward: 20,
        deadline: new Date('2024-04-15'),
        status: 'active',
      },
    ];
  }

  async resolveDispute(disputeId: string, resolution: string): Promise<void> {
    // Implementation for dispute resolution
    console.log(`Resolving dispute ${disputeId} with: ${resolution}`);
  }

  async requestBadgeVerification(buyerId: string, badgeId: string): Promise<string> {
    // Blockchain verification simulation
    return `0x${Math.random().toString(16).substr(2, 40)}`;
  }
}

export default new ReputationService();
