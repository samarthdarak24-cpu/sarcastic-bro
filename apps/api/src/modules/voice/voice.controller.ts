/**
 * Voice Assistant Controller
 * Complete Whisper + GPT workflow for voice commands
 */

import { Request, Response } from 'express';
import { VoiceService } from './voice.service';
import { openaiService } from '../../services/openaiService';

const voiceService = new VoiceService();

export class VoiceController {
  /**
   * Complete voice workflow: Whisper transcription + GPT intent classification
   * POST /api/voice/process
   * 
   * Steps:
   * 1. Receive audio from frontend
   * 2. Send to Whisper for transcription
   * 3. Get text from Whisper
   * 4. Send text to GPT for intent classification
   * 5. GPT returns intent + action
   * 6. Execute action via backend API
   * 7. Generate response
   * 8. Convert to speech (optional)
   * 9. Return to frontend
   */
  async processVoiceCommand(req: Request, res: Response) {
    try {
      const { audio, language, userRole } = req.body;

      if (!audio) {
        return res.status(400).json({ error: 'Audio data is required' });
      }

      // Check if OpenAI is configured
      if (!openaiService.isConfigured()) {
        return res.status(503).json({ 
          error: 'Voice service not configured',
          message: 'OpenAI API key is required. Please configure OPENAI_API_KEY in environment variables.'
        });
      }

      // Step 2-3: Transcribe audio using Whisper
      const audioBuffer = Buffer.from(audio, 'base64');
      const transcript = await openaiService.transcribeAudio(
        audioBuffer,
        language || 'hi'
      );

      if (!transcript || transcript.trim().length === 0) {
        return res.status(400).json({ 
          error: 'No speech detected',
          transcript: ''
        });
      }

      // Step 4-5: Classify intent using GPT
      const intent = await openaiService.classifyIntent(
        transcript,
        userRole || 'BUYER',
        language || 'hi',
        req.body.sessionContext
      );

      // Step 6: Execute action if required
      let executionResult = null;
      if (intent.action_required && intent.api_endpoint) {
        executionResult = await voiceService.executeCommand(
          intent.intent,
          intent.entities,
          req.user?.id
        );
      }

      // Step 7: Generate natural response
      const response = executionResult 
        ? await openaiService.generateResponse(
            intent.intent,
            intent.entities,
            executionResult,
            language || 'hi'
          )
        : intent.response;

      // Step 8: Convert to speech (optional)
      let audioResponse = null;
      if (req.body.includeAudio) {
        const audioBuffer = await openaiService.textToSpeech(response, language || 'hi');
        audioResponse = audioBuffer.toString('base64');
      }

      // Step 9: Return complete result
      res.json({
        transcript,
        intent: intent.intent,
        entities: intent.entities,
        confidence: intent.confidence,
        response,
        audioResponse,
        executionResult,
        success: true
      });
    } catch (error: any) {
      console.error('Voice processing error:', error);
      res.status(500).json({ 
        error: error.message,
        success: false
      });
    }
  }

  /**
   * Transcribe audio to text using Whisper
   * POST /api/voice/transcribe
   * Step 2-3: Record voice → Send to Whisper → Get text
   */
  async transcribeAudio(req: Request, res: Response) {
    try {
      const { audio, language } = req.body;

      if (!audio) {
        return res.status(400).json({ error: 'Audio data is required' });
      }

      // Check if OpenAI is configured
      if (!openaiService.isConfigured()) {
        return res.status(503).json({ 
          error: 'Voice service not configured',
          message: 'OpenAI API key is required'
        });
      }

      // Convert base64 audio to buffer
      const audioBuffer = Buffer.from(audio, 'base64');
      
      // Transcribe using Whisper
      const transcript = await openaiService.transcribeAudio(
        audioBuffer,
        language || 'hi'
      );

      res.json({ transcript });
    } catch (error: any) {
      console.error('Transcription error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Classify voice command intent using GPT
   * POST /api/voice/classify-intent
   * Step 4-5: Send to AI (GPT) → AI returns intent + action
   */
  async classifyIntent(req: Request, res: Response) {
    try {
      const { transcript, language, userRole, sessionContext } = req.body;

      if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required' });
      }

      // Check if OpenAI is configured
      if (!openaiService.isConfigured()) {
        // Fallback to local intent classification
        const intent = await voiceService.classifyIntent(
          transcript,
          language || 'hi',
          userRole || 'FARMER',
          sessionContext
        );
        return res.json(intent);
      }

      // Use GPT for intent classification
      const intent = await openaiService.classifyIntent(
        transcript,
        userRole || 'BUYER',
        language || 'hi',
        sessionContext
      );

      res.json(intent);
    } catch (error: any) {
      console.error('Intent classification error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Execute voice command
   * POST /api/voice/execute
   * Step 7: Kiro triggers API workflow → Step 8: Backend executes
   */
  async executeCommand(req: Request, res: Response) {
    try {
      const { intent, entities, userId } = req.body;

      if (!intent) {
        return res.status(400).json({ error: 'Intent is required' });
      }

      const result = await voiceService.executeCommand(
        intent,
        entities,
        userId || req.user?.id
      );

      res.json(result);
    } catch (error: any) {
      console.error('Command execution error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Convert text to speech using OpenAI TTS
   * POST /api/voice/text-to-speech
   * Step 10: Convert to voice
   */
  async textToSpeech(req: Request, res: Response) {
    try {
      const { text, language } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // Check if OpenAI is configured
      if (!openaiService.isConfigured()) {
        return res.status(503).json({ 
          error: 'Voice service not configured',
          message: 'OpenAI API key is required'
        });
      }

      // Generate speech
      const audioBuffer = await openaiService.textToSpeech(text, language || 'hi');
      const audioBase64 = audioBuffer.toString('base64');

      res.json({ audio: audioBase64 });
    } catch (error: any) {
      console.error('TTS error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get voice session history
   * GET /api/voice/history/:sessionId
   */
  async getHistory(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      const history = await voiceService.getSessionHistory(sessionId);

      res.json(history);
    } catch (error: any) {
      console.error('History retrieval error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get voice analytics
   * GET /api/voice/analytics
   */
  async getAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const analytics = await voiceService.getVoiceAnalytics(userId);

      res.json(analytics);
    } catch (error: any) {
      console.error('Analytics retrieval error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const voiceController = new VoiceController();

  /**
   * Classify voice command intent
   * POST /api/voice/classify-intent
   */
  async classifyIntent(req: Request, res: Response) {
    try {
      const { transcript, language, userRole, sessionContext } = req.body;

      if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required' });
      }

      const intent = await voiceService.classifyIntent(
        transcript,
        language || 'hi',
        userRole || 'FARMER',
        sessionContext
      );

      res.json(intent);
    } catch (error: any) {
      console.error('Intent classification error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Execute voice command
   * POST /api/voice/execute
   */
  async executeCommand(req: Request, res: Response) {
    try {
      const { intent, entities, userId } = req.body;

      if (!intent) {
        return res.status(400).json({ error: 'Intent is required' });
      }

      const result = await voiceService.executeCommand(
        intent,
        entities,
        userId || req.user?.id
      );

      res.json(result);
    } catch (error: any) {
      console.error('Command execution error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get voice session history
   * GET /api/voice/history/:sessionId
   */
  async getHistory(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      const history = await voiceService.getSessionHistory(sessionId);

      res.json(history);
    } catch (error: any) {
      console.error('History retrieval error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get voice analytics
   * GET /api/voice/analytics
   */
  async getAnalytics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const analytics = await voiceService.getVoiceAnalytics(userId);

      res.json(analytics);
    } catch (error: any) {
      console.error('Analytics retrieval error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const voiceController = new VoiceController();
