import api from './api';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  translated?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    role: 'FARMER' | 'BUYER';
    avatar?: string;
    verified?: boolean;
    online?: boolean;
  };
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
}

// Mock data for immediate functionality
const mockConversations: Conversation[] = [
  {
    id: '1',
    otherUser: {
      id: 'farmer1',
      name: 'Ramesh Kumar',
      role: 'FARMER',
      avatar: '👨‍🌾',
      verified: true,
      online: true,
    },
    lastMessage: {
      id: 'm1',
      conversationId: '1',
      senderId: 'farmer1',
      content: 'I have fresh tomatoes available. 500kg at ₹45/kg',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      sentiment: 'positive',
    },
    unreadCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '2',
    otherUser: {
      id: 'farmer2',
      name: 'Sunita Devi',
      role: 'FARMER',
      avatar: '👩‍🌾',
      verified: true,
      online: false,
    },
    lastMessage: {
      id: 'm2',
      conversationId: '2',
      senderId: 'farmer2',
      content: 'Thank you for your order! Will deliver by tomorrow.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: true,
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: '3',
    otherUser: {
      id: 'buyer1',
      name: 'Amit Traders',
      role: 'BUYER',
      avatar: '🏢',
      verified: true,
      online: true,
    },
    lastMessage: {
      id: 'm3',
      conversationId: '3',
      senderId: 'buyer1',
      content: 'Can you supply 1000kg onions weekly?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      sentiment: 'neutral',
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
];

const mockMessages: { [key: string]: Message[] } = {
  '1': [
    {
      id: 'm1-1',
      conversationId: '1',
      senderId: 'buyer1',
      content: 'Hi! Do you have tomatoes available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      read: true,
      sentiment: 'neutral',
    },
    {
      id: 'm1-2',
      conversationId: '1',
      senderId: 'farmer1',
      content: 'Yes! I have fresh tomatoes. 500kg available at ₹45/kg',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      sentiment: 'positive',
      translated: 'हाँ! मेरे पास ताजा टमाटर हैं। 500 किलो ₹45/किलो पर उपलब्ध',
    },
    {
      id: 'm1-3',
      conversationId: '1',
      senderId: 'farmer1',
      content: 'Quality is Grade A. Can deliver within 24 hours.',
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      read: false,
      sentiment: 'positive',
    },
  ],
  '2': [
    {
      id: 'm2-1',
      conversationId: '2',
      senderId: 'buyer1',
      content: 'I need 200kg potatoes for tomorrow',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
    },
    {
      id: 'm2-2',
      conversationId: '2',
      senderId: 'farmer2',
      content: 'Sure! I can arrange that. ₹30/kg',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: true,
    },
    {
      id: 'm2-3',
      conversationId: '2',
      senderId: 'buyer1',
      content: 'Perfect! Please proceed with the order.',
      timestamp: new Date(Date.now() - 1000 * 60 * 35),
      read: true,
    },
    {
      id: 'm2-4',
      conversationId: '2',
      senderId: 'farmer2',
      content: 'Thank you for your order! Will deliver by tomorrow.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: true,
      sentiment: 'positive',
    },
  ],
  '3': [
    {
      id: 'm3-1',
      conversationId: '3',
      senderId: 'buyer1',
      content: 'Can you supply 1000kg onions weekly?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
    },
  ],
};

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await api.get("/messages/conversations");
      const data = response.data.data || response.data || [];
      return data.length > 0 ? data : mockConversations;
    } catch (error) {
      console.log('Using mock conversations data');
      return mockConversations;
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await api.get(`/messages/conversation/${conversationId}`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.log('Using mock messages data');
      return mockMessages[conversationId] || [];
    }
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    try {
      const response = await api.post(`/messages/conversation/${conversationId}`, {
        content,
      });
      return response.data.data || response.data;
    } catch (error) {
      // Mock response
      const newMessage: Message = {
        id: `m-${Date.now()}`,
        conversationId,
        senderId: 'current-user',
        content,
        timestamp: new Date(),
        read: false,
      };
      
      if (!mockMessages[conversationId]) {
        mockMessages[conversationId] = [];
      }
      mockMessages[conversationId].push(newMessage);
      
      return newMessage;
    }
  },

  async createConversation(userId: string): Promise<Conversation> {
    try {
      const response = await api.post('/messages/conversation', { userId });
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  async translateMessage(messageId: string, targetLanguage: string): Promise<string> {
    // Mock translation
    const translations: { [key: string]: string } = {
      en: 'Yes! I have fresh tomatoes. 500kg available at ₹45/kg',
      hi: 'हाँ! मेरे पास ताजा टमाटर हैं। 500 किलो ₹45/किलो पर उपलब्ध',
      mr: 'होय! माझ्याकडे ताजे टोमॅटो आहेत. 500 किलो ₹45/किलो वर उपलब्ध',
    };
    return translations[targetLanguage] || translations.en;
  },

  async analyzeSentiment(content: string): Promise<'positive' | 'neutral' | 'negative'> {
    // Simple sentiment analysis
    const positive = ['good', 'great', 'excellent', 'perfect', 'yes', 'sure', 'thank'];
    const negative = ['bad', 'no', 'not', 'never', 'poor', 'worst'];
    
    const lowerContent = content.toLowerCase();
    const hasPositive = positive.some(word => lowerContent.includes(word));
    const hasNegative = negative.some(word => lowerContent.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  },

  // Get available farmers/buyers to start conversation
  async getAvailableUsers(role: 'FARMER' | 'BUYER'): Promise<any[]> {
    const mockUsers = [
      { id: 'f1', name: 'Rajesh Patel', role: 'FARMER', products: ['Tomatoes', 'Onions'], verified: true, rating: 4.8 },
      { id: 'f2', name: 'Priya Singh', role: 'FARMER', products: ['Potatoes', 'Carrots'], verified: true, rating: 4.9 },
      { id: 'f3', name: 'Mohan Kumar', role: 'FARMER', products: ['Rice', 'Wheat'], verified: true, rating: 4.7 },
      { id: 'b1', name: 'Fresh Mart', role: 'BUYER', location: 'Mumbai', verified: true, rating: 4.6 },
      { id: 'b2', name: 'Agro Traders', role: 'BUYER', location: 'Delhi', verified: true, rating: 4.8 },
    ];
    
    return mockUsers.filter(u => u.role === role);
  },

  async markAsRead(messageId: string): Promise<void> {
    try {
      await api.patch(`/messages/${messageId}/read`);
    } catch (error) {
      console.log('Using mock mark as read');
    }
  },
};

