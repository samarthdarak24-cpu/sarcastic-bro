import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const priceAdvisorService = {
  async getMarketIntelligence() {
    try {
      const response = await axios.get(`${API_URL}/api/price-advisor/market-intelligence`);
      return response.data;
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
      return null;
    }
  },

  async getPricingStrategy() {
    try {
      const response = await axios.get(`${API_URL}/api/price-advisor/pricing-strategy`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pricing strategy:', error);
      return null;
    }
  },

  async getCompetitorAnalysis() {
    try {
      const response = await axios.get(`${API_URL}/api/price-advisor/competitor-analysis`);
      return response.data;
    } catch (error) {
      console.error('Error fetching competitor analysis:', error);
      return [];
    }
  },

  async getPriceForecast() {
    try {
      const response = await axios.get(`${API_URL}/api/price-advisor/forecast`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price forecast:', error);
      return null;
    }
  },

  async getNegotiationAssistant() {
    try {
      const response = await axios.get(`${API_URL}/api/price-advisor/negotiation`);
      return response.data;
    } catch (error) {
      console.error('Error fetching negotiation data:', error);
      return null;
    }
  },

  async getSeasonalPatterns() {
    try {
      const response = await axios.get(`${API_URL}/api/price-advisor/seasonal`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seasonal patterns:', error);
      return null;
    }
  },

  async getBulkPricing() {
    try {
      const response = await axios.get(`${API_URL}/api/price-advisor/bulk-pricing`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bulk pricing:', error);
      return null;
    }
  },

  async getMarketSentiment() {
    try {
      const response = await axios.get(`${API_URL}/api/price-advisor/sentiment`);
      return response.data;
    } catch (error) {
      console.error('Error fetching market sentiment:', error);
      return null;
    }
  },

  async getPriceAlerts() {
    try {
      const response = await axios.get(`${API_URL}/api/price-advisor/alerts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price alerts:', error);
      return [];
    }
  },

  async getProfitOptimization() {
    try {
      const response = await axios.get(`${API_URL}/api/price-advisor/profit-optimization`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profit optimization:', error);
      return null;
    }
  }
};
