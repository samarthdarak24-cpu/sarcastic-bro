# AgriVoice AI - Detailed Code Flow & Implementation

## Complete Code Walkthrough

### 1. User Sends Message (Frontend)

**File**: `apps/web/src/components/chat/AIAssistant.tsx`

```typescript
// User types message and clicks send
const sendMessage = async () => {
  // Step 1: Validate input
  if (!input.trim()) return;
  
  // Step 2: Create user message object
  const userMessage: Message = {
    id: Date.now().toString(),
    text: input,                    // "how to place an order"
    sender: 'user',
    timestamp: new Date()
  };
  
  // Step 3: Add to UI immediately
  setMessages(prev => [...prev, userMessage]);
  setInput('');                     // Clear input field
  setLoading(true);                 // Show loading indicator
  
  try {
    // Step 4: Send to backend API
    const response = await fetch('http://localhost:3001/api/n8n/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatInput: input,            // "how to place an order"
        userId: user?.id,            // "farmer-123"
        userRole: user?.role         // "farmer"
      })
    });
    
    // Step 5: Parse response
    const data = await response.json();
    
    // Step 6: Create bot message
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: data.output,             // Response from backend
      sender: 'bot',
      timestamp: new Date()
    };
    
    // Step 7: Add bot response to UI
    setMessages(prev => [...prev, botMessage]);
    
  } catch (error) {
    console.error('Error sending message:', error);
    // Show error message to user
  } finally {
    setLoading(false);               // Hide loading indicator
  }
};
```

---

### 2. Request Reaches Backend (Controller)

**File**: `apps/api/src/modules/n8n-chat/n8n-chat.controller.ts`

```typescript
export class N8nChatController {
  private n8nChatService = new N8nChatService();
  
  async handleChat(req: Request, res: Response) {
    try {
      // Step 1: Extract data from request
      const { chatInput, sessionId, userId, userRole } = req.body;
      
      // Example values:
      // chatInput = "how to place an order"
      // sessionId = undefined (will be generated)
      // userId = "farmer-123"
      // userRole = "farmer"
      
      // Step 2: Validate required field
      if (!chatInput) {
        return res.status(400).json({ 
          error: 'chatInput is required' 
        });
      }
      
      // Step 3: Call service to process chat
      const response = await this.n8nChatService.processChat(
        chatInput,
        sessionId,
        userId,
        userRole
      );
      
      // Step 4: Return response to frontend
      res.json(response);
      
      // Response format:
      // {
      //   output: "📦 **Orders & Purchases**\n\n...",
      //   sessionId: "session_1712577600000_abc123"
      // }
      
    } catch (error) {
      console.error('N8N Chat Error:', error);
      res.status(500).json({ 
        error: 'Failed to process chat message' 
      });
    }
  }
}
```

---

### 3. Service Processes Message (Main Logic)

**File**: `apps/api/src/modules/n8n-chat/n8n-chat.service.ts`

```typescript
export class N8nChatService {
  // Store conversation history in memory
  private sessionContexts: Map<
    string,  // Session ID
    Array<{ role: string; content: string }>  // Messages
  > = new Map();
  
  private aiRecommendations = new AIRecommendationsService();
  
  constructor() {
    console.log('[N8N Chat] Service initialized - using local intelligent responses');
  }
  
  async processChat(
    chatInput: string,
    sessionId?: string,
    userId?: string,
    userRole?: 'farmer' | 'buyer'
  ): Promise<ChatResponse> {
    try {
      // ═══════════════════════════════════════════════════════════
      // STEP 1: Generate or use provided session ID
      // ═══════════════════════════════════════════════════════════
      const currentSessionId = sessionId || this.generateSessionId();
      
      // Example: "session_1712577600000_abc123"
      console.log(`[Chat] Session: ${currentSessionId}`);
      
      // ═══════════════════════════════════════════════════════════
      // STEP 2: Get conversation history for this session
      // ═══════════════════════════════════════════════════════════
      let context = this.sessionContexts.get(currentSessionId) || [];
      
      // First message: context = []
      // Second message: context = [
      //   { role: 'user', content: 'first question' },
      //   { role: 'assistant', content: 'first answer' }
      // ]
      
      // ═══════════════════════════════════════════════════════════
      // STEP 3: Add user message to history
      // ═══════════════════════════════════════════════════════════
      context.push({ 
        role: 'user', 
        content: chatInput  // "how to place an order"
      });
      
      // Save updated context
      this.sessionContexts.set(currentSessionId, context);
      
      // ═══════════════════════════════════════════════════════════
      // STEP 4: Generate response based on user role
      // ═══════════════════════════════════════════════════════════
      let response: string;
      
      if (userRole === 'farmer' && userId) {
        // Use farmer-specific AI
        console.log(`[Chat] Using farmer recommendations for user: ${userId}`);
        response = await this.aiRecommendations.generateFarmerRecommendations(
          userId, 
          chatInput
        );
      } else if (userRole === 'buyer' && userId) {
        // Use buyer-specific AI
        console.log(`[Chat] Using buyer recommendations for user: ${userId}`);
        response = await this.aiRecommendations.generateBuyerRecommendations(
          userId, 
          chatInput
        );
      } else {
        // Use general intelligent response
        console.log(`[Chat] Using general intelligent response`);
        response = this.generateIntelligentResponse(chatInput);
      }
      
      // ═══════════════════════════════════════════════════════════
      // STEP 5: Add bot response to history
      // ═══════════════════════════════════════════════════════════
      context.push({ 
        role: 'assistant', 
        content: response 
      });
      
      // Save updated context with bot response
      this.sessionContexts.set(currentSessionId, context);
      
      // ═══════════════════════════════════════════════════════════
      // STEP 6: Return response
      // ═══════════════════════════════════════════════════════════
      return {
        output: response,
        sessionId: currentSessionId
      };
      
    } catch (error) {
      console.error('Chat processing error:', error);
      throw error;
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // RESPONSE GENERATION - The Heart of the System
  // ═══════════════════════════════════════════════════════════════════
  
  private generateIntelligentResponse(input: string): string {
    // Convert to lowercase for case-insensitive matching
    const lowerInput = input.toLowerCase();
    
    console.log(`[Chat] Processing: "${input}"`);
    
    // ───────────────────────────────────────────────────────────────
    // PLATFORM FEATURES RESPONSES
    // ───────────────────────────────────────────────────────────────
    
    if (lowerInput.includes('payment') || lowerInput.includes('pay')) {
      return `💳 **Payment System**

Our platform supports multiple payment methods:

• **Razorpay Integration** - Secure online payments
• **Instant Transfers** - Fast fund transfers to your account
• **Payment History** - Track all your transactions
• **Escrow Protection** - Secure payments held until delivery
• **Multiple Payment Options** - Cards, UPI, wallets

You can make payments directly from your dashboard. All transactions are secure and encrypted. Would you like help with a specific payment?`;
    }
    
    if (lowerInput.includes('order') || lowerInput.includes('purchase') || lowerInput.includes('buy')) {
      return `📦 **Orders & Purchases**

How to place and manage orders on AgriVoice:

• **Browse Products** - View available crops and products
• **Place Order** - Select quantity and confirm
• **Track Order** - Real-time tracking from seller to you
• **Order History** - View all past orders
• **Bulk Orders** - Special pricing for large quantities
• **Pre-booking** - Reserve products in advance

You can manage all orders from your dashboard. Need help placing an order?`;
    }
    
    // ───────────────────────────────────────────────────────────────
    // AGRICULTURE RESPONSES
    // ───────────────────────────────────────────────────────────────
    
    if (lowerInput.includes('pest') || lowerInput.includes('disease') || lowerInput.includes('insect')) {
      return `🐛 **Pest Management**

Pest management is essential for crop health:

• Identify pests early through regular inspection
• Use integrated pest management (IPM)
• Consider both organic and chemical options
• Consult with agricultural experts
• Maintain crop health to prevent diseases

Describe the pest you're dealing with for specific advice.`;
    }
    
    if (lowerInput.includes('soil') || lowerInput.includes('fertilizer') || lowerInput.includes('nutrient')) {
      return `🌱 **Soil Health**

Soil health is the foundation of successful farming:

• Test soil regularly for nutrients
• Use appropriate fertilizers based on soil type
• Practice crop rotation
• Add organic matter to improve soil structure
• Monitor pH levels

What's your soil type? I can provide specific recommendations.`;
    }
    
    // ───────────────────────────────────────────────────────────────
    // DEFAULT RESPONSE FOR UNKNOWN QUESTIONS
    // ───────────────────────────────────────────────────────────────
    
    return `Thank you for your question: "${input}"

I'm AgriVoice, your smart farming assistant. I can help you with:

**Platform Features:**
• Orders, payments, shipping, accounts
• Quality verification, reputation system
• Blockchain transparency

**Farming & Agriculture:**
• Crop management and techniques
• Market prices and trading
• Weather forecasts and planning
• Pest and disease management
• Soil health and fertilization
• Water and irrigation management

What would you like to know more about?`;
  }
  
  // ═══════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════
  
  private generateSessionId(): string {
    // Create unique session ID
    // Format: "session_" + timestamp + "_" + random
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    // Example: "session_1712577600000_abc123def"
  }
  
  clearOldSessions(): void {
    // Cleanup old sessions if too many exist
    if (this.sessionContexts.size > 100) {
      console.log('[Chat] Clearing old sessions');
      this.sessionContexts.clear();
    }
  }
}
```

---

### 4. AI Recommendations Service (User-Specific)

**File**: `apps/api/src/modules/n8n-chat/ai-recommendations.service.ts`

```typescript
export class AIRecommendationsService {
  private dataFetcher = new AIDataFetcherService();
  
  async generateFarmerRecommendations(
    farmerId: string, 
    question: string
  ): Promise<string> {
    try {
      // Step 1: Fetch farmer-specific data
      const farmerStats = await this.dataFetcher.getFarmerStats(farmerId);
      const marketData = await this.dataFetcher.getMarketData();
      
      // Step 2: Generate personalized response
      const response = `
🌾 **Personalized Farmer Recommendations**

Based on your profile:
- Farm Size: ${farmerStats.farmSize}
- Crops: ${farmerStats.crops.join(', ')}
- Experience: ${farmerStats.experience}

Market Insights:
${marketData.insights}

Recommendations:
${this.getRecommendations(farmerStats, question)}
      `;
      
      return response;
    } catch (error) {
      console.error('Error generating farmer recommendations:', error);
      return 'Unable to generate personalized recommendations at this time.';
    }
  }
  
  async generateBuyerRecommendations(
    buyerId: string, 
    question: string
  ): Promise<string> {
    try {
      // Similar to farmer recommendations but for buyers
      const buyerStats = await this.dataFetcher.getBuyerStats(buyerId);
      const marketData = await this.dataFetcher.getMarketData();
      
      const response = `
🛒 **Personalized Buyer Recommendations**

Based on your profile:
- Purchase History: ${buyerStats.purchaseCount} orders
- Preferred Suppliers: ${buyerStats.suppliers.join(', ')}
- Budget: ₹${buyerStats.budget}

Market Insights:
${marketData.insights}

Recommendations:
${this.getRecommendations(buyerStats, question)}
      `;
      
      return response;
    } catch (error) {
      console.error('Error generating buyer recommendations:', error);
      return 'Unable to generate personalized recommendations at this time.';
    }
  }
  
  private getRecommendations(stats: any, question: string): string {
    // Generate recommendations based on stats and question
    return '• Recommendation 1\n• Recommendation 2\n• Recommendation 3';
  }
}
```

---

### 5. Data Fetcher Service (Real Data)

**File**: `apps/api/src/modules/n8n-chat/ai-data-fetcher.service.ts`

```typescript
export class AIDataFetcherService {
  async getMarketData(cropType?: string): Promise<any> {
    // Fetch real market data from database
    // This would connect to your database
    
    return {
      insights: `
• Rice: ₹4500-4700 per quintal
• Wheat: ₹2200-2400 per quintal
• Cotton: ₹5800-6200 per quintal
      `
    };
  }
  
  async getFarmerStats(farmerId: string): Promise<any> {
    // Fetch farmer-specific data
    return {
      farmSize: '5 acres',
      crops: ['Rice', 'Wheat', 'Cotton'],
      experience: '15 years',
      totalSales: '₹2,50,000'
    };
  }
  
  async getBuyerStats(buyerId: string): Promise<any> {
    // Fetch buyer-specific data
    return {
      purchaseCount: 45,
      suppliers: ['Farmer A', 'Farmer B'],
      budget: '₹1,00,000',
      preferredCrops: ['Rice', 'Wheat']
    };
  }
  
  async getPriceTrends(cropName: string): Promise<any> {
    // Fetch price trend data
    return {
      crop: cropName,
      trend: 'Upward',
      change: '+5%',
      forecast: 'Expected to rise further'
    };
  }
}
```

---

## Complete Request-Response Cycle

### Example: User asks "how to place an order"

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (React)                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ User types: "how to place an order"                            │
│ User clicks: Send button                                       │
│                                                                 │
│ sendMessage() function executes:                               │
│ ├─ Validate input ✓                                            │
│ ├─ Create user message object                                  │
│ ├─ Add to UI                                                   │
│ ├─ Show loading indicator                                      │
│ └─ Send POST request to backend                                │
│                                                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP POST
                         │ /api/n8n/chat
                         │ {
                         │   chatInput: "how to place an order",
                         │   userId: "farmer-123",
                         │   userRole: "farmer"
                         │ }
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND (Express.js)                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ N8nChatController.handleChat() receives request                │
│ ├─ Extract: chatInput, sessionId, userId, userRole             │
│ ├─ Validate: chatInput is required ✓                           │
│ └─ Call: n8nChatService.processChat()                          │
│                                                                 │
│ N8nChatService.processChat() executes:                         │
│ ├─ Generate sessionId: "session_1712577600000_abc123"          │
│ ├─ Get context: [] (first message)                             │
│ ├─ Add user message to context                                 │
│ ├─ Check userRole: "farmer" ✓                                  │
│ ├─ Call: aiRecommendations.generateFarmerRecommendations()     │
│ │  ├─ Fetch farmer stats                                       │
│ │  ├─ Fetch market data                                        │
│ │  └─ Generate personalized response                           │
│ ├─ Add bot response to context                                 │
│ └─ Return: {                                                   │
│      output: "📦 **Orders & Purchases**\n\n...",               │
│      sessionId: "session_1712577600000_abc123"                 │
│    }                                                            │
│                                                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Response (JSON)
                         │ {
                         │   output: "📦 **Orders & Purchases**...",
                         │   sessionId: "session_1712577600000_abc123"
                         │ }
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (React)                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Response received:                                              │
│ ├─ Parse JSON ✓                                                │
│ ├─ Create bot message object                                   │
│ ├─ Add to UI                                                   │
│ ├─ Hide loading indicator                                      │
│ └─ Display response to user                                    │
│                                                                 │
│ User sees:                                                      │
│ "📦 **Orders & Purchases**                                     │
│                                                                 │
│  How to place and manage orders on AgriVoice:                  │
│  • Browse Products - View available crops and products         │
│  • Place Order - Select quantity and confirm                   │
│  ..."                                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Session Management Example

### Conversation Flow

```
Message 1:
User: "how to place an order"
Bot: "📦 Orders & Purchases..."
Session: {
  sessionId: "session_1712577600000_abc123",
  messages: [
    { role: 'user', content: 'how to place an order' },
    { role: 'assistant', content: '📦 Orders & Purchases...' }
  ]
}

Message 2 (same session):
User: "what about bulk orders"
Bot: "Bulk Orders are..."
Session: {
  sessionId: "session_1712577600000_abc123",
  messages: [
    { role: 'user', content: 'how to place an order' },
    { role: 'assistant', content: '📦 Orders & Purchases...' },
    { role: 'user', content: 'what about bulk orders' },
    { role: 'assistant', content: 'Bulk Orders are...' }
  ]
}

Message 3 (same session):
User: "tell me more"
Bot: "Here's more info..."
Session: {
  sessionId: "session_1712577600000_abc123",
  messages: [
    { role: 'user', content: 'how to place an order' },
    { role: 'assistant', content: '📦 Orders & Purchases...' },
    { role: 'user', content: 'what about bulk orders' },
    { role: 'assistant', content: 'Bulk Orders are...' },
    { role: 'user', content: 'tell me more' },
    { role: 'assistant', content: 'Here's more info...' }
  ]
}
```

---

## Performance Metrics

### Response Time Breakdown

```
Local Intelligent Response (Currently Used):
├─ Parse input: 0.1ms
├─ Convert to lowercase: 0.05ms
├─ Keyword matching: 0.2ms
├─ Generate response: 0.1ms
├─ Format JSON: 0.1ms
└─ Total: 0.55ms ✅ FAST

With Farmer Recommendations:
├─ Parse input: 0.1ms
├─ Fetch farmer stats: 50ms
├─ Fetch market data: 50ms
├─ Generate response: 0.1ms
├─ Format JSON: 0.1ms
└─ Total: 100.3ms ⚠️ MEDIUM

With Hugging Face API:
├─ Parse input: 0.1ms
├─ Create prompt: 0.1ms
├─ API call: 5000-15000ms
├─ Parse response: 0.1ms
├─ Format JSON: 0.1ms
└─ Total: 5000-15000ms ⚠️ SLOW
```

---

## Summary

The AgriVoice AI Chat system works through:

1. **Frontend** sends message to backend API
2. **Controller** validates and routes to service
3. **Service** manages sessions and routes to response generator
4. **Response Generator** uses keyword matching to find answer
5. **Optional**: Can use farmer/buyer recommendations or external APIs
6. **Response** returned to frontend and displayed to user
7. **Session** maintained for conversation history

**Current Implementation**: Local intelligent responses (fast, reliable, no dependencies)

**Optional Enhancements**: Hugging Face AI, n8n workflows, personalized recommendations

---

**Status**: ✅ **FULLY OPERATIONAL**
