/**
 * LLM Service - Unified interface for multiple LLM providers
 * Supports: Ollama (local, free) and OpenAI (cloud)
 */

import axios from 'axios';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: 'ollama' | 'openai';
  tokensUsed?: number;
}

export class LLMService {
  private ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  private ollamaModel = process.env.OLLAMA_MODEL || 'gemma4';
  private openaiApiKey = process.env.OPENAI_API_KEY;
  private openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  private provider: 'ollama' | 'openai' = 'ollama';

  constructor() {
    // Determine which provider to use
    if (this.openaiApiKey) {
      this.provider = 'openai';
      console.log('✅ LLM Service: Using OpenAI');
    } else {
      console.log(`✅ LLM Service: Using Ollama (local) - Model: ${this.ollamaModel}`);
    }
  }

  /**
   * Check if LLM service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      if (this.provider === 'ollama') {
        const response = await axios.get(`${this.ollamaUrl}/api/tags`, { timeout: 5000 });
        return response.status === 200;
      } else {
        // OpenAI is always available if API key is set
        return !!this.openaiApiKey;
      }
    } catch (error) {
      console.error('LLM Service unavailable:', error);
      return false;
    }
  }

  /**
   * Generate response using LLM
   */
  async generateResponse(
    messages: LLMMessage[],
    temperature: number = 0.7,
    maxTokens: number = 1000
  ): Promise<LLMResponse> {
    try {
      if (this.provider === 'openai') {
        return await this.callOpenAI(messages, temperature, maxTokens);
      } else {
        return await this.callOllama(messages, temperature, maxTokens);
      }
    } catch (error) {
      console.error('LLM generation error:', error);
      throw new Error('Failed to generate LLM response');
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(
    messages: LLMMessage[],
    temperature: number,
    maxTokens: number
  ): Promise<LLMResponse> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: this.openaiModel,
        messages,
        temperature,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return {
      content: response.data.choices[0].message.content,
      model: this.openaiModel,
      provider: 'openai',
      tokensUsed: response.data.usage.total_tokens,
    };
  }

  /**
   * Call Ollama API (local)
   */
  private async callOllama(
    messages: LLMMessage[],
    temperature: number,
    maxTokens: number
  ): Promise<LLMResponse> {
    // Convert messages to Ollama format
    const prompt = this.formatMessagesForOllama(messages);

    const response = await axios.post(
      `${this.ollamaUrl}/api/generate`,
      {
        model: this.ollamaModel,
        prompt,
        temperature,
        num_predict: maxTokens,
        stream: false,
      },
      { timeout: 60000 }
    );

    return {
      content: response.data.response.trim(),
      model: this.ollamaModel,
      provider: 'ollama',
    };
  }

  /**
   * Format messages for Ollama (doesn't support system role natively)
   */
  private formatMessagesForOllama(messages: LLMMessage[]): string {
    return messages
      .map((msg) => {
        const role = msg.role === 'system' ? 'SYSTEM' : msg.role.toUpperCase();
        return `${role}: ${msg.content}`;
      })
      .join('\n\n');
  }

  /**
   * Get available models
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      if (this.provider === 'ollama') {
        const response = await axios.get(`${this.ollamaUrl}/api/tags`);
        return response.data.models.map((m: any) => m.name);
      } else {
        return [this.openaiModel];
      }
    } catch (error) {
      console.error('Failed to get models:', error);
      return [];
    }
  }
}

export const llmService = new LLMService();
