import prisma from '../config/database';
import { EscrowStatus } from '@prisma/client';

export class EscrowService {
  // Hold funds in escrow when order is placed
  static async holdFunds(orderId: string, buyerId: string, sellerId: string, amount: number, razorpayPaymentId?: string) {
    // Deduct from buyer's wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: buyerId },
    });

    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient wallet balance');
    }

    // Create wallet transaction for debit
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'ESCROW_HOLD',
        amount: -amount,
        balanceBefore: wallet.balance,
        balanceAfter: wallet.balance - amount,
        description: `Escrow hold for order ${orderId}`,
        referenceId: orderId,
      },
    });

    // Update wallet balance
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance - amount },
    });

    // Create escrow transaction
    const escrow = await prisma.escrowTransaction.create({
      data: {
        orderId,
        buyerId,
        sellerId,
        amount,
        status: EscrowStatus.HELD,
        razorpayPaymentId,
        heldAt: new Date(),
      },
    });

    return escrow;
  }

  // Release funds from escrow to sellers
  static async releaseFunds(orderId: string) {
    const escrow = await prisma.escrowTransaction.findUnique({
      where: { orderId },
    });

    if (!escrow || escrow.status !== EscrowStatus.HELD) {
      throw new Error('Escrow transaction not found or already processed');
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        lot: {
          include: {
            crops: {
              include: {
                fpoFarmer: true,
              },
            },
          },
        },
        crop: {
          include: {
            farmer: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const platformFeeRate = 0.02; // 2% platform fee
    const totalAmount = escrow.amount;

    // If it's an aggregated lot, split among farmers
    if (order.lot) {
      const crops = order.lot.crops;
      const totalQuantity = crops.reduce((sum, crop) => sum + crop.quantity, 0);

      for (const crop of crops) {
        const farmerShare = (crop.quantity / totalQuantity) * totalAmount;
        const platformFee = farmerShare * platformFeeRate;
        const netAmount = farmerShare - platformFee;

        // Find the farmer user ID
        const fpoFarmer = crop.fpoFarmer;
        if (fpoFarmer) {
          const farmer = await prisma.user.findFirst({
            where: { phone: fpoFarmer.phone, role: 'FARMER' },
          });

          if (farmer) {
            // Create farmer earning record
            await prisma.farmerEarning.create({
              data: {
                farmerId: farmer.id,
                orderId,
                amount: netAmount,
                platformFee,
                status: 'COMPLETED',
                paidAt: new Date(),
              },
            });

            // Update farmer's wallet (create if doesn't exist)
            let farmerWallet = await prisma.wallet.findUnique({
              where: { userId: farmer.id },
            });

            if (!farmerWallet) {
              farmerWallet = await prisma.wallet.create({
                data: {
                  userId: farmer.id,
                  balance: 0,
                },
              });
            }

            await prisma.walletTransaction.create({
              data: {
                walletId: farmerWallet.id,
                type: 'ESCROW_RELEASE',
                amount: netAmount,
                balanceBefore: farmerWallet.balance,
                balanceAfter: farmerWallet.balance + netAmount,
                description: `Payment for order ${orderId}`,
                referenceId: orderId,
              },
            });

            await prisma.wallet.update({
              where: { id: farmerWallet.id },
              data: { balance: farmerWallet.balance + netAmount },
            });
          }
        }
      }
    } else if (order.crop && order.crop.farmer) {
      // Direct farmer sale
      const platformFee = totalAmount * platformFeeRate;
      const netAmount = totalAmount - platformFee;

      await prisma.farmerEarning.create({
        data: {
          farmerId: order.crop.farmer.id,
          orderId,
          amount: netAmount,
          platformFee,
          status: 'COMPLETED',
          paidAt: new Date(),
        },
      });

      let farmerWallet = await prisma.wallet.findUnique({
        where: { userId: order.crop.farmer.id },
      });

      if (!farmerWallet) {
        farmerWallet = await prisma.wallet.create({
          data: {
            userId: order.crop.farmer.id,
            balance: 0,
          },
        });
      }

      await prisma.walletTransaction.create({
        data: {
          walletId: farmerWallet.id,
          type: 'ESCROW_RELEASE',
          amount: netAmount,
          balanceBefore: farmerWallet.balance,
          balanceAfter: farmerWallet.balance + netAmount,
          description: `Payment for order ${orderId}`,
          referenceId: orderId,
        },
      });

      await prisma.wallet.update({
        where: { id: farmerWallet.id },
        data: { balance: farmerWallet.balance + netAmount },
      });
    }

    // Update escrow status
    await prisma.escrowTransaction.update({
      where: { orderId },
      data: {
        status: EscrowStatus.RELEASED,
        releasedAt: new Date(),
      },
    });

    // Update order escrow status
    await prisma.order.update({
      where: { id: orderId },
      data: { escrowStatus: EscrowStatus.RELEASED },
    });

    return { success: true, message: 'Funds released successfully' };
  }

  // Refund funds to buyer
  static async refundFunds(orderId: string) {
    const escrow = await prisma.escrowTransaction.findUnique({
      where: { orderId },
    });

    if (!escrow || escrow.status !== EscrowStatus.HELD) {
      throw new Error('Escrow transaction not found or already processed');
    }

    // Return funds to buyer's wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: escrow.buyerId },
    });

    if (!wallet) {
      throw new Error('Buyer wallet not found');
    }

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'REFUND',
        amount: escrow.amount,
        balanceBefore: wallet.balance,
        balanceAfter: wallet.balance + escrow.amount,
        description: `Refund for order ${orderId}`,
        referenceId: orderId,
      },
    });

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance + escrow.amount },
    });

    // Update escrow status
    await prisma.escrowTransaction.update({
      where: { orderId },
      data: {
        status: EscrowStatus.REFUNDED,
        releasedAt: new Date(),
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { escrowStatus: EscrowStatus.REFUNDED },
    });

    return { success: true, message: 'Funds refunded successfully' };
  }
}
