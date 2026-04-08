/**
 * Master AI Service - Frontend service for advanced AI chat
 * Handles communication with the Master AI backend
 */

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface UserProfile {
  role?: string;
  location?: string;
  crops?: string[];
  farm_size?: number;
  [key: string]: any;
}

export interface ChatRequest {
  message: string;
  user_id: string;
  session_id?: string;
  user_profile?: UserProfile;
  stream?: boolean;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  session_id: string;
  capability: string;
  metadata?: {
    model: string;
    tokens_used: number;
    finish_reason: string;
  };
  error?: string;
}

export interface SuggestionRequest {
  user_id: string;
  context_type: string;
  context_data: Record<string, any>;
}

export interface AICapability {
  id: string;
  name: string;
  description: string;
}

class MasterAIService {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor() {
    this.baseUrl = `${AI_SERVICE_URL}/api/ai/master`;
  }

  /**
   * Send a chat message and get AI response
   */
  async chat(
    message: string,
    userId: string,
    userProfile?: UserProfile,
    sessionId?: string
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          user_id: userId,
          session_id: sessionId || this.sessionId,
          user_profile: userProfile,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      // Store session ID for continuity
      if (data.session_id) {
        this.sessionId = data.session_id;
      }

      return data;
    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  }

  /**
   * Stream chat responses in real-time
   */
  async *chatStream(
    message: string,
    userId: string,
    userProfile?: UserProfile,
    sessionId?: string
  ): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          user_id: userId,
          session_id: sessionId || this.sessionId,
          user_profile: userProfile,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              return;
            }
            
            if (data.trim()) {
              yield data;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in chat stream:', error);
      throw error;
    }
  }

  /**
   * Get AI-powered suggestions based on context
   */
  async getSuggestions(
    userId: string,
    contextType: string,
    contextData: Record<string, any>
  ): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          context_type: contextType,
          context_data: contextData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  /**
   * Analyze sentiment of a message
   */
  async analyzeSentiment(message: string): Promise<Record<string, any>> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze-sentiment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis || {};
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {};
    }
  }

  /**
   * Get conversation history for current session
   */
  async getSessionHistory(sessionId?: string): Promise<ChatMessage[]> {
    try {
      const sid = sessionId || this.sessionId;
      if (!sid) {
        return [];
      }

      const response = await fetch(`${this.baseUrl}/session/${sid}/history`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.history || [];
    } catch (error) {
      console.error('Error getting session history:', error);
      return [];
    }
  }

  /**
   * Clear current session
   */
  async clearSession(sessionId?: string): Promise<void> {
    try {
      const sid = sessionId || this.sessionId;
      if (!sid) {
        return;
      }

      await fetch(`${this.baseUrl}/session/${sid}`, {
        method: 'DELETE',
      });

      this.sessionId = null;
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  /**
   * Get list of AI capabilities
   */
  async getCapabilities(): Promise<AICapability[]> {
    try {
      const response = await fetch(`${this.baseUrl}/capabilities`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.capabilities || [];
    } catch (error) {
      console.error('Error getting capabilities:', error);
      return [];
    }
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Set session ID manually
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const masterAIService = new MasterAIService();
