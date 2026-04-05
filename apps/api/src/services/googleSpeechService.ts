/**
 * Google Cloud Speech-to-Text Service
 * Production-ready speech recognition using Google Cloud API
 */

import speech from '@google-cloud/speech';
import { Readable } from 'stream';

export class GoogleSpeechService {
  private client: speech.SpeechClient;

  constructor() {
    // Initialize Google Cloud Speech client
    // Credentials will be loaded from GOOGLE_APPLICATION_CREDENTIALS env variable
    this.client = new speech.SpeechClient();
  }

  /**
   * Convert audio buffer to text
   * @param audioBuffer - Audio data in WebM/Opus format
   * @param languageCode - Language code (e.g., 'en-IN', 'hi-IN', 'mr-IN')
   */
  async transcribeAudio(audioBuffer: Buffer, languageCode: string = 'hi-IN'): Promise<string> {
    const audio = {
      content: audioBuffer.toString('base64'),
    };

    const config = {
      encoding: 'WEBM_OPUS' as const,
      sampleRateHertz: 48000,
      languageCode: languageCode,
      alternativeLanguageCodes: ['en-IN', 'hi-IN', 'mr-IN'],
      enableAutomaticPunctuation: true,
      model: 'default',
      useEnhanced: true,
    };

    const request = {
      audio: audio,
      config: config,
    };

    try {
      const [response] = await this.client.recognize(request);
      const transcription = response.results
        ?.map(result => result.alternatives?.[0]?.transcript)
        .join('\n') || '';

      return transcription;
    } catch (error) {
      console.error('Google Speech API error:', error);
      throw new Error('Speech recognition failed');
    }
  }

  /**
   * Stream audio for real-time transcription
   * @param audioStream - Readable stream of audio data
   * @param languageCode - Language code
   * @param onTranscript - Callback for interim and final transcripts
   */
  async streamTranscribe(
    audioStream: Readable,
    languageCode: string = 'hi-IN',
    onTranscript: (transcript: string, isFinal: boolean) => void
  ): Promise<void> {
    const recognizeStream = this.client
      .streamingRecognize({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: languageCode,
          alternativeLanguageCodes: ['en-IN', 'hi-IN', 'mr-IN'],
          enableAutomaticPunctuation: true,
          interimResults: true,
          model: 'default',
          useEnhanced: true,
        },
        interimResults: true,
      })
      .on('error', (error) => {
        console.error('Streaming error:', error);
      })
      .on('data', (data) => {
        const result = data.results[0];
        if (result) {
          const transcript = result.alternatives[0].transcript;
          const isFinal = result.isFinal;
          onTranscript(transcript, isFinal);
        }
      });

    audioStream.pipe(recognizeStream);
  }
}

export const googleSpeechService = new GoogleSpeechService();
