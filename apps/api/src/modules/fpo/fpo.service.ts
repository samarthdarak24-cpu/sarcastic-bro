import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FPOService {
  // 1. FPO Dashboard - Get overview stats
  async getDashboard(fpoId: string) {
    const [fpo, farmersCount, activeListings, totalRevenue, pendingOrders] = await Promise.all([
      prisma.fPO.findUnique({
        where: { id: fpoId },
        include: { admin: { select: { name: true, email: true } } }
      }),
      prisma.fPOFarmer.count({ where: { fpoId, isActive: true } }),
      prisma.aggregatedLot.count({ where: { fpoId, status: 'LISTED' } }),
      prisma.order.aggregate({
        where: { lot: { fpoId }, status: 'DELIVERED' },
        _sum: { totalAmount: true }
      }),
      prisma.order.count({
        where: { lot: { fpoId }, status: { in: ['PENDING', 'CONFIRMED'] } }
      })
    ]);

    return {
      fpo,
      stats: {
        totalFarmers: farmersCount,
        activeListings,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingOrders
      }
    };
  }

  // 2. Farmer Onboarding - Add farmer manually
  async onboardFarmer(fpoId: string, farmerData: any) {
    return await prisma.fPOFarmer.create({
      data: {
        fpoId,
        name: farmerData.name,
        phone: farmerData.phone,
        aadhaar: farmerData.aadhaar,
        bankAccount: farmerData.bankAccount,
        ifsc: farmerData.ifsc,
        district: farmerData.district,
        photos: farmerData.photos || []
      }
    });
  }

  // 3. Farmer Management - Get all farmers
  async getFarmers(fpoId: string, filters: any = {}) {
    const { search, isActive, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { fpoId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ];
    }
    if (isActive !== undefined) where.isActive = isActive;

    const [farmers, total] = await Promise.all([
      prisma.fPOFarmer.findMany({
        where,
        include: {
          _count: { select: { crops: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.fPOFarmer.count({ where })
    ]);

    return {
      farmers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get single farmer details
  async getFarmerById(farmerId: string, fpoId: string) {
    const farmer = await prisma.fPOFarmer.findFirst({
      where: { id: farmerId, fpoId },
      include: {
        crops: {
          include: {
            orders: { select: { status: true, totalAmount: true } }
          }
        },
        _count: { select: { crops: true } }
      }
    });

    if (!farmer) throw new Error('Farmer not found');
    return farmer;
  }

  // 4. Delegated Listing - Add product on behalf of farmer
  async addProductForFarmer(fpoId: string, farmerId: string, productData: any) {
    // Verify farmer belongs to FPO
    const farmer = await prisma.fPOFarmer.findFirst({
      where: { id: farmerId, fpoId }
    });
    if (!farmer) throw new Error('Farmer not found in this FPO');

    return await prisma.crop.create({
      data: {
        fpoFarmerId: farmerId,
        fpoId,
        cropName: productData.cropName,
        category: productData.category,
        variety: productData.variety,
        quantity: parseFloat(productData.quantity),
        pricePerKg: parseFloat(productData.pricePerKg),
        grade: productData.grade,
        qualityCertUrl: productData.qualityCertUrl,
        status: 'LISTED'
      }
    });
  }

  // 5. Aggregation Engine - Combine similar crops
  async aggregateCrops(fpoId: string, aggregationData: any) {
    const { cropName, variety, grade, cropIds } = aggregationData;

    // Get crops to aggregate
    const crops = await prisma.crop.findMany({
      where: {
        id: { in: cropIds },
        fpoId,
        isAggregated: false,
        status: 'LISTED'
      }
    });

    if (crops.length === 0) throw new Error('No valid crops found for aggregation');

    // Calculate totals
    const totalQuantity = crops.reduce((sum, c) => sum + c.quantity, 0);
    const weightedPrice = crops.reduce((sum, c) => sum + (c.pricePerKg * c.quantity), 0) / totalQuantity;

    // Create aggregated lot
    const lot = await prisma.aggregatedLot.create({
      data: {
        fpoId,
        cropName,
        totalQuantity,
        pricePerKg: weightedPrice,
        qualityCertUrl: crops[0].qualityCertUrl,
        status: 'LISTED'
      }
    });

    // Update crops to mark as aggregated
    await prisma.crop.updateMany({
      where: { id: { in: cropIds } },
      data: {
        isAggregated: true,
        aggregatedLotId: lot.id
      }
    });

    return lot;
  }

  // Get aggregatable crops (same type, grade, location)
  async getAggregatableCrops(fpoId: string) {
    const crops = await prisma.crop.findMany({
      where: {
        fpoId,
        isAggregated: false,
        status: 'LISTED'
      },
      include: {
        fpoFarmer: { select: { name: true, district: true } }
      },
      orderBy: [{ cropName: 'asc' }, { grade: 'asc' }]
    });

    // Group by cropName + grade + district
    const grouped: any = {};
    crops.forEach(crop => {
      const key = `${crop.cropName}_${crop.grade}_${crop.fpoFarmer?.district}`;
      if (!grouped[key]) {
        grouped[key] = {
          cropName: crop.cropName,
          grade: crop.grade,
          district: crop.fpoFarmer?.district,
          crops: []
        };
      }
      grouped[key].crops.push(crop);
    });

    // Filter groups with 2+ crops
    return Object.values(grouped).filter((g: any) => g.crops.length >= 2);
  }

  // 6. Quality Verification - Approve or update certificates
  async verifyQuality(fpoId: string, cropId: string, verificationData: any) {
    const crop = await prisma.crop.findFirst({
      where: { id: cropId, fpoId }
    });
    if (!crop) throw new Error('Crop not found');

    return await prisma.crop.update({
      where: { id: cropId },
      data: {
        qualityCertUrl: verificationData.qualityCertUrl,
        grade: verificationData.grade || crop.grade
      }
    });
  }

  // 7. Bulk Listing - Get all aggregated lots
  async getAggregatedLots(fpoId: string, filters: any = {}) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { fpoId };
    if (status) where.status = status;

    const [lots, total] = await Promise.all([
      prisma.aggregatedLot.findMany({
        where,
        include: {
          crops: {
            include: {
              fpoFarmer: { select: { name: true } }
            }
          },
          _count: { select: { orders: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.aggregatedLot.count({ where })
    ]);

    return {
      lots,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 8. Buyer Chat - Get chats and messages
  async getChats(fpoId: string) {
    return await prisma.fPOChat.findMany({
      where: { fpoId },
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });
  }

  async getChatMessages(chatId: string, fpoId: string) {
    const chat = await prisma.fPOChat.findFirst({
      where: { id: chatId, fpoId }
    });
    if (!chat) throw new Error('Chat not found');

    return await prisma.fPOChatMessage.findMany({
      where: { chatId },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async sendMessage(chatId: string, senderId: string, content: string, attachments: string[] = []) {
    const message = await prisma.fPOChatMessage.create({
      data: {
        chatId,
        senderId,
        content,
        attachments
      },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    });

    // Update chat last message
    await prisma.fPOChat.update({
      where: { id: chatId },
      data: {
        lastMessage: content,
        lastMessageAt: new Date()
      }
    });

    return message;
  }

  // 9. Escrow Payout - Split payment based on contribution
  async processEscrowPayout(orderId: string, fpoId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, lot: { fpoId } },
      include: {
        lot: {
          include: {
            crops: {
              include: { fpoFarmer: true }
            }
          }
        }
      }
    });

    if (!order || !order.lot) throw new Error('Order not found');
    if (order.escrowStatus !== 'HELD') throw new Error('Escrow not held');

    const fpo = await prisma.fPO.findUnique({ where: { id: fpoId } });
    if (!fpo) throw new Error('FPO not found');

    const totalQuantity = order.lot.totalQuantity;
    const payoutSplits = [];

    // Calculate each farmer's share
    for (const crop of order.lot.crops) {
      const contribution = crop.quantity / totalQuantity;
      const farmerShare = order.totalAmount * contribution * (1 - fpo.commissionRate / 100);
      const fpoCommission = order.totalAmount * contribution * (fpo.commissionRate / 100);

      payoutSplits.push({
        orderId,
        fpoId,
        fpoFarmerId: crop.fpoFarmerId!,
        cropId: crop.id,
        farmerShare,
        fpoCommission,
        totalAmount: order.totalAmount * contribution,
        status: 'PAID',
        paidAt: new Date()
      });
    }

    // Create payout splits
    await prisma.fPOPayoutSplit.createMany({ data: payoutSplits });

    // Release escrow
    await prisma.order.update({
      where: { id: orderId },
      data: { escrowStatus: 'RELEASED' }
    });

    return payoutSplits;
  }

  // Get payout history
  async getPayouts(fpoId: string, filters: any = {}) {
    const { farmerId, status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { fpoId };
    if (farmerId) where.fpoFarmerId = farmerId;
    if (status) where.status = status;

    const [payouts, total] = await Promise.all([
      prisma.fPOPayoutSplit.findMany({
        where,
        include: {
          fpoFarmer: { select: { name: true, phone: true } },
          order: { select: { id: true, status: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.fPOPayoutSplit.count({ where })
    ]);

    return {
      payouts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 10. Logistics - Manage delivery
  async createLogistics(orderId: string, fpoId: string, logisticsData: any) {
    return await prisma.fPOLogistics.create({
      data: {
        orderId,
        fpoId,
        trackingNumber: logisticsData.trackingNumber,
        carrier: logisticsData.carrier,
        status: 'PICKED_UP',
        estimatedDelivery: logisticsData.estimatedDelivery ? new Date(logisticsData.estimatedDelivery) : null,
        notes: logisticsData.notes
      }
    });
  }

  async updateLogistics(logisticsId: string, fpoId: string, updateData: any) {
    const logistics = await prisma.fPOLogistics.findFirst({
      where: { id: logisticsId, fpoId }
    });
    if (!logistics) throw new Error('Logistics not found');

    // Create event
    if (updateData.status) {
      await prisma.logisticsEvent.create({
        data: {
          logisticsId,
          status: updateData.status,
          location: updateData.location,
          description: updateData.description
        }
      });
    }

    return await prisma.fPOLogistics.update({
      where: { id: logisticsId },
      data: {
        status: updateData.status,
        currentLocation: updateData.location,
        actualDelivery: updateData.status === 'DELIVERED' ? new Date() : undefined,
        notes: updateData.notes
      }
    });
  }

  async getLogistics(fpoId: string, filters: any = {}) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { fpoId };
    if (status) where.status = status;

    const [logistics, total] = await Promise.all([
      prisma.fPOLogistics.findMany({
        where,
        include: {
          order: {
            include: {
              buyer: { select: { name: true, phone: true } },
              lot: { select: { cropName: true, totalQuantity: true } }
            }
          },
          events: { orderBy: { timestamp: 'desc' } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.fPOLogistics.count({ where })
    ]);

    return {
      logistics,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getLogisticsById(logisticsId: string, fpoId: string) {
    const logistics = await prisma.fPOLogistics.findFirst({
      where: { id: logisticsId, fpoId },
      include: {
        order: {
          include: {
            buyer: { select: { name: true, phone: true, email: true } },
            lot: { select: { cropName: true, totalQuantity: true } }
          }
        },
        events: { orderBy: { timestamp: 'asc' } }
      }
    });

    if (!logistics) throw new Error('Logistics not found');
    return logistics;
  }
}
