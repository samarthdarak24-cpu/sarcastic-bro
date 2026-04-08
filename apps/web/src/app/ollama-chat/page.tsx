'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Cpu, Wifi, WifiOff, Download, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import OllamaChat from '@/components/ui/OllamaChat/OllamaChat';
import { ollamaChatService, UserContext } from '@/services/ollamaChatService';

export default function OllamaChatPage() {
  const [isOllamaAvailable, setIsOllamaAvailable] = useState<boolean | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check Ollama health
      const healthResult = await ollamaChatService.checkHealth();
      
      if (healthResult.success && healthResult.data) {
        setIsOllamaAvailable(healthResult.data.ollama_available);
        setAvailableModels(healthResult.data.available_models || []);
        
        if (healthResult.data.ollama_available) {
          // Initialize user context
          const context = ollamaChatService.getUserContext();
          setUserContext(context);
          setShowChat(true);
        }
      } else {
        setIsOllamaAvailable(false);
        setError(healthResult.error || 'Failed to check Ollama status');
      }
    } catch (error: any) {
      console.error('Initialization error:', error);
      setIsOllamaAvailable(false);
      setError('Failed to initialize Ollama chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    initializePage();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-green-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Initializing AI Chat</h2>
          <p className="text-gray-600">Checking Ollama service status...</p>
        </div>
      </div>
    );
  }

  if (!isOllamaAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Bot className="w-12 h-12 text-green-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">AgriConnect AI</h1>
            </div>
            <p className="text-xl text-gray-600">Local AI-Powered Agricultural Assistant</p>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3">
                <WifiOff className="w-8 h-8 text-red-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Ollama Not Available</h2>
                  <p className="text-gray-600">Local AI service is not running</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mr-4"
              >
                Retry Connection
              </button>
              <a
                href="#setup-instructions"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                Setup Instructions
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>

          {/* Setup Instructions */}
          <div id="setup-instructions" className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Download className="w-6 h-6 mr-2 text-blue-600" />
              Setup Ollama AI
            </h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Install Ollama</h3>
                  <p className="text-gray-600 mb-3">
                    Download and install Ollama from the official website:
                  </p>
                  <a
                    href="https://ollama.com/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Download Ollama
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Download AI Model</h3>
                  <p className="text-gray-600 mb-3">
                    After installing Ollama, download the LLaMA 3.2 model:
                  </p>
                  <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm">
                    ollama pull llama3.2
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Installation</h3>
                  <p className="text-gray-600 mb-3">
                    Check if Ollama is running properly:
                  </p>
                  <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm">
                    ollama list
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Chatting</h3>
                  <p className="text-gray-600">
                    Once Ollama is running, refresh this page to start using the AI assistant!
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Use Local AI?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">100% Free - No API costs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Complete Privacy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Works Offline</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Fast Responses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showChat && userContext) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Bot className="w-10 h-10 text-green-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">AgriConnect AI</h1>
              <div className="flex items-center ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <Wifi className="w-4 h-4 mr-1" />
                Connected
              </div>
            </div>
            <p className="text-gray-600">
              Local AI-powered agricultural assistant • {availableModels.length} models available
            </p>
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-xl shadow-lg" style={{ height: 'calc(100vh - 200px)' }}>
            <OllamaChat
              userContext={userContext}
              className="h-full"
            />
          </div>

          {/* Footer Info */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Cpu className="w-4 h-4 mr-1" />
                Local Processing
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                Privacy Protected
              </div>
              <div className="flex items-center">
                <Bot className="w-4 h-4 mr-1" />
                {availableModels[0] || 'llama3.2'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}