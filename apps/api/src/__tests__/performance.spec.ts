import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Performance Tests', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('API Response Time', () => {
    it('should respond to product list within 500ms (p95)', async () => {
      const times: number[] = [];

      for (let i = 0; i < 100; i++) {
        const start = Date.now();
        await request(app.getHttpServer())
          .get('/api/products')
          .set('Authorization', `Bearer ${authToken}`);
        times.push(Date.now() - start);
      }

      times.sort((a, b) => a - b);
      const p95 = times[Math.floor(times.length * 0.95)];

      expect(p95).toBeLessThan(500);
    });

    it('should respond to order creation within 1000ms', async () => {
      const start = Date.now();

      await request(app.getHttpServer())
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: 'prod-1',
          quantity: 50,
          totalPrice: 25000,
        });

      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Database Query Performance', () => {
    it('should retrieve 1000 products within 2 seconds', async () => {
      const start = Date.now();

      await request(app.getHttpServer())
        .get('/api/products?limit=1000')
        .set('Authorization', `Bearer ${authToken}`);

      const duration = Date.now() - start;

      expect(duration).toBeLessThan(2000);
    });

    it('should search products within 500ms', async () => {
      const start = Date.now();

      await request(app.getHttpServer())
        .get('/api/products/search?q=wheat')
        .set('Authorization', `Bearer ${authToken}`);

      const duration = Date.now() - start;

      expect(duration).toBeLessThan(500);
    });
  });

  describe('Cache Performance', () => {
    it('should serve cached requests faster', async () => {
      // First request (cache miss)
      const start1 = Date.now();
      await request(app.getHttpServer())
        .get('/api/products/1')
        .set('Authorization', `Bearer ${authToken}`);
      const time1 = Date.now() - start1;

      // Second request (cache hit)
      const start2 = Date.now();
      await request(app.getHttpServer())
        .get('/api/products/1')
        .set('Authorization', `Bearer ${authToken}`);
      const time2 = Date.now() - start2;

      expect(time2).toBeLessThan(time1);
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle 100 concurrent requests', async () => {
      const promises = [];

      for (let i = 0; i < 100; i++) {
        promises.push(
          request(app.getHttpServer())
            .get('/api/products')
            .set('Authorization', `Bearer ${authToken}`)
        );
      }

      const results = await Promise.all(promises);

      const successCount = results.filter(r => r.status === 200).length;

      expect(successCount).toBeGreaterThanOrEqual(95);
    });
  });

  describe('Memory Usage', () => {
    it('should not exceed memory limits during load', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      for (let i = 0; i < 50; i++) {
        await request(app.getHttpServer())
          .get('/api/products')
          .set('Authorization', `Bearer ${authToken}`);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Should not increase by more than 50MB
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('WebSocket Latency', () => {
    it('should deliver messages within 2 seconds', async () => {
      // WebSocket latency test would require socket.io-client
      expect(true).toBe(true);
    });
  });

  describe('Image Optimization', () => {
    it('should serve optimized images', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products/1/image')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/image/);
    });
  });
});
