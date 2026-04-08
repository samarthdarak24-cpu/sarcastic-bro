/**
 * Enhanced AI Service - Real-time data integration
 * Enables AI to access live system data for intelligent responses
 */

import axios from 'axios';

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export interface EnhancedChatRequest {
  sessionId?: string;
  message: string;
  userId?: string;
  authToken?: string;
  realTimeData?: Record<string, any>;
  userProfile?: {
    name?: string;
    role?: string;
    language?: string;
    preferred_style?: string;
  };
  systemPrompt?: string;
}

export interface EnhancedChatResponse {
  sessionId: string;
  response: string;
  intent: {
    intent_type: string;
    entity_type?: string;
    requires_data: boolean;
    requires_confirmation: boolean;
    is_safe_operation?: boolean;
  };
  dataFetched: boolean;
  requiresConfirmation: boolean;
  dataSummary?: string;
  actions?: any[];
  timestamp: string;
}

class EnhancedAIService {
  private sessionId: string | null = null;
  private apiUrl: string;

  constructor() {
    this.apiUrl = AI_SERVICE_URL;
  }

  /**
   * Send message to AI with optional real-time data
   */
  async chat(request: EnhancedChatRequest): Promise<EnhancedChatResponse> {
    try {
      const response = await axios.post<EnhancedChatResponse>(
        `${this.apiUrl}/api/v1/simple-chat/chat/enhanced`,
        {
          session_id: this.sessionId || request.sessionId,
          message: request.message,
          user_id: request.userId,
          auth_token: request.authToken,
          real_time_data: request.realTimeData,
          user_profile: request.userProfile,
          system_prompt: request.systemPrompt,
        },
        {
          timeout: 30000,
        }
      );

      this.sessionId = response.data.sessionId;
      return response.data;
    } catch (error) {
      console.error('Enhanced AI chat error:', error);
      throw error;
    }
  }

  /**
   * Fetch data and chat in one call
   * Automatically fetches relevant data based on message
   */
  async fetchAndChat(
    message: string,
    userId: string,
    authToken: string,
    dataFetcher?: () => Promise<Record<string, any>>,
    userProfile?: EnhancedChatRequest['userProfile'],
    systemPrompt?: string
  ): Promise<EnhancedChatResponse> {
    let realTimeData: Record<string, any> | undefined;

    // Fetch real-time data if fetcher provided
    if (dataFetcher) {
      try {
        realTimeData = await dataFetcher();
        console.log('Fetched real-time data:', realTimeData);
      } catch (error) {
        console.error('Data fetching error:', error);
        // Continue without data
      }
    }

    return this.chat({
      message,
      userId,
      authToken,
       realTimeData,
      userProfile,
      systemPrompt,
    });
  }

  /**
   * Smart chat - automatically detects and fetches required data
   */
  async smartChat(
    message: string,
    userId: string,
    authToken: string,
    dataFetchers: {
      products?: () => Promise<any>;
      orders?: () => Promise<any>;
      payments?: () => Promise<any>;
      market?: () => Promise<any>;
      tenders?: () => Promise<any>;
      user?: () => Promise<any>;
    },
    userProfile?: EnhancedChatRequest['userProfile'],
    systemPrompt?: string
  ): Promise<EnhancedChatResponse> {
    const messageLower = message.toLowerCase();
    let realTimeData: Record<string, any> = {};

    try {
      // Detect what data is needed based on message
      const needsProductData = /show|view|list|my.*product|product.*list/i.test(message);
      const needsOrderData = /show|view|list|my.*order|order.*list|track/i.test(message);
      const needsPaymentData = /balance|payment|transaction|money|pay|escrow/i.test(message);
      const needsMarketData = /price|market|rate|trend|forecast/i.test(message);
      const needsTenderData = /tender|bid|proposal/i.test(message);
      const needsUserData = /profile|account|my.*detail/i.test(message);

      // Fetch relevant data in parallel
      const fetchPromises: Promise<void>[] = [];

      if (needsProductData && dataFetchers.products) {
        fetchPromises.push(
          dataFetchers.products().then(data => {
            realTimeData.products = data;
          }).catch(err => console.error('Product fetch error:', err))
        );
      }

      if (needsOrderData && dataFetchers.orders) {
        fetchPromises.push(
          dataFetchers.orders().then(data => {
            realTimeData.orders = data;
          }).catch(err => console.error('Order fetch error:', err))
        );
      }

      if (needsPaymentData && dataFetchers.payments) {
        fetchPromises.push(
          dataFetchers.payments().then(data => {
            realTimeData.payments = data;
          }).catch(err => console.error('Payment fetch error:', err))
        );
      }

      if (needsMarketData && dataFetchers.market) {
        fetchPromises.push(
          dataFetchers.market().then(data => {
            realTimeData.market = data;
          }).catch(err => console.error('Market fetch error:', err))
        );
      }

      if (needsTenderData && dataFetchers.tenders) {
        fetchPromises.push(
          dataFetchers.tenders().then(data => {
            realTimeData.tenders = data;
          }).catch(err => console.error('Tender fetch error:', err))
        );
      }

      if (needsUserData && dataFetchers.user) {
        fetchPromises.push(
          dataFetchers.user().then(data => {
            realTimeData.user = data;
          }).catch(err => console.error('User fetch error:', err))
        );
      }

      // Wait for all data fetches
      await Promise.all(fetchPromises);

      console.log('Smart chat fetched data:', Object.keys(realTimeData));

    } catch (error) {
      console.error('Smart chat data fetching error:', error);
      // Continue with whatever data we have
    }

    return this.chat({
      message,
      userId,
      authToken,
      realTimeData: Object.keys(realTimeData).length > 0 ? realTimeData : undefined,
      userProfile,
      systemPrompt,
    });
  }

  /**
   * Clear current session
   */
  clearSession() {
    this.sessionId = null;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Set session ID manually
   */
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/api/v1/simple-chat/health`);
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

export const enhancedAIService = new EnhancedAIService();
