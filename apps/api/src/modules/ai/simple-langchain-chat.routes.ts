import { Router } from 'express';
import { SimpleLangChainChatController } from './simple-langchain-chat.controller';

const router = Router();

// Session management
router.post('/session', SimpleLangChainChatController.createSession);
router.get('/session/:sessionId/history', SimpleLangChainChatController.getChatHistory);
router.delete('/session/:sessionId', SimpleLangChainChatController.clearSession);

// Chat endpoints
router.post('/chat', SimpleLangChainChatController.chat);
router.post('/chat/stream', SimpleLangChainChatController.streamChat);

// Utility endpoints
router.get('/suggestions', SimpleLangChainChatController.getSuggestions);
router.get('/health', SimpleLangChainChatController.healthCheck);
router.get('/demo', SimpleLangChainChatController.demo);

export default router;