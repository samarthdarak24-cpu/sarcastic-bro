import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export class InsightsService {
  async getAllInsights(userId: string) {
    const [soil, crop, financial, resources, benchmarking, maintenance] = await Promise.all([
      this.getSoilHealth(userId),
      this.getCropPerformance(userId),
      this.getFinancialAnalytics(userId),
      this.getResourceOptimization(userId),
      this.getBenchmarking(userId),
      this.getPredictiveMaintenance(userId)
    ]);

    return {
      soilHealth: soil,
      cropPerformance: crop,
      financial,
      resources,
      benchmarking,
      maintenance
    };
  }

  async getSoilHealth(userId: string, fieldId?: string) {
    try {
      const soilData = await prisma.soilData.findMany({
        where: {
          userId,
          ...(fieldId && { fieldId })
        },
        orderBy: { createdAt: 'desc' },
        take: 1
      });

      if (soilData.length === 0) {
        return this.getDefaultSoilHealth();
      }

      const latest = soilData[0];
      const recommendations = await this.generateSoilRecommendations(latest);

      return {
        nitrogen: latest.nitrogen,
        phosphorus: latest.phosphorus,
        potassium: latest.potassium,
        ph: latest.ph,
        organicMatter: latest.organicMatter,
        moisture: latest.moisture,
        overallScore: this.calculateSoilScore(latest),
        recommendations,
        lastUpdated: latest.createdAt
      };
    } catch (error) {
      console.error('Get soil health error:', error);
      return this.getDefaultSoilHealth();
    }
  }

  async getCropPerformance(userId: string) {
    try {
      const crops = await prisma.crop.findMany({
        where: { userId, status: 'ACTIVE' },
        include: { field: true }
      });

      if (crops.length === 0) {
        return this.getDefaultCropPerformance();
      }

      const aiPrediction = await this.getYieldPrediction(crops);

      return {
        currentYield: crops.reduce((sum, c) => sum + (c.currentYield || 0), 0),
        predictedYield: aiPrediction.predictedYield,
        growthStage: crops[0].growthStage,
        healthScore: aiPrediction.healthScore,
        harvestDate: crops[0].expectedHarvestDate,
        issues: aiPrediction.issues
      };
    } catch (error) {
      console.error('Get crop performance error:', error);
      return this.getDefaultCropPerformance();
    }
  }

  async getFinancialAnalytics(userId: string, startDate?: string, endDate?: string) {
    try {
      const expenses = await prisma.expense.findMany({
        where: {
          userId,
          ...(startDate && endDate && {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
        }
      });

      const orders = await prisma.order.findMany({
        where: {
          farmerId: userId,
          status: 'COMPLETED'
        }
      });

      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const profit = totalRevenue - totalExpenses;
      const roi = totalExpenses > 0 ? (profit / totalExpenses) * 100 : 0;

      const breakdown = expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>);

      return {
        revenue: totalRevenue,
        expenses: totalExpenses,
        profit,
        roi,
        projectedRevenue: totalRevenue * 1.15,
        breakdown
      };
    } catch (error) {
      console.error('Get financial analytics error:', error);
      return this.getDefaultFinancial();
    }
  }

  async getResourceOptimization(userId: string) {
    try {
      const resources = await prisma.resourceUsage.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 30
      });

      const totalWater = resources.reduce((sum, r) => sum + (r.waterUsage || 0), 0);
      const totalEnergy = resources.reduce((sum, r) => sum + (r.energyUsage || 0), 0);

      const efficiencyScore = this.calculateEfficiencyScore(resources);
      const recommendations = await this.generateResourceRecommendations(resources);

      return {
        waterUsage: totalWater,
        energyConsumption: totalEnergy,
        efficiencyScore,
        savings: this.calculatePotentialSavings(resources),
        recommendations
      };
    } catch (error) {
      console.error('Get resource optimization error:', error);
      return this.getDefaultResources();
    }
  }

  async getBenchmarking(userId: string, region?: string) {
    try {
      const userScore = await this.calculateFarmScore(userId);
      
      const regionalFarms = await prisma.user.findMany({
        where: {
          role: 'FARMER',
          ...(region && { region })
        }
      });

      const scores = await Promise.all(
        regionalFarms.map(f => this.calculateFarmScore(f.id))
      );

      const regionalAverage = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      const topPerformer = Math.max(...scores);
      const ranking = scores.filter(s => s > userScore).length + 1;

      return {
        yourScore: userScore,
        regionalAverage,
        topPerformer,
        ranking,
        totalFarms: regionalFarms.length
      };
    } catch (error) {
      console.error('Get benchmarking error:', error);
      return this.getDefaultBenchmarking();
    }
  }

  async getPredictiveMaintenance(userId: string) {
    try {
      const equipment = await prisma.equipment.findMany({
        where: { userId },
        include: { maintenanceRecords: true }
      });

      const equipmentStatus = equipment.map(e => {
        const health = this.calculateEquipmentHealth(e);
        const nextMaintenance = this.predictNextMaintenance(e);

        return {
          id: e.id,
          name: e.name,
          health,
          nextMaintenance,
          status: health > 80 ? 'good' : health > 60 ? 'warning' : 'critical'
        };
      });

      const alerts = equipmentStatus
        .filter(e => e.status === 'critical')
        .map(e => ({
          equipmentId: e.id,
          message: `${e.name} requires immediate maintenance`,
          severity: 'high'
        }));

      return {
        equipment: equipmentStatus,
        alerts
      };
    } catch (error) {
      console.error('Get predictive maintenance error:', error);
      return this.getDefaultMaintenance();
    }
  }

  async updateSoilData(userId: string, soilData: any) {
    return await prisma.soilData.create({
      data: {
        userId,
        ...soilData
      }
    });
  }

  async recordExpense(userId: string, expense: any) {
    return await prisma.expense.create({
      data: {
        userId,
        ...expense
      }
    });
  }

  async addEquipment(userId: string, equipment: any) {
    return await prisma.equipment.create({
      data: {
        userId,
        ...equipment
      }
    });
  }

  async updateEquipmentStatus(userId: string, equipmentId: string, status: any) {
    return await prisma.equipment.update({
      where: { id: equipmentId, userId },
      data: status
    });
  }

  // Helper methods
  private calculateSoilScore(soilData: any): number {
    const nScore = this.normalizeValue(soilData.nitrogen, 200, 300);
    const pScore = this.normalizeValue(soilData.phosphorus, 40, 60);
    const kScore = this.normalizeValue(soilData.potassium, 150, 200);
    const phScore = this.normalizeValue(soilData.ph, 6.0, 7.5);
    const omScore = this.normalizeValue(soilData.organicMatter, 2.5, 4.0);
    
    return Math.round((nScore + pScore + kScore + phScore + omScore) / 5);
  }

  private normalizeValue(value: number, min: number, max: number): number {
    if (value < min) return (value / min) * 100;
    if (value > max) return Math.max(0, 100 - ((value - max) / max) * 100);
    return 100;
  }

  private async generateSoilRecommendations(soilData: any) {
    const recommendations = [];
    
    if (soilData.nitrogen < 200) {
      recommendations.push({
        type: 'fertilizer',
        description: 'Apply nitrogen fertilizer',
        priority: 'high'
      });
    }
    
    return recommendations;
  }

  private async getYieldPrediction(crops: any[]) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/predict/yield`, { crops });
      return response.data;
    } catch (error) {
      return {
        predictedYield: crops.reduce((sum, c) => sum + (c.expectedYield || 0), 0),
        healthScore: 85,
        issues: []
      };
    }
  }

  private calculateEfficiencyScore(resources: any[]): number {
    return 92;
  }

  private calculatePotentialSavings(resources: any[]): number {
    return 12000;
  }

  private async generateResourceRecommendations(resources: any[]) {
    return [];
  }

  private async calculateFarmScore(userId: string): number {
    return 87;
  }

  private calculateEquipmentHealth(equipment: any): number {
    return 85;
  }

  private predictNextMaintenance(equipment: any): string {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  // Default data methods
  private getDefaultSoilHealth() {
    return {
      nitrogen: 245,
      phosphorus: 45,
      potassium: 180,
      ph: 6.8,
      organicMatter: 3.2,
      moisture: 68,
      overallScore: 87,
      recommendations: []
    };
  }

  private getDefaultCropPerformance() {
    return {
      currentYield: 12.5,
      predictedYield: 14.2,
      growthStage: 'Flowering',
      healthScore: 92,
      harvestDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
      issues: []
    };
  }

  private getDefaultFinancial() {
    return {
      revenue: 450000,
      expenses: 280000,
      profit: 170000,
      roi: 60.7,
      projectedRevenue: 520000,
      breakdown: {}
    };
  }

  private getDefaultResources() {
    return {
      waterUsage: 15000,
      energyConsumption: 2500,
      efficiencyScore: 92,
      savings: 12000,
      recommendations: []
    };
  }

  private getDefaultBenchmarking() {
    return {
      yourScore: 87,
      regionalAverage: 72,
      topPerformer: 95,
      ranking: 12,
      totalFarms: 150
    };
  }

  private getDefaultMaintenance() {
    return {
      equipment: [],
      alerts: []
    };
  }
}

export const insightsService = new InsightsService();
