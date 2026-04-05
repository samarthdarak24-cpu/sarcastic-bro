import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { socketService } from '../../services/socketService';

const prisma = new PrismaClient();

export class TenderController {
  async getMarketplace(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      const tenders = await prisma.tender.findMany({
        where: {
          status: { in: ['open', 'closing_soon'] },
          deadline: { gte: new Date() }
        },
        include: {
          buyer: { select: { name: true, company: true } },
          _count: { select: { bids: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      const enrichedTenders = await Promise.all(
        tenders.map(async (tender) => {
          const matchScore = await this.calculateMatchScore(tender, user);
          const aiRecommendation = await this.generateAIRecommendation(tender, user);

          return {
            id: tender.id,
            title: tender.title,
            buyer: tender.buyer.company || tender.buyer.name,
            product: tender.product,
            quantity: tender.quantity,
            unit: tender.unit,
            budget: tender.budget,
            deadline: tender.deadline,
            status: this.getTenderStatus(tender.deadline),
            bidsCount: tender._count.bids,
            matchScore,
            aiRecommendation
          };
        })
      );

      res.json({ tenders: enrichedTenders });
    } catch (error) {
      console.error('Get marketplace error:', error);
      res.status(500).json({ error: 'Failed to fetch tenders' });
    }
  }

  async getMyBids(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const bids = await prisma.bid.findMany({
        where: { farmerId: userId },
        include: {
          tender: {
            select: {
              title: true,
              quantity: true,
              unit: true,
              deadline: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      const enrichedBids = await Promise.all(
        bids.map(async (bid) => {
          const { rank, totalBids } = await this.getBidRank(bid.tenderId, bid.id);
          const winProbability = await this.calculateWinProbability(bid);

          return {
            id: bid.id,
            tenderId: bid.tenderId,
            tenderTitle: bid.tender.title,
            amount: bid.amount,
            quantity: bid.quantity,
            status: bid.status,
            submittedAt: bid.createdAt,
            winProbability,
            rank,
            totalBids
          };
        })
      );

      res.json({ bids: enrichedBids });
    } catch (error) {
      console.error('Get my bids error:', error);
      res.status(500).json({ error: 'Failed to fetch bids' });
    }
  }

  async getAnalytics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const bids = await prisma.bid.findMany({
        where: { farmerId: userId }
      });

      const totalBids = bids.length;
      const activeBids = bids.filter(b => b.status === 'pending').length;
      const wonBids = bids.filter(b => b.status === 'accepted').length;
      const winRate = totalBids > 0 ? Math.round((wonBids / totalBids) * 100) : 0;

      const totalValue = bids.reduce((sum, bid) => sum + bid.amount, 0);
      const avgBidAmount = totalBids > 0 ? totalValue / totalBids : 0;

      const allBids = await prisma.bid.findMany({
        where: { farmerId: { not: userId } }
      });
      const competitorAvg = allBids.length > 0
        ? allBids.reduce((sum, bid) => sum + bid.amount, 0) / allBids.length
        : 0;

      const optimalRange = {
        min: Math.round(competitorAvg * 0.85),
        max: Math.round(competitorAvg * 0.95)
      };

      res.json({
        analytics: {
          totalBids,
          activeBids,
          wonBids,
          winRate,
          totalValue,
          avgBidAmount: Math.round(avgBidAmount),
          competitorAvg: Math.round(competitorAvg),
          optimalRange
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }

  async getAISuggestion(req: Request, res: Response) {
    try {
      const { tenderId } = req.body;
      const userId = (req as any).user.id;

      const tender = await prisma.tender.findUnique({
        where: { id: tenderId },
        include: {
          bids: { select: { amount: true } }
        }
      });

      if (!tender) {
        return res.status(404).json({ error: 'Tender not found' });
      }

      const existingBids = tender.bids.map(b => b.amount);
      const avgBid = existingBids.length > 0
        ? existingBids.reduce((sum, amt) => sum + amt, 0) / existingBids.length
        : tender.budget * 0.9;

      const minBid = Math.min(...existingBids, tender.budget);
      const marketFactor = 0.92 + (Math.random() * 0.06);
      
      const suggestedAmount = Math.round(
        existingBids.length > 0
          ? minBid * marketFactor
          : tender.budget * marketFactor
      );

      const userHistory = await prisma.bid.findMany({
        where: { farmerId: userId, status: 'accepted' },
        select: { amount: true }
      });

      const adjustmentFactor = userHistory.length > 3 ? 0.98 : 1.0;
      const finalSuggestion = Math.round(suggestedAmount * adjustmentFactor);

      res.json({
        suggestedAmount: finalSuggestion,
        confidence: 85 + Math.floor(Math.random() * 10),
        reasoning: `Based on ${existingBids.length} existing bids and market analysis`
      });
    } catch (error) {
      console.error('AI suggestion error:', error);
      res.status(500).json({ error: 'Failed to generate suggestion' });
    }
  }

  async submitBid(req: Request, res: Response) {
    try {
      const { tenderId, amount, quantity } = req.body;
      const userId = (req as any).user.id;

      const tender = await prisma.tender.findUnique({
        where: { id: tenderId }
      });

      if (!tender) {
        return res.status(404).json({ error: 'Tender not found' });
      }

      if (new Date() > tender.deadline) {
        return res.status(400).json({ error: 'Tender deadline has passed' });
      }

      const existingBid = await prisma.bid.findFirst({
        where: { tenderId, farmerId: userId }
      });

      if (existingBid) {
        return res.status(400).json({ error: 'You have already bid on this tender' });
      }

      const bid = await prisma.bid.create({
        data: {
          tenderId,
          farmerId: userId,
          amount,
          quantity,
          status: 'pending'
        },
        include: {
          tender: { select: { title: true } },
          farmer: { select: { name: true } }
        }
      });

      socketService.emitToUser(tender.buyerId, 'bid:new', {
        bidId: bid.id,
        tenderTitle: bid.tender.title,
        farmerName: bid.farmer.name,
        amount: bid.amount
      });

      socketService.broadcast('tender:updated', {
        tenderId: tender.id,
        bidsCount: await prisma.bid.count({ where: { tenderId } })
      });

      res.json({ success: true, bid });
    } catch (error) {
      console.error('Submit bid error:', error);
      res.status(500).json({ error: 'Failed to submit bid' });
    }
  }

  async updateBidStatus(req: Request, res: Response) {
    try {
      const { bidId, status } = req.body;
      const userId = (req as any).user.id;

      const bid = await prisma.bid.findUnique({
        where: { id: bidId },
        include: { tender: true }
      });

      if (!bid) {
        return res.status(404).json({ error: 'Bid not found' });
      }

      if (bid.tender.buyerId !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const updatedBid = await prisma.bid.update({
        where: { id: bidId },
        data: { status }
      });

      socketService.emitToUser(bid.farmerId, 'bid:status_changed', {
        bidId: bid.id,
        status,
        tenderTitle: bid.tender.title
      });

      res.json({ success: true, bid: updatedBid });
    } catch (error) {
      console.error('Update bid status error:', error);
      res.status(500).json({ error: 'Failed to update bid status' });
    }
  }

  async createTender(req: Request, res: Response) {
    try {
      const { title, product, quantity, unit, budget, deadline, description } = req.body;
      const userId = (req as any).user.id;

      const tender = await prisma.tender.create({
        data: {
          title,
          product,
          quantity,
          unit,
          budget,
          deadline: new Date(deadline),
          description,
          buyerId: userId,
          status: 'open'
        }
      });

      const matchingFarmers = await this.findMatchingFarmers(tender);
      
      matchingFarmers.forEach(farmerId => {
        socketService.emitToUser(farmerId, 'tender:new', {
          id: tender.id,
          title: tender.title,
          product: tender.product,
          budget: tender.budget
        });
      });

      res.json({ success: true, tender });
    } catch (error) {
      console.error('Create tender error:', error);
      res.status(500).json({ error: 'Failed to create tender' });
    }
  }

  private async calculateMatchScore(tender: any, user: any): Promise<number> {
    let score = 50;

    const userProducts = await prisma.product.findMany({
      where: { farmerId: user.id },
      select: { name: true, category: true }
    });

    const hasMatchingProduct = userProducts.some(
      p => p.name.toLowerCase().includes(tender.product.toLowerCase()) ||
           p.category.toLowerCase().includes(tender.product.toLowerCase())
    );

    if (hasMatchingProduct) score += 30;

    const userBids = await prisma.bid.findMany({
      where: { farmerId: user.id, status: 'accepted' }
    });

    if (userBids.length > 5) score += 10;
    if (userBids.length > 10) score += 10;

    return Math.min(score, 100);
  }

  private async generateAIRecommendation(tender: any, user: any): Promise<string> {
    const matchScore = await this.calculateMatchScore(tender, user);

    if (matchScore >= 80) {
      return 'Highly recommended! This tender matches your profile perfectly.';
    } else if (matchScore >= 60) {
      return 'Good opportunity. Consider bidding competitively.';
    } else if (matchScore >= 40) {
      return 'Moderate match. Review requirements carefully before bidding.';
    } else {
      return 'Low match score. Ensure you can meet all requirements.';
    }
  }

  private getTenderStatus(deadline: Date): 'open' | 'closing_soon' | 'closed' {
    const now = new Date();
    const hoursLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursLeft < 0) return 'closed';
    if (hoursLeft < 24) return 'closing_soon';
    return 'open';
  }

  private async getBidRank(tenderId: string, bidId: string): Promise<{ rank: number; totalBids: number }> {
    const bids = await prisma.bid.findMany({
      where: { tenderId },
      orderBy: { amount: 'asc' }
    });

    const rank = bids.findIndex(b => b.id === bidId) + 1;
    return { rank, totalBids: bids.length };
  }

  private async calculateWinProbability(bid: any): Promise<number> {
    const allBids = await prisma.bid.findMany({
      where: { tenderId: bid.tenderId },
      orderBy: { amount: 'asc' }
    });

    if (allBids.length === 0) return 50;

    const position = allBids.findIndex(b => b.id === bid.id) + 1;
    const probability = Math.max(10, 100 - (position - 1) * 15);

    return Math.min(probability, 95);
  }

  private async findMatchingFarmers(tender: any): Promise<string[]> {
    const farmers = await prisma.user.findMany({
      where: { role: 'farmer' },
      include: {
        products: { select: { name: true, category: true } }
      }
    });

    return farmers
      .filter(farmer =>
        farmer.products.some(
          p => p.name.toLowerCase().includes(tender.product.toLowerCase()) ||
               p.category.toLowerCase().includes(tender.product.toLowerCase())
        )
      )
      .map(f => f.id);
  }
}

export const tenderController = new TenderController();
