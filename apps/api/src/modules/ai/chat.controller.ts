import { Request, Response, NextFunction } from 'express';
import { OllamaService } from '../../services/ollamaService';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'bot';
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
      const { message, conversationHistory = [], userContext = {}, stream = true } = req.body as ChatRequest;
      const user = (req as any).user as Record<string, unknown> | undefined;
      const role = (user?.role as 'FARMER' | 'BUYER' | 'ADMIN') || 'FARMER';
      
      const history = conversationHistory.map(m => ({
        role: m.role === 'bot' || m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      })).slice(-10); // Keep last 10 messages for context

      if (stream) {
        let buffer = '';
        const ollamaStream = await OllamaService.chatStream({
          message,
          role,
          history
        });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        // Initial metadata chunk
        const initialMetadata = {
          type: 'metadata',
          intent: 'GENERAL',
          confidence: 0.95,
          suggestions: role === 'FARMER' ? ['Best crop to grow?', 'Should I sell?'] : ['Market trends', 'Top suppliers']
        };
        res.write(`data: ${JSON.stringify(initialMetadata)}\n\n`);

        ollamaStream.on('data', (chunk: Buffer) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const cleanLine = line.trim();
            if (!cleanLine) continue;

            try {
              const data = JSON.parse(cleanLine);
              if (data.message && data.message.content) {
                res.write(`data: ${JSON.stringify({ type: 'content', content: data.message.content })}\n\n`);
              }
              if (data.done) {
                res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
                res.end();
              }
            } catch (e) {
              // Partial JSON
            }
          }
        });

        ollamaStream.on('error', (err: any) => {
          console.error('[AI Stream Error]', err);
          res.write(`data: ${JSON.stringify({ type: 'error', error: 'OLLAMA_ERROR', message: 'Local AI failed' })}\n\n`);
          res.end();
        });

      } else {
        const responseData = await OllamaService.chat({
          message,
          role,
          history
        });

        res.status(200).json({
          success: true,
          data: {
              response: responseData.response,
              intent: responseData.intent,
              suggestions: responseData.suggestions,
              confidence: 0.95
          }
        });
      }
    } catch (error: unknown) {
      console.error('AI Chat Error:', (error as Error).message);
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  static async getSuggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as any).user as Record<string, unknown> | undefined;
      const userType = user?.role || 'FARMER';

      const farmerSuggestions = [
        'Best crop to grow now?',
        'Should I sell my harvest or wait?',
        'Where are the best export opportunities?',
        'Analyze my current crop quality',
        'Recommend crops for my soil',
        'Detect pests in my field',
      ];

      const buyerSuggestions = [
        'Find reliable wheat suppliers',
        'Should I buy now or wait for price drop?',
        'What is the export potential for organic rice?',
        'Show me top-rated suppliers',
        'Analyze market trends for pulses',
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
