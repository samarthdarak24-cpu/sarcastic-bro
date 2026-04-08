import { ChatWidgetResponse } from './chatWidgetService';
import { enhancedAIService } from './enhancedAIService';
import { marketDataService } from './marketDataService';
import { productService } from './productService';
import { orderService } from './orderService';
import { financeService } from './financeService';

/**
 * Advanced Agri Assistant - Implements the user's MASTER PROMPT logic
 * Focuses on: Problem Solving, Context Awareness, Multi-language Support, 
 * Clarity, Smart Suggestions, and Domain Awareness.
 * NOW WITH REAL-TIME AI (Ollama) INTEGRATION!
 */
export const MASTER_PROMPT = `
You are an advanced AI assistant designed to help users solve real-world agricultural problems.
Rules:
1. Problem Solving: Break complex problems into simple steps. Provide actionable solutions.
2. Context Awareness: Remember previous messages. Use context for better responses.
3. Multi-language: Support English, Hindi, and Marathi.
4. Simple & Clear: Avoid jargon. Use examples.
5. Smart Suggestions: Provide tips, shortcuts, optimizations.
6. Domain Focus: Crop prices, Weather, Fertilizers, Farming techniques, Market insights.
Goal: Deliver responses that feel like ChatGPT — intelligent, helpful, and practical.
`;

export interface AIContext {
  language: 'en' | 'hi' | 'mr';
  userRole: 'FARMER' | 'BUYER';
  location?: string;
  name?: string;
  history: string[];
}

/**
 * Get AI response with REAL-TIME data from Ollama
 */
export const getAdvancedAIResponse = async (message: string, ctx: AIContext): Promise<ChatWidgetResponse> => {
  const lang = ctx.language || 'en';

  try {
    // Get auth token
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    const userId = ctx.name || 'anonymous';

    // Call smart chat which automatically detects and fetches required data
    const aiResponse = await enhancedAIService.smartChat(
      message,
      userId,
      authToken,
      {
        products: () => productService.getMyProducts(),
        orders: () => orderService.getMyOrders(),
        payments: () => financeService.getPayments(),
        market: () => marketDataService.getCurrentPrices(ctx.location)
      },
      {
        name: ctx.name,
        role: ctx.userRole,
        language: lang
      },
      MASTER_PROMPT
    );

    const suggestions = generateSmartSuggestions(aiResponse.intent.entity_type, lang);
    const actions = generateSmartActions(aiResponse.intent.intent_type, aiResponse.intent.entity_type, lang);

    return {
      response: aiResponse.response,
      suggestions,
      intent: aiResponse.intent.intent_type,
      confidence: aiResponse.dataFetched ? 0.95 : 0.8,
      actions
    };

  } catch (error) {
    console.error('AI service error, using offline fallback:', error);
    return getOfflineFallback(message, ctx);
  }
};

/**
 * Generate smart actions (buttons) based on intent
 */
function generateSmartActions(intent: string, entity: string | undefined, lang: string): any[] {
  const actions: any[] = [];
  
  const t: Record<string, any> = {
    en: { view_market: 'View Market', view_orders: 'My Orders', add_product: 'Add Product', track: 'Track Order' },
    hi: { view_market: 'बाजार देखें', view_orders: 'मेरे ऑर्डर', add_product: 'प्रोडक्ट जोड़ें', track: 'ट्रैक करें' },
    mr: { view_market: 'बाजार पहा', view_orders: 'माझे ऑर्डर', add_product: 'प्रोडक्ट जोडा', track: 'ट्रॅक करा' }
  };
  
  const labels = t[lang] || t.en;

  if (intent.includes('price') || entity === 'market') {
    actions.push({ id: 'view-market', label: labels.view_market, query: labels.view_market, action: 'navigate', payload: '/market', category: 'market' });
  }
  
  if (intent.includes('order') || entity === 'order') {
    actions.push({ id: 'view-orders', label: labels.view_orders, query: labels.view_orders, action: 'navigate', payload: '/orders', category: 'order' });
    actions.push({ id: 'track-order', label: labels.track, query: labels.track, action: 'navigate', payload: '/tracker', category: 'order' });
  }
  
  if (intent.includes('product') || entity === 'product') {
    actions.push({ id: 'add-product', label: labels.add_product, query: labels.add_product, action: 'navigate', payload: '/inventory', category: 'quality' });
  }

  return actions;
}

/**
 * Generate smart suggestions based on context
 */
function generateSmartSuggestions(entityType: string | undefined, lang: string): string[] {
  const suggestions: Record<string, Record<string, string[]>> = {
    market: {
      en: ['Price trends', 'Best time to sell', 'Compare prices'],
      hi: ['मूल्य रुझान दिखाएं', 'बेचने का समय', 'कीमतों की तुलना'],
      mr: ['किंमत कल दाखवा', 'विक्रीची वेळ', 'किंमतींची तुलना']
    },
    product: {
      en: ['How to improve quality?', 'Best price for my crop', 'List new item'],
      hi: ['गुणवत्ता कैसे सुधारें?', 'फसल की सही कीमत', 'नया आइटम जोड़ें'],
      mr: ['गुणवत्ता कशी सुधारावी?', 'पिकासाठी सर्वोत्तम किंमत', 'नवीन आयटम जोडा']
    },
    order: {
      en: ['Track my last order', 'Cancel pending order', 'Order history'],
      hi: ['मेरा पिछला ऑर्डर ट्रैक करें', 'ऑर्डर रद्द करें', 'ऑर्डर इतिहास'],
      mr: ['माझा शेवटचा ऑर्डर ट्रॅक करा', 'ऑर्डर रद्द करा', 'ऑर्डर इतिहास']
    },
    default: {
      en: ['Market prices', 'Weather forecast', 'Crop advice'],
      hi: ['बाजार कीमतें', 'मौसम पूर्वानुमान', 'फसल सलाह'],
      mr: ['बाजार किंमती', 'हवामान अंदाज', 'पीक सल्ला']
    }
  };

  return suggestions[entityType || 'default']?.[lang as 'en'|'hi'|'mr'] || suggestions.default.en;
}

/**
 * Offline fallback when both Ollama and Microservice are down
 */
async function getOfflineFallback(message: string, ctx: AIContext): Promise<ChatWidgetResponse> {
  const msgLower = message.toLowerCase();
  const lang = ctx.language || 'en';

  const translations: Record<string, any> = {
    en: {
      step_by_step: "Here is your solution:",
      smart_suggestions: "💡 Suggestions:",
      price_tip: "Try checking weekly averages.",
      weather_tip: "Adjust irrigation based on forecast.",
      crop_tip: "Organic fertilizers improve soil.",
      order_tip: "Check the status in your Order Tracker.",
      general_welcome: "I'm your FarmGuard AI. I help optimize your farm with real-time data."
    },
    hi: {
      step_by_step: "समाधान:",
      smart_suggestions: "💡 सुझाव:",
      price_tip: "साप्ताहिक औसत की जांच करें।",
      weather_tip: "पूर्वानुमान के अनुसार सिंचाई करें।",
      crop_tip: "जैविक खाद मिट्टी सुधारती है।",
      order_tip: "ऑर्डर ट्रैकर में स्थिति जांचें।",
      general_welcome: "मैं आपका FarmGuard AI हूं। मैं रीयल-टाइम डेटा के साथ आपकी खेती को बेहतर बनाने में मदद करता हूँ।"
    },
    mr: {
      step_by_step: "समाधान:",
      smart_suggestions: "💡 सल्ले:",
      price_tip: "साप्ताहिक सरासरी तपासा।",
      weather_tip: "अंदाजानुसार सिंचन करा।",
      crop_tip: "सेंद्रिय खते माती सुधारतात।",
      order_tip: "ऑर्डर ट्रॅकरमध्ये स्थिती तपासा।",
      general_welcome: "मी तुमचा FarmGuard AI आहे. मी रीयल-टाइम डेटासह तुमची शेती सुधारण्यास मदत करतो।"
    }
  };

  const t = translations[lang] || translations.en;

  if (msgLower.includes('price') || msgLower.includes('भाव') || msgLower.includes('किंमत')) {
    return {
      response: `📈 **Market Prices (Offline Mode)**\n\nPlease check the 'Market Intelligence' tab for live rates.\n\n**${t.smart_suggestions}**\n• ${t.price_tip}`,
      suggestions: generateSmartSuggestions('market', lang),
      intent: 'price_query',
      confidence: 0.5,
      actions: [{ id: 'off-mkt', label: t[lang].view_market || 'Market', query: 'market prices', action: 'navigate', payload: '/market' }]
    };
  }

  if (msgLower.includes('order') || msgLower.includes('ऑर्डर')) {
    return {
      response: `📦 **Orders (Offline Mode)**\n\nYou can track and manage your orders in the Orders tab.\n\n**${t.smart_suggestions}**\n• ${t.order_tip}`,
      suggestions: generateSmartSuggestions('order', lang),
      intent: 'order_query',
      confidence: 0.5,
      actions: [{ id: 'off-ord', label: t[lang].view_orders || 'Orders', query: 'my orders', action: 'navigate', payload: '/orders' }]
    };
  }

  return {
    response: `${t.general_welcome}\n\nI can help with:\n• **Price Maximization**\n• **Weather Protection**\n• **Order Tracking**\n• **Market Sentiment**`,
    suggestions: generateSmartSuggestions('default', lang),
    intent: 'general',
    confidence: 0.5,
    actions: []
  };
}
