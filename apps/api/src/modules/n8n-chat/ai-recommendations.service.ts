import { AIDataFetcherService } from './ai-data-fetcher.service';

export class AIRecommendationsService {
  private dataFetcher = new AIDataFetcherService();

  /**
   * Generate AI recommendations for farmers
   */
  async generateFarmerRecommendations(farmerId: string, question: string): Promise<string> {
    const stats = await this.dataFetcher.getFarmerStats(farmerId);
    if (!stats) return this.getDefaultFarmerAdvice();

    const lowerQuestion = question.toLowerCase();

    // Pricing recommendations
    if (lowerQuestion.includes('price') || lowerQuestion.includes('sell')) {
      const trends = await this.dataFetcher.getPriceTrends('wheat');
      if (trends) {
        return `📊 **Pricing Recommendation for Your Products**\n\nBased on current market data:\n\n• **Average Market Price**: ₹${trends.averagePrice.toFixed(2)}/unit\n• **Price Range**: ₹${trends.minPrice} - ₹${trends.maxPrice}\n• **Your Current Products**: ${stats.totalProducts}\n• **Total Revenue**: ₹${stats.totalRevenue.toFixed(2)}\n\n**Recommendation**: Price your products competitively within the market range. Consider the quality and demand to maximize profits.\n\nWould you like specific pricing advice for a particular crop?`;
      }
    }

    // Inventory management
    if (lowerQuestion.includes('inventory') || lowerQuestion.includes('stock')) {
      return `📦 **Inventory Management**\n\nYour Current Status:\n• **Total Products Listed**: ${stats.totalProducts}\n• **Total Orders Received**: ${stats.totalOrders}\n• **Completed Orders**: ${stats.completedOrders}\n• **Average Order Value**: ₹${stats.averageOrderValue.toFixed(2)}\n\n**Recommendations**:\n• Keep high-demand products well-stocked\n• Monitor inventory levels regularly\n• Update prices based on demand\n• Remove slow-moving products\n\nTop Products: ${stats.products.slice(0, 3).map(p => p.name).join(', ')}\n\nWould you like help managing specific products?`;
    }

    // Sales performance
    if (lowerQuestion.includes('sales') || lowerQuestion.includes('performance') || lowerQuestion.includes('revenue')) {
      return `📈 **Your Sales Performance**\n\n**Key Metrics**:\n• **Total Orders**: ${stats.totalOrders}\n• **Completed Orders**: ${stats.completedOrders}\n• **Total Revenue**: ₹${stats.totalRevenue.toFixed(2)}\n• **Average Order Value**: ₹${stats.averageOrderValue.toFixed(2)}\n• **Success Rate**: ${((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}%\n\n**Performance Analysis**:\n${stats.totalRevenue > 50000 ? '✅ Excellent sales performance!' : '📈 Good start! Keep improving.'}\n\n**Next Steps**:\n• Increase product variety\n• Improve product quality\n• Get more customer reviews\n• Offer competitive pricing\n\nHow can I help you improve further?`;
    }

    // Growth strategies
    if (lowerQuestion.includes('grow') || lowerQuestion.includes('expand') || lowerQuestion.includes('strategy')) {
      return `🚀 **Growth Strategy for Your Farm Business**\n\n**Current Status**: ${stats.totalProducts} products, ${stats.totalOrders} orders\n\n**Growth Recommendations**:\n\n1. **Expand Product Range**\n   • Add complementary crops\n   • Diversify to reduce risk\n   • Target seasonal demand\n\n2. **Improve Quality**\n   • Get quality certifications\n   • Use blockchain traceability\n   • Build customer trust\n\n3. **Increase Sales**\n   • Offer bulk discounts\n   • Participate in auctions\n   • Build buyer relationships\n\n4. **Optimize Operations**\n   • Use auto-sell features\n   • Set up price alerts\n   • Monitor market trends\n\n**Estimated Revenue Potential**: ₹${(stats.totalRevenue * 2).toFixed(2)} (with optimization)\n\nWhich area would you like to focus on?`;
    }

    return this.getDefaultFarmerAdvice();
  }

  /**
   * Generate AI recommendations for buyers
   */
  async generateBuyerRecommendations(buyerId: string, question: string): Promise<string> {
    const stats = await this.dataFetcher.getBuyerStats(buyerId);
    if (!stats) return this.getDefaultBuyerAdvice();

    const lowerQuestion = question.toLowerCase();

    // Product recommendations
    if (lowerQuestion.includes('recommend') || lowerQuestion.includes('suggest') || lowerQuestion.includes('buy')) {
      return `🛒 **Personalized Product Recommendations**\n\nBased on your purchase history:\n\n**Your Preferences**:\n• **Total Purchases**: ${stats.totalOrders}\n• **Total Spent**: ₹${stats.totalSpent.toFixed(2)}\n• **Average Order Value**: ₹${stats.averageOrderValue.toFixed(2)}\n\n**Favorite Products**:\n${stats.favoriteProducts.map(p => `• ${p.name} (${p.purchases} purchases)`).join('\n')}\n\n**Recommended for You**:\n• Fresh seasonal vegetables\n• Organic certified products\n• Bulk purchase options\n• New farmer listings\n\n**Special Offers**:\n• Bulk discounts available\n• Pre-booking discounts\n• Loyalty rewards\n\nWould you like to browse recommended products?`;
    }

    // Budget planning
    if (lowerQuestion.includes('budget') || lowerQuestion.includes('spend') || lowerQuestion.includes('cost')) {
      return `💰 **Budget & Spending Analysis**\n\n**Your Spending Pattern**:\n• **Total Spent**: ₹${stats.totalSpent.toFixed(2)}\n• **Number of Orders**: ${stats.totalOrders}\n• **Average per Order**: ₹${stats.averageOrderValue.toFixed(2)}\n\n**Budget Recommendations**:\n• Monthly Budget: ₹${(stats.totalSpent / 12).toFixed(2)}\n• Bulk buying saves 15-20%\n• Subscribe for regular deliveries\n• Use price alerts for deals\n\n**Savings Opportunities**:\n• Buy directly from farmers (no middleman)\n• Order in bulk for discounts\n• Join group purchases\n• Use seasonal products\n\n**Potential Savings**: ₹${(stats.totalSpent * 0.2).toFixed(2)}/month\n\nHow can I help you save more?`;
    }

    // Supplier recommendations
    if (lowerQuestion.includes('supplier') || lowerQuestion.includes('seller') || lowerQuestion.includes('farmer')) {
      const topSellers = await this.dataFetcher.getTopSellers(5);
      if (topSellers) {
        return `👨‍🌾 **Top Recommended Suppliers**\n\nBased on ratings and sales:\n\n${topSellers.slice(0, 3).map(s => `• **${s.name}**\n  - Products: ${s.productCount}\n  - Total Sales: ₹${s.totalSales}\n  - Orders: ${s.orderCount}`).join('\n\n')}\n\n**Why Choose These Suppliers**:\n• Proven track record\n• High customer satisfaction\n• Consistent quality\n• Reliable delivery\n\n**How to Connect**:\n• View their product listings\n• Check customer reviews\n• Compare prices\n• Place your first order\n\nWould you like to explore any of these suppliers?`;
      }
    }

    // Order optimization
    if (lowerQuestion.includes('order') || lowerQuestion.includes('purchase') || lowerQuestion.includes('buy')) {
      return `📋 **Smart Ordering Guide**\n\n**Your Recent Orders**:\n${stats.recentOrders.slice(0, 3).map(o => `• Order #${o.id}: ₹${o.amount} (${o.status})`).join('\n')}\n\n**Ordering Tips**:\n1. **Bulk Orders** - Save 15-20% on bulk purchases\n2. **Pre-booking** - Reserve products in advance\n3. **Seasonal Buying** - Buy when prices are low\n4. **Direct from Farmers** - Better prices, fresher products\n5. **Group Purchases** - Share bulk orders with others\n\n**Best Time to Buy**:\n• Harvest season (lowest prices)\n• Off-season (pre-booking discounts)\n• Festival seasons (special offers)\n\n**Next Order Recommendation**: ₹${(stats.averageOrderValue * 1.2).toFixed(2)} for better bulk discount\n\nReady to place an order?`;
    }

    return this.getDefaultBuyerAdvice();
  }

  /**
   * Get market insights
   */
  async getMarketInsights(cropType?: string): Promise<string> {
    const marketData = await this.dataFetcher.getMarketData(cropType);
    if (!marketData) return 'Unable to fetch market data. Please try again.';

    const trends = await this.dataFetcher.getPriceTrends(cropType || 'wheat');

    return `📊 **Market Insights**\n\n**Current Market Status**:\n• **Total Products Available**: ${marketData.totalProducts}\n• **Average Price**: ₹${trends?.averagePrice.toFixed(2) || 'N/A'}\n• **Price Range**: ₹${trends?.minPrice || 'N/A'} - ₹${trends?.maxPrice || 'N/A'}\n\n**Top Products**:\n${marketData.products.slice(0, 3).map(p => `• ${p.name}: ₹${p.price} (${p.quantity} units)`).join('\n')}\n\n**Market Trend**: ${trends?.priceRange || 0 > 100 ? '📈 High volatility' : '📊 Stable'}\n\n**Recommendations**:\n• Compare prices before buying\n• Buy from multiple sellers\n• Check product quality\n• Negotiate for bulk orders\n\nWould you like more detailed market analysis?`;
  }

  private getDefaultFarmerAdvice(): string {
    return `🌾 **Farmer Assistant**\n\nI can help you with:\n\n• **Pricing Strategy** - Get competitive pricing recommendations\n• **Inventory Management** - Optimize your product listings\n• **Sales Performance** - Analyze your sales metrics\n• **Growth Strategy** - Expand your farm business\n• **Market Trends** - Understand current market prices\n• **Buyer Connections** - Find and connect with buyers\n\nWhat would you like help with?`;
  }

  private getDefaultBuyerAdvice(): string {
    return `🛒 **Buyer Assistant**\n\nI can help you with:\n\n• **Product Recommendations** - Get personalized suggestions\n• **Budget Planning** - Optimize your spending\n• **Supplier Recommendations** - Find trusted farmers\n• **Order Optimization** - Get better deals\n• **Market Insights** - Understand current prices\n• **Bulk Purchasing** - Save money on large orders\n\nWhat would you like help with?`;
  }
}
