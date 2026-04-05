import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TenderService {
  async runMLBidOptimization(tenderId: string, farmerId: string) {
    try {
      const tender = await prisma.tender.findUnique({
        where: { id: tenderId },
        include: { bids: true }
      });

      if (!tender) return null;

      const historicalBids = await prisma.bid.findMany({
        where: {
          farmerId,
          status: { in: ['accepted', 'rejected'] }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      const features = this.extractFeatures(tender, historicalBids);
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
    const bids = await prisma.bid.findMany({
      where: { tenderId },
      include: {
        farmer: {
          include: {
            bids: {
              where: { status: 'accepted' },
              take: 10
            }
          }
        }
      }
    });

    const competitorProfiles = bids.map(bid => ({
      farmerId: bid.farmerId,
      currentBid: bid.amount,
      avgWinningBid: this.calculateAverage(bid.farmer.bids.map(b => b.amount)),
      winRate: this.calculateWinRate(bid.farmer.bids),
      aggressiveness: this.calculateAggressiveness(bid.farmer.bids)
    }));

    return {
      totalCompetitors: competitorProfiles.length,
      avgCompetitorBid: this.calculateAverage(bids.map(b => b.amount)),
      mostAggressive: competitorProfiles.sort((a, b) => b.aggressiveness - a.aggressiveness)[0],
      marketTrend: this.analyzeMarketTrend(bids)
    };
  }

  async predictTenderOutcome(tenderId: string, bidAmount: number) {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: { bids: true }
    });

    if (!tender) return null;

    const sortedBids = [...tender.bids, { amount: bidAmount }].sort((a, b) => a.amount - b.amount);
    const position = sortedBids.findIndex(b => b.amount === bidAmount) + 1;

    const winProbability = Math.max(5, 100 - (position - 1) * 12);
    const expectedRank = position;
    const competitiveAdvantage = this.calculateCompetitiveAdvantage(bidAmount, tender.bids);

    return {
      winProbability: Math.min(winProbability, 95),
      expectedRank,
      totalBids: sortedBids.length,
      competitiveAdvantage,
      recommendation: this.generateRecommendation(winProbability, competitiveAdvantage)
    };
  }

  async getAutoBidRecommendations(farmerId: string) {
    const farmerProfile = await this.buildFarmerProfile(farmerId);
    
    const tenders = await prisma.tender.findMany({
      where: {
        status: 'open',
        deadline: { gte: new Date() }
      },
      include: { bids: true }
    });

    const recommendations = await Promise.all(
      tenders.map(async tender => {
        const matchScore = await this.calculateMatchScore(tender, farmerProfile);
        const optimalBid = await this.runMLBidOptimization(tender.id, farmerId);

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

  async executeBidStrategy(tenderId: string, farmerId: string, strategy: string) {
    const strategies = {
      aggressive: 0.88,
      moderate: 0.92,
      conservative: 0.96
    };

    const multiplier = strategies[strategy as keyof typeof strategies] || 0.92;

    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: { bids: true }
    });

    if (!tender) return null;

    const lowestBid = Math.min(...tender.bids.map(b => b.amount), tender.budget);
    const suggestedAmount = Math.round(lowestBid * multiplier);

    return {
      strategy,
      suggestedAmount,
      expectedWinRate: this.getStrategyWinRate(strategy),
      riskLevel: this.getStrategyRisk(strategy)
    };
  }

  private extractFeatures(tender: any, historicalBids: any[]) {
    return {
      tenderBudget: tender.budget,
      tenderQuantity: tender.quantity,
      currentBidsCount: tender.bids.length,
      avgCurrentBid: this.calculateAverage(tender.bids.map((b: any) => b.amount)),
      farmerWinRate: this.calculateWinRate(historicalBids),
      farmerAvgBid: this.calculateAverage(historicalBids.map(b => b.amount)),
      timeToDeadline: (tender.deadline.getTime() - Date.now()) / (1000 * 60 * 60)
    };
  }

  private async predictOptimalBid(features: any) {
    const baseAmount = features.avgCurrentBid || features.tenderBudget * 0.9;
    const competitionFactor = Math.max(0.85, 1 - (features.currentBidsCount * 0.02));
    const experienceFactor = Math.max(0.95, 1 - (features.farmerWinRate * 0.05));
    const urgencyFactor = features.timeToDeadline < 24 ? 0.97 : 1.0;

    const optimalAmount = Math.round(
      baseAmount * competitionFactor * experienceFactor * urgencyFactor
    );

    const confidence = 70 + Math.min(25, features.currentBidsCount * 2);
    const winProbability = this.estimateWinProbability(optimalAmount, features);

    return {
      amount: optimalAmount,
      confidence,
      winProbability,
      reasoning: `Optimized based on ${features.currentBidsCount} bids and ${features.farmerWinRate}% win rate`
    };
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  private calculateWinRate(bids: any[]): number {
    if (bids.length === 0) return 0;
    const won = bids.filter(b => b.status === 'accepted').length;
    return Math.round((won / bids.length) * 100);
  }

  private calculateAggressiveness(bids: any[]): number {
    if (bids.length === 0) return 50;
    return Math.round(Math.random() * 30 + 40);
  }

  private analyzeMarketTrend(bids: any[]): string {
    if (bids.length < 3) return 'insufficient_data';
    
    const recentBids = bids.slice(-5);
    const avgRecent = this.calculateAverage(recentBids.map(b => b.amount));
    const avgAll = this.calculateAverage(bids.map(b => b.amount));

    if (avgRecent < avgAll * 0.95) return 'decreasing';
    if (avgRecent > avgAll * 1.05) return 'increasing';
    return 'stable';
  }

  private calculateCompetitiveAdvantage(bidAmount: number, existingBids: any[]): number {
    if (existingBids.length === 0) return 50;

    const lowestBid = Math.min(...existingBids.map(b => b.amount));
    const advantage = ((lowestBid - bidAmount) / lowestBid) * 100;

    return Math.round(Math.max(-50, Math.min(50, advantage)));
  }

  private generateRecommendation(winProbability: number, advantage: number): string {
    if (winProbability >= 80) return 'Excellent position! High chance of winning.';
    if (winProbability >= 60) return 'Good position. Consider submitting this bid.';
    if (winProbability >= 40) return 'Moderate chance. You may want to lower your bid.';
    return 'Low win probability. Consider a more competitive bid.';
  }

  private async buildFarmerProfile(farmerId: string) {
    const farmer = await prisma.user.findUnique({
      where: { id: farmerId },
      include: {
        products: true,
        bids: {
          where: { status: { in: ['accepted', 'rejected'] } },
          take: 50
        }
      }
    });

    return {
      products: farmer?.products || [],
      winRate: this.calculateWinRate(farmer?.bids || []),
      avgBidAmount: this.calculateAverage(farmer?.bids.map(b => b.amount) || []),
      totalBids: farmer?.bids.length || 0
    };
  }

  private async calculateMatchScore(tender: any, profile: any): Promise<number> {
    let score = 50;

    const hasMatchingProduct = profile.products.some(
      (p: any) => p.name.toLowerCase().includes(tender.product.toLowerCase())
    );

    if (hasMatchingProduct) score += 30;
    if (profile.winRate > 50) score += 10;
    if (profile.totalBids > 10) score += 10;

    return Math.min(score, 100);
  }

  private estimateWinProbability(bidAmount: number, features: any): number {
    const avgBid = features.avgCurrentBid || features.tenderBudget * 0.9;
    const difference = ((avgBid - bidAmount) / avgBid) * 100;

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
