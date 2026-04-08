import { Request, Response, NextFunction } from 'express';
import FormData from 'form-data';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Controller for Whisper voice-to-text transcription
 * Forwards requests to Python AI service
 */
export class WhisperController {
  /**
   * Transcribe complete audio file
   */
  static async transcribeAudio(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No audio file provided'
        });
      }

      // Create form data for Python service
      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });
      formData.append('language', req.body.language || 'hi');
      formData.append('task', req.body.task || 'transcribe');

      // Forward to Python AI service
      const response = await axios.post(
        `${AI_SERVICE_URL}/whisper/transcribe`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 30000 // 30 second timeout
        }
      );

      res.status(200).json({
        success: true,
        data: response.data
      });
    } catch (error: any) {
      console.error('Transcription error:', error.message);
      
      if (error.response) {
        // Python service returned an error
        return res.status(error.response.status).json({
          success: false,
          error: error.response.data.detail || 'Transcription failed'
        });
      }
      
      next(error);
    }
  }

  /**
   * Transcribe audio chunk for streaming
   */
  static async transcribeChunk(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No audio chunk provided'
        });
      }

      // Create form data for Python service
      const formData = new FormData();
      formData.append('audio_chunk', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });
      formData.append('language', req.body.language || 'hi');
      
      if (req.body.context) {
        formData.append('context', req.body.context);
      }
      
      if (req.body.session_id) {
        formData.append('session_id', req.body.session_id);
      }
      
      formData.append('chunk_index', req.body.chunk_index || '0');

      // Forward to Python AI service
      const response = await axios.post(
        `${AI_SERVICE_URL}/whisper/transcribe-chunk`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 30000
        }
      );

      res.status(200).json({
        success: true,
        data: response.data
      });
    } catch (error: any) {
      console.error('Chunk transcription error:', error.message);
      
      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          error: error.response.data.detail || 'Chunk transcription failed'
        });
      }
      
      next(error);
    }
  }

  /**
   * Detect language from audio
   */
  static async detectLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No audio file provided'
        });
      }

      // Create form data for Python service
      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });

      // Forward to Python AI service
      const response = await axios.post(
        `${AI_SERVICE_URL}/whisper/detect-language`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 30000
        }
      );

      res.status(200).json({
        success: true,
        data: response.data
      });
    } catch (error: any) {
      console.error('Language detection error:', error.message);
      
      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          error: error.response.data.detail || 'Language detection failed'
        });
      }
      
      next(error);
    }
  }

  /**
   * Check Whisper service health
   */
  static async getHealthStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await axios.get(
        `${AI_SERVICE_URL}/whisper/health`,
        { timeout: 5000 }
      );

      res.status(200).json({
        success: true,
        data: response.data
      });
    } catch (error: any) {
      console.error('Health check error:', error.message);
      
      // Return degraded status if service is unreachable
      res.status(503).json({
        success: false,
        data: {
          status: 'unhealthy',
          model_loaded: false,
          error: 'Whisper service unreachable'
        }
      });
    }
  }
}
