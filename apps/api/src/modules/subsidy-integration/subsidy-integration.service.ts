import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SubsidyIntegrationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async checkSubsidyEligibility(data: {
    farmerId: string;
    cropType: string;
    landHolding: number;
    income: number;
    state: string;
  }) {
    const eligibility = {
      pmKisan: this.checkPMKisanEligibility(data),
      cropInsurance: this.checkCropInsuranceEligibility(data),
      soilHealthCard: this.checkSoilHealthCardEligibility(data),
      drip: this.checkDripIrrigationSubsidy(data),
    };

    return {
      farmerId: data.farmerId,
      eligibleSchemes: Object.entries(eligibility)
        .filter(([_, eligible]) => eligible)
        .map(([scheme]) => scheme),
      details: eligibility,
      totalBenefit: this.calculateTotalBenefit(eligibility),
    };
  }

  async getSubsidyPrograms(state: string) {
    const programs = [
      {
        id: 'pm-kisan',
        name: 'PM-KISAN Scheme',
        description: 'Direct benefit transfer of ₹6000 per year',
        amount: 6000,
        frequency: 'ANNUAL',
        eligibility: 'All farmers with land',
      },
      {
        id: 'crop-insurance',
        name: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Crop insurance coverage',
        amount: 'Variable',
        frequency: 'PER_SEASON',
        eligibility: 'Farmers with insurable crops',
      },
      {
        id: 'soil-health',
        name: 'Soil Health Card Scheme',
        description: 'Free soil testing and recommendations',
        amount: 0,
        frequency: 'ONE_TIME',
        eligibility: 'All farmers',
      },
      {
        id: 'drip-irrigation',
        name: 'Pradhan Mantri Krishi Sinchayee Yojana',
        description: 'Subsidy for drip irrigation systems',
        amount: 50000,
        frequency: 'ONE_TIME',
        eligibility: 'Farmers with suitable land',
      },
    ];

    return programs;
  }

  async applyForSubsidy(data: {
    farmerId: string;
    schemeId: string;
    documents: string[];
    bankDetails: {
      accountNumber: string;
      ifscCode: string;
      accountHolder: string;
    };
  }) {
    const application = await this.prisma.subsidyApplication.create({
      data: {
        farmerId: data.farmerId,
        schemeId: data.schemeId,
        status: 'SUBMITTED',
        documents: data.documents,
        bankDetails: data.bankDetails,
        submittedAt: new Date(),
      },
    });

    return {
      applicationId: application.id,
      status: 'SUBMITTED',
      message: 'Application submitted successfully',
      estimatedProcessingTime: '15-30 days',
    };
  }

  async getApplicationStatus(applicationId: string) {
    const application = await this.prisma.subsidyApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) throw new Error('Application not found');

    return {
      applicationId,
      status: application.status,
      schemeId: application.schemeId,
      submittedAt: application.submittedAt,
      approvedAt: application.approvedAt,
      disbursedAmount: application.disbursedAmount,
      documents: application.documents,
    };
  }

  async trackSubsidyDisbursement(farmerId: string) {
    const applications = await this.prisma.subsidyApplication.findMany({
      where: { farmerId, status: 'APPROVED' },
    });

    return {
      farmerId,
      totalDisbursed: applications.reduce(
        (sum, app) => sum + (app.disbursedAmount || 0),
        0
      ),
      applications: applications.map((app) => ({
        schemeId: app.schemeId,
        amount: app.disbursedAmount,
        disbursedDate: app.approvedAt,
        status: app.status,
      })),
    };
  }

  async generateSubsidyReport(farmerId: string) {
    const applications = await this.prisma.subsidyApplication.findMany({
      where: { farmerId },
    });

    const totalBenefit = applications.reduce(
      (sum, app) => sum + (app.disbursedAmount || 0),
      0
    );

    return {
      farmerId,
      totalApplications: applications.length,
      approvedApplications: applications.filter(
        (a) => a.status === 'APPROVED'
      ).length,
      totalBenefit,
      applications: applications.map((app) => ({
        schemeId: app.schemeId,
        status: app.status,
        amount: app.disbursedAmount,
        submittedAt: app.submittedAt,
      })),
    };
  }

  private checkPMKisanEligibility(data: any): boolean {
    return data.landHolding > 0;
  }

  private checkCropInsuranceEligibility(data: any): boolean {
    const insurableCrops = [
      'wheat',
      'rice',
      'cotton',
      'sugarcane',
      'corn',
      'pulses',
    ];
    return insurableCrops.includes(data.cropType.toLowerCase());
  }

  private checkSoilHealthCardEligibility(data: any): boolean {
    return data.landHolding > 0;
  }

  private checkDripIrrigationSubsidy(data: any): boolean {
    return data.landHolding >= 0.5 && data.income < 500000;
  }

  private calculateTotalBenefit(eligibility: Record<string, boolean>): number {
    let total = 0;
    if (eligibility.pmKisan) total += 6000;
    if (eligibility.cropInsurance) total += 2000;
    if (eligibility.drip) total += 50000;
    return total;
  }
}
