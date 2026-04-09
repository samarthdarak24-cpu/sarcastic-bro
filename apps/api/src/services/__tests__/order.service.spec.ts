import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { PrismaService } from '../prisma.service';

describe('OrderService', () => {
  let service: OrderService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
            orderTracking: {
              create: jest.fn(),
              update: jest.fn(),
            },
            notification: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createOrder', () => {
    it('should create order with PENDING status', async () => {
      const orderData = {
        buyerId: '1',
        farmerId: '2',
        productId: '1',
        quantity: 50,
        totalPrice: 25000,
      };

      jest.spyOn(prismaService.order, 'create').mockResolvedValue({
        id: '1',
        ...orderData,
        status: 'PENDING',
        createdAt: new Date(),
      } as any);

      const result = await service.createOrder(orderData);

      expect(result.status).toBe('PENDING');
      expect(prismaService.order.create).toHaveBeenCalled();
    });
  });

  describe('updateOrderStatus', () => {
    it('should transition from PENDING to ACCEPTED', async () => {
      const orderId = '1';

      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue({
        id: orderId,
        status: 'PENDING',
      } as any);

      jest.spyOn(prismaService.order, 'update').mockResolvedValue({
        id: orderId,
        status: 'ACCEPTED',
      } as any);

      const result = await service.updateOrderStatus(orderId, 'ACCEPTED');

      expect(result.status).toBe('ACCEPTED');
    });

    it('should reject invalid status transitions', async () => {
      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue({
        id: '1',
        status: 'COMPLETED',
      } as any);

      await expect(
        service.updateOrderStatus('1', 'PENDING')
      ).rejects.toThrow('Invalid status transition');
    });

    it('should notify farmer on order rejection', async () => {
      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue({
        id: '1',
        status: 'PENDING',
        farmerId: '2',
      } as any);

      jest.spyOn(prismaService.order, 'update').mockResolvedValue({
        id: '1',
        status: 'REJECTED',
      } as any);

      jest.spyOn(prismaService.notification, 'create').mockResolvedValue({} as any);

      await service.updateOrderStatus('1', 'REJECTED');

      expect(prismaService.notification.create).toHaveBeenCalled();
    });
  });

  describe('getOrdersByFarmer', () => {
    it('should retrieve all orders for a farmer', async () => {
      const farmerId = '1';
      const mockOrders = [
        { id: '1', farmerId, status: 'PENDING' },
        { id: '2', farmerId, status: 'ACCEPTED' },
      ];

      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(mockOrders as any);

      const result = await service.getOrdersByFarmer(farmerId);

      expect(result).toHaveLength(2);
    });
  });

  describe('getOrdersByBuyer', () => {
    it('should retrieve all orders for a buyer', async () => {
      const buyerId = '1';
      const mockOrders = [
        { id: '1', buyerId, status: 'PENDING' },
        { id: '2', buyerId, status: 'SHIPPED' },
      ];

      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(mockOrders as any);

      const result = await service.getOrdersByBuyer(buyerId);

      expect(result).toHaveLength(2);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order before acceptance', async () => {
      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue({
        id: '1',
        status: 'PENDING',
      } as any);

      jest.spyOn(prismaService.order, 'update').mockResolvedValue({
        id: '1',
        status: 'CANCELLED',
      } as any);

      const result = await service.cancelOrder('1');

      expect(result.status).toBe('CANCELLED');
    });

    it('should not allow cancellation after acceptance', async () => {
      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue({
        id: '1',
        status: 'ACCEPTED',
      } as any);

      await expect(service.cancelOrder('1')).rejects.toThrow(
        'Cannot cancel accepted order'
      );
    });
  });

  describe('updateOrderTracking', () => {
    it('should update order location', async () => {
      const trackingData = {
        orderId: '1',
        location: 'In Transit',
        latitude: 28.7041,
        longitude: 77.1025,
      };

      jest.spyOn(prismaService.orderTracking, 'update').mockResolvedValue({
        ...trackingData,
      } as any);

      const result = await service.updateOrderTracking(trackingData);

      expect(result.location).toBe('In Transit');
    });
  });
});
