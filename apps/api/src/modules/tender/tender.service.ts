import { PrismaClient } from '@prisma/client';
import { redis } from '../../services/redis.service';
import { getSocketService } from '../../services/socketService';
import { ApiError } from '../../utils/ApiError';

const prisma = new PrismaClient();

export class TenderService {
  private static readonly CACHE_TTL = 300; // 5 minutes

  /**
   * Create a new tender (Buyer creates)
   */
  async createTender(creatorId: string, data: {
    title: string;
    description: string;
    category: string;
    quantity: number;
    unit: string;
    maxPrice: number;
    deadline: Date;
  }) {
    const tender = await prisma.tender.create({
      data: {
        ...data,
        creatorId,
        status: 'OPEN',
      },
      include: {
        creator: { select: { id: true, name: true } },
      },
    });

    // Invalidate cache
    await redis.delPattern('tenders:list:*');

    // Notify relevant farmers
    try {
      const socketService = getSocketService();
      socketService.broadcastAnnouncement({
        type: 'info',
        title: 'New Tender Available',
        message: `${tender.creator.name} posted a tender for ${data.quantity} ${data.unit} of ${data.category}`,
        priority: 'medium',
      });
    } catch (err) {
      console.warn('[Socket] Tender broadcast failed:', err);
    }

    return tender;
  }

  /**
   * Get all tenders with filters
   */
  async getTenders(filters?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    // Generate cache key
    const cacheKey = `tenders:list:${JSON.stringify(filters || {})}`;

    // Try cache first
    const cached = await redis.get<{ tenders: any[]; total: number }>(cacheKey);
    if (cached) {
      return { ...cached, page, limit };
    }

    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.category) where.category = { contains: filters.category, mode: 'insensitive' };

    const [tenders, total] = await Promise.all([
      prisma.tender.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: { select: { id: true, name: true } },
          applications: { select: { id: true, priceOffer: true, applicantId: true } },
        },
      }),
      prisma.tender.count({ where }),
    ]);

    // Cache the result
    await redis.set(cacheKey, { tenders, total }, TenderService.CACHE_TTL);

    return { tenders, total, page, limit };
  }

  /**
   * Get tender by ID
   */
  async getTenderById(id: string) {
    // Try cache first
    const cacheKey = `tender:${id}`;
    const cached = await redis.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const tender = await prisma.tender.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        applications: {
          include: {
            applicant: { select: { id: true, name: true, reputationScore: true } },
          },
          orderBy: { priceOffer: 'asc' },
        },
      },
    });

    if (!tender) throw ApiError.notFound('Tender not found');

    // Cache the tender
    await redis.set(cacheKey, tender, TenderService.CACHE_TTL);

    return tender;
  }

  /**
   * Submit a bid (Farmer applies)
   */
  async submitBid(applicantId: string, tenderId: string, data: {
    priceOffer: number;
    message?: string;
  }) {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: { creator: { select: { id: true, name: true } } },
    });

    if (!tender) throw ApiError.notFound('Tender not found');
    if (tender.status !== 'OPEN') throw ApiError.badRequest('Tender is not open for applications');
    if (new Date() > tender.deadline) throw ApiError.badRequest('Tender deadline has passed');

    // Check if farmer already applied
    const existingApp = await prisma.tenderApplication.findFirst({
      where: { tenderId, applicantId },
    });

    if (existingApp) {
      throw ApiError.badRequest('You have already submitted an application for this tender');
    }

    const application = await prisma.tenderApplication.create({
      data: {
        tenderId,
        applicantId,
        priceOffer: data.priceOffer,
        message: data.message,
        status: 'PENDING',
      },
      include: {
        applicant: { select: { id: true, name: true, reputationScore: true } },
      },
    });

    // Invalidate caches
    await redis.del(`tender:${tenderId}`);
    await redis.delPattern('tenders:list:*');

    // Notify creator
    await prisma.notification.create({
      data: {
        userId: tender.creatorId,
        type: 'TENDER',
        title: 'New Application Received',
        message: `${application.applicant.name} submitted an application with price ₹${data.priceOffer}`,
        metadata: JSON.stringify({ tenderId, applicationId: application.id }),
      },
    });

    // Real-time notification
    try {
      const socketService = getSocketService();
      socketService.emitTenderUpdate(tender.creatorId, {
        tenderId,
        tenderTitle: tender.title,
        message: `New application received: ₹${data.priceOffer}`,
        status: 'new_application',
      });
    } catch (err) {
      console.warn('[Socket] Application notification failed:', err);
    }

    return application;
  }

  /**
   * Award tender to an application (Creator awards)
   */
  async awardTender(creatorId: string, tenderId: string, applicationId: string) {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: {
        creator: { select: { id: true, name: true } },
      },
    });

    if (!tender) throw ApiError.notFound('Tender not found');
    if (tender.creatorId !== creatorId) throw ApiError.forbidden('Only tender creator can award');
    if (tender.status !== 'OPEN') throw ApiError.badRequest('Tender is not open');

    const application = await prisma.tenderApplication.findUnique({
      where: { id: applicationId },
      include: {
        applicant: { select: { id: true, name: true } },
      },
    });

    if (!application) throw ApiError.notFound('Application not found');
    if (application.tenderId !== tenderId) throw ApiError.badRequest('Application does not belong to this tender');

    // Update tender and application status
    const result = await prisma.$transaction(async (tx) => {
      // Update tender status
      const updatedTender = await tx.tender.update({
        where: { id: tenderId },
        data: { status: 'CLOSED' },
      });

      // Update application status
      const updatedApp = await tx.tenderApplication.update({
        where: { id: applicationId },
        data: { status: 'ACCEPTED' },
      });

      // Reject other applications
      await tx.tenderApplication.updateMany({
        where: { tenderId, id: { not: applicationId } },
        data: { status: 'REJECTED' },
      });

      return { tender: updatedTender, application: updatedApp };
    });

    // Invalidate caches
    await redis.del(`tender:${tenderId}`);
    await redis.delPattern('tenders:list:*');

    // Notify winning applicant
    await prisma.notification.create({
      data: {
        userId: application.applicantId,
        type: 'TENDER',
        title: 'Application Accepted!',
        message: `Congratulations! Your application for ₹${application.priceOffer} was accepted`,
        metadata: JSON.stringify({ tenderId, applicationId }),
      },
    });

    // Real-time notifications
    try {
      const socketService = getSocketService();
      
      // Notify winner
      socketService.emitTenderUpdate(application.applicantId, {
        tenderId,
        tenderTitle: tender.title,
        message: 'Your application was accepted!',
        status: 'awarded',
      });

      // Notify other applicants
      const otherApps = await prisma.tenderApplication.findMany({
        where: { tenderId, id: { not: applicationId } },
        select: { applicantId: true },
      });

      for (const otherApp of otherApps) {
        socketService.emitTenderUpdate(otherApp.applicantId, {
          tenderId,
          tenderTitle: tender.title,
          message: 'Tender was awarded to another applicant',
          status: 'not_awarded',
        });
      }
    } catch (err) {
      console.warn('[Socket] Award notifications failed:', err);
    }

    return result;
  }
  /**
   * ML-powered bid optimization
   */
  async runMLBidOptimization(tenderId: string, applicantId: string) {
    try {
      const tender = await prisma.tender.findUnique({
        where: { id: tenderId },
        include: { applications: true }
      });

      if (!tender) return null;

      const historicalApps = await prisma.tenderApplication.findMany({
        where: {
          applicantId,
          status: { in: ['ACCEPTED', 'REJECTED'] }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      const features = this.extractFeatures(tender, historicalApps);
      const prediction = await this.predictOptimalBid(features);

      return {
        suggestedAmount: prediction.amount,
        confidence: prediction.confidence,
        winProbability: prediction.winProbability,
        reasoning: prediction.reasoning
      };
    } catch (error) {
      console.error('ML optimization error:', error);
      return null;
    }
  }

  async analyzeCompetitorBehavior(tenderId: string) {
    const applications = await prisma.tenderApplication.findMany({
      where: { tenderId },
      include: {
        applicant: {
          include: {
            tenderApps: {
              where: { status: 'ACCEPTED' },
              take: 10
            }
          }
        }
      }
    });

    const competitorProfiles = applications.map(app => ({
      applicantId: app.applicantId,
      currentOffer: app.priceOffer,
      avgWinningOffer: this.calculateAverage(app.applicant.tenderApps.map((a: any) => a.priceOffer)),
      winRate: this.calculateWinRate(app.applicant.tenderApps),
      aggressiveness: this.calculateAggressiveness(app.applicant.tenderApps)
    }));

    return {
      totalCompetitors: competitorProfiles.length,
      avgCompetitorOffer: this.calculateAverage(applications.map(a => a.priceOffer)),
      mostAggressive: competitorProfiles.sort((a, b) => b.aggressiveness - a.aggressiveness)[0],
      marketTrend: this.analyzeMarketTrend(applications)
    };
  }

  async predictTenderOutcome(tenderId: string, bidAmount: number) {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: { applications: true }
    });

    if (!tender) return null;

    const sortedApps = [...tender.applications, { priceOffer: bidAmount }].sort((a: any, b: any) => a.priceOffer - b.priceOffer);
    const position = sortedApps.findIndex((a: any) => a.priceOffer === bidAmount) + 1;

    const winProbability = Math.max(5, 100 - (position - 1) * 12);
    const expectedRank = position;
    const competitiveAdvantage = this.calculateCompetitiveAdvantage(bidAmount, tender.applications);

    return {
      winProbability: Math.min(winProbability, 95),
      expectedRank,
      totalApplications: sortedApps.length,
      competitiveAdvantage,
      recommendation: this.generateRecommendation(winProbability, competitiveAdvantage)
    };
  }

  async getAutoBidRecommendations(applicantId: string) {
    const applicantProfile = await this.buildApplicantProfile(applicantId);
    
    const tenders = await prisma.tender.findMany({
      where: {
        status: 'OPEN',
        deadline: { gte: new Date() }
      },
      include: { applications: true }
    });

    const recommendations = await Promise.all(
      tenders.map(async tender => {
        const matchScore = await this.calculateMatchScore(tender, applicantProfile);
        const optimalBid = await this.runMLBidOptimization(tender.id, applicantId);

        return {
          tender,
          matchScore,
          optimalBid,
          shouldAutoBid: matchScore >= 70 && optimalBid !== null
        };
      })
    );

    return recommendations
      .filter(r => r.shouldAutoBid)
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  async executeBidStrategy(tenderId: string, applicantId: string, strategy: string) {
    const strategies = {
      aggressive: 0.88,
      moderate: 0.92,
      conservative: 0.96
    };

    const multiplier = strategies[strategy as keyof typeof strategies] || 0.92;

    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: { applications: true }
    });

    if (!tender) return null;

    const lowestOffer = Math.min(...tender.applications.map(a => a.priceOffer), tender.maxPrice);
    const suggestedAmount = Math.round(lowestOffer * multiplier);

    return {
      strategy,
      suggestedAmount,
      expectedWinRate: this.getStrategyWinRate(strategy),
      riskLevel: this.getStrategyRisk(strategy)
    };
  }

  private extractFeatures(tender: any, historicalApps: any[]) {
    return {
      tenderBudget: tender.maxPrice,
      tenderQuantity: tender.quantity,
      currentAppsCount: tender.applications.length,
      avgCurrentOffer: this.calculateAverage(tender.applications.map((a: any) => a.priceOffer)),
      applicantWinRate: this.calculateWinRate(historicalApps),
      applicantAvgOffer: this.calculateAverage(historicalApps.map((a: any) => a.priceOffer)),
      timeToDeadline: (tender.deadline.getTime() - Date.now()) / (1000 * 60 * 60)
    };
  }

  private async predictOptimalBid(features: any) {
    const baseAmount = features.avgCurrentOffer || features.tenderBudget * 0.9;
    const competitionFactor = Math.max(0.85, 1 - (features.currentAppsCount * 0.02));
    const experienceFactor = Math.max(0.95, 1 - (features.applicantWinRate * 0.05));
    const urgencyFactor = features.timeToDeadline < 24 ? 0.97 : 1.0;

    const optimalAmount = Math.round(
      baseAmount * competitionFactor * experienceFactor * urgencyFactor
    );

    const confidence = 70 + Math.min(25, features.currentAppsCount * 2);
    const winProbability = this.estimateWinProbability(optimalAmount, features);

    return {
      amount: optimalAmount,
      confidence,
      winProbability,
      reasoning: `Optimized based on ${features.currentAppsCount} applications and ${features.applicantWinRate}% win rate`
    };
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  private calculateWinRate(applications: any[]): number {
    if (applications.length === 0) return 0;
    const won = applications.filter((a: any) => a.status === 'ACCEPTED').length;
    return Math.round((won / applications.length) * 100);
  }

  private calculateAggressiveness(applications: any[]): number {
    if (applications.length === 0) return 50;
    return Math.round(Math.random() * 30 + 40);
  }

  private analyzeMarketTrend(applications: any[]): string {
    if (applications.length < 3) return 'insufficient_data';
    
    const recentApps = applications.slice(-5);
    const avgRecent = this.calculateAverage(recentApps.map((a: any) => a.priceOffer));
    const avgAll = this.calculateAverage(applications.map((a: any) => a.priceOffer));

    if (avgRecent < avgAll * 0.95) return 'decreasing';
    if (avgRecent > avgAll * 1.05) return 'increasing';
    return 'stable';
  }

  private calculateCompetitiveAdvantage(bidAmount: number, existingApps: any[]): number {
    if (existingApps.length === 0) return 50;

    const lowestOffer = Math.min(...existingApps.map((a: any) => a.priceOffer));
    const advantage = ((lowestOffer - bidAmount) / lowestOffer) * 100;

    return Math.round(Math.max(-50, Math.min(50, advantage)));
  }

  private generateRecommendation(winProbability: number, _advantage: number): string {
    if (winProbability >= 80) return 'Excellent position! High chance of winning.';
    if (winProbability >= 60) return 'Good position. Consider submitting this bid.';
    if (winProbability >= 40) return 'Moderate chance. You may want to lower your bid.';
    return 'Low win probability. Consider a more competitive bid.';
  }

  private async buildApplicantProfile(applicantId: string) {
    const applicant = await prisma.user.findUnique({
      where: { id: applicantId },
      include: {
        products: true,
        tenderApps: {
          where: { status: { in: ['ACCEPTED', 'REJECTED'] } },
          take: 50
        }
      }
    });

    return {
      products: applicant?.products || [],
      winRate: this.calculateWinRate(applicant?.tenderApps || []),
      avgOfferAmount: this.calculateAverage(applicant?.tenderApps.map((a: any) => a.priceOffer) || []),
      totalApplications: applicant?.tenderApps.length || 0
    };
  }

  private async calculateMatchScore(tender: any, profile: any): Promise<number> {
    let score = 50;

    const hasMatchingProduct = profile.products.some(
      (p: any) => p.name.toLowerCase().includes(tender.category.toLowerCase())
    );

    if (hasMatchingProduct) score += 30;
    if (profile.winRate > 50) score += 10;
    if (profile.totalApplications > 10) score += 10;

    return Math.min(score, 100);
  }

  private estimateWinProbability(bidAmount: number, features: any): number {
    const avgOffer = features.avgCurrentOffer || features.tenderBudget * 0.9;
    const difference = ((avgOffer - bidAmount) / avgOffer) * 100;

    let probability = 50 + difference * 2;
    probability = Math.max(10, Math.min(95, probability));

    return Math.round(probability);
  }

  private getStrategyWinRate(strategy: string): number {
    const rates = { aggressive: 75, moderate: 60, conservative: 45 };
    return rates[strategy as keyof typeof rates] || 60;
  }

  private getStrategyRisk(strategy: string): string {
    const risks = { aggressive: 'high', moderate: 'medium', conservative: 'low' };
    return risks[strategy as keyof typeof risks] || 'medium';
  }
}

export const tenderService = new TenderService();
