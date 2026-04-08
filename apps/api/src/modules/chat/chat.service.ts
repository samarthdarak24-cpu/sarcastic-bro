/* ========================================================================
   Chat Service — Advanced Chat & Communication System
   Handles real-time messaging, translation, matching, analytics
   ======================================================================== */

import prisma from "../../prisma/client";
import { getSocketService } from "../../services/socketService";

export class ChatService {
  /**
   * Get all conversations for a user
   */
  static async getConversations(userId: string) {
    try {
      const conversations = await prisma.chatConversation.findMany({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        include: {
          user1: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              role: true,
              district: true,
            },
          },
          user2: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              role: true,
              district: true,
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              content: true,
              createdAt: true,
              isRead: true,
              type: true,
            },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
      });

      // Format conversations
      return conversations.map((conv) => {
        const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
        const lastMessage = conv.messages[0];

        return {
          id: conv.id,
          otherUser,
          lastMessage: lastMessage || null,
          lastMessageAt: conv.lastMessageAt,
          currentUserId: userId,
        };
      });
    } catch (error: any) {
      console.error('[Chat] Get conversations failed:', error.message);
      throw new Error(`Failed to get conversations: ${error.message}`);
    }
  }

  /**
   * Get messages in a conversation
   */
  static async getMessages(conversationId: string, limit: number = 50) {
    try {
      const messages = await prisma.chatMessage.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return messages.reverse();
    } catch (error: any) {
      console.error('[Chat] Get messages failed:', error.message);
      throw new Error(`Failed to get messages: ${error.message}`);
    }
  }

  /**
   * Send a message with optional translation
   */
  static async sendMessage(data: {
    conversationId?: string;
    senderId: string;
    receiverId: string;
    content: string;
    type?: 'text' | 'image' | 'file' | 'template';
    translate?: boolean;
    targetLanguage?: string;
  }) {
    try {
      let conversationId = data.conversationId;

      // Find or create conversation
      if (!conversationId) {
        let conversation = await prisma.chatConversation.findFirst({
          where: {
            OR: [
              { user1Id: data.senderId, user2Id: data.receiverId },
              { user1Id: data.receiverId, user2Id: data.senderId },
            ],
          },
        });

        if (!conversation) {
          conversation = await prisma.chatConversation.create({
            data: {
              user1Id: data.senderId,
              user2Id: data.receiverId,
            },
          });
        }

        conversationId = conversation.id;
      }

      // Translate message if requested
      let content = data.content;
      if (data.translate && data.targetLanguage) {
        content = await this.translateText(data.content, data.targetLanguage);
      }

      // Create message
      const message = await prisma.chatMessage.create({
        data: {
          conversationId,
          senderId: data.senderId,
          content,
          type: data.type || 'text',
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Update conversation last message time
      await prisma.chatConversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      });

      // Emit Socket.IO event
      const socketService = getSocketService();
      socketService.emitNewMessage(data.receiverId, {
        messageId: message.id,
        conversationId,
        senderId: data.senderId,
        senderName: message.sender.name,
        content: message.content,
        type: message.type,
        createdAt: message.createdAt,
      });

      // Analyze sentiment in background
      this.analyzeSentiment(message.id, message.content).catch(console.error);

      return message;
    } catch (error: any) {
      console.error('[Chat] Send message failed:', error.message);
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  /**
   * Translate text using a simple translation service
   * In production, integrate with Google Translate API or LibreTranslate
   */
  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      // TODO: Integrate with actual translation API
      // For now, return original text with a marker
      console.log(`[Chat] Translation requested: ${targetLanguage}`);
      return text; // Placeholder
    } catch (error: any) {
      console.error('[Chat] Translation failed:', error.message);
      return text; // Return original on error
    }
  }

  /**
   * Analyze message sentiment using simple NLP
   */
  static async analyzeSentiment(messageId: string, content: string) {
    try {
      // Simple sentiment analysis based on keywords
      const positiveWords = ['good', 'great', 'excellent', 'happy', 'thanks', 'perfect', 'best'];
      const negativeWords = ['bad', 'poor', 'terrible', 'angry', 'worst', 'hate', 'problem'];

      const lowerContent = content.toLowerCase();
      let positiveCount = 0;
      let negativeCount = 0;

      positiveWords.forEach(word => {
        if (lowerContent.includes(word)) positiveCount++;
      });

      negativeWords.forEach(word => {
        if (lowerContent.includes(word)) negativeCount++;
      });

      let sentiment = 'neutral';
      let sentimentScore = 0.5;

      if (positiveCount > negativeCount) {
        sentiment = 'positive';
        sentimentScore = Math.min(0.5 + (positiveCount * 0.1), 1.0);
      } else if (negativeCount > positiveCount) {
        sentiment = 'negative';
        sentimentScore = Math.max(0.5 - (negativeCount * 0.1), 0.0);
      }

      await prisma.messageAnalytics.create({
        data: {
          messageId,
          sentiment,
          sentimentScore,
          language: 'en',
          confidence: 0.7,
        },
      });
    } catch (error: any) {
      console.error('[Chat] Sentiment analysis failed:', error.message);
    }
  }

  /**
   * Get quick message templates
   */
  static async getTemplates(userRole: string) {
    const farmerTemplates = [
      "What is your best price for bulk orders?",
      "Is this product available for immediate delivery?",
      "Can you provide quality certificates?",
      "What are your payment terms?",
      "Do you offer samples?",
      "What is the minimum order quantity?",
    ];

    const buyerTemplates = [
      "Yes, this product is available.",
      "I can offer a discount for bulk orders.",
      "Quality certificates are available.",
      "Payment terms: 50% advance, 50% on delivery.",
      "Samples can be arranged.",
      "Minimum order: 100 kg",
    ];

    return userRole === 'FARMER' ? farmerTemplates : buyerTemplates;
  }

  /**
   * Smart matching algorithm - Find best buyers/farmers
   */
  static async findMatches(userId: string, criteria: {
    role?: string;
    category?: string;
    district?: string;
    minRating?: number;
  }) {
    try {
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, district: true },
      });

      if (!currentUser) {
        throw new Error('User not found');
      }

      // Find opposite role users
      const targetRole = currentUser.role === 'FARMER' ? 'BUYER' : 'FARMER';

      const matches = await prisma.user.findMany({
        where: {
          role: targetRole,
          isActive: true,
          ratingAvg: { gte: criteria.minRating || 3.0 },
          ...(criteria.district && { district: criteria.district }),
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          role: true,
          district: true,
          ratingAvg: true,
          totalOrders: true,
          reputationScore: true,
        },
        orderBy: [
          { ratingAvg: 'desc' },
          { totalOrders: 'desc' },
        ],
        take: 20,
      });

      // Calculate match score
      return matches.map(user => ({
        ...user,
        matchScore: this.calculateMatchScore(currentUser, user),
      })).sort((a, b) => b.matchScore - a.matchScore);
    } catch (error: any) {
      console.error('[Chat] Find matches failed:', error.message);
      throw new Error(`Failed to find matches: ${error.message}`);
    }
  }

  /**
   * Calculate match score between two users
   */
  static calculateMatchScore(user1: any, user2: any): number {
    let score = 0;

    // Same district bonus
    if (user1.district === user2.district) {
      score += 30;
    }

    // Rating bonus
    score += (user2.ratingAvg || 0) * 10;

    // Experience bonus
    score += Math.min((user2.totalOrders || 0) / 10, 20);

    // Reputation bonus
    score += Math.min((user2.reputationScore || 0) / 5, 20);

    return Math.min(score, 100);
  }

  /**
   * Get conversation analytics
   */
  static async getConversationAnalytics(conversationId: string) {
    try {
      const messages = await prisma.chatMessage.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: { id: true, name: true },
          },
        },
      });

      const analytics = await prisma.messageAnalytics.findMany({
        where: {
          messageId: { in: messages.map(m => m.id) },
        },
      });

      const totalMessages = messages.length;
      const sentimentCounts = {
        positive: analytics.filter(a => a.sentiment === 'positive').length,
        neutral: analytics.filter(a => a.sentiment === 'neutral').length,
        negative: analytics.filter(a => a.sentiment === 'negative').length,
      };

      // Calculate response time
      const responseTimes: number[] = [];
      for (let i = 1; i < messages.length; i++) {
        if (messages[i].senderId !== messages[i - 1].senderId) {
          const diff = messages[i].createdAt.getTime() - messages[i - 1].createdAt.getTime();
          responseTimes.push(diff / 1000 / 60); // minutes
        }
      }

      const avgResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

      return {
        totalMessages,
        sentimentCounts,
        avgResponseTime: Math.round(avgResponseTime),
        participants: Array.from(new Set(messages.map(m => m.sender.name))),
      };
    } catch (error: any) {
      console.error('[Chat] Get analytics failed:', error.message);
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  }

  /**
   * Mark message as read
   */
  static async markAsRead(messageId: string) {
    try {
      await prisma.chatMessage.update({
        where: { id: messageId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
    } catch (error: any) {
      console.error('[Chat] Mark as read failed:', error.message);
    }
  }
}
