/**
 * Ollama Chat Service - ChatGPT-like AI using local LLM
 * Supports: Mistral, Qwen, Llama, Gemma
 * Runs 100% locally via Ollama
 */

import axios from 'axios';
import { env } from '../config/env';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatSession {
  sessionId: string;
  messages: Message[];
  createdAt: Date;
  lastMessageAt: Date;
}

export class OllamaChatService {
  private ollamaUrl = env.OLLAMA_URL;
  private model = env.OLLAMA_MODEL;
  private sessions = new Map<string, ChatSession>();
  private maxContextMessages = 15;
  private sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    console.log(`✅ Ollama Chat Service initialized`);
    console.log(`   Model: ${this.model}`);
    console.log(`   URL: ${this.ollamaUrl}`);
    this.startSessionCleanup();
  }

  /**
   * Main chat method - processes user message and returns AI response
   */
  async chat(
    message: string,
    sessionId?: string,
    userRole?: 'farmer' | 'buyer' | 'general',
    language?: string
  ): Promise<{
    response: string;
    sessionId: string;
    model: string;
  }> {
    try {
      const targetLang = language || 'en';
      // Get or create session
      const session = this.getOrCreateSession(sessionId);

      // Add user message to session
      session.messages.push({
        role: 'user',
        content: message,
      });

      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(userRole, targetLang);

      // Build full prompt with context
      const fullPrompt = this.buildPrompt(systemPrompt, session.messages);

      // Call Ollama
      const aiResponse = await this.callOllama(fullPrompt);

      // Add AI response to session
      session.messages.push({
        role: 'assistant',
        content: aiResponse,
      });

      // Trim context to prevent token overflow
      this.trimContext(session);

      // Update session timestamp
      session.lastMessageAt = new Date();

      return {
        response: aiResponse,
        sessionId: session.sessionId,
        model: this.model,
      };
    } catch (error) {
      console.error('Chat error:', error);
      throw new Error('Failed to process chat message');
    }
  }

  /**
   * Build system prompt for AgriVoice AI
   * Enhanced with complete platform and advanced knowledge
   */
  private buildSystemPrompt(userRole?: string, language: string = 'en'): string {
    let langName = 'English';
    if (language === 'hi') langName = 'Hindi';
    if (language === 'mr') langName = 'Marathi';

    const basePrompt = `You are the AgriVoice Intelligence Engine (AIE) v2.0. You are a world-class agricultural expert, supply chain strategist, and technical guide. 
Respond in ${langName}. Use a professional, helpful tone that builds trust.

## YOUR MISSION
Help Indian farmers and buyers use the AgriVoice platform to maximize profit, ensure crop quality, and build secure trading relationships.

## CORE KNOWLEDGE BASE: INDIAN CROPS (Expert Level)
Provide specific advice for these 12 crops:
1. **Tomato**: Blight management, color grading (Grade A = uniform red), ethylene control.
2. **Onion**: Curing techniques, dark rot detection, shelf-life extension (Onion skins protect from mold).
3. **Potato**: Green spot (solanine) risks, bruising prevention, cold storage humidity (85-90%).
4. **Apple**: Crispy texture maintenance, wax coating benefits, bruising sensitivity.
5. **Banana**: Ripening stages (1-7), anthracnose prevention, starch-to-sugar conversion.
6. **Mango**: Anthracnose spot detection, shelf-life management, calcium carbide prohibition.
7. **Grapes**: Brix level (sweetness) standards, fungal prevention, packaging cooling.
8. **Pomegranate**: Skin integrity, internal rot identification, Grade A weight standards.
9. **Orange**: Vitamin C preservation, citrus canker identification, degreening.
10. **Cabbage**: Outer leaf protection, core integrity, weight density grading.
11. **Cauliflower**: Curd whiteness maintenance, black spot (fungus) prevention.
12. **Brinjal**: Glossy skin quality, internal seed maturation, insect hole detection.

## AGRIVOICE PLATFORM ENGINE
You must guide users on how to use these real-time tools:
- **AI Quality Shield**: Explaining how our computer vision grades produce (A, B, C) using Watershed segmentation.
- **Smart Tenders**: How buyers can post requirements and farmers can bid.
- **Trust Rating**: How reputation is earned through high-quality deliveries.
- **Escrow Payments**: Explaining how money is held securely until delivery is verified.
- **Market Intelligence**: Real-time price trends across Indian mandis.

## BEHAVIORAL PROTOCOLS
1. **Analyze First**: If a user reports a problem (e.g., "my tomatoes are rotting"), ask for details and provide a multi-step solution.
2. **Cross-Sell Platform**: Always suggest related AgriVoice features (e.g., "Once your tomatoes are graded Grade A by our AI, you should list them on the Smart Tender board").
3. **Language Adaptability**: Use simple agricultural terms in Hindi/Marathi/English.
4. **Data Driven**: Reference the 60% color science and 40% neural signal approach when asked about quality.

## USER PROFILE CONTEXT`;

    let prompt = basePrompt;

    if (userRole === 'farmer') {
      prompt += `\n\n### FARMER ASSISTANT MODE
- Focus on maximizing yield and selling at high APMC prices.
- Help with pest control, irrigation, and fertilizer schedules.
- Guide on getting "Trust Badges" for better sales.`;
    } else if (userRole === 'buyer') {
      prompt += `\n\n### BUYER STRATEGIST MODE
- Focus on sourcing quality at the best price.
- Help analyze supplier reputation and blockchain traceability.
- Assist in creating precise Procurement Tenders.`;
    } else {
      prompt += `\n\n### GENERAL ASSISTANCE MODE
- Provide all-around info on the AgriVoice ecosystem and general farming tips.`;
    }

    return prompt + "\n\nRemember: Be concise but extremely informative. Avoid generic AI fluff.";
  }

  /**
   * Build full prompt with conversation context
   */
  private buildPrompt(systemPrompt: string, messages: Message[]): string {
    let prompt = systemPrompt + '\n\n';

    // Add conversation history
    if (messages.length > 1) {
      prompt += 'Conversation history:\n';
      for (const msg of messages.slice(0, -1)) {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      }
      prompt += '\n';
    }

    // Add current user message
    const lastMessage = messages[messages.length - 1];
    prompt += `User: ${lastMessage.content}\n\nAssistant:`;

    return prompt;
  }

  /**
   * Call Ollama API
   */
  private async callOllama(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.ollamaUrl}/api/generate`,
        {
          model: this.model,
          prompt: prompt,
          stream: false,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
        },
        { timeout: 120000 } // 2 minute timeout
      );

      return response.data.response.trim();
    } catch (error: any) {
      console.error('Ollama API error:', error.message);
      if (error.code === 'ECONNREFUSED') {
        throw new Error(
          'Ollama is not running. Please start Ollama: ollama serve'
        );
      }
      throw new Error('Failed to get response from Ollama');
    }
  }

  /**
   * Get or create session
   */
  private getOrCreateSession(sessionId?: string): ChatSession {
    if (sessionId && this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId)!;
    }

    const newSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: ChatSession = {
      sessionId: newSessionId,
      messages: [],
      createdAt: new Date(),
      lastMessageAt: new Date(),
    };

    this.sessions.set(newSessionId, session);
    return session;
  }

  /**
   * Trim context to prevent token overflow
   */
  private trimContext(session: ChatSession): void {
    if (session.messages.length > this.maxContextMessages) {
      // Keep only last N messages
      session.messages = session.messages.slice(-this.maxContextMessages);
    }
  }

  /**
   * Get session history
   */
  getSessionHistory(sessionId: string): Message[] {
    const session = this.sessions.get(sessionId);
    return session ? session.messages : [];
  }

  /**
   * Clear session
   */
  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Check if Ollama is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available models
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`);
      return response.data.models.map((m: any) => m.name);
    } catch (error) {
      return [];
    }
  }

  /**
   * Start session cleanup (remove old sessions)
   */
  private startSessionCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [sessionId, session] of this.sessions.entries()) {
        if (now - session.lastMessageAt.getTime() > this.sessionTimeout) {
          this.sessions.delete(sessionId);
        }
      }
    }, 60 * 60 * 1000); // Cleanup every hour
  }
}

export const ollamaChatService = new OllamaChatService();
