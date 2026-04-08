/**
 * Market Data Service - Provides real-time market prices
 * This is a mock service that simulates market data
 * In production, this would fetch from actual market APIs
 */

export interface MarketPrice {
  product: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  unit: string;
  location: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface MarketData {
  prices: MarketPrice[];
  lastUpdated: string;
  source: string;
}

class MarketDataService {
  /**
   * Get current market prices
   * In production, this would call actual market APIs
   */
  async getCurrentPrices(location?: string): Promise<MarketData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock market data
    const prices: MarketPrice[] = [
      {
        product: 'Tomatoes',
        category: 'Vegetables',
        minPrice: 45,
        maxPrice: 55,
        avgPrice: 50,
        unit: 'kg',
        location: location || 'Maharashtra',
        date: new Date().toISOString(),
        trend: 'up',
        changePercent: 5.2
      },
      {
        product: 'Onions',
        category: 'Vegetables',
        minPrice: 35,
        maxPrice: 45,
        avgPrice: 40,
        unit: 'kg',
        location: location || 'Maharashtra',
        date: new Date().toISOString(),
        trend: 'stable',
        changePercent: 0.5
      },
      {
        product: 'Wheat',
        category: 'Grains',
        minPrice: 22,
        maxPrice: 28,
        avgPrice: 25,
        unit: 'kg',
        location: location || 'Maharashtra',
        date: new Date().toISOString(),
        trend: 'down',
        changePercent: -2.1
      },
      {
        product: 'Rice',
        category: 'Grains',
        minPrice: 30,
        maxPrice: 40,
        avgPrice: 35,
        unit: 'kg',
        location: location || 'Maharashtra',
        date: new Date().toISOString(),
        trend: 'up',
        changePercent: 3.5
      },
      {
        product: 'Potatoes',
        category: 'Vegetables',
        minPrice: 18,
        maxPrice: 25,
        avgPrice: 22,
        unit: 'kg',
        location: location || 'Maharashtra',
        date: new Date().toISOString(),
        trend: 'stable',
        changePercent: 1.2
      },
      {
        product: 'Cabbage',
        category: 'Vegetables',
        minPrice: 12,
        maxPrice: 18,
        avgPrice: 15,
        unit: 'kg',
        location: location || 'Maharashtra',
        date: new Date().toISOString(),
        trend: 'up',
        changePercent: 4.8
      },
      {
        product: 'Cauliflower',
        category: 'Vegetables',
        minPrice: 20,
        maxPrice: 30,
        avgPrice: 25,
        unit: 'kg',
        location: location || 'Maharashtra',
        date: new Date().toISOString(),
        trend: 'down',
        changePercent: -1.5
      },
      {
        product: 'Carrots',
        category: 'Vegetables',
        minPrice: 25,
        maxPrice: 35,
        avgPrice: 30,
        unit: 'kg',
        location: location || 'Maharashtra',
        date: new Date().toISOString(),
        trend: 'stable',
        changePercent: 0.8
      }
    ];

    return {
      prices,
      lastUpdated: new Date().toISOString(),
      source: 'ODOP Market Intelligence'
    };
  }

  /**
   * Get price for specific product
   */
  async getProductPrice(productName: string, location?: string): Promise<MarketPrice | null> {
    const data = await this.getCurrentPrices(location);
    const product = data.prices.find(
      p => p.product.toLowerCase() === productName.toLowerCase()
    );
    return product || null;
  }

  /**
   * Get price trends
   */
  async getPriceTrends(days: number = 7): Promise<any> {
    // Mock trend data
    return {
      period: `Last ${days} days`,
      trends: [
        { product: 'Tomatoes', change: '+5.2%', direction: 'up' },
        { product: 'Onions', change: '+0.5%', direction: 'stable' },
        { product: 'Wheat', change: '-2.1%', direction: 'down' },
        { product: 'Rice', change: '+3.5%', direction: 'up' }
      ]
    };
  }

  /**
   * Format market data for AI context
   */
  formatForAI(data: MarketData): string {
    const priceList = data.prices.map(p => 
      `${p.product}: ₹${p.minPrice}-${p.maxPrice} per ${p.unit} (avg: ₹${p.avgPrice}, trend: ${p.trend} ${p.changePercent > 0 ? '+' : ''}${p.changePercent}%)`
    ).join('\n');

    return `Current Market Prices (${data.source}, updated: ${new Date(data.lastUpdated).toLocaleString()}):\n${priceList}`;
  }
}

export const marketDataService = new MarketDataService();
