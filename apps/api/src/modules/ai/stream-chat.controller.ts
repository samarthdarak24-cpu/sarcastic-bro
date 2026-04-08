import { Request, Response } from 'express';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export class StreamChatController {
  // Generate authentication token
  static async generateToken(req: Request, res: Response) {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const response = await axios.post(
        `${AI_SERVICE_URL}/stream-chat/token`,
        { user_id },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Stream Chat token error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to generate token',
        details: error.response?.data || error.message,
      });
    }
  }

  // Create user
  static async createUser(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/stream-chat/users`,
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Stream Chat user creation error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to create user',
        details: error.response?.data || error.message,
      });
    }
  }

  // Create channel
  static async createChannel(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/stream-chat/channels`,
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Stream Chat channel creation error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to create channel',
        details: error.response?.data || error.message,
      });
    }
  }

  // Start AI agent
  static async startAgent(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/stream-chat/agents/start`,
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Stream Chat start agent error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to start agent',
        details: error.response?.data || error.message,
      });
    }
  }

  // Stop AI agent
  static async stopAgent(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/stream-chat/agents/stop`,
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Stream Chat stop agent error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to stop agent',
        details: error.response?.data || error.message,
      });
    }
  }

  // Process message with agents
  static async processMessage(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AI_SERVICE_URL}/stream-chat/agents/message`,
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Stream Chat message processing error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to process message',
        details: error.response?.data || error.message,
      });
    }
  }

  // Get agent status
  static async getAgentStatus(req: Request, res: Response) {
    try {
      const { channelId } = req.params;
      
      const response = await axios.get(
        `${AI_SERVICE_URL}/stream-chat/agents/status/${channelId}`
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Stream Chat agent status error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to get agent status',
        details: error.response?.data || error.message,
      });
    }
  }

  // Get available agent types
  static async getAgentTypes(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${AI_SERVICE_URL}/stream-chat/agents/types`
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Stream Chat agent types error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to get agent types',
        details: error.response?.data || error.message,
      });
    }
  }

  // Health check
  static async healthCheck(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${AI_SERVICE_URL}/stream-chat/health`
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Stream Chat health check error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Health check failed',
        details: error.response?.data || error.message,
      });
    }
  }

  // Demo endpoint
  static async demo(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${AI_SERVICE_URL}/stream-chat/demo`
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Stream Chat demo error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Demo failed',
        details: error.response?.data || error.message,
      });
    }
  }

  // Get service stats
  static async getStats(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${AI_SERVICE_URL}/stream-chat/stats`
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Stream Chat stats error:', error.message);
      res.status(error.response?.status || 500).json({
        error: 'Failed to get stats',
        details: error.response?.data || error.message,
      });
    }
  }
}