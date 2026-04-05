import api from './api';
import { ChatMessage, ChatAPIResponse, QuickAction } from '@/types/chat';

export interface SendMessageParams {
  message: string;
  conversationHistory?: ChatMessage[];
  userContext?: {
    userId?: string;
    name?: string;
    userType?: 'FARMER' | 'BUYER';
    location?: string;
    currentPage?: string;
    products?: string[];
  };
}

export interface ChatWidgetResponse {
  response: string;
  suggestions: string[];
  intent: string;
  confidence: number;
  actions: QuickAction[];
}

export type StreamChunk = 
  | { type: 'metadata'; intent: string; confidence: number; suggestions: string[] }
  | { type: 'content'; content: string }
  | { type: 'done' }
  | { type: 'error'; error: string; message: string };

export const chatWidgetService = {
  async sendMessage(params: SendMessageParams): Promise<ChatWidgetResponse> {
    const maxRetries = 3;
    const retryDelays = [1000, 2000, 4000];
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const { message, conversationHistory = [], userContext = {} } = params;

        const response = await api.post<{ success: boolean; data: ChatAPIResponse }>(
          '/ai/chat/message',
          {
            message,
            conversationHistory,
            userContext,
            stream: false,
          }
        );

        const responseData = response as unknown as { data: { success: boolean; data: ChatAPIResponse } };
        
        return {
          response: responseData.data.data.response,
          suggestions: responseData.data.data.suggestions || [],
          intent: responseData.data.data.intent || 'general',
          confidence: responseData.data.data.confidence || 0,
          actions: responseData.data.data.actions || [],
        };
      } catch (error: unknown) {
        const err = error as { status?: number; message?: string; response?: { data?: { error?: string } } };
        const isLastAttempt = attempt === maxRetries - 1;
        const isRetryableError = (err.status && err.status >= 500) || err.message?.includes('network') || err.message?.includes('timeout');
        
        if (!isLastAttempt && isRetryableError) {
          console.warn(`Chat API attempt ${attempt + 1} failed, retrying in ${retryDelays[attempt]}ms...`, err.message);
          await new Promise(resolve => setTimeout(resolve, retryDelays[attempt]));
          continue;
        }
        
        console.error('Chat widget service error (all retries exhausted):', error);
        return this.getIntelligentFallback(params.message, params.userContext);
      }
    }
    
    return this.getIntelligentFallback(params.message, params.userContext);
  },

  async *sendMessageStream(params: SendMessageParams): AsyncGenerator<StreamChunk, void, unknown> {
    try {
      const { message, conversationHistory = [], userContext = {} } = params;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/ai/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          message,
          conversationHistory,
          userContext,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: string; message?: string };
        
        if (response.status === 503 && errorData.error === 'API_KEY_MISSING') {
          yield {
            type: 'error',
            error: 'API_KEY_MISSING',
            message: 'AI service is not configured. Using fallback responses.',
          };
          return;
        }
        
        if (response.status === 429) {
          yield {
            type: 'error',
            error: 'RATE_LIMIT',
            message: 'Too many requests. Please wait a moment and try again.',
          };
          return;
        }
        
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line) as StreamChunk;
            yield data;
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      yield {
        type: 'error',
        error: 'CONNECTION_ERROR',
        message: 'Unable to connect to AI service. Using fallback response.',
      };
    }
  },

  getIntelligentFallback(message: string, userContext: Record<string, unknown> | undefined): ChatWidgetResponse {
    const messageLower = message.toLowerCase();
    const userType = (userContext?.userType as string) || 'FARMER';
    
    const intents: Record<string, string[]> = {
      price: ['price', 'rate', 'cost', 'selling', 'market price', 'how much'],
      quality: ['quality', 'grade', 'defect', 'inspect', 'analyze'],
      crop: ['crop', 'plant', 'grow', 'season', 'soil', 'recommend'],
      pest: ['pest', 'disease', 'insect', 'bug', 'infection'],
      buyer: ['buyer', 'sell', 'customer', 'order', 'purchase'],
      supplier: ['supplier', 'farmer', 'source', 'find', 'vendor'],
      weather: ['weather', 'rain', 'temperature', 'forecast'],
      market: ['trend', 'demand', 'market', 'forecast', 'prediction'],
    };

    let detectedIntent = 'general';
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        detectedIntent = intent;
        break;
      }
    }

    if (userType === 'FARMER') {
      return this.getFarmerResponse(detectedIntent, userContext);
    } else {
      return this.getBuyerResponse(detectedIntent, userContext);
    }
  },

  getFarmerResponse(intent: string, context: Record<string, unknown> | undefined): ChatWidgetResponse {
    const responses: Record<string, ChatWidgetResponse> = {
      price: {
        response: `💰 **Market Price Information**\n\nI can help you with pricing! Based on current market trends:\n\n• Premium quality crops fetch 15-20% higher rates\n• Regional variations affect pricing significantly\n• Demand is currently ${Math.random() > 0.5 ? 'high' : 'moderate'} for seasonal produce\n\nFor accurate pricing specific to your product, I recommend:\n1. Check the Price Advisor tool in your dashboard\n2. Compare prices across nearby markets\n3. Get AI-powered price predictions\n\nWould you like me to analyze your specific product?`,
        suggestions: [
          'Show me price trends',
          'Compare market prices',
          'Get price prediction',
          'Find best buyers'
        ],
        intent: 'price_inquiry',
        confidence: 0.85,
        actions: []
      },
      general: {
        response: `👋 Hello${context?.name ? ` ${context.name}` : ''}! I'm your AI farming assistant! 🌾\n\nI can help you with:\n\n💰 **Pricing & Market**\n• Current market prices\n• Price predictions\n• Market trends analysis\n\n📸 **Quality & Analysis**\n• Crop quality grading\n• Pest detection\n• Soil health analysis\n\n🌱 **Farming Advice**\n• Crop recommendations\n• Weather forecasts\n• Best practices\n\n🤝 **Business Growth**\n• Find buyers\n• Negotiate deals\n• Manage orders\n\nWhat would you like to know?`,
        suggestions: [
          'Check market prices',
          'Analyze crop quality',
          'Find buyers',
          'Get crop advice'
        ],
        intent: 'general',
        confidence: 0.7,
        actions: []
      }
    };

    return responses[intent] || responses.general;
  },

  getBuyerResponse(intent: string, context: Record<string, unknown> | undefined): ChatWidgetResponse {
    const responses: Record<string, ChatWidgetResponse> = {
      supplier: {
        response: `🔍 **Find Suppliers**\n\nI'll help you source quality products!\n\n**Our Platform Offers:**\n• Verified farmer database\n• Quality-certified suppliers\n• Competitive pricing\n• Reliable delivery tracking\n• Trust score ratings\n\n**Search Filters:**\n✓ Product type and quality grade\n✓ Location and delivery radius\n✓ Certification (organic, etc.)\n✓ Supplier ratings and reviews\n\n${context?.name ? `${context.name}, ` : ''}visit the Sourcing Space to find suppliers matching your requirements!`,
        suggestions: [
          'Search suppliers',
          'View top-rated farmers',
          'Organic certified suppliers',
          'Nearby suppliers'
        ],
        intent: 'supplier_search',
        confidence: 0.9,
        actions: []
      },
      general: {
        response: `👋 Hello${context?.name ? ` ${context.name}` : ''}! I'm your AI procurement assistant! 🛒\n\nI can help you with:\n\n🔍 **Sourcing**\n• Find verified suppliers\n• Quality-certified farmers\n• Regional sourcing options\n\n💰 **Pricing**\n• Compare market prices\n• Negotiate better deals\n• Bulk order discounts\n\n📦 **Procurement**\n• Place bulk orders\n• Track deliveries\n• Manage contracts\n\n📊 **Intelligence**\n• Market trends\n• Supply forecasts\n• Price predictions\n\nWhat would you like to do today?`,
        suggestions: [
          'Find suppliers',
          'Compare prices',
          'Place bulk order',
          'Market analysis'
        ],
        intent: 'general',
        confidence: 0.7,
        actions: []
      }
    };

    return responses[intent] || responses.general;
  },

  async getSuggestions(): Promise<string[]> {
    try {
      const response = await api.get<{ success: boolean; data: { suggestions: string[] } }>(
        '/ai/chat/suggestions'
      );

      const responseData = response as unknown as { data: { success: boolean; data: { suggestions: string[] } } };
      return responseData.data.data.suggestions || [];
    } catch (error) {
      console.error('Get suggestions error:', error);
      return [];
    }
  },

  async clearHistory(): Promise<boolean> {
    try {
      await api.delete('/ai/chat/history');
      return true;
    } catch (error) {
      console.error('Clear history error:', error);
      return false;
    }
  },
};
