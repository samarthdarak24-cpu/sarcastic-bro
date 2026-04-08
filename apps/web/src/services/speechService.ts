'use client';

/**
 * Speech Service - Handles both Speech-to-Text and Text-to-Speech
 */

export interface SpeechServiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export class SpeechToTextService {
  private recognition: any;
  private isListening: boolean = false;
  private transcript: string = '';
  private interimTranscript: string = '';

  constructor(config: SpeechServiceConfig = {}) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.language = config.language || 'en-IN';
    this.recognition.continuous = config.continuous || false;
    this.recognition.interimResults = config.interimResults !== false;
  }

  startListening(
    onResult: (transcript: string, isFinal: boolean, interim: string) => void,
    onError: (error: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    if (!this.recognition) {
      onError('Speech Recognition not supported in this browser');
      return;
    }

    this.isListening = true;
    this.transcript = '';
    this.interimTranscript = '';

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      this.interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          this.transcript += transcript + ' ';
        } else {
          this.interimTranscript += transcript;
        }
      }

      const finalTranscript = this.transcript + this.interimTranscript;
      const isFinal = event.results[event.results.length - 1].isFinal;

      onResult(finalTranscript, isFinal, this.interimTranscript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError(`Error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Speech recognition ended');
      onEnd?.();
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      onError('Failed to start voice recognition');
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  abort(): void {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening = false;
      this.transcript = '';
      this.interimTranscript = '';
    }
  }

  getTranscript(): string {
    return this.transcript;
  }

  isActive(): boolean {
    return this.isListening;
  }

  setLanguage(language: string): void {
    if (this.recognition) {
      this.recognition.language = language;
    }
  }

  static isSupported(): boolean {
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  static getAvailableLanguages(): { code: string; name: string }[] {
    return [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-IN', name: 'English (India)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'hi-IN', name: 'Hindi' },
      { code: 'mr-IN', name: 'Marathi' },
      { code: 'ta-IN', name: 'Tamil' },
      { code: 'te-IN', name: 'Telugu' },
      { code: 'kn-IN', name: 'Kannada' },
      { code: 'ml-IN', name: 'Malayalam' },
      { code: 'bn-IN', name: 'Bengali' },
      { code: 'gu-IN', name: 'Gujarati' },
      { code: 'pa-IN', name: 'Punjabi' },
      { code: 'es-ES', name: 'Spanish' },
      { code: 'fr-FR', name: 'French' },
      { code: 'de-DE', name: 'German' },
      { code: 'it-IT', name: 'Italian' },
      { code: 'pt-BR', name: 'Portuguese' },
      { code: 'zh-CN', name: 'Chinese (Simplified)' },
      { code: 'ja-JP', name: 'Japanese' },
      { code: 'ko-KR', name: 'Korean' },
    ];
  }
}

export class TextToSpeechService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;

  speak(
    text: string,
    config: {
      language?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: string) => void;
    } = {}
  ): void {
    if (!this.isSupported()) {
      config.onError?.('Text-to-Speech not supported');
      return;
    }

    // Stop current speech if any
    this.stop();

    const {
      language = 'en-IN',
      rate = 1,
      pitch = 1,
      volume = 1,
      onStart,
      onEnd,
      onError,
    } = config;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = Math.max(0.5, Math.min(2, rate));
    utterance.pitch = Math.max(0.5, Math.min(2, pitch));
    utterance.volume = Math.max(0, Math.min(1, volume));

    utterance.onstart = () => {
      this.isSpeaking = true;
      console.log('Speech started');
      onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      console.log('Speech ended');
      onEnd?.();
    };

    utterance.onerror = (event: any) => {
      this.isSpeaking = false;
      console.error('Speech error:', event.error);
      onError?.(event.error);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  pause(): void {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  }

  resume(): void {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  stop(): void {
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  isSpeakingNow(): boolean {
    return this.isSpeaking || window.speechSynthesis.speaking;
  }

  static isSupported(): boolean {
    return !!window.speechSynthesis;
  }

  static getAvailableVoices(): SpeechSynthesisVoice[] {
    return window.speechSynthesis.getVoices();
  }
}
