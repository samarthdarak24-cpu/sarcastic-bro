/**
 * Test Setup and Configuration
 * Runs before all tests to configure the test environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-for-testing-only';

// Increase timeout for integration tests
jest.setTimeout(30000);

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Uncomment to suppress console output during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Global test utilities
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateUniqueEmail = (prefix: string = 'test') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
};

export const createTestUser = async (request: any, role: 'FARMER' | 'BUYER' = 'FARMER') => {
  const userData = {
    name: `Test ${role}`,
    email: generateUniqueEmail(role.toLowerCase()),
    password: 'Test@12345',
    role,
    district: role === 'FARMER' ? 'Pune' : 'Mumbai',
    state: 'Maharashtra',
  };

  const res = await request.post('/auth/register').send(userData);
  
  return {
    user: res.body.data.user,
    token: res.body.data.tokens.accessToken,
    refreshToken: res.body.data.tokens.refreshToken,
  };
};

export const createTestProduct = async (request: any, token: string, overrides: any = {}) => {
  const productData = {
    name: 'Test Product',
    category: 'Vegetables',
    price: 25,
    unit: 'kg',
    quantity: 1000,
    district: 'Pune',
    state: 'Maharashtra',
    ...overrides,
  };

  const res = await request
    .post('/products')
    .set('Authorization', `Bearer ${token}`)
    .send(productData);

  return res.body.data;
};

// Cleanup function for tests
export const cleanupTestData = async (prisma: any, userIds: string[]) => {
  try {
    // Delete test data in correct order to respect foreign key constraints
    await prisma.notification.deleteMany({
      where: { userId: { in: userIds } },
    });
    
    await prisma.order.deleteMany({
      where: { buyerId: { in: userIds } },
    });
    
    await prisma.product.deleteMany({
      where: { farmerId: { in: userIds } },
    });
    
    await prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
};

// Mock AI Service responses for testing
export const mockAIResponses = {
  qualityScan: {
    grade: 'A',
    score: 85,
    confidence: 0.92,
    defects: ['Minor discoloration'],
    recommendations: ['Store in cool, dry place', 'Sell within 7 days'],
    model: 'v1',
    heatmap_url: '/uploads/heatmaps/test.jpg',
  },
  
  priceAdvice: {
    recommendedPrice: 25,
    minPrice: 21,
    maxPrice: 30,
    confidence: 88,
    marketSentiment: 'Bullish',
    demandLevel: 'High',
  },
  
  cropRecommendations: [
    {
      crop: 'Tomato',
      demandScore: 0.85,
      avgPrice: 25,
      season: 'kharif',
      why: 'High demand in local markets',
      image: '🍅',
    },
    {
      crop: 'Onion',
      demandScore: 0.78,
      avgPrice: 18,
      season: 'kharif',
      why: 'Stable prices and good storage',
      image: '🧅',
    },
  ],
  
  procurementRecommendations: {
    bestSuppliers: [
      {
        farmerId: 'test-farmer-1',
        farmerName: 'Test Farmer 1',
        price: 25,
        reputation: 85,
        distance: 50,
        finalScore: 88,
        deliveryEstimate: '1 - 2 days',
      },
    ],
    suggestedTiming: 'Market prices are stable. Purchase now for immediate delivery.',
  },
  
  unifiedInsights: {
    answer: 'Based on current market conditions, I recommend focusing on high-value crops.',
    recommendations: [],
    insights: {
      priceTrend: 'Stable',
      demandLevel: 'Medium',
      risk: 'Low',
    },
  },
};

// Export test constants
export const TEST_CONSTANTS = {
  VALID_PRODUCT_TYPES: ['Vegetable', 'Fruit', 'Grain', 'Spice'],
  VALID_SOIL_TYPES: ['alluvial', 'black', 'red', 'laterite'],
  VALID_SEASONS: ['kharif', 'rabi', 'zaid'],
  VALID_GRADES: ['A+', 'A', 'B', 'C', 'D'],
  VALID_MARKET_SENTIMENTS: ['Bullish', 'Bearish', 'Neutral'],
};
