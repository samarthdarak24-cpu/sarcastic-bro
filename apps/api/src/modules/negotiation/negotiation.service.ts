import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface NegotiationOffer {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  currentPrice: number;
  targetPrice: number;
  status: string;
  messages: any[];
  aiSuggestions: any[];
  sentiment: number;
  deadline: Date;
}

export class NegotiationService {
  // AI-Powered Counter-Offer Engine
  async generateCounterOffer(negotiationId: string, currentOffer: number) {
    try {
      const negotiation = await this.getNegotiationById(negotiationId);
      
      // Call AI service for smart pricing
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/api/negotiation/counter-offer`, {
        productId: negotiation.productId,
        currentPrice: currentOffer,
        marketData: await this.getMarketData(negotiation.productId),
        history: negotiation.messages
      });

      const counterOffer = {
        price: aiResponse.data.suggestedPrice,
        confidence: aiResponse.data.confidence,
        reasoning: aiResponse.data.reasoning,
        alternativeOffers: aiResponse.data.alternatives,
        timestamp: new Date()
      };

      await this.saveCounterOffer(negotiationId, counterOffer);
      return counterOffer;
    } catch (error) {
      console.error('Counter-offer generation failed:', error);
      throw error;
    }
  }

  // Real-Time Negotiation Chat
  async sendNegotiationMessage(negotiationId: string, userId: string, message: string, offerPrice?: number) {
    const negotiation = await this.getNegotiationById(negotiationId);
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      userId,
      message,
      offerPrice,
      timestamp: new Date(),
      sentiment: await this.analyzeSentiment(message)
    };

    // Save message
    await prisma.$executeRaw`
      UPDATE negotiations 
      SET messages = JSON_ARRAY_APPEND(messages, '$', CAST(${JSON.stringify(newMessage)} AS JSON))
      WHERE id = ${negotiationId}
    `;

    // Emit socket event
    global.io?.to(`negotiation_${negotiationId}`).emit('new_message', newMessage);

    return newMessage;
  }

  // Multi-Party Negotiation Room
  async createMultiPartyNegotiation(buyerId: string, sellerIds: string[], productDetails: any) {
    const negotiation = await prisma.$executeRaw`
      INSERT INTO negotiations (
        id, buyer_id, product_id, type, status, participants, created_at
      ) VALUES (
        ${`neg_${Date.now()}`, buyerId, productDetails.productId, 'multi_party', 'active', 
        ${JSON.stringify([buyerId, ...sellerIds])}, ${new Date()}
      )
    `;

    // Create individual threads for each seller
    const threads = await Promise.all(
      sellerIds.map(sellerId => 
        this.createNegotiationThread(negotiation.id, buyerId, sellerId)
      )
    );

    return { negotiation, threads };
  }

  // Smart Contract Auto-Generation
  async generateSmartContract(negotiationId: string) {
    const negotiation = await this.getNegotiationById(negotiationId);
    
    const contractTerms = {
      parties: {
        buyer: negotiation.buyerId,
        seller: negotiation.sellerId
      },
      product: negotiation.productId,
      agreedPrice: negotiation.finalPrice,
      quantity: negotiation.quantity,
      deliveryTerms: this.extractDeliveryTerms(negotiation.messages),
      paymentTerms: this.extractPaymentTerms(negotiation.messages),
      qualityStandards: this.extractQualityTerms(negotiation.messages),
      penalties: this.generatePenaltyClauses(negotiation),
      generatedAt: new Date()
    };

    // Call AI to generate legal contract
    const aiContract = await axios.post(`${process.env.AI_SERVICE_URL}/api/contract/generate`, {
      terms: contractTerms,
      template: 'agricultural_trade'
    });

    await this.saveContract(negotiationId, aiContract.data);
    return aiContract.data;
  }

  // Price History Analytics
  async getPriceHistoryAnalytics(productId: string, timeRange: string = '30d') {
    const history = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        AVG(final_price) as avgPrice,
        MIN(final_price) as minPrice,
        MAX(final_price) as maxPrice,
        COUNT(*) as totalNegotiations,
        AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) as avgDuration
      FROM negotiations
      WHERE product_id = ${productId}
        AND status = 'completed'
        AND created_at >= DATE_SUB(NOW(), INTERVAL ${timeRange})
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    const trends = this.calculateTrends(history);
    const predictions = await this.predictFuturePrices(productId, history);

    return { history, trends, predictions };
  }

  // Automated Negotiation Bot
  async startAutomatedNegotiation(negotiationId: string, botConfig: any) {
    const negotiation = await this.getNegotiationById(negotiationId);
    
    const botStrategy = {
      minAcceptablePrice: botConfig.minPrice,
      maxAcceptablePrice: botConfig.maxPrice,
      aggressiveness: botConfig.aggressiveness || 'moderate',
      autoAcceptThreshold: botConfig.autoAcceptThreshold || 0.95,
      maxRounds: botConfig.maxRounds || 10
    };

    // Start bot negotiation loop
    const botResult = await this.runBotNegotiation(negotiationId, botStrategy);
    
    return botResult;
  }

  private async runBotNegotiation(negotiationId: string, strategy: any) {
    let round = 0;
    let currentOffer = strategy.maxAcceptablePrice;

    while (round < strategy.maxRounds) {
      const counterOffer = await this.generateCounterOffer(negotiationId, currentOffer);
      
      if (counterOffer.price <= strategy.minAcceptablePrice) {
        await this.acceptOffer(negotiationId, counterOffer.price);
        return { success: true, finalPrice: counterOffer.price, rounds: round };
      }

      currentOffer = this.calculateNextOffer(currentOffer, counterOffer.price, strategy);
      await this.sendNegotiationMessage(negotiationId, 'bot', `Counter offer: $${currentOffer}`, currentOffer);
      
      round++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
    }

    return { success: false, reason: 'Max rounds reached' };
  }

  // Sentiment Analysis Dashboard
  async analyzeSentiment(text: string): Promise<number> {
    try {
      const response = await axios.post(`${process.env.AI_SERVICE_URL}/api/sentiment/analyze`, {
        text
      });
      return response.data.score; // -1 to 1
    } catch (error) {
      return 0;
    }
  }

  async getNegotiationSentimentAnalysis(negotiationId: string) {
    const negotiation = await this.getNegotiationById(negotiationId);
    
    const sentiments = negotiation.messages.map((msg: any) => ({
      timestamp: msg.timestamp,
      sentiment: msg.sentiment,
      userId: msg.userId
    }));

    const avgSentiment = sentiments.reduce((acc: number, s: any) => acc + s.sentiment, 0) / sentiments.length;
    const successProbability = this.calculateSuccessProbability(avgSentiment, negotiation);

    return {
      sentiments,
      avgSentiment,
      successProbability,
      recommendation: this.getRecommendation(avgSentiment)
    };
  }

  // Deadline & Urgency Tracker
  async getActiveDeadlines(userId: string) {
    const negotiations = await prisma.$queryRaw`
      SELECT 
        id, product_id, deadline, status,
        TIMESTAMPDIFF(HOUR, NOW(), deadline) as hoursRemaining
      FROM negotiations
      WHERE (buyer_id = ${userId} OR seller_id = ${userId})
        AND status = 'active'
        AND deadline IS NOT NULL
      ORDER BY deadline ASC
    `;

    return negotiations.map((neg: any) => ({
      ...neg,
      urgency: this.calculateUrgency(neg.hoursRemaining),
      shouldNotify: neg.hoursRemaining <= 24
    }));
  }

  // Negotiation Templates Library
  async getTemplates(category?: string) {
    const templates = [
      {
        id: 'aggressive_buyer',
        name: 'Aggressive Buyer Strategy',
        description: 'Start low, increase slowly',
        strategy: { startPercent: 0.6, incrementPercent: 0.05, maxRounds: 8 }
      },
      {
        id: 'fair_trade',
        name: 'Fair Trade Approach',
        description: 'Balanced negotiation',
        strategy: { startPercent: 0.85, incrementPercent: 0.03, maxRounds: 5 }
      },
      {
        id: 'quick_close',
        name: 'Quick Close',
        description: 'Fast deal, slight premium',
        strategy: { startPercent: 0.95, incrementPercent: 0.02, maxRounds: 3 }
      },
      {
        id: 'bulk_discount',
        name: 'Bulk Discount Negotiation',
        description: 'Volume-based pricing',
        strategy: { startPercent: 0.7, incrementPercent: 0.04, maxRounds: 6 }
      }
    ];

    return category ? templates.filter(t => t.id.includes(category)) : templates;
  }

  async applyTemplate(negotiationId: string, templateId: string) {
    const template = (await this.getTemplates()).find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    await prisma.$executeRaw`
      UPDATE negotiations 
      SET strategy = ${JSON.stringify(template.strategy)}
      WHERE id = ${negotiationId}
    `;

    return template;
  }

  // Performance Metrics & Win Rate
  async getPerformanceMetrics(userId: string, timeRange: string = '90d') {
    const metrics = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as totalNegotiations,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successfulDeals,
        AVG(CASE WHEN status = 'completed' THEN 
          ((initial_price - final_price) / initial_price) * 100 
        END) as avgSavingsPercent,
        SUM(CASE WHEN status = 'completed' THEN 
          initial_price - final_price 
        END) as totalSavings,
        AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) as avgNegotiationTime
      FROM negotiations
      WHERE buyer_id = ${userId}
        AND created_at >= DATE_SUB(NOW(), INTERVAL ${timeRange})
    `;

    const winRate = (metrics[0].successfulDeals / metrics[0].totalNegotiations) * 100;

    return {
      ...metrics[0],
      winRate,
      performance: this.getPerformanceRating(winRate, metrics[0].avgSavingsPercent)
    };
  }

  // Helper methods
  private async getNegotiationById(id: string) {
    const result = await prisma.$queryRaw`
      SELECT * FROM negotiations WHERE id = ${id}
    `;
    return result[0];
  }

  private async getMarketData(productId: string) {
    // Fetch real-time market data
    return {
      currentMarketPrice: 100,
      trend: 'stable',
      volatility: 0.05
    };
  }

  private async saveCounterOffer(negotiationId: string, offer: any) {
    await prisma.$executeRaw`
      UPDATE negotiations 
      SET ai_suggestions = JSON_ARRAY_APPEND(ai_suggestions, '$', CAST(${JSON.stringify(offer)} AS JSON))
      WHERE id = ${negotiationId}
    `;
  }

  private async createNegotiationThread(negotiationId: string, buyerId: string, sellerId: string) {
    return { negotiationId, buyerId, sellerId, threadId: `thread_${Date.now()}` };
  }

  private extractDeliveryTerms(messages: any[]) {
    return { method: 'standard', days: 7 };
  }

  private extractPaymentTerms(messages: any[]) {
    return { method: 'escrow', terms: 'net30' };
  }

  private extractQualityTerms(messages: any[]) {
    return { grade: 'A', standards: 'organic' };
  }

  private generatePenaltyClauses(negotiation: any) {
    return { lateDelivery: '5% per day', qualityIssue: '20% refund' };
  }

  private async saveContract(negotiationId: string, contract: any) {
    await prisma.$executeRaw`
      UPDATE negotiations 
      SET contract = ${JSON.stringify(contract)}
      WHERE id = ${negotiationId}
    `;
  }

  private calculateTrends(history: any[]) {
    return { direction: 'up', strength: 0.7 };
  }

  private async predictFuturePrices(productId: string, history: any[]) {
    return [{ date: '2026-05-01', predictedPrice: 105 }];
  }

  private calculateNextOffer(current: number, counter: number, strategy: any) {
    return current - (current * 0.05);
  }

  private async acceptOffer(negotiationId: string, price: number) {
    await prisma.$executeRaw`
      UPDATE negotiations 
      SET status = 'completed', final_price = ${price}
      WHERE id = ${negotiationId}
    `;
  }

  private calculateSuccessProbability(sentiment: number, negotiation: any) {
    return Math.min(Math.max((sentiment + 1) * 50, 0), 100);
  }

  private getRecommendation(sentiment: number) {
    if (sentiment > 0.5) return 'Positive momentum - push for better terms';
    if (sentiment < -0.5) return 'Negative sentiment - consider compromise';
    return 'Neutral - maintain current strategy';
  }

  private calculateUrgency(hoursRemaining: number) {
    if (hoursRemaining <= 6) return 'critical';
    if (hoursRemaining <= 24) return 'high';
    if (hoursRemaining <= 72) return 'medium';
    return 'low';
  }

  private getPerformanceRating(winRate: number, savings: number) {
    if (winRate > 80 && savings > 15) return 'excellent';
    if (winRate > 60 && savings > 10) return 'good';
    if (winRate > 40) return 'average';
    return 'needs_improvement';
  }
}

export default new NegotiationService();
