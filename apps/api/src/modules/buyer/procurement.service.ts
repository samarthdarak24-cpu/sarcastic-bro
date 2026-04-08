import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export class ProcurementService {
  async getRecommendations(buyerId: string, params: {
    category?: string;
    quantity?: number;
    budget?: number;
    district?: string;
  }) {
    // Get buyer's purchase history
    const history = await prisma.order.findMany({
      where: { buyerId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // Get available products matching criteria
    const where: any = { isActive: true };
    if (params.category) where.category = params.category;
    if (params.district) where.district = params.district;

    const products = await prisma.product.findMany({
      where,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            ratingAvg: true,
            totalOrders: true,
            district: true,
            state: true
          }
        }
      },
      take: 50
    });

    // Call AI service for recommendations
    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/recommendations/procurement`, {
        buyerId,
        history: history.map(h => ({
          category: h.product.category,
          price: h.totalPrice,
          quantity: h.quantity
        })),
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          quantity: p.quantity,
          qualityScore: p.qualityScore,
          farmerRating: p.farmer.ratingAvg,
          district: p.district
        })),
        criteria: params
      }, { timeout: 5000 });

      return aiResponse.data;
    } catch (error) {
      // Fallback to simple recommendation
      return {
        recommendations: products.slice(0, 10).map(p => ({
          product: p,
          score: p.farmer.ratingAvg * 20,
          confidence: 0.75,
          reasons: ['High farmer rating', 'Available quantity', 'Competitive price']
        }))
      };
    }
  }

  async getProcurementHistory(buyerId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { buyerId },
        include: {
          product: true,
          farmer: {
            select: {
              id: true,
              name: true,
              district: true,
              state: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where: { buyerId } })
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
