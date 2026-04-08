import { prisma } from '../../prisma/client';
import axios from 'axios';

export class ChatAIService {
  /**
   * Summarize a chat conversation
   */
  static async summarizeChat(chatRoomId: string) {
    try {
      const messages = await prisma.chatRoomMessage.findMany({
        where: { chatRoomId },
        orderBy: { createdAt: 'asc' },
        take: 50,
      });

      if (messages.length === 0) {
        return { summary: 'No messages to summarize yet.' };
      }

      const conversationText = messages
        .map((m) => `${m.senderId}: ${m.content}`)
        .join('\n');

      // In a real app, you'd call Gemini/OpenAI here.
      // We'll simulate a professional AI response for the hackathon.
      
      const summary = `
### Chat Summary
- **Key Points**: Buyer is interested in the quality and delivery time. Farmer confirmed availability for tomorrow morning.
- **Status**: Negotiation in progress.
- **Action Items**: Buyer needs to confirm the delivery address; Farmer needs to prepare the invoice.
      `.trim();

      return { summary };
    } catch (error) {
      console.error('[ChatAIService] Error summarizing chat:', error);
      throw error;
    }
  }

  /**
   * Generate smart replies based on last message
   */
  static async getSmartReplies(lastMessage: string) {
    // Basic logic to suggest replies
    const suggestions = [];
    
    if (lastMessage.toLowerCase().includes('price')) {
      suggestions.push('What is your best price?', 'Is the price negotiable?', 'I agree with the price.');
    } else if (lastMessage.toLowerCase().includes('delivery') || lastMessage.toLowerCase().includes('when')) {
      suggestions.push('Can you deliver tomorrow?', 'When will it be dispatched?', 'Is shipping included?');
    } else {
      suggestions.push('Agreed!', 'Tell me more about the quality.', 'Can we hop on a video call?');
    }

    return { suggestions: suggestions.slice(0, 3) };
  }

  /**
   * Negotiation Assist
   */
  static async getNegotiationAssist(chatRoomId: string) {
    // Simulate AI analyzing market trends and prices
    const advice = `
### Negotiation Insight
- **Trend**: Tomato prices are up by 15% this week in your region.
- **Suggestion**: The current offer is competitive. You might want to ask for a bulk discount of 5% if you increase quantity by 20%.
- **Risk**: Other buyers are active; consider closing the deal within 6 hours.
    `.trim();

    return { advice };
  }
}
