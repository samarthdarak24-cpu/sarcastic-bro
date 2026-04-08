import api from './api';
import { ChatMessage, ChatAPIResponse, QuickAction } from '@/types/chat';
import { getAdvancedAIResponse } from './farmBotAI';

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
    language?: 'en' | 'hi' | 'mr';
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
        return this.getIntelligentFallback(params.message, params.userContext as any);
      }
    }
    
    return this.getIntelligentFallback(params.message, params.userContext as any);
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
            // Handle SSE format "data: {...}"
            const cleanLine = line.startsWith('data: ') ? line.slice(6) : line;
            if (cleanLine === '[DONE]') continue;
            
            const data = JSON.parse(cleanLine) as StreamChunk;
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

  async getIntelligentFallback(message: string, userContext: Record<string, any> | undefined): Promise<ChatWidgetResponse> {
    const userRole = (userContext?.userType as 'FARMER' | 'BUYER') || 'FARMER';
    const language = (userContext?.language as 'en' | 'hi' | 'mr') || 'en';
    
    return await getAdvancedAIResponse(message, {
      language,
      userRole,
      name: userContext?.name,
      location: userContext?.location || userContext?.district,
      history: []
    });
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

export default chatWidgetService;
