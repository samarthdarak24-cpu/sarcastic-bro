import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

class FarmInsightsService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  async getAllInsights() {
    try {
      const [soil, crop, weather, pest, financial, resources, market, sustainability, benchmarking, maintenance] = await Promise.all([
        this.getSoilHealth(),
        this.getCropPerformance(),
        this.getWeatherIntelligence(),
        this.getPestDetection(),
        this.getFinancialAnalytics(),
        this.getResourceOptimization(),
        this.getMarketIntelligence(),
        this.getSustainabilityScore(),
        this.getBenchmarking(),
        this.getPredictiveMaintenance()
      ]);

      return {
        soilHealth: soil,
        cropPerformance: crop,
        weather,
        pestDetection: pest,
        financial,
        resources,
        market,
        sustainability,
        benchmarking,
        maintenance
      };
    } catch (error) {
      console.error('Failed to load insights:', error);
      throw error;
    }
  }

  async getSoilHealth() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/api/insights/soil-health`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      return this.getMockSoilHealth();
    }
  }

  async getCropPerformance() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/api/insights/crop-performance`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      return this.getMockCropPerformance();
    }
  }

  async getWeatherIntelligence() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/api/insights/weather`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      return this.getMockWeather();
    }
  }

  async getPestDetection() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/api/insights/pest-detection`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      return this.getMockPestDetection();
    }
  }

  async getFinancialAnalytics() {
    try {
      const response = await axios.get(`${API_URL}/api/insights/financial`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      return this.getMockFinancial();
    }
  }

  async getResourceOptimization() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/api/insights/resources`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      return this.getMockResources();
    }
  }

  async getMarketIntelligence() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/api/insights/market`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      return this.getMockMarket();
    }
  }

  async getSustainabilityScore() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/api/insights/sustainability`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      return this.getMockSustainability();
    }
  }

  async getBenchmarking() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/api/insights/benchmarking`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      return this.getMockBenchmarking();
    }
  }

  async getPredictiveMaintenance() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/api/insights/maintenance`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      return this.getMockMaintenance();
    }
  }

  async analyzeSoilImage(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post(`${AI_SERVICE_URL}/api/insights/analyze-soil`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async detectPest(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post(`${AI_SERVICE_URL}/api/insights/detect-pest`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  // Mock data methods
  private getMockSoilHealth() {
    return {
      nitrogen: 245,
      phosphorus: 45,
      potassium: 180,
      ph: 6.8,
      organicMatter: 3.2,
      moisture: 68,
      overallScore: 87,
      recommendations: [
        { type: 'fertilizer', description: 'Apply nitrogen fertilizer', priority: 'medium' }
      ]
    };
  }

  private getMockCropPerformance() {
    return {
      currentYield: 12.5,
      predictedYield: 14.2,
      growthStage: 'Flowering',
      healthScore: 92,
      harvestDate: '2026-05-15',
      issues: []
    };
  }

  private getMockWeather() {
    return {
      current: { temp: 28, humidity: 65, condition: 'Partly Cloudy' },
      forecast: [
        { date: '2026-04-06', temp: 30, rain: 20 },
        { date: '2026-04-07', temp: 29, rain: 60 },
        { date: '2026-04-08', temp: 27, rain: 80 }
      ],
      alerts: [{ type: 'rain', message: 'Heavy rainfall expected', severity: 'warning' }]
    };
  }

  private getMockPestDetection() {
    return {
      detected: [],
      riskLevel: 'Low',
      lastScan: new Date().toISOString(),
      recommendations: []
    };
  }

  private getMockFinancial() {
    return {
      revenue: 450000,
      expenses: 280000,
      profit: 170000,
      roi: 60.7,
      projectedRevenue: 520000,
      breakdown: {
        seeds: 50000,
        fertilizer: 80000,
        labor: 100000,
        equipment: 50000
      }
    };
  }

  private getMockResources() {
    return {
      waterUsage: 15000,
      energyConsumption: 2500,
      efficiencyScore: 92,
      savings: 12000,
      recommendations: []
    };
  }

  private getMockMarket() {
    return {
      currentPrice: 2500,
      priceChange: 8,
      demand: 'High',
      optimalSellDate: '2026-04-20',
      competitors: 45,
      marketShare: 12
    };
  }

  private getMockSustainability() {
    return {
      carbonFootprint: 45,
      score: 78,
      certifications: ['Organic', 'Fair Trade'],
      improvements: []
    };
  }

  private getMockBenchmarking() {
    return {
      yourScore: 87,
      regionalAverage: 72,
      topPerformer: 95,
      ranking: 12,
      totalFarms: 150
    };
  }

  private getMockMaintenance() {
    return {
      equipment: [
        { name: 'Tractor', health: 85, nextMaintenance: '2026-05-01', status: 'good' },
        { name: 'Irrigation System', health: 92, nextMaintenance: '2026-06-15', status: 'good' }
      ],
      alerts: []
    };
  }
}

export const farmInsightsService = new FarmInsightsService();
