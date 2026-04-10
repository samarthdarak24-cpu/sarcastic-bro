import prisma from '../../prisma/client';

export class EscrowService {
  /**
   * Get pending escrow transactions for FPO
   */
  async getPendingTransactions(fpoUserId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const lots = await prisma.aggregatedLot.findMany({
      where: { fpoId: fpo.id },
      select: { id: true }
    });

    const lotIds = lots.map(l => l.id);

    const transactions = await prisma.escrowTransaction.findMany({
      where: {
        status: 'HELD',
        order: {
          lotId: { in: lotIds },
          status: 'DELIVERED'
        }
      },
      include: {
        order: {
          include: {
            lot: true,
            buyer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { heldAt: 'desc' }
    });

    return transactions;
  }

  /**
   * Release escrow payment and split among farmers
   */
  async releasePayment(fpoUserId: string, orderId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    // Get order with lot and crops
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        lot: {
          include: {
            crops: {
              include: {
                fpoFarmer: true
              }
            }
          }
        }
      }
    });

    if (!order || !order.lot) {
      throw new Error('Order or lot not found');
    }

    if (order.lot.fpoId !== fpo.id) {
      throw new Error('Unauthorized: Order does not belong to this FPO');
    }

    if (order.status !== 'DELIVERED') {
      throw new Error('Order must be delivered before releasing payment');
    }

    // Get escrow transaction
    const escrow = await prisma.escrowTransaction.findUnique({
      where: { orderId }
    });

    if (!escrow || escrow.status !== 'HELD') {
      throw new Error('Escrow transaction not found or already released');
    }

    // Calculate farmer contributions
    const totalQuantity = order.lot.totalQuantity;
    const farmerPayments: any[] = [];

    const farmerContributions = order.lot.crops.reduce((acc: any, crop) => {
      const farmerId = crop.fpoFarmerId;
      if (!farmerId) return acc;

      if (!acc[farmerId]) {
        acc[farmerId] = {
          farmer: crop.fpoFarmer,
          quantity: 0,
          percentage: 0
        };
      }

      acc[farmerId].quantity += crop.quantity;
      return acc;
    }, {});

    // Calculate payment split
    const platformFeeRate = 0.02; // 2% platform fee
    const totalAmount = order.totalAmount;
    const platformFee = totalAmount * platformFeeRate;
    const netAmount = totalAmount - platformFee;

    Object.keys(farmerContributions).forEach(farmerId => {
      const contribution = farmerContributions[farmerId];
      contribution.percentage = (contribution.quantity / totalQuantity) * 100;
      const farmerAmount = (netAmount * contribution.percentage) / 100;

      farmerPayments.push({
        farmerId,
        farmerName: contribution.farmer.name,
        quantity: contribution.quantity,
        percentage: contribution.percentage,
        amount: farmerAmount,
        platformFee: (platformFee * contribution.percentage) / 100
      });
    });

    // Create farmer earnings records
    await Promise.all(
      farmerPayments.map(payment =>
        prisma.farmerEarning.create({
          data: {
            farmerId: payment.farmerId,
            orderId: order.id,
            amount: payment.amount,
            platformFee: payment.platformFee,
            status: 'COMPLETED',
            paidAt: new Date()
          }
        })
      )
    );

    // Update escrow status
    await prisma.escrowTransaction.update({
      where: { id: escrow.id },
      data: {
        status: 'RELEASED',
        releasedAt: new Date()
      }
    });

    // Update order escrow status
    await prisma.order.update({
      where: { id: orderId },
      data: { escrowStatus: 'RELEASED' }
    });

    return {
      orderId,
      totalAmount,
      platformFee,
      netAmount,
      farmerPayments
    };
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(fpoUserId: string, page: number = 1, limit: number = 20) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const lots = await prisma.aggregatedLot.findMany({
      where: { fpoId: fpo.id },
      select: { id: true }
    });

    const lotIds = lots.map(l => l.id);

    const [transactions, total] = await Promise.all([
      prisma.escrowTransaction.findMany({
        where: {
          order: {
            lotId: { in: lotIds }
          }
        },
        include: {
          order: {
            include: {
              lot: true,
              buyer: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { heldAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.escrowTransaction.count({
        where: {
          order: {
            lotId: { in: lotIds }
          }
        }
      })
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get payment split details for an order
   */
  async getPaymentSplit(fpoUserId: string, orderId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        lot: {
          include: {
            crops: {
              include: {
                fpoFarmer: true
              }
            }
          }
        }
      }
    });

    if (!order || !order.lot || order.lot.fpoId !== fpo.id) {
      throw new Error('Order not found or unauthorized');
    }

    const totalQuantity = order.lot.totalQuantity;
    const farmerContributions = order.lot.crops.reduce((acc: any, crop) => {
      const farmerId = crop.fpoFarmerId;
      if (!farmerId) return acc;

      if (!acc[farmerId]) {
        acc[farmerId] = {
          farmer: crop.fpoFarmer,
          quantity: 0,
          percentage: 0,
          estimatedAmount: 0
        };
      }

      acc[farmerId].quantity += crop.quantity;
      return acc;
    }, {});

    const platformFeeRate = 0.02;
    const netAmount = order.totalAmount * (1 - platformFeeRate);

    Object.keys(farmerContributions).forEach(farmerId => {
      const contribution = farmerContributions[farmerId];
      contribution.percentage = (contribution.quantity / totalQuantity) * 100;
      contribution.estimatedAmount = (netAmount * contribution.percentage) / 100;
    });

    return {
      orderId,
      totalAmount: order.totalAmount,
      platformFee: order.totalAmount * platformFeeRate,
      netAmount,
      farmerContributions: Object.values(farmerContributions)
    };
  }
}
