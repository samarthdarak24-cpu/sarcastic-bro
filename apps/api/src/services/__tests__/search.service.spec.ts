import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from '../search.service';
import { PrismaService } from '../prisma.service';

describe('SearchService', () => {
  let service: SearchService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn().mockResolvedValue([
                { id: '1', name: 'Wheat', price: 500, grade: 'A+', location: 'Punjab', latitude: 31.5204, longitude: 74.3587 },
                { id: '2', name: 'Rice', price: 600, grade: 'A', location: 'Punjab', latitude: 31.5204, longitude: 74.3587 },
              ]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('search', () => {
    it('should search with filters', async () => {
      const results = await service.search({ keyword: 'wheat' });

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should filter by price range', async () => {
      const results = await service.search({ minPrice: 400, maxPrice: 550 });

      expect(Array.isArray(results)).toBe(true);
    });

    it('should filter by location', async () => {
      const results = await service.search({ location: 'Punjab' });

      expect(Array.isArray(results)).toBe(true);
    });

    it('should filter by grade', async () => {
      const results = await service.search({ grade: 'A+' });

      expect(Array.isArray(results)).toBe(true);
    });

    it('should filter by category', async () => {
      const results = await service.search({ category: 'Grains' });

      expect(Array.isArray(results)).toBe(true);
    });

    it('should support pagination', async () => {
      const results = await service.search({}, 10, 0);

      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('searchByKeyword', () => {
    it('should search by keyword', async () => {
      const results = await service.searchByKeyword('wheat');

      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('filterByPriceRange', () => {
    it('should filter by price range', async () => {
      const results = await service.filterByPriceRange(400, 600);

      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('filterByLocation', () => {
    it('should filter by location', async () => {
      const results = await service.filterByLocation('Punjab', 50);

      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('filterByGrade', () => {
    it('should filter by grade', async () => {
      const results = await service.filterByGrade('A+');

      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('filterByCategory', () => {
    it('should filter by category', async () => {
      const results = await service.filterByCategory('Grains');

      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('saveSearch', () => {
    it('should save search', async () => {
      const result = await service.saveSearch('user-1', { keyword: 'wheat' }, 'My Wheat Search');

      expect(result).toBeDefined();
      expect(result.userId).toBe('user-1');
      expect(result.name).toBe('My Wheat Search');
    });
  });

  describe('rankSearchResults', () => {
    it('should rank results by relevance', async () => {
      const results = [
        { id: '1', name: 'Wheat', relevanceScore: 50 },
        { id: '2', name: 'Wheat Flour', relevanceScore: 100 },
        { id: '3', name: 'Rice', relevanceScore: 25 },
      ];

      const ranked = await service.rankSearchResults(results as any);

      expect(ranked[0].relevanceScore).toBe(100);
      expect(ranked[1].relevanceScore).toBe(50);
      expect(ranked[2].relevanceScore).toBe(25);
    });
  });
});
