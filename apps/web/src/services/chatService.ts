import api from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  response: string;
  suggestions: string[];
  intent: string;
  confidence: number;
  actions?: Array<{
    type: string;
    label: string;
  }>;
  data?: any;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  userContext?: any;
}

class ChatService {
  private conversationHistory: ChatMessage[] = [];
  private maxHistoryLength = 20;

  /**
   * Send a message to the AI chat
   */
  async sendMessage(message: string, userContext?: any): Promise<ChatResponse> {
    try {
      const response = await api.post<{ success: boolean; data: ChatResponse }>(
        '/ai/chat/message',
        {
          message,
          conversationHistory: this.conversationHistory,
          userContext,
        }
      );

      // Add to conversation history
      this.addToHistory({ role: 'user', content: message, timestamp: new Date() });
      this.addToHistory({
        role: 'assistant',
        content: response.data.data.response,
        timestamp: new Date(),
      });

      return response.data.data;
    } catch (error) {
      console.error('Chat service error:', error);
      
      // Fallback response
      return {
        response: "I'm here to help! I can assist you with pricing, quality checks, finding buyers/suppliers, market trends, and much more. What would you like to know?",
        suggestions: [
          'Check market prices',
          'Find buyers/suppliers',
          'Analyze crop quality',
          'Get market insights',
        ],
        intent: 'general',
        confidence: 0.5,
        actions: [],
      };
    }
  }

  /**
   * Get chat suggestions based on user type
   */
  async getSuggestions(): Promise<string[]> {
    try {
      const response = await api.get<{ success: boolean; data: { suggestions: string[] } }>(
        '/ai/chat/suggestions'
      );
      return response.data.data.suggestions;
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [
        'What can you help me with?',
        'Show me market prices',
        'Find buyers for my product',
        'Analyze crop quality',
      ];
    }
  }

  /**
   * Get conversation history
   */
  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Add message to history
   */
  private addToHistory(message: ChatMessage) {
    this.conversationHistory.push(message);
    
    // Keep only recent messages
    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
    }
  }

  /**
   * Clear conversation history
   */
  async clearHistory(): Promise<void> {
    try {
      await api.delete('/ai/chat/history');
      this.conversationHistory = [];
    } catch (error) {
      console.error('Failed to clear history:', error);
      this.conversationHistory = [];
    }
  }

  /**
   * Load history from local storage
   */
  loadHistoryFromStorage(userId: string) {
    try {
      const stored = localStorage.getItem(`chat_history_${userId}`);
      if (stored) {
        this.conversationHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load history from storage:', error);
    }
  }

  /**
   * Save history to local storage
   */
  saveHistoryToStorage(userId: string) {
    try {
      localStorage.setItem(`chat_history_${userId}`, JSON.stringify(this.conversationHistory));
    } catch (error) {
      console.error('Failed to save history to storage:', error);
    }
  }
}

export const chatService = new ChatService();
