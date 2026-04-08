import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AIDataFetcherService {
  /**
   * Fetch real-time market data for AI analysis
   */
  async getMarketData(cropType?: string) {
    try {
      const products = await prisma.product.findMany({
        where: cropType ? { name: { contains: cropType, mode: 'insensitive' } } : {},
        include: { seller: true },
        take: 20,
      });

      return {
        totalProducts: products.length,
        products: products.map(p => ({
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          seller: p.seller?.name,
          region: p.region,
          createdAt: p.createdAt,
        })),
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      return null;
    }
  }

  /**
   * Fetch farmer's inventory and statistics
   */
  async getFarmerStats(farmerId: string) {
    try {
      const products = await prisma.product.findMany({
        where: { sellerId: farmerId },
      });

      const orders = await prisma.order.findMany({
        where: { sellerId: farmerId },
      });

      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const completedOrders = orders.filter(o => o.status === 'completed').length;

      return {
        totalProducts: products.length,
        totalOrders: orders.length,
        completedOrders,
        totalRevenue,
        averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
        products: products.map(p => ({
          name: p.name,
          quantity: p.quantity,
          price: p.price,
        })),
      };
    } catch (error) {
      console.error('Error fetching farmer stats:', error);
      return null;
    }
  }

  /**
   * Fetch buyer's purchase history and preferences
   */
  async getBuyerStats(buyerId: string) {
    try {
      const orders = await prisma.order.findMany({
        where: { buyerId },
        include: { items: true },
      });

      const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const favoriteProducts = this.extractFavoriteProducts(orders);

      return {
        totalOrders: orders.length,
        totalSpent,
        averageOrderValue: orders.length > 0 ? totalSpent / orders.length : 0,
        favoriteProducts,
        recentOrders: orders.slice(-5).map(o => ({
          id: o.id,
          date: o.createdAt,
          amount: o.totalAmount,
          status: o.status,
        })),
      };
    } catch (error) {
      console.error('Error fetching buyer stats:', error);
      return null;
    }
  }

  /**
   * Get price trends for a specific crop
   */
  async getPriceTrends(cropName: string) {
    try {
      const products = await prisma.product.findMany({
        where: { name: { contains: cropName, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
        take: 30,
      });

      const prices = products.map(p => ({
        price: p.price,
        date: p.createdAt,
        quantity: p.quantity,
      }));

      const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
      const minPrice = Math.min(...prices.map(p => p.price));
      const maxPrice = Math.max(...prices.map(p => p.price));

      return {
        cropName,
        averagePrice: avgPrice,
        minPrice,
        maxPrice,
        priceRange: maxPrice - minPrice,
        trend: prices,
      };
    } catch (error) {
      console.error('Error fetching price trends:', error);
      return null;
    }
  }

  /**
   * Get top sellers by rating and sales
   */
  async getTopSellers(limit = 10) {
    try {
      const sellers = await prisma.user.findMany({
        where: { role: 'farmer' },
        include: {
          products: true,
          sellerOrders: { include: { items: true } },
        },
        take: limit,
      });

      return sellers.map(seller => ({
        id: seller.id,
        name: seller.name,
        email: seller.email,
        productCount: seller.products.length,
        totalSales: seller.sellerOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        orderCount: seller.sellerOrders.length,
      }));
    } catch (error) {
      console.error('Error fetching top sellers:', error);
      return null;
    }
  }

  /**
   * Get available products by region
   */
  async getProductsByRegion(region: string) {
    try {
      const products = await prisma.product.findMany({
        where: { region: { contains: region, mode: 'insensitive' } },
        include: { seller: true },
        take: 20,
      });

      return {
        region,
        totalProducts: products.length,
        products: products.map(p => ({
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          seller: p.seller?.name,
          quality: p.quality || 'standard',
        })),
      };
    } catch (error) {
      console.error('Error fetching products by region:', error);
      return null;
    }
  }

  private extractFavoriteProducts(orders: any[]) {
    const productMap: Record<string, number> = {};
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        productMap[item.productName] = (productMap[item.productName] || 0) + 1;
      });
    });
    return Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, purchases: count }));
  }
}
