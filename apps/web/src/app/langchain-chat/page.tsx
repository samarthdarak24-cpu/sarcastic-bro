'use client';

import React from 'react';
import LangChainChat from '@/components/ui/LangChainChat/LangChainChat';
import { Bot, Brain, BookOpen, Zap, Users, Shield } from 'lucide-react';

const LangChainChatPage = () => {
  // Mock user ID - in real app, get from auth
  const userId = 'demo-user-123';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Bot className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">AgriChat AI Assistant</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced agricultural AI powered by LangChain with RAG (Retrieval Augmented Generation). 
            Get expert farming advice backed by comprehensive agricultural knowledge.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold">Smart RAG System</h3>
            </div>
            <p className="text-gray-600">
              Retrieval Augmented Generation provides accurate answers based on comprehensive agricultural knowledge base.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <BookOpen className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-semibold">Knowledge Base</h3>
            </div>
            <p className="text-gray-600">
              Extensive database covering crop management, soil health, pest control, and sustainable farming practices.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="w-8 h-8 text-purple-600" />
              <h3 className="text-lg font-semibold">Real-time Streaming</h3>
            </div>
            <p className="text-gray-600">
              Get instant responses with streaming capabilities for a smooth conversational experience.
            </p>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Chat Component */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden" style={{ height: '600px' }}>
              <LangChainChat userId={userId} className="h-full" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Topics */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Popular Topics
              </h3>
              <div className="space-y-2">
                {[
                  'Crop Rotation Benefits',
                  'Soil pH Management',
                  'Pest Control Methods',
                  'Organic Fertilizers',
                  'Water Management',
                  'Market Pricing'
                ].map((topic, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                    {topic}
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                AI Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Context Awareness</div>
                    <div className="text-xs text-gray-600">Remembers conversation history</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Source Citations</div>
                    <div className="text-xs text-gray-600">Shows knowledge sources</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Smart Suggestions</div>
                    <div className="text-xs text-gray-600">Contextual follow-up questions</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Multi-Model Support</div>
                    <div className="text-xs text-gray-600">Ollama, OpenAI, and more</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Questions */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Try These Questions</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-green-50 text-green-800 px-3 py-2 rounded cursor-pointer hover:bg-green-100 transition-colors">
                  "How do I improve my soil health naturally?"
                </div>
                <div className="bg-blue-50 text-blue-800 px-3 py-2 rounded cursor-pointer hover:bg-blue-100 transition-colors">
                  "What's the best crop rotation for corn?"
                </div>
                <div className="bg-purple-50 text-purple-800 px-3 py-2 rounded cursor-pointer hover:bg-purple-100 transition-colors">
                  "How do I identify and treat plant diseases?"
                </div>
                <div className="bg-yellow-50 text-yellow-800 px-3 py-2 rounded cursor-pointer hover:bg-yellow-100 transition-colors">
                  "When should I harvest my tomatoes?"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Technical Implementation</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Backend Technologies</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• LangChain for AI orchestration</li>
                <li>• FAISS/ChromaDB for vector storage</li>
                <li>• Ollama for local LLM inference</li>
                <li>• FastAPI for REST endpoints</li>
                <li>• Streaming responses with SSE</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Frontend Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React with TypeScript</li>
                <li>• Real-time streaming UI</li>
                <li>• Conversation memory</li>
                <li>• Source attribution display</li>
                <li>• Smart suggestion system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LangChainChatPage;