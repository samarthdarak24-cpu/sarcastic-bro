import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from '../analytics.service';
import { PrismaService } from '../prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              findMany: jest.fn(),
              groupBy: jest.fn(),
            },
            product: {
              findMany: jest.fn(),
            },
            payment: {
              findMany: jest.fn(),
              groupBy: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getFarmerAnalytics', () => {
    it('should calculate farmer analytics', async () => {
      const farmerId = 'farmer-1';
      const mockOrders = [
        { id: 'order-1', status: 'COMPLETED', totalPrice: 25000 },
        { id: 'order-2', status: 'COMPLETED', totalPrice: 15000 },
      ];

      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(mockOrders as any);

      const result = await service.getFarmerAnalytics(farmerId);

      expect(result.totalOrders).toBe(2);
      expect(result.totalRevenue).toBe(40000);
    });
  });

  describe('getBuyerAnalytics', () => {
    it('should calculate buyer analytics', async () => {
      const buyerId = 'buyer-1';
      const mockOrders = [
        { id: 'order-1', status: 'COMPLETED', totalPrice: 25000 },
        { id: 'order-2', status: 'COMPLETED', totalPrice: 15000 },
      ];

      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(mockOrders as any);

      const result = await service.getBuyerAnalytics(buyerId);

      expect(result.totalPurchases).toBe(2);
      expect(result.totalSpent).toBe(40000);
    });
  });

  describe('getMarketTrends', () => {
    it('should analyze market trends', async () => {
      const mockProducts = [
        { id: 'prod-1', name: 'Wheat', category: 'Grains', price: 500 },
        { id: 'prod-2', name: 'Rice', category: 'Grains', price: 600 },
      ];

      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(mockProducts as any);

      const result = await service.getMarketTrends();

      expect(result.topCategories).toBeDefined();
      expect(result.averagePrices).toBeDefined();
    });
  });

  describe('getTopSellingCrops', () => {
    it('should return top selling crops', async () => {
      const mockOrders = [
        { productId: 'prod-1', quantity: 100 },
        { productId: 'prod-1', quantity: 50 },
        { productId: 'prod-2', quantity: 30 },
      ];

      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(mockOrders as any);

      const result = await service.getTopSellingCrops();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getOrderStatusDistribution', () => {
    it('should calculate order status distribution', async () => {
      const mockOrders = [
        { status: 'COMPLETED' },
        { status: 'COMPLETED' },
        { status: 'PENDING' },
        { status: 'SHIPPED' },
      ];

      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(mockOrders as any);

      const result = await service.getOrderStatusDistribution();

      expect(result.COMPLETED).toBe(2);
      expect(result.PENDING).toBe(1);
      expect(result.SHIPPED).toBe(1);
    });
  });

  describe('getRevenueAnalytics', () => {
    it('should calculate revenue analytics', async () => {
      const mockPayments = [
        { amount: 25000, status: 'SUCCESS' },
        { amount: 15000, status: 'SUCCESS' },
        { amount: 10000, status: 'FAILED' },
      ];

      jest.spyOn(prismaService.payment, 'findMany').mockResolvedValue(mockPayments as any);

      const result = await service.getRevenueAnalytics();

      expect(result.totalRevenue).toBe(40000);
      expect(result.successfulTransactions).toBe(2);
    });
  });

  describe('getAnalyticsWithDateRange', () => {
    it('should filter analytics by date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const mockOrders = [
        { id: 'order-1', createdAt: new Date('2024-01-15') },
      ];

      jest.spyOn(prismaService.order, 'findMany').mockResolvedValue(mockOrders as any);

      const result = await service.getAnalyticsWithDateRange(startDate, endDate);

      expect(result).toBeDefined();
    });
  });
});
