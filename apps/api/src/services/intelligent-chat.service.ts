/**
 * Intelligent Chat Service - LLM-powered chat with context memory
 * Replaces keyword-based responses with intelligent AI
 */

import { PrismaClient } from '@prisma/client';
import { llmService, LLMMessage } from './llm.service';
import { AgricultureKnowledgeService } from './agriculture-knowledge.service';

const prisma = new PrismaClient();

interface ChatSession {
  sessionId: string;
  userId?: string;
  userRole?: 'farmer' | 'buyer' | 'general';
  messages: LLMMessage[];
  createdAt: Date;
  lastMessageAt: Date;
}

export class IntelligentChatService {
  private sessions = new Map<string, ChatSession>();
  private maxContextMessages = 20; // Keep last 20 messages for context
  private sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    // Cleanup old sessions every hour
    setInterval(() => this.cleanupOldSessions(), 60 * 60 * 1000);
  }

  /**
   * Process chat message and generate intelligent response
   */
  async processChat(
    input: string,
    sessionId?: string,
    userId?: string,
    userRole?: 'farmer' | 'buyer' | 'general'
  ): Promise<{
    response: string;
    sessionId: string;
    model: string;
    provider: string;
  }> {
    try {
      // Generate or retrieve session
      const session = this.getOrCreateSession(sessionId, userId, userRole);

      // Add user message to context
      session.messages.push({
        role: 'user',
        content: input,
      });

      // Check if this is a platform-specific question (fast path)
      const platformResponse = this.checkPlatformFeatures(input);
      if (platformResponse) {
        // Still use LLM to enhance platform response
        const enhancedResponse = await this.enhanceWithLLM(
          input,
          platformResponse,
          session
        );
        session.messages.push({
          role: 'assistant',
          content: enhancedResponse,
        });
        this.trimContext(session);
        return {
          response: enhancedResponse,
          sessionId: session.sessionId,
          model: 'hybrid',
          provider: 'platform+llm',
        };
      }

      // For general questions, use full LLM
      const llmResponse = await this.generateLLMResponse(input, session);

      // Add assistant response to context
      session.messages.push({
        role: 'assistant',
        content: llmResponse.content,
      });

      // Trim context to prevent token overflow
      this.trimContext(session);

      // Save to database for persistence
      await this.saveMessageToDatabase(userId, input, llmResponse.content);

      return {
        response: llmResponse.content,
        sessionId: session.sessionId,
        model: llmResponse.model,
        provider: llmResponse.provider,
      };
    } catch (error) {
      console.error('Chat processing error:', error);
      throw new Error('Failed to process chat message');
    }
  }

  /**
   * Generate response using LLM with agriculture context
   */
  private async generateLLMResponse(
    input: string,
    session: ChatSession
  ): Promise<any> {
    // Build system prompt with agriculture expertise
    const systemPrompt = this.buildSystemPrompt(session.userRole);

    // Prepare messages for LLM (keep last N messages for context)
    const contextMessages: LLMMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...session.messages.slice(-this.maxContextMessages),
    ];

    // Call LLM
    const response = await llmService.generateResponse(
      contextMessages,
      0.7, // temperature for balanced creativity
      1000 // max tokens
    );

    return response;
  }

  /**
   * Build system prompt based on user role
   */
  private buildSystemPrompt(userRole?: string): string {
    const basePrompt = AgricultureKnowledgeService.getAgricultureContext();
    const platformContext = AgricultureKnowledgeService.getPlatformContext();

    let roleSpecificPrompt = '';

    if (userRole === 'farmer') {
      roleSpecificPrompt = `\n\n## User Role: Farmer
You are helping a farmer. Prioritize:
- Crop management and farming techniques
- Market prices and selling strategies
- Quality improvement and certifications
- Logistics and shipping
- Reputation building`;
    } else if (userRole === 'buyer') {
      roleSpecificPrompt = `\n\n## User Role: Buyer
You are helping a buyer. Prioritize:
- Finding quality products and suppliers
- Bulk purchasing strategies
- Price negotiation and market trends
- Logistics and delivery
- Supplier evaluation`;
    }

    return `${basePrompt}${roleSpecificPrompt}\n\n${platformContext}`;
  }

  /**
   * Check if question is about platform features (fast path)
   */
  private checkPlatformFeatures(input: string): string | null {
    const lowerInput = input.toLowerCase();

    // Platform-specific keywords that need accurate information
    const platformKeywords = {
      payment: 'payment system',
      order: 'orders and purchases',
      shipping: 'shipping and delivery',
      account: 'account management',
      quality: 'quality verification',
      blockchain: 'blockchain features',
      reputation: 'reputation system',
      escrow: 'escrow protection',
    };

    for (const [keyword, feature] of Object.entries(platformKeywords)) {
      if (lowerInput.includes(keyword)) {
        return feature;
      }
    }

    return null;
  }

  /**
   * Enhance platform response with LLM for natural language
   */
  private async enhanceWithLLM(
    input: string,
    platformFeature: string,
    session: ChatSession
  ): Promise<string> {
    const enhancementPrompt = `User asked about: "${input}"
Platform feature: ${platformFeature}

Provide a helpful, conversational response about this platform feature. Be specific and actionable.`;

    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant explaining platform features in a friendly, conversational way.',
      },
      {
        role: 'user',
        content: enhancementPrompt,
      },
    ];

    const response = await llmService.generateResponse(messages, 0.7, 500);
    return response.content;
  }

  /**
   * Get or create chat session
   */
  private getOrCreateSession(
    sessionId?: string,
    userId?: string,
    userRole?: 'farmer' | 'buyer' | 'general'
  ): ChatSession {
    let session: ChatSession;

    if (sessionId && this.sessions.has(sessionId)) {
      session = this.sessions.get(sessionId)!;
      session.lastMessageAt = new Date();
    } else {
      const newSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      session = {
        sessionId: newSessionId,
        userId,
        userRole: userRole || 'general',
        messages: [],
        createdAt: new Date(),
        lastMessageAt: new Date(),
      };
      this.sessions.set(newSessionId, session);
    }

    return session;
  }

  /**
   * Trim context to prevent token overflow
   */
  private trimContext(session: ChatSession): void {
    if (session.messages.length > this.maxContextMessages) {
      // Keep system message + last N messages
      const systemMessages = session.messages.filter((m) => m.role === 'system');
      const otherMessages = session.messages.filter((m) => m.role !== 'system');
      session.messages = [
        ...systemMessages,
        ...otherMessages.slice(-this.maxContextMessages),
      ];
    }
  }

  /**
   * Save message to database for persistence
   */
  private async saveMessageToDatabase(
    userId: string | undefined,
    userMessage: string,
    assistantMessage: string
  ): Promise<void> {
    if (!userId) return;

    try {
      await prisma.behaviorEvent.createMany({
        data: [
          {
            userId,
            action: 'CHAT',
            category: 'AI_ASSISTANT',
            metadata: JSON.stringify({ message: userMessage, role: 'user' }),
          },
          {
            userId,
            action: 'CHAT',
            category: 'AI_ASSISTANT',
            metadata: JSON.stringify({ message: assistantMessage, role: 'assistant' }),
          },
        ],
      });
    } catch (error) {
      console.error('Failed to save message to database:', error);
    }
  }

  /**
   * Get chat history for a user
   */
  async getChatHistory(userId: string, limit: number = 50): Promise<any> {
    try {
      const messages = await prisma.behaviorEvent.findMany({
        where: {
          userId,
          action: 'CHAT',
          category: 'AI_ASSISTANT',
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
      });

      return {
        messages: messages.reverse().map((m) => ({
          role: m.metadata ? JSON.parse(m.metadata).role : 'user',
          content: m.metadata ? JSON.parse(m.metadata).message : '',
          timestamp: m.timestamp,
        })),
        total: messages.length,
      };
    } catch (error) {
      console.error('Failed to get chat history:', error);
      return { messages: [], total: 0 };
    }
  }

  /**
   * Clear chat history for a user
   */
  async clearChatHistory(userId: string): Promise<void> {
    try {
      await prisma.behaviorEvent.deleteMany({
        where: {
          userId,
          action: 'CHAT',
          category: 'AI_ASSISTANT',
        },
      });
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  }

  /**
   * Cleanup old sessions
   */
  private cleanupOldSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastMessageAt.getTime() > this.sessionTimeout) {
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * Get session info
   */
  getSessionInfo(sessionId: string): ChatSession | null {
    return this.sessions.get(sessionId) || null;
  }
}

export const intelligentChatService = new IntelligentChatService();
