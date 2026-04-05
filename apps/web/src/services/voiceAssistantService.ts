/**
 * AgriVoice AI - Advanced Multilingual Voice Assistant Service
 * Version 3.0 - Enterprise-grade voice control for agriculture marketplace
 */

import api from './api';
import { audioRecorderService } from './audioRecorderService';

// Language detection and support
export type SupportedLanguage = 'en' | 'hi' | 'mr';

// Intent classification types
export interface VoiceIntent {
  intent: string;
  entities: Record<string, any>;
  action_required: boolean;
  api_endpoint: string | null;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | null;
  confidence: number;
  requires_confirmation: boolean;
  response: string;
  followup_suggestion?: string;
  language: SupportedLanguage;
  steps?: VoiceCommandStep[];
}

export interface VoiceCommandStep {
  step: number;
  action: string;
  params: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
}

// Voice session context
export interface VoiceSession {
  sessionId: string;
  userId: string;
  userRole: 'FARMER' | 'BUYER';
  language: SupportedLanguage;
  conversationHistory: VoiceIntent[];
  contextMemory: Record<string, any>;
  startTime: Date;
  lastActivity: Date;
}

class VoiceAssistantService {
  private session: VoiceSession | null = null;
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSpeechAPIs();
    }
  }

  /**
   * Initialize Web Speech API
   */
  private initializeSpeechAPIs() {
    // Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;
    }

    // Speech Synthesis
    this.synthesis = window.speechSynthesis;

    // Audio Context for visualization
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  /**
   * Start voice session
   */
  async startSession(userId: string, userRole: 'FARMER' | 'BUYER', language: SupportedLanguage = 'hi'): Promise<VoiceSession> {
    this.session = {
      sessionId: `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userRole,
      language,
      conversationHistory: [],
      contextMemory: {},
      startTime: new Date(),
      lastActivity: new Date()
    };

    // Set recognition language
    if (this.recognition) {
      this.recognition.lang = this.getLanguageCode(language);
    }

    return this.session;
  }

  /**
   * Detect language from text
   */
  detectLanguage(text: string): SupportedLanguage {
    // Hindi detection (Devanagari script)
    const hindiPattern = /[\u0900-\u097F]/;
    // Marathi detection (also Devanagari, but with context)
    const marathiPattern = /[\u0900-\u097F]/;
    
    if (hindiPattern.test(text)) {
      // Simple heuristic: if contains specific Marathi words
      const marathiWords = ['आहे', 'होते', 'असे', 'काय', 'कसे'];
      if (marathiWords.some(word => text.includes(word))) {
        return 'mr';
      }
      return 'hi';
    }
    
    return 'en';
  }

  /**
   * Get language code for Speech Recognition
   */
  private getLanguageCode(lang: SupportedLanguage): string {
    const codes = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'mr': 'mr-IN'
    };
    return codes[lang];
  }

  /**
   * Complete voice workflow using Whisper + GPT
   * Steps 1-11: Complete end-to-end voice processing
   */
  async processCompleteVoiceCommand(
    audioBlob: Blob,
    language: SupportedLanguage,
    userRole: 'FARMER' | 'BUYER',
    includeAudio: boolean = true
  ): Promise<{
    transcript: string;
    intent: string;
    entities: Record<string, any>;
    response: string;
    audioResponse?: string;
    executionResult?: any;
  }> {
    try {
      // Convert audio blob to base64
      const audioBase64 = await this.blobToBase64(audioBlob);

      // Send to backend for complete processing
      const response = await api.post('/voice/process', {
        audio: audioBase64,
        language,
        userRole,
        includeAudio,
        sessionContext: {
          conversationHistory: this.session?.conversationHistory || [],
          contextMemory: this.session?.contextMemory || {}
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Complete voice processing error:', error);
      throw error;
    }
  }

  /**
   * Convert blob to base64
   */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Start listening for voice input
   */
  async startListening(onTranscript: (text: string, isFinal: boolean) => void): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    return new Promise((resolve, reject) => {
      this.isListening = true;
      let hasReceivedSpeech = false;
      let lastTranscript = '';
      let finalTranscriptReceived = false;

      this.recognition.onresult = (event: any) => {
        hasReceivedSpeech = true;
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        lastTranscript = transcript;
        const isFinal = event.results[event.results.length - 1].isFinal;
        
        if (isFinal) {
          finalTranscriptReceived = true;
        }
        
        onTranscript(transcript, isFinal);

        if (isFinal) {
          this.isListening = false;
          // Resolve immediately when we get final transcript
          resolve();
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        
        // If we have a transcript (even interim), use it and resolve successfully
        if (lastTranscript && lastTranscript.trim()) {
          console.log('✅ Voice captured:', lastTranscript);
          // Call onTranscript one more time with final flag
          if (!finalTranscriptReceived) {
            onTranscript(lastTranscript, true);
          }
          resolve();
          return;
        }
        
        // Only reject if we truly have no speech
        const errorMap: Record<string, string> = {
          'no-speech': 'no-speech',
          'audio-capture': 'audio-capture',
          'not-allowed': 'not-allowed',
          'network': 'speech-network',
          'aborted': 'aborted',
          'bad-grammar': 'bad-grammar',
          'language-not-supported': 'language-not-supported',
          'service-not-allowed': 'service-not-allowed'
        };
        
        const error = new Error(errorMap[event.error] || event.error);
        reject(error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // If we have transcript, always resolve successfully
        if (lastTranscript && lastTranscript.trim()) {
          if (!finalTranscriptReceived) {
            onTranscript(lastTranscript, true);
          }
          resolve();
        } else if (!hasReceivedSpeech && !finalTranscriptReceived) {
          // Only reject if we truly got nothing
          reject(new Error('no-speech'));
        }
      };

      this.recognition.onspeechend = () => {
        // Speech has ended, stop recognition
        setTimeout(() => {
          if (this.recognition && this.isListening) {
            this.recognition.stop();
          }
        }, 100);
      };

      this.recognition.onnomatch = () => {
        this.isListening = false;
        // If we have any transcript, use it
        if (lastTranscript && lastTranscript.trim()) {
          onTranscript(lastTranscript, true);
          resolve();
        } else {
          reject(new Error('no-speech'));
        }
      };

      try {
        this.recognition.start();
      } catch (error: any) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  /**
   * Stop listening
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Process voice command and classify intent
   */
  async processCommand(transcript: string): Promise<VoiceIntent> {
    if (!this.session) {
      throw new Error('No active voice session');
    }

    // Detect language
    const detectedLang = this.detectLanguage(transcript);
    this.session.language = detectedLang;

    // Update session activity
    this.session.lastActivity = new Date();

    try {
      // Call AI backend for intent classification
      const response = await api.post('/voice/classify-intent', {
        transcript,
        language: detectedLang,
        userRole: this.session.userRole,
        sessionContext: {
          conversationHistory: this.session.conversationHistory.slice(-5),
          contextMemory: this.session.contextMemory
        }
      });

      const intent: VoiceIntent = response.data;

      // Store in conversation history
      this.session.conversationHistory.push(intent);

      // Update context memory
      if (intent.entities) {
        this.session.contextMemory = {
          ...this.session.contextMemory,
          ...intent.entities,
          lastIntent: intent.intent
        };
      }

      return intent;
    } catch (error: any) {
      console.error('Intent classification error:', error);
      // Fallback to local intent classification
      return this.fallbackIntentClassification(transcript, detectedLang);
    }
  }

  /**
   * Fallback intent classification (offline mode)
   */
  private fallbackIntentClassification(transcript: string, language: SupportedLanguage): VoiceIntent {
    const lowerText = transcript.toLowerCase();
    
    // Simple pattern matching for common intents
    const patterns = {
      add_to_cart: /add|cart|खरीद|कार्ट|टाक/i,
      place_order: /order|place|ऑर्डर|मंगव/i,
      check_price: /price|rate|भाव|किंमत|दर/i,
      search_product: /search|find|शोध|शोधा|मिळेल/i,
      track_order: /track|status|ट्रैक|स्थिती/i,
      add_product: /list|sell|विक्री|बेच/i,
      check_market_price: /market|mandi|मंडी|बाजार/i,
      weather: /weather|मौसम|हवामान/i,
    };

    let matchedIntent = 'unknown';
    let confidence = 0.3;

    for (const [intent, pattern] of Object.entries(patterns)) {
      if (pattern.test(lowerText)) {
        matchedIntent = intent;
        confidence = 0.7;
        break;
      }
    }

    return {
      intent: matchedIntent,
      entities: {},
      action_required: matchedIntent !== 'unknown',
      api_endpoint: null,
      method: null,
      confidence,
      requires_confirmation: false,
      response: this.getDefaultResponse(matchedIntent, language),
      language
    };
  }

  /**
   * Execute voice command action
   */
  async executeAction(intent: VoiceIntent): Promise<any> {
    if (!intent.action_required || !intent.api_endpoint) {
      return { success: true, message: intent.response };
    }

    // Handle multi-step commands
    if (intent.steps && intent.steps.length > 0) {
      return this.executeMultiStepCommand(intent);
    }

    // Single action execution
    try {
      const response = await api.request({
        method: intent.method || 'GET',
        url: intent.api_endpoint,
        data: intent.entities
      });

      return {
        success: true,
        data: response.data,
        message: intent.response
      };
    } catch (error: any) {
      console.error('Action execution error:', error);
      return {
        success: false,
        error: error.message,
        message: this.getErrorResponse(intent.language)
      };
    }
  }

  /**
   * Execute multi-step command
   */
  private async executeMultiStepCommand(intent: VoiceIntent): Promise<any> {
    if (!intent.steps) return { success: false };

    const results = [];

    for (const step of intent.steps) {
      step.status = 'executing';
      
      try {
        const stepResult = await this.executeStep(step);
        step.status = 'completed';
        step.result = stepResult;
        results.push(stepResult);
      } catch (error: any) {
        step.status = 'failed';
        step.result = { error: error.message };
        
        // Rollback on failure
        await this.rollbackSteps(intent.steps.slice(0, results.length));
        
        return {
          success: false,
          failedStep: step.step,
          error: error.message,
          message: this.getErrorResponse(intent.language)
        };
      }
    }

    return {
      success: true,
      results,
      message: intent.response
    };
  }

  /**
   * Execute single step
   */
  private async executeStep(step: VoiceCommandStep): Promise<any> {
    // Map action to API endpoint
    const endpoint = this.getEndpointForAction(step.action);
    
    const response = await api.post(endpoint, step.params);
    return response.data;
  }

  /**
   * Rollback completed steps
   */
  private async rollbackSteps(steps: VoiceCommandStep[]): Promise<void> {
    for (const step of steps.reverse()) {
      try {
        const rollbackEndpoint = this.getRollbackEndpoint(step.action);
        if (rollbackEndpoint) {
          await api.post(rollbackEndpoint, { stepId: step.result?.id });
        }
      } catch (error) {
        console.error('Rollback failed for step:', step.step, error);
      }
    }
  }

  /**
   * Speak response using TTS
   */
  async speak(text: string, language: SupportedLanguage = 'hi'): Promise<void> {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not supported');
    }

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      this.synthesis!.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode(language);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to find a native voice
      const voices = this.synthesis!.getVoices();
      const nativeVoice = voices.find(voice => 
        voice.lang.startsWith(language) && voice.localService
      );
      
      if (nativeVoice) {
        utterance.voice = nativeVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event);

      this.synthesis!.speak(utterance);
    });
  }

  /**
   * Stop speaking
   */
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  /**
   * Get confirmation from user
   */
  async getConfirmation(message: string, language: SupportedLanguage): Promise<boolean> {
    const confirmationMessage = this.getConfirmationMessage(message, language);
    
    await this.speak(confirmationMessage, language);

    return new Promise((resolve) => {
      this.startListening((transcript, isFinal) => {
        if (isFinal) {
          const confirmed = this.isConfirmationPositive(transcript, language);
          resolve(confirmed);
        }
      });
    });
  }

  /**
   * Check if response is positive confirmation
   */
  private isConfirmationPositive(text: string, language: SupportedLanguage): boolean {
    const positivePatterns = {
      en: /yes|yeah|sure|ok|confirm|do it/i,
      hi: /हाँ|हां|जी|ठीक|करो|कर दो/i,
      mr: /होय|हो|ठीक|करा/i
    };

    return positivePatterns[language].test(text);
  }

  /**
   * Get default response for intent
   */
  private getDefaultResponse(intent: string, language: SupportedLanguage): string {
    const responses: Record<string, Record<SupportedLanguage, string>> = {
      unknown: {
        en: "I didn't quite understand that. Could you please rephrase?",
        hi: "मुझे समझ नहीं आया। क्या आप फिर से बोल सकते हैं?",
        mr: "मला समजले नाही. कृपया पुन्हा सांगाल का?"
      },
      add_to_cart: {
        en: "Adding to cart...",
        hi: "कार्ट में जोड़ रहे हैं...",
        mr: "कार्टमध्ये जोडत आहे..."
      },
      place_order: {
        en: "Placing your order...",
        hi: "आपका ऑर्डर प्लेस कर रहे हैं...",
        mr: "तुमची ऑर्डर देत आहे..."
      }
    };

    return responses[intent]?.[language] || responses.unknown[language];
  }

  /**
   * Get confirmation message
   */
  private getConfirmationMessage(message: string, language: SupportedLanguage): string {
    const templates = {
      en: `${message} Please say yes or no.`,
      hi: `${message} कृपया हाँ या नहीं बोलें।`,
      mr: `${message} कृपया होय किंवा नाही म्हणा।`
    };

    return templates[language];
  }

  /**
   * Get error response
   */
  private getErrorResponse(language: SupportedLanguage): string {
    const messages = {
      en: "Sorry, there was a problem. Please try again in a moment.",
      hi: "क्षमा करें, कुछ समस्या हुई। कृपया थोड़ी देर बाद फिर से कोशिश करें।",
      mr: "माफ करा, काही समस्या आली. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
    };

    return messages[language];
  }

  /**
   * Get endpoint for action
   */
  private getEndpointForAction(action: string): string {
    const endpoints: Record<string, string> = {
      add_to_cart: '/cart/add',
      remove_from_cart: '/cart/remove',
      place_order: '/orders/create',
      cancel_order: '/orders/cancel',
      add_product: '/products/create',
      update_price: '/products/update-price',
      check_market_price: '/market/rates',
      track_order: '/orders/track'
    };

    return endpoints[action] || '/voice/execute';
  }

  /**
   * Get rollback endpoint
   */
  private getRollbackEndpoint(action: string): string | null {
    const rollbacks: Record<string, string> = {
      add_to_cart: '/cart/remove',
      place_order: '/orders/cancel',
      add_product: '/products/delete'
    };

    return rollbacks[action] || null;
  }

  /**
   * Get session info
   */
  getSession(): VoiceSession | null {
    return this.session;
  }

  /**
   * End session
   */
  endSession() {
    this.stopListening();
    this.stopSpeaking();
    this.session = null;
  }

  /**
   * Check if browser supports voice features
   */
  isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }
}

export const voiceAssistantService = new VoiceAssistantService();
export default voiceAssistantService;
