import { Request, Response } from 'express';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export class LangChainChatController {
  // Create chat session
  static async createSession(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/langchain-chat/session`,
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('LangChain session creation error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to create chat session',
        details: error.response?.data || error.message,
      });
    }
  }

  // Send chat message
  static async chat(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/langchain-chat/chat`,
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('LangChain chat error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to process chat message',
        details: error.response?.data || error.message,
      });
    }
  }

  // Stream chat response
  static async streamChat(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/langchain-chat/chat/stream`,
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          responseType: 'stream',
        }
      );

      // Set headers for Server-Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Pipe the stream from AI service to client
      response.data.pipe(res);

      // Handle stream end
      response.data.on('end', () => {
        res.end();
      });

      // Handle errors
      response.data.on('error', (error: any) => {
        console.error('Stream error:', error);
        res.end();
      });

    } catch (error: any) {
      console.error('LangChain stream error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to stream chat response',
        details: error.response?.data || error.message,
      });
    }
  }

  // Get chat history
  static async getChatHistory(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      
      const response = await axios.get(
        `${AI_SERVICE_URL}/langchain-chat/session/${sessionId}/history`
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('LangChain history error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to get chat history',
        details: error.response?.data || error.message,
      });
    }
  }

  // Clear chat session
  static async clearSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      
      const response = await axios.delete(
        `${AI_SERVICE_URL}/langchain-chat/session/${sessionId}`
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('LangChain clear session error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to clear session',
        details: error.response?.data || error.message,
      });
    }
  }

  // Get suggestions
  static async getSuggestions(req: Request, res: Response) {
    try {
      const { context = 'general' } = req.query;
      
      const response = await axios.get(
        `${AI_SERVICE_URL}/langchain-chat/suggestions?context=${context}`
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('LangChain suggestions error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to get suggestions',
        details: error.response?.data || error.message,
      });
    }
  }

  // Health check
  static async healthCheck(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${AI_SERVICE_URL}/langchain-chat/health`
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('LangChain health check error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Health check failed',
        details: error.response?.data || error.message,
      });
    }
  }

  // Get knowledge base stats
  static async getKnowledgeBaseStats(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${AI_SERVICE_URL}/langchain-chat/knowledge-base/stats`
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Knowledge base stats error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to get knowledge base stats',
        details: error.response?.data || error.message,
      });
    }
  }
}