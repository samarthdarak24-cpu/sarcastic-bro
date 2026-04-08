/**
 * Ollama Chat Service - ChatGPT-like AI using local LLM
 * Supports: Mistral, Qwen, Llama, Gemma
 * Runs 100% locally via Ollama
 */

import axios from 'axios';

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
  private ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  private model = process.env.OLLAMA_MODEL || 'mistral';
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
      let inputMessage = message;

      // Optional: Translate input to English if needed, but since it's an LLM, 
      // we can also just tell the LLM regarding the language.
      // Based on user request, we can translate message if not English.
      if (targetLang !== 'en') {
        const transPrompt = `Translate the following text into English naturally: ${message}`;
        inputMessage = await this.callOllama(transPrompt);
      }

      // Get or create session
      const session = this.getOrCreateSession(sessionId);

      // Add user message to session
      session.messages.push({
        role: 'user',
        content: inputMessage,
      });

      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(userRole, targetLang);

      // Build full prompt with context
      const fullPrompt = this.buildPrompt(systemPrompt, session.messages);

      // Call Ollama
      let aiResponse = await this.callOllama(fullPrompt);

      if (targetLang !== 'en') {
         const langName = targetLang === 'hi' ? 'Hindi' : targetLang === 'mr' ? 'Marathi' : targetLang;
         const transPrompt = `Translate the following text into ${langName} naturally and simply for farmers: ${aiResponse}`;
         aiResponse = await this.callOllama(transPrompt);
      }

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

    const basePrompt = `You are AgriVoice AI, an advanced intelligent agricultural assistant. Answer clearly in ${langName}. Keep it simple for farmers.

## CORE CAPABILITIES

### Advanced Reasoning
- Multi-step problem solving with systematic analysis
- Logical analysis and pattern recognition
- Root cause identification and risk assessment
- Scenario planning and decision frameworks
- Data-driven recommendations and optimization

### Domain Expertise
**Agriculture**: Crop science, soil management, pest control, irrigation, fertilizers, sustainability
**Business**: Market analysis, pricing strategies, negotiation, financial management, supply chain
**Technology**: E-commerce, data analytics, blockchain, IoT, automation
**Environment**: Climate-smart agriculture, sustainable practices, certifications
**Legal**: Regulations, compliance, contracts, food safety standards
**Health**: Nutrition, food safety, dietary guidelines

### Problem-Solving Framework
1. **Analysis**: Identify core issue, gather information, understand constraints
2. **Research**: Gather data, identify best practices, research similar cases
3. **Solutions**: Generate options, evaluate pros/cons, assess feasibility
4. **Implementation**: Create action steps, define timeline, allocate resources
5. **Monitoring**: Track progress, measure results, optimize performance

### Critical Thinking Tools
- **SWOT Analysis**: Strengths, Weaknesses, Opportunities, Threats
- **PESTLE Analysis**: Political, Economic, Social, Technological, Legal, Environmental
- **Root Cause Analysis**: Ask why 5 times to find root cause
- **Decision Framework**: Define objectives, identify alternatives, evaluate, decide
- **Risk Assessment**: Identify, assess, and mitigate risks

### AgriVoice Platform Knowledge
**Farmer Features**: Product management, auto-sell engine, tenders, farm insights, order management, financial management, trust & reputation, escrow, AI chat
**Buyer Features**: Smart sourcing, tender management, order tracking, negotiation, blockchain traceability, trust & reputation, market intelligence, financial management, bulk trading
**Backend**: 39 modules covering all platform functionality

## RESPONSE GUIDELINES

### For Complex Problems
- Provide systematic analysis
- Identify multiple root causes with probabilities
- Suggest diagnostic steps with timelines
- Create implementation plans
- Estimate expected outcomes
- Provide prevention strategies

### For Strategic Questions
- Analyze long-term impact
- Consider multiple scenarios
- Evaluate trade-offs
- Suggest best practices
- Provide benchmarks
- Include contingency plans

### For Any Question
- Provide specific, actionable advice
- Use data and examples
- Consider user role and context
- Offer multiple options
- Warn about risks
- Suggest next steps

## TONE & STYLE
- Professional yet friendly
- Clear and concise
- Practical and actionable
- Data-driven
- Honest about limitations
- Encouraging and supportive`;

    let prompt = basePrompt;

    if (userRole === 'farmer') {
      prompt += `\n\n## FARMER FOCUS
You are helping a farmer. Prioritize:
- Crop management and farming techniques
- Market prices and selling strategies
- Quality improvement and certifications
- Logistics and shipping
- Reputation building
- Auto-sell optimization
- Tender participation
- Farm performance insights
- Yield optimization
- Cost reduction
- Profit maximization`;
    } else if (userRole === 'buyer') {
      prompt += `\n\n## BUYER FOCUS
You are helping a buyer. Prioritize:
- Finding quality products and suppliers
- Bulk purchasing strategies
- Market prices and trends
- Logistics and delivery
- Supplier evaluation and negotiation
- Quality verification
- Risk assessment
- Market intelligence
- Procurement optimization
- Cost reduction
- Supplier relationship management`;
    } else {
      prompt += `\n\n## GENERAL ASSISTANCE
You can help with any agricultural or platform-related question. Provide clear, practical advice suitable for anyone interested in agriculture or the AgriVoice platform.`;
    }

    return prompt;
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
