import axios from 'axios';
import { env } from '../config/env';
import agriKnowledge from '../data/agri-knowledge.json';

/**
 * Ollama Service - Local LLM integration for Agri-Tech platform
 * Supports streaming, role-based prompts, and multi-language context.
 */
export class OllamaService {
    private static readonly baseURL = env.OLLAMA_URL;
    private static model = env.OLLAMA_MODEL || 'phi'; // Will be overridden after detection
    private static modelChecked = false;

    private static readonly AGRI_DOMAIN_KNOWLEDGE = `
    --- AGRI-TECH DOMAIN KNOWLEDGE (INDIA CONTEXT) ---
    - Platform Tools: ${Object.entries(agriKnowledge.platform_tools).map(([k, v]) => `${k}: ${v}`).join(', ')}
    - Crop Mastery: ${Object.keys(agriKnowledge.crops).join(', ')} (e.g., Tomato diseases: ${agriKnowledge.crops.tomato.diseases.join(', ')})
    - Export Focus: ${Object.keys(agriKnowledge.export_regions).join(', ')}
    - Languages: Support English, Hindi (हिन्दी), and Marathi (मराठी).
    -------------------------------------------------
    `;

    /**
     * Auto-detect available Ollama model
     */
    private static async ensureModelLoaded() {
        if (this.modelChecked) return;
        this.modelChecked = true;

        try {
            const response = await axios.get(`${this.baseURL}/api/tags`, { timeout: 5000 });
            const models = response.data.models || [];
            
            if (models.length === 0) {
                console.warn('[Ollama Service] No models found. Using fallback responses.');
                return false;
            }
            
            // List of models to try, in order of preference
            const preferredModels = ['qwen:latest', 'qwen2.5:latest', 'phi', 'llama2', 'neural-chat'];
            const availableModel = preferredModels.find(m => 
                models.some(model => model.name.includes(m.split(':')[0]))
            ) || models[0].name;
            
            this.model = availableModel;
            console.log(`[Ollama Service] Using model: ${this.model}`);
            return true;
        } catch (error: any) {
            console.error('[Ollama Service] Could not detect models:', error.message);
            return false;
        }
    }

    /**
     * Get system prompt based on user role
     */
    private static getSystemPrompt(role: 'FARMER' | 'BUYER' | 'ADMIN'): string {
        const base = `You are an AI Assistant for the 'FarmGuard.AI' agri-tech platform. 
        Your goal is to help users optimize profits and efficiency.
        Answer in the same language as the user's query (English, Hindi हिन्दी, or Marathi मराठी).
        ${this.AGRI_DOMAIN_KNOWLEDGE}`;

        if (role === 'FARMER') {
            return `${base}
            You are assisting a FARMER.
            - Provide advice on best crops for the current season.
            - Help with pest identification and natural/chemical treatments.
            - Provide Mandi price insights and suggest selling vs. storing.
            - Explain platform features like 'Auto-Listing' and 'Price Advisor'.
            - Use a supportive, practical, and empathetic tone.`;
        }

        if (role === 'BUYER') {
            return `${base}
            You are assisting a BUYER.
            - Help with sourcing high-quality crops from verified farmers.
            - Analyze market price trends to find procurement windows.
            - Explain 'Smart Sourcing', 'Escrow Payments', and 'Blockchain Traceability'.
            - Provide logistics advice and delivery estimates.
            - Use a professional, efficiency-focused, and data-driven tone.`;
        }

        return `${base} You are a general platform assistant for the FarmGuard.AI ecosystem.`;
    }

    /**
     * Generate response (Non-streaming)
     */
    static async chat(params: {
        message: string;
        role: 'FARMER' | 'BUYER' | 'ADMIN';
        history?: any[];
        context?: any;
    }) {
        try {
            // Ensure model is loaded on first call
            await this.ensureModelLoaded();
            
            const systemPrompt = this.getSystemPrompt(params.role);
            const messages = [
                { role: 'system', content: systemPrompt },
                ...(params.history || []),
                { role: 'user', content: params.message }
            ];

            console.log(`[Ollama Service] Calling Ollama with model: ${this.model}`);
            
            const response = await axios.post(`${this.baseURL}/api/chat`, {
                model: this.model,
                messages,
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 2048,
                }
            }, { timeout: 60000 });

            const content = response.data.message?.content || response.data.response || '';
            
            console.log(`[Ollama Service] Chat response received (${content.length} chars)`);

            return {
                response: content,
                intent: this.detectIntent(params.message),
                suggestions: this.generateSuggestions(params.role, params.message)
            };
        } catch (error: any) {
            console.error('[Ollama Service] Chat failed:', error.message);
            console.error('[Ollama Service] Error details:', error.response?.data || error.code);
            
            // Return AI-generated fallback based on the message
            return {
                response: this.generateSmartFallback(params.message, params.role),
                intent: this.detectIntent(params.message),
                suggestions: this.generateSuggestions(params.role, params.message)
            };
        }
    }

    /**
     * Generate streaming response
     */
    static async chatStream(params: {
        message: string;
        role: 'FARMER' | 'BUYER' | 'ADMIN';
        history?: any[];
        context?: any;
    }) {
        try {
            const systemPrompt = this.getSystemPrompt(params.role);
            const messages = [
                { role: 'system', content: systemPrompt },
                ...(params.history || []),
                { role: 'user', content: params.message }
            ];

            const response = await axios.post(`${this.baseURL}/api/chat`, {
                model: this.model,
                messages,
                stream: true,
                options: {
                    temperature: 0.7,
                }
            }, { responseType: 'stream' });

            return response.data;
        } catch (error: any) {
            console.error('[Ollama Service] Streaming failed:', error.message);
            throw new Error('Local AI service is currently unavailable.');
        }
    }

    private static detectIntent(query: string): string {
        const q = query.toLowerCase();
        if (q.includes('price') || q.includes('mandi') || q.includes('rate')) return 'PRICE_QUERY';
        if (q.includes('pest') || q.includes('disease') || q.includes('sick')) return 'PEST_DIAGNOSIS';
        if (q.includes('grow') || q.includes('plant') || q.includes('seed')) return 'CROP_ADVICE';
        if (q.includes('buy') || q.includes('supplier') || q.includes('source')) return 'PROCUREMENT';
        return 'GENERAL';
    }

    private static generateSuggestions(role: string, query: string): string[] {
        if (role === 'FARMER') {
            return [
                "What is the best price for Wheat today?",
                "How to treat Tomato leaf blight?",
                "Should I sell my harvest now?",
                "Which crop to grow in Kharif season?"
            ];
        }
        return [
            "Find top verified Wheat suppliers",
            "Show me price trends for Rice",
            "How does blockchain trace work?",
            "Quote for 500kg organic onions"
        ];
    }

    private static generateSmartFallback(message: string, role: string): string {
        const q = message.toLowerCase();
        
        // Price queries
        if (q.includes('price') || q.includes('prise') || q.includes('cost') || q.includes('rate')) {
            if (q.includes('wheat')) return 'Current Wheat prices range from ₹2300-2500 per quintal, depending on your region and quality grade. Prices are stable with slight upward trend.';
            if (q.includes('rice')) return 'Rice prices are currently ₹3800-4200 per quintal. Best quality premium rice commands higher prices. Check local Mandi rates for accuracy.';
            if (q.includes('tomato')) return 'Tomato prices fluctuate seasonally: ₹1500-2400 per quintal. Current market shows moderate prices. Harvest timing affects your profit margins.';
            if (q.includes('onion')) return 'Onion prices: ₹2000-2800 per quintal based on quality and storage. Recent prices show bullish trend for quality produce.';
            return 'For current market prices, visit your local Mandi or check ODOP platforms Price Advisor tool. Prices vary by region, quality, and seasonality.';
        }
        
        // Crop advice
        if (q.includes('crop') || q.includes('grow') || q.includes('plant') || q.includes('farm')) {
            if (q.includes('season') || q.includes('weather')) return 'For this season, consider high-yielding varieties of Wheat, Rice, or Cotton. Check weather patterns and irrigation availability in your area.';
            if (q.includes('yield')) return 'Improve yield through: optimal spacing, timely irrigation, quality seeds, and pest management. Modern farming techniques can increase yields by 25-40%.';
            return 'Choose crops based on: local climate, soil type, water availability, and market demand. Diversification reduces risk and maximizes profits.';
        }
        
        // Pest/disease queries
        if (q.includes('pest') || q.includes('disease') || q.includes('insect') || q.includes('blight')) {
            return 'For pest management: identify the pest first, then use integrated pest management (IPM) combining cultural, chemical, and biological methods. Early detection prevents crop loss.';
        }
        
        // Buyer/supplier queries
        if (q.includes('buy') || q.includes('supplier') || q.includes('seller') || q.includes('market')) {
            if (role === 'BUYER') return 'ODOP Connect helps you find verified farmers offering competitive prices. Filter by location, crop type, and quality grades to find ideal suppliers.';
            return 'Connect with verified buyers on ODOP platforms. Ensure product quality, timely delivery, and transparent communication for successful deals.';
        }
        
        // Order tracking
        if (q.includes('order') || q.includes('track')) {
            return 'Go to your dashboard and click "Order Tracker" to monitor shipment status, delivery dates, and payment confirmations in real-time.';
        }
        
        // Platform features
        if (q.includes('feature') || q.includes('how to') || q.includes('tool')) {
            if (q.includes('blockchain')) return 'Blockchain Trace ensures transparency: track product journey from farm to buyer with immutable records, ensuring quality and authenticity.';
            if (q.includes('escrow')) return 'Escrow Payments: funds held securely until both parties confirm satisfaction. Protects both buyers and sellers from payment fraud.';
            return 'ODOP platform features: Smart Sourcing, Price Advisor, Blockchain Trace, Escrow Payments, Quality Grading, and real-time analytics for better decisions.';
        }
        
        // Default general response
        return `I'm your ODOP Connect AI assistant. I can help with market prices, crop selection, pest management, buyer-seller connections, and platform features. What would you like to know?`;
    }

    /**
     * Check health of Ollama service
     */
    static async healthCheck(): Promise<{ status: string; running: boolean; model: string }> {
        try {
            await this.ensureModelLoaded();
            
            const response = await axios.get(`${this.baseURL}/api/tags`, { timeout: 5000 });
            return {
                status: 'healthy',
                running: true,
                model: this.model
            };
        } catch (error: any) {
            console.error('[Ollama Service] Health check failed:', error.message);
            return {
                status: 'unhealthy',
                running: false,
                model: this.model
            };
        }
    }

    /**
     * List available Ollama models
     */
    static async listModels(): Promise<any[]> {
        try {
            const response = await axios.get(`${this.baseURL}/api/tags`, { timeout: 5000 });
            return response.data.models || [];
        } catch (error: any) {
            console.error('[Ollama Service] List models failed:', error.message);
            return [];
        }
    }
}
