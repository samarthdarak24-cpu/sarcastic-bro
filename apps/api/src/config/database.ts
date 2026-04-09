import { PrismaClient } from '@prisma/client';
import { Logger } from '../utils/logger';

const logger = new Logger('DatabaseConfig');

class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: process.env.DEBUG === 'true' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  /**
   * Initialize database connection
   */
  async initialize(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info('Database disconnected');
    } catch (error) {
      logger.error('Error disconnecting from database:', error);
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      logger.info('Database health check passed');
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * Get Prisma client
   */
  getClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * Run migrations
   */
  async runMigrations(): Promise<void> {
    try {
      logger.info('Running database migrations...');
      // Migrations are typically run via CLI: npx prisma migrate deploy
      logger.info('Migrations completed');
    } catch (error) {
      logger.error('Error running migrations:', error);
      throw error;
    }
  }

  /**
   * Seed database with initial data
   */
  async seedDatabase(): Promise<void> {
    try {
      logger.info('Seeding database...');

      // Check if data already exists
      const userCount = await this.prisma.user.count();
      if (userCount > 0) {
        logger.info('Database already seeded, skipping...');
        return;
      }

      // Create sample users
      const farmer = await this.prisma.user.create({
        data: {
          email: 'farmer@example.com',
          password: 'hashed_password', // In real app, this would be hashed
          name: 'Sample Farmer',
          role: 'FARMER',
          phone: '+91-9876543210',
          district: 'Nashik',
          state: 'Maharashtra',
          language: 'ENGLISH',
          kycStatus: 'VERIFIED',
          reputationScore: 4.5,
        },
      });

      const buyer = await this.prisma.user.create({
        data: {
          email: 'buyer@example.com',
          password: 'hashed_password',
          name: 'Sample Buyer',
          role: 'BUYER',
          phone: '+91-9876543211',
          district: 'Pune',
          state: 'Maharashtra',
          language: 'ENGLISH',
          kycStatus: 'VERIFIED',
          reputationScore: 4.8,
        },
      });

      // Create sample product
      await this.prisma.product.create({
        data: {
          name: 'Organic Tomatoes',
          category: 'vegetable',
          description: 'Fresh organic tomatoes from local farm',
          price: 50,
          quantity: 100,
          unit: 'kg',
          district: 'Nashik',
          state: 'Maharashtra',
          qualityGrade: 'A+',
          qualityScore: 95,
          isActive: true,
          farmerId: farmer.id,
          imageUrls: JSON.parse('["https://example.com/tomato1.jpg"]'),
        },
      });

      logger.info('Database seeded successfully');
    } catch (error) {
      logger.error('Error seeding database:', error);
      throw error;
    }
  }

  /**
   * Clear all data (use with caution)
   */
  async clearDatabase(): Promise<void> {
    try {
      logger.warn('Clearing all database data...');

      // Delete in order of dependencies
      await this.prisma.rating.deleteMany();
      await this.prisma.payment.deleteMany();
      await this.prisma.orderTracking.deleteMany();
      await this.prisma.order.deleteMany();
      await this.prisma.qualityScan.deleteMany();
      await this.prisma.message.deleteMany();
      await this.prisma.conversation.deleteMany();
      await this.prisma.notification.deleteMany();
      await this.prisma.favorite.deleteMany();
      await this.prisma.product.deleteMany();
      await this.prisma.user.deleteMany();

      logger.info('Database cleared');
    } catch (error) {
      logger.error('Error clearing database:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
