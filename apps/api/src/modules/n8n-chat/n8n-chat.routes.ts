import { Router } from 'express';
import { N8nChatController } from './n8n-chat.controller';

const router = Router();
const controller = new N8nChatController();

/**
 * GET /api/n8n/health
 * Health check endpoint
 */
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'N8N Chat service is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/n8n/chat
 * Handle chat messages - LLM-powered intelligent responses
 * 
 * Request body:
 * {
 *   "chatInput": "User's message",
 *   "sessionId": "optional-session-id",
 *   "userId": "optional-user-id",
 *   "userRole": "farmer|buyer|general"
 * }
 * 
 * Response:
 * {
 *   "response": "AI response",
 *   "sessionId": "session-id",
 *   "model": "llama2|gpt-4o-mini",
 *   "provider": "ollama|openai"
 * }
 */
router.post('/chat', (req, res) => controller.handleChat(req, res));

/**
 * GET /api/n8n/chat/history/:userId
 * Get chat history for a user
 */
router.get('/chat/history/:userId', (req, res) => controller.getChatHistory(req, res));

/**
 * DELETE /api/n8n/chat/history/:userId
 * Clear chat history for a user
 */
router.delete('/chat/history/:userId', (req, res) => controller.clearChatHistory(req, res));

export default router;
