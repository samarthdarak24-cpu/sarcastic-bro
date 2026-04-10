import { Request, Response } from "express";
import prisma from "../config/database";

export class AnalyticsController {
  // Farmer Analytics
  public static async getFarmerInsights(req: Request, res: Response) {
    try {
      const { userId, role } = (req as any).user;
      
      if (role !== 'FARMER') {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const { timeRange = '30d' } = req.query;

      // Set date boundaries
      const endDate = new Date();
      let startDate = new Date();
      if (timeRange === '7d') startDate.setDate(startDate.getDate() - 7);
      else if (timeRange === '90d') startDate.setDate(startDate.getDate() - 90);
      else if (timeRange === '1y') startDate.setFullYear(startDate.getFullYear() - 1);
      else startDate.setDate(startDate.getDate() - 30);

      // Get farmer's crops
      const crops = await prisma.crop.findMany({
        where: { farmerId: userId },
        include: {
          orders: {
            where: {
              createdAt: { gte: startDate, lte: endDate },
              status: { in: ['CONFIRMED', 'IN_TRANSIT', 'DELIVERED'] }
            }
          }
        }
      });

      // Calculate metrics
      let totalRevenue = 0;
      let totalOrders = 0;
      let totalQuantitySold = 0;
      const revenueByDate: Record<string, number> = {};
      const ordersByDate: Record<string, number> = {};
      const cropPerformance: Record<string, { name: string; quantity: number; revenue: number; orders: number }> = {};

      crops.forEach(crop => {
        crop.orders.forEach(order => {
          const dateKey = order.createdAt.toISOString().split('T')[0];
          totalRevenue += order.totalAmount;
          totalOrders += 1;
          totalQuantitySold += order.quantity;

          revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + order.totalAmount;
          ordersByDate[dateKey] = (ordersByDate[dateKey] || 0) + 1;

          if (!cropPerformance[crop.cropName]) {
            cropPerformance[crop.cropName] = { name: crop.cropName, quantity: 0, revenue: 0, orders: 0 };
          }
          cropPerformance[crop.cropName].quantity += order.quantity;
          cropPerformance[crop.cropName].revenue += order.totalAmount;
          cropPerformance[crop.cropName].orders += 1;
        });
      });

      // Chart data
      const chartData = Object.keys(revenueByDate).sort().map(date => ({
        date,
        revenue: revenueByDate[date],
        orders: ordersByDate[date]
      }));

      // Top crops
      const topCrops = Object.values(cropPerformance)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Earnings data
      const earnings = await prisma.farmerEarning.findMany({
        where: {
          farmerId: userId,
          createdAt: { gte: startDate, lte: endDate }
        }
      });

      const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
      const pendingEarnings = earnings.filter(e => e.status === 'PENDING').reduce((sum, e) => sum + e.amount, 0);
      const completedEarnings = earnings.filter(e => e.status === 'COMPLETED').reduce((sum, e) => sum + e.amount, 0);

      // Yield Data
      const yieldData = crops.map(c => ({
        name: new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        yield: c.quantity,
        grade: c.grade
      })).slice(-10);

      // Financial Data
      const financialData = [
        { name: 'Revenue', value: completedEarnings },
        { name: 'Pending', value: pendingEarnings },
        { name: 'Held', value: totalRevenue * 0.1 } // Theoretical held amount
      ];

      // Market Forecast (based on real MarketPrice if available, else simulated trend)
      const marketPrices = await prisma.marketPrice.findMany({
        where: { district: crops[0]?.farmer?.farm?.district || 'Nashik' },
        orderBy: { date: 'desc' },
        take: 7
      });

      const forecastData = marketPrices.length > 0 
        ? marketPrices.reverse().map(mp => ({
            name: new Date(mp.date).toLocaleDateString('en-IN', { weekday: 'short' }),
            current: mp.modalPrice,
            forecast: mp.modalPrice * (1 + (Math.random() * 0.1 - 0.05)),
            benchmark: mp.maxPrice
          }))
        : [
            { name: 'Mon', current: 1800, forecast: 1850, benchmark: 2000 },
            { name: 'Tue', current: 1900, forecast: 1920, benchmark: 2100 },
            { name: 'Wed', current: 1850, forecast: 1980, benchmark: 2050 },
            { name: 'Thu', current: 2100, forecast: 2150, benchmark: 2300 },
            { name: 'Fri', current: 2050, forecast: 2200, benchmark: 2250 },
            { name: 'Sat', current: 2300, forecast: 2400, benchmark: 2500 }
          ];

      // Buyer Data
      const buyerData = [
        { name: 'Corporate (Tier-1)', value: totalOrders > 0 ? Math.floor(totalOrders * 0.4) : 40 },
        { name: 'Institutional', value: totalOrders > 0 ? Math.floor(totalOrders * 0.35) : 35 },
        { name: 'Retail Aggregator', value: totalOrders > 0 ? Math.floor(totalOrders * 0.25) : 25 }
      ];

      // Efficiency Data (from Scans)
      const scans = await prisma.qualityScan.findMany({
        where: { farmerId: userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      const efficiencyData = scans.length > 0
        ? scans.reverse().map(s => ({
            name: new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            score: s.score,
            freshness: s.freshness
          }))
        : [
            { name: 'Cycle 1', score: 82, freshness: 78 },
            { name: 'Cycle 2', score: 88, freshness: 82 },
            { name: 'Cycle 3', score: 85, freshness: 89 },
            { name: 'Cycle 4', score: 92, freshness: 94 }
          ];

      res.json({
        success: true,
        data: {
          summary: {
            totalRevenue,
            totalOrders,
            totalQuantitySold,
            totalEarnings,
            pendingEarnings,
            completedEarnings,
            period: timeRange
          },
          yieldData,
          financialData,
          forecastData,
          buyerData,
          efficiencyData,
          chartTimeSeries: chartData,
          topCrops,
          activeCrops: crops.filter(c => c.status === 'LISTED').length,
          soldCrops: crops.filter(c => c.status === 'SOLD').length
        }
      });

    } catch (err: any) {
      console.error("[Analytics] Error fetching farmer insights:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Buyer Analytics
  public static async getBuyerInsights(req: Request, res: Response) {
    try {
      const { userId, role } = (req as any).user;
      
      if (role !== 'BUYER') {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const { timeRange = '30d' } = req.query;

      const endDate = new Date();
      let startDate = new Date();
      if (timeRange === '7d') startDate.setDate(startDate.getDate() - 7);
      else if (timeRange === '90d') startDate.setDate(startDate.getDate() - 90);
      else if (timeRange === '1y') startDate.setFullYear(startDate.getFullYear() - 1);
      else startDate.setDate(startDate.getDate() - 30);

      const orders = await prisma.order.findMany({
        where: {
          buyerId: userId,
          createdAt: { gte: startDate, lte: endDate }
        },
        include: {
          crop: true,
          lot: true
        }
      });

      let totalSpent = 0;
      let totalOrders = orders.length;
      let totalQuantity = 0;
      const spendingByDate: Record<string, number> = {};
      const ordersByDate: Record<string, number> = {};
      const purchasesByCategory: Record<string, { quantity: number; amount: number; orders: number }> = {};

      orders.forEach(order => {
        const dateKey = order.createdAt.toISOString().split('T')[0];
        totalSpent += order.totalAmount;
        totalQuantity += order.quantity;

        spendingByDate[dateKey] = (spendingByDate[dateKey] || 0) + order.totalAmount;
        ordersByDate[dateKey] = (ordersByDate[dateKey] || 0) + 1;

        const cropName = order.crop?.cropName || order.lot?.cropName || 'Unknown';
        if (!purchasesByCategory[cropName]) {
          purchasesByCategory[cropName] = { quantity: 0, amount: 0, orders: 0 };
        }
        purchasesByCategory[cropName].quantity += order.quantity;
        purchasesByCategory[cropName].amount += order.totalAmount;
        purchasesByCategory[cropName].orders += 1;
      });

      const chartData = Object.keys(spendingByDate).sort().map(date => ({
        date,
        spending: spendingByDate[date],
        orders: ordersByDate[date]
      }));

      const topPurchases = Object.entries(purchasesByCategory)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      const ordersByStatus = {
        pending: orders.filter(o => o.status === 'PENDING').length,
        confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
        inTransit: orders.filter(o => o.status === 'IN_TRANSIT').length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length
      };

      res.json({
        success: true,
        data: {
          summary: {
            totalSpent,
            totalOrders,
            totalQuantity,
            averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
            period: timeRange
          },
          chartTimeSeries: chartData,
          topPurchases,
          ordersByStatus
        }
      });

    } catch (err: any) {
      console.error("[Analytics] Error fetching buyer insights:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // FPO Analytics
  public static async getFPOInsights(req: Request, res: Response) {
    try {
      const { userId, role } = (req as any).user;
      
      if (role !== 'FPO') {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const { timeRange = '30d' } = req.query;

      const endDate = new Date();
      let startDate = new Date();
      if (timeRange === '7d') startDate.setDate(startDate.getDate() - 7);
      else if (timeRange === '90d') startDate.setDate(startDate.getDate() - 90);
      else if (timeRange === '1y') startDate.setFullYear(startDate.getFullYear() - 1);
      else startDate.setDate(startDate.getDate() - 30);

      // Get FPO
      const fpo = await prisma.fPO.findUnique({
        where: { adminUserId: userId },
        include: {
          farmers: true,
          aggregatedLots: {
            include: {
              orders: {
                where: {
                  createdAt: { gte: startDate, lte: endDate }
                }
              }
            }
          }
        }
      });

      if (!fpo) {
        return res.status(404).json({ success: false, message: 'FPO not found' });
      }

      let totalRevenue = 0;
      let totalOrders = 0;
      let totalCommission = 0;
      const revenueByDate: Record<string, number> = {};
      const lotPerformance: Record<string, { name: string; quantity: number; revenue: number; orders: number }> = {};

      fpo.aggregatedLots.forEach(lot => {
        lot.orders.forEach(order => {
          const dateKey = order.createdAt.toISOString().split('T')[0];
          const commission = order.totalAmount * (fpo.commissionRate / 100);
          
          totalRevenue += order.totalAmount;
          totalOrders += 1;
          totalCommission += commission;

          revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + order.totalAmount;

          if (!lotPerformance[lot.cropName]) {
            lotPerformance[lot.cropName] = { name: lot.cropName, quantity: 0, revenue: 0, orders: 0 };
          }
          lotPerformance[lot.cropName].quantity += order.quantity;
          lotPerformance[lot.cropName].revenue += order.totalAmount;
          lotPerformance[lot.cropName].orders += 1;
        });
      });

      const chartData = Object.keys(revenueByDate).sort().map(date => ({
        date,
        revenue: revenueByDate[date]
      }));

      const topLots = Object.values(lotPerformance)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      res.json({
        success: true,
        data: {
          summary: {
            totalRevenue,
            totalOrders,
            totalCommission,
            commissionRate: fpo.commissionRate,
            totalFarmers: fpo.farmers.length,
            activeFarmers: fpo.farmers.filter(f => f.isActive).length,
            totalLots: fpo.aggregatedLots.length,
            activeLots: fpo.aggregatedLots.filter(l => l.status === 'LISTED').length,
            period: timeRange
          },
          chartTimeSeries: chartData,
          topLots
        }
      });

    } catch (err: any) {
      console.error("[Analytics] Error fetching FPO insights:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
