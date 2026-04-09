import { Test, TestingModule } from '@nestjs/testing';
import { TrustService } from '../trust.service';
import { PrismaService } from '../prisma.service';

describe('TrustService', () => {
  let service: TrustService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrustService,
        {
          provide: PrismaService,
          useValue: {
            rating: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TrustService>(TrustService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('submitRating', () => {
    it('should create rating with valid score', async () => {
      const ratingData = {
        orderId: 'order-1',
        ratedUserId: 'farmer-1',
        ratingUserId: 'buyer-1',
        rating: 5,
        review: 'Excellent product',
      };

      jest.spyOn(prismaService.rating, 'create').mockResolvedValue({
        id: 'rating-1',
        ...ratingData,
        createdAt: new Date(),
      } as any);

      const result = await service.submitRating(ratingData);

      expect(result.rating).toBe(5);
    });

    it('should validate rating is between 1 and 5', async () => {
      const invalidRating = {
        orderId: 'order-1',
        ratedUserId: 'farmer-1',
        ratingUserId: 'buyer-1',
        rating: 6,
        review: 'Good',
      };

      await expect(service.submitRating(invalidRating as any)).rejects.toThrow(
        'Rating must be between 1 and 5'
      );
    });
  });

  describe('calculateReputationScore', () => {
    it('should calculate average rating correctly', async () => {
      const userId = 'farmer-1';
      const mockRatings = [
        { rating: 5 },
        { rating: 4 },
        { rating: 5 },
        { rating: 3 },
      ];

      jest.spyOn(prismaService.rating, 'findMany').mockResolvedValue(mockRatings as any);

      const score = await service.calculateReputationScore(userId);

      expect(score).toBe(4.25);
    });

    it('should return 0 for user with no ratings', async () => {
      jest.spyOn(prismaService.rating, 'findMany').mockResolvedValue([]);

      const score = await service.calculateReputationScore('new-user');

      expect(score).toBe(0);
    });
  });

  describe('getUserRatings', () => {
    it('should retrieve all ratings for user', async () => {
      const userId = 'farmer-1';
      const mockRatings = [
        { id: 'rating-1', rating: 5, review: 'Great' },
        { id: 'rating-2', rating: 4, review: 'Good' },
      ];

      jest.spyOn(prismaService.rating, 'findMany').mockResolvedValue(mockRatings as any);

      const result = await service.getUserRatings(userId);

      expect(result).toHaveLength(2);
      expect(result[0].rating).toBe(5);
    });
  });

  describe('flagLowRating', () => {
    it('should flag ratings below threshold', async () => {
      const ratingId = 'rating-1';

      jest.spyOn(prismaService.rating, 'update').mockResolvedValue({
        id: ratingId,
        flagged: true,
      } as any);

      const result = await service.flagLowRating(ratingId);

      expect(result.flagged).toBe(true);
    });
  });

  describe('getUserReputationProfile', () => {
    it('should return complete reputation profile', async () => {
      const userId = 'farmer-1';
      const mockRatings = [
        { rating: 5 },
        { rating: 4 },
        { rating: 5 },
      ];

      jest.spyOn(prismaService.rating, 'findMany').mockResolvedValue(mockRatings as any);
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: userId,
        name: 'John Farmer',
      } as any);

      const result = await service.getUserReputationProfile(userId);

      expect(result.averageRating).toBe(4.67);
      expect(result.totalRatings).toBe(3);
    });
  });
});
