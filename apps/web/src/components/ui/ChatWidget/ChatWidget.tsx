'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatMessage, QuickAction } from '@/types/chat';
import { chatWidgetService, StreamChunk } from '@/services/chatWidgetService';
import FloatingButton from './FloatingButton';
import ChatPanel from './ChatPanel';

interface ChatWidgetProps {
  initialExpanded?: boolean;
  enableProactiveNotifications?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  zIndex?: number;
}

export default function ChatWidget({
  initialExpanded = false,
  position = 'bottom-right',
}: ChatWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [unreadCount] = useState(0);
  const [showSlowConnectionWarning, setShowSlowConnectionWarning] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorState, setErrorState] = useState<{type: string; message: string} | null>(null);
  
  const slowConnectionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkAuth = (): void => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleExpanded = (): void => {
    setIsExpanded(!isExpanded);
  };

  const handleSendMessage = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setShowSlowConnectionWarning(false);
    setStreamingMessage('');
    setErrorState(null);

    slowConnectionTimerRef.current = setTimeout(() => {
      setShowSlowConnectionWarning(true);
    }, 5000);

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) as Record<string, unknown> : null;

      const userContext = {
        userId: user?.id as string | undefined,
        name: user?.name as string | undefined,
        userType: user?.role as 'FARMER' | 'BUYER' | undefined,
        location: (user?.district || user?.state) as string | undefined,
        currentPage: typeof window !== 'undefined' ? window.location.pathname : undefined,
      };

      let fullResponse = '';
      let metadata: { intent?: string; confidence?: number; suggestions?: string[] } = {};
      let hasError = false;

      try {
        for await (const chunk of chatWidgetService.sendMessageStream({
          message: text,
          conversationHistory: messages,
          userContext,
        })) {
          if (chunk.type === 'metadata') {
            metadata = {
              intent: chunk.intent,
              confidence: chunk.confidence,
              suggestions: chunk.suggestions,
            };
          } else if (chunk.type === 'content') {
            fullResponse += chunk.content;
            setStreamingMessage(fullResponse);
          } else if (chunk.type === 'error') {
            hasError = true;
            console.warn('Stream error:', chunk.error, chunk.message);
            break;
          } else if (chunk.type === 'done') {
            break;
          }
        }
      } catch (streamError) {
        console.error('Stream exception:', streamError);
        hasError = true;
      }

      // Use fallback if no response or error occurred
      if (!fullResponse || hasError) {
        const fallback = chatWidgetService.getIntelligentFallback(text, userContext);
        fullResponse = fallback.response;
        metadata = {
          intent: fallback.intent,
          confidence: fallback.confidence,
          suggestions: fallback.suggestions,
        };
        setErrorState(null); // Clear error since fallback works
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
        metadata: {
          intent: metadata.intent,
          confidence: metadata.confidence,
          suggestions: metadata.suggestions,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      if (metadata.suggestions && metadata.suggestions.length > 0) {
        setQuickActions(metadata.suggestions.map((s, i) => ({
          id: `action-${i}`,
          label: s,
          query: s,
        })));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Always use fallback on error
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) as Record<string, unknown> : null;
      const userContext = {
        userId: user?.id as string | undefined,
        name: user?.name as string | undefined,
        userType: user?.role as 'FARMER' | 'BUYER' | undefined,
        location: (user?.district || user?.state) as string | undefined,
      };
      
      const fallback = chatWidgetService.getIntelligentFallback(text, userContext);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallback.response,
        timestamp: new Date(),
        metadata: {
          intent: fallback.intent,
          confidence: fallback.confidence,
          suggestions: fallback.suggestions,
        },
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      if (fallback.suggestions && fallback.suggestions.length > 0) {
        setQuickActions(fallback.suggestions.map((s, i) => ({
          id: `action-${i}`,
          label: s,
          query: s,
        })));
      }
    } finally {
      if (slowConnectionTimerRef.current) {
        clearTimeout(slowConnectionTimerRef.current);
      }
      setIsLoading(false);
      setShowSlowConnectionWarning(false);
      setStreamingMessage('');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <FloatingButton
        onClick={toggleExpanded}
        unreadCount={unreadCount}
        isExpanded={isExpanded}
        position={position}
      />
      {isExpanded && (
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          quickActions={quickActions}
          onSendMessage={handleSendMessage}
          onClose={toggleExpanded}
          userRole="FARMER"
          showSlowConnectionWarning={showSlowConnectionWarning}
          streamingMessage={streamingMessage}
          errorState={errorState}
        />
      )}
    </>
  );
}
