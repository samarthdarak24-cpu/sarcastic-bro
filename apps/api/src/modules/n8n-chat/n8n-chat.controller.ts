import { Request, Response } from 'express';
import axios from 'axios';

export class N8nChatController {
  /**
   * POST /api/n8n/chat
   * Handle chat messages - LLM-powered
   */
  static async handleChat(req: Request, res: Response) {
    try {
      const { message, userRole, userName } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Get N8N webhook URL from environment
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

      if (!n8nWebhookUrl) {
        // Fallback response if N8N is not configured
        console.warn('N8N webhook URL not configured, using fallback response');
        return res.json({
          response: getFallbackResponse(message, userRole)
        });
      }

      try {
        // Call N8N webhook
        const response = await axios.post(
          n8nWebhookUrl,
          {
            message,
            userRole: userRole?.toLowerCase() || 'farmer',
            userName: userName || 'User',
            timestamp: new Date().toISOString()
          },
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // Return N8N response
        return res.json({
          response: response.data.response || response.data.output || response.data.message || 'I received your message!',
          suggestions: response.data.suggestions || []
        });
      } catch (n8nError: any) {
        console.error('N8N webhook error:', n8nError.message);
        
        // Fallback to mock response
        return res.json({
          response: getFallbackResponse(message, userRole)
        });
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      return res.status(500).json({
        error: 'Failed to process chat message',
        message: error.message
      });
    }
  }
}

/**
 * Generate fallback response when N8N is unavailable
 */
function getFallbackResponse(message: string, userRole?: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Farmer-specific responses
  if (userRole === 'farmer' || userRole === 'FARMER') {
    if (lowerMessage.includes('crop') || lowerMessage.includes('plant')) {
      return "Based on current market trends and weather conditions, I recommend focusing on crops with high demand. Check the Market Prices section for real-time data. Would you like specific recommendations for your region?";
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
      return "Current market prices are available in the Market Prices section of your dashboard. I can help you analyze trends and suggest the best time to sell. What crop are you interested in?";
    }
    if (lowerMessage.includes('quality') || lowerMessage.includes('grade')) {
      return "You can use our AI Quality Scan feature to analyze your crop quality instantly. Just upload an image and get detailed grading, defect detection, and recommendations!";
    }
    if (lowerMessage.includes('sell') || lowerMessage.includes('buyer')) {
      return "To connect with buyers, make sure your crops are listed with quality certificates. Our platform matches you with verified buyers based on your produce quality and quantity.";
    }
    if (lowerMessage.includes('payment') || lowerMessage.includes('money')) {
      return "All payments are secured through our escrow system. You can track pending payments in the Wallet section. Funds are released automatically upon delivery confirmation.";
    }
  }
  
  // General responses
  if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
    return "I'm here to help! You can ask me about crop recommendations, market prices, quality analysis, connecting with buyers, or managing your farm operations. What would you like to know?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your AI farming assistant. I can help you with crop management, market insights, quality analysis, and connecting with buyers. How can I assist you today?";
  }
  
  // Default response
  return "I'm your AI farming assistant. I can help you with crop recommendations, market prices, quality analysis, and connecting with buyers. Please note: I'm currently in offline mode. For full AI capabilities, ensure the N8N service is configured. How can I help you today?";
}
