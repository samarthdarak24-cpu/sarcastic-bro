import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export class CropAdvisorService {
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  // 1. AI Crop Recommendation Engine
  async getCropRecommendations(userId: string, farmData: any) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/crop-advisor/recommend`, {
        soil_type: farmData.soilType,
        ph_level: farmData.phLevel,
        nitrogen: farmData.nitrogen,
        phosphorus: farmData.phosphorus,
        potassium: farmData.potassium,
        temperature: farmData.temperature,
        humidity: farmData.humidity,
        rainfall: farmData.rainfall,
        location: farmData.location,
        farm_size: farmData.farmSize,
        previous_crops: farmData.previousCrops
      });

      await prisma.cropRecommendation.create({
        data: {
          userId,
          recommendations: response.data.recommendations,
          confidence: response.data.confidence,
          factors: response.data.factors
        }
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to get crop recommendations');
    }
  }

  // 2. Growth Stage Tracker
  async trackGrowthStage(userId: string, cropId: string) {
    try {
      const crop = await prisma.crop.findUnique({ where: { id: cropId } });
      
      const response = await axios.post(`${this.aiServiceUrl}/crop-advisor/growth-stage`, {
        crop_type: crop?.type,
        planting_date: crop?.plantingDate,
        current_date: new Date(),
        weather_data: await this.getWeatherData(crop?.location)
      });

      return {
        currentStage: response.data.current_stage,
        progress: response.data.progress,
        nextStage: response.data.next_stage,
        daysToNextStage: response.data.days_to_next_stage,
        recommendations: response.data.recommendations,
        healthScore: response.data.health_score
      };
    } catch (error) {
      throw new Error('Failed to track growth stage');
    }
  }

  // 3. Disease & Pest Alert System
  async analyzeDiseaseRisk(userId: string, imageData?: string) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/crop-advisor/disease-detection`, {
        image: imageData,
        user_id: userId,
        location: await this.getUserLocation(userId),
        weather: await this.getWeatherData(await this.getUserLocation(userId))
      });

      if (response.data.disease_detected) {
        await this.createAlert(userId, 'DISEASE', response.data);
      }

      return {
        diseaseDetected: response.data.disease_detected,
        diseaseName: response.data.disease_name,
        confidence: response.data.confidence,
        severity: response.data.severity,
        treatment: response.data.treatment,
        preventiveMeasures: response.data.preventive_measures,
        estimatedLoss: response.data.estimated_loss
      };
    } catch (error) {
      throw new Error('Failed to analyze disease risk');
    }
  }

  // 4. Irrigation Optimizer
  async getIrrigationPlan(userId: string, cropId: string) {
    try {
      const crop = await prisma.crop.findUnique({ where: { id: cropId } });
      const weather = await this.getWeatherData(crop?.location);
      
      const response = await axios.post(`${this.aiServiceUrl}/crop-advisor/irrigation`, {
        crop_type: crop?.type,
        growth_stage: crop?.growthStage,
        soil_moisture: crop?.soilMoisture,
        weather_forecast: weather,
        farm_size: crop?.area,
        irrigation_type: crop?.irrigationType
      });

      return {
        dailyRequirement: response.data.daily_requirement,
        schedule: response.data.schedule,
        waterSaved: response.data.water_saved,
        costSavings: response.data.cost_savings,
        efficiency: response.data.efficiency,
        alerts: response.data.alerts
      };
    } catch (error) {
      throw new Error('Failed to get irrigation plan');
    }
  }

  // 5. Fertilizer Calculator
  async calculateFertilizer(userId: string, cropId: string, soilData: any) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/crop-advisor/fertilizer`, {
        crop_type: soilData.cropType,
        soil_nutrients: {
          nitrogen: soilData.nitrogen,
          phosphorus: soilData.phosphorus,
          potassium: soilData.potassium
        },
        target_yield: soilData.targetYield,
        farm_size: soilData.farmSize,
        growth_stage: soilData.growthStage
      });

      return {
        npkRatio: response.data.npk_ratio,
        quantity: response.data.quantity,
        applicationSchedule: response.data.schedule,
        estimatedCost: response.data.cost,
        expectedYieldIncrease: response.data.yield_increase,
        recommendations: response.data.recommendations
      };
    } catch (error) {
      throw new Error('Failed to calculate fertilizer');
    }
  }

  // 6. Harvest Predictor
  async predictHarvest(userId: string, cropId: string) {
    try {
      const crop = await prisma.crop.findUnique({ where: { id: cropId } });
      
      const response = await axios.post(`${this.aiServiceUrl}/crop-advisor/harvest-prediction`, {
        crop_type: crop?.type,
        planting_date: crop?.plantingDate,
        variety: crop?.variety,
        weather_history: await this.getWeatherHistory(crop?.location),
        growth_data: crop?.growthData
      });

      return {
        predictedDate: response.data.predicted_date,
        confidence: response.data.confidence,
        estimatedYield: response.data.estimated_yield,
        qualityGrade: response.data.quality_grade,
        optimalHarvestWindow: response.data.optimal_window,
        marketPrice: response.data.market_price,
        revenue: response.data.estimated_revenue
      };
    } catch (error) {
      throw new Error('Failed to predict harvest');
    }
  }

  // 7. Crop Rotation Planner
  async generateRotationPlan(userId: string, farmData: any) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/crop-advisor/rotation-plan`, {
        current_crop: farmData.currentCrop,
        soil_health: farmData.soilHealth,
        farm_size: farmData.farmSize,
        location: farmData.location,
        seasons: farmData.seasons,
        market_demand: await this.getMarketDemand(farmData.location)
      });

      return {
        rotationPlan: response.data.rotation_plan,
        soilHealthImprovement: response.data.soil_improvement,
        estimatedRevenue: response.data.revenue,
        riskScore: response.data.risk_score,
        recommendations: response.data.recommendations
      };
    } catch (error) {
      throw new Error('Failed to generate rotation plan');
    }
  }

  // 8. Market Price Advisor
  async getMarketAdvice(userId: string, cropType: string) {
    try {
      const response = await axios.post(`${this.aiServiceUrl}/crop-advisor/market-advice`, {
        crop_type: cropType,
        location: await this.getUserLocation(userId),
        quantity: await this.getUserCropQuantity(userId, cropType)
      });

      return {
        currentPrice: response.data.current_price,
        pricetrend: response.data.trend,
        forecast: response.data.forecast,
        bestSellingTime: response.data.best_time,
        demandScore: response.data.demand_score,
        competitionLevel: response.data.competition,
        recommendation: response.data.recommendation
      };
    } catch (error) {
      throw new Error('Failed to get market advice');
    }
  }

  // 9. Weather Impact Analyzer
  async analyzeWeatherImpact(userId: string, cropId: string) {
    try {
      const crop = await prisma.crop.findUnique({ where: { id: cropId } });
      const weather = await this.getWeatherForecast(crop?.location, 14);
      
      const response = await axios.post(`${this.aiServiceUrl}/crop-advisor/weather-impact`, {
        crop_type: crop?.type,
        growth_stage: crop?.growthStage,
        weather_forecast: weather,
        location: crop?.location
      });

      return {
        riskLevel: response.data.risk_level,
        threats: response.data.threats,
        opportunities: response.data.opportunities,
        recommendations: response.data.recommendations,
        protectiveMeasures: response.data.protective_measures,
        estimatedImpact: response.data.estimated_impact
      };
    } catch (error) {
      throw new Error('Failed to analyze weather impact');
    }
  }

  // 10. Crop Health Score
  async getCropHealthScore(userId: string, cropId: string) {
    try {
      const crop = await prisma.crop.findUnique({ where: { id: cropId } });
      
      const response = await axios.post(`${this.aiServiceUrl}/crop-advisor/health-score`, {
        crop_id: cropId,
        growth_data: crop?.growthData,
        soil_data: crop?.soilData,
        weather_data: await this.getWeatherData(crop?.location),
        irrigation_data: crop?.irrigationData,
        pest_data: crop?.pestData
      });

      return {
        overallScore: response.data.overall_score,
        components: {
          growth: response.data.growth_score,
          nutrition: response.data.nutrition_score,
          water: response.data.water_score,
          pest: response.data.pest_score,
          disease: response.data.disease_score
        },
        trend: response.data.trend,
        alerts: response.data.alerts,
        recommendations: response.data.recommendations
      };
    } catch (error) {
      throw new Error('Failed to get crop health score');
    }
  }

  // Helper methods
  private async getWeatherData(location: any) {
    // Integration with weather API
    return {};
  }

  private async getWeatherForecast(location: any, days: number) {
    return {};
  }

  private async getWeatherHistory(location: any) {
    return {};
  }

  private async getUserLocation(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user?.location;
  }

  private async getUserCropQuantity(userId: string, cropType: string) {
    return 0;
  }

  private async getMarketDemand(location: any) {
    return {};
  }

  private async createAlert(userId: string, type: string, data: any) {
    await prisma.alert.create({
      data: { userId, type, data }
    });
  }
}

export default new CropAdvisorService();
