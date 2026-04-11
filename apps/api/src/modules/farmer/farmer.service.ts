import { PrismaClient } from '@prisma/client';
import cloudinary from '../../config/cloudinary';

const prisma = new PrismaClient();

export class FarmerService {
  // 1. KYC Registration
  async updateKYC(farmerId: string, kycData: any) {
    const user = await prisma.user.update({
      where: { id: farmerId },
      data: {
        aadhaar: kycData.aadhaar,
        bankAccount: kycData.bankAccount,
        ifsc: kycData.ifsc,
        bankName: kycData.bankName,
        kycVerified: true
      }
    });

    // Update or create farm details
    await prisma.farm.upsert({
      where: { farmerId },
      create: {
        farmerId,
        location: kycData.location,
        district: kycData.district,
        state: kycData.state,
        areaAcres: parseFloat(kycData.areaAcres),
        photos: kycData.photos || [],
        soilType: kycData.soilType,
        irrigationType: kycData.irrigationType
      },
      update: {
        location: kycData.location,
        district: kycData.district,
        state: kycData.state,
        areaAcres: parseFloat(kycData.areaAcres),
        photos: kycData.photos || [],
        soilType: kycData.soilType,
        irrigationType: kycData.irrigationType
      }
    });

    return user;
  }

  async getKYCStatus(farmerId: string) {
    const user = await prisma.user.findUnique({
      where: { id: farmerId },
      include: { farm: true }
    });
    return {
      kycVerified: user?.kycVerified || false,
      hasAadhaar: !!user?.aadhaar,
      hasBankDetails: !!(user?.bankAccount && user?.ifsc),
      hasFarmDetails: !!user?.farm
    };
  }

  // 2. Crop Listing
  async createCropListing(farmerId: string, cropData: any) {
    return await prisma.crop.create({
      data: {
        farmerId,
        cropName: cropData.cropName,
        category: cropData.category,
        variety: cropData.variety,
        quantity: parseFloat(cropData.quantity),
        pricePerKg: parseFloat(cropData.pricePerKg),
        grade: cropData.grade,
        qualityCertUrl: cropData.qualityCertUrl,
        status: 'LISTED'
      }
    });
  }

  async getFarmerCrops(farmerId: string, filters: any = {}) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { farmerId };
    if (status) where.status = status;

    const [crops, total] = await Promise.all([
      prisma.crop.findMany({
        where,
        include: {
          orders: { select: { status: true, totalAmount: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.crop.count({ where })
    ]);

    return {
      crops,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateCrop(cropId: string, farmerId: string, updateData: any) {
    const crop = await prisma.crop.findFirst({
      where: { id: cropId, farmerId }
    });
    if (!crop) throw new Error('Crop not found');

    return await prisma.crop.update({
      where: { id: cropId },
      data: updateData
    });
  }

  async deleteCrop(cropId: string, farmerId: string) {
    const crop = await prisma.crop.findFirst({
      where: { id: cropId, farmerId, status: 'LISTED' }
    });
    if (!crop) throw new Error('Crop not found or cannot be deleted');

    return await prisma.crop.delete({
      where: { id: cropId }
    });
  }

  // 3. AI Quality Certificate (Mock - integrate with actual AI service)
  async analyzeQuality(imageUrl: string) {
    // TODO: Integrate with actual AI service
    // For now, return mock analysis
    const grades = ['A', 'B', 'C'];
    const randomGrade = grades[Math.floor(Math.random() * grades.length)];
    
    return {
      grade: randomGrade,
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      defects: randomGrade === 'A' ? [] : ['Minor discoloration', 'Size variation'],
      recommendations: [
        'Store in cool, dry place',
        'Handle with care to avoid bruising'
      ]
    };
  }

  // 4. FPO Linking
  async linkToFPO(farmerId: string, fpoId: string) {
    // Check if FPO exists
    const fpo = await prisma.fPO.findUnique({ where: { id: fpoId } });
    if (!fpo) throw new Error('FPO not found');

    const user = await prisma.user.findUnique({
      where: { id: farmerId },
      include: { farm: true }
    });
    if (!user) throw new Error('Farmer not found');

    // Create FPOFarmer entry
    return await prisma.fPOFarmer.create({
      data: {
        fpoId,
        name: user.name,
        phone: user.phone,
        aadhaar: user.aadhaar || '',
        bankAccount: user.bankAccount,
        ifsc: user.ifsc,
        district: user.farm?.district,
        photos: user.farm?.photos || []
      }
    });
  }

  async getLinkedFPOs(farmerId: string) {
    const user = await prisma.user.findUnique({
      where: { id: farmerId }
    });
    if (!user) throw new Error('Farmer not found');

    return await prisma.fPOFarmer.findMany({
      where: { phone: user.phone },
      include: {
        fpo: {
          select: {
            id: true,
            name: true,
            registrationNo: true,
            district: true,
            state: true
          }
        }
      }
    });
  }

  async sendCropToFPO(cropId: string, farmerId: string, fpoFarmerId: string) {
    const crop = await prisma.crop.findFirst({
      where: { id: cropId, farmerId }
    });
    if (!crop) throw new Error('Crop not found');

    const fpoFarmer = await prisma.fPOFarmer.findUnique({
      where: { id: fpoFarmerId }
    });
    if (!fpoFarmer) throw new Error('FPO link not found');

    return await prisma.crop.update({
      where: { id: cropId },
      data: {
        fpoFarmerId: fpoFarmerId,
        fpoId: fpoFarmer.fpoId
      }
    });
  }

  // 5. Market Prices
  async getMarketPrices(filters: any = {}) {
    const { cropName, district, limit = 10 } = filters;
    
    const where: any = {};
    if (cropName) where.cropName = { contains: cropName, mode: 'insensitive' };
    if (district) where.district = district;

    return await prisma.marketPrice.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: limit
    });
  }

  async getHistoricalPrices(cropName: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await prisma.marketPrice.findMany({
      where: {
        cropName: { contains: cropName, mode: 'insensitive' },
        recordedAt: { gte: startDate }
      },
      orderBy: { recordedAt: 'asc' }
    });
  }

  // 6. Orders Dashboard
  async getFarmerOrders(farmerId: string, filters: any = {}) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      crop: { farmerId }
    };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          buyer: { select: { id: true, name: true, phone: true } },
          crop: { select: { cropName: true, quantity: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getOrderStats(farmerId: string) {
    const [totalOrders, pendingOrders, deliveredOrders, totalRevenue] = await Promise.all([
      prisma.order.count({
        where: { crop: { farmerId } }
      }),
      prisma.order.count({
        where: { crop: { farmerId }, status: { in: ['PENDING', 'CONFIRMED'] } }
      }),
      prisma.order.count({
        where: { crop: { farmerId }, status: 'DELIVERED' }
      }),
      prisma.order.aggregate({
        where: { crop: { farmerId }, status: 'DELIVERED' },
        _sum: { totalAmount: true }
      })
    ]);

    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0
    };
  }

  // 7. Escrow Wallet
  async getWallet(farmerId: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { userId: farmerId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: farmerId,
          balance: 0
        },
        include: {
          transactions: true
        }
      });
    }

    // Calculate held amount from escrow
    const heldAmount = await prisma.escrowTransaction.aggregate({
      where: {
        sellerId: farmerId,
        status: 'HELD'
      },
      _sum: { amount: true }
    });

    // Calculate released amount
    const releasedAmount = await prisma.escrowTransaction.aggregate({
      where: {
        sellerId: farmerId,
        status: 'RELEASED'
      },
      _sum: { amount: true }
    });

    return {
      wallet,
      heldAmount: heldAmount._sum.amount || 0,
      releasedAmount: releasedAmount._sum.amount || 0,
      availableBalance: wallet.balance
    };
  }

  // 8. Earnings Dashboard
  async getEarnings(farmerId: string, filters: any = {}) {
    const { page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const [earnings, total, stats] = await Promise.all([
      prisma.farmerEarning.findMany({
        where: { farmerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.farmerEarning.count({ where: { farmerId } }),
      prisma.farmerEarning.aggregate({
        where: { farmerId },
        _sum: { amount: true, platformFee: true }
      })
    ]);

    return {
      earnings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalEarnings: stats._sum.amount || 0,
        totalFees: stats._sum.platformFee || 0,
        netEarnings: (stats._sum.amount || 0) - (stats._sum.platformFee || 0)
      }
    };
  }

  // 9. Logistics Request
  async requestPickup(farmerId: string, requestData: any) {
    // Create a logistics request (simplified - would integrate with actual logistics service)
    const crop = await prisma.crop.findFirst({
      where: { id: requestData.cropId, farmerId }
    });
    if (!crop) throw new Error('Crop not found');

    // For now, just update crop status or create a note
    // In production, this would create a pickup request in a logistics system
    return {
      success: true,
      message: 'Pickup request submitted successfully',
      estimatedPickup: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      cropId: requestData.cropId,
      address: requestData.address,
      contactPhone: requestData.contactPhone
    };
  }

  // Dashboard Overview
  async getDashboard(farmerId: string) {
    const [user, farm, cropStats, orderStats, wallet] = await Promise.all([
      prisma.user.findUnique({
        where: { id: farmerId },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          kycVerified: true,
          language: true
        }
      }),
      prisma.farm.findUnique({
        where: { farmerId }
      }),
      prisma.crop.groupBy({
        by: ['status'],
        where: { farmerId },
        _count: true
      }),
      this.getOrderStats(farmerId),
      this.getWallet(farmerId)
    ]);

    const activeCrops = cropStats.find(s => s.status === 'LISTED')?._count || 0;
    const soldCrops = cropStats.find(s => s.status === 'SOLD')?._count || 0;

    return {
      user,
      farm,
      stats: {
        activeCrops,
        soldCrops,
        totalOrders: orderStats.totalOrders,
        pendingOrders: orderStats.pendingOrders,
        totalRevenue: orderStats.totalRevenue,
        walletBalance: wallet.availableBalance,
        heldAmount: wallet.heldAmount
      }
    };
  }
}
