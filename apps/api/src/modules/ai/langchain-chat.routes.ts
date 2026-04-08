import { Router } from 'express';
import { LangChainChatController } from './langchain-chat.controller';

const router = Router();

// Session management
router.post('/session', LangChainChatController.createSession);
router.get('/session/:sessionId/history', LangChainChatController.getChatHistory);
router.delete('/session/:sessionId', LangChainChatController.clearSession);

// Chat endpoints
router.post('/chat', LangChainChatController.chat);
router.post('/chat/stream', LangChainChatController.streamChat);

// Utility endpoints
router.get('/suggestions', LangChainChatController.getSuggestions);
router.get('/health', LangChainChatController.healthCheck);
router.get('/knowledge-base/stats', LangChainChatController.getKnowledgeBaseStats);

export default router;