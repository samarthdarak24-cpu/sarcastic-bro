import prisma from '../config/database';
import { CropGrade, CropStatus, OrderStatus } from '@prisma/client';

export class AnalyticsService {
  static async getFarmerAnalytics(userId: string) {
    // 1. Yield Performance (Recent crops)
    const recentCrops = await prisma.crop.findMany({
      where: { farmerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const yieldData = recentCrops.map(c => ({
      name: new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      yield: c.quantity,
      grade: c.grade
    })).reverse();

    // 2. Financial Health (Earnings vs Pending)
    const earnings = await prisma.farmerEarning.findMany({
      where: { farmerId: userId },
    });

    const totalEarned = earnings.filter(e => e.status === 'COMPLETED').reduce((sum, e) => sum + e.amount, 0);
    const totalPending = earnings.filter(e => e.status === 'PENDING').reduce((sum, e) => sum + e.amount, 0);

    const financialData = [
      { name: 'Realized Revenue', value: totalEarned },
      { name: 'Awaiting Escrow', value: totalPending }
    ];

    // 3. Buyer Intelligence (mocking distribution for now based on orders)
    const orders = await prisma.order.findMany({
      where: { 
        crop: { farmerId: userId }
      },
      include: { buyer: true }
    });

    const buyerTypes = {
      'Corporate (Tier-1)': 0,
      'Institutional': 0,
      'Retail Aggregator': 0
    };

    orders.forEach(o => {
      // Logic to categorize buyers based on volume or name patterns
      if (o.totalAmount > 50000) buyerTypes['Corporate (Tier-1)']++;
      else if (o.totalAmount > 10000) buyerTypes['Institutional']++;
      else buyerTypes['Retail Aggregator']++;
    });

    const buyerData = Object.entries(buyerTypes).map(([name, value]) => ({ name, value }));

    // 4. Resource Efficiency (Derive from quality scans)
    const scans = await prisma.qualityScan.findMany({
      where: { farmerId: userId },
      orderBy: { createdAt: 'asc' },
    });

    const efficiencyData = scans.map(s => ({
      name: new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      score: s.score,
      freshness: s.freshness
    }));

    return {
      yieldData,
      financialData,
      buyerData,
      efficiencyData,
      summary: {
        totalCrops: recentCrops.length,
        totalRevenue: totalEarned,
        pendingRevenue: totalPending,
        activeOrders: orders.filter(o => o.status !== 'DELIVERED').length
      }
    };
  }

  static async getFPOAnalytics(fpoId: string) {
    // Similar logic for FPO...
    const lots = await prisma.aggregatedLot.findMany({
      where: { fpoId },
      include: { orders: true }
    });

    const totalVolume = lots.reduce((sum, l) => sum + l.totalQuantity, 0);
    const totalRevenue = lots.flatMap(l => l.orders).reduce((sum, o) => sum + o.totalAmount, 0);

    return {
        totalVolume,
        totalRevenue,
        activeLots: lots.filter(l => l.status === 'LISTED').length
    };
  }
}
