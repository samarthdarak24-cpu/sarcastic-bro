"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mic, MicOff, Settings, Download, Trash2, Brain, Sparkles, MessageCircle, User, Bot, Loader2, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sentiment?: {
    polarity: number;
    subjectivity: number;
    confidence: number;
  };
  entities?: Array<{
    text: string;
    label: string;
    description: string;
  }>;
  mode?: string;
  domains?: string[];
}

interface UserProfile {
  name?: string;
  role?: string;
  expertise_areas: string[];
  preferred_style: string;
  language: string;
  timezone: string;
  interests: string[];
}

interface ConversationSummary {
  session_id: string;
  user_profile: UserProfile;
  conversation_stats: {
    message_count: number;
    duration: string;
    current_mode: string;
    active_domains: string[];
  };
  topics_discussed: string[];
  emotional_state: {
    polarity: number;
    subjectivity: number;
    confidence: number;
  };
  follow_up_questions: string[];
  created_at: string;
  last_activity: string;
}

interface AdvancedAIChatProps {
  userId?: string;
  initialProfile?: Partial<UserProfile>;
  onSessionCreate?: (sessionId: string) => void;
  onMessageSent?: (message: string) => void;
  onResponseReceived?: (response: string) => void;
  className?: string;
  theme?: 'light' | 'dark';
  showAnalytics?: boolean;
  enableVoice?: boolean;
  enableExport?: boolean;
}

const AdvancedAIChat: React.FC<AdvancedAIChatProps> = ({
  userId = 'anonymous',
  initialProfile,
  onSessionCreate,
  onMessageSent,
  onResponseReceived,
  className = '',
  theme = 'light',
  showAnalytics = true,
  enableVoice = true,
  enableExport = true
}) => {
  // State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    expertise_areas: [],
    preferred_style: 'conversational',
    language: 'en',
    timezone: 'UTC',
    interests: [],
    ...initialProfile
  });
  const [conversationSummary, setConversationSummary] = useState<ConversationSummary | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentMode, setCurrentMode] = useState('general');
  const [activeDomains, setActiveDomains] = useState<string[]>([]);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // API Base URL
  const API_BASE = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8001';

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/advanced-chat/session/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            user_profile: userProfile
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create session');
        }

        const data = await response.json();
        setSessionId(data.session_id);
        onSessionCreate?.(data.session_id);
      } catch (error) {
        console.error('Session initialization error:', error);
      }
    };

    initializeSession();
  }, [userId, userProfile, onSessionCreate, API_BASE]);

  // Send message
  const sendMessage = async (message: string, useStreaming: boolean = true) => {
    if (!message.trim() || !sessionId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setFollowUpQuestions([]);
    onMessageSent?.(message);

    const startTime = Date.now();

    try {
      if (useStreaming) {
        await handleStreamingResponse(message);
      } else {
        await handleRegularResponse(message);
      }
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your message. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setIsTyping(false);
      setResponseTime(Date.now() - startTime);
    }
  };

  // Handle streaming response
  const handleStreamingResponse = async (message: string) => {
    setIsStreaming(true);
    setIsTyping(true);

    const response = await fetch(`${API_BASE}/api/v1/advanced-chat/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
        user_profile: userProfile,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error('Streaming failed');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    let assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'content') {
                assistantMessage.content += data.content;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: assistantMessage.content }
                      : msg
                  )
                );
              } else if (data.type === 'completion') {
                setCurrentMode(data.conversation_mode);
                setActiveDomains(data.knowledge_domains);
                setFollowUpQuestions(data.follow_up_questions || []);
                setIsTyping(false);
                
                // Text-to-speech if enabled
                if (speechEnabled && assistantMessage.content) {
                  speakText(assistantMessage.content);
                }
                
                onResponseReceived?.(assistantMessage.content);
              }
            } catch (e) {
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  // Handle regular response
  const handleRegularResponse = async (message: string) => {
    const response = await fetch(`${API_BASE}/api/v1/advanced-chat/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
        user_profile: userProfile,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Chat request failed');
    }

    const data = await response.json();

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: data.response,
      timestamp: data.timestamp,
      sentiment: data.sentiment_analysis,
      entities: data.entities,
      mode: data.conversation_mode,
      domains: data.knowledge_domains
    };

    setMessages(prev => [...prev, assistantMessage]);
    setCurrentMode(data.conversation_mode);
    setActiveDomains(data.knowledge_domains);
    setFollowUpQuestions(data.follow_up_questions || []);

    // Text-to-speech if enabled
    if (speechEnabled && data.response) {
      speakText(data.response);
    }

    onResponseReceived?.(data.response);
  };

  // Voice recording
  const startRecording = async () => {
    if (!enableVoice) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudioToText(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Process audio to text (would integrate with Whisper API)
  const processAudioToText = async (audioBlob: Blob) => {
    try {
      // This would integrate with your Whisper service
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch(`${API_BASE}/api/v1/whisper/transcribe`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setInputMessage(data.text);
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Speech-to-text error:', error);
    }
  };

  // Text-to-speech
  const speakText = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Get conversation summary
  const getConversationSummary = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`${API_BASE}/api/v1/advanced-chat/session/${sessionId}/summary`);
      if (response.ok) {
        const summary = await response.json();
        setConversationSummary(summary);
      }
    } catch (error) {
      console.error('Summary error:', error);
    }
  };

  // Export conversation
  const exportConversation = async (format: 'json' | 'txt' = 'json') => {
    if (!sessionId || !enableExport) return;

    try {
      const response = await fetch(`${API_BASE}/api/v1/advanced-chat/session/${sessionId}/export?format=${format}`);
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversation-${sessionId}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  // Clear conversation
  const clearConversation = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`${API_BASE}/api/v1/advanced-chat/session/${sessionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessages([]);
        setFollowUpQuestions([]);
        setConversationSummary(null);
        // Create new session
        const newResponse = await fetch(`${API_BASE}/api/v1/advanced-chat/session/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, user_profile: userProfile })
        });
        
        if (newResponse.ok) {
          const data = await newResponse.json();
          setSessionId(data.session_id);
        }
      }
    } catch (error) {
      console.error('Clear conversation error:', error);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  // Render message
  const renderMessage = (message: Message) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 p-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
        <div
          className={`p-3 rounded-lg ${
            message.role === 'user'
              ? 'bg-blue-600 text-white ml-auto'
              : theme === 'dark'
              ? 'bg-gray-800 text-gray-100'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          
          {message.sentiment && showAnalytics && (
            <div className="mt-2 text-xs opacity-70">
              Sentiment: {message.sentiment.polarity > 0 ? '😊' : message.sentiment.polarity < 0 ? '😔' : '😐'}
              {message.mode && ` • Mode: ${message.mode}`}
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );

  return (
    <div className={`flex flex-col h-full ${className} ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold">Advanced AI Assistant</h2>
          </div>
          
          {showAnalytics && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {currentMode}
              </span>
              {activeDomains.length > 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {activeDomains[0]}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {enableVoice && (
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                speechEnabled ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              title={speechEnabled ? 'Disable speech' : 'Enable speech'}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          {enableExport && (
            <button
              onClick={() => exportConversation()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Export conversation"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={clearConversation}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Welcome to Advanced AI Chat</h3>
              <p className="text-gray-500 mb-4">I can help you with anything - just start typing!</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Ask a question', 'Get help with code', 'Brainstorm ideas', 'Learn something new'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputMessage(suggestion)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map(renderMessage)}
            {isTyping && (
              <div className="flex gap-3 p-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Follow-up questions */}
      {followUpQuestions.length > 0 && (
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="text-sm text-gray-500 mb-2">Suggested follow-ups:</div>
          <div className="flex flex-wrap gap-2">
            {followUpQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => sendMessage(question)}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className={`w-full p-3 pr-12 rounded-lg border resize-none ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={inputMessage.split('\n').length}
              disabled={isLoading}
            />
            
            {enableVoice && (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`absolute right-12 top-3 p-1 rounded transition-colors ${
                  isRecording
                    ? 'text-red-600 animate-pulse'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                disabled={isLoading}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          <button
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {showAnalytics && responseTime > 0 && (
          <div className="text-xs text-gray-500 mt-2">
            Response time: {responseTime}ms • Mode: {currentMode}
            {activeDomains.length > 0 && ` • Domains: ${activeDomains.join(', ')}`}
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} p-4`}
          >
            <h3 className="font-medium mb-3">Chat Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Response Style</label>
                <select
                  value={userProfile.preferred_style}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, preferred_style: e.target.value }))}
                  className={`w-full p-2 rounded border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="conversational">Conversational</option>
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                  <option value="technical">Technical</option>
                  <option value="concise">Concise</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={userProfile.language}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, language: e.target.value }))}
                  className={`w-full p-2 rounded border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Your Role</label>
              <input
                type="text"
                value={userProfile.role || ''}
                onChange={(e) => setUserProfile(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Developer, Farmer, Student"
                className={`w-full p-2 rounded border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedAIChat;