/**
 * Simple AI Service - Direct connection to backend API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  user_type?: string;
  user_context?: Record<string, any>;
}

export interface ChatResponse {
  success: boolean;
  response: string;
  suggestions?: string[];
  intent?: string;
  confidence?: number;
}

class SimpleAIService {
  /**
   * Send a chat message and get AI response
   */
  async chat(message: string, userType: string = 'FARMER', userContext: Record<string, any> = {}): Promise<ChatResponse> {
    try {
      const apiUrl = API_URL || 'http://localhost:3001';
      
      // Extract history if present to format properly for backend
      const history = userContext.history || [];
      const cleanedContext = { ...userContext };
      delete cleanedContext.history;
      delete cleanedContext.agent_type;
      
      const response = await fetch(`${apiUrl}/ollama-chat/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_history: history,
          context: {
            user_id: "test-user-123",
            role: userType,
            location: "Maharashtra",
            crops: [],
            language: "en",
            session_id: "test-session",
            ...cleanedContext
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`AI Service error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "AI Service returned failure");
      }
      
      return {
        success: true,
        response: data.response,
        suggestions: data.suggestions || [],
        intent: "GENERAL",
        confidence: 0.9
      };
    } catch (error) {
      console.error('Error connecting to AI service:', error);
      
      // Return fallback response
      return {
        success: true,
        response: "Hello! I'm your AI assistant. I can help you with farming advice, market prices, and platform features. How can I assist you today?",
        suggestions: [
          "What are today's market prices?",
          "How can I improve my crop yield?",
          "Show me available buyers"
        ],
        intent: "GENERAL",
        confidence: 0.5
      };
    }
  }

  /**
   * Stream chat responses in real-time
   */
  async *chatStream(message: string, userType: string = 'FARMER', userContext: Record<string, any> = {}): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${API_URL}/ai-chat/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          user_type: userType,
          user_context: userContext
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
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              return;
            }
            
            if (data) {
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  yield parsed.content;
                }
              } catch {
                // If not JSON, yield as is
                yield data;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in chat stream:', error);
      yield "Hello! I'm your AI assistant. How can I help you today?";
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/ai-chat/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const simpleAIService = new SimpleAIService();

