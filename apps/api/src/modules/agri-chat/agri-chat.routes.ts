/**
 * AgriChat Routes - 15 Integrated Subfeatures
 */

import { Router } from 'express';
import { AgriChatController } from './agri-chat.controller';

const router = Router();
const controller = new AgriChatController(null as any);

// ============================================
// SUBFEATURE 1: Real-time Messaging
// ============================================
router.post('/messages/send', (req, res) => controller.sendMessage(req.body).then(r => res.json(r)));
router.get('/conversations/:conversationId/messages', (req, res) => controller.getMessages(req.params.conversationId).then(r => res.json(r)));
router.get('/conversations', (req, res) => controller.getConversations(req.query.userId as string).then(r => res.json(r)));
router.put('/conversations/:conversationId/read', (req, res) => controller.markAsRead(req.params.conversationId, req.body).then(r => res.json(r)));

// ============================================
// SUBFEATURE 2: Smart Quote Generation
// ============================================
router.post('/quotes/generate', (req, res) => controller.generateQuote(req.body).then(r => res.json(r)));

// ============================================
// SUBFEATURE 3: Negotiation Assistant
// ============================================
router.post('/negotiations/suggestions', (req, res) => controller.getNegotiationSuggestions(req.body).then(r => res.json(r)));

// ============================================
// SUBFEATURE 4: Contract Management
// ============================================
router.post('/contracts/create', (req, res) => controller.createContract(req.body).then(r => res.json(r)));

// ============================================
// SUBFEATURE 5: Payment Integration
// ============================================
router.post('/payments/initiate', (req, res) => controller.initiatePayment(req.body).then(r => res.json(r)));

// ============================================
// SUBFEATURE 6: Location & Logistics Tracking
// ============================================
router.post('/shipments/track', (req, res) => controller.trackShipment(req.body).then(r => res.json(r)));

// ============================================
// SUBFEATURE 7: Product Catalog Integration
// ============================================
router.get('/products/search', (req, res) => controller.searchProducts(req.query.q as string, req.query.filters as string).then(r => res.json(r)));

// ============================================
// SUBFEATURE 8: AI-Powered Recommendations
// ============================================
router.get('/recommendations/:userId', (req, res) => controller.getRecommendations(req.params.userId, req.query.role as string).then(r => res.json(r)));

// ============================================
// SUBFEATURE 9: Document Management
// ============================================
router.post('/documents/upload', (req, res) => controller.uploadDocument(req.body).then(r => res.json(r)));

// ============================================
// SUBFEATURE 10: Quality Assurance Feedback
// ============================================
router.post('/quality/feedback', (req, res) => controller.submitQualityFeedback(req.body).then(r => res.json(r)));

// ============================================
// SUBFEATURE 11: Dispute Resolution
// ============================================
router.post('/disputes/initiate', (req, res) => controller.initiateDispute(req.body).then(r => res.json(r)));

// ============================================
// SUBFEATURE 12: Notification & Alerts
// ============================================
router.get('/notifications/:userId', (req, res) => controller.getNotifications(req.params.userId).then(r => res.json(r)));

// ============================================
// SUBFEATURE 13: Reputation & Reviews
// ============================================
router.post('/reviews/submit', (req, res) => controller.submitReview(req.body).then(r => res.json(r)));

// ============================================
// SUBFEATURE 14: Group Chat & Collaboration
// ============================================
router.post('/groups/create', (req, res) => controller.createGroupChat(req.body).then(r => res.json(r)));

// ============================================
// SUBFEATURE 15: Analytics & Insights
// ============================================
router.get('/analytics/:userId', (req, res) => controller.getChatAnalytics(req.params.userId, req.query.period as string).then(r => res.json(r)));

// ============================================
// Health Check
// ============================================
router.get('/health', (req, res) => controller.health().then(r => res.json(r)));

export default router;
