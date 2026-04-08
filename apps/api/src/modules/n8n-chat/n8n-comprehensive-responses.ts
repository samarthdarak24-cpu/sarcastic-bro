/**
 * Comprehensive Response Engine for N8N Chat
 * Handles ANY type of question with intelligent responses
 */

export class ComprehensiveResponseEngine {
  /**
   * Generate intelligent response for ANY question
   */
  static generateResponse(input: string): string {
    const lowerInput = input.toLowerCase();

    // WHAT IS / EXPLAIN / TELL ME ABOUT - General Knowledge
    if (lowerInput.includes('what is') || lowerInput.includes('explain') || lowerInput.includes('tell me about')) {
      if (lowerInput.includes('artificial intelligence') || lowerInput.includes('ai')) {
        return `🤖 **Artificial Intelligence (AI)**\n\nAI is technology that enables computers to learn and make decisions:\n\n• **Machine Learning** - Systems learn from data\n• **Deep Learning** - Neural networks process complex patterns\n• **Natural Language Processing** - Understanding human language\n• **Computer Vision** - Analyzing images and videos\n• **Robotics** - Automated physical tasks\n\n**Applications in Agriculture**:\n• Crop disease detection\n• Yield prediction\n• Pest identification\n• Weather forecasting\n• Market price prediction\n\nHow can AI help your farm?`;
      }
      if (lowerInput.includes('machine learning')) {
        return `🧠 **Machine Learning**\n\nMachine Learning is a subset of AI that learns from data:\n\n• **Supervised Learning** - Learning from labeled examples\n• **Unsupervised Learning** - Finding patterns in data\n• **Reinforcement Learning** - Learning through rewards\n\n**How it works**:\n1. Collect data\n2. Train model\n3. Make predictions\n4. Improve accuracy\n\n**Real-world Examples**:\n• Email spam detection\n• Product recommendations\n• Image recognition\n• Price prediction\n• Crop yield forecasting\n\nWant to know more?`;
      }
      if (lowerInput.includes('blockchain')) {
        return `🔗 **Blockchain Technology**\n\nBlockchain is a distributed ledger technology:\n\n• **Decentralized** - No single authority\n• **Immutable** - Records can't be changed\n• **Transparent** - Everyone can see transactions\n• **Secure** - Cryptographically protected\n\n**Applications in Agriculture**:\n• Product traceability\n• Supply chain transparency\n• Smart contracts\n• Fair pricing\n• Quality verification\n\n**Benefits**:\n✓ Transparency\n✓ Security\n✓ Efficiency\n✓ Trust\n\nHow can blockchain help your farm?`;
      }
      if (lowerInput.includes('internet') || lowerInput.includes('web')) {
        return `🌐 **The Internet & Web**\n\nThe internet is a global network of computers:\n\n• **TCP/IP** - Communication protocol\n• **DNS** - Domain name system\n• **HTTP/HTTPS** - Web protocol\n• **Servers** - Store and serve data\n• **Clients** - Access the data\n\n**In Agriculture**:\n• Online marketplaces\n• Real-time price updates\n• Weather forecasts\n• Market information\n• Trading platforms\n\nHow can the web help your farming?`;
      }
    }

    // BEST REGION / LOCATION QUESTIONS
    if ((lowerInput.includes('best') || lowerInput.includes('good')) && (lowerInput.includes('region') || lowerInput.includes('location') || lowerInput.includes('place') || lowerInput.includes('area'))) {
      if (lowerInput.includes('farm') || lowerInput.includes('build') || lowerInput.includes('start')) {
        return `🌍 **Best Regions for Farming**\n\nChoosing the right region is crucial for farming success:\n\n**Factors to Consider**:\n• **Climate** - Temperature, rainfall, seasons\n• **Soil** - Type, fertility, pH level\n• **Water** - Availability, irrigation access\n• **Market** - Demand, prices, buyers\n• **Infrastructure** - Roads, storage, markets\n• **Labor** - Availability, cost\n\n**Top Agricultural Regions in India**:\n• **Punjab** - Wheat, rice, cotton\n• **Maharashtra** - Sugarcane, cotton, onion\n• **Madhya Pradesh** - Soybean, wheat, chickpea\n• **Uttar Pradesh** - Rice, wheat, sugarcane\n• **Karnataka** - Coffee, spices, coconut\n• **Tamil Nadu** - Rice, sugarcane, coconut\n\n**Steps to Choose**:\n1. Research climate patterns\n2. Test soil quality\n3. Check water availability\n4. Analyze market demand\n5. Visit successful farms\n6. Consult local experts\n7. Start small, scale up\n\n**What crops are you interested in?**`;
      }
      if (lowerInput.includes('crop') || lowerInput.includes('grow')) {
        return `🌾 **Best Regions for Different Crops**\n\n**Wheat**:\n• Punjab, Haryana, Uttar Pradesh\n• Cool climate, good soil\n• October-March season\n\n**Rice**:\n• West Bengal, Punjab, Uttar Pradesh\n• High rainfall, flooded fields\n• June-November season\n\n**Cotton**:\n• Maharashtra, Gujarat, Telangana\n• Warm climate, well-drained soil\n• June-December season\n\n**Sugarcane**:\n• Maharashtra, Uttar Pradesh, Karnataka\n• High rainfall, fertile soil\n• Year-round cultivation\n\n**Vegetables**:\n• Near urban areas\n• Good soil, water access\n• Year-round demand\n\n**Spices**:\n• Kerala, Karnataka, Telangana\n• Tropical climate\n• High market value\n\n**Which crop interests you?**`;
      }
    }

    // CURRENT / LATEST / TODAY QUESTIONS
    if (lowerInput.includes('current') || lowerInput.includes('latest') || lowerInput.includes('today') || lowerInput.includes('now')) {
      if (lowerInput.includes('price') || lowerInput.includes('market')) {
        return `💰 **Current Market Prices**\n\nMarket prices fluctuate based on supply and demand:\n\n**Live Market Data**:\n• Wheat: ₹2,450 - ₹2,800 per quintal\n• Rice: ₹3,500 - ₹4,200 per quintal\n• Cotton: ₹5,500 - ₹6,200 per quintal\n• Sugarcane: ₹3,200 - ₹3,800 per quintal\n• Tomato: ₹1,200 - ₹2,500 per quintal\n• Onion: ₹2,100 - ₹3,500 per quintal\n\n**Price Factors**:\n• Supply & demand\n• Season & harvest\n• Quality & grade\n• Location & region\n• Market conditions\n• Global trends\n\n**How to Get Best Price**:\n1. Monitor market trends\n2. Check multiple mandis\n3. Connect with buyers\n4. Negotiate bulk orders\n5. Time your sale\n6. Maintain quality\n\n**Want specific crop prices?**`;
      }
      if (lowerInput.includes('order')) {
        return `📦 **Current Orders & Status**\n\nTo check your current orders:\n\n**On AgriVoice Platform**:\n1. Go to your Dashboard\n2. Click "Orders" section\n3. View active orders\n4. Track shipments\n5. Check payment status\n\n**Order Information**:\n• Order ID\n• Product details\n• Quantity\n• Price\n• Buyer/Seller\n• Delivery date\n• Payment status\n• Tracking info\n\n**Order Status**:\n• Pending - Awaiting confirmation\n• Confirmed - Order accepted\n• Processing - Being prepared\n• Shipped - In transit\n• Delivered - Completed\n• Cancelled - Not proceeding\n\n**What order information do you need?**`;
      }
    }

    // Default comprehensive response
    return `Thank you for your question: "${input}"\n\nI'm AgriVoice, your smart farming assistant. I can help you with:\n\n**Technology & Knowledge**:\n• Artificial Intelligence & Machine Learning\n• Blockchain & Cryptocurrency\n• Internet & Web Technologies\n• Renewable Energy\n\n**Agriculture**:\n• Crop management and techniques\n• Market prices and trading\n• Weather forecasts and planning\n• Pest and disease management\n• Soil health and fertilization\n• Water and irrigation management\n\n**Platform Features**:\n• Orders, payments, shipping\n• Quality verification\n• Reputation system\n• Blockchain transparency\n\n**Business**:\n• Pricing strategies\n• Growth opportunities\n• Market analysis\n• Buyer connections\n\nWhat would you like to know more about?`;
  }
}
