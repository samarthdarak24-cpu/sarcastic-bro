/**
 * Agriculture Knowledge Base Service
 * Provides domain expertise to enhance LLM responses
 */

export class AgricultureKnowledgeService {
  /**
   * Get agriculture context for system prompt
   */
  static getAgricultureContext(): string {
    return `You are AgriVoice AI, an expert agricultural assistant helping farmers and buyers in India.

## Your Expertise:
- **Crop Management**: Wheat, rice, sugarcane, cotton, vegetables, fruits
- **Soil Health**: Testing, fertilization, pH management, organic matter
- **Pest & Disease Management**: Identification, organic/chemical solutions, prevention
- **Water Management**: Irrigation techniques, water conservation, rainwater harvesting
- **Weather Planning**: Monsoon patterns, seasonal planning, climate adaptation
- **Market Intelligence**: Price trends, buyer connections, bulk trading
- **Blockchain Traceability**: Product origin verification, quality assurance
- **Logistics**: Shipping, storage, cold chain management

## India Agriculture Context:
- **Climate**: Monsoon-dependent, tropical to temperate zones
- **Seasons**: Kharif (June-Oct), Rabi (Oct-Mar), Summer crops
- **Common Crops**: Wheat, rice, sugarcane, cotton, pulses, oilseeds, vegetables
- **Challenges**: Water scarcity, pest pressure, soil degradation, market volatility
- **Solutions**: Drip irrigation, organic farming, crop insurance, direct marketing

## Communication Style:
- Use simple, practical language
- Provide actionable advice
- Include specific numbers/measurements when relevant
- Acknowledge regional variations
- Be encouraging and supportive
- Use emojis for clarity (🌾 crops, 💧 water, 🐛 pests, etc.)

## Response Guidelines:
1. If question is about agriculture → Give expert advice with practical tips
2. If question is about platform features → Provide clear instructions
3. If question is general knowledge → Answer helpfully like ChatGPT
4. Always be honest about limitations
5. Suggest consulting experts for critical decisions`;
  }

  /**
   * Get platform features context
   */
  static getPlatformContext(): string {
    return `## AgriVoice Platform Features:

### For Farmers:
- **Product Management**: List crops, manage inventory, set prices
- **Smart Selling**: Auto-sell rules, price alerts, bulk orders
- **Market Intelligence**: Real-time prices, trend analysis, buyer connections
- **Quality Verification**: AI crop scanner, blockchain trace, certifications
- **Payments**: Razorpay integration, instant transfers, escrow protection
- **Reputation**: Build trust score, get reviews, earn badges
- **Logistics**: Real-time tracking, insurance, multiple carriers

### For Buyers:
- **Smart Sourcing**: Search by crop/region/price, compare sellers
- **Bulk Purchasing**: Special rates, pre-booking, group orders
- **Bidding System**: Participate in auctions, negotiate prices
- **Order Tracking**: Real-time shipment tracking, delivery confirmation
- **Supplier Insights**: Seller ratings, reviews, performance metrics
- **Escrow Protection**: Safe payments, dispute resolution
- **Market Reports**: Price trends, regional insights, demand forecasts

### General Features:
- **Real-time Chat**: Get instant help from AI assistant
- **Blockchain**: Transparent records, fraud prevention, smart contracts
- **Multi-language**: Hindi, Marathi, English support
- **Mobile App**: Full functionality on smartphones
- **24/7 Support**: Always available to help`;
  }

  /**
   * Get crop-specific advice
   */
  static getCropAdvice(cropName: string): string {
    const cropDatabase: Record<string, string> = {
      wheat: `🌾 **Wheat Farming Guide**
- **Season**: Rabi (Oct-Mar)
- **Soil**: Well-drained, pH 6.5-7.5
- **Water**: 40-50 cm annually, 4-5 irrigations
- **Fertilizer**: 120 kg N, 60 kg P, 40 kg K per hectare
- **Pests**: Armyworm, Hessian fly, shoot fly
- **Yield**: 40-50 quintals/hectare
- **Harvest**: March-April`,

      rice: `🍚 **Rice Farming Guide**
- **Season**: Kharif (June-Oct)
- **Soil**: Clay loam, pH 6.0-7.0
- **Water**: 100-150 cm, flooded conditions
- **Fertilizer**: 100 kg N, 50 kg P, 40 kg K per hectare
- **Pests**: Stem borer, leaf folder, brown planthopper
- **Yield**: 50-60 quintals/hectare
- **Harvest**: September-October`,

      sugarcane: `🍬 **Sugarcane Farming Guide**
- **Season**: Year-round, 12-18 months
- **Soil**: Deep, fertile, well-drained
- **Water**: 200-250 cm, drip irrigation recommended
- **Fertilizer**: 150 kg N, 60 kg P, 60 kg K per hectare
- **Pests**: Stem borer, scale insect, whitefly
- **Yield**: 60-80 tonnes/hectare
- **Harvest**: November-April`,

      cotton: `🌾 **Cotton Farming Guide**
- **Season**: Kharif (June-Oct)
- **Soil**: Well-drained, pH 6.0-7.5
- **Water**: 50-65 cm, 6-8 irrigations
- **Fertilizer**: 100 kg N, 50 kg P, 50 kg K per hectare
- **Pests**: Bollworm, whitefly, spider mite
- **Yield**: 15-20 quintals/hectare
- **Harvest**: October-December`,
    };

    return cropDatabase[cropName.toLowerCase()] || 
      `I don't have specific data for ${cropName}, but I can provide general farming advice. What specific aspect would you like to know about?`;
  }

  /**
   * Get pest management advice
   */
  static getPestAdvice(pestName: string): string {
    const pestDatabase: Record<string, string> = {
      'armyworm': `🐛 **Armyworm Management**
- **Identification**: Green/brown caterpillars, feed on leaves
- **Damage**: Skeletonize leaves, reduce yield
- **Organic Control**: Neem oil, Bacillus thuringiensis (Bt)
- **Chemical**: Chlorpyrifos, Cypermethrin (if severe)
- **Prevention**: Crop rotation, remove crop residue
- **Timing**: Spray at dusk for better effectiveness`,

      'stem borer': `🐛 **Stem Borer Management**
- **Identification**: Larvae bore into stems, cause wilting
- **Damage**: Plant death, yield loss up to 40%
- **Organic Control**: Pheromone traps, parasitic wasps
- **Chemical**: Carbofuran, Chlorpyrifos
- **Prevention**: Use resistant varieties, timely sowing
- **Monitoring**: Check plants weekly for entry holes`,

      'whitefly': `🐛 **Whitefly Management**
- **Identification**: Tiny white insects on leaf undersides
- **Damage**: Sap sucking, yellowing, virus transmission
- **Organic Control**: Yellow sticky traps, neem spray
- **Chemical**: Imidacloprid, Thiamethoxam
- **Prevention**: Remove weeds, maintain plant health
- **Timing**: Early morning spray for best results`,
    };

    return pestDatabase[pestName.toLowerCase()] || 
      `I don't have specific data for ${pestName}. Describe the symptoms and affected crop for better advice.`;
  }

  /**
   * Get soil health advice
   */
  static getSoilAdvice(): string {
    return `🌱 **Soil Health Management**

**Soil Testing**:
- Test every 2-3 years
- Check: pH, NPK, organic matter, micronutrients
- Cost: ₹200-500 per sample
- Results guide fertilizer recommendations

**Improving Soil Health**:
- Add 5-10 tonnes organic matter/hectare annually
- Practice crop rotation (3-4 year cycle)
- Use green manure crops
- Avoid excessive tillage
- Maintain 2-3% organic matter

**Fertilizer Management**:
- Use soil test results for recommendations
- Split nitrogen applications (3-4 times)
- Apply phosphorus at planting
- Use potassium for quality crops
- Consider micronutrients (Zn, B, Fe)

**Organic Farming**:
- Compost: 5-10 tonnes/hectare
- Vermicompost: 2-5 tonnes/hectare
- Biofertilizers: Azospirillum, Phosphobacteria
- Neem cake: 1 tonne/hectare`;
  }

  /**
   * Get irrigation advice
   */
  static getIrrigationAdvice(): string {
    return `💧 **Water Management & Irrigation**

**Irrigation Methods**:
- **Flood**: Traditional, 40-50% water loss
- **Sprinkler**: 20-30% water loss, good for uneven terrain
- **Drip**: 5-10% water loss, best for water conservation
- **Micro-sprinkler**: 10-15% water loss, good for orchards

**Water Requirements by Crop**:
- Wheat: 40-50 cm
- Rice: 100-150 cm
- Sugarcane: 200-250 cm
- Cotton: 50-65 cm
- Vegetables: 30-50 cm

**Irrigation Scheduling**:
- Check soil moisture (hand feel method)
- Irrigate when 50% available water is used
- Avoid waterlogging
- Monitor weather for rainfall

**Water Conservation**:
- Mulching: Reduces evaporation by 30-50%
- Rainwater harvesting: Store for dry season
- Drip irrigation: Saves 40-60% water
- Soil moisture sensors: Optimize timing`;
  }
}
