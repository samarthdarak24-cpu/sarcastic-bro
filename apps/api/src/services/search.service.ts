import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

interface SearchFilters {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  distance?: number;
  grade?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
}

interface SearchResult {
  id: string;
  name: string;
  price: number;
  grade: string;
  location: string;
  distance?: number;
  relevanceScore: number;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private prisma: PrismaService) {}

  async search(filters: SearchFilters, limit: number = 20, offset: number = 0): Promise<SearchResult[]> {
    try {
      this.logger.log(`Searching with filters: ${JSON.stringify(filters)}`);

      let query: any = {
        where: {
          isActive: true,
        },
        take: limit,
        skip: offset,
      };

      // Keyword search
      if (filters.keyword) {
        query.where.OR = [
          { name: { contains: filters.keyword, mode: 'insensitive' } },
          { description: { contains: filters.keyword, mode: 'insensitive' } },
          { category: { contains: filters.keyword, mode: 'insensitive' } },
        ];
      }

      // Price range filter
      if (filters.minPrice || filters.maxPrice) {
        query.where.price = {};
        if (filters.minPrice) query.where.price.gte = filters.minPrice;
        if (filters.maxPrice) query.where.price.lte = filters.maxPrice;
      }

      // Location filter
      if (filters.location) {
        query.where.location = { contains: filters.location, mode: 'insensitive' };
      }

      // Grade filter
      if (filters.grade) {
        query.where.grade = filters.grade;
      }

      // Category filter
      if (filters.category) {
        query.where.category = { contains: filters.category, mode: 'insensitive' };
      }

      const products = await this.prisma.product.findMany(query);

      // Calculate relevance scores and distance
      const results = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        grade: product.grade || 'B',
        location: product.location,
        distance: this.calculateDistance(
          filters.latitude,
          filters.longitude,
          product.latitude,
          product.longitude
        ),
        relevanceScore: this.calculateRelevanceScore(product, filters),
      }));

      // Sort by relevance
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Filter by distance if specified
      if (filters.distance) {
        return results.filter((r) => r.distance <= filters.distance);
      }

      return results;
    } catch (error) {
      this.logger.error(`Search failed: ${error.message}`);
      throw error;
    }
  }

  async searchByKeyword(keyword: string, limit: number = 20): Promise<SearchResult[]> {
    return this.search({ keyword }, limit);
  }

  async filterByPriceRange(minPrice: number, maxPrice: number, limit: number = 20): Promise<SearchResult[]> {
    return this.search({ minPrice, maxPrice }, limit);
  }

  async filterByLocation(location: string, distance: number = 50, limit: number = 20): Promise<SearchResult[]> {
    return this.search({ location, distance }, limit);
  }

  async filterByGrade(grade: string, limit: number = 20): Promise<SearchResult[]> {
    return this.search({ grade }, limit);
  }

  async filterByCategory(category: string, limit: number = 20): Promise<SearchResult[]> {
    return this.search({ category }, limit);
  }

  async saveSearch(userId: string, filters: SearchFilters, name: string): Promise<any> {
    try {
      // Placeholder for saving search
      return {
        id: `search-${Date.now()}`,
        userId,
        filters,
        name,
        createdAt: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to save search: ${error.message}`);
      throw error;
    }
  }

  async getSavedSearches(userId: string): Promise<any[]> {
    try {
      // Placeholder for retrieving saved searches
      return [];
    } catch (error) {
      this.logger.error(`Failed to get saved searches: ${error.message}`);
      throw error;
    }
  }

  private calculateDistance(lat1?: number, lon1?: number, lat2?: number, lon2?: number): number {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private calculateRelevanceScore(product: any, filters: SearchFilters): number {
    let score = 100;

    // Keyword relevance
    if (filters.keyword) {
      if (product.name.toLowerCase().includes(filters.keyword.toLowerCase())) {
        score += 50;
      }
      if (product.description?.toLowerCase().includes(filters.keyword.toLowerCase())) {
        score += 25;
      }
    }

    // Price relevance
    if (filters.minPrice && filters.maxPrice) {
      const midPrice = (filters.minPrice + filters.maxPrice) / 2;
      const priceDiff = Math.abs(product.price - midPrice);
      score -= priceDiff / 10;
    }

    // Grade relevance
    if (filters.grade && product.grade === filters.grade) {
      score += 30;
    }

    // Location relevance
    if (filters.location && product.location.toLowerCase().includes(filters.location.toLowerCase())) {
      score += 20;
    }

    return Math.max(0, score);
  }

  async rankSearchResults(results: SearchResult[]): Promise<SearchResult[]> {
    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}
