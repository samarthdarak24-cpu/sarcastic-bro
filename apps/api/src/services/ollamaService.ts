import axios from 'axios';
import { env } from '../config/env';
import agriKnowledge from '../data/agri-knowledge.json';

/**
 * Ollama Service - Local LLM integration for Agri-Tech platform
 * Supports streaming, role-based prompts, and multi-language context.
 */
export class OllamaService {
    private static readonly baseURL = env.OLLAMA_URL;
    private static readonly model = env.OLLAMA_MODEL;

    private static readonly AGRI_DOMAIN_KNOWLEDGE = `
    --- AGRI-TECH DOMAIN KNOWLEDGE (INDIA CONTEXT) ---
    - Platform Tools: ${Object.entries(agriKnowledge.platform_tools).map(([k, v]) => `${k}: ${v}`).join(', ')}
    - Crop Mastery: ${Object.keys(agriKnowledge.crops).join(', ')} (e.g., Tomato diseases: ${agriKnowledge.crops.tomato.diseases.join(', ')})
    - Export Focus: ${Object.keys(agriKnowledge.export_regions).join(', ')}
    - Languages: Support English, Hindi (हिन्दी), and Marathi (मराठी).
    -------------------------------------------------
    `;

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
            const systemPrompt = this.getSystemPrompt(params.role);
            const messages = [
                { role: 'system', content: systemPrompt },
                ...(params.history || []),
                { role: 'user', content: params.message }
            ];

            const response = await axios.post(`${this.baseURL}/api/chat`, {
                model: this.model,
                messages,
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 2048,
                }
            });

            return {
                response: response.data.message.content,
                intent: this.detectIntent(params.message),
                suggestions: this.generateSuggestions(params.role, params.message)
            };
        } catch (error: any) {
            console.error('[Ollama Service] Chat failed:', error.message);
            throw new Error('Local AI service is currently unavailable.');
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
}
