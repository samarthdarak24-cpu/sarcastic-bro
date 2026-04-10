import prisma from '../../prisma/client';

export class BulkListingService {
  /**
   * Publish aggregated lot to marketplace
   */
  async publishLot(fpoUserId: string, lotId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const lot = await prisma.aggregatedLot.findFirst({
      where: {
        id: lotId,
        fpoId: fpo.id
      },
      include: {
        crops: true
      }
    });

    if (!lot) {
      throw new Error('Aggregated lot not found');
    }

    if (lot.crops.length === 0) {
      throw new Error('Cannot publish empty lot');
    }

    // Update lot status to LISTED
    const updated = await prisma.aggregatedLot.update({
      where: { id: lotId },
      data: { status: 'LISTED' }
    });

    return {
      lot: updated,
      message: 'Lot published successfully to marketplace'
    };
  }

  /**
   * Unpublish lot from marketplace
   */
  async unpublishLot(fpoUserId: string, lotId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const lot = await prisma.aggregatedLot.findFirst({
      where: {
        id: lotId,
        fpoId: fpo.id,
        status: 'LISTED'
      }
    });

    if (!lot) {
      throw new Error('Lot not found or not published');
    }

    // Check if there are pending orders
    const pendingOrders = await prisma.order.count({
      where: {
        lotId: lotId,
        status: { in: ['PENDING', 'CONFIRMED', 'IN_TRANSIT'] }
      }
    });

    if (pendingOrders > 0) {
      throw new Error('Cannot unpublish lot with pending orders');
    }

    await prisma.aggregatedLot.update({
      where: { id: lotId },
      data: { status: 'PENDING' }
    });
  }

  /**
   * Get all published lots
   */
  async getPublishedLots(fpoUserId: string) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const lots = await prisma.aggregatedLot.findMany({
      where: {
        fpoId: fpo.id,
        status: 'LISTED'
      },
      include: {
        crops: {
          include: {
            fpoFarmer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return lots;
  }

  /**
   * Update lot price
   */
  async updateLotPrice(fpoUserId: string, lotId: string, pricePerKg: number) {
    const fpo = await prisma.fPO.findUnique({
      where: { adminUserId: fpoUserId }
    });

    if (!fpo) {
      throw new Error('FPO not found');
    }

    const lot = await prisma.aggregatedLot.findFirst({
      where: {
        id: lotId,
        fpoId: fpo.id
      }
    });

    if (!lot) {
      throw new Error('Lot not found');
    }

    const updated = await prisma.aggregatedLot.update({
      where: { id: lotId },
      data: { pricePerKg }
    });

    return updated;
  }
}
