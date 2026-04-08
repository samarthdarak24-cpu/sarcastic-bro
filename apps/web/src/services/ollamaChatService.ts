import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface UserContext {
  userId: string;
  role: 'FARMER' | 'BUYER';
  location: string;
  crops?: string[];
  language: string;
  sessionId: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  context: UserContext;
  conversationHistory?: ChatMessage[];
  model?: string;
  temperature?: number;
  stream?: boolean;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
  metadata?: any;
  suggestions?: string[];
}

export interface HealthStatus {
  status: string;
  ollama_available: boolean;
  available_models: string[];
  service: string;
}

export interface ModelsResponse {
  success: boolean;
  models: string[];
}

export interface QuickActionsResponse {
  success: boolean;
  data: {
    quickActions: string[];
    userRole: string;
    userLocation: string;
  };
}

class OllamaChatService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Check Ollama service health
   */
  async checkHealth(): Promise<{ success: boolean; data?: HealthStatus; error?: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ollama-chat/health`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Health check failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Health check failed'
      };
    }
  }

  /**
   * Get available Ollama models
   */
  async getAvailableModels(): Promise<{ success: boolean; models?: string[]; error?: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ollama-chat/models`);
      return {
        success: true,
        models: response.data.data?.models || []
      };
    } catch (error: any) {
      console.error('Get models failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get models'
      };
    }
  }

  /**
   * Send chat message and get complete response
   */
  async sendMessage(request: ChatRequest): Promise<{ success: boolean; data?: ChatResponse; error?: string }> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ollama-chat/complete`,
        request,
        {
          headers: this.getAuthHeaders(),
          timeout: 60000 // 60 second timeout
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Send message failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to send message'
      };
    }
  }

  /**
   * Create streaming chat connection
   * Returns a function to start streaming and event handlers
   */
  createStreamingChat(
    request: ChatRequest,
    onChunk: (data: any) => void,
    onError: (error: string) => void,
    onComplete: () => void
  ): () => void {
    let eventSource: EventSource | null = null;

    const startStreaming = async () => {
      try {
        // Use fetch for streaming since EventSource doesn't support POST with body
        const response = await fetch(`${API_BASE_URL}/ollama-chat/stream`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(request)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body reader available');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        const processStream = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                onComplete();
                break;
              }

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.substring(6);
                  if (data.trim()) {
                    try {
                      const parsedData = JSON.parse(data);
                      onChunk(parsedData);
                      
                      if (parsedData.type === 'error') {
                        onError(parsedData.message || 'Stream error');
                        return;
                      }
                      
                      if (parsedData.type === 'stream_end') {
                        onComplete();
                        return;
                      }
                    } catch (e) {
                      console.error('Failed to parse stream data:', e);
                    }
                  }
                }
              }
            }
          } catch (error: any) {
            onError(error.message || 'Stream processing error');
          }
        };

        processStream();

      } catch (error: any) {
        onError(error.message || 'Failed to start streaming');
      }
    };

    // Return the start function
    return startStreaming;
  }

  /**
   * Get quick actions for user
   */
  async getQuickActions(): Promise<{ success: boolean; data?: QuickActionsResponse['data']; error?: string }> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/ollama-chat/quick-actions`,
        { headers: this.getAuthHeaders() }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Get quick actions failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get quick actions'
      };
    }
  }

  /**
   * Clear conversation history
   */
  async clearConversation(sessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await axios.delete(
        `${API_BASE_URL}/ollama-chat/conversation/${sessionId}`,
        { headers: this.getAuthHeaders() }
      );

      return { success: true };
    } catch (error: any) {
      console.error('Clear conversation failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to clear conversation'
      };
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(sessionId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/ollama-chat/conversation/${sessionId}`,
        { headers: this.getAuthHeaders() }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Get conversation history failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get conversation history'
      };
    }
  }

  /**
   * Generate session ID for user
   */
  generateSessionId(userId: string): string {
    return `ollama_session_${userId}_${Date.now()}`;
  }

  /**
   * Detect language from text
   */
  detectLanguage(text: string): 'en' | 'hi' | 'mr' {
    // Simple language detection
    const hindiPattern = /[\u0900-\u097F]/;
    const marathiWords = ['आहे', 'आहेत', 'करतो', 'करते', 'मराठी', 'महाराष्ट्र'];
    
    if (hindiPattern.test(text)) {
      // Check for Marathi-specific words
      if (marathiWords.some(word => text.includes(word))) {
        return 'mr';
      }
      return 'hi';
    }
    return 'en';
  }

  /**
   * Get user context from stored user data
   */
  getUserContext(sessionId?: string): UserContext {
    // Get user data from localStorage or context
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    return {
      userId: userData.id || 'anonymous',
      role: userData.role || 'FARMER',
      location: userData.location || 'Maharashtra',
      crops: userData.crops || [],
      language: userData.language || 'en',
      sessionId: sessionId || this.generateSessionId(userData.id || 'anonymous')
    };
  }

  /**
   * Format message for display
   */
  formatMessage(content: string, language: string = 'en'): string {
    // Basic formatting for better display
    return content
      .replace(/\n\n/g, '\n')
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
      .trim();
  }

  /**
   * Get farming suggestions based on user role and context
   */
  getFarmingSuggestions(role: 'FARMER' | 'BUYER', location: string = 'Maharashtra'): string[] {
    if (role === 'FARMER') {
      return [
        "What crops should I grow this season?",
        "Current market prices in my area",
        "How to improve crop quality?",
        "Pest control for my crops",
        "Weather forecast for farming",
        "Government schemes for farmers",
        "Best time to sell my produce",
        "Find buyers for my crops"
      ];
    } else {
      return [
        "Find reliable suppliers nearby",
        "Compare prices across regions", 
        "Quality standards and grading",
        "Seasonal availability calendar",
        "Bulk purchase opportunities",
        "Logistics and transportation",
        "Contract negotiation tips",
        "Market trends and analysis"
      ];
    }
  }
}

export const ollamaChatService = new OllamaChatService();