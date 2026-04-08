'use client';

/* ========================================================================
   Communications Service — Frontend Client for Communication Features
   Handles API calls for all communication features
   ======================================================================== */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

interface SupplierMatchRequest {
  cropType: string;
  quantity: number;
}

interface NegotiationRequest {
  sellerId: string;
  productId: string;
  quantity: number;
  unit: string;
  initialPrice: number;
}

export const communicationsService = {
  /**
   * Translate a message to another language
   */
  async translateMessage(data: TranslationRequest) {
    try {
      const response = await fetch(`${API_BASE_URL}/communications/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  },

  /**
   * Find matching suppliers
   */
  async findSupplierMatches(data: SupplierMatchRequest) {
    try {
      const params = new URLSearchParams({
        cropType: data.cropType,
        quantity: data.quantity.toString(),
      });

      const response = await fetch(
        `${API_BASE_URL}/communications/suppliers/matches?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to find matches');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Matching error:', error);
      throw error;
    }
  },

  /**
   * Analyze message sentiment
   */
  async analyzeSentiment(messageId: string, content: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/communications/sentiment/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ messageId, content }),
        }
      );

      if (!response.ok) {
        throw new Error('Sentiment analysis failed');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw error;
    }
  },

  /**
   * Create negotiation deal
   */
  async createNegotiation(data: NegotiationRequest) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/communications/negotiations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create negotiation');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Negotiation creation error:', error);
      throw error;
    }
  },

  /**
   * Update negotiation price
   */
  async updateNegotiationPrice(negotiationId: string, newPrice: number) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/communications/negotiations/${negotiationId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ newPrice }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update negotiation');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Negotiation update error:', error);
      throw error;
    }
  },

  /**
   * Get conversation analytics
   */
  async getAnalytics(period: 'day' | 'week' | 'month' = 'week') {
    try {
      const params = new URLSearchParams({ period });

      const response = await fetch(
        `${API_BASE_URL}/communications/analytics?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Analytics error:', error);
      throw error;
    }
  },

  /**
   * Get user verification status
   */
  async getVerificationStatus(userId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/communications/verification/${userId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch verification status');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  },

  /**
   * Get smart notifications
   */
  async getNotifications(limit: number = 10) {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });

      const response = await fetch(
        `${API_BASE_URL}/communications/notifications?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Notifications error:', error);
      throw error;
    }
  },

  /**
   * Send a real-time message
   */
  async sendMessage(receiverId: string, content: string, type: 'text' | 'image' | 'file' = 'text') {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          receiverId,
          content,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Message send error:', error);
      throw error;
    }
  },

  /**
   * Get conversation with another user
   */
  async getConversation(userId: string, limit: number = 50) {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });

      const response = await fetch(
        `${API_BASE_URL}/messages/conversation/${userId}?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Conversation fetch error:', error);
      throw error;
    }
  },

  /**
   * Get all conversations
   */
  async getConversations() {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Conversations fetch error:', error);
      throw error;
    }
  },

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Mark read error:', error);
      throw error;
    }
  },

  /**
   * Emit typing indicator
   */
  async emitTyping(receiverId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/typing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ receiverId }),
      });

      if (!response.ok) {
        throw new Error('Failed to emit typing indicator');
      }

      return true;
    } catch (error) {
      console.error('Typing indicator error:', error);
      throw error;
    }
  },
};
