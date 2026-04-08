import api from './api';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
  type: 'text' | 'image' | 'voice';
  fileUrl?: string;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface Conversation {
  conversationId: string;
  otherUser: {
    id: string;
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    isRead: boolean;
  } | null;
  lastMessageAt: string;
  unreadCount?: number;
}

export const messagingService = {
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await api.get('/messages/conversations');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  async getMessages(otherUserId: string, limit: number = 50): Promise<Message[]> {
    try {
      const response = await api.get(`/messages/with/${otherUserId}`, {
        params: { limit }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  async sendMessage(receiverId: string, content: string, type: 'text' | 'image' | 'voice' = 'text', fileUrl?: string): Promise<Message | null> {
    try {
      const response = await api.post('/messages', {
        receiverId,
        content,
        type,
        fileUrl
      });
      return response.data.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async markAsRead(messageId: string): Promise<boolean> {
    try {
      await api.patch(`/messages/${messageId}/read`);
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  },

  async emitTyping(conversationId: string, isTyping: boolean): Promise<void> {
    try {
      await api.post('/messages/typing', {
        conversationId,
        isTyping
      });
    } catch (error) {
      console.error('Error emitting typing:', error);
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/messages/unread-count');
      return response.data.data.unreadCount || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  async searchMessages(query: string, limit: number = 20): Promise<Message[]> {
    try {
      const response = await api.get('/messages/search', {
        params: { q: query, limit }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  }
};

export default messagingService;
