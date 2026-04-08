/**
 * Voice Service - Handles speech-to-text conversion
 * Uses Web Speech API for browser-based transcription
 */

interface VoiceServiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

class VoiceService {
  private recognition: any;
  private isListening: boolean = false;
  private transcript: string = '';
  private isFinal: boolean = false;

  constructor(config: VoiceServiceConfig = {}) {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.language = config.language || 'en-US';
    this.recognition.continuous = config.continuous || false;
    this.recognition.interimResults = config.interimResults !== false;
  }

  /**
   * Start listening for voice input
   */
  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): void {
    if (!this.recognition) {
      onError('Speech Recognition not supported');
      return;
    }

    this.isListening = true;
    this.transcript = '';

    this.recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          this.transcript += transcript + ' ';
          this.isFinal = true;
        } else {
          interimTranscript += transcript;
        }
      }

      const finalTranscript = this.transcript + interimTranscript;
      onResult(finalTranscript, this.isFinal);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError(`Error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      onError('Failed to start voice recognition');
    }
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Abort listening
   */
  abort(): void {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening = false;
      this.transcript = '';
    }
  }

  /**
   * Get current transcript
   */
  getTranscript(): string {
    return this.transcript;
  }

  /**
   * Check if currently listening
   */
  isActive(): boolean {
    return this.isListening;
  }

  /**
   * Reset transcript
   */
  reset(): void {
    this.transcript = '';
    this.isFinal = false;
  }

  /**
   * Check if browser supports Speech Recognition
   */
  static isSupported(): boolean {
    return !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  /**
   * Get available languages
   */
  static getAvailableLanguages(): string[] {
    return [
      'en-US',
      'en-GB',
      'hi-IN',
      'mr-IN',
      'ta-IN',
      'te-IN',
      'kn-IN',
      'ml-IN',
      'bn-IN',
      'gu-IN',
      'pa-IN',
      'es-ES',
      'fr-FR',
      'de-DE',
      'it-IT',
      'pt-BR',
      'zh-CN',
      'ja-JP',
      'ko-KR',
    ];
  }
}

export default VoiceService;
