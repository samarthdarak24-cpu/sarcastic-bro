'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic, MicOff, Bot, User, Loader2, RefreshCw, Settings, X } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface UserContext {
  userId: string;
  role: 'FARMER' | 'BUYER';
  location: string;
  crops?: string[];
  language: string;
  sessionId: string;
}

interface OllamaChatProps {
  userContext: UserContext;
  onClose?: () => void;
  className?: string;
}

export default function OllamaChat({ userContext, onClose, className = '' }: OllamaChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [quickActions, setQuickActions] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('llama3.2');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  const socket = useSocket();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize chat
  useEffect(() => {
    initializeChat();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Socket.IO event listeners
  useEffect(() => {
    if (socket) {
      socket.on('ai-chat-chunk', handleSocketChunk);
      socket.on('ai-chat-response', handleSocketResponse);
      socket.on('conversation-cleared', handleConversationCleared);

      return () => {
        socket.off('ai-chat-chunk', handleSocketChunk);
        socket.off('ai-chat-response', handleSocketResponse);
        socket.off('conversation-cleared', handleConversationCleared);
      };
    }
  }, [socket]);

  const initializeChat = async () => {
    try {
      // Check Ollama health
      const healthResponse = await fetch('/ollama-chat/health');
      const healthData = await healthResponse.json();
      
      if (healthData.success && healthData.data.ollama_available) {
        setIsConnected(true);
        setError(null);
        
        // Get available models
        const modelsResponse = await fetch('/ollama-chat/models');
        const modelsData = await modelsResponse.json();
        if (modelsData.success) {
          setAvailableModels(modelsData.data.models || []);
        }
        
        // Get quick actions
        const actionsResponse = await fetch('/ollama-chat/quick-actions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const actionsData = await actionsResponse.json();
        if (actionsData.success) {
          setQuickActions(actionsData.data.quickActions || []);
        }
        
        // Add welcome message
        addWelcomeMessage();
        
      } else {
        setIsConnected(false);
        setError('Ollama AI service is not available. Please ensure Ollama is installed and running.');
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setIsConnected(false);
      setError('Failed to connect to AI service. Please check your connection.');
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: `welcome_${Date.now()}`,
      role: 'assistant',
      content: userContext.role === 'FARMER' 
        ? `नमस्ते! मैं आपका कृषि सहायक हूं। मैं आपकी फसल, बाजार की कीमतों, और खेती की तकनीकों के बारे में मदद कर सकता हूं। आप मुझसे कुछ भी पूछ सकते हैं!

Hello! I'm your agricultural assistant. I can help you with crops, market prices, and farming techniques. Feel free to ask me anything!`
        : `नमस्ते! मैं आपका खरीदारी सहायक हूं। मैं आपको विश्वसनीय आपूर्तिकर्ता खोजने, गुणवत्ता की जांच, और बाजार विश्लेषण में मदद कर सकता हूं।

Hello! I'm your procurement assistant. I can help you find reliable suppliers, quality verification, and market analysis.`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  };

  const handleSocketChunk = (data: any) => {
    if (data.sessionId === userContext.sessionId && data.type === 'content') {
      updateStreamingMessage(data.content);
    }
  };

  const handleSocketResponse = (data: any) => {
    if (data.sessionId === userContext.sessionId) {
      setSuggestions(data.suggestions || []);
      setIsLoading(false);
    }
  };

  const handleConversationCleared = (data: any) => {
    if (data.sessionId === userContext.sessionId) {
      setMessages([]);
      addWelcomeMessage();
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading || !isConnected) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Create streaming assistant message
    const assistantMessage: Message = {
      id: `assistant_${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      // Close any existing EventSource
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Create new EventSource for streaming
      const eventSource = new EventSource('/ollama-chat/stream', {
        // Note: EventSource doesn't support POST directly, so we'll use fetch with stream
      });

      // Use fetch with streaming instead
      const response = await fetch('/ollama-chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: message.trim(),
          context: userContext,
          conversationHistory: messages.slice(-10), // Last 10 messages
          model: selectedModel,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            if (data.trim()) {
              try {
                const parsedData = JSON.parse(data);
                handleStreamChunk(parsedData);
              } catch (e) {
                console.error('Failed to parse stream data:', e);
              }
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Send message error:', error);
      setError(error.message || 'Failed to send message');
      
      // Remove the streaming message on error
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamChunk = (data: any) => {
    switch (data.type) {
      case 'content':
        updateStreamingMessage(data.content);
        break;
        
      case 'done':
        finishStreamingMessage();
        break;
        
      case 'suggestions':
        setSuggestions(data.suggestions || []);
        break;
        
      case 'error':
        setError(data.message || 'AI service error');
        setIsLoading(false);
        break;
        
      case 'stream_end':
        setIsLoading(false);
        break;
    }
  };

  const updateStreamingMessage = (content: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.isStreaming) {
        return { ...msg, content: msg.content + content };
      }
      return msg;
    }));
  };

  const finishStreamingMessage = () => {
    setMessages(prev => prev.map(msg => {
      if (msg.isStreaming) {
        return { ...msg, isStreaming: false };
      }
      return msg;
    }));
    setIsLoading(false);
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const clearConversation = async () => {
    try {
      const response = await fetch(`/ollama-chat/conversation/${userContext.sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMessages([]);
        addWelcomeMessage();
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-8 h-8 text-green-600" />
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AgriConnect AI</h3>
            <p className="text-sm text-gray-600">
              {isConnected ? 'Connected • Local AI' : 'Disconnected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={clearConversation}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AI Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={initializeChat}
            className="text-sm text-red-600 hover:text-red-800 underline mt-1"
          >
            Retry connection
          </button>
        </div>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && messages.length <= 1 && (
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.slice(0, 4).map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white ml-2' 
                  : 'bg-green-500 text-white mr-2'
              }`}>
                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <div className={`px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
                  )}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-green-600" />
              <span className="text-sm text-gray-600">AI is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestion(suggestion)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Ask me anything about farming..." : "AI service unavailable"}
            disabled={!isConnected || isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || !isConnected || isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}