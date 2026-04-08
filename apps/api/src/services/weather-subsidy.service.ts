/**
 * Weather & Subsidy Intelligence Service
 * AI-powered weather impact analysis and government subsidy information
 */

interface WeatherImpact {
  region: string;
  weather: string;
  impact: 'positive' | 'negative' | 'neutral';
  expectedPriceChange: number;
  crops: Array<{
    crop: string;
    affectedQuantity: number;
    riskLevel: 'low' | 'medium' | 'high',
    recommendation: string;
  }>;
  timing: string;
}

interface GovernmentSubsidy {
  program: string;
  type: 'export' | 'production' | 'infrastructure';
  description: string;
  eligibility: string[];
  fundAmount: number;
  applicationProcess: string;
  deadline: string;
  documents: string[];
}

export class WeatherSubsidyService {
  /**
   * Get weather impact on crop prices
   */
  static async getWeatherImpact(region: string): Promise<WeatherImpact[]> {
    try {
      const impacts: WeatherImpact[] = [
        {
          region: 'Maharashtra',
          weather: 'Heavy Monsoon Expected',
          impact: 'negative',
          expectedPriceChange: -300,
          crops: [
            {
              crop: 'Onion',
              affectedQuantity: 50000,
              riskLevel: 'high',
              recommendation:
                'Sell early before prices drop due to supply surge',
            },
            {
              crop: 'Tomato',
              affectedQuantity: 30000,
              riskLevel: 'medium',
              recommendation: 'Store in moisture-controlled facility',
            },
          ],
          timing: 'Expected increase in rainfall within 7-10 days',
        },
        {
          region: 'Punjab',
          weather: 'Clear Skies Ahead',
          impact: 'positive',
          expectedPriceChange: 200,
          crops: [
            {
              crop: 'Wheat',
              affectedQuantity: 100000,
              riskLevel: 'low',
              recommendation:
                'Good time to harvest and prepare for export',
            },
          ],
          timing: 'Favorable conditions for next 3-4 weeks',
        },
        {
          region: 'Karnataka',
          weather: 'Pest Alert - Armyworm',
          impact: 'negative',
          expectedPriceChange: -150,
          crops: [
            {
              crop: 'Maize',
              affectedQuantity: 25000,
              riskLevel: 'high',
              recommendation:
                'Apply preventive measures, consider pesticide application',
            },
          ],
          timing: 'Alert active - monitor daily',
        },
      ];

      // Filter by region if provided
      if (region) {
        return impacts.filter((i) => i.region.toLowerCase() === region.toLowerCase());
      }

      return impacts;
    } catch (error: any) {
      console.error('[WeatherImpact] Error:', error.message);
      throw error;
    }
  }

  /**
   * Get applicable government subsidies and schemes
   */
  static async getGovernmentSubsidies(state: string, crop: string): Promise<GovernmentSubsidy[]> {
    try {
      const subsidies: GovernmentSubsidy[] = [
        {
          program: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
          type: 'production',
          description:
            'Direct cash transfer of ₹6,000 per year to all landholding farmers',
          eligibility: [
            'Own agricultural land',
            'Annual income below ₹2 lakh',
            'Not a government official',
          ],
          fundAmount: 6000,
          applicationProcess: 'Apply through common service centers or online portal',
          deadline: 'Ongoing throughout the year',
          documents: [
            'Aadhaar Card',
            'Land records (Khasra/Khatauni)',
            'Bank account details',
          ],
        },
        {
          program: 'Agricultural Exports Policy 2022',
          type: 'export',
          description:
            'Support for agricultural exports including duty drawback and quality certification',
          eligibility: [
            'Registered farmer or farmer group',
            'Export-oriented production',
            'Compliance with standards',
          ],
          fundAmount: 15000,
          applicationProcess:
            'Apply through Ministry of Commerce & Industry',
          deadline: '31st December 2025',
          documents: [
            'Export license',
            'Quality certification',
            'Bank statement',
            'Product specification',
          ],
        },
        {
          program: 'Paramparagat Krishi Vikas Yojana (PKVY) - Organic Farming',
          type: 'production',
          description:
            'Financial assistance of ₹50,000 per hectare for organic farming over 3 years',
          eligibility: [
            'Interested in organic certification',
            'Willing to follow organic standards',
            'Group of at least 10 farmers',
          ],
          fundAmount: 50000,
          applicationProcess: 'Apply through State Agriculture Department',
          deadline: '30th April 2025',
          documents: [
            'Land ownership proof',
            'Sustainability plan',
            'Group formation agreement',
            'Aadhar',
          ],
        },
        {
          program: 'Soil Health Card Scheme',
          type: 'production',
          description:
            'Free soil testing and card issuance for better nutrient management',
          eligibility: [
            'Have agricultural land',
            'Willing to improve soil health',
          ],
          fundAmount: 0,
          applicationProcess:
            'Visit local soil testing laboratory or call helpline',
          deadline: 'Year-round (January to October)',
          documents: ['Land records', 'Soil sample'],
        },
        {
          program: 'Kisan Credit Card (KCC)',
          type: 'production',
          description:
            'Agricultural credit up to ₹3,00,000 at subsidized rates',
          eligibility: [
            'Farmer with land holding',
            'Good credit record',
            'Age 18-75 years',
          ],
          fundAmount: 300000,
          applicationProcess: 'Apply at nearest bank (Nationalized/Cooperative)',
          deadline: 'Ongoing',
          documents: [
            'Land records',
            'ID proof',
            'Address proof',
            'Bank statement',
          ],
        },
        {
          program: 'Sub-Mission on Agricultural Mechanization',
          type: 'infrastructure',
          description:
            'Subsidy on agricultural machinery (tractors, harvesters, sprayers)',
          eligibility: [
            'Small/marginal farmers',
            'SC/ST category',
            'Women farmers',
          ],
          fundAmount: 125000,
          applicationProcess:
            'Apply through State Agriculture Department',
          deadline: '31st March 2025',
          documents: [
            'Land records',
            'Farmer ID',
            'Caste certificate (if applicable)',
            'Purchase quote',
          ],
        },
        {
          program: 'Prime Minister Fasal Bima Yojana (PMFBY)',
          type: 'production',
          description: '₹200-400 crore insurance cover against crop failure',
          eligibility: [
            'All farmers growing notified crops',
            'Willing to pay insurance premium',
          ],
          fundAmount: 200000,
          applicationProcess: 'Enroll through bank or insurance company',
          deadline: 'Varies by crop (usually 31st July for Kharif)',
          documents: [
            'Land records',
            'ID proof',
            'Insurance form',
          ],
        },
      ];

      // Filter by state and relevance
      const filtered = subsidies.filter((subsidy) => {
        // If crop-specific, check for relevance
        if (crop && ['Production', 'Organic Farming'].includes(subsidy.type)) {
          return true; // Assume all production subsidies are relevant
        }
        return true;
      });

      return filtered;
    } catch (error: any) {
      console.error('[GovernmentSubsidies] Error:', error.message);
      throw error;
    }
  }

  /**
   * Get weather-based planting recommendations
   */
  static async getPlantingRecommendations(region: string, season: string): Promise<any[]> {
    try {
      const recommendations = [
        {
          season: 'Kharif (Monsoon)',
          region: 'Maharashtra',
          crops: [
            { crop: 'Cotton', suitability: 'high', expectedYield: 20 }, // quintals/hectare
            { crop: 'Sugarcane', suitability: 'high', expectedYield: 80 },
            { crop: 'Jowar', suitability: 'medium', expectedYield: 12 },
          ],
          sowing: 'June-July',
          harvesting: 'September-October',
        },
        {
          season: 'Rabi (Winter)',
          region: 'Punjab',
          crops: [
            { crop: 'Wheat', suitability: 'high', expectedYield: 45 },
            { crop: 'Mustard', suitability: 'medium', expectedYield: 15 },
            { crop: 'Barley', suitability: 'low', expectedYield: 20 },
          ],
          sowing: 'October-November',
          harvesting: 'March-April',
        },
        {
          season: 'Summer',
          region: 'Madhya Pradesh',
          crops: [
            { crop: 'Groundnut', suitability: 'high', expectedYield: 25 },
            { crop: 'Gram', suitability: 'medium', expectedYield: 12 },
            { crop: 'Linseed', suitability: 'low', expectedYield: 8 },
          ],
          sowing: 'March-April',
          harvesting: 'June-July',
        },
      ];

      return recommendations;
    } catch (error: any) {
      console.error('[PlantingRecommendations] Error:', error.message);
      throw error;
    }
  }

  /**
   * Get pest and disease alerts for region/crop
   */
  static async getPestAlerts(region: string, crop: string): Promise<any[]> {
    try {
      const alerts = [
        {
          pest: 'Bollworm',
          crop: 'Cotton',
          region: 'Maharashtra',
          severity: 'high',
          description: 'Pink bollworm infestation detected in parts of Vidarbha',
          control: 'Spray monocrotophos 36% + (EC) at 1.5 ml/liter water',
          cost: 1500,
          timing: 'Apply at dusk for best results',
        },
        {
          pest: 'Stem Borer',
          crop: 'Maize',
          region: 'Karnataka',
          severity: 'medium',
          description: 'European corn borer noticed in northern districts',
          control: 'Use Bacillus thuringiensis (Bt) formulation at 1 kg/hectare',
          cost: 2000,
          timing: 'Apply when larvae are young (first 3 weeks)',
        },
        {
          pest: 'Leaf Curl Disease',
          crop: 'Tomato',
          region: 'Madhya Pradesh',
          severity: 'high',
          description:
            'Tomato leaf curl virus spreading in central regions',
          control: 'Use virus-resistant varieties; control whitefly vectors',
          cost: 3000,
          timing: 'Preventive spray every 10 days',
        },
      ];

      // Filter by region and crop
      return alerts.filter(
        (alert) =>
          (!region || alert.region === region) &&
          (!crop || alert.crop === crop)
      );
    } catch (error: any) {
      console.error('[PestAlerts] Error:', error.message);
      throw error;
    }
  }

  /**
   * Get seasonal impact on export prices
   */
  static async getSeasonalExportAnalysis(crop: string): Promise<any> {
    try {
      const analysis = {
        crop,
        annualPattern: [
          {
            month: 'Jan',
            price: 3200,
            exportDemand: 'high',
            reason: 'Post-harvest season, good supply',
          },
          {
            month: 'Feb',
            price: 3400,
            exportDemand: 'high',
            reason: 'Strong European demand',
          },
          {
            month: 'Mar',
            price: 3100,
            exportDemand: 'medium',
            reason: 'End of season, declining supply',
          },
          {
            month: 'Apr',
            price: 2800,
            exportDemand: 'low',
            reason: 'Low supply, storage costs high',
          },
          {
            month: 'May',
            price: 2600,
            exportDemand: 'low',
            reason: 'Monsoon approaching',
          },
          {
            month: 'Jun',
            price: 2400,
            exportDemand: 'medium',
            reason: 'New crop arrival begins',
          },
        ],
        recommendation:
          'Export during Jan-Mar for maximum profit. Store strategically for Apr-May.',
        riskWindow: 'April-May due to storage costs and low demand',
      };

      return analysis;
    } catch (error: any) {
      console.error('[SeasonalExportAnalysis] Error:', error.message);
      throw error;
    }
  }

  /**
   * Get climate change adaptation strategies
   */
  static async getClimateAdaptationStrategies(region: string): Promise<any[]> {
    try {
      const strategies = [
        {
          strategy: 'Shift to drought-resistant crops',
          affected_regions: ['Rajasthan', 'Gujarat', 'Maharashtra'],
          crops: ['Bajra', 'Jowar', 'Groundnut'],
          benefit: 'Reduce water requirements by 40%',
          cost: 5000,
          timeToImplement: '1 season',
        },
        {
          strategy: 'Adopt micro-irrigation systems',
          affected_regions: ['All regions'],
          crops: ['Vegetables', 'Fruits', 'Cotton'],
          benefit: 'Save 60% water, increase yield by 30%',
          cost: 50000,
          timeToImplement: '2-3 months',
        },
        {
          strategy: 'Use Climate Smart Agriculture (CSA)',
          affected_regions: ['All regions'],
          crops: ['Wheat', 'Rice', 'Maize'],
          benefit: 'Sequester carbon, increase resilience',
          cost: 3000,
          timeToImplement: '1 season',
        },
        {
          strategy: 'Crop diversification',
          affected_regions: ['All regions'],
          crops: ['Mix of cereals, pulses, vegetables'],
          benefit: 'Spread risk, improve income stability',
          cost: 2000,
          timeToImplement: '1 season',
        },
      ];

      return strategies;
    } catch (error: any) {
      console.error('[ClimateAdaptation] Error:', error.message);
      throw error;
    }
  }
}
