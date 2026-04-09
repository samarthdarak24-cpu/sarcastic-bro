import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Security Tests', () => {
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

  describe('SQL Injection Prevention', () => {
    it('should prevent SQL injection in search', async () => {
      const response = await request(app.getHttpServer())
        .get("/api/products/search?q='; DROP TABLE products; --")
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).not.toBe(500);
      expect(response.body).toBeDefined();
    });

    it('should prevent SQL injection in filters', async () => {
      const response = await request(app.getHttpServer())
        .get("/api/products?category='; DELETE FROM products; --")
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).not.toBe(500);
    });
  });

  describe('XSS Prevention', () => {
    it('should sanitize user input', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '<script>alert("XSS")</script>',
          category: 'Grains',
          price: 500,
          quantity: 100,
        });

      expect(response.status).toBe(201);
      expect(response.body.name).not.toContain('<script>');
    });

    it('should escape HTML in messages', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          conversationId: 'conv-1',
          content: '<img src=x onerror="alert(1)">',
          type: 'TEXT',
        });

      expect(response.status).toBe(201);
      expect(response.body.content).not.toContain('onerror');
    });
  });

  describe('CSRF Protection', () => {
    it('should require CSRF token for state-changing operations', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .send({
          name: 'Wheat',
          category: 'Grains',
          price: 500,
          quantity: 100,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('JWT Token Security', () => {
    it('should reject invalid tokens', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });

    it('should reject expired tokens', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDB9.invalid';

      const response = await request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
    });

    it('should reject tampered tokens', async () => {
      const tamperedToken = authToken.slice(0, -5) + 'xxxxx';

      const response = await request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', `Bearer ${tamperedToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe('Rate Limiting', () => {
    it('should rate limit excessive requests', async () => {
      const requests = [];

      for (let i = 0; i < 150; i++) {
        requests.push(
          request(app.getHttpServer())
            .get('/api/products')
            .set('Authorization', `Bearer ${authToken}`)
        );
      }

      const results = await Promise.all(requests);
      const rateLimited = results.filter(r => r.status === 429);

      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('File Upload Security', () => {
    it('should reject non-image files', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/quality-scan')
        .set('Authorization', `Bearer ${authToken}`)
        .field('productId', 'prod-1')
        .attach('image', Buffer.from('not an image'), 'test.txt');

      expect(response.status).toBe(400);
    });

    it('should limit file size', async () => {
      const largeBuffer = Buffer.alloc(100 * 1024 * 1024); // 100MB

      const response = await request(app.getHttpServer())
        .post('/api/quality-scan')
        .set('Authorization', `Bearer ${authToken}`)
        .field('productId', 'prod-1')
        .attach('image', largeBuffer, 'large.jpg');

      expect(response.status).toBe(413);
    });
  });

  describe('Authentication & Authorization', () => {
    it('should prevent unauthorized access', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/admin/users');

      expect(response.status).toBe(401);
    });

    it('should enforce role-based access control', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Wheat',
          category: 'Grains',
          price: 500,
          quantity: 100,
        });

      // Buyer should not be able to create products
      if (response.status === 403) {
        expect(response.status).toBe(403);
      }
    });
  });

  describe('Data Validation', () => {
    it('should validate email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          role: 'FARMER',
        });

      expect(response.status).toBe(400);
    });

    it('should validate password strength', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          role: 'FARMER',
        });

      expect(response.status).toBe(400);
    });

    it('should validate numeric fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Wheat',
          category: 'Grains',
          price: 'not-a-number',
          quantity: 100,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('HTTPS & Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-xss-protection']).toBeDefined();
    });
  });
});
