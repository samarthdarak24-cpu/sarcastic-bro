/**
 * Chat Controller - ChatGPT-like AI endpoints
 * ALL responses are powered by LLM (Ollama)
 */

import { Request, Response } from 'express';
import { ollamaChatService } from '../../services/ollama-chat.service';

export class ChatController {
  /**
   * POST /api/chat
   * Send a message with optional file attachments and get AI response (LLM-powered only)
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const { message, sessionId, userRole } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (message.trim().length === 0) {
        return res.status(400).json({ error: 'Message cannot be empty' });
      }

      // Process uploaded files if any
      let fullMessage = message;
      const files = req.files as Express.Multer.File[] | undefined;
      
      if (files && files.length > 0) {
        const fileNames = files.map((f) => f.originalname).join(', ');
        fullMessage += `\n\n[Files attached: ${fileNames}]`;
        console.log(`[LLM Chat] Files attached: ${fileNames}`);
      }

      console.log(`[LLM Chat] User: ${message.substring(0, 50)}... | Role: ${userRole || 'general'}`);

      const response = await ollamaChatService.chat(
        fullMessage,
        sessionId,
        userRole
      );

      console.log(`[LLM Chat] Response generated in session: ${response.sessionId}`);

      res.json({
        ...response,
        filesProcessed: files ? files.length : 0,
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({
        error: error.message || 'Failed to process message',
      });
    }
  }

  /**
   * GET /api/chat/health
   * Check if Ollama is available
   */
  async health(req: Request, res: Response) {
    try {
      const available = await ollamaChatService.isAvailable();
      const models = await ollamaChatService.getAvailableModels();

      res.json({
        status: available ? 'ok' : 'unavailable',
        message: available
          ? 'Ollama is running'
          : 'Ollama is not running. Start it with: ollama serve',
        models: models,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to check Ollama status',
      });
    }
  }

  /**
   * GET /api/chat/history/:sessionId
   * Get conversation history
   */
  async getHistory(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      const history = ollamaChatService.getSessionHistory(sessionId);

      res.json({
        sessionId,
        messages: history,
        count: history.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * DELETE /api/chat/session/:sessionId
   * Clear session
   */
  async clearSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      ollamaChatService.clearSession(sessionId);

      res.json({
        success: true,
        message: 'Session cleared',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
