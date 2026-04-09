import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('End-to-End Tests', () => {
  let app: INestApplication;
  let farmerToken: string;
  let buyerToken: string;
  let productId: string;
  let orderId: string;

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

  describe('Farmer Crop Upload Flow', () => {
    it('should register farmer', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'farmer@example.com',
          password: 'password123',
          role: 'FARMER',
          name: 'John Farmer',
        });

      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
      farmerToken = response.body.token;
    });

    it('should upload crop', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          name: 'Wheat',
          category: 'Grains',
          price: 500,
          quantity: 100,
          description: 'High quality wheat',
          location: 'Punjab',
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      productId = response.body.id;
    });

    it('should upload quality image', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/quality-scan')
        .set('Authorization', `Bearer ${farmerToken}`)
        .field('productId', productId)
        .attach('image', Buffer.from('fake-image'), 'test.jpg');

      expect(response.status).toBe(201);
      expect(response.body.grade).toMatch(/A\+|A|B\+|B/);
    });
  });

  describe('Buyer Marketplace Browsing Flow', () => {
    it('should register buyer', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'buyer@example.com',
          password: 'password123',
          role: 'BUYER',
          name: 'Jane Buyer',
        });

      expect(response.status).toBe(201);
      buyerToken = response.body.token;
    });

    it('should browse marketplace', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by category', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?category=Grains')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by price range', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/products?minPrice=400&maxPrice=600')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('Order Placement and Tracking Flow', () => {
    it('should place order', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          productId,
          quantity: 50,
          totalPrice: 25000,
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PENDING');
      orderId = response.body.id;
    });

    it('should accept order', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({ status: 'ACCEPTED' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ACCEPTED');
    });

    it('should update tracking', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/orders/${orderId}/tracking`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          location: 'In Transit',
          latitude: 28.7041,
          longitude: 77.1025,
        });

      expect(response.status).toBe(200);
    });

    it('should mark as delivered', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({ status: 'DELIVERED' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('DELIVERED');
    });
  });

  describe('Payment and Invoice Flow', () => {
    it('should initiate payment', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/payments')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          orderId,
          amount: 25000,
          method: 'RAZORPAY',
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('INITIATED');
    });

    it('should generate invoice', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/invoices/${orderId}`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.invoiceNumber).toBeDefined();
    });
  });

  describe('Rating and Reputation Flow', () => {
    it('should submit rating', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/ratings')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          orderId,
          rating: 5,
          review: 'Excellent product and service',
        });

      expect(response.status).toBe(201);
      expect(response.body.rating).toBe(5);
    });

    it('should retrieve farmer reputation', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/farmer-1/reputation`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.averageRating).toBeDefined();
    });
  });

  describe('Chat and Messaging Flow', () => {
    it('should send message', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/messages')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          conversationId: 'conv-1',
          content: 'Is this product still available?',
          type: 'TEXT',
        });

      expect(response.status).toBe(201);
    });

    it('should retrieve conversation', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/conversations/conv-1')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.messages)).toBe(true);
    });
  });

  describe('Real-time Updates', () => {
    it('should receive real-time notifications', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/notifications')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
