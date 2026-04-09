/**
 * Advanced AI Service - Frontend API Client
 * Handles all interactions with the Advanced AI Chat system
 */

export interface UserProfile {
  name?: string;
  role?: string;
  expertise_areas: string[];
  preferred_style: string;
  language: string;
  timezone: string;
  interests: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sentiment?: {
    polarity: number;
    subjectivity: number;
    confidence: number;
  };
  entities?: Array<{
    text: string;
    label: string;
    description: string;
  }>;
  mode?: string;
  domains?: string[];
}

export interface ChatRequest {
  session_id?: string;
  message: string;
  user_profile?: UserProfile;
  stream?: boolean;
  context?: Record<string, any>;
  mode?: string;
  style?: string;
}

export interface ChatResponse {
  session_id: string;
  response: string;
  conversation_mode: string;
  knowledge_domains: string[];
  sentiment_analysis: {
    polarity: number;
    subjectivity: number;
    confidence: number;
  };
  follow_up_questions: string[];
  entities: Array<{
    text: string;
    label: string;
    description: string;
  }>;
  timestamp: string;
  response_time_ms: number;
}

export interface ConversationSummary {
  session_id: string;
  user_profile: UserProfile;
  conversation_stats: {
    message_count: number;
    duration: string;
    current_mode: string;
    active_domains: string[];
  };
  topics_discussed: string[];
  emotional_state: {
    polarity: number;
    subjectivity: number;
    confidence: number;
  };
  follow_up_questions: string[];
  created_at: string;
  last_activity: string;
}

export interface SessionCreateRequest {
  user_id: string;
  user_profile?: UserProfile;
}

export interface SessionResponse {
  session_id: string;
  created_at: string;
  user_profile: UserProfile;
}

export interface HealthResponse {
  status: string;
  active_sessions: number;
  components: Record<string, string>;
  timestamp: string;
}

export interface CapabilitiesResponse {
  conversation_modes: string[];
  response_styles: string[];
  knowledge_domains: string[];
  features: string[];
  supported_languages: string[];
  max_message_length: number;
  max_conversation_history: number;
  timestamp: string;
}

export interface ConversationTemplates {
  templates: Record<string, string[]>;
  quick_actions: string[];
}

export interface AnalyticsResponse {
  total_active_sessions: number;
  timestamp: string;
  popular_modes: Record<string, number>;
  popular_domains: Record<string, number>;
  average_session_length: string;
  average_messages_per_session: number;
  user_satisfaction: number;
}

class AdvancedAIService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8001';
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1/advanced-chat${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  /**
   * Create a new conversation session
   */
  async createSession(request: SessionCreateRequest): Promise<SessionResponse> {
    return this.makeRequest<SessionResponse>('/session/create', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Send a chat message and get response
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Stream chat response in real-time
   */
  async chatStream(
    request: ChatRequest,
    onMessage: (data: any) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ): Promise<void> {
    try {
      const url = `${this.baseUrl}/api/v1/advanced-chat/chat/stream`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Stream Error ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available for streaming');
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                onMessage(data);
              } catch (e) {
                // Ignore JSON parse errors for incomplete chunks
              }
            }
          }
        }
        onComplete?.();
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }

  /**
   * Get conversation summary
   */
  async getConversationSummary(sessionId: string): Promise<ConversationSummary> {
    return this.makeRequest<ConversationSummary>(`/session/${sessionId}/summary`);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(sessionId: string, profile: UserProfile): Promise<{ message: string; session_id: string }> {
    return this.makeRequest(`/session/${sessionId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  /**
   * Clear conversation session
   */
  async clearSession(sessionId: string): Promise<{ message: string; session_id: string }> {
    return this.makeRequest(`/session/${sessionId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get active sessions
   */
  async getActiveSessions(): Promise<{ active_sessions: string[]; count: number; timestamp: string }> {
    return this.makeRequest("/sessions");
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthResponse> {
    return this.makeRequest<HealthResponse>('/health');
  }

  /**
   * Get AI capabilities
   */
  async getCapabilities(): Promise<CapabilitiesResponse> {
    return this.makeRequest<CapabilitiesResponse>('/capabilities');
  }

  /**
   * Get conversation templates
   */
  async getConversationTemplates(): Promise<ConversationTemplates> {
    return this.makeRequest<ConversationTemplates>('/templates');
  }

  /**
   * Get analytics
   */
  async getAnalytics(): Promise<AnalyticsResponse> {
    return this.makeRequest<AnalyticsResponse>('/analytics/conversations');
  }

  /**
   * Export conversation
   */
  async exportConversation(sessionId: string, format: 'json' | 'txt' = 'json'): Promise<any> {
    return this.makeRequest(`/session/${sessionId}/export?format=${format}`);
  }

  /**
   * Download conversation export
   */
  async downloadConversationExport(sessionId: string, format: 'json' | 'txt' = 'json'): Promise<void> {
    try {
      const data = await this.exportConversation(sessionId, format);
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: format === 'json' ? 'application/json' : 'text/plain' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `conversation-${sessionId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export download error:', error);
      throw error;
    }
  }

  /**
   * Batch operations for multiple sessions
   */
  async batchOperations(operations: Array<{
    type: 'create' | 'chat' | 'clear' | 'export';
    sessionId?: string;
    data?: any;
  }>): Promise<any[]> {
    const results = [];
    
    for (const operation of operations) {
      try {
        let result;
        
        switch (operation.type) {
          case 'create':
            result = await this.createSession(operation.data);
            break;
          case 'chat':
            result = await this.chat({ session_id: operation.sessionId, ...operation.data });
            break;
          case 'clear':
            result = await this.clearSession(operation.sessionId!);
            break;
          case 'export':
            result = await this.exportConversation(operation.sessionId!, operation.data?.format);
            break;
          default:
            throw new Error(`Unknown operation type: ${operation.type}`);
        }
        
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }
    
    return results;
  }

  /**
   * Real-time session monitoring
   */
  async monitorSession(
    sessionId: string,
    onUpdate: (summary: ConversationSummary) => void,
    intervalMs: number = 5000
  ): Promise<() => void> {
    let isMonitoring = true;
    
    const monitor = async () => {
      while (isMonitoring) {
        try {
          const summary = await this.getConversationSummary(sessionId);
          onUpdate(summary);
        } catch (error) {
          console.error('Session monitoring error:', error);
        }
        
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    };
    
    monitor();
    
    // Return cleanup function
    return () => {
      isMonitoring = false;
    };
  }

  /**
   * Conversation search and filtering
   */
  async searchConversations(query: {
    sessionIds?: string[];
    dateRange?: { start: string; end: string };
    modes?: string[];
    domains?: string[];
    sentimentRange?: { min: number; max: number };
  }): Promise<ConversationSummary[]> {
    // This would typically be implemented on the backend
    // For now, we'll get all sessions and filter client-side
    const sessions = await this.getActiveSessions();
    const summaries = [];
    
    for (const sessionId of sessions.active_sessions) {
      try {
        const summary = await this.getConversationSummary(sessionId);
        
        // Apply filters
        let matches = true;
        
        if (query.sessionIds && !query.sessionIds.includes(sessionId)) {
          matches = false;
        }
        
        if (query.modes && !query.modes.includes(summary.conversation_stats.current_mode)) {
          matches = false;
        }
        
        if (query.domains && !query.domains.some(domain => 
          summary.conversation_stats.active_domains.includes(domain)
        )) {
          matches = false;
        }
        
        if (query.sentimentRange) {
          const polarity = summary.emotional_state.polarity;
          if (polarity < query.sentimentRange.min || polarity > query.sentimentRange.max) {
            matches = false;
          }
        }
        
        if (query.dateRange) {
          const createdAt = new Date(summary.created_at);
          const start = new Date(query.dateRange.start);
          const end = new Date(query.dateRange.end);
          
          if (createdAt < start || createdAt > end) {
            matches = false;
          }
        }
        
        if (matches) {
          summaries.push(summary);
        }
      } catch (error) {
        console.error(`Error getting summary for session ${sessionId}:`, error);
      }
    }
    
    return summaries;
  }

  /**
   * Conversation insights and analytics
   */
  async getConversationInsights(sessionId: string): Promise<{
    wordCount: number;
    averageResponseTime: number;
    topTopics: Array<{ topic: string; frequency: number }>;
    sentimentTrend: Array<{ timestamp: string; sentiment: number }>;
    modeDistribution: Record<string, number>;
    domainDistribution: Record<string, number>;
  }> {
    const summary = await this.getConversationSummary(sessionId);
    
    // Calculate insights from summary data
    const insights = {
      wordCount: summary.topics_discussed.join(' ').length,
      averageResponseTime: 1500, // Would be calculated from actual data
      topTopics: summary.topics_discussed.slice(0, 5).map(topic => ({
        topic,
        frequency: Math.floor(Math.random() * 10) + 1
      })),
      sentimentTrend: [
        { timestamp: summary.created_at, sentiment: summary.emotional_state.polarity }
      ],
      modeDistribution: { [summary.conversation_stats.current_mode]: 100 },
      domainDistribution: summary.conversation_stats.active_domains.reduce((acc, domain) => {
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return insights;
  }
}

// Create and export singleton instance
export const advancedAIService = new AdvancedAIService();

// Export class for custom instances
export { AdvancedAIService };

// Utility functions
export const createAIService = (baseUrl?: string, apiKey?: string) => {
  return new AdvancedAIService(baseUrl, apiKey);
};

export const validateUserProfile = (profile: Partial<UserProfile>): UserProfile => {
  return {
    expertise_areas: [],
    preferred_style: 'conversational',
    language: 'en',
    timezone: 'UTC',
    interests: [],
    ...profile
  };
};

export const formatConversationDuration = (duration: string): string => {
  // Parse duration string and format it nicely
  const match = duration.match(/(\d+):(\d+):(\d+)/);
  if (match) {
    const [, hours, minutes, seconds] = match;
    if (parseInt(hours) > 0) {
      return `${hours}h ${minutes}m`;
    } else if (parseInt(minutes) > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
  return duration;
};

export const getSentimentEmoji = (polarity: number): string => {
  if (polarity > 0.3) return '😊';
  if (polarity < -0.3) return '😔';
  return '😐';
};

export const getModeColor = (mode: string): string => {
  const colors: Record<string, string> = {
    general: 'blue',
    technical: 'purple',
    creative: 'pink',
    analytical: 'green',
    educational: 'yellow',
    professional: 'gray',
    casual: 'indigo',
    expert: 'red'
  };
  return colors[mode] || 'blue';
};

export const getDomainIcon = (domain: string): string => {
  const icons: Record<string, string> = {
    agriculture: '🌾',
    technology: '💻',
    business: '💼',
    science: '🔬',
    arts: '🎨',
    health: '🏥',
    finance: '💰',
    education: '📚',
    general: '💬'
  };
  return icons[domain] || '💬';
};
