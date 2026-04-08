import { Request, Response } from 'express';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export class AIChatController {
  /**
   * Simple chat endpoint - connects directly to AI service
   */
  static async chat(req: Request, res: Response) {
    try {
      const { message, user_type = 'FARMER', user_context = {} } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const user = (req as any).user;
      const enrichedContext = {
        ...user_context,
        userId: user?.id,
        name: user?.name,
        role: user?.role,
        email: user?.email
      };

      // Call AI service directly - try super chat first
      let aiResponse;
      try {
        const superResponse = await axios.post(
          `${AI_SERVICE_URL}/super-chat/context-aware`,
          {
            message,
            user_type: user?.role || user_type,
            user_context: enrichedContext
          },
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        aiResponse = superResponse;
      } catch (superError) {
        console.log('Super chat not available, trying regular AI...');
        // Fallback to regular AI service
        aiResponse = await axios.post(
          `${AI_SERVICE_URL}/ai/chat/context-aware`,
          {
            message,
            user_type: user?.role || user_type,
            user_context: enrichedContext
          },
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      return res.json({
        success: true,
        response: aiResponse.data.response,
        suggestions: aiResponse.data.suggestions || [],
        intent: aiResponse.data.intent,
        confidence: aiResponse.data.confidence,
        actions: aiResponse.data.actions || []
      });

    } catch (error: any) {
      console.error('AI Chat Error:', error.message);
      
      // Return a friendly fallback response
      return res.json({
        success: true,
        response: "Hello! I'm your AI assistant. I can help you with farming advice, market prices, and platform features. How can I assist you today?",
        suggestions: [
          "What are today's market prices?",
          "How can I improve my crop yield?",
          "Show me available buyers"
        ],
        intent: "GENERAL",
        confidence: 0.5
      });
    }
  }

  /**
   * Streaming chat endpoint
   */
  static async stream(req: Request, res: Response) {
    try {
      const { message, conversationHistory, userContext, stream = true } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const user = (req as any).user;
      const enrichedContext = {
        ...userContext,
        userId: user?.id,
        name: user?.name,
        role: user?.role,
        email: user?.email
      };

      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');

      try {
        // Call AI service for streaming
        const aiResponse = await axios.post(
          `${AI_SERVICE_URL}/super-chat/context-aware`,
          {
            message,
            user_type: user?.role || 'FARMER',
            user_context: enrichedContext
          },
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (aiResponse.data.response) {
          const response = aiResponse.data.response;
          const words = response.split(' ');
          
          // Stream word by word
          for (let i = 0; i < words.length; i++) {
            const chunk = {
              type: 'content',
              content: words[i] + ' ',
              index: i
            };
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            
            // Small delay for streaming effect
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          // Send suggestions
          if (aiResponse.data.suggestions) {
            const suggestionsChunk = {
              type: 'suggestions',
              suggestions: aiResponse.data.suggestions
            };
            res.write(`data: ${JSON.stringify(suggestionsChunk)}\n\n`);
          }

          // Send done signal
          const doneChunk = {
            type: 'done',
            response: response,
            suggestions: aiResponse.data.suggestions || []
          };
          res.write(`data: ${JSON.stringify(doneChunk)}\n\n`);
        }

      } catch (aiError: any) {
        console.error('AI streaming error:', aiError.message);
        
        // Fallback response
        const fallbackResponse = "I'm here to help with your agricultural questions! Could you please rephrase your question?";
        const words = fallbackResponse.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          const chunk = {
            type: 'content',
            content: words[i] + ' ',
            index: i
          };
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        const doneChunk = {
          type: 'done',
          response: fallbackResponse,
          suggestions: [
            "What crops should I grow?",
            "Current market prices",
            "Farming techniques",
            "Pest control advice"
          ]
        };
        res.write(`data: ${JSON.stringify(doneChunk)}\n\n`);
      }

      res.end();

    } catch (error: any) {
      console.error('Stream Error:', error.message);
      
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      const errorChunk = {
        type: 'error',
        error: 'Failed to get AI response'
      };
      res.write(`data: ${JSON.stringify(errorChunk)}\n\n`);
      res.end();
    }
  }

  /**
   * Streaming chat endpoint
   */
  static async chatStream(req: Request, res: Response) {
    try {
      const { message, user_type = 'FARMER', user_context = {} } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Call AI service
      const response = await axios.post(
        `${AI_SERVICE_URL}/ai/chat/stream`,
        {
          message,
          user_type,
          user_context
        },
        {
          responseType: 'stream',
          timeout: 30000
        }
      );

      // Pipe the stream to the client
      response.data.pipe(res);

    } catch (error: any) {
      console.error('AI Chat Stream Error:', error.message);
      
      // Send fallback response
      res.write(`data: Hello! I'm your AI assistant. How can I help you today?\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
    }
  }

  /**
   * Health check
   */
  static async health(req: Request, res: Response) {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/health`, {
        timeout: 5000
      });
      
      return res.json({
        status: 'healthy',
        ai_service: response.data
      });
    } catch (error) {
      return res.json({
        status: 'degraded',
        ai_service: 'unavailable'
      });
    }
  }
}
