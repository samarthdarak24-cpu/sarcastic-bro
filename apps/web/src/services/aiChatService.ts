import api from './api';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: any[];
}

export interface ChatResponse {
  success: boolean;
  response: string;
  intent?: string;
  suggestions?: string[];
  confidence?: number;
  actions?: any[];
}

export interface UserContext {
  name?: string;
  location?: string;
  products?: string[];
  role?: 'FARMER' | 'BUYER';
}

class AIChatService {
  private conversationHistory: ChatMessage[] = [];
  private readonly maxHistoryLength = 20;

  /**
   * Call Gemini via Next.js server-side API route (avoids CORS)
   */
  private async callGeminiDirect(message: string, userContext?: UserContext): Promise<ChatResponse> {
    const chatHistory = this.conversationHistory.slice(-6).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      text: msg.content
    }));

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        agentType: 'default',
        chatHistory
      })
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Gemini API error');
    }

    return {
      success: true,
      response: data.response,
      suggestions: [
        'What crops should I grow?',
        'Current market prices',
        'How to control pests?',
        'Best fertilizer?'
      ],
      confidence: 0.95
    };
  }

  /**
   * Send message to AI and get response
   */
  async sendMessage(message: string, userContext?: UserContext): Promise<ChatResponse> {
    try {
      // Add user message to history
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      this.conversationHistory.push(userMessage);

      // 1. Try Gemini API directly (fastest, most reliable)
      try {
        const geminiResponse = await this.callGeminiDirect(message, userContext);
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: geminiResponse.response,
          timestamp: new Date()
        };
        this.conversationHistory.push(assistantMessage);
        return geminiResponse;
      } catch (geminiError) {
        console.log('Gemini direct call failed, trying backend...', geminiError);
      }

      // 2. Try backend AI chat
      try {
        const response = await api.post('/ai-chat/chat', {
          message,
          conversationHistory: this.conversationHistory.slice(-10),
          userContext,
          stream: false
        });
        
        if (response.data.success) {
          const aiResponse = response.data;
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: aiResponse.response,
            timestamp: new Date(),
            actions: aiResponse.actions
          };
          this.conversationHistory.push(assistantMessage);
          return {
            success: true,
            response: aiResponse.response,
            suggestions: aiResponse.suggestions,
            confidence: aiResponse.confidence || 0.95,
            actions: aiResponse.actions
          };
        }
      } catch (aiError) {
        console.log('Backend AI chat failed, using fallback...');
      }

      // 3. Fallback to built-in responses
      const fallbackResponse = this.getFallbackResponse(message, userContext);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fallbackResponse.response,
        timestamp: new Date()
      };
      this.conversationHistory.push(assistantMessage);
      return fallbackResponse;

    } catch (error: any) {
      console.error('AI Chat Error:', error);
      const fallbackResponse = this.getFallbackResponse(message, userContext);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: fallbackResponse.response,
        timestamp: new Date()
      };
      this.conversationHistory.push(assistantMessage);
      return fallbackResponse;
    }
  }

  /**
   * Get streaming response (for real-time chat)
   */
  async sendMessageStream(
    message: string, 
    userContext?: UserContext,
    onChunk?: (chunk: string) => void,
    onComplete?: (response: ChatResponse) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      // Add user message to history
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      this.conversationHistory.push(userMessage);

      const requestData = {
        message,
        conversationHistory: this.conversationHistory.slice(-10),
        userContext,
        stream: true
      };

      // Try super AI streaming first
      try {
        const response = await fetch('/api/ai-chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(requestData)
        });

        if (response.ok) {
          const reader = response.body?.getReader();
          if (reader) {
            let fullResponse = '';
            const decoder = new TextDecoder();

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.substring(6);
                  if (data.trim()) {
                    try {
                      const parsedData = JSON.parse(data);
                      if (parsedData.type === 'content') {
                        fullResponse += parsedData.content;
                        onChunk?.(parsedData.content);
                      } else if (parsedData.type === 'done') {
                        const assistantMessage: ChatMessage = {
                          role: 'assistant',
                          content: fullResponse,
                          timestamp: new Date()
                        };
                        this.conversationHistory.push(assistantMessage);
                        
                        onComplete?.({
                          success: true,
                          response: fullResponse,
                          suggestions: parsedData.suggestions
                        });
                        return;
                      } else if (parsedData.type === 'error') {
                        onError?.(parsedData.message || 'Stream error');
                        return;
                      }
                    } catch (e) {
                      // Ignore parse errors
                    }
                  }
                }
              }
            }
          }
        }
      } catch (streamError) {
        console.log('Streaming not available, using regular response...');
      }

      // Fallback to regular response
      const response = await this.sendMessage(message, userContext);
      onComplete?.(response);

    } catch (error: any) {
      console.error('Stream error:', error);
      onError?.(error.message || 'Failed to get AI response');
    }
  }

  /**
   * Get suggestions for quick actions
   */
  async getSuggestions(): Promise<string[]> {
    try {
      const response = await api.get('/ai-chat/suggestions');
      return response.data.data?.suggestions || this.getDefaultSuggestions();
    } catch (error) {
      return this.getDefaultSuggestions();
    }
  }

  /**
   * Clear conversation history
   */
  async clearHistory(): Promise<void> {
    try {
      await api.delete('/ai-chat/history');
    } catch (error) {
      console.log('Failed to clear server history');
    }
    
    this.conversationHistory = [];
    this.removeHistoryFromStorage();
  }

  /**
   * Get conversation history
   */
  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Save history to localStorage
   */
  saveHistoryToStorage(userId: string): void {
    try {
      const key = `ai_chat_history_${userId}`;
      localStorage.setItem(key, JSON.stringify(this.conversationHistory));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  /**
   * Load history from localStorage
   */
  loadHistoryFromStorage(userId: string): void {
    try {
      const key = `ai_chat_history_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const history = JSON.parse(stored);
        this.conversationHistory = history.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      this.conversationHistory = [];
    }
  }

  /**
   * Remove history from localStorage
   */
  private removeHistoryFromStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('ai_chat_history_'));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to remove chat history:', error);
    }
  }

  /**
   * Get fallback response when AI is not available
   */
  private getFallbackResponse(message: string, userContext?: UserContext): ChatResponse {
    const lowerMessage = message.toLowerCase();
    
    // Price-related queries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('भाव')) {
      return {
        success: true,
        response: `I understand you're asking about prices. Here's what I can help with:

🔍 **Current Market Trends:**
- Tomatoes: ₹40-50/kg (Rising trend)
- Onions: ₹25-35/kg (Stable)
- Potatoes: ₹20-30/kg (Slight decline)

💡 **Price Optimization Tips:**
- Check multiple mandis for best rates
- Consider direct buyer connections
- Monitor seasonal demand patterns

Would you like specific price information for your crops?`,
        suggestions: [
          'Show me tomato prices',
          'Find buyers for my crops',
          'Market trends this week',
          'Best time to sell'
        ]
      };
    }

    // Crop recommendations
    if (lowerMessage.includes('crop') || lowerMessage.includes('grow') || lowerMessage.includes('plant')) {
      return {
        success: true,
        response: `🌱 **Crop Recommendations for ${userContext?.location || 'your area'}:**

**Current Season (${this.getCurrentSeason()}):**
- **High Demand:** Tomatoes, Onions, Leafy Greens
- **Good Prices:** Cauliflower, Cabbage, Carrots
- **Export Potential:** Organic vegetables, Herbs

**Factors to Consider:**
- Soil type and pH levels
- Water availability
- Market demand in your region
- Your farming experience

Would you like specific recommendations based on your soil type?`,
        suggestions: [
          'Best crops for my soil',
          'High-profit vegetables',
          'Seasonal crop calendar',
          'Organic farming tips'
        ]
      };
    }

    // Quality and pest issues
    if (lowerMessage.includes('quality') || lowerMessage.includes('pest') || lowerMessage.includes('disease')) {
      return {
        success: true,
        response: `🔍 **Crop Quality & Health Management:**

**Common Quality Issues:**
- Pest damage (aphids, caterpillars)
- Fungal diseases (blight, rust)
- Nutrient deficiencies
- Weather stress

**Quick Solutions:**
- Regular field monitoring
- Integrated pest management
- Proper nutrition schedule
- Timely harvesting

**Quality Improvement Tips:**
- Use certified seeds
- Follow proper spacing
- Maintain soil health
- Post-harvest handling

Would you like specific advice for your crops?`,
        suggestions: [
          'Identify pest problems',
          'Improve crop quality',
          'Organic pest control',
          'Disease prevention'
        ]
      };
    }

    // Buyer/seller connections
    if (lowerMessage.includes('buyer') || lowerMessage.includes('sell') || lowerMessage.includes('market')) {
      return {
        success: true,
        response: `🤝 **Connect with Buyers & Markets:**

**Finding Buyers:**
- Local mandis and APMCs
- Direct buyer networks
- Export companies
- Processing units

**Selling Strategies:**
- Grade your produce properly
- Package attractively
- Build long-term relationships
- Negotiate fair prices

**Market Channels:**
- Wholesale markets
- Retail chains
- Online platforms
- Farmer producer organizations

Would you like help connecting with specific buyers?`,
        suggestions: [
          'Find tomato buyers',
          'Export opportunities',
          'Local market rates',
          'Bulk order requests'
        ]
      };
    }

    // Default response
    return {
      success: true,
      response: `Hello! I'm your AI farming assistant. 🌾

I can help you with:
- **Market Prices** - Current rates and trends
- **Crop Advice** - What to grow and when
- **Quality Tips** - Improve your harvest
- **Buyer Connections** - Find the right markets
- **Pest Management** - Identify and treat issues
- **Weather Guidance** - Farming based on weather

What would you like to know about farming today?`,
      suggestions: this.getDefaultSuggestions()
    };
  }

  /**
   * Get default suggestions based on user role
   */
  private getDefaultSuggestions(): string[] {
    return [
      'What crops should I grow this season?',
      'Current market prices in my area',
      'How to improve crop quality?',
      'Find buyers for my produce',
      'Pest control recommendations',
      'Weather-based farming advice'
    ];
  }

  /**
   * Get current season
   */
  private getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;
    if (month >= 4 && month <= 6) return 'Summer/Zaid';
    if (month >= 7 && month <= 10) return 'Monsoon/Kharif';
    return 'Winter/Rabi';
  }

  /**
   * Trim conversation history to prevent memory issues
   */
  private trimHistory(): void {
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
    }
  }
}

// Export singleton instance
export const chatService = new AIChatService();
export default chatService;