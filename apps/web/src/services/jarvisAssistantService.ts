/**
 * JARVIS-Style AI Assistant for AgriVoice
 * Features:
 * - Wake word detection ("Jarvis" or "AgriVoice")
 * - Continuous listening (24/7 ready)
 * - Natural conversation with context
 * - Personality and emotion
 * - Advanced voice synthesis
 * - System control capabilities
 */

import api from './api';

export type SupportedLanguage = 'en' | 'hi' | 'mr';
export type AssistantMode = 'idle' | 'listening' | 'processing' | 'speaking' | 'thinking';
export type EmotionState = 'neutral' | 'happy' | 'concerned' | 'excited' | 'focused';

export interface JarvisConfig {
  wakeWords: string[];
  continuousListening: boolean;
  voiceSpeed: number;
  voicePitch: number;
  personality: 'professional' | 'friendly' | 'casual';
  enableEmotions: boolean;
  contextMemorySize: number;
  autoExecuteCommands: boolean;
}

export interface ConversationContext {
  lastCommand: string;
  lastResponse: string;
  userPreferences: Record<string, any>;
  sessionStartTime: Date;
  commandHistory: string[];
  entities: Record<string, any>;
}

export interface JarvisIntent {
  intent: string;
  confidence: number;
  entities: Record<string, any>;
  requiresConfirmation: boolean;
  action: string | null;
  response: string;
  emotion: EmotionState;
  followUp?: string;
}

class JarvisAssistantService {
  private config: JarvisConfig = {
    wakeWords: ['jarvis', 'agrivoice', 'hey jarvis', 'ok jarvis'],
    continuousListening: true,
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    personality: 'friendly',
    enableEmotions: true,
    contextMemorySize: 10,
    autoExecuteCommands: false
  };

  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private mode: AssistantMode = 'idle';
  private emotion: EmotionState = 'neutral';
  private context: ConversationContext = {
    lastCommand: '',
    lastResponse: '',
    userPreferences: {},
    sessionStartTime: new Date(),
    commandHistory: [],
    entities: {}
  };
  private isActive = false;
  private userId: string = '';
  private userRole: 'FARMER' | 'BUYER' = 'FARMER';
  private language: SupportedLanguage = 'en';
  private wakeWordDetected = false;
  private listeningForCommand = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeJarvis();
    }
  }

  /**
   * Initialize JARVIS with advanced capabilities
   */
  private initializeJarvis() {
    console.log('🤖 [JARVIS] Initializing advanced AI assistant...');
    
    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true; // Continuous listening
      this.recognition.interimResults = true; // Get interim results
      this.recognition.maxAlternatives = 3;
      this.recognition.lang = 'en-IN';
      
      this.setupRecognitionHandlers();
      console.log('✅ [JARVIS] Speech recognition initialized');
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      console.log('✅ [JARVIS] Speech synthesis initialized');
    }

    console.log('✅ [JARVIS] Ready to serve!');
  }

  /**
   * Setup continuous listening handlers
   */
  private setupRecognitionHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('🎤 [JARVIS] Listening for wake word...');
    };

    this.recognition.onresult = (event: any) => {
      try {
        const results = event.results;
        const lastResult = results[results.length - 1];
        
        // Get best transcript from alternatives
        let bestTranscript = '';
        let bestConfidence = 0;
        
        for (let i = 0; i < lastResult.length; i++) {
          const alternative = lastResult[i];
          if (alternative.confidence > bestConfidence) {
            bestTranscript = alternative.transcript;
            bestConfidence = alternative.confidence;
          }
        }
        
        const transcript = bestTranscript.toLowerCase().trim();
        const isFinal = lastResult.isFinal;

        console.log(`📝 [JARVIS] Heard: "${transcript}" (confidence: ${bestConfidence.toFixed(2)}, final: ${isFinal})`);

        // Check for wake word
        if (!this.wakeWordDetected && this.containsWakeWord(transcript)) {
          this.onWakeWordDetected();
          return;
        }

        // Process command if wake word was detected
        if (this.wakeWordDetected && isFinal) {
          this.processVoiceCommand(transcript);
        }
      } catch (error) {
        console.error('❌ [JARVIS] Error processing result:', error);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('❌ [JARVIS] Recognition error:', event.error);
      
      // Handle network errors with retry
      if (event.error === 'network') {
        console.log('🔄 [JARVIS] Network error - will auto-restart...');
        // Auto-restart after delay
        if (this.isActive) {
          setTimeout(() => {
            if (this.isActive) {
              console.log('🔄 [JARVIS] Restarting after network error...');
              this.startContinuousListening();
            }
          }, 2000); // 2 second delay
        }
        return;
      }
      
      // Auto-restart on other errors (except permission denied)
      if (event.error !== 'not-allowed' && this.isActive) {
        setTimeout(() => {
          if (this.isActive) {
            this.startContinuousListening();
          }
        }, 1000);
      }
    };

    this.recognition.onend = () => {
      console.log('🛑 [JARVIS] Recognition ended');
      
      // Auto-restart if continuous listening is enabled
      if (this.config.continuousListening && this.isActive) {
        setTimeout(() => {
          if (this.isActive) {
            this.startContinuousListening();
          }
        }, 500);
      }
    };
  }

  /**
   * Check if transcript contains wake word
   */
  private containsWakeWord(transcript: string): boolean {
    return this.config.wakeWords.some(word => 
      transcript.includes(word.toLowerCase())
    );
  }

  /**
   * Handle wake word detection
   */
  private onWakeWordDetected() {
    console.log('👂 [JARVIS] Wake word detected!');
    this.wakeWordDetected = true;
    this.mode = 'listening';
    this.emotion = 'focused';
    
    // Play acknowledgment sound/animation
    this.playAcknowledgment();
    
    // Reset after timeout
    setTimeout(() => {
      if (this.wakeWordDetected) {
        this.wakeWordDetected = false;
        this.mode = 'idle';
      }
    }, 10000); // 10 second timeout
  }

  /**
   * Play acknowledgment (beep or quick response)
   */
  private playAcknowledgment() {
    const responses = [
      'Yes?',
      'I\'m listening',
      'How can I help?',
      'At your service',
      'Ready'
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    this.speak(response, true); // Quick response
  }

  /**
   * Start JARVIS assistant with automatic continuous listening
   */
  async start(userId: string, userRole: 'FARMER' | 'BUYER', language: SupportedLanguage = 'en') {
    this.userId = userId;
    this.userRole = userRole;
    this.language = language;
    this.isActive = true;
    this.context.sessionStartTime = new Date();

    console.log('🚀 [JARVIS] Starting assistant...');

    // Greet user
    await this.greetUser();

    // Start continuous listening automatically
    await this.startContinuousListening();
    
    console.log('✅ [JARVIS] Ready! Say "Jarvis" followed by your command.');
  }

  /**
   * Greet user with personality
   */
  private async greetUser() {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    const roleText = this.userRole === 'FARMER' ? 'farmer' : 'buyer';
    const message = `${greeting}! JARVIS is now active and listening. Just say "Jarvis" followed by your command, and I'll assist you with all your ${roleText} needs.`;

    this.emotion = 'happy';
    await this.speak(message);
    this.emotion = 'neutral';
  }

  /**
   * Start continuous listening for wake word
   */
  private async startContinuousListening() {
    if (!this.recognition) {
      console.error('❌ [JARVIS] Speech recognition not available');
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mode = 'idle';
      this.recognition.start();
      console.log('✅ [JARVIS] Continuous listening started');
    } catch (error) {
      console.error('❌ [JARVIS] Failed to start listening:', error);
      throw error;
    }
  }

  /**
   * Process voice command with advanced NLU
   */
  private async processVoiceCommand(transcript: string) {
    console.log(`🤖 [JARVIS] Processing: "${transcript}"`);
    
    this.mode = 'processing';
    this.emotion = 'thinking';
    this.wakeWordDetected = false;

    // Add to context
    this.context.lastCommand = transcript;
    this.context.commandHistory.push(transcript);
    if (this.context.commandHistory.length > this.config.contextMemorySize) {
      this.context.commandHistory.shift();
    }

    try {
      // Classify intent with context awareness
      const intent = await this.classifyIntent(transcript);
      
      console.log(`✅ [JARVIS] Intent: ${intent.intent} (confidence: ${intent.confidence})`);
      
      this.emotion = intent.emotion;
      this.mode = 'speaking';

      // Speak response
      await this.speak(intent.response);

      // Execute action if needed
      if (intent.action) {
        await this.executeAction(intent);
      }

      // Ask follow-up if needed
      if (intent.followUp) {
        await this.speak(intent.followUp);
      }

      this.context.lastResponse = intent.response;
      this.mode = 'idle';
      this.emotion = 'neutral';

    } catch (error) {
      console.error('❌ [JARVIS] Processing error:', error);
      this.emotion = 'concerned';
      await this.speak('I apologize, but I encountered an error processing your request. Could you please try again?');
      this.mode = 'idle';
      this.emotion = 'neutral';
    }
  }

  /**
   * Advanced intent classification with context
   */
  private async classifyIntent(text: string): Promise<JarvisIntent> {
    const lowerText = text.toLowerCase();

    // Agriculture-specific intents
    const intents = {
      // Market & Pricing
      market_price: {
        patterns: [/market|price|rate|cost|mandi|भाव|किंमत/i],
        response: this.getPersonalizedResponse('market_price'),
        action: 'fetch_market_prices',
        emotion: 'focused' as EmotionState
      },
      
      // Product Management
      list_product: {
        patterns: [/list|sell|add.*product|upload|post/i],
        response: this.getPersonalizedResponse('list_product'),
        action: 'open_product_form',
        emotion: 'excited' as EmotionState
      },

      // Search & Discovery
      search_products: {
        patterns: [/search|find|look.*for|buy|purchase/i],
        response: this.getPersonalizedResponse('search_products'),
        action: 'open_search',
        emotion: 'focused' as EmotionState
      },

      // Orders & Tracking
      track_order: {
        patterns: [/track|order.*status|where.*order|delivery/i],
        response: this.getPersonalizedResponse('track_order'),
        action: 'open_orders',
        emotion: 'focused' as EmotionState
      },

      // Weather & Forecast
      weather: {
        patterns: [/weather|forecast|rain|temperature|मौसम/i],
        response: this.getPersonalizedResponse('weather'),
        action: 'fetch_weather',
        emotion: 'neutral' as EmotionState
      },

      // Crop Advisory
      crop_advice: {
        patterns: [/crop|farming|plant|grow|harvest|soil/i],
        response: this.getPersonalizedResponse('crop_advice'),
        action: 'open_crop_advisor',
        emotion: 'helpful' as EmotionState
      },

      // Financial
      payments: {
        patterns: [/payment|pay|money|transaction|wallet/i],
        response: this.getPersonalizedResponse('payments'),
        action: 'open_payments',
        emotion: 'focused' as EmotionState
      },

      // Help & Support
      help: {
        patterns: [/help|support|how.*to|guide|tutorial/i],
        response: this.getPersonalizedResponse('help'),
        action: 'show_help',
        emotion: 'happy' as EmotionState
      },

      // Greetings
      greeting: {
        patterns: [/hello|hi|hey|good.*morning|good.*evening/i],
        response: this.getPersonalizedResponse('greeting'),
        action: null,
        emotion: 'happy' as EmotionState
      },

      // Thanks
      thanks: {
        patterns: [/thank|thanks|appreciate/i],
        response: this.getPersonalizedResponse('thanks'),
        action: null,
        emotion: 'happy' as EmotionState
      }
    };

    // Find matching intent
    for (const [intentName, config] of Object.entries(intents)) {
      for (const pattern of config.patterns) {
        if (pattern.test(lowerText)) {
          return {
            intent: intentName,
            confidence: 0.9,
            entities: this.extractEntities(text),
            requiresConfirmation: false,
            action: config.action,
            response: config.response,
            emotion: config.emotion
          };
        }
      }
    }

    // Unknown intent
    return {
      intent: 'unknown',
      confidence: 0.3,
      entities: {},
      requiresConfirmation: false,
      action: null,
      response: this.getPersonalizedResponse('unknown'),
      emotion: 'concerned'
    };
  }

  /**
   * Get personalized response based on personality and context
   */
  private getPersonalizedResponse(intent: string): string {
    const responses: Record<string, string[]> = {
      market_price: [
        'Let me fetch the latest market prices for you.',
        'I\'ll check the current mandi rates right away.',
        'Getting you the most recent market data.'
      ],
      list_product: [
        'I\'ll help you list your product. Opening the product form now.',
        'Great! Let\'s get your product listed on the marketplace.',
        'I\'m opening the product listing form for you.'
      ],
      search_products: [
        'I\'ll search for products matching your criteria.',
        'Let me find the best products for you.',
        'Searching the marketplace now.'
      ],
      track_order: [
        'Let me check your order status.',
        'I\'ll pull up your order tracking information.',
        'Checking on your orders right now.'
      ],
      weather: [
        'Let me get the weather forecast for your area.',
        'I\'ll check the weather conditions for you.',
        'Fetching the latest weather data.'
      ],
      crop_advice: [
        'I\'ll provide you with crop advisory information.',
        'Let me help you with farming guidance.',
        'Opening the crop advisor for you.'
      ],
      payments: [
        'I\'ll open your payment center.',
        'Let me help you with your transactions.',
        'Accessing your financial dashboard.'
      ],
      help: [
        'I\'m here to help! What would you like to know?',
        'I\'ll guide you through whatever you need.',
        'Let me assist you with that.'
      ],
      greeting: [
        'Hello! How can I assist you today?',
        'Hi there! What can I do for you?',
        'Greetings! I\'m ready to help.'
      ],
      thanks: [
        'You\'re welcome! Happy to help.',
        'My pleasure! Let me know if you need anything else.',
        'Anytime! I\'m here whenever you need me.'
      ],
      unknown: [
        'I\'m not sure I understood that. Could you rephrase?',
        'I didn\'t quite catch that. Could you say it differently?',
        'I\'m still learning. Could you try asking in another way?'
      ]
    };

    const options = responses[intent] || responses.unknown;
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Extract entities from text
   */
  private extractEntities(text: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract products
    const products = ['tomato', 'potato', 'onion', 'wheat', 'rice', 'corn', 'टमाटर', 'आलू', 'प्याज'];
    for (const product of products) {
      if (text.toLowerCase().includes(product)) {
        entities.product = product;
        break;
      }
    }

    // Extract quantities
    const quantityMatch = text.match(/(\d+)\s*(kg|quintal|ton|kilogram)/i);
    if (quantityMatch) {
      entities.quantity = parseInt(quantityMatch[1]);
      entities.unit = quantityMatch[2];
    }

    // Extract locations
    const locationMatch = text.match(/in\s+([a-z]+)|at\s+([a-z]+)/i);
    if (locationMatch) {
      entities.location = locationMatch[1] || locationMatch[2];
    }

    return entities;
  }

  /**
   * Execute action based on intent
   */
  private async executeAction(intent: JarvisIntent) {
    if (!intent.action) return;

    console.log(`⚡ [JARVIS] Executing action: ${intent.action}`);

    try {
      switch (intent.action) {
        case 'fetch_market_prices':
          // Trigger market price fetch
          window.dispatchEvent(new CustomEvent('jarvis:open-market-prices'));
          break;

        case 'open_product_form':
          window.dispatchEvent(new CustomEvent('jarvis:open-product-form'));
          break;

        case 'open_search':
          window.dispatchEvent(new CustomEvent('jarvis:open-search', {
            detail: { query: intent.entities.product || '' }
          }));
          break;

        case 'open_orders':
          window.dispatchEvent(new CustomEvent('jarvis:open-orders'));
          break;

        case 'fetch_weather':
          window.dispatchEvent(new CustomEvent('jarvis:open-weather'));
          break;

        case 'open_farm_insights':
          window.dispatchEvent(new CustomEvent('jarvis:open-farm-insights'));
          break;

        case 'open_payments':
          window.dispatchEvent(new CustomEvent('jarvis:open-payments'));
          break;

        case 'show_help':
          window.dispatchEvent(new CustomEvent('jarvis:show-help'));
          break;
      }
    } catch (error) {
      console.error('❌ [JARVIS] Action execution failed:', error);
    }
  }

  /**
   * Advanced speech synthesis with personality
   */
  private async speak(text: string, quick: boolean = false): Promise<void> {
    if (!this.synthesis) return;

    return new Promise((resolve) => {
      try {
        this.synthesis!.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = quick ? 1.3 : this.config.voiceSpeed;
        utterance.pitch = this.config.voicePitch;
        utterance.volume = 1.0;

        // Select voice based on language
        const voices = this.synthesis!.getVoices();
        const preferredVoice = voices.find(v => 
          v.lang.startsWith(this.language) && v.name.includes('Google')
        ) || voices.find(v => v.lang.startsWith(this.language));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        this.synthesis!.speak(utterance);
        console.log(`🔊 [JARVIS] Speaking: "${text}"`);
      } catch (error) {
        console.error('❌ [JARVIS] Speech error:', error);
        resolve();
      }
    });
  }

  /**
   * Stop JARVIS
   */
  stop() {
    this.isActive = false;
    
    if (this.recognition) {
      this.recognition.stop();
    }

    if (this.synthesis) {
      this.synthesis.cancel();
    }

    this.mode = 'idle';
    this.emotion = 'neutral';
    console.log('🛑 [JARVIS] Assistant stopped');
  }

  /**
   * Get current state
   */
  getState() {
    return {
      mode: this.mode,
      emotion: this.emotion,
      isActive: this.isActive,
      wakeWordDetected: this.wakeWordDetected,
      context: this.context
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<JarvisConfig>) {
    this.config = { ...this.config, ...config };
    console.log('⚙️ [JARVIS] Configuration updated');
  }

  /**
   * Manual command (without wake word)
   */
  async executeManualCommand(command: string) {
    this.wakeWordDetected = true;
    await this.processVoiceCommand(command);
  }
}

export const jarvisAssistant = new JarvisAssistantService();
export default jarvisAssistant;
