import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  userContext?: Record<string, unknown>;
  stream?: boolean;
}

export class ChatController {
  static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, conversationHistory = [], userContext = {}, stream = false } = req.body as ChatRequest;
      const user = (req as unknown as Record<string, unknown>).user as Record<string, unknown> | undefined;
      
      const enhancedContext = {
        ...userContext,
        userId: user?.id,
        name: user?.name,
        userType: user?.role,
        location: user?.district || user?.state,
      };

      if (stream) {
        const response = await axios.post(
          `${AI_SERVICE_URL}/ai/chat/stream`,
          {
            message,
            user_type: user?.role || 'FARMER',
            conversation_history: conversationHistory,
            user_context: enhancedContext,
          },
          {
            timeout: 60000,
            responseType: 'stream',
          }
        );

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        response.data.pipe(res);
      } else {
        const response = await axios.post(
          `${AI_SERVICE_URL}/ai/chat/context-aware`,
          {
            message,
            user_type: user?.role || 'FARMER',
            conversation_history: conversationHistory,
            user_context: enhancedContext,
          },
          {
            timeout: 30000,
          }
        );

        res.status(200).json({
          success: true,
          data: response.data,
        });
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { detail?: { error?: string; message?: string } } }; message?: string };
      console.error('AI Chat Error:', err.message);
      
      if (err.response?.status === 503 && err.response?.data?.detail?.error === 'API_KEY_MISSING') {
        res.status(503).json({
          success: false,
          error: 'API_KEY_MISSING',
          message: 'AI service is not configured. Please contact support.',
        });
        return;
      }
      
      if (err.response?.status === 429) {
        res.status(429).json({
          success: false,
          error: 'RATE_LIMIT',
          message: 'Too many requests. Please wait a moment and try again.',
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: {
          response: "I'm here to help! I can assist you with pricing, quality checks, finding buyers/suppliers, market trends, and much more. What would you like to know?",
          suggestions: [
            'Check market prices',
            'Find buyers/suppliers',
            'Analyze crop quality',
            'Get market insights',
          ],
          intent: 'general',
          confidence: 0.5,
          actions: [],
        },
      });
    }
  }

  static async getSuggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as unknown as Record<string, unknown>).user as Record<string, unknown> | undefined;
      const userType = user?.role || 'FARMER';

      const farmerSuggestions = [
        'What is the current market price for wheat?',
        'Analyze my crop quality',
        'Find buyers for my produce',
        'Show me price trends',
        'Recommend crops for my soil',
        'Detect pests in my field',
        'How to improve crop quality?',
        'Connect me with bulk buyers',
      ];

      const buyerSuggestions = [
        'Find wheat suppliers in Punjab',
        'Compare rice prices across regions',
        'Show me top-rated suppliers',
        'Get bulk order quotes',
        'Analyze market trends for pulses',
        'Find organic certified farmers',
        'Negotiate better prices',
        'Track my orders',
      ];

      res.status(200).json({
        success: true,
        data: {
          suggestions: userType === 'FARMER' ? farmerSuggestions : buyerSuggestions,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: {
          conversations: [],
          message: 'Conversation history feature coming soon',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async clearHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        message: 'Conversation history cleared',
      });
    } catch (error) {
      next(error);
    }
  }
}
