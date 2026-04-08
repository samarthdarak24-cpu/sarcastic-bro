import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export class ChatService {
  async sendMessage(userId: string, message: string) {
    // Store user message
    await prisma.behaviorEvent.create({
      data: {
        userId,
        action: 'CHAT',
        category: 'AI_ASSISTANT',
        metadata: JSON.stringify({ message, role: 'user' })
      }
    });

    // Get chat history
    const history = await this.getChatHistory(userId, 10);

    // Call AI service
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/chat`, {
        message,
        userId,
        history: history.messages.map(m => ({
          role: m.metadata ? JSON.parse(m.metadata).role : 'user',
          content: m.metadata ? JSON.parse(m.metadata).message : message
        }))
      }, { timeout: 30000 });

      const aiResponse = response.data.response || response.data.message;

      // Store AI response
      await prisma.behaviorEvent.create({
        data: {
          userId,
          action: 'CHAT',
          category: 'AI_ASSISTANT',
          metadata: JSON.stringify({ message: aiResponse, role: 'assistant' })
        }
      });

      return {
        response: aiResponse,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('AI service error:', error);
      return {
        response: 'I apologize, but I am currently unable to process your request. Please try again later.',
        timestamp: new Date()
      };
    }
  }

  async getChatHistory(userId: string, limit: number = 50) {
    const messages = await prisma.behaviorEvent.findMany({
      where: {
        userId,
        action: 'CHAT',
        category: 'AI_ASSISTANT'
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    return {
      messages: messages.reverse(),
      total: messages.length
    };
  }

  async clearChatHistory(userId: string) {
    await prisma.behaviorEvent.deleteMany({
      where: {
        userId,
        action: 'CHAT',
        category: 'AI_ASSISTANT'
      }
    });

    return { success: true };
  }
}
