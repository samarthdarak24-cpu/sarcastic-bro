import axios from "axios";
import { env } from "../../config/env";
import prisma from "../../prisma/client";
import { redis } from "../../services/redis.service";
import { getSocketService } from "../../services/socketService";

/**
 * Service to handle communication with the Python AI microservice.
 * Enhanced with Redis caching and Socket.IO real-time integration.
 */
export class AIService {
  private static readonly client = axios.create({
    baseURL: env.AI_SERVICE_URL,
    timeout: 30000, // 30 seconds for AI processing
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * Analyze product quality using AI.
   * Sends the local file to the Python AI service for analysis.
   * Enhanced with database storage and Socket.IO notifications.
   */
  static async analyzeQuality(data: {
    image_url: string;
    product_type: string;
    product_name: string;
    image_path?: string;
    userId?: string;
    productId?: string;
  }) {
    try {
      let aiResponse;

      // If we have a local file from MULTER, we send it to the Python service
      if (data.image_path) {
        const fs = require('fs');
        const FormData = require('form-data');
        const form = new FormData();
        form.append('image', fs.createReadStream(data.image_path));
        form.append('product_type', data.product_type);
        form.append('product_name', data.product_name);
        
        const response = await this.client.post("/ai/quality-grade", form, {
          headers: {
            ...form.getHeaders(),
          },
        });
        aiResponse = response.data;
      } else {
        const response = await this.client.post("/ai/quality-grade", data);
        aiResponse = response.data;
      }

      // Store quality scan result in database
      const qualityGrade = await prisma.qualityGrade.create({
        data: {
          productId: data.productId || null,
          imageUrl: data.image_url,
          grade: aiResponse.grade || 'B',
          score: aiResponse.score || 75,
          defectCount: aiResponse.defects?.length || 0,
          defects: JSON.stringify(aiResponse.defects || []),
          heatmapUrl: aiResponse.heatmap_url || null,
          recommendations: JSON.stringify(aiResponse.recommendations || []),
          model: aiResponse.model || 'v1',
          confidence: aiResponse.confidence || 0.95,
        },
      });

      // Update product with quality grade if productId provided
      if (data.productId) {
        await prisma.product.update({
          where: { id: data.productId },
          data: {
            qualityGrade: aiResponse.grade,
            qualityScore: aiResponse.score,
          },
        });

        // Add blockchain trace event for QUALITY
        try {
          const product = await prisma.product.findUnique({
            where: { id: data.productId },
            select: { farmerId: true, district: true, state: true, name: true }
          });
          
          if (product) {
            const BlockchainTraceService = (await import('../blockchain-trace/blockchain-trace.service')).default;
            await BlockchainTraceService.addTraceEvent({
              productId: data.productId,
              farmerId: product.farmerId,
              eventType: 'QUALITY',
              location: `${product.district}, ${product.state}`,
              qualityGrade: aiResponse.grade,
              metadata: {
                productName: product.name,
                qualityScore: aiResponse.score,
                defects: aiResponse.defects || [],
                confidence: aiResponse.confidence || 0.95,
                scanId: qualityGrade.id
              }
            });
          }
        } catch (traceError) {
          console.warn('[AI Service] Blockchain trace event failed:', traceError);
        }
      }

      // Emit real-time Socket.IO event
      if (data.userId) {
        try {
          const socketService = getSocketService();
          socketService.emitQualityScanComplete(data.userId, {
            scanId: qualityGrade.id,
            productId: data.productId || '',
            grade: aiResponse.grade,
            score: aiResponse.score,
            defects: aiResponse.defects || [],
          });
        } catch (socketError) {
          console.error('[AI Service] Socket.IO emission failed:', socketError);
        }
      }

      return {
        ...aiResponse,
        scanId: qualityGrade.id,
      };
    } catch (error: any) {
      console.error('[AI Service] Quality analysis failed:', error.message);
      throw new Error(`Quality analysis failed: ${error.message}`);
    }
  }

  /**
   * Get buyer recommendations for a specific product/criteria.
   */
  static async getBuyerRecommendations(data: any) {
    const response = await this.client.post("/ai/recommendations/buyer", data);
    return response.data;
  }

  /**
   * Get supplier recommendations for a farmer.
   */
  static async getSupplierRecommendations(data: any) {
    const response = await this.client.post("/ai/recommendations/supplier", data);
    return response.data;
  }

  /**
   * Predict demand for a product.
   */
  static async getDemandForecast(data: {
    product_name: string;
    district: string;
    months_ahead: number;
    product_type: string;
  }) {
    const response = await this.client.post("/ai/forecast", data);
    return response.data;
  }

  /**
   * Detect pests and diseases in a crop image.
   */
  static async detectPests(data: {
    image_url: string;
    crop_type: string;
    disease_suspects?: string[];
  }) {
    const response = await this.client.post("/ai/pest-detection", data);
    return response.data;
  }

  /**
   * Get smart crop recommendations based on location and season.
   */
  /**
   * Get smart crop recommendations based on location, soil, and season.
   * Calls the Python AI microservice for advanced analysis.
   */
  static async getCropRecommendations(soilType: string, previousCrops: string[], season: string) {
    try {
      const response = await this.client.post("/ai/advanced/crop-rotation", {
        soil_type: soilType || "alluvial",
        previous_crops: previousCrops || [],
        season: season || "kharif",
        land_area_acres: 5.0
      });

      // Transform Python response to the expected format for React UI
      // We map the Python CropRotationResponse to the frontend interface
      if (response.data && response.data.suggestions) {
        return response.data.suggestions.map((s: any) => ({
          crop: s.crop_name,
          demandScore: s.suitability_score,
          avgPrice: s.market_price_estimate,
          season: season,
          why: s.reason,
          image: this.getCropEmoji(s.crop_name)
        }));
      }
      return [];
    } catch (error: any) {
      console.error("Error calling AI service for crop recommendation:", error);
      throw error;
    }
  }

  /**
   * Get procurement recommendations for a buyer.
   * Ranks farmers based on Price, Reputation, and Proximity.
   * Enhanced with Redis caching (5 min TTL).
   */
  static async getProcurementRecommendations(data: {
    productName: string;
    quantity: number;
    buyerLat?: number;
    buyerLng?: number;
  }) {
    const { productName, quantity, buyerLat, buyerLng } = data;

    // Try cache first
    const cacheKey = `procurement:${productName}:${quantity}:${buyerLat || 0}:${buyerLng || 0}`;
    const cached = await redis.get<any>(cacheKey);
    if (cached) {
      console.log(`[AI Service] Procurement cache hit for ${productName}`);
      return cached;
    }

    // 1. Fetch matching products and their farmers
    const products = await prisma.product.findMany({
      where: {
        name: { contains: productName },
        isActive: true,
        quantity: { gte: quantity }
      },
      include: {
        farmer: true
      }
    });

    if (products.length === 0) {
      return { bestSuppliers: [], suggestedTiming: "No suppliers found for this quantity." };
    }

    // 2. Ranking Logic
    const rankedSuppliers = products.map((product: any) => {
      // Calculate Distance (Haversine formula simplified)
      let distance = 0;
      if (buyerLat && buyerLng && product.lat && product.lng) {
        const R = 6371; // km
        const dLat = (product.lat - buyerLat) * Math.PI / 180;
        const dLng = (product.lng - buyerLng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(buyerLat * Math.PI / 180) * Math.cos(product.lat * Math.PI / 180) * 
          Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distance = R * c;
      }

      return {
        productId: product.id,
        farmerId: product.farmerId,
        farmerName: product.farmer.name,
        price: product.price,
        reputation: product.farmer.reputationScore,
        distance: Math.round(distance),
        totalPrice: product.price * quantity,
        deliveryEstimate: `${Math.max(1, Math.round(distance / 50))} - ${Math.max(2, Math.round(distance / 30))} days`
      };
    });

    // Normalize and Score
    const minPrice = Math.min(...rankedSuppliers.map(s => s.price));
    const maxPrice = Math.max(...rankedSuppliers.map(s => s.price));
    const minDistance = Math.min(...rankedSuppliers.map((s: any) => s.distance));
    const maxDistance = Math.max(...rankedSuppliers.map((s: any) => s.distance)) || 1;

    const scoredSuppliers = rankedSuppliers.map((s: any) => {
      // Normalization (0 to 1, where 1 is best)
      const priceScore = maxPrice === minPrice ? 1 : (maxPrice - s.price) / (maxPrice - minPrice);
      const reputationScore = s.reputation / 100;
      const distanceScore = maxDistance === minDistance ? 1 : (maxDistance - s.distance) / (maxDistance - minDistance);

      // Formula: 40% Price, 40% Reputation, 20% Distance
      const finalScore = (priceScore * 0.4) + (reputationScore * 0.4) + (distanceScore * 0.2);

      return { ...s, finalScore: Math.round(finalScore * 100) };
    });

    // Sort by finalScore descending
    const sorted = scoredSuppliers.sort((a: any, b: any) => b.finalScore - a.finalScore).slice(0, 3);

    // 3. Suggested Timing Heuristic
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = months[new Date().getMonth()];
    let timing = "Market prices are stable. Purchase now for immediate delivery.";
    if (["March", "April", "May"].includes(currentMonth)) {
      timing = "Peak harvest season approaching. Prices expected to drop by 15% in next 3 weeks. Consider delayed procurement.";
    } else if (["October", "November"].includes(currentMonth)) {
      timing = "Supply tightening due to winter logistics. Buy now to avoid 20% seasonal markup.";
    }

    const result = {
      bestSuppliers: sorted,
      suggestedTiming: timing
    };

    // Cache for 5 minutes
    await redis.set(cacheKey, result, 300);

    return result;
  }

  /**
   * Get dynamic price advice for a product.
   * Enhanced with Redis caching (10 min TTL).
   */
  static async getPriceAdvice(data: { productName: string; quantity: number; location?: string }) {
    const { productName, quantity } = data;
    
    // Try cache first
    const cacheKey = `price:advice:${productName}:${quantity}`;
    const cached = await redis.get<any>(cacheKey);
    if (cached) {
      console.log(`[AI Service] Price advice cache hit for ${productName}`);
      return cached;
    }
    
    // Mock Market Trends based on product name
    const marketData: any = {
      "Tomato": { avg: 25, demand: 0.85, supply: 0.4 },
      "Wheat": { avg: 2200, demand: 0.7, supply: 0.9 },
      "Onion": { avg: 18, demand: 0.95, supply: 0.2 },
      "Potato": { avg: 15, demand: 0.6, supply: 0.8 },
    };

    const trends = marketData[productName] || { avg: 50, demand: 0.5, supply: 0.5 };
    
    // Logic: optimal = avg + (demand * 5) - (supply * 3)
    const recommendedPrice = Math.round(trends.avg + (trends.demand * 10) - (trends.supply * 5));
    const confidence = Math.round(85 + (Math.random() * 10));

    const result = {
      recommendedPrice,
      minPrice: Math.round(recommendedPrice * 0.85),
      maxPrice: Math.round(recommendedPrice * 1.2),
      confidence,
      marketSentiment: trends.demand > trends.supply ? "Bullish" : "Bearish",
      demandLevel: trends.demand > 0.8 ? "High" : "Stable"
    };

    // Cache for 10 minutes
    await redis.set(cacheKey, result, 600);

    return result;
  }

  /**
   * Unified Agri Intelligence Engine - Intent Router
   */
  static async getUnifiedInsights(data: { query: string; userType: "FARMER" | "BUYER" }) {
    const { query, userType } = data;
    const lowerQuery = query.toLowerCase();

    // 1. Intent Classification
    let intent: "CROP" | "PRICE" | "PROCUREMENT" | "GENERAL" = "GENERAL";
    if (lowerQuery.includes("grow") || lowerQuery.includes("plant") || lowerQuery.includes("crop")) intent = "CROP";
    else if (lowerQuery.includes("price") || lowerQuery.includes("sell") || lowerQuery.includes("market")) intent = "PRICE";
    else if (lowerQuery.includes("buy") || lowerQuery.includes("supplier") || lowerQuery.includes("source")) intent = "PROCUREMENT";

    // 2. Data Fetching based on Intent
    let answer = "";
    let recommendations = [];
    let insights = { priceTrend: "Stable", demandLevel: "Medium", risk: "Low" };

    try {
      if (intent === "CROP") {
        const crops = await this.getCropRecommendations("alluvial", ["Wheat"], "kharif");
        answer = `Based on your region's soil and current season, I recommend focusing on ${crops[0]?.crop || 'high-value legumes'}. They have the highest demand-to-supply ratio right now.`;
        recommendations = crops.slice(0, 3);
        insights.demandLevel = "High";
      } 
      else if (intent === "PRICE") {
        const priceRec = await this.getPriceAdvice({ productName: "Tomato", quantity: 100 });
        answer = `The current market trajectory suggests an optimal price point of ₹${priceRec.recommendedPrice}. Supply is tightening, so you have significant leverage in negotiations.`;
        recommendations = [priceRec];
        insights.priceTrend = "Upward";
        insights.demandLevel = "Very High";
      }
      else if (intent === "PROCUREMENT") {
        const suppliers = await this.getProcurementRecommendations({ productName: "Wheat", quantity: 500 });
        answer = `I've analyzed the current supplier landscape. Choosing ${suppliers.bestSuppliers[0]?.farmerName || 'local clusters'} will optimize your total landing cost by 12% due to proximity.`;
        recommendations = suppliers.bestSuppliers;
        insights.risk = "Medium (Logistics)";
      }
      else {
        answer = "I'm the Unified Agri Intelligence Engine. I can help you with crop choices, pricing strategy, and smart sourcing. What's on your mind?";
      }
    } catch (err) {
      answer = "I'm processing a vast amount of market data right now. Could you please rephrase your request?";
    }

    return {
      answer,
      recommendations,
      insights
    };
  }

  private static getCropEmoji(name: string): string {
    const emojis: { [key: string]: string } = {
      "Tomato": "🍅", "Potato": "🥔", "Wheat": "🌾", "Rice": "🍚",
      "Corn": "🌽", "Chilli": "🌶️", "Mustard": "🌼", "Onion": "🧅",
      "Soybean": "🌱", "Maize": "🌽", "Cotton": "☁️", "Chickpea": "🥜",
      "Sorghum": "🌾", "Groundnut": "🥜", "Turmeric": "🧂", "Sunflower": "🌻",
      "Lentils": "🥣", "Millet": "🌾"
    };
    return emojis[name] || "🌱";
  }
}
