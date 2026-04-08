import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { redis } from '../../services/redis.service';
import { getSocketService } from '../../services/socketService';

const prisma = new PrismaClient();

interface EscrowCreationData {
  orderId: string;
  amount: number;
  buyerId: string;
  sellerId: string;
}

export class EscrowService {
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  async createSmartEscrow(data: EscrowCreationData) {
    // Create escrow order
    const escrow = await prisma.escrowOrder.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
        buyerId: data.buyerId,
        farmerId: data.sellerId,
        status: 'HELD',
        escrowAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
        depositTxHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        buyerConfirmed: false,
        farmerDelivered: false,
      },
    });

    // Invalidate cache
    await redis.delPattern(`escrow:user:${data.buyerId}:*`);
    await redis.delPattern(`escrow:user:${data.sellerId}:*`);
    await redis.del(`escrow:analytics:${data.buyerId}`);
    await redis.del(`escrow:analytics:${data.sellerId}`);

    // Emit real-time event to both parties
    try {
      const socketService = getSocketService();
      socketService.emitEscrowUpdate(data.buyerId, {
        escrowId: escrow.id,
        orderId: escrow.orderId,
        status: 'held',
        amount: escrow.amount,
      });
      socketService.emitEscrowUpdate(data.sellerId, {
        escrowId: escrow.id,
        orderId: escrow.orderId,
        status: 'held',
        amount: escrow.amount,
      });
    } catch (error) {
      console.error('[Escrow] Socket.IO not available:', error);
    }

    return {
      escrow,
      message: 'Escrow created successfully. Funds are held securely.',
    };
  }

  async getEscrowAnalytics(userId: string, role: string) {
    const cacheKey = `escrow:analytics:${userId}`;
    
    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[Escrow] Cache hit for analytics:${userId}`);
      return cached;
    }

    const escrows = await prisma.escrowOrder.findMany({
      where: role === 'BUYER' ? { buyerId: userId } : { farmerId: userId },
      include: {
        order: true,
      },
    });

    const totalAmount = escrows.reduce((sum: number, e: any) => sum + e.amount, 0);
    const activeCount = escrows.filter((e: any) => e.status === 'HELD').length;
    const completedCount = escrows.filter((e: any) => e.status === 'RELEASED').length;
    const disputedCount = escrows.filter((e: any) => e.status === 'DISPUTED').length;

    const result = {
      totalEscrows: escrows.length,
      totalAmount,
      activeCount,
      completedCount,
      disputedCount,
      escrows: escrows.map((e: any) => ({
        id: e.id,
        orderId: e.orderId,
        amount: e.amount,
        status: e.status,
        buyerConfirmed: e.buyerConfirmed,
        farmerDelivered: e.farmerDelivered,
        createdAt: e.createdAt,
      })),
    };

    // Cache for 5 minutes
    await redis.set(cacheKey, result, 300);
    
    return result;
  }

  async releaseFunds(escrowId: string, userId: string) {
    const escrow = await prisma.escrowOrder.findUnique({ where: { id: escrowId } });
    if (!escrow) throw new Error('Escrow not found');

    // Verify user is authorized (buyer or farmer)
    if (escrow.buyerId !== userId && escrow.farmerId !== userId) {
      throw new Error('Unauthorized to release funds');
    }

    // Check if both parties have confirmed
    if (!escrow.buyerConfirmed || !escrow.farmerDelivered) {
      throw new Error('Both parties must confirm before release');
    }

    const updatedEscrow = await prisma.escrowOrder.update({
      where: { id: escrowId },
      data: {
        status: 'RELEASED',
        releaseTxHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        releasedAt: new Date(),
      },
    });

    // Invalidate cache
    await redis.delPattern(`escrow:user:${escrow.buyerId}:*`);
    await redis.delPattern(`escrow:user:${escrow.farmerId}:*`);
    await redis.del(`escrow:analytics:${escrow.buyerId}`);
    await redis.del(`escrow:analytics:${escrow.farmerId}`);

    // Emit real-time event to both parties
    try {
      const socketService = getSocketService();
      socketService.emitEscrowUpdate(escrow.buyerId, {
        escrowId: updatedEscrow.id,
        orderId: updatedEscrow.orderId,
        status: 'released',
        amount: updatedEscrow.amount,
      });
      socketService.emitEscrowUpdate(escrow.farmerId, {
        escrowId: updatedEscrow.id,
        orderId: updatedEscrow.orderId,
        status: 'released',
        amount: updatedEscrow.amount,
      });
    } catch (error) {
      console.error('[Escrow] Socket.IO not available:', error);
    }

    return { success: true, escrow: updatedEscrow };
  }

  async confirmDelivery(escrowId: string, userId: string, role: 'buyer' | 'farmer') {
    const escrow = await prisma.escrowOrder.findUnique({ where: { id: escrowId } });
    if (!escrow) throw new Error('Escrow not found');

    // Verify user is authorized
    if (role === 'buyer' && escrow.buyerId !== userId) {
      throw new Error('Unauthorized');
    }
    if (role === 'farmer' && escrow.farmerId !== userId) {
      throw new Error('Unauthorized');
    }

    const updateData: any = {};
    if (role === 'buyer') {
      updateData.buyerConfirmed = true;
    } else {
      updateData.farmerDelivered = true;
    }

    const updatedEscrow = await prisma.escrowOrder.update({
      where: { id: escrowId },
      data: updateData,
    });

    // Invalidate cache
    await redis.delPattern(`escrow:user:${escrow.buyerId}:*`);
    await redis.delPattern(`escrow:user:${escrow.farmerId}:*`);
    await redis.del(`escrow:analytics:${escrow.buyerId}`);
    await redis.del(`escrow:analytics:${escrow.farmerId}`);

    // Emit real-time event
    try {
      const socketService = getSocketService();
      const otherUserId = role === 'buyer' ? escrow.farmerId : escrow.buyerId;
      socketService.emitEscrowUpdate(otherUserId, {
        escrowId: updatedEscrow.id,
        orderId: updatedEscrow.orderId,
        status: 'confirmation_received',
        amount: updatedEscrow.amount,
      });
    } catch (error) {
      console.error('[Escrow] Socket.IO not available:', error);
    }

    return { success: true, escrow: updatedEscrow };
  }

  async raiseDispute(escrowId: string, userId: string, reason: string) {
    const escrow = await prisma.escrowOrder.findUnique({ where: { id: escrowId } });
    if (!escrow) throw new Error('Escrow not found');

    // Verify user is authorized
    if (escrow.buyerId !== userId && escrow.farmerId !== userId) {
      throw new Error('Unauthorized to raise dispute');
    }

    const updatedEscrow = await prisma.escrowOrder.update({
      where: { id: escrowId },
      data: {
        status: 'DISPUTED',
        disputeReason: reason,
      },
    });

    // Invalidate cache
    await redis.delPattern(`escrow:user:${escrow.buyerId}:*`);
    await redis.delPattern(`escrow:user:${escrow.farmerId}:*`);
    await redis.del(`escrow:analytics:${escrow.buyerId}`);
    await redis.del(`escrow:analytics:${escrow.farmerId}`);

    // Emit real-time event to both parties
    try {
      const socketService = getSocketService();
      socketService.emitEscrowUpdate(escrow.buyerId, {
        escrowId: updatedEscrow.id,
        orderId: updatedEscrow.orderId,
        status: 'disputed',
        amount: updatedEscrow.amount,
      });
      socketService.emitEscrowUpdate(escrow.farmerId, {
        escrowId: updatedEscrow.id,
        orderId: updatedEscrow.orderId,
        status: 'disputed',
        amount: updatedEscrow.amount,
      });
    } catch (error) {
      console.error('[Escrow] Socket.IO not available:', error);
    }

    return { success: true, dispute: updatedEscrow };
  }

  async refundEscrow(escrowId: string, adminUserId: string, reason: string) {
    const escrow = await prisma.escrowOrder.findUnique({ where: { id: escrowId } });
    if (!escrow) throw new Error('Escrow not found');

    const updatedEscrow = await prisma.escrowOrder.update({
      where: { id: escrowId },
      data: {
        status: 'REFUNDED',
        disputeReason: reason,
        releaseTxHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        releasedAt: new Date(),
      },
    });

    // Invalidate cache
    await redis.delPattern(`escrow:user:${escrow.buyerId}:*`);
    await redis.delPattern(`escrow:user:${escrow.farmerId}:*`);
    await redis.del(`escrow:analytics:${escrow.buyerId}`);
    await redis.del(`escrow:analytics:${escrow.farmerId}`);

    // Emit real-time event to both parties
    try {
      const socketService = getSocketService();
      socketService.emitEscrowUpdate(escrow.buyerId, {
        escrowId: updatedEscrow.id,
        orderId: updatedEscrow.orderId,
        status: 'refunded',
        amount: updatedEscrow.amount,
      });
      socketService.emitEscrowUpdate(escrow.farmerId, {
        escrowId: updatedEscrow.id,
        orderId: updatedEscrow.orderId,
        status: 'refunded',
        amount: updatedEscrow.amount,
      });
    } catch (error) {
      console.error('[Escrow] Socket.IO not available:', error);
    }

    return { success: true, refund: updatedEscrow };
  }

  async getEscrowById(escrowId: string, userId: string) {
    const cacheKey = `escrow:${escrowId}`;
    
    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[Escrow] Cache hit for escrow:${escrowId}`);
      return cached;
    }

    const escrow = await prisma.escrowOrder.findUnique({
      where: { id: escrowId },
      include: {
        order: true,
        buyer: { select: { id: true, name: true, email: true } },
        farmer: { select: { id: true, name: true, email: true } },
      },
    });

    if (!escrow) throw new Error('Escrow not found');

    // Verify user is authorized
    if (escrow.buyerId !== userId && escrow.farmerId !== userId) {
      throw new Error('Unauthorized to view this escrow');
    }

    // Cache for 3 minutes
    await redis.set(cacheKey, escrow, 180);
    
    return escrow;
  }
}

export default new EscrowService();
