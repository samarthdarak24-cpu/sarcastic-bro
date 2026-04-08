import { Request, Response } from 'express';
import axios from 'axios';
import { socketService } from '../../services/socketService';

interface UserContext {
  userId: string;
  role: 'FARMER' | 'BUYER';
  location: string;
  crops?: string[];
  language: string;
  sessionId: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  language: string;
  metadata?: any;
}

export class OllamaChatController {
  private aiServiceUrl: string;

  constructor() {
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  /**
   * Stream chat response from Ollama AI
   */
  async streamChat(req: Request, res: Response) {
    try {
      const { message, context, conversationHistory, model, temperature } = req.body;
      const userId = (req as any).user?.id;

      if (!message || !context) {
        return res.status(400).json({
          success: false,
          message: 'Message and context are required'
        });
      }

      // Validate user context
      const userContext: UserContext = {
        userId: userId || context.userId,
        role: context.role || 'FARMER',
        location: context.location || 'Maharashtra',
        crops: context.crops || [],
        language: context.language || 'en',
        sessionId: context.sessionId || `session_${userId}_${Date.now()}`
      };

      // Set up Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      // Send initial connection event
      res.write(`data: ${JSON.stringify({
        type: 'connected',
        sessionId: userContext.sessionId
      })}\n\n`);

      try {
        // Call AI service for streaming response
        const aiResponse = await axios.post(
          `${this.aiServiceUrl}/ollama/chat/stream`,
          {
            message,
            context: userContext,
            conversation_history: conversationHistory || [],
            model: model || 'llama3.2',
            temperature: temperature || 0.7,
            stream: true
          },
          {
            responseType: 'stream',
            timeout: 60000 // 60 second timeout
          }
        );

        // Forward AI service stream to client
        aiResponse.data.on('data', (chunk: Buffer) => {
          const chunkStr = chunk.toString();
          
          // Parse and forward each chunk
          const lines = chunkStr.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6);
              if (data.trim()) {
                try {
                  const parsedData = JSON.parse(data);
                  
                  // Emit to Socket.IO for real-time updates
                  if (parsedData.type === 'content') {
                    socketService.emitToUser(userId, 'ai-chat-chunk', {
                      sessionId: userContext.sessionId,
                      content: parsedData.content,
                      type: 'content'
                    });
                  }
                  
                  // Forward to SSE client
                  res.write(`data: ${data}\n\n`);
                } catch (e) {
                  console.error('Failed to parse AI response chunk:', e);
                }
              }
            }
          }
        });

        aiResponse.data.on('end', () => {
          res.write(`data: ${JSON.stringify({ type: 'stream_end' })}\n\n`);
          res.end();
        });

        aiResponse.data.on('error', (error: any) => {
          console.error('AI service stream error:', error);
          res.write(`data: ${JSON.stringify({
            type: 'error',
            error: 'AI_SERVICE_ERROR',
            message: error.message
          })}\n\n`);
          res.end();
        });

      } catch (aiError: any) {
        console.error('AI service request failed:', aiError);
        
        let errorMessage = 'AI service unavailable';
        if (aiError.code === 'ECONNREFUSED') {
          errorMessage = 'Local AI service is not running. Please start the AI service.';
        } else if (aiError.response?.status === 404) {
          errorMessage = 'Ollama service not found. Please install and start Ollama.';
        }

        res.write(`data: ${JSON.stringify({
          type: 'error',
          error: 'AI_SERVICE_UNAVAILABLE',
          message: errorMessage
        })}\n\n`);
        res.end();
      }

    } catch (error: any) {
      console.error('Stream chat error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get complete chat response (non-streaming)
   */
  async completeChat(req: Request, res: Response) {
    try {
      const { message, context, conversationHistory, model, temperature } = req.body;
      const userId = (req as any).user?.id;

      if (!message || !context) {
        return res.status(400).json({
          success: false,
          message: 'Message and context are required'
        });
      }

      // Validate user context
      const userContext: UserContext = {
        userId: userId || context.userId,
        role: context.role || 'FARMER',
        location: context.location || 'Maharashtra',
        crops: context.crops || [],
        language: context.language || 'en',
        sessionId: context.sessionId || `session_${userId}_${Date.now()}`
      };

      // Call AI service
      const aiResponse = await axios.post(
        `${this.aiServiceUrl}/ollama/chat/complete`,
        {
          message,
          context: userContext,
          conversation_history: conversationHistory || [],
          model: model || 'llama3.2',
          temperature: temperature || 0.7,
          stream: false
        },
        {
          timeout: 30000 // 30 second timeout
        }
      );

      const result = aiResponse.data;

      // Emit to Socket.IO for real-time updates
      if (result.success) {
        socketService.emitToUser(userId, 'ai-chat-response', {
          sessionId: userContext.sessionId,
          response: result.response,
          suggestions: result.suggestions,
          metadata: result.metadata
        });
      }

      res.json({
        success: true,
        data: result
      });

    } catch (error: any) {
      console.error('Complete chat error:', error);
      
      let errorMessage = 'Failed to get AI response';
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Local AI service is not running. Please start the AI service.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Ollama service not found. Please install and start Ollama.';
      }

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  }

  /**
   * Check Ollama service health
   */
  async healthCheck(req: Request, res: Response) {
    try {
      const healthResponse = await axios.get(
        `${this.aiServiceUrl}/ollama/health`,
        { timeout: 5000 }
      );

      res.json({
        success: true,
        data: healthResponse.data
      });

    } catch (error: any) {
      console.error('Ollama health check failed:', error);
      
      res.json({
        success: false,
        message: 'Ollama service unavailable',
        data: {
          status: 'unhealthy',
          ollama_available: false,
          error: error.message
        }
      });
    }
  }

  /**
   * Get available Ollama models
   */
  async getModels(req: Request, res: Response) {
    try {
      const modelsResponse = await axios.get(
        `${this.aiServiceUrl}/ollama/models`,
        { timeout: 5000 }
      );

      res.json({
        success: true,
        data: modelsResponse.data
      });

    } catch (error: any) {
      console.error('Get models failed:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get available models',
        error: error.message
      });
    }
  }

  /**
   * Clear conversation history
   */
  async clearConversation(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const userId = (req as any).user?.id;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      // Call AI service to clear conversation
      await axios.delete(
        `${this.aiServiceUrl}/ollama/conversation/${sessionId}`,
        { timeout: 5000 }
      );

      // Emit to Socket.IO
      socketService.emitToUser(userId, 'conversation-cleared', {
        sessionId
      });

      res.json({
        success: true,
        message: 'Conversation cleared successfully'
      });

    } catch (error: any) {
      console.error('Clear conversation failed:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to clear conversation',
        error: error.message
      });
    }
  }

  /**
   * Get conversation history
   */
  async getConversation(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required'
        });
      }

      // Call AI service to get conversation
      const conversationResponse = await axios.get(
        `${this.aiServiceUrl}/ollama/conversation/${sessionId}`,
        { timeout: 5000 }
      );

      res.json({
        success: true,
        data: conversationResponse.data
      });

    } catch (error: any) {
      console.error('Get conversation failed:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get conversation history',
        error: error.message
      });
    }
  }

  /**
   * Get quick action suggestions based on user context
   */
  async getQuickActions(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role || 'FARMER';
      const userLocation = (req as any).user?.location || 'Maharashtra';

      let quickActions: string[] = [];

      if (userRole === 'FARMER') {
        quickActions = [
          "What crops should I grow this season?",
          "Current market prices in my area",
          "How to improve crop quality?",
          "Pest control for my crops",
          "Weather forecast for farming",
          "Government schemes for farmers",
          "Best time to sell my produce",
          "Find buyers for my crops"
        ];
      } else if (userRole === 'BUYER') {
        quickActions = [
          "Find reliable suppliers nearby",
          "Compare prices across regions",
          "Quality standards and grading",
          "Seasonal availability calendar",
          "Bulk purchase opportunities",
          "Logistics and transportation",
          "Contract negotiation tips",
          "Market trends and analysis"
        ];
      }

      res.json({
        success: true,
        data: {
          quickActions,
          userRole,
          userLocation
        }
      });

    } catch (error: any) {
      console.error('Get quick actions failed:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get quick actions',
        error: error.message
      });
    }
  }
}