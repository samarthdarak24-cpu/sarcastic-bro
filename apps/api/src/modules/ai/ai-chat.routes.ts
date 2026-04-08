import { Router } from 'express';
import { AIChatController } from './ai-chat.controller';

const router = Router();

// Simple chat endpoint
router.post('/chat', AIChatController.chat);

// Streaming chat endpoint
router.post('/stream', AIChatController.stream);
router.post('/chat/stream', AIChatController.chatStream);

// Health check
router.get('/health', AIChatController.health);

export default router;
