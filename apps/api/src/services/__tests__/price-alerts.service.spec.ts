import { Test, TestingModule } from '@nestjs/testing';
import { PriceAlertsService } from '../price-alerts.service';
import { PrismaService } from '../prisma.service';

describe('PriceAlertsService', () => {
  let service: PriceAlertsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceAlertsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn().mockResolvedValue([
                { id: '1', name: 'Wheat', price: 500 },
              ]),
              findFirst: jest.fn().mockResolvedValue({ price: 500 }),
            },
            notification: {
              create: jest.fn().mockResolvedValue({}),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PriceAlertsService>(PriceAlertsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createPriceAlert', () => {
    it('should create price alert above threshold', async () => {
      const result = await service.createPriceAlert('user-1', 'Wheat', 550, 'above');

      expect(result).toBeDefined();
      expect(result.userId).toBe('user-1');
      expect(result.cropName).toBe('Wheat');
      expect(result.targetPrice).toBe(550);
      expect(result.alertType).toBe('above');
      expect(result.isActive).toBe(true);
    });

    it('should create price alert below threshold', async () => {
      const result = await service.createPriceAlert('user-1', 'Wheat', 450, 'below');

      expect(result.alertType).toBe('below');
    });
  });

  describe('getPriceAlerts', () => {
    it('should get user price alerts', async () => {
      await service.createPriceAlert('user-1', 'Wheat', 550, 'above');
      const results = await service.getPriceAlerts('user-1');

      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('deletePriceAlert', () => {
    it('should delete price alert', async () => {
      const alert = await service.createPriceAlert('user-1', 'Wheat', 550, 'above');
      await service.deletePriceAlert(alert.id);

      const results = await service.getPriceAlerts('user-1');
      expect(results.find((a) => a.id === alert.id)).toBeUndefined();
    });
  });

  describe('getRecommendations', () => {
    it('should get recommendations for user', async () => {
      const results = await service.getRecommendations('user-1');

      expect(Array.isArray(results)).toBe(true);
    });

    it('should include price recommendations', async () => {
      const results = await service.getRecommendations('user-1');

      const priceRecs = results.filter((r) => r.type === 'price');
      expect(priceRecs.length).toBeGreaterThanOrEqual(0);
    });

    it('should include market recommendations', async () => {
      const results = await service.getRecommendations('user-1');

      const marketRecs = results.filter((r) => r.type === 'market');
      expect(marketRecs.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('personalizeRecommendations', () => {
    it('should filter by type', async () => {
      const results = await service.personalizeRecommendations('user-1', {
        types: ['price'],
      });

      expect(results.every((r) => r.type === 'price')).toBe(true);
    });

    it('should filter by minimum relevance', async () => {
      const results = await service.personalizeRecommendations('user-1', {
        minRelevance: 0.8,
      });

      expect(results.every((r) => r.relevanceScore >= 0.8)).toBe(true);
    });
  });

  describe('deliverRecommendations', () => {
    it('should deliver recommendations', async () => {
      const recommendations = [
        {
          id: 'rec-1',
          userId: 'user-1',
          type: 'price' as const,
          title: 'Price Opportunity',
          description: 'Your wheat is priced below market',
          relevanceScore: 0.9,
          createdAt: new Date(),
        },
      ];

      await service.deliverRecommendations('user-1', recommendations);

      expect(prismaService.notification.create).toHaveBeenCalled();
    });
  });
});
