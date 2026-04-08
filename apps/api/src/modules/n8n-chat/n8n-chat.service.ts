import axios from 'axios';
import { AIRecommendationsService } from './ai-recommendations.service';

interface ChatResponse {
  output: string;
  sessionId: string;
}

export class N8nChatService {
  private sessionContexts: Map<string, Array<{ role: string; content: string }>> = new Map();
  private aiRecommendations = new AIRecommendationsService();

  constructor() {
    console.log('[N8N Chat] Service initialized - using local intelligent responses');
  }

  /**
   * Process chat message and generate response
   * Uses local intelligent responses (n8n webhook disabled due to 404 errors)
   */
  async processChat(chatInput: string, sessionId?: string, userId?: string, userRole?: 'farmer' | 'buyer'): Promise<ChatResponse> {
    try {
      const currentSessionId = sessionId || this.generateSessionId();
      let context = this.sessionContexts.get(currentSessionId) || [];
      context.push({ role: 'user', content: chatInput });
      this.sessionContexts.set(currentSessionId, context);

      // Use local AI recommendations (n8n webhook disabled)
      let response: string;
      if (userRole === 'farmer' && userId) {
        response = await this.aiRecommendations.generateFarmerRecommendations(userId, chatInput);
      } else if (userRole === 'buyer' && userId) {
        response = await this.aiRecommendations.generateBuyerRecommendations(userId, chatInput);
      } else {
        response = this.generateIntelligentResponse(chatInput);
      }

      context.push({ role: 'assistant', content: response });
      this.sessionContexts.set(currentSessionId, context);

      return {
        output: response,
        sessionId: currentSessionId,
      };
    } catch (error) {
      console.error('Chat processing error:', error);
      throw error;
    }
  }

  /**
   * Generate intelligent responses for ANY question (fallback)
   * This is the master response engine that handles everything
   */
  private generateIntelligentResponse(input: string): string {
    const lowerInput = input.toLowerCase();
    
    // IMPORTANT: Check for specific keywords FIRST before generic responses
    // This ensures we give specific answers, not generic ones

    // Website/Platform Features
    if (lowerInput.includes('payment') || lowerInput.includes('pay')) {
      return `💳 **Payment System**\n\nOur platform supports multiple payment methods:\n\n• **Razorpay Integration** - Secure online payments\n• **Instant Transfers** - Fast fund transfers to your account\n• **Payment History** - Track all your transactions\n• **Escrow Protection** - Secure payments held until delivery\n• **Multiple Payment Options** - Cards, UPI, wallets\n\nYou can make payments directly from your dashboard. All transactions are secure and encrypted. Would you like help with a specific payment?`;
    }
    if (lowerInput.includes('order') || lowerInput.includes('purchase') || lowerInput.includes('buy')) {
      return `📦 **Orders & Purchases**\n\nHow to place and manage orders on AgriVoice:\n\n• **Browse Products** - View available crops and products\n• **Place Order** - Select quantity and confirm\n• **Track Order** - Real-time tracking from seller to you\n• **Order History** - View all past orders\n• **Bulk Orders** - Special pricing for large quantities\n• **Pre-booking** - Reserve products in advance\n\nYou can manage all orders from your dashboard. Need help placing an order?`;
    }
    if (lowerInput.includes('seller') || lowerInput.includes('farmer') || lowerInput.includes('supplier')) {
      return `🌾 **Seller/Farmer Features**\n\nIf you're a farmer or supplier, you can:\n\n• **List Products** - Add your crops and products\n• **Manage Inventory** - Track stock levels\n• **Set Prices** - Control your pricing\n• **Receive Orders** - Get buyer requests\n• **Track Sales** - Monitor your earnings\n• **Build Reputation** - Get reviews and ratings\n• **Auto-Sell** - Automatic selling rules\n\nStart selling your products today! Go to Farmer Dashboard to get started.`;
    }
    if (lowerInput.includes('buyer') || lowerInput.includes('purchase') || lowerInput.includes('procurement')) {
      return `🛒 **Buyer Features**\n\nAs a buyer, you can:\n\n• **Search Products** - Find crops by type, region, price\n• **Compare Prices** - See prices from multiple sellers\n• **Place Orders** - Buy directly from farmers\n• **Bulk Purchasing** - Special rates for large orders\n• **Bidding** - Participate in auctions\n• **Track Shipments** - Real-time delivery tracking\n• **Escrow Protection** - Safe payment system\n\nAccess buyer features from your dashboard!`;
    }
    if (lowerInput.includes('account') || lowerInput.includes('profile') || lowerInput.includes('login')) {
      return `👤 **Account & Profile**\n\nManage your account:\n\n• **Create Account** - Sign up as Farmer or Buyer\n• **Profile Setup** - Add your details and photo\n• **Verification** - Verify your identity\n• **Settings** - Manage preferences\n• **Security** - Change password, 2FA\n• **Notifications** - Control alerts\n• **Support** - Contact our team\n\nYour account is secure and encrypted. Need help with your account?`;
    }
    if (lowerInput.includes('shipping') || lowerInput.includes('delivery') || lowerInput.includes('logistics')) {
      return `🚚 **Shipping & Delivery**\n\nOur logistics system:\n\n• **Real-time Tracking** - Track your shipment live\n• **Multiple Carriers** - Choose your preferred carrier\n• **Insurance** - Protect your shipment\n• **Delivery Options** - Standard, express, scheduled\n• **Pickup Points** - Convenient collection locations\n• **Damage Claims** - File claims if needed\n\nAll shipments are tracked and insured. Track your order anytime!`;
    }
    if (lowerInput.includes('quality') || lowerInput.includes('inspection') || lowerInput.includes('verify')) {
      return `✅ **Quality & Verification**\n\nWe ensure product quality:\n\n• **Quality Scanner** - AI-powered crop quality detection\n• **Blockchain Trace** - Track product origin\n• **Certifications** - Verify organic/certified products\n• **Ratings** - See seller and product ratings\n• **Reviews** - Read buyer feedback\n• **Dispute Resolution** - Fair resolution process\n\nAll products are verified for quality. Check product details before ordering!`;
    }
    if (lowerInput.includes('price') || lowerInput.includes('market') || lowerInput.includes('sell')) {
      return `💰 **Market Prices & Trading**\n\nMarket intelligence features:\n\n• **Live Price Updates** - Real-time market prices\n• **Price Trends** - Historical price analysis\n• **Market Reports** - Regional market insights\n• **Price Alerts** - Get notified of price changes\n• **Auction System** - Bid on products\n• **Bulk Discounts** - Special pricing for large orders\n\nUse our market intelligence to maximize profits!`;
    }
    if (lowerInput.includes('reputation') || lowerInput.includes('rating') || lowerInput.includes('review')) {
      return `⭐ **Reputation & Reviews**\n\nBuild your reputation:\n\n• **Seller Ratings** - Get rated by buyers\n• **Buyer Reviews** - Leave feedback for sellers\n• **Trust Score** - Build your credibility\n• **Badges** - Earn achievement badges\n• **Dispute History** - Transparent record\n• **Recommendations** - Get recommended to buyers\n\nA good reputation helps you succeed! Provide excellent service to get great reviews.`;
    }
    if (lowerInput.includes('blockchain') || lowerInput.includes('trace') || lowerInput.includes('transparency')) {
      return `🔗 **Blockchain & Transparency**\n\nOur blockchain features:\n\n• **Product Traceability** - Track from farm to buyer\n• **Transparent Records** - Immutable transaction history\n• **Smart Contracts** - Automated agreements\n• **Escrow System** - Secure payments\n• **Fraud Prevention** - Detect suspicious activity\n• **Certification** - Verify authenticity\n\nBlockchain ensures complete transparency and trust!`;
    }

    // Agriculture-related responses
    if (lowerInput.includes('crop') || lowerInput.includes('plant') || lowerInput.includes('farm')) {
      return `🌾 **Crop Management**\n\nGreat question about farming! Here are some key tips:\n\n• Monitor soil moisture regularly\n• Use crop rotation to maintain soil health\n• Check for pests weekly\n• Keep detailed records of your farming activities\n• Plan your harvest timing strategically\n\nWould you like more specific advice about your crops?`;
    }
    if (lowerInput.includes('weather') || lowerInput.includes('rain') || lowerInput.includes('climate')) {
      return `🌤️ **Weather Planning**\n\nWeather planning is crucial for farming success:\n\n• Check local weather forecasts daily\n• Plan irrigation based on rainfall predictions\n• Protect crops during extreme weather\n• Keep weather records for future planning\n• Use weather data to optimize planting schedules\n\nWhat region are you farming in?`;
    }
    if (lowerInput.includes('pest') || lowerInput.includes('disease') || lowerInput.includes('insect')) {
      return `🐛 **Pest Management**\n\nPest management is essential for crop health:\n\n• Identify pests early through regular inspection\n• Use integrated pest management (IPM)\n• Consider both organic and chemical options\n• Consult with agricultural experts\n• Maintain crop health to prevent diseases\n\nDescribe the pest you're dealing with for specific advice.`;
    }
    if (lowerInput.includes('soil') || lowerInput.includes('fertilizer') || lowerInput.includes('nutrient')) {
      return `🌱 **Soil Health**\n\nSoil health is the foundation of successful farming:\n\n• Test soil regularly for nutrients\n• Use appropriate fertilizers based on soil type\n• Practice crop rotation\n• Add organic matter to improve soil structure\n• Monitor pH levels\n\nWhat's your soil type? I can provide specific recommendations.`;
    }
    if (lowerInput.includes('water') || lowerInput.includes('irrigation')) {
      return `💧 **Water Management**\n\nWater management is critical for crop success:\n\n• Irrigate based on soil moisture and weather\n• Use efficient irrigation methods (drip, sprinkler)\n• Collect and store rainwater\n• Monitor water quality\n• Plan irrigation schedules\n\nHow much water does your crop typically need?`;
    }
    if (lowerInput.includes('help') || lowerInput.includes('support') || lowerInput.includes('assist')) {
      return `🆘 **Help & Support**\n\nWelcome to AgriVoice! I'm here to help with:\n\n📌 **Platform Features** - Orders, payments, shipping, accounts\n📌 **Crop Management** - Growing tips, pest control, disease management\n📌 **Market Intelligence** - Price trends, buyer connections, trading\n📌 **Weather & Climate** - Forecasts, irrigation planning, seasonal guidance\n📌 **Soil & Fertilizers** - Soil testing, nutrient management\n📌 **Water Management** - Irrigation strategies, water conservation\n📌 **Quality & Verification** - Product quality, blockchain trace\n\nWhat would you like help with today?`;
    }

    // General knowledge responses
    if (lowerInput.includes('machine learning') || lowerInput.includes('ai') || lowerInput.includes('artificial intelligence')) {
      return `🤖 **AI & Machine Learning**\n\nMachine Learning and AI are transforming agriculture:\n\n• AI helps predict crop diseases early\n• Machine learning optimizes irrigation schedules\n• Computer vision detects pests automatically\n• Predictive analytics forecast market prices\n• AI-powered tools improve farm efficiency\n\nWould you like to know how AI can help your farm?`;
    }

    // Default intelligent response
    return `Thank you for your question: "${input}"\n\nI'm AgriVoice, your smart farming assistant. I can help you with:\n\n**Platform Features:**\n• Orders, payments, shipping, accounts\n• Quality verification, reputation system\n• Blockchain transparency\n\n**Farming & Agriculture:**\n• Crop management and techniques\n• Market prices and trading\n• Weather forecasts and planning\n• Pest and disease management\n• Soil health and fertilization\n• Water and irrigation management\n\nWhat would you like to know more about?`;
  }

  /**
   * Generate response based on chat input (fallback)
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Clear old sessions (optional cleanup)
   */
  clearOldSessions(): void {
    // This is a simple implementation - in production, use a database
    if (this.sessionContexts.size > 100) {
      this.sessionContexts.clear();
    }
  }
}
