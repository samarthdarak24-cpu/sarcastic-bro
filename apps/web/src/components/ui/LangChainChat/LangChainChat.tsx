'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCw, BookOpen, Lightbulb } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{ source: string; category?: string }>;
}

interface LangChainChatProps {
  userId: string;
  className?: string;
}

const LangChainChat: React.FC<LangChainChatProps> = ({ userId, className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize session
    createSession();
    loadSuggestions();
  }, []);

  const createSession = async () => {
    try {
      const response = await fetch('/api/ai/simple-langchain-chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessionId(data.session_id);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const loadSuggestions = async (context: string = 'general') => {
    try {
      const response = await fetch(`/api/ai/simple-langchain-chat/suggestions?context=${context}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const message = messageText || input.trim();
    if (!message || !sessionId) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/simple-langchain-chat/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          user_id: userId,
          user_context: {
            platform: 'agricultural_marketplace',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: data.timestamp,
          sources: data.sources
        };

        setMessages(prev => [...prev, assistantMessage]);
        setSuggestions(data.suggestions || []);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const streamMessage = async (messageText?: string) => {
    const message = messageText || input.trim();
    if (!message || !sessionId) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    // Add placeholder for streaming response
    const streamingMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, streamingMessage]);

    try {
      const response = await fetch('/api/ai/simple-langchain-chat/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          user_id: userId,
          stream: true
        })
      });

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'assistant') {
                      lastMessage.content += data.content;
                    }
                    return newMessages;
                  });
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  const clearChat = async () => {
    if (sessionId) {
      try {
        await fetch(`/api/ai/simple-langchain-chat/session/${sessionId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Failed to clear session:', error);
      }
    }
    setMessages([]);
    createSession();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">AgriChat AI Assistant</h3>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Clear chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <p className="text-lg font-medium mb-2">Welcome to AgriChat AI!</p>
            <p className="text-sm">Ask me anything about farming, crops, soil management, or agricultural best practices.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <Bot className="w-5 h-5 mt-0.5 text-green-600" />
                )}
                {message.role === 'user' && (
                  <User className="w-5 h-5 mt-0.5 text-white" />
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <BookOpen className="w-3 h-3" />
                        <span>Sources:</span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {message.sources.map((source, idx) => (
                          <div key={idx} className="text-xs text-gray-500">
                            {source.category && (
                              <span className="bg-gray-200 px-1 py-0.5 rounded text-xs mr-1">
                                {source.category}
                              </span>
                            )}
                            {source.source}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {(isLoading || isStreaming) && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-green-600" />
                <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                <span className="text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && messages.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center space-x-1 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">Suggestions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => sendMessage(suggestion)}
                className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full hover:bg-green-100 transition-colors"
                disabled={isLoading || isStreaming}
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
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about farming, crops, soil management, or any agricultural topic..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={2}
            disabled={isLoading || isStreaming}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading || isStreaming}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-2 flex space-x-2">
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading || isStreaming}
            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
          >
            Send
          </button>
          <button
            onClick={() => streamMessage()}
            disabled={!input.trim() || isLoading || isStreaming}
            className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded hover:bg-purple-100 transition-colors"
          >
            Stream Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default LangChainChat;