/**
 * Voice Assistant Routes
 * Complete Whisper + GPT workflow
 */

import { Router } from 'express';
import { voiceController } from './voice.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// All voice routes require authentication
router.use(authMiddleware);

// Complete voice workflow (Whisper + GPT + Execution + TTS)
router.post('/process', voiceController.processVoiceCommand.bind(voiceController));

// Individual steps
router.post('/transcribe', voiceController.transcribeAudio.bind(voiceController));
router.post('/classify-intent', voiceController.classifyIntent.bind(voiceController));
router.post('/execute', voiceController.executeCommand.bind(voiceController));
router.post('/text-to-speech', voiceController.textToSpeech.bind(voiceController));

// Session and analytics
router.get('/history/:sessionId', voiceController.getHistory.bind(voiceController));
router.get('/analytics', voiceController.getAnalytics.bind(voiceController));

export default router;
