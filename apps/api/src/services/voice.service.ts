import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface VoiceMessage {
  id: string;
  content: string;
  language: 'en' | 'hi' | 'mr';
  audioUrl: string;
  duration: number;
  timestamp: Date;
}

interface VoiceCommand {
  command: string;
  parameters: Record<string, any>;
  confidence: number;
}

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);
  private readonly speechToTextUrl = process.env.SPEECH_TO_TEXT_URL || 'https://api.deepgram.com';
  private readonly textToSpeechUrl = process.env.TEXT_TO_SPEECH_URL || 'https://api.cartesia.ai';

  async transcribeAudio(audioPath: string, language: 'en' | 'hi' | 'mr' = 'en'): Promise<string> {
    try {
      this.logger.log(`Transcribing audio in ${language}`);

      const response = await axios.post(
        `${this.speechToTextUrl}/v1/listen`,
        { audio_path: audioPath, language },
        {
          headers: {
            Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          },
          timeout: 30000,
        }
      );

      return response.data.results[0].transcript;
    } catch (error) {
      this.logger.error(`Speech-to-text failed: ${error.message}`);
      throw error;
    }
  }

  async synthesizeText(text: string, language: 'en' | 'hi' | 'mr' = 'en'): Promise<string> {
    try {
      this.logger.log(`Synthesizing text in ${language}`);

      const response = await axios.post(
        `${this.textToSpeechUrl}/v1/generate`,
        {
          text,
          language,
          voice: this.getVoiceForLanguage(language),
        },
        {
          headers: {
            'X-API-Key': process.env.CARTESIA_API_KEY,
          },
          timeout: 30000,
        }
      );

      return response.data.audio_url;
    } catch (error) {
      this.logger.error(`Text-to-speech failed: ${error.message}`);
      throw error;
    }
  }

  private getVoiceForLanguage(language: 'en' | 'hi' | 'mr'): string {
    const voices = {
      en: 'english-female',
      hi: 'hindi-female',
      mr: 'marathi-female',
    };
    return voices[language];
  }

  async parseVoiceCommand(transcript: string, language: 'en' | 'hi' | 'mr' = 'en'): Promise<VoiceCommand> {
    try {
      this.logger.log(`Parsing voice command: ${transcript}`);

      // Command patterns
      const patterns = {
        search: /search|find|look for/i,
        order: /order|buy|purchase/i,
        price: /price|cost|how much/i,
        quality: /quality|grade|condition/i,
        chat: /message|chat|talk/i,
        track: /track|status|where/i,
      };

      let command = 'unknown';
      let confidence = 0;

      for (const [cmd, pattern] of Object.entries(patterns)) {
        if (pattern.test(transcript)) {
          command = cmd;
          confidence = 0.9;
          break;
        }
      }

      return {
        command,
        parameters: this.extractParameters(transcript, command),
        confidence,
      };
    } catch (error) {
      this.logger.error(`Command parsing failed: ${error.message}`);
      throw error;
    }
  }

  private extractParameters(transcript: string, command: string): Record<string, any> {
    const params: Record<string, any> = {};

    // Extract product name
    const productMatch = transcript.match(/(?:for|about|on)\s+([a-zA-Z\s]+?)(?:\s+in|\s+at|$)/i);
    if (productMatch) {
      params.product = productMatch[1].trim();
    }

    // Extract location
    const locationMatch = transcript.match(/(?:in|at|from)\s+([a-zA-Z\s]+?)(?:\s+for|$)/i);
    if (locationMatch) {
      params.location = locationMatch[1].trim();
    }

    // Extract quantity
    const quantityMatch = transcript.match(/(\d+)\s+(?:kg|units|pieces|items)/i);
    if (quantityMatch) {
      params.quantity = parseInt(quantityMatch[1]);
    }

    return params;
  }

  async compressAudio(audioPath: string): Promise<string> {
    try {
      this.logger.log(`Compressing audio: ${audioPath}`);

      // Placeholder for audio compression
      // In production, use ffmpeg or similar
      return audioPath; // Return compressed audio path
    } catch (error) {
      this.logger.error(`Audio compression failed: ${error.message}`);
      throw error;
    }
  }

  async recordVoiceMessage(duration: number, language: 'en' | 'hi' | 'mr' = 'en'): Promise<VoiceMessage> {
    try {
      this.logger.log(`Recording voice message for ${duration}s in ${language}`);

      // Placeholder for voice recording
      return {
        id: `msg-${Date.now()}`,
        content: '',
        language,
        audioUrl: '',
        duration,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Voice recording failed: ${error.message}`);
      throw error;
    }
  }

  async detectLanguage(audioPath: string): Promise<'en' | 'hi' | 'mr'> {
    try {
      const response = await axios.post(
        `${this.speechToTextUrl}/v1/detect-language`,
        { audio_path: audioPath },
        {
          headers: {
            Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          },
        }
      );

      const language = response.data.language;
      return ['en', 'hi', 'mr'].includes(language) ? language : 'en';
    } catch (error) {
      this.logger.error(`Language detection failed: ${error.message}`);
      return 'en';
    }
  }
}
