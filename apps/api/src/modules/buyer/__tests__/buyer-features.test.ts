import request from 'supertest';
import app from '../../../app';
import prisma from '../../../prisma/client';

describe('Buyer Features Integration Tests', () => {
  let authToken: string;
  let buyerId: string;
  let productId: string;
  let orderId: string;

  beforeAll(async () => {
    // Login as buyer to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        phone: '9876543220',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
    buyerId = loginResponse.body.user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Business KYC', () => {
    it('should get KYC status', async () => {
      const response = await request(app)
        .get('/api/buyer/kyc/status')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('verified');
      expect(response.body.data).toHaveProperty('gst');
    });

    it('should verify GST number', async () => {
      const response = await request(app)
        .post('/api/buyer/kyc/verify-gst')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          gst: '27AADCM1234F1Z5'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toBe(true);
    });

    it('should submit KYC details', async () => {
      const response = await request(app)
        .post('/api/buyer/kyc/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          gst: '27AADCM1234F1Z5',
          companyName: 'Test Company',
          bankAccount: '12345678901234',
          ifsc: 'SBIN0001234',
          bankName: 'State Bank of India'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('2. Wallet System', () => {
    it('should get wallet balance', async () => {
      const response = await request(app)
        .get('/api/buyer/wallet/balance')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('balance');
    });

    it('should add funds to wallet', async () => {
      const response = await request(app)
        .post('/api/buyer/wallet/add-funds')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 10000,
          method: 'UPI'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction.amount).toBe(10000);
    });

    it('should get transaction history', async () => {
      const response = await request(app)
        .get('/api/buyer/wallet/transactions?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('transactions');
      expect(response.body.data).toHaveProperty('pagination');
    });
  });

  describe('3. Aggregated Marketplace', () => {
    it('should get marketplace products', async () => {
      const response = await request(app)
        .get('/api/buyer/marketplace/products?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('aggregatedLots');
      expect(response.body.data).toHaveProperty('individualCrops');
    });

    it('should get products with filters', async () => {
      const response = await request(app)
        .get('/api/buyer/marketplace/products?cropName=wheat&minGrade=B')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should get available filters', async () => {
      const response = await request(app)
        .get('/api/buyer/marketplace/filters')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('categories');
      expect(response.body.data).toHaveProperty('crops');
      expect(response.body.data).toHaveProperty('grades');
    });
  });

  describe('4. Quality Viewer', () => {
    it('should get quality certificate for product', async () => {
      // First get a product
      const productsResponse = await request(app)
        .get('/api/buyer/marketplace/products?limit=1')
        .set('Authorization', `Bearer ${authToken}`);

      if (productsResponse.body.data.aggregatedLots.length > 0) {
        const lotId = productsResponse.body.data.aggregatedLots[0].id;

        const response = await request(app)
          .get(`/api/buyer/marketplace/products/lot/${lotId}/quality`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      }
    });
  });

  describe('5. Bulk Order', () => {
    it('should create a bulk order', async () => {
      // First get a product
      const productsResponse = await request(app)
        .get('/api/buyer/marketplace/products?limit=1')
        .set('Authorization', `Bearer ${authToken}`);

      if (productsResponse.body.data.aggregatedLots.length > 0) {
        const lot = productsResponse.body.data.aggregatedLots[0];
        productId = lot.id;

        const response = await request(app)
          .post('/api/buyer/bulk-orders')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            productId: lot.id,
            productType: 'lot',
            quantity: 100,
            deliveryAddress: '123 Test Street, Mumbai'
          });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.order).toHaveProperty('id');
        orderId = response.body.data.order.id;
      }
    });

    it('should get all orders', async () => {
      const response = await request(app)
        .get('/api/buyer/bulk-orders?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('orders');
    });

    it('should get order details', async () => {
      if (orderId) {
        const response = await request(app)
          .get(`/api/buyer/bulk-orders/${orderId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('escrowTransaction');
      }
    });
  });

  describe('6. Escrow System', () => {
    it('should get escrow orders', async () => {
      const response = await request(app)
        .get('/api/buyer/escrow?status=HELD')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('7. Delivery Approval', () => {
    it('should confirm delivery and release payment', async () => {
      if (orderId) {
        const response = await request(app)
          .post(`/api/buyer/bulk-orders/${orderId}/confirm-delivery`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.order.status).toBe('DELIVERED');
      }
    });
  });

  describe('8. Chat System', () => {
    it('should get conversations', async () => {
      const response = await request(app)
        .get('/api/buyer/chat/conversations')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should get unread count', async () => {
      const response = await request(app)
        .get('/api/buyer/chat/unread-count')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('count');
    });

    it('should send a message', async () => {
      // Get a farmer ID first
      const farmersResponse = await request(app)
        .get('/api/buyer/suppliers')
        .set('Authorization', `Bearer ${authToken}`);

      if (farmersResponse.body.data.length > 0) {
        const farmerId = farmersResponse.body.data[0].id;

        const response = await request(app)
          .post('/api/buyer/chat/send')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            receiverId: farmerId,
            content: 'Hello, test message'
          });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      }
    });
  });

  describe('9. Order Tracking', () => {
    it('should get order tracking details', async () => {
      if (orderId) {
        const response = await request(app)
          .get(`/api/buyer/orders/${orderId}/track`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('order');
        expect(response.body.data).toHaveProperty('supplier');
        expect(response.body.data).toHaveProperty('tracking');
      }
    });
  });

  describe('10. Dashboard & Analytics', () => {
    it('should get dashboard stats', async () => {
      const response = await request(app)
        .get('/api/buyer/dashboard/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalSpent');
      expect(response.body.data).toHaveProperty('totalOrders');
      expect(response.body.data).toHaveProperty('walletBalance');
    });

    it('should get orders summary', async () => {
      const response = await request(app)
        .get('/api/buyer/dashboard/orders-summary')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('pending');
      expect(response.body.data).toHaveProperty('delivered');
    });

    it('should get spending analytics', async () => {
      const response = await request(app)
        .get('/api/buyer/dashboard/analytics/spending?period=month')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalSpent');
      expect(response.body.data).toHaveProperty('categoryBreakdown');
    });

    it('should get top suppliers', async () => {
      const response = await request(app)
        .get('/api/buyer/dashboard/top-suppliers?limit=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
