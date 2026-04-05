/**
 * Voice Assistant Service
 * Advanced NLP-based intent classification and command execution
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SupportedLanguage = 'en' | 'hi' | 'mr';
type UserRole = 'FARMER' | 'BUYER';

interface VoiceIntent {
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

interface VoiceCommandStep {
  step: number;
  action: string;
  params: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
}

export class VoiceService {
  /**
   * Classify intent from voice transcript using NLP
   */
  async classifyIntent(
    transcript: string,
    language: SupportedLanguage,
    userRole: UserRole,
    sessionContext?: any
  ): Promise<VoiceIntent> {
    const lowerText = transcript.toLowerCase();

    // Intent patterns with multilingual support
    const intentPatterns = this.getIntentPatterns();

    // Find matching intent
    let matchedIntent: string | null = null;
    let confidence = 0;
    let entities: Record<string, any> = {};

    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      for (const pattern of patterns) {
        const match = lowerText.match(pattern.regex);
        if (match) {
          matchedIntent = intent;
          confidence = pattern.confidence;
          entities = this.extractEntities(match, pattern.entityMap);
          break;
        }
      }
      if (matchedIntent) break;
    }

    // If no match, use contextual inference
    if (!matchedIntent || confidence < 0.5) {
      const contextualIntent = this.inferFromContext(lowerText, sessionContext, userRole);
      if (contextualIntent.confidence > confidence) {
        matchedIntent = contextualIntent.intent;
        confidence = contextualIntent.confidence;
        entities = contextualIntent.entities;
      }
    }

    // Build intent response
    const intent = matchedIntent || 'unknown';
    const intentConfig = this.getIntentConfig(intent, userRole);

    // Check if multi-step command
    const steps = this.decomposeMultiStepCommand(lowerText, intent, entities);

    return {
      intent,
      entities,
      action_required: intentConfig.actionRequired,
      api_endpoint: intentConfig.endpoint,
      method: intentConfig.method,
      confidence,
      requires_confirmation: intentConfig.requiresConfirmation,
      response: this.generateResponse(intent, entities, language, userRole),
      followup_suggestion: this.generateFollowup(intent, language, userRole),
      language,
      steps: steps.length > 0 ? steps : undefined
    };
  }

  /**
   * Get intent patterns for matching
   */
  private getIntentPatterns(): Record<string, Array<{ regex: RegExp; confidence: number; entityMap?: string[] }>> {
    return {
      // Cart operations
      add_to_cart: [
        { regex: /(add|cart|खरीद|कार्ट|टाक).*((\d+)\s*(kg|किलो|kilo))?\s*(.+)/i, confidence: 0.85, entityMap: ['action', 'quantity', 'unit', 'product'] },
        { regex: /(cart में|कार्ट में).*(add|जोड़|डाल)/i, confidence: 0.8 }
      ],
      remove_from_cart: [
        { regex: /(remove|delete|हटा|निकाल).*(cart|कार्ट)/i, confidence: 0.85 },
        { regex: /(cart से|कार्ट से).*(remove|हटा)/i, confidence: 0.8 }
      ],
      update_quantity: [
        { regex: /(change|update|बदल).*(quantity|मात्रा|संख्या)/i, confidence: 0.8 },
        { regex: /(\d+)\s*(kg|किलो).*(कर दो|make|set)/i, confidence: 0.75, entityMap: ['quantity', 'unit'] }
      ],

      // Order operations
      place_order: [
        { regex: /(place|book|confirm|order|ऑर्डर).*(place|करो|कर दो|book)/i, confidence: 0.9 },
        { regex: /(order|ऑर्डर).*(confirm|पक्का|final)/i, confidence: 0.85 }
      ],
      cancel_order: [
        { regex: /(cancel|रद्द|कैंसिल).*(order|ऑर्डर)/i, confidence: 0.9 },
        { regex: /(order|ऑर्डर).*(cancel|रद्द)/i, confidence: 0.85 }
      ],
      track_order: [
        { regex: /(track|status|ट्रैक|स्थिति).*(order|ऑर्डर)/i, confidence: 0.85 },
        { regex: /(order|ऑर्डर).*(कहां|where|status)/i, confidence: 0.8 }
      ],
      reorder: [
        { regex: /(reorder|फिर से|again|same).*(order|ऑर्डर)/i, confidence: 0.8 },
        { regex: /(last|पिछला).*(order|ऑर्डर).*(फिर|again)/i, confidence: 0.75 }
      ],

      // Product search and discovery
      search_product: [
        { regex: /(search|find|ढूंढ|खोज|शोध).+/i, confidence: 0.8, entityMap: ['action', 'product'] },
        { regex: /(show|दिखा|बता).*(products|सामान|माल)/i, confidence: 0.75 }
      ],
      filter_products: [
        { regex: /(filter|छान|sort).*(by|से)/i, confidence: 0.75 },
        { regex: /(organic|जैविक|fresh|ताजा).*(products|सामान)/i, confidence: 0.7 }
      ],
      check_price: [
        { regex: /(price|rate|भाव|किंमत|दर).*(क्या|what|कितना|how much)/i, confidence: 0.85 },
        { regex: /(कितने|how much).*(में|price|rate)/i, confidence: 0.8 }
      ],
      compare_products: [
        { regex: /(compare|तुलना|comparison)/i, confidence: 0.8 },
        { regex: /(better|बेहतर|अच्छा).*(या|or)/i, confidence: 0.7 }
      ],

      // Farmer-specific
      add_product: [
        { regex: /(list|sell|add|बेच|विक्री).*(product|crop|फसल|माल)/i, confidence: 0.85 },
        { regex: /(product|फसल).*(list|add|जोड़)/i, confidence: 0.8 }
      ],
      update_product_price: [
        { regex: /(update|change|बदल).*(price|भाव|rate)/i, confidence: 0.85 },
        { regex: /(price|भाव).*(update|बदल|change)/i, confidence: 0.8 }
      ],
      delete_product: [
        { regex: /(delete|remove|हटा).*(product|listing|फसल)/i, confidence: 0.85 }
      ],
      check_market_price: [
        { regex: /(market|mandi|मंडी|बाजार).*(price|rate|भाव)/i, confidence: 0.9 },
        { regex: /(mandi|मंडी).*(भाव|rate)/i, confidence: 0.85 }
      ],
      get_demand_insights: [
        { regex: /(demand|मांग).*(insight|analysis|विश्लेषण)/i, confidence: 0.8 },
        { regex: /(क्या|what).*(demand|मांग)/i, confidence: 0.75 }
      ],
      view_sales_analytics: [
        { regex: /(sales|बिक्री).*(analytics|report|रिपोर्ट)/i, confidence: 0.8 },
        { regex: /(show|दिखा).*(sales|बिक्री)/i, confidence: 0.75 }
      ],
      crop_recommendation: [
        { regex: /(recommend|suggest|सुझाव).*(crop|फसल)/i, confidence: 0.85 },
        { regex: /(which|कौन सी).*(crop|फसल).*(grow|उगा)/i, confidence: 0.8 }
      ],
      weather_guidance: [
        { regex: /(weather|मौसम|हवामान)/i, confidence: 0.85 },
        { regex: /(rain|बारिश|पाऊस)/i, confidence: 0.75 }
      ],

      // Payment and wallet
      check_wallet: [
        { regex: /(wallet|balance|बैलेंस|पैसे)/i, confidence: 0.85 },
        { regex: /(कितने|how much).*(पैसे|money|balance)/i, confidence: 0.8 }
      ],
      payment_help: [
        { regex: /(payment|भुगतान|पेमेंट).*(help|issue|problem)/i, confidence: 0.8 }
      ],

      // Support
      contact_support: [
        { regex: /(help|support|मदद|सहायता)/i, confidence: 0.7 },
        { regex: /(talk|बात).*(someone|किसी से)/i, confidence: 0.65 }
      ]
    };
  }

  /**
   * Extract entities from regex match
   */
  private extractEntities(match: RegExpMatchArray, entityMap?: string[]): Record<string, any> {
    if (!entityMap) return {};

    const entities: Record<string, any> = {};
    
    entityMap.forEach((key, index) => {
      if (match[index + 1]) {
        entities[key] = match[index + 1].trim();
      }
    });

    return entities;
  }

  /**
   * Infer intent from conversation context
   */
  private inferFromContext(
    text: string,
    sessionContext: any,
    userRole: UserRole
  ): { intent: string; confidence: number; entities: Record<string, any> } {
    if (!sessionContext?.conversationHistory?.length) {
      return { intent: 'unknown', confidence: 0, entities: {} };
    }

    const lastIntent = sessionContext.conversationHistory[sessionContext.conversationHistory.length - 1];

    // Context-based inference
    if (lastIntent.intent === 'search_product' && /(\d+|yes|हाँ|हो)/i.test(text)) {
      return { intent: 'add_to_cart', confidence: 0.7, entities: { fromSearch: true } };
    }

    if (lastIntent.intent === 'add_to_cart' && /(order|ऑर्डर|place)/i.test(text)) {
      return { intent: 'place_order', confidence: 0.75, entities: {} };
    }

    return { intent: 'unknown', confidence: 0, entities: {} };
  }

  /**
   * Decompose multi-step commands
   */
  private decomposeMultiStepCommand(
    text: string,
    intent: string,
    entities: Record<string, any>
  ): VoiceCommandStep[] {
    const steps: VoiceCommandStep[] = [];

    // Check for multi-step patterns
    // Example: "5 किलो आलू और 2 किलो टमाटर cart में add करो फिर order place करो"
    const multiAddPattern = /(\d+)\s*(kg|किलो)\s*(\w+)\s*(और|and)\s*(\d+)\s*(kg|किलो)\s*(\w+)/i;
    const match = text.match(multiAddPattern);

    if (match) {
      steps.push({
        step: 1,
        action: 'add_to_cart',
        params: { product: match[3], quantity: match[1], unit: match[2] },
        status: 'pending'
      });

      steps.push({
        step: 2,
        action: 'add_to_cart',
        params: { product: match[7], quantity: match[5], unit: match[6] },
        status: 'pending'
      });

      if (/(order|ऑर्डर|place)/i.test(text)) {
        steps.push({
          step: 3,
          action: 'place_order',
          params: {},
          status: 'pending'
        });
      }
    }

    return steps;
  }

  /**
   * Get intent configuration
   */
  private getIntentConfig(intent: string, userRole: UserRole): {
    actionRequired: boolean;
    endpoint: string | null;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | null;
    requiresConfirmation: boolean;
  } {
    const configs: Record<string, any> = {
      add_to_cart: { actionRequired: true, endpoint: '/api/cart/add', method: 'POST', requiresConfirmation: false },
      remove_from_cart: { actionRequired: true, endpoint: '/api/cart/remove', method: 'DELETE', requiresConfirmation: true },
      place_order: { actionRequired: true, endpoint: '/api/orders/create', method: 'POST', requiresConfirmation: true },
      cancel_order: { actionRequired: true, endpoint: '/api/orders/cancel', method: 'DELETE', requiresConfirmation: true },
      track_order: { actionRequired: true, endpoint: '/api/orders/track', method: 'GET', requiresConfirmation: false },
      search_product: { actionRequired: true, endpoint: '/api/products/search', method: 'GET', requiresConfirmation: false },
      check_price: { actionRequired: true, endpoint: '/api/products/price', method: 'GET', requiresConfirmation: false },
      add_product: { actionRequired: true, endpoint: '/api/products/create', method: 'POST', requiresConfirmation: false },
      update_product_price: { actionRequired: true, endpoint: '/api/products/update-price', method: 'PUT', requiresConfirmation: false },
      delete_product: { actionRequired: true, endpoint: '/api/products/delete', method: 'DELETE', requiresConfirmation: true },
      check_market_price: { actionRequired: true, endpoint: '/api/market/rates', method: 'GET', requiresConfirmation: false },
      check_wallet: { actionRequired: true, endpoint: '/api/wallet/balance', method: 'GET', requiresConfirmation: false },
      weather_guidance: { actionRequired: true, endpoint: '/api/weather', method: 'GET', requiresConfirmation: false },
      unknown: { actionRequired: false, endpoint: null, method: null, requiresConfirmation: false }
    };

    return configs[intent] || configs.unknown;
  }

  /**
   * Generate natural language response
   */
  private generateResponse(
    intent: string,
    entities: Record<string, any>,
    language: SupportedLanguage,
    userRole: UserRole
  ): string {
    const responses: Record<string, Record<SupportedLanguage, string>> = {
      add_to_cart: {
        en: `Adding ${entities.product || 'item'} to your cart...`,
        hi: `${entities.product || 'सामान'} कार्ट में जोड़ रहे हैं...`,
        mr: `${entities.product || 'वस्तू'} कार्टमध्ये जोडत आहे...`
      },
      place_order: {
        en: 'Placing your order now...',
        hi: 'आपका ऑर्डर प्लेस कर रहे हैं...',
        mr: 'तुमची ऑर्डर देत आहे...'
      },
      check_market_price: {
        en: 'Fetching latest mandi rates...',
        hi: 'ताजा मंडी भाव ला रहे हैं...',
        mr: 'ताज्या मंडी दर आणत आहे...'
      },
      search_product: {
        en: `Searching for ${entities.product || 'products'}...`,
        hi: `${entities.product || 'प्रोडक्ट'} ढूंढ रहे हैं...`,
        mr: `${entities.product || 'उत्पादन'} शोधत आहे...`
      },
      weather_guidance: {
        en: 'Getting weather forecast for your area...',
        hi: 'आपके क्षेत्र का मौसम पूर्वानुमान ला रहे हैं...',
        mr: 'तुमच्या क्षेत्राचा हवामान अंदाज आणत आहे...'
      },
      unknown: {
        en: "I didn't understand that. Could you please rephrase?",
        hi: 'मुझे समझ नहीं आया। क्या आप फिर से बोल सकते हैं?',
        mr: 'मला समजले नाही. कृपया पुन्हा सांगाल का?'
      }
    };

    return responses[intent]?.[language] || responses.unknown[language];
  }

  /**
   * Generate follow-up suggestion
   */
  private generateFollowup(
    intent: string,
    language: SupportedLanguage,
    userRole: UserRole
  ): string | undefined {
    const followups: Record<string, Record<SupportedLanguage, string>> = {
      add_to_cart: {
        en: 'Would you like to place the order now?',
        hi: 'क्या आप अभी ऑर्डर प्लेस करना चाहेंगे?',
        mr: 'तुम्हाला आता ऑर्डर द्यायची आहे का?'
      },
      search_product: {
        en: 'Would you like to add any of these to your cart?',
        hi: 'क्या आप इनमें से कुछ कार्ट में जोड़ना चाहेंगे?',
        mr: 'यापैकी काही कार्टमध्ये जोडायचे आहे का?'
      },
      check_market_price: {
        en: 'Would you like to list your produce at this price?',
        hi: 'क्या आप इस भाव पर अपनी फसल लिस्ट करना चाहेंगे?',
        mr: 'तुम्हाला या दराने तुमचे उत्पादन लिस्ट करायचे आहे का?'
      }
    };

    return followups[intent]?.[language];
  }

  /**
   * Execute voice command
   */
  async executeCommand(intent: string, entities: Record<string, any>, userId?: string): Promise<any> {
    // This would integrate with existing services
    // For now, return mock success
    return {
      success: true,
      intent,
      entities,
      message: 'Command executed successfully'
    };
  }

  /**
   * Get session history
   */
  async getSessionHistory(sessionId: string): Promise<any> {
    // Implement session history retrieval
    return {
      sessionId,
      commands: []
    };
  }

  /**
   * Get voice analytics
   */
  async getVoiceAnalytics(userId?: string): Promise<any> {
    // Implement analytics
    return {
      totalCommands: 0,
      successRate: 0,
      topIntents: []
    };
  }
}

export const voiceService = new VoiceService();
