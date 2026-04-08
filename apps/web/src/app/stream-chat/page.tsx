'use client';

import React from 'react';
import StreamAIChat from '@/components/ui/StreamAIChat/StreamAIChat';
import { Bot, Zap, Users, Brain, Shield, Globe } from 'lucide-react';

const StreamChatPage = () => {
  // Mock user data - in real app, get from auth
  const userId = 'farmer_demo_123';
  const userName = 'Demo Farmer';
  const userRole = 'farmer';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Bot className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">AgriChat AI Agents</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced AI-powered chat with specialized agricultural agents using GetStream. 
            Get expert advice from multiple AI specialists in real-time.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="w-8 h-8 text-yellow-600" />
              <h3 className="text-lg font-semibold">Real-time Messaging</h3>
            </div>
            <p className="text-gray-600">
              Powered by GetStream for instant, reliable messaging with AI agents and other users.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold">Multiple AI Agents</h3>
            </div>
            <p className="text-gray-600">
              Choose from specialized agents: Crop Advisor, Market Analyst, Pest Expert, Soil Scientist, and more.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Brain className="w-8 h-8 text-purple-600" />
              <h3 className="text-lg font-semibold">Smart Knowledge Base</h3>
            </div>
            <p className="text-gray-600">
              AI agents access comprehensive agricultural knowledge for accurate, contextual responses.
            </p>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden" style={{ height: '700px' }}>
          <StreamAIChat 
            userId={userId}
            userName={userName}
            userRole={userRole}
            className="h-full"
          />
        </div>

        {/* Agent Types Info */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Available AI Agricultural Experts
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Crop Advisor',
                description: 'Expert in crop selection, planting schedules, and cultivation techniques',
                specialties: ['Crop Selection', 'Planting Time', 'Cultivation', 'Yield Optimization']
              },
              {
                name: 'Market Analyst',
                description: 'Specialist in agricultural market trends, pricing, and selling strategies',
                specialties: ['Price Analysis', 'Market Trends', 'Demand Forecast', 'Selling Strategy']
              },
              {
                name: 'Pest & Disease Expert',
                description: 'Expert in pest identification, disease diagnosis, and treatment options',
                specialties: ['Pest ID', 'Disease Diagnosis', 'IPM Strategies', 'Treatment Plans']
              },
              {
                name: 'Soil Scientist',
                description: 'Specialist in soil health, fertility management, and nutrient planning',
                specialties: ['Soil Testing', 'Fertility Management', 'Nutrient Planning', 'Soil Health']
              },
              {
                name: 'General Advisor',
                description: 'All-round agricultural consultant for general farming questions',
                specialties: ['General Farming', 'Best Practices', 'Problem Solving', 'Resource Guidance']
              }
            ].map((agent, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">{agent.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
                <div className="flex flex-wrap gap-1">
                  {agent.specialties.map((specialty, idx) => (
                    <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Features */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Technical Features
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Backend Technologies</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• GetStream Chat for real-time messaging</li>
                <li>• OpenAI GPT-4 for intelligent responses</li>
                <li>• FastAPI for high-performance backend</li>
                <li>• Agricultural knowledge base integration</li>
                <li>• Automatic agent lifecycle management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Frontend Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React with Stream Chat React components</li>
                <li>• Real-time agent status indicators</li>
                <li>• Beautiful, responsive chat interface</li>
                <li>• Agent specialization display</li>
                <li>• Source attribution for AI responses</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">How to Use AgriChat AI Agents</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Getting Started</h4>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Choose an AI agent from the sidebar</li>
                <li>2. Click "Start" to activate the agent</li>
                <li>3. Ask your agricultural questions in the chat</li>
                <li>4. Get expert responses with source citations</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Best Practices</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Be specific about your crops and location</li>
                <li>• Use multiple agents for comprehensive advice</li>
                <li>• Ask follow-up questions for detailed guidance</li>
                <li>• Stop agents when done to free resources</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamChatPage;