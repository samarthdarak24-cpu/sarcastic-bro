/**
 * OpenAI Service - Whisper + GPT Integration
 * Complete voice assistant with Whisper (speech-to-text) and GPT (intent understanding)
 */

import axios from 'axios';
import FormData from 'form-data';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1';

export class OpenAIService {
  /**
   * Transcribe audio using Whisper
   * Step 3: Send to Whisper → Step 4: Get text
   */
  async transcribeAudio(audioBuffer: Buffer, language: string = 'hi'): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', audioBuffer, {
        filename: 'audio.webm',
        contentType: 'audio/webm',
      });
      formData.append('model', 'whisper-1');
      formData.append('language', language); // hi, en, mr
      formData.append('response_format', 'json');

      const response = await axios.post(
        `${OPENAI_API_URL}/audio/transcriptions`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            ...formData.getHeaders(),
          },
        }
      );

      return response.data.text;
    } catch (error: any) {
      console.error('Whisper transcription error:', error.response?.data || error.message);
      throw new Error('Failed to transcribe audio');
    }
  }

  /**
   * Classify intent using GPT-4
   * Step 5: Send to AI (GPT) → Step 6: AI returns intent + action
   */
  async classifyIntent(
    transcript: string,
    userRole: 'FARMER' | 'BUYER',
    language: string,
    context?: any
  ): Promise<any> {
    try {
      const systemPrompt = this.getSystemPrompt(userRole, language);
      const userPrompt = this.getUserPrompt(transcript, context);

      const response = await axios.post(
        `${OPENAI_API_URL}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = JSON.parse(response.data.choices[0].message.content);
      return result;
    } catch (error: any) {
      console.error('GPT intent classification error:', error.response?.data || error.message);
      throw new Error('Failed to classify intent');
    }
  }

  /**
   * Generate natural language response using GPT
   * Step 10: Convert to voice (text generation)
   */
  async generateResponse(
    intent: string,
    entities: any,
    result: any,
    language: string
  ): Promise<string> {
    try {
      const prompt = `
Generate a natural, conversational response in ${language} language for:
- Intent: ${intent}
- Entities: ${JSON.stringify(entities)}
- Result: ${JSON.stringify(result)}

Keep it short (1-2 sentences), friendly, and natural.
`;

      const response = await axios.post(
        `${OPENAI_API_URL}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a helpful agriculture marketplace assistant.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 100,
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('GPT response generation error:', error.response?.data || error.message);
      throw new Error('Failed to generate response');
    }
  }

  /**
   * Get system prompt for GPT based on user role
   */
  private getSystemPrompt(userRole: 'FARMER' | 'BUYER', language: string): string {
    const roleContext = userRole === 'FARMER' 
      ? 'You are helping a farmer manage their agricultural products, sales, and farm operations.'
      : 'You are helping a buyer find and purchase agricultural products.';

    return `You are AgriVoice AI, an intelligent voice assistant for an agriculture marketplace.

${roleContext}

Your task is to understand voice commands in Hindi, English, or Marathi and classify them into structured intents.

IMPORTANT: Always respond with valid JSON in this exact format:
{
  "intent": "intent_name",
  "entities": {
    "product": "product_name",
    "quantity": "number",
    "unit": "kg/quintal/ton",
    "price": "number",
    "action": "specific_action"
  },
  "action_required": true/false,
  "api_endpoint": "/api/endpoint",
  "method": "GET/POST/PUT/DELETE",
  "confidence": 0.0-1.0,
  "requires_confirmation": true/false,
  "response": "Natural language response in ${language}",
  "language": "${language}"
}

SUPPORTED INTENTS:
${userRole === 'BUYER' ? `
- add_to_cart: Add product to cart
- remove_from_cart: Remove product from cart
- place_order: Place/confirm order
- cancel_order: Cancel order
- track_order: Track order status
- search_product: Search for products
- check_price: Check product price
- compare_products: Compare products
- reorder: Reorder previous order
` : `
- add_product: List product for sale
- update_product_price: Update product price
- delete_product: Remove product listing
- check_market_price: Check mandi rates
- view_sales: View sales analytics
- check_earnings: Check earnings
- crop_recommendation: Get crop suggestions
- weather_info: Get weather forecast
- pest_detection: Detect pest issues
`}

Extract all relevant entities from the command and provide a natural response.`;
  }

  /**
   * Get user prompt with context
   */
  private getUserPrompt(transcript: string, context?: any): string {
    let prompt = `Voice command: "${transcript}"\n\n`;

    if (context?.conversationHistory?.length > 0) {
      prompt += `Previous commands:\n`;
      context.conversationHistory.slice(-3).forEach((cmd: any) => {
        prompt += `- ${cmd.intent}\n`;
      });
      prompt += '\n';
    }

    prompt += 'Classify this command and return the JSON response.';

    return prompt;
  }

  /**
   * Text-to-Speech using OpenAI TTS
   * Step 10: Convert to voice
   */
  async textToSpeech(text: string, language: string = 'hi'): Promise<Buffer> {
    try {
      // Map language to voice
      const voiceMap: Record<string, string> = {
        'en': 'alloy',
        'hi': 'nova',
        'mr': 'nova',
      };

      const response = await axios.post(
        `${OPENAI_API_URL}/audio/speech`,
        {
          model: 'tts-1',
          input: text,
          voice: voiceMap[language] || 'nova',
          response_format: 'mp3',
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data);
    } catch (error: any) {
      console.error('TTS error:', error.response?.data || error.message);
      throw new Error('Failed to generate speech');
    }
  }

  /**
   * Check if OpenAI API key is configured
   */
  isConfigured(): boolean {
    return !!OPENAI_API_KEY && OPENAI_API_KEY.length > 0;
  }
}

export const openaiService = new OpenAIService();
