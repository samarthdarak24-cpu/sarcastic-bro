import { PrismaClient, OrderStatus, EscrowStatus, PaymentStatus } from '@prisma/client';
import { BuyerWalletService } from './wallet.service';
import { SocketService } from '../../config/socket';

const prisma = new PrismaClient();
const walletService = new BuyerWalletService();

export class BulkOrderService {
  async createOrder(buyerId: string, orderData: {
    productId: string;
    productType: 'crop' | 'lot';
    quantity: number;
    deliveryAddress: string;
    deliveryDate?: Date;
    notes?: string;
  }) {
    const { productId, productType, quantity, deliveryAddress, deliveryDate, notes } = orderData;

    // Get product details and validate
    let product: any;
    let totalAmount: number;
    let sellerId: string;

    if (productType === 'lot') {
      product = await prisma.aggregatedLot.findUnique({
        where: { id: productId },
        include: { fpo: true }
      });

      if (!product) throw new Error('Aggregated lot not found');
      if (product.status !== 'LISTED') throw new Error('Product is not available');
      if (product.totalQuantity < quantity) throw new Error('Insufficient quantity available');

      totalAmount = product.pricePerKg * quantity;
      sellerId = product.fpo.adminUserId;
    } else {
      product = await prisma.crop.findUnique({
        where: { id: productId },
        include: {
          farmer: true,
          fpoFarmer: {
            include: {
              fpo: {
                select: {
                  adminUserId: true
                }
              }
            }
          }
        }
      });

      if (!product) throw new Error('Crop not found');
      if (product.status !== 'LISTED') throw new Error('Product is not available');
      if (product.quantity < quantity) throw new Error('Insufficient quantity available');

      totalAmount = product.pricePerKg * quantity;
      sellerId = product.farmerId || product.fpoFarmer?.fpo?.adminUserId || '';
    }

    // Check wallet balance
    const wallet = await walletService.getWallet(buyerId);
    if (wallet.balance < totalAmount) {
      throw new Error('Insufficient wallet balance');
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId,
        cropId: productType === 'crop' ? productId : null,
        lotId: productType === 'lot' ? productId : null,
        quantity,
        totalAmount,
        status: OrderStatus.PENDING,
        escrowStatus: EscrowStatus.HELD,
        deliveryAddress
      }
    });

    // Hold funds in escrow
    await walletService.holdFundsInEscrow(buyerId, totalAmount, order.id);

    // Create escrow transaction
    await prisma.escrowTransaction.create({
      data: {
        orderId: order.id,
        buyerId,
        sellerId,
        amount: totalAmount,
        status: EscrowStatus.HELD
      }
    });

    // Update product quantity/status
    if (productType === 'lot') {
      const newQuantity = product.totalQuantity - quantity;
      await prisma.aggregatedLot.update({
        where: { id: productId },
        data: {
          totalQuantity: newQuantity,
          status: newQuantity <= 0 ? 'SOLD' : 'LISTED'
        }
      });
    } else {
      const newQuantity = product.quantity - quantity;
      await prisma.crop.update({
        where: { id: productId },
        data: {
          quantity: newQuantity,
          status: newQuantity <= 0 ? 'SOLD' : 'LISTED'
        }
      });
    }

    // Real-time order + escrow updates
    SocketService.emitToUser(buyerId, 'order_updated', {
      orderId: order.id,
      status: order.status,
      event: 'ORDER_CREATED',
      timestamp: new Date(),
    });
    SocketService.emitToUser(buyerId, 'escrow_updated', {
      orderId: order.id,
      status: EscrowStatus.HELD,
      amount: totalAmount,
      timestamp: new Date(),
    });
    if (sellerId) {
      SocketService.emitToUser(sellerId, 'order_updated', {
        orderId: order.id,
        status: order.status,
        event: 'NEW_ORDER',
        timestamp: new Date(),
      });
    }

    return {
      order,
      message: 'Order placed successfully. Funds held in escrow.'
    };
  }

  async getOrders(buyerId: string, filters: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { buyerId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          crop: {
            select: {
              cropName: true,
              variety: true,
              grade: true,
              pricePerKg: true
            }
          },
          lot: {
            select: {
              cropName: true,
              pricePerKg: true,
              fpo: {
                select: {
                  name: true
                }
              }
            }
          },
          escrowTransaction: {
            select: {
              status: true,
              amount: true,
              heldAt: true,
              releasedAt: true
            }
          }
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
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getOrderDetails(orderId: string, buyerId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId
      },
      include: {
        crop: {
          include: {
            farmer: {
              select: {
                id: true,
                name: true,
                phone: true,
                farm: true
              }
            }
          }
        },
        lot: {
          include: {
            fpo: {
              select: {
                id: true,
                name: true,
                district: true,
                state: true
              }
            }
          }
        },
        escrowTransaction: true
      }
    });

    if (!order) throw new Error('Order not found');

    return order;
  }

  async confirmDelivery(orderId: string, buyerId: string) {
    const order = await this.getOrderDetails(orderId, buyerId);

    if (order.confirmedByBuyer) {
      throw new Error('Delivery already confirmed');
    }

    if (order.status !== OrderStatus.DELIVERED) {
      throw new Error('Order is not ready for delivery confirmation');
    }

    if (order.escrowStatus !== EscrowStatus.HELD) {
      throw new Error('Escrow funds not in HELD status');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        escrowStatus: EscrowStatus.RELEASED,
        paymentStatus: PaymentStatus.COMPLETED,
        confirmedByBuyer: true,
        confirmedAt: new Date()
      }
    });

    // Release escrow funds
    await prisma.escrowTransaction.update({
      where: { orderId },
      data: {
        status: EscrowStatus.RELEASED,
        releasedAt: new Date()
      }
    });

    // Create farmer earning record
    const escrow = order.escrowTransaction;
    if (escrow) {
      const platformFee = escrow.amount * 0.02; // 2% platform fee
      const farmerAmount = escrow.amount - platformFee;

      await prisma.farmerEarning.create({
        data: {
          farmerId: escrow.sellerId,
          orderId,
          amount: farmerAmount,
          platformFee,
          status: 'COMPLETED'
        }
      });
    }

    SocketService.emitToUser(buyerId, 'order_updated', {
      orderId,
      status: updatedOrder.status,
      event: 'DELIVERY_CONFIRMED',
      timestamp: new Date(),
    });
    SocketService.emitToUser(buyerId, 'escrow_updated', {
      orderId,
      status: EscrowStatus.RELEASED,
      amount: order.totalAmount,
      timestamp: new Date(),
    });
    if (order.escrowTransaction?.sellerId) {
      SocketService.emitToUser(order.escrowTransaction.sellerId, 'escrow_updated', {
        orderId,
        status: EscrowStatus.RELEASED,
        amount: order.totalAmount,
        timestamp: new Date(),
      });
    }

    return {
      order: updatedOrder,
      message: 'Delivery confirmed. Payment released to seller.'
    };
  }

  async cancelOrder(orderId: string, buyerId: string, reason: string) {
    const order = await this.getOrderDetails(orderId, buyerId);

    if (order.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot cancel delivered order');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new Error('Order already cancelled');
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        escrowStatus: EscrowStatus.REFUNDED
      }
    });

    // Refund escrow to buyer wallet
    const escrow = order.escrowTransaction;
    if (escrow) {
      await prisma.escrowTransaction.update({
        where: { orderId },
        data: {
          status: EscrowStatus.REFUNDED,
          releasedAt: new Date()
        }
      });

      // Add funds back to wallet
      await walletService.addFunds(buyerId, escrow.amount, {
        method: 'REFUND'
      });
    }

    SocketService.emitToUser(buyerId, 'order_updated', {
      orderId,
      status: OrderStatus.CANCELLED,
      event: 'ORDER_CANCELLED',
      timestamp: new Date(),
    });
    SocketService.emitToUser(buyerId, 'escrow_updated', {
      orderId,
      status: EscrowStatus.REFUNDED,
      amount: order.totalAmount,
      timestamp: new Date(),
    });
    if (order.escrowTransaction?.sellerId) {
      SocketService.emitToUser(order.escrowTransaction.sellerId, 'order_updated', {
        orderId,
        status: OrderStatus.CANCELLED,
        event: 'ORDER_CANCELLED',
        timestamp: new Date(),
      });
    }

    return {
      message: 'Order cancelled. Funds refunded to wallet.'
    };
  }
}
