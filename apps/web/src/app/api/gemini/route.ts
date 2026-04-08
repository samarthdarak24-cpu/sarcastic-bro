import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, agentType, chatHistory } = body;

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'No Gemini API key configured' }, { status: 500 });
    }

    // Agent-specific system prompts
    const SYSTEM_PROMPTS: Record<string, string> = {
      crop_advisor: `You are an expert Crop Advisor AI for Indian farmers. Provide detailed advice on crop cultivation, sowing times, irrigation, seed varieties (Indian), yield optimization, organic farming, and crop rotation. Use emojis and **bold** formatting. Give specific numbers and practical tips.`,
      market_analyst: `You are an Agricultural Market Analyst AI for Indian farmers. Provide current-style mandi price analysis, price trends, best selling times, export opportunities, MSP rates, and e-NAM guidance. Use price ranges in INR (₹). Include trend indicators.`,
      pest_expert: `You are a Pest and Disease Management AI for Indian crops. Help with pest identification, disease diagnosis, IPM strategies, organic and chemical controls, biocontrol agents, and dosage recommendations. Always suggest IPM approach.`,
      soil_scientist: `You are a Soil Scientist AI for Indian agriculture. Help with soil health, testing interpretation, fertilizer recommendations (NPK, micronutrients), organic amendments, pH management, and Soil Health Card guidance.`,
      general_advisor: `You are a comprehensive Agricultural Advisor AI for Indian farmers. Cover government schemes (PM-KISAN, PMFBY, KCC), subsidies, weather advisories, farm mechanization, organic certification, and agricultural insurance.`,
      default: `You are AgriMaster AI, a super advanced agricultural intelligence assistant for Indian farmers. You can answer ANY question about agriculture, farming, crops, markets, pests, soil, weather, government schemes, and more. Provide detailed, practical advice.`
    };

    const systemPrompt = SYSTEM_PROMPTS[agentType] || SYSTEM_PROMPTS.default;

    // Build conversation contents
    const contents = [
      { role: 'user', parts: [{ text: `Instructions: ${systemPrompt}\n\nAcknowledge and be ready to help.` }] },
      { role: 'model', parts: [{ text: 'I am ready to help! Ask me anything about agriculture and farming. I will provide detailed, practical advice.' }] },
    ];

    // Add chat history for context
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory.slice(-8)) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add current message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1500,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return NextResponse.json({ 
        error: `Gemini API error: ${response.status}`,
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      response: text,
      model: 'gemini-2.0-flash'
    });

  } catch (error: any) {
    console.error('Gemini route error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
