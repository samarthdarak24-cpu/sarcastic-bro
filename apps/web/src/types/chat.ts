// Chat Widget Type Definitions

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    suggestions?: string[];
    actions?: QuickAction[];
  };
}

export interface QuickAction {
  id: string;
  label: string;
  query: string;
  icon?: string;
  category?: 'price' | 'quality' | 'market' | 'help';
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastActivityAt: Date;
  context: {
    userRole: 'FARMER' | 'BUYER';
    currentPage?: string;
    userLocation?: string;
  };
}

export interface UserChatPreferences {
  userId: string;
  proactiveNotificationsEnabled: boolean;
  preferredLanguage: 'en' | 'hi' | 'mr';
  soundEnabled: boolean;
  historyRetentionDays: number;
}

export interface ChatAPIRequest {
  message: string;
  conversationHistory: ChatMessage[];
  userContext: {
    userId: string;
    name: string;
    userType: 'FARMER' | 'BUYER';
    location?: string;
    currentPage?: string;
    products?: string[];
  };
}

export interface ChatAPIResponse {
  response: string;
  suggestions: string[];
  intent: string;
  confidence: number;
  actions: QuickAction[];
  metadata?: {
    processingTime: number;
    model: string;
  };
}
