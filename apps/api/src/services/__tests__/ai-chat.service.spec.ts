import { Test, TestingModule } from '@nestjs/testing';
import { AiChatService } from '../ai-chat.service';
import { PrismaService } from '../prisma.service';

describe('AiChatService', () => {
  let service: AiChatService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiChatService,
        {
          provide: PrismaService,
          useValue: {
            message: {
              findMany: jest.fn().mockResolvedValue([]),
            },
            product: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AiChatService>(AiChatService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('chat', () => {
    it('should respond to user message', async () => {
      const result = await service.chat('user-1', 'What crops should I plant?', 'en');

      expect(result).toBeDefined();
      expect(result.message).toBeDefined();
      expect(result.language).toBe('en');
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(Array.isArray(result.sources)).toBe(true);
    });

    it('should support Hindi language', async () => {
      const result = await service.chat('user-1', 'मुझे क्या फसल लगानी चाहिए?', 'hi');

      expect(result.language).toBe('hi');
    });

    it('should support Marathi language', async () => {
      const result = await service.chat('user-1', 'मला कोणती पिके लावायची?', 'mr');

      expect(result.language).toBe('mr');
    });
  });

  describe('getMarketPriceRecommendation', () => {
    it('should provide price recommendation', async () => {
      const result = await service.getMarketPriceRecommendation('Wheat', 'Punjab');

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getCropRecommendation', () => {
    it('should recommend crops based on history', async () => {
      const result = await service.getCropRecommendation('user-1', 'en');

      expect(typeof result).toBe('string');
    });

    it('should support multiple languages', async () => {
      const resultHi = await service.getCropRecommendation('user-1', 'hi');
      const resultMr = await service.getCropRecommendation('user-1', 'mr');

      expect(typeof resultHi).toBe('string');
      expect(typeof resultMr).toBe('string');
    });
  });

  describe('explainQualityGrade', () => {
    it('should explain A+ grade', async () => {
      const result = await service.explainQualityGrade('A+', [], 'en');

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should explain grade with defects', async () => {
      const result = await service.explainQualityGrade('B+', ['spot', 'discoloration'], 'en');

      expect(typeof result).toBe('string');
    });

    it('should support multiple languages', async () => {
      const resultHi = await service.explainQualityGrade('A', [], 'hi');
      const resultMr = await service.explainQualityGrade('A', [], 'mr');

      expect(typeof resultHi).toBe('string');
      expect(typeof resultMr).toBe('string');
    });
  });
});
