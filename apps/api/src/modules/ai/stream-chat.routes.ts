import { Router } from 'express';
import { StreamChatController } from './stream-chat.controller';

const router = Router();

// Authentication
router.post('/token', StreamChatController.generateToken);

// User management
router.post('/users', StreamChatController.createUser);

// Channel management
router.post('/channels', StreamChatController.createChannel);

// Agent management
router.post('/agents/start', StreamChatController.startAgent);
router.post('/agents/stop', StreamChatController.stopAgent);
router.post('/agents/message', StreamChatController.processMessage);
router.get('/agents/status/:channelId', StreamChatController.getAgentStatus);
router.get('/agents/types', StreamChatController.getAgentTypes);

// Utility endpoints
router.get('/health', StreamChatController.healthCheck);
router.get('/demo', StreamChatController.demo);
router.get('/stats', StreamChatController.getStats);

export default router;