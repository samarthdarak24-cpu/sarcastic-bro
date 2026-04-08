import { Request, Response } from 'express';
import { ollamaChatService } from '../../services/ollama-chat.service';

export class N8nChatController {
  /**
   * POST /api/n8n/chat
   * Handle chat messages - LLM-powered ONLY
   * Supports both 'chatInput' and 'message' field names
   */
  async handleChat(req: Request, res: Response) {
    try {
      const { chatInput, message, sessionId, userId, userRole, language } = req.body;
      
      // Support both 'chatInput' and 'message' field names
      const userMessage = chatInput || message;

      if (!userMessage) {
        return res.status(400).json({ error: 'chatInput or message is required' });
      }

      console.log(`[LLM N8N Chat] User: ${userMessage.substring(0, 50)}... | Role: ${userRole || 'general'} | Lang: ${language || 'en'}`);

      const response = await ollamaChatService.chat(
        userMessage,
        sessionId,
        userRole,
        language
      );
      
      console.log(`[LLM N8N Chat] Response generated in session: ${response.sessionId}`);

      res.json({
        response: response.response,
        sessionId: response.sessionId,
        model: response.model,
        provider: 'ollama'
      });
    } catch (error) {
      console.error('Chat Error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  }

  /**
   * Get chat history for a user
   */
  async getChatHistory(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const sessionId = req.query.sessionId as string;

      if (!userId && !sessionId) {
        return res.status(400).json({ error: 'userId or sessionId is required' });
      }

      // If sessionId provided, get history for that session
      if (sessionId) {
        const history = ollamaChatService.getSessionHistory(sessionId);
        return res.json({
          sessionId,
          messages: history,
          count: history.length
        });
      }

      // Otherwise return empty for now (would need database lookup for userId)
      res.json({
        userId,
        messages: [],
        count: 0
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ error: 'Failed to get chat history' });
    }
  }

  /**
   * Clear chat history for a user
   */
  async clearChatHistory(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const sessionId = req.query.sessionId as string;

      if (!userId && !sessionId) {
        return res.status(400).json({ error: 'userId or sessionId is required' });
      }

      // If sessionId provided, clear that session
      if (sessionId) {
        ollamaChatService.clearSession(sessionId);
        return res.json({ success: true, message: 'Session cleared' });
      }

      // Otherwise just return success
      res.json({ success: true, message: 'Chat history cleared' });
    } catch (error) {
      console.error('Clear history error:', error);
      res.status(500).json({ error: 'Failed to clear chat history' });
    }
  }
}
