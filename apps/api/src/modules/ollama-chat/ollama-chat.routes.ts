import { Router } from 'express';
import { OllamaChatController } from './ollama-chat.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const ollamaChatController = new OllamaChatController();

// Health check (no auth required)
router.get('/health', ollamaChatController.healthCheck.bind(ollamaChatController));

// Get available models (no auth required for now)
router.get('/models', ollamaChatController.getModels.bind(ollamaChatController));

// Chat endpoints (require authentication)
router.post('/stream', authenticateToken, ollamaChatController.streamChat.bind(ollamaChatController));
router.post('/complete', authenticateToken, ollamaChatController.completeChat.bind(ollamaChatController));

// Conversation management
router.delete('/conversation/:sessionId', authenticateToken, ollamaChatController.clearConversation.bind(ollamaChatController));
router.get('/conversation/:sessionId', authenticateToken, ollamaChatController.getConversation.bind(ollamaChatController));

// Quick actions
router.get('/quick-actions', authenticateToken, ollamaChatController.getQuickActions.bind(ollamaChatController));

export { router as ollamaChatRoutes };