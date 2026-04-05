import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface EscrowCreationData {
  orderId: string;
  amount: number;
  buyerId: string;
  sellerId: string;
  milestones?: Array<{
    name: string;
    percentage: number;
    condition: string;
  }>;
}

interface DisputeData {
  escrowId: string;
  raisedBy: string;
  reason: string;
  evidence: string[];
}

export class EscrowService {
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  async createSmartEscrow(data: EscrowCreationData) {
    // AI Risk Assessment
    const riskAssessment = await axios.post(`${this.aiServiceUrl}/api/escrow/risk-assessment`, {
      buyerId: data.buyerId,
      sellerId: data.sellerId,
      amount: data.amount,
    });

    // Auto-generate milestones if not provided
    let milestones = data.milestones;
    if (!milestones || milestones.length === 0) {
      const aiMilestones = await axios.post(`${this.aiServiceUrl}/api/escrow/generate-milestones`, {
        orderId: data.orderId,
        amount: data.amount,
      });
      milestones = aiMilestones.data.milestones;
    }

    const escrow = await prisma.escrow.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
        buyerId: data.buyerId,
        sellerId: data.sellerId,
        status: 'ACTIVE',
        riskScore: riskAssessment.data.riskScore,
        riskLevel: riskAssessment.data.riskLevel,
        milestones: JSON.stringify(milestones),
        createdAt: new Date(),
      },
    });

    return {
      escrow,
      riskAssessment: riskAssessment.data,
      milestones,
    };
  }

  async getEscrowAnalytics(userId: string, role: string) {
    const escrows = await prisma.escrow.findMany({
      where: role === 'BUYER' ? { buyerId: userId } : { sellerId: userId },
      include: {
        order: true,
      },
    });

    const totalAmount = escrows.reduce((sum, e) => sum + e.amount, 0);
    const activeCount = escrows.filter(e => e.status === 'ACTIVE').length;
    const completedCount = escrows.filter(e => e.status === 'COMPLETED').length;
    const disputedCount = escrows.filter(e => e.status === 'DISPUTED').length;

    const avgRiskScore = escrows.reduce((sum, e) => sum + (e.riskScore || 0), 0) / escrows.length;

    return {
      totalEscrows: escrows.length,
      totalAmount,
      activeCount,
      completedCount,
      disputedCount,
      avgRiskScore,
      escrows: escrows.map(e => ({
        id: e.id,
        orderId: e.orderId,
        amount: e.amount,
        status: e.status,
        riskScore: e.riskScore,
        riskLevel: e.riskLevel,
        createdAt: e.createdAt,
        milestones: JSON.parse(e.milestones || '[]'),
      })),
    };
  }

  async releaseFunds(escrowId: string, milestoneIndex: number, verificationData: any) {
    const escrow = await prisma.escrow.findUnique({ where: { id: escrowId } });
    if (!escrow) throw new Error('Escrow not found');

    const milestones = JSON.parse(escrow.milestones || '[]');
    const milestone = milestones[milestoneIndex];

    // AI verification
    const verification = await axios.post(`${this.aiServiceUrl}/api/escrow/verify-milestone`, {
      escrowId,
      milestone,
      verificationData,
    });

    if (verification.data.approved) {
      milestones[milestoneIndex].status = 'RELEASED';
      milestones[milestoneIndex].releasedAt = new Date();

      const allReleased = milestones.every((m: any) => m.status === 'RELEASED');

      await prisma.escrow.update({
        where: { id: escrowId },
        data: {
          milestones: JSON.stringify(milestones),
          status: allReleased ? 'COMPLETED' : 'ACTIVE',
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          escrowId,
          amount: (escrow.amount * milestone.percentage) / 100,
          type: 'RELEASE',
          status: 'COMPLETED',
          createdAt: new Date(),
        },
      });

      return { success: true, milestone: milestones[milestoneIndex] };
    }

    return { success: false, reason: verification.data.reason };
  }

  async raiseDispute(data: DisputeData) {
    const dispute = await prisma.dispute.create({
      data: {
        escrowId: data.escrowId,
        raisedBy: data.raisedBy,
        reason: data.reason,
        evidence: JSON.stringify(data.evidence),
        status: 'PENDING',
        createdAt: new Date(),
      },
    });

    // AI Analysis
    const aiAnalysis = await axios.post(`${this.aiServiceUrl}/api/escrow/analyze-dispute`, {
      disputeId: dispute.id,
      reason: data.reason,
      evidence: data.evidence,
    });

    await prisma.dispute.update({
      where: { id: dispute.id },
      data: {
        aiAnalysis: JSON.stringify(aiAnalysis.data),
        aiRecommendation: aiAnalysis.data.recommendation,
      },
    });

    await prisma.escrow.update({
      where: { id: data.escrowId },
      data: { status: 'DISPUTED' },
    });

    return { dispute, aiAnalysis: aiAnalysis.data };
  }

  async detectFraud(escrowId: string) {
    const escrow = await prisma.escrow.findUnique({
      where: { id: escrowId },
      include: { order: true },
    });

    const fraudCheck = await axios.post(`${this.aiServiceUrl}/api/escrow/fraud-detection`, {
      escrowId,
      amount: escrow?.amount,
      buyerId: escrow?.buyerId,
      sellerId: escrow?.sellerId,
    });

    if (fraudCheck.data.isFraudulent) {
      await prisma.escrow.update({
        where: { id: escrowId },
        data: {
          status: 'FROZEN',
          fraudAlert: JSON.stringify(fraudCheck.data),
        },
      });
    }

    return fraudCheck.data;
  }

  async calculateInsurance(escrowId: string) {
    const escrow = await prisma.escrow.findUnique({ where: { id: escrowId } });

    const insurance = await axios.post(`${this.aiServiceUrl}/api/escrow/calculate-insurance`, {
      amount: escrow?.amount,
      riskScore: escrow?.riskScore,
      riskLevel: escrow?.riskLevel,
    });

    return insurance.data;
  }

  async getMultiPartyEscrows(userId: string) {
    const escrows = await prisma.multiPartyEscrow.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { participants: { has: userId } },
        ],
      },
    });

    return escrows;
  }

  async createAutoRefund(escrowId: string, reason: string) {
    const escrow = await prisma.escrow.findUnique({ where: { id: escrowId } });

    const refund = await prisma.refund.create({
      data: {
        escrowId,
        amount: escrow?.amount || 0,
        reason,
        status: 'PROCESSING',
        createdAt: new Date(),
      },
    });

    // Process refund via blockchain
    const blockchainTx = await axios.post(`${this.aiServiceUrl}/api/escrow/process-refund`, {
      refundId: refund.id,
      amount: escrow?.amount,
      buyerId: escrow?.buyerId,
    });

    await prisma.refund.update({
      where: { id: refund.id },
      data: {
        status: 'COMPLETED',
        transactionHash: blockchainTx.data.txHash,
      },
    });

    return refund;
  }

  async getEscrowMarketplace() {
    const listings = await prisma.escrowListing.findMany({
      where: { status: 'ACTIVE' },
      include: { escrow: true },
    });

    return listings;
  }
}

export default new EscrowService();
