import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from './prisma.service';

interface ChatResponse {
  message: string;
  recommendations: string[];
  sources: string[];
  language: string;
}

@Injectable()
export class AiChatService {
  private readonly logger = new Logger(AiChatService.name);
  private readonly llmUrl = process.env.LLM_URL || 'http://localhost:11434';
  private readonly model = process.env.LLM_MODEL || 'qwen2.5:latest';

  constructor(private prisma: PrismaService) {}

  async chat(userId: string, message: string, language: string = 'en'): Promise<ChatResponse> {
    try {
      this.logger.log(`Processing chat for user: ${userId}`);

      // Get user history for context
      const userHistory = await this.getUserChatHistory(userId, 5);

      // Build context
      const context = this.buildContext(userHistory, message, language);

      // Call LLM
      const response = await this.callLLM(context, language);

      // Extract recommendations
      const recommendations = this.extractRecommendations(response, userId);

      // Extract sources
      const sources = this.extractSources(response);

      return {
        message: response,
        recommendations,
        sources,
        language,
      };
    } catch (error) {
      this.logger.error(`Chat failed: ${error.message}`);
      return {
        message: 'I apologize, but I encountered an error. Please try again.',
        recommendations: [],
        sources: [],
        language,
      };
    }
  }

  private buildContext(history: any[], message: string, language: string): string {
    let context = `You are an agricultural marketplace assistant. Respond in ${language}.\n\n`;

    // Add conversation history
    if (history.length > 0) {
      context += 'Recent conversation:\n';
      history.forEach((msg) => {
        context += `User: ${msg.userMessage}\nAssistant: ${msg.assistantMessage}\n`;
      });
      context += '\n';
    }

    context += `Current user message: ${message}`;

    return context;
  }

  private async callLLM(context: string, language: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.llmUrl}/api/generate`,
        {
          model: this.model,
          prompt: context,
          stream: false,
          temperature: 0.7,
          top_p: 0.9,
        },
        { timeout: 30000 }
      );

      return response.data.response;
    } catch (error) {
      this.logger.error(`LLM call failed: ${error.message}`);
      throw error;
    }
  }

  async getMarketPriceRecommendation(cropName: string, location: string): Promise<string> {
    try {
      // Get market data
      const marketData = await this.getMarketData(cropName, location);

      const prompt = `
        Based on the following market data for ${cropName} in ${location}:
        ${JSON.stringify(marketData)}
        
        Provide a price recommendation for farmers selling this crop.
      `;

      const response = await this.callLLM(prompt, 'en');
      return response;
    } catch (error) {
      this.logger.error(`Price recommendation failed: ${error.message}`);
      throw error;
    }
  }

  async getCropRecommendation(userId: string, language: string = 'en'): Promise<string> {
    try {
      // Get user's crop history
      const userCrops = await this.getUserCropHistory(userId);

      const prompt = `
        Based on the farmer's crop history: ${userCrops.join(', ')}
        
        Recommend the next crop to plant considering:
        - Seasonal availability
        - Market demand
        - Soil compatibility
        - Profitability
        
        Respond in ${language}.
      `;

      const response = await this.callLLM(prompt, language);
      return response;
    } catch (error) {
      this.logger.error(`Crop recommendation failed: ${error.message}`);
      throw error;
    }
  }

  async explainQualityGrade(grade: string, defects: string[], language: string = 'en'): Promise<string> {
    try {
      const prompt = `
        Explain the quality grade "${grade}" for agricultural products.
        Detected defects: ${defects.join(', ')}
        
        Provide a clear explanation of:
        1. What this grade means
        2. How it affects market value
        3. Recommendations for improvement
        
        Respond in ${language}.
      `;

      const response = await this.callLLM(prompt, language);
      return response;
    } catch (error) {
      this.logger.error(`Quality explanation failed: ${error.message}`);
      throw error;
    }
  }

  private extractRecommendations(response: string, userId: string): string[] {
    const recommendations: string[] = [];

    // Extract recommendations from response
    const recPattern = /recommend|suggest|consider|try/gi;
    if (recPattern.test(response)) {
      // Simple extraction - in production, use NLP
      const sentences = response.split('.');
      sentences.forEach((sentence) => {
        if (recPattern.test(sentence)) {
          recommendations.push(sentence.trim());
        }
      });
    }

    return recommendations.slice(0, 3);
  }

  private extractSources(response: string): string[] {
    const sources: string[] = [];

    // Extract sources from response
    const sourcePattern = /source|reference|based on|according to/gi;
    if (sourcePattern.test(response)) {
      sources.push('Market data');
      sources.push('Agricultural database');
    }

    return sources;
  }

  private async getUserChatHistory(userId: string, limit: number = 5): Promise<any[]> {
    try {
      const messages = await this.prisma.message.findMany({
        where: { senderId: userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return messages.map((msg) => ({
        userMessage: msg.content,
        assistantMessage: '', // Would be populated from previous responses
      }));
    } catch (error) {
      this.logger.error(`Failed to get chat history: ${error.message}`);
      return [];
    }
  }

  private async getUserCropHistory(userId: string): Promise<string[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: { farmerId: userId },
        select: { name: true },
        distinct: ['name'],
      });

      return products.map((p) => p.name);
    } catch (error) {
      this.logger.error(`Failed to get crop history: ${error.message}`);
      return [];
    }
  }

  private async getMarketData(cropName: string, location: string): Promise<any> {
    try {
      // Placeholder for market data retrieval
      return {
        cropName,
        location,
        averagePrice: 500,
        priceRange: { min: 400, max: 600 },
        demand: 'high',
        supply: 'medium',
      };
    } catch (error) {
      this.logger.error(`Failed to get market data: ${error.message}`);
      return {};
    }
  }
}
